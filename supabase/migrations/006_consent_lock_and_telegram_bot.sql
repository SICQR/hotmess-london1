-- =========================================================================
-- HOTMESS OS - Consent Lock + Telegram Bot Handshake
-- =========================================================================
-- Adds profile compliance flags and a short-lived bot_sessions handshake table.
-- Standalone Telegram Edge Function reads bot_sessions using Service Role.
-- =========================================================================

-- 1) Ensure Profile has lock + telegram columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS consent_accepted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_18_plus BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_connected BOOLEAN DEFAULT FALSE;

-- telegram_id already exists in 001_create_core_tables.sql, but keep this safe.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telegram_id TEXT;

-- 2) Create the Telegram Handshake table
CREATE TABLE IF NOT EXISTS public.bot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + interval '15 minutes')
);

CREATE INDEX IF NOT EXISTS idx_bot_sessions_token ON public.bot_sessions(token);
CREATE INDEX IF NOT EXISTS idx_bot_sessions_expires_at ON public.bot_sessions(expires_at);

-- 3) Security: Enable RLS on bot_sessions
ALTER TABLE public.bot_sessions ENABLE ROW LEVEL SECURITY;

-- Users can create their own handshake token
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bot_sessions'
      AND policyname = 'Users can insert own session'
  ) THEN
    CREATE POLICY "Users can insert own session"
      ON public.bot_sessions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
