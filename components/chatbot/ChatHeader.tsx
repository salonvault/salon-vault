import { Bot, RotateCcw, X } from "lucide-react";

export default function ChatHeader({
  onClose,
  onReset,
  busy,
}: {
  onClose: () => void;
  onReset: () => void;
  busy: boolean;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-[var(--color-bordercol)] bg-[linear-gradient(135deg,#ffffff_0%,#fff5f7_100%)] px-4 py-3.5">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-1)] text-white shadow-[0_10px_24px_rgba(232,93,117,0.24)]">
        <Bot className="h-5 w-5" strokeWidth={2} />
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 id="salonvault-chat-title" className="heading-h5 font-bold">
            Sia from SalonVault
          </h2>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-emerald-700">
            Online
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-[var(--color-ink-2)]">
          Concise answers and a tailored recommendation
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={busy}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-3)] transition-colors hover:bg-white hover:text-[var(--color-primary-1)] disabled:opacity-40"
        aria-label="Start a new conversation"
        title="Start over"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-3)] transition-colors hover:bg-white hover:text-[var(--color-foreground)]"
        aria-label="Close chat"
      >
        <X className="h-5 w-5" />
      </button>
    </header>
  );
}

