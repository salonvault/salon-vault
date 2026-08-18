import { Bot, LoaderCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/chatbot/types";

export default function ChatMessages({
  messages,
  busy,
}: {
  messages: ChatMessage[];
  busy: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const waitingForFirstChunk = busy && messages.at(-1)?.content === "";
  const submitting = busy && messages.at(-1)?.role === "user";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  return (
    <div
      className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#fffdfd_0%,#fff7f9_100%)] px-4 py-4"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="space-y-3">
        {messages.filter((message) => message.content).map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-bordercol)] bg-white text-[var(--color-primary-1)] shadow-sm">
                <Bot className="h-3.5 w-3.5" />
              </span>
            )}
            <div
              className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[12px] leading-[1.55] shadow-[0_6px_18px_rgba(17,17,17,0.05)] ${
                message.role === "user"
                  ? "rounded-br-[5px] bg-[var(--color-primary-1)] text-white"
                  : "rounded-bl-[5px] border border-[var(--color-bordercol)] bg-white text-[var(--color-foreground)]"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {(waitingForFirstChunk || submitting) && (
          <div className="flex items-end gap-2" aria-label="Sia is thinking">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-bordercol)] bg-white text-[var(--color-primary-1)]">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-[5px] border border-[var(--color-bordercol)] bg-white px-3.5 py-2.5 text-[11px] text-[var(--color-ink-2)]">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[var(--color-primary-1)]" />
              Thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
