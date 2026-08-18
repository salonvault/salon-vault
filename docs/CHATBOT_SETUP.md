# SalonVault chatbot setup

The chatbot is local-first. The browser keeps the conversation and validated lead fields for two hours. Only the latest 10 messages are sent to the model, and ordinary chat messages never touch Neon. Neon is called once when a visitor explicitly submits a complete inquiry.

## Request flow

1. A conversational reply streams from `/api/chat` while `/api/chat/extract` interprets lead fields in parallel.
2. The extractor compares every message with every configured field. It accepts fields in any order, requires quoted evidence for updates, ignores refusals, and patches only explicit corrections.
3. The assistant keeps requesting genuinely missing fields. `/api/leads` requires every validated field plus an explicit submission confirmation.
4. Neon atomically prevents another record with the same normalized email and phone.
5. A new lead receives an immediate response; Airtable and both emails run after the response.
6. After submission or duplicate detection, the assistant can keep answering relevant follow-up questions through Groq, but extraction, Neon, Airtable, and email operations remain disabled. Attempts to start another inquiry are declined until the two-hour completed-session lock expires.
7. A server-side scope guard rejects clearly unrelated requests before an LLM call, while the system prompt handles less explicit off-topic requests. The assistant never acts as a general coding, brainstorming, homework, news, or entertainment bot.

## Neon

Create a Neon project, copy its pooled connection string, and set `DATABASE_URL`. In Neon's SQL Editor run, in order:

1. `database/migrations/001_chatbot.sql`
2. `database/migrations/002_local_first_leads.sql`

Migration 002 permits final-only leads without a server chat session and adds the unique contact fingerprint used for race-safe deduplication.

## Models

```env
GROQ_API_KEY=
```

The provider attempts these models in order:

1. `openai/gpt-oss-120b`
2. `openai/gpt-oss-20b`
3. `qwen/qwen3.6-27b`

If a model fails before emitting visible text, the stream transparently moves to the next model. Once text has been shown, it never switches models mid-sentence. Gemini is not installed or used.

## Airtable

Create a table named `Leads` with these fields:

| Field | Type |
| --- | --- |
| Lead ID | Single line text |
| Name | Single line text |
| Email | Email |
| Phone | Phone or single line text |
| Service | Single select or single line text |
| Status | Single select or single line text |
| Summary | Long text |

For a single-select Status field, add `Qualified` and `Needs review`. Create an Airtable Personal Access Token with `data.records:read` and `data.records:write` access to this base.

```env
AIRTABLE_PERSONAL_ACCESS_TOKEN=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_NAME=Leads
```

## Email

Verify your sending domain in Resend, then configure:

```env
RESEND_API_KEY=
CHATBOT_EMAIL_FROM=SalonVault <leads@notifications.salonvault.online>
CHATBOT_TEAM_EMAIL=your-team@gmail.com
```

The visitor and team receive separate responsive HTML emails with plain-text fallbacks. The team email contains the validated lead fields and no conversation history. Failures are recorded on the Neon lead without delaying the visitor's response.

## Security

```env
CHATBOT_FINGERPRINT_SECRET=replace-with-a-long-random-value
```

Never expose these variables with a `NEXT_PUBLIC_` prefix. The chat route has strict payload limits, a short model timeout, and a best-effort in-memory rate limit. For higher traffic, add a platform WAF or Turnstile without reintroducing per-message database writes.

## Reuse and customization

Business copy, knowledge, service choices, questions, message limits, and the two-hour TTL live in `lib/chatbot/config.ts`. The progress UI, validation flow, JSON answer storage, and Airtable mapping automatically adapt to additional configured questions. Name, email, phone, and service remain the required core; replacing those four core identifiers requires adapting the final submission schema and delivery templates.

No rolling LLM summary is needed in this architecture: ten recent messages preserve conversational continuity while separately persisted lead fields preserve the only long-lived facts required for conversion. This removes an extra model call and avoids summary drift.
