"use client";

import { MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { chatbotConfig } from "@/lib/chatbot/config";
import { buildConfirmationSummary, getQuestionProgress, hasAllRequiredAnswers } from "@/lib/chatbot/qualification";
import type { ChatMessage, ChatSessionStatus, LeadAnswers, LeadExtractionResponse, LeadSubmissionResponse, LocalChatState } from "@/lib/chatbot/types";
import ChatComposer from "./ChatComposer";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import LeadProgress from "./LeadProgress";
import { clearChatState, loadChatState, saveChatState } from "./chat-storage";

function message(role: ChatMessage["role"], content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content, createdAt: new Date().toISOString() };
}

function initialMessages() { return [message("assistant", chatbotConfig.welcomeMessage)]; }

function sourceData() {
  const params = new URLSearchParams(window.location.search);
  return { page: window.location.href, referrer: document.referrer, utmSource: params.get("utm_source") || undefined, utmCampaign: params.get("utm_campaign") || undefined };
}

function modelMessages(messages: ChatMessage[]) {
  return messages.slice(-chatbotConfig.recentMessagesForModel).map(({ role, content }) => ({ role, content }));
}

function isNewInquiryAttempt(content: string) {
  return [
    /\b(?:new|another|second|different)\s+(?:inquiry|request|entry|project|website|service)\b/i,
    /\b(?:start|submit|send)\s+(?:over|again|another)\b/i,
    /\b(?:change|edit|update)\s+(?:my\s+)?(?:inquiry|request|details)\b/i,
    /\b(?:i|we)\s+(?:need|want|would like|are looking for)\b.{0,60}\b(?:website|software|service|system|bookings|project)\b/i,
  ].some((pattern) => pattern.test(content));
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [answers, setAnswers] = useState<LeadAnswers>({});
  const [status, setStatus] = useState<ChatSessionStatus>("collecting");
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const [submissionLockedUntil, setSubmissionLockedUntil] = useState<string>();
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const streamedText = useRef("");

  const progress = useMemo(() => getQuestionProgress(answers), [answers]);
  const quickActions = useMemo(() => {
    if (status === "confirming") return ["Submit inquiry", "Edit details"];
    if (!messages.some((item) => item.role === "user")) return [...chatbotConfig.starterPrompts];
    return [];
  }, [messages, status]);

  useEffect(() => {
    clearChatState("salonvault-chat-v5");
    const cached = loadChatState(chatbotConfig.localStorageKey);
    if (cached) {
      queueMicrotask(() => {
        setMessages(cached.messages);
        setAnswers(cached.answers);
        setStatus(cached.status);
        setSubmissionId(cached.submissionId);
        setSubmissionLockedUntil(cached.submissionLockedUntil);
        setHydrated(true);
      });
    } else {
      queueMicrotask(() => setHydrated(true));
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      const completed = status === "submitted" || status === "duplicate";
      const expiresAt = completed && submissionLockedUntil
        ? submissionLockedUntil
        : new Date(Date.now() + chatbotConfig.localStorageTtlMs).toISOString();
      const state: LocalChatState = { version: 6, expiresAt, submissionId, messages, status, answers, submissionLockedUntil };
      saveChatState(chatbotConfig.localStorageKey, state, chatbotConfig.messagesStoredLocally);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [answers, hydrated, messages, status, submissionId, submissionLockedUntil]);

  useEffect(() => {
    if ((status !== "submitted" && status !== "duplicate") || !submissionLockedUntil) return;
    const remaining = Date.parse(submissionLockedUntil) - Date.now();
    if (remaining <= 0) {
      queueMicrotask(startFreshConversation);
      return;
    }
    const timer = window.setTimeout(startFreshConversation, remaining);
    return () => window.clearTimeout(timer);
  }, [status, submissionLockedUntil]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  async function streamAssistant(conversation: ChatMessage[], currentAnswers: LeadAnswers, mode: "qualifying" | "editing" | "confirming" | "complete", refusedQuestionIds: string[] = []) {
    const assistantId = crypto.randomUUID();
    setMessages([...conversation, { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString() }]);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: modelMessages(conversation), answers: currentAnswers, mode, refusedQuestionIds, website: "" }),
    });
    if (!response.ok || !response.body) {
      const data = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(data.error || "Unable to get a response.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    streamedText.current = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      streamedText.current += chunk;
      setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: item.content + chunk } : item));
    }
    if (!streamedText.current.trim()) throw new Error("The assistant returned an empty response.");
  }

  async function captureAnswers(conversation: ChatMessage[], currentAnswers: LeadAnswers) {
    const response = await fetch("/api/chat/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: modelMessages(conversation), answers: currentAnswers, website: "" }),
    });
    const data = await response.json() as LeadExtractionResponse & { error?: string };
    if (!response.ok) throw new Error(data.error || "Unable to safely interpret those details.");
    return data;
  }

  function appendConfirmation(nextAnswers: LeadAnswers, updatedQuestionIds: string[], wasEditing: boolean) {
    const name = nextAnswers.name ? `, ${nextAnswers.name}` : "";
    const updatedLabels = chatbotConfig.questions
      .filter((question) => updatedQuestionIds.includes(question.id))
      .map((question) => question.label.toLowerCase());
    const updateNote = updatedLabels.length
      ? `I've updated your ${updatedLabels.join(" and ")} and kept everything else unchanged.`
      : "I've kept your details exactly as provided.";
    const introduction = wasEditing
      ? `All set${name} — ${updateNote}`
      : `Thanks${name} — I have everything I need.`;

    setMessages((current) => [
      ...current,
      message("assistant", `${introduction} Take a quick look:\n\n${buildConfirmationSummary(nextAnswers)}\n\nWould you like me to submit your inquiry?`),
    ]);
  }

  async function handleNaturalConversation(conversation: ChatMessage[], mode: "qualifying" | "editing" | "confirming", currentAnswers: LeadAnswers) {
    setBusy(true);
    setMessages(conversation);
    try {
      let extracted: LeadExtractionResponse = { answers: currentAnswers, updatedQuestionIds: [], clearedQuestionIds: [], refusedQuestionIds: [] };
      try {
        extracted = await captureAnswers(conversation, currentAnswers);
      } catch {
        setError("I couldn't safely capture new details from that message. Please rephrase anything you'd like me to save.");
      }

      const changed = extracted.updatedQuestionIds.length > 0 || extracted.clearedQuestionIds.length > 0;
      const complete = hasAllRequiredAnswers(extracted.answers);
      const shouldConfirm = complete && (changed || status === "editing" || status === "collecting");
      setAnswers(extracted.answers);
      if (shouldConfirm) {
        setStatus("confirming");
      } else if (changed) {
        setStatus(mode === "qualifying" ? "collecting" : "editing");
      }
      if (shouldConfirm) {
        appendConfirmation(extracted.answers, extracted.updatedQuestionIds, mode === "editing" || mode === "confirming");
        return;
      }

      const responseMode = mode === "confirming" && (!complete || changed) ? "editing" : mode;
      await streamAssistant(conversation, extracted.answers, responseMode, extracted.refusedQuestionIds);
    } catch (reason) {
      setMessages((current) => {
        const last = current.at(-1);
        if (last?.role === "assistant" && !last.content) return current.slice(0, -1).concat(message("assistant", "I hit a brief connection issue. Could you say that once more?"));
        return current;
      });
      setError(reason instanceof Error ? reason.message : "Unable to respond.");
    } finally {
      setBusy(false);
    }
  }

  async function submitLead(conversation: ChatMessage[]) {
    setBusy(true);
    setStatus("submitting");
    setError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, confirmed: true, answers, recentMessages: modelMessages(conversation), source: sourceData(), website: "" }),
      });
      const data = await response.json() as LeadSubmissionResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to save your inquiry.");
      setSubmissionLockedUntil(new Date(Date.now() + chatbotConfig.localStorageTtlMs).toISOString());
      setStatus(data.status);
      setMessages([...conversation, message("assistant", data.message)]);
    } catch (reason) {
      setStatus("confirming");
      setError(reason instanceof Error ? reason.message : "Unable to save your inquiry.");
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(providedMessage?: string) {
    const content = (providedMessage ?? input).trim();
    if (!content || busy) return;
    setInput("");
    setError("");
    const conversation = [...messages, message("user", content)];

    if (status === "submitted" || status === "duplicate") {
      if (isNewInquiryAttempt(content)) {
        setMessages([...conversation, message("assistant", chatbotConfig.newInquiryLockedMessage)]);
        return;
      }
      setBusy(true);
      setMessages(conversation);
      try { await streamAssistant(conversation, answers, "complete"); }
      catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to respond."); }
      finally { setBusy(false); }
      return;
    }

    if (status === "confirming" && /^(?:submit inquiry|submit|confirm(?: submission)?|yes,?\s+(?:submit|send|confirm)(?: it| my inquiry)?)$/i.test(content)) {
      if (hasAllRequiredAnswers(answers)) {
        setMessages(conversation);
        await submitLead(conversation);
      } else {
        setStatus("collecting");
        await handleNaturalConversation(conversation, "qualifying", answers);
      }
      return;
    }

    if (status === "confirming" && /^edit details$/i.test(content)) {
      setStatus("editing");
      setBusy(true);
      setMessages(conversation);
      try { await streamAssistant(conversation, answers, "editing"); }
      catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to respond."); }
      finally { setBusy(false); }
      return;
    }

    const mode = status === "confirming" ? "confirming" : status === "editing" ? "editing" : "qualifying";
    await handleNaturalConversation(conversation, mode, answers);
  }

  function startFreshConversation() {
    clearChatState(chatbotConfig.localStorageKey);
    setMessages(initialMessages());
    setAnswers({});
    setStatus("collecting");
    setSubmissionId(crypto.randomUUID());
    setSubmissionLockedUntil(undefined);
    setInput("");
    setError("");
  }

  function resetConversation() {
    if (busy) return;
    if ((status === "submitted" || status === "duplicate") && submissionLockedUntil && Date.parse(submissionLockedUntil) > Date.now()) {
      setMessages((current) => [...current, message("assistant", chatbotConfig.newInquiryLockedMessage)]);
      return;
    }
    startFreshConversation();
  }

  return (
    <div className="fixed bottom-0 right-0 z-[70]">
      {open && (
        <section className="fixed bottom-[138px] right-3 flex h-[min(620px,calc(100dvh-154px))] w-[calc(100vw-24px)] max-w-[390px] flex-col overflow-hidden rounded-[20px] border border-[var(--color-bordercol)] bg-white shadow-[0_28px_90px_rgba(17,17,17,0.2)] sm:right-[18px]" role="dialog" aria-labelledby="salonvault-chat-title">
          <ChatHeader onClose={() => setOpen(false)} onReset={resetConversation} busy={busy} />
          <LeadProgress progress={progress} />
          <ChatMessages messages={messages} busy={busy} />
          {quickActions.length > 0 && <div className="flex gap-1.5 overflow-x-auto border-t border-[var(--color-bordercol)] bg-[var(--color-blush-1)] px-3.5 py-2.5">{quickActions.map((action) => <button key={action} type="button" disabled={busy} onClick={() => sendMessage(action)} className="shrink-0 rounded-full border border-[var(--color-blush-2)] bg-white px-3 py-1.5 text-[10px] font-bold text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-primary-1)] hover:text-[var(--color-primary-1)] disabled:opacity-50">{action}</button>)}</div>}
          {error && <div className="border-t border-amber-100 bg-amber-50 px-4 py-2 text-center text-[10px] font-medium text-amber-800" role="alert">{error}</div>}
          <ChatComposer value={input} onChange={setInput} onSubmit={() => sendMessage()} busy={busy} />
        </section>
      )}
      {!open && <div className="fixed bottom-[76px] right-3 flex items-center gap-2 sm:bottom-[82px] sm:right-[18px]"><span className="hidden rounded-full border border-[var(--color-bordercol)] bg-white px-3 py-2 text-[10px] font-bold text-[var(--color-ink-2)] shadow-[0_10px_28px_rgba(17,17,17,0.1)] sm:flex sm:items-center sm:gap-1.5"><Sparkles className="h-3 w-3 text-[var(--color-primary-1)]" />Ask Sia</span><button type="button" onClick={() => setOpen(true)} className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-primary-1),var(--color-primary-2))] text-white shadow-[0_16px_36px_rgba(232,93,117,0.32)] transition-transform hover:-translate-y-1 sm:h-[52px] sm:w-[52px]" aria-label="Open SalonVault chat" aria-expanded={open}><span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-primary-1)] opacity-15" /><MessageCircle className="relative h-5 w-5 fill-white/10" /></button></div>}
      {open && <button type="button" onClick={() => setOpen(false)} className="fixed bottom-[76px] right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-foreground)] text-white shadow-[0_16px_36px_rgba(17,17,17,0.2)] transition-transform hover:-translate-y-1 sm:bottom-[82px] sm:right-[18px] sm:h-[52px] sm:w-[52px]" aria-label="Close SalonVault chat"><X className="h-5 w-5" /></button>}
    </div>
  );
}
