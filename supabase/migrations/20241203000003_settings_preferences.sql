-- Migration: Add settings preferences to profiles table
-- Date: 2024-12-03
-- Purpose: Support user settings page (GDPR compliance)

-- Add notification preferences column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "email_marketing": true,
  "email_updates": true,
  "email_tickets": true,
  "push_beacons": true,
  "push_messages": true,
  "push_drops": true
}'::jsonb;

-- Add privacy preferences column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS privacy_preferences JSONB DEFAULT '{
  "profile_public": true,
  "show_location": true,
  "show_xp": true,
  "show_streaks": true
}'::jsonb;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_notification_prefs 
ON profiles USING GIN (notification_preferences);

CREATE INDEX IF NOT EXISTS idx_profiles_privacy_prefs 
ON profiles USING GIN (privacy_preferences);

-- Update RLS policies to respect privacy settings
-- (Users can always read their own data, but public read depends on privacy settings)

-- Comments
COMMENT ON COLUMN profiles.notification_preferences IS 'User notification preferences for email and push notifications';
COMMENT ON COLUMN profiles.privacy_preferences IS 'User privacy settings controlling profile visibility';
