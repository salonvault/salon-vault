import { NextRequest, NextResponse } from "next/server";
import { chatbotConfig } from "@/lib/chatbot/config";
import { streamChatResponse } from "@/lib/chatbot/providers";
import { chatStreamRequestSchema, normalizeLeadAnswers } from "@/lib/chatbot/schemas";
import { checkMemoryRateLimit, getRequestFingerprint, hasValidJsonRequest } from "@/lib/chatbot/security";
import { isClearlyOutOfScope, outOfScopeReply } from "@/lib/chatbot/scope";

export const runtime = "nodejs";
export const maxDuration = 30;

function publicError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  if (!hasValidJsonRequest(request)) return publicError("Invalid chat request.", 400);
  if (!checkMemoryRateLimit(getRequestFingerprint(request))) {
    return publicError("You're sending messages too quickly. Please wait a moment.", 429);
  }

  try {
    const parsed = chatStreamRequestSchema.safeParse(await request.json());
    if (!parsed.success || parsed.data.website) return publicError("Please enter a valid message.", 400);
    if (isClearlyOutOfScope(parsed.data.messages)) {
      return new Response(outOfScopeReply, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    return streamChatResponse({
      messages: parsed.data.messages.slice(-chatbotConfig.recentMessagesForModel),
      answers: normalizeLeadAnswers(parsed.data.answers),
      mode: parsed.data.mode,
      refusedQuestionIds: parsed.data.refusedQuestionIds,
    });
  } catch (error) {
    console.error("Chatbot stream setup failed", { name: error instanceof Error ? error.name : "UnknownError", message: error instanceof Error ? error.message : "Unknown error" });
    return publicError("I'm having trouble responding right now. Please try again in a moment.", 503);
  }
}
