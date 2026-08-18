const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 6_000;

type SendEmailInput = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey: string;
};

type ResendErrorBody = {
  name?: string;
  message?: string;
  error?: { name?: string; message?: string };
};

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 409 || status === 429 || status >= 500;
}

function errorDetails(body: ResendErrorBody, fallback: string) {
  return {
    name: body.name || body.error?.name || "unknown_error",
    message: body.message || body.error?.message || fallback,
  };
}

export async function sendResendEmail(input: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  let lastError = "Unknown network error";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(RESEND_EMAILS_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": input.idempotencyKey,
          "User-Agent": "salonvault-chatbot/1.0",
        },
        body: JSON.stringify({
          from: input.from,
          to: [input.to],
          subject: input.subject,
          html: input.html,
          text: input.text,
          ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const body = await response.json().catch(() => ({})) as ResendErrorBody & { id?: string };
      if (response.ok) return body;

      const details = errorDetails(body, response.statusText);
      lastError = `${details.name}: ${details.message}`;
      if (!isRetryableStatus(response.status) || attempt === MAX_ATTEMPTS) {
        throw new Error(`Resend rejected the email (HTTP ${response.status}, ${lastError}).`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.startsWith("Resend rejected the email")) throw error;
      lastError = message;
      if (attempt === MAX_ATTEMPTS) {
        throw new Error(`Resend could not be reached after ${MAX_ATTEMPTS} attempts: ${lastError}`);
      }
    }

    await wait(attempt === 1 ? 300 : 800);
  }

  throw new Error(`Resend email delivery failed: ${lastError}`);
}
