import { z } from "zod";
import { chatbotConfig, type ChatQuestion } from "./config";
import type { LeadAnswers } from "./types";

const chatMessageSchema = z.object({ role: z.enum(["assistant", "user"]), content: z.string().trim().min(1).max(1200) });

export const chatStreamRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(chatbotConfig.recentMessagesForModel),
  answers: z.record(z.string(), z.string().max(300)).default({}),
  mode: z.enum(["qualifying", "editing", "confirming", "complete"]).default("qualifying"),
  refusedQuestionIds: z.array(z.string().max(80)).max(20).default([]),
  website: z.string().max(0).optional(),
});

export const leadExtractionRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(chatbotConfig.recentMessagesForModel),
  answers: z.record(z.string(), z.string().max(300)).default({}),
  website: z.string().max(0).optional(),
});

export const leadExtractionOutputSchema = z.object({
  updates: z.array(z.object({ questionId: z.string().max(80), value: z.string().max(300), evidence: z.string().max(400) })).max(20),
  clearQuestionIds: z.array(z.string().max(80)).max(20),
  refusedQuestionIds: z.array(z.string().max(80)).max(20),
});

export const leadSubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  confirmed: z.literal(true),
  answers: z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(254), phone: z.string().trim().min(7).max(24), service: z.string().trim().min(2).max(120) }).catchall(z.string().trim().min(1).max(300)),
  recentMessages: z.array(chatMessageSchema).max(10).default([]),
  website: z.string().max(0).optional(),
  source: z.object({ page: z.string().max(500).optional(), referrer: z.string().max(500).optional(), utmSource: z.string().max(120).optional(), utmCampaign: z.string().max(120).optional() }).optional(),
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s.-]{7,24}$/;
const namePattern = /^[\p{L}\p{M}][\p{L}\p{M}'’.-]*(?:\s+[\p{L}\p{M}][\p{L}\p{M}'’.-]*){0,4}$/u;

export function normalizeAnswer(question: ChatQuestion, rawValue: string) {
  const value = rawValue.replace(/\s+/g, " ").trim();
  if (!value) return null;
  if (/^(?:no|nope|none|i\s+(?:do not|don't|dont)\s+(?:want|wanna|wish)\s+to\s+(?:say|share|tell)|i(?:'d| would)\s+rather\s+not|prefer\s+not\s+to|not\s+comfortable\s+sharing|none\s+of\s+your\s+business)[.!]?$/i.test(value)) return null;
  switch (question.type) {
    case "email": return emailPattern.test(value) ? value.toLowerCase() : null;
    case "phone": return phonePattern.test(value) && value.replace(/\D/g, "").length >= 7 ? value : null;
    case "choice": return question.choices?.find((choice) => choice.toLowerCase() === value.toLowerCase()) ?? null;
    case "text": {
      const text = question.id === "name"
        ? value.replace(/^(?:my name is|i am|i'm|this is)\s+/i, "").replace(/[.!]+$/, "").trim()
        : value;
      if (question.id === "name") {
        if (!namePattern.test(text) || text.length < 2 || text.length > 80) return null;
        if (/\b(?:website|web site|email|phone|service|salon|business|help|booking|bookings|software|nothing|unknown|anonymous|test|user)\b/i.test(text)) return null;
      }
      return text.length >= 2 && text.length <= 120 ? text : null;
    }
  }
}

export function normalizeLeadAnswers(answers: LeadAnswers) {
  const normalized: LeadAnswers = {};
  for (const question of chatbotConfig.questions) {
    const value = normalizeAnswer(question, answers[question.id] || "");
    if (value) normalized[question.id] = value;
  }
  return normalized;
}
