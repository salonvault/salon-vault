import { generateText, Output } from "ai";
import { chatbotConfig } from "./config";
import { extractionModelOrder, getGroqClient, groqModelOptions, providerErrorSummary } from "./groq";
import { leadExtractionOutputSchema, normalizeAnswer } from "./schemas";
import type { ChatMessage, LeadAnswers, LeadExtractionResponse } from "./types";

function extractionPrompt(answers: LeadAnswers) {
  const fields = chatbotConfig.questions.map((question) => ({
    questionId: question.id,
    label: question.label,
    description: question.description,
    type: question.type,
    choices: "choices" in question ? question.choices : undefined,
  }));

  return `Extract lead facts from the visitor's latest message using the configured fields.

Configured fields: ${JSON.stringify(fields)}
Existing validated answers: ${JSON.stringify(answers)}

Rules:
- Fields may be provided in any order, and one message may contain several fields.
- Return an update only when the visitor explicitly and unambiguously provides a value.
- For every update, evidence must be an exact quote copied from the visitor's latest message that proves the value.
- Never treat a refusal, joke, placeholder, uncertainty, question, or unrelated phrase as a value.
- Examples that are NOT names: "I don't want to tell you", "prefer not to say", "why do you need it?", "none of your business".
- Put a field in refusedQuestionIds when the latest visitor message explicitly refuses that field. A refusal is not an update and does not complete the field.
- For a correction such as "actually my name is Ahmad", return only the corrected field. Preserve every other existing answer.
- Put a field in clearQuestionIds only when the visitor explicitly asks to remove or clear that field without replacing it.
- Never infer an email, phone number, or name.
- Map service intent to the closest configured choice only when the intent is clear.
- Do not repeat unchanged existing answers in updates.
- Output data only through the required schema.`;
}

export async function extractLeadAnswers({ messages, answers }: { messages: Pick<ChatMessage, "role" | "content">[]; answers: LeadAnswers }): Promise<LeadExtractionResponse> {
  const groq = getGroqClient();
  let finalError: unknown = new Error("Every extraction model failed.");

  for (const modelId of extractionModelOrder) {
    try {
      const result = await generateText({
        model: groq(modelId),
        system: extractionPrompt(answers),
        messages: messages.slice(-6),
        output: Output.object({
          name: "LeadFieldUpdates",
          description: "Only explicit lead-field updates and explicit field removals from the visitor.",
          schema: leadExtractionOutputSchema,
        }),
        temperature: 0,
        maxOutputTokens: 260,
        maxRetries: 0,
        timeout: 7_000,
        providerOptions: { groq: groqModelOptions(modelId, true) },
      });

      const next = { ...answers };
      const clearedQuestionIds: string[] = [];
      const updatedQuestionIds: string[] = [];
      const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";
      const normalizedLatest = latestUserMessage.normalize("NFKC").toLocaleLowerCase();
      const refusedQuestionIds = result.output.refusedQuestionIds.filter((questionId) =>
        chatbotConfig.questions.some((question) => question.id === questionId),
      );

      for (const questionId of result.output.clearQuestionIds) {
        if (!chatbotConfig.questions.some((question) => question.id === questionId)) continue;
        if (questionId in next) {
          delete next[questionId];
          clearedQuestionIds.push(questionId);
        }
      }

      for (const update of result.output.updates) {
        const question = chatbotConfig.questions.find((candidate) => candidate.id === update.questionId);
        if (!question) continue;
        const evidence = update.evidence.trim();
        if (!evidence || !normalizedLatest.includes(evidence.normalize("NFKC").toLocaleLowerCase())) continue;
        const normalized = normalizeAnswer(question, update.value);
        if (!normalized || next[question.id] === normalized) continue;
        if (question.id === "name") {
          const escapedName = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const directName = new RegExp(`^(?:${escapedName})[.!]?$`, "iu").test(latestUserMessage.trim());
          const introducedName = new RegExp(`\\b(?:my name is|i am|i'm|this is|call me|you can call me)\\s+${escapedName}\\b`, "iu").test(latestUserMessage);
          const leadingName = new RegExp(`^${escapedName}(?:\\s+here)?[,!.]`, "iu").test(latestUserMessage.trim());
          if (!directName && !introducedName && !leadingName) continue;
        }
        next[question.id] = normalized;
        updatedQuestionIds.push(question.id);
      }

      return { answers: next, updatedQuestionIds, clearedQuestionIds, refusedQuestionIds };
    } catch (error) {
      finalError = error;
      console.error("Chatbot extraction model failed", { model: modelId, error: providerErrorSummary(error) });
    }
  }

  throw finalError;
}
