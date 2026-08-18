import { createTextStreamResponse, streamText } from "ai";
import { conversationalModelOrder, getGroqClient, groqModelOptions, providerErrorSummary } from "./groq";
import { buildStreamingSystemPrompt, type ConversationMode } from "./prompt";
import type { ChatMessage, LeadAnswers } from "./types";

export function streamChatResponse({ messages, answers, mode, refusedQuestionIds = [] }: { messages: Pick<ChatMessage, "role" | "content">[]; answers: LeadAnswers; mode: ConversationMode; refusedQuestionIds?: string[] }) {
  const groq = getGroqClient();
  const system = buildStreamingSystemPrompt(answers, mode, refusedQuestionIds);

  const stream = new ReadableStream<string>({
    async start(controller) {
      let finalError: unknown = new Error("Every Groq model failed before producing a response.");

      for (const modelId of conversationalModelOrder) {
        let emittedText = false;
        try {
          const result = streamText({
            model: groq(modelId),
            system,
            messages,
            temperature: 0.65,
            maxOutputTokens: 220,
            maxRetries: 0,
            timeout: 8_000,
            providerOptions: { groq: groqModelOptions(modelId) },
          });

          for await (const part of result.fullStream) {
            if (part.type === "text-delta") {
              emittedText = true;
              controller.enqueue(part.text);
            } else if (part.type === "error") {
              throw part.error;
            } else if (part.type === "abort") {
              throw new Error(part.reason || "The provider aborted the response.");
            }
          }

          if (!emittedText) throw new Error("The model returned no visible text.");
          controller.close();
          return;
        } catch (error) {
          finalError = error;
          console.error("Chatbot Groq model failed", { model: modelId, emittedText, error: providerErrorSummary(error) });
          if (emittedText) {
            controller.error(error);
            return;
          }
        }
      }

      controller.error(finalError);
    },
  });

  return createTextStreamResponse({
    stream,
    headers: {
      "Cache-Control": "no-store, no-transform",
      "X-Chat-Provider": "groq",
      "X-Chat-Models": conversationalModelOrder.join(","),
      "X-Content-Type-Options": "nosniff",
    },
  });
}
