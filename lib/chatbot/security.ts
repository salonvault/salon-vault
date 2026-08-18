import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

export function getRequestFingerprint(request: NextRequest, sessionId = "chat") {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const secret = process.env.CHATBOT_FINGERPRINT_SECRET || "salonvault-local-development";
  return createHash("sha256").update(`${ip}:${sessionId}:${secret}`).digest("hex");
}

type RateEntry = { count: number; resetsAt: number };
const globalRateStore = globalThis as typeof globalThis & { __salonvaultChatRates?: Map<string, RateEntry> };

export function checkMemoryRateLimit(fingerprint: string, limit = 15, windowMs = 60_000) {
  const store = globalRateStore.__salonvaultChatRates ??= new Map<string, RateEntry>();
  const now = Date.now();
  const current = store.get(fingerprint);
  if (!current || current.resetsAt <= now) {
    store.set(fingerprint, { count: 1, resetsAt: now + windowMs });
    return true;
  }
  current.count += 1;
  if (store.size > 1_000) {
    for (const [key, entry] of store) if (entry.resetsAt <= now) store.delete(key);
  }
  return current.count <= limit;
}

export function hasValidJsonRequest(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  const contentLength = Number(request.headers.get("content-length") || 0);
  return contentType.includes("application/json") && contentLength <= 10_000;
}
