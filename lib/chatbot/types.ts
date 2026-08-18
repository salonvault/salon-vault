export type ChatRole = "assistant" | "user";
export type ChatMessage = { id: string; role: ChatRole; content: string; createdAt: string };
export type LeadAnswers = Record<string, string>;
export type ChatSessionStatus = "collecting" | "editing" | "confirming" | "submitting" | "submitted" | "duplicate";
export type LocalChatState = { version: 6; expiresAt: string; submissionId: string; messages: ChatMessage[]; status: ChatSessionStatus; answers: LeadAnswers; submissionLockedUntil?: string };
export type QuestionProgress = { id: string; label: string; complete: boolean };
export type LeadSubmissionResponse = { status: "submitted" | "duplicate"; message: string };
export type LeadExtractionResponse = { answers: LeadAnswers; updatedQuestionIds: string[]; clearedQuestionIds: string[]; refusedQuestionIds: string[] };
