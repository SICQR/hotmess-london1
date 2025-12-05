-- ============================================================================
-- COOKIE PREFERENCES SYSTEM
-- ============================================================================
-- Adds cookie consent tracking to profiles table
-- Date: December 4, 2024

-- Add cookie preferences column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS cookie_preferences JSONB DEFAULT jsonb_build_object(
  'essential', true,
  'analytics', false,
  'marketing', false,
  'functional', false
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_cookie_preferences ON profiles USING GIN (cookie_preferences);

-- Comment
COMMENT ON COLUMN profiles.cookie_preferences IS 'User cookie consent preferences (essential/analytics/marketing/functional)';
