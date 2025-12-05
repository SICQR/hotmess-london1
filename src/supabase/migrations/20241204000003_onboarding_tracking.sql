-- ============================================================================
-- ONBOARDING TRACKING
-- ============================================================================
-- Tracks first-run onboarding completion
-- Date: December 4, 2024

-- Add onboarding tracking to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON profiles(onboarding_completed, created_at);

-- Comment
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether user has completed first-run onboarding';
COMMENT ON COLUMN profiles.onboarding_completed_at IS 'Timestamp when onboarding was completed';
