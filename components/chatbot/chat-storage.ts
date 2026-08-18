import type { ChatMessage, LocalChatState } from "@/lib/chatbot/types";

function validMessage(message: ChatMessage) {
  return message && typeof message.id === "string" && (message.role === "assistant" || message.role === "user") && typeof message.content === "string" && typeof message.createdAt === "string";
}

export function loadChatState(key: string): LocalChatState | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null") as LocalChatState | null;
    if (!parsed || parsed.version !== 6 || Date.parse(parsed.expiresAt) <= Date.now()) {
      window.localStorage.removeItem(key);
      return null;
    }
    if (!Array.isArray(parsed.messages) || !parsed.messages.every(validMessage) || typeof parsed.submissionId !== "string" || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveChatState(key: string, state: LocalChatState, messageLimit: number) {
  try {
    window.localStorage.setItem(key, JSON.stringify({ ...state, messages: state.messages.slice(-messageLimit) }));
  } catch {
    // Storage can be unavailable in private browsing or when quotas are full.
  }
}

export function clearChatState(key: string) {
  try { window.localStorage.removeItem(key); } catch { /* Local reset still succeeds. */ }
}
