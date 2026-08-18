import { after, NextRequest, NextResponse } from "next/server";
import { chatbotConfig } from "@/lib/chatbot/config";
import { createLeadOnce } from "@/lib/chatbot/database";
import { deliverLead } from "@/lib/chatbot/integrations/deliver-lead";
import { hasAllRequiredAnswers } from "@/lib/chatbot/qualification";
import { leadSubmissionSchema, normalizeLeadAnswers } from "@/lib/chatbot/schemas";
import { hasValidJsonRequest } from "@/lib/chatbot/security";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  if (!hasValidJsonRequest(request)) return NextResponse.json({ error: "Invalid lead request." }, { status: 400 });

  try {
    const parsed = leadSubmissionSchema.safeParse(await request.json());
    if (!parsed.success || parsed.data.website) return NextResponse.json({ error: "Please check your contact details." }, { status: 400 });
    const answers = normalizeLeadAnswers(parsed.data.answers);
    if (!hasAllRequiredAnswers(answers)) return NextResponse.json({ error: "Please complete every required detail." }, { status: 400 });

    const source = Object.fromEntries(Object.entries(parsed.data.source || {}).filter((entry): entry is [string, string] => Boolean(entry[1])));
    const summary = parsed.data.recentMessages.map((message) => `${message.role}: ${message.content}`).join("\n").slice(0, 1200);
    const result = await createLeadOnce({ id: parsed.data.submissionId, answers, summary, source });

    if (result.duplicate) return NextResponse.json({ status: "duplicate", message: chatbotConfig.duplicateMessage });

    after(async () => {
      await deliverLead(result.lead);
    });
    return NextResponse.json({ status: "submitted", message: chatbotConfig.submittedMessage });
  } catch (error) {
    console.error("Chatbot lead submission failed", { message: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "We couldn't save your inquiry right now. Please try again." }, { status: 503 });
  }
}
