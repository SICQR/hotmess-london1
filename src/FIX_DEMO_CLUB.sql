-- ============================================================================
-- QUICK FIX: Create Demo Club for Club Mode
-- Run this in Supabase SQL Editor NOW
-- ============================================================================

-- Create the demo club (using ON CONFLICT to make it idempotent)
INSERT INTO clubs (
  name,
  slug,
  description,
  city_slug,
  lat,
  lng,
  status,
  verified,
  onboarding_complete,
  payouts_enabled,
  default_capacity,
  default_age_restriction,
  gender_policy,
  total_events,
  total_tickets_sold,
  total_revenue
) VALUES (
  'HOTMESS Demo Venue',
  'default',
  'Demo venue for testing Club Mode features. Navigate to /club/default to see the dashboard.',
  'london',
  51.5074,
  -0.1278,
  'active',
  true,
  true,
  false,
  500,
  18,
  'men_only',
  0,
  0,
  0
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  verified = EXCLUDED.verified,
  onboarding_complete = EXCLUDED.onboarding_complete;

-- Verify it was created
SELECT 
  '✅ Demo club ready!' as status,
  id,
  name,
  slug,
  status,
  verified
FROM clubs 
WHERE slug = 'default';
