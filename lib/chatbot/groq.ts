import { createGroq, type GroqLanguageModelChatOptions } from "@ai-sdk/groq";

export const conversationalModelOrder = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b",
] as const;

export const extractionModelOrder = [
  "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-120b",
] as const;

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured.");
  return createGroq({ apiKey });
}

export function groqModelOptions(modelId: string, structuredOutputs = false) {
  return {
    reasoningFormat: "hidden",
    reasoningEffort: modelId.startsWith("openai/") ? "low" : "none",
    ...(structuredOutputs ? { structuredOutputs: true, strictJsonSchema: false } : {}),
  } satisfies GroqLanguageModelChatOptions;
}

export function providerErrorSummary(error: unknown) {
  if (!(error instanceof Error)) return "Unknown provider error";
  return `${error.name}: ${error.message}`.slice(0, 300);
}
