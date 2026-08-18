import { NextRequest, NextResponse } from "next/server";
import { extractLeadAnswers } from "@/lib/chatbot/extractor";
import { leadExtractionRequestSchema, normalizeLeadAnswers } from "@/lib/chatbot/schemas";
import { checkMemoryRateLimit, getRequestFingerprint, hasValidJsonRequest } from "@/lib/chatbot/security";

export const runtime = "nodejs";
export const maxDuration = 25;

export async function POST(request: NextRequest) {
  if (!hasValidJsonRequest(request)) return NextResponse.json({ error: "Invalid extraction request." }, { status: 400 });
  if (!checkMemoryRateLimit(getRequestFingerprint(request, "extract"), 20)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  try {
    const parsed = leadExtractionRequestSchema.safeParse(await request.json());
    if (!parsed.success || parsed.data.website) return NextResponse.json({ error: "Invalid conversation data." }, { status: 400 });
    const result = await extractLeadAnswers({
      messages: parsed.data.messages,
      answers: normalizeLeadAnswers(parsed.data.answers),
    });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Chatbot extraction failed", { message: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: "I couldn't safely interpret those details. Please try rephrasing." }, { status: 503 });
  }
}
