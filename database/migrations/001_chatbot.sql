BEGIN;

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'collecting'
    CHECK (status IN ('collecting', 'ready_for_confirmation', 'submitting', 'submitted', 'needs_review')),
  summary TEXT NOT NULL DEFAULT '',
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  provider TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('assistant', 'user')),
  content TEXT NOT NULL CHECK (char_length(content) <= 1200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_messages_session_created_idx
  ON chat_messages (session_id, created_at DESC);

CREATE TABLE IF NOT EXISTS chat_rate_limits (
  fingerprint TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (fingerprint, window_start)
);

CREATE INDEX IF NOT EXISTS chat_rate_limits_window_idx
  ON chat_rate_limits (window_start);

CREATE TABLE IF NOT EXISTS chatbot_leads (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE REFERENCES chat_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT NOT NULL DEFAULT '',
  qualification TEXT NOT NULL
    CHECK (qualification IN ('qualified', 'needs_review')),
  source JSONB NOT NULL DEFAULT '{}'::jsonb,
  airtable_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (airtable_status IN ('pending', 'sent', 'failed')),
  client_email_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (client_email_status IN ('pending', 'sent', 'failed')),
  team_email_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (team_email_status IN ('pending', 'sent', 'failed')),
  integration_errors JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chatbot_leads_email_idx ON chatbot_leads (email);
CREATE INDEX IF NOT EXISTS chatbot_leads_created_idx ON chatbot_leads (created_at DESC);

COMMIT;

