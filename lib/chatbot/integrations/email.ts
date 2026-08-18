import type { LeadRecord } from "../database";
import { buildClientEmail, buildTeamEmail } from "./email-templates";
import { sendResendEmail } from "./resend-client";

export async function sendClientConfirmation(lead: LeadRecord) {
  const from = process.env.CHATBOT_EMAIL_FROM;
  if (!from) throw new Error("CHATBOT_EMAIL_FROM is not configured.");
  const content = buildClientEmail(lead);
  await sendResendEmail({
    from,
    to: lead.answers.email,
    subject: "We received your SalonVault inquiry",
    html: content.html,
    text: content.text,
    idempotencyKey: `lead-${lead.id}-client-v2`,
  });
}

export async function sendTeamNotification(lead: LeadRecord) {
  const from = process.env.CHATBOT_EMAIL_FROM;
  const to = process.env.CHATBOT_TEAM_EMAIL;
  if (!from || !to) throw new Error("The internal lead email is not configured.");
  const content = buildTeamEmail(lead);
  await sendResendEmail({
    from,
    to,
    replyTo: lead.answers.email,
    subject: `New ${lead.qualification === "qualified" ? "qualified " : ""}lead: ${lead.answers.name}`,
    html: content.html,
    text: content.text,
    idempotencyKey: `lead-${lead.id}-team-v2`,
  });
}
