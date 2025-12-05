-- ============================================================================
-- VERIFY DEMO CLUB EXISTS
-- Run this to check if the demo club was seeded
-- ============================================================================

-- Check if demo club exists
SELECT 
  id,
  name,
  slug,
  status,
  verified,
  onboarding_complete,
  default_capacity,
  created_at
FROM clubs 
WHERE slug = 'default';

-- If the above returns no rows, run this to create it:
/*
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
*/

-- Then verify it was created:
SELECT 'Demo club created successfully!' as message
WHERE EXISTS (SELECT 1 FROM clubs WHERE slug = 'default');
