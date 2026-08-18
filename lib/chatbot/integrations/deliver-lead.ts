import { type LeadRecord, updateDeliveryStatus } from "../database";
import { syncLeadToAirtable } from "./airtable";
import { sendClientConfirmation, sendTeamNotification } from "./email";

function safeErrorMessage(error: unknown) {
  return (error instanceof Error ? error.message : "Unknown integration error").slice(0, 500);
}

async function runDelivery(
  lead: LeadRecord,
  channel: "airtable" | "clientEmail" | "teamEmail",
  task: () => Promise<void>,
) {
  try {
    await task();
    await updateDeliveryStatus(lead.id, channel, "sent");
  } catch (error) {
    console.error(`Chatbot ${channel} delivery failed`, {
      leadId: lead.id,
      message: safeErrorMessage(error),
    });
    await updateDeliveryStatus(lead.id, channel, "failed", safeErrorMessage(error));
  }
}

export async function deliverLead(lead: LeadRecord) {
  const deliveries: Promise<void>[] = [];

  if (lead.airtableStatus !== "sent") {
    deliveries.push(runDelivery(lead, "airtable", () => syncLeadToAirtable(lead)));
  }
  if (lead.clientEmailStatus !== "sent") {
    deliveries.push(runDelivery(lead, "clientEmail", () => sendClientConfirmation(lead)));
  }
  if (lead.teamEmailStatus !== "sent") {
    deliveries.push(runDelivery(lead, "teamEmail", () => sendTeamNotification(lead)));
  }

  await Promise.all(deliveries);
}
