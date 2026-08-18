import { Send, ShieldCheck } from "lucide-react";
import { type FormEvent, type KeyboardEvent, useRef } from "react";

export default function ChatComposer({ value, onChange, onSubmit, busy }: { value: string; onChange: (value: string) => void; onSubmit: () => void; busy: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  function submit(event: FormEvent) { event.preventDefault(); if (value.trim() && !busy) onSubmit(); }
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); formRef.current?.requestSubmit(); }
  }
  return (
    <div className="border-t border-[var(--color-bordercol)] bg-white px-3.5 pb-3 pt-2.5">
      <form ref={formRef} onSubmit={submit} className="flex items-end gap-2">
        <label className="sr-only" htmlFor="salonvault-chat-message">Message</label>
        <textarea id="salonvault-chat-message" rows={1} maxLength={800} value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} disabled={busy} placeholder="Type your message..." className="max-h-24 min-h-11 flex-1 resize-none rounded-xl border border-[var(--color-bordercol)] bg-[var(--color-blush-1)] px-3.5 py-3 text-[12px] leading-5 text-[var(--color-foreground)] outline-none transition-colors placeholder:text-[var(--color-ink-3)] focus:border-[var(--color-primary-1)] disabled:cursor-not-allowed disabled:opacity-70" />
        <button type="submit" disabled={!value.trim() || busy} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-1)] text-white shadow-[0_10px_22px_rgba(232,93,117,0.23)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-primary-2)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45" aria-label="Send message"><Send className="h-4 w-4" /></button>
      </form>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-[9px] text-[var(--color-ink-3)]"><ShieldCheck className="h-3 w-3 text-emerald-600" />Your details are used only to respond to your inquiry.</p>
    </div>
  );
}
