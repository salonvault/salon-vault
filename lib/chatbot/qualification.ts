import { chatbotConfig, requiredQuestions } from "./config";
import type { LeadAnswers, QuestionProgress } from "./types";

export function getMissingQuestions(answers: LeadAnswers) {
  return requiredQuestions.filter((question) => !answers[question.id]);
}

export function hasAllRequiredAnswers(answers: LeadAnswers) {
  return getMissingQuestions(answers).length === 0;
}

export function getQuestionProgress(answers: LeadAnswers): QuestionProgress[] {
  return chatbotConfig.questions
    .filter((question) => question.required)
    .map((question) => ({ id: question.id, label: question.label, complete: Boolean(answers[question.id]) }));
}

export function buildConfirmationSummary(answers: LeadAnswers) {
  return chatbotConfig.questions
    .filter((question) => question.required)
    .map((question) => `${question.label}: ${answers[question.id]}`)
    .join("\n");
}
