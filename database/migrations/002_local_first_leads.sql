BEGIN;

ALTER TABLE chatbot_leads
  ALTER COLUMN session_id DROP NOT NULL;

ALTER TABLE chatbot_leads
  ADD COLUMN IF NOT EXISTS contact_fingerprint TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS chatbot_leads_contact_fingerprint_unique_idx
  ON chatbot_leads (contact_fingerprint)
  WHERE contact_fingerprint IS NOT NULL;

COMMIT;
