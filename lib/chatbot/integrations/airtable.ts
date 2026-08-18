import { chatbotConfig } from "../config";
import type { LeadRecord } from "../database";

export async function syncLeadToAirtable(lead: LeadRecord) {
  const token = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME || "Leads";

  if (!token || !baseId) throw new Error("Airtable is not configured.");

  const fields: Record<string, string> = {
    "Lead ID": lead.id,
    Status: lead.qualification === "qualified" ? "Qualified" : "Needs review",
    Summary: lead.summary,
  };

  for (const question of chatbotConfig.questions) {
    const value = lead.answers[question.id];
    if (value) fields[question.airtableField] = value;
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        performUpsert: { fieldsToMergeOn: ["Lead ID"] },
        records: [{ fields }],
        typecast: true,
      }),
      signal: AbortSignal.timeout(12_000),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Airtable request failed (${response.status}): ${body.slice(0, 180)}`);
  }
}

