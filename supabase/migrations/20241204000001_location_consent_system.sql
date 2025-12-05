-- ============================================================================
-- LOCATION CONSENT SYSTEM
-- ============================================================================
-- Implements GDPR-compliant location consent management with logging
-- Supports three modes: off, approximate (city-level), precise (GPS)
-- Date: December 4, 2024

-- ============================================================================
-- 1. CONSENT LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'location', 'marketing', 'analytics', 'cookies', 'messaging'
  consent_action TEXT NOT NULL, -- 'granted', 'denied', 'revoked', 'updated'
  consent_value JSONB, -- Store mode for location: {mode: 'off'|'approximate'|'precise'}
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_consent_logs_user_id ON consent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_logs_type ON consent_logs(consent_type);
CREATE INDEX IF NOT EXISTS idx_consent_logs_created_at ON consent_logs(created_at DESC);

-- ============================================================================
-- 2. USER LOCATION SETTINGS
-- ============================================================================

-- Add location consent fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location_consent_mode TEXT DEFAULT 'off' CHECK (location_consent_mode IN ('off', 'approximate', 'precise')),
ADD COLUMN IF NOT EXISTS location_consent_granted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS location_last_updated_at TIMESTAMPTZ;

-- ============================================================================
-- 3. RLS POLICIES FOR CONSENT LOGS
-- ============================================================================

-- Enable RLS
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own consent logs
CREATE POLICY consent_logs_select_own ON consent_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can insert consent logs (no direct user inserts)
CREATE POLICY consent_logs_insert_system ON consent_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admins can view all consent logs (for audit/DSAR)
CREATE POLICY consent_logs_select_admin ON consent_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 4. HELPER FUNCTIONS
-- ============================================================================

-- Function: Log consent action
CREATE OR REPLACE FUNCTION log_consent_action(
  p_user_id UUID,
  p_consent_type TEXT,
  p_consent_action TEXT,
  p_consent_value JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO consent_logs (
    user_id,
    consent_type,
    consent_action,
    consent_value,
    ip_address,
    user_agent
  )
  VALUES (
    p_user_id,
    p_consent_type,
    p_consent_action,
    p_consent_value,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- Function: Update location consent mode
CREATE OR REPLACE FUNCTION update_location_consent(
  p_user_id UUID,
  p_mode TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_previous_mode TEXT;
  v_action TEXT;
BEGIN
  -- Validate mode
  IF p_mode NOT IN ('off', 'approximate', 'precise') THEN
    RAISE EXCEPTION 'Invalid location mode: %', p_mode;
  END IF;

  -- Get previous mode
  SELECT location_consent_mode INTO v_previous_mode
  FROM profiles
  WHERE id = p_user_id;

  -- Determine action
  IF v_previous_mode = 'off' AND p_mode != 'off' THEN
    v_action := 'granted';
  ELSIF v_previous_mode != 'off' AND p_mode = 'off' THEN
    v_action := 'revoked';
  ELSIF v_previous_mode != p_mode THEN
    v_action := 'updated';
  ELSE
    v_action := 'unchanged';
  END IF;

  -- Update profile
  UPDATE profiles
  SET 
    location_consent_mode = p_mode,
    location_consent_granted_at = CASE 
      WHEN p_mode != 'off' AND v_previous_mode = 'off' THEN NOW()
      WHEN p_mode = 'off' THEN NULL
      ELSE location_consent_granted_at
    END,
    location_last_updated_at = NOW(),
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Log consent action (only if changed)
  IF v_action != 'unchanged' THEN
    PERFORM log_consent_action(
      p_user_id,
      'location',
      v_action,
      jsonb_build_object('mode', p_mode, 'previous_mode', v_previous_mode),
      p_ip_address,
      p_user_agent
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'mode', p_mode,
    'action', v_action,
    'previous_mode', v_previous_mode
  );
END;
$$;

-- Function: Get user consent summary
CREATE OR REPLACE FUNCTION get_user_consent_summary(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_summary JSONB;
  v_profile RECORD;
BEGIN
  -- Get profile data
  SELECT 
    location_consent_mode,
    location_consent_granted_at,
    location_last_updated_at
  INTO v_profile
  FROM profiles
  WHERE id = p_user_id;

  -- Build summary
  v_summary := jsonb_build_object(
    'location', jsonb_build_object(
      'mode', v_profile.location_consent_mode,
      'granted_at', v_profile.location_consent_granted_at,
      'last_updated_at', v_profile.location_last_updated_at
    )
  );

  RETURN v_summary;
END;
$$;

-- Function: Revoke all consents (for account deletion)
CREATE OR REPLACE FUNCTION revoke_all_consents(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Revoke location consent
  UPDATE profiles
  SET 
    location_consent_mode = 'off',
    location_consent_granted_at = NULL,
    location_last_updated_at = NOW()
  WHERE id = p_user_id;

  -- Log revocation
  PERFORM log_consent_action(
    p_user_id,
    'location',
    'revoked',
    jsonb_build_object('reason', 'account_deletion'),
    NULL,
    NULL
  );
END;
$$;

-- ============================================================================
-- 5. COMMENTS
-- ============================================================================

COMMENT ON TABLE consent_logs IS 'GDPR audit log for all consent actions';
COMMENT ON COLUMN profiles.location_consent_mode IS 'Location sharing mode: off (no tracking), approximate (city-level), precise (GPS)';
COMMENT ON FUNCTION log_consent_action IS 'Logs a consent action for audit trail';
COMMENT ON FUNCTION update_location_consent IS 'Updates user location consent mode and logs action';
COMMENT ON FUNCTION get_user_consent_summary IS 'Returns summary of all user consents';
COMMENT ON FUNCTION revoke_all_consents IS 'Revokes all user consents (used for account deletion)';
