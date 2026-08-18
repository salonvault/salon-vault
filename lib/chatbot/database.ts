import { createHash } from "node:crypto";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { LeadAnswers } from "./types";

type Database = NeonQueryFunction<false, false>;
type DatabaseRow = Record<string, unknown>;
let database: Database | null = null;

function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  database ??= neon(connectionString);
  return database;
}

function asIsoDate(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return new Date(String(value)).toISOString();
}

function contactFingerprint(email: string, phone: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.replace(/\D/g, "");
  return createHash("sha256").update(`${normalizedEmail}:${normalizedPhone}`).digest("hex");
}

export type LeadRecord = {
  id: string;
  sessionId: string | null;
  answers: LeadAnswers;
  summary: string;
  qualification: "qualified" | "needs_review";
  source: Record<string, string>;
  airtableStatus: "pending" | "sent" | "failed";
  clientEmailStatus: "pending" | "sent" | "failed";
  teamEmailStatus: "pending" | "sent" | "failed";
  createdAt: string;
};

function mapLead(row: DatabaseRow): LeadRecord {
  return {
    id: String(row.id),
    sessionId: row.session_id ? String(row.session_id) : null,
    answers: (row.answers || {}) as LeadAnswers,
    summary: String(row.summary || ""),
    qualification: row.qualification as LeadRecord["qualification"],
    source: (row.source || {}) as Record<string, string>,
    airtableStatus: row.airtable_status as LeadRecord["airtableStatus"],
    clientEmailStatus: row.client_email_status as LeadRecord["clientEmailStatus"],
    teamEmailStatus: row.team_email_status as LeadRecord["teamEmailStatus"],
    createdAt: asIsoDate(row.created_at),
  };
}

export async function createLeadOnce({ id, answers, summary, source }: { id: string; answers: LeadAnswers; summary: string; source: Record<string, string> }) {
  const sql = getDatabase();
  const fingerprint = contactFingerprint(answers.email, answers.phone);
  const qualification = answers.service === "Other" || answers.service === "Not sure" ? "needs_review" : "qualified";

  const prior = (await sql.query(
    `SELECT * FROM chatbot_leads
     WHERE id = $1 OR contact_fingerprint = $2
        OR (LOWER(email) = LOWER($3) AND regexp_replace(phone, '[^0-9]', '', 'g') = $4)
     ORDER BY CASE WHEN id = $1 THEN 0 ELSE 1 END
     LIMIT 1`,
    [id, fingerprint, answers.email, answers.phone.replace(/\D/g, "")],
  )) as DatabaseRow[];
  if (prior[0]) {
    const lead = mapLead(prior[0]);
    return { lead, duplicate: lead.id !== id };
  }

  const inserted = (await sql.query(
    `INSERT INTO chatbot_leads (id, session_id, contact_fingerprint, name, email, phone, service, answers, summary, qualification, source)
     VALUES ($1, NULL, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10::jsonb)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [id, fingerprint, answers.name, answers.email.toLowerCase(), answers.phone, answers.service, JSON.stringify(answers), summary, qualification, JSON.stringify(source)],
  )) as DatabaseRow[];

  if (inserted[0]) return { lead: mapLead(inserted[0]), duplicate: false };

  const existing = (await sql.query(
    `SELECT * FROM chatbot_leads
     WHERE id = $1 OR contact_fingerprint = $2
        OR (LOWER(email) = LOWER($3) AND regexp_replace(phone, '[^0-9]', '', 'g') = $4)
     ORDER BY CASE WHEN id = $1 THEN 0 ELSE 1 END
     LIMIT 1`,
    [id, fingerprint, answers.email, answers.phone.replace(/\D/g, "")],
  )) as DatabaseRow[];
  if (!existing[0]) throw new Error("Unable to create or locate the lead.");
  const lead = mapLead(existing[0]);
  return { lead, duplicate: lead.id !== id };
}

type DeliveryColumn = "airtable_status" | "client_email_status" | "team_email_status";
const deliveryColumns: Record<string, DeliveryColumn> = { airtable: "airtable_status", clientEmail: "client_email_status", teamEmail: "team_email_status" };

export async function updateDeliveryStatus(leadId: string, channel: keyof typeof deliveryColumns, status: "sent" | "failed", error?: string) {
  const sql = getDatabase();
  const column = deliveryColumns[channel];
  await sql.query(
    `UPDATE chatbot_leads SET ${column} = $2,
       integration_errors = CASE WHEN $3::text IS NULL THEN integration_errors - $4 ELSE jsonb_set(integration_errors, ARRAY[$4], to_jsonb($3::text), true) END,
       updated_at = NOW() WHERE id = $1`,
    [leadId, status, error || null, channel],
  );
}
