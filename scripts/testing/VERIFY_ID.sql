-- ================================================
-- VERIFY ID: 955b675f-e135-41af-8d90-ee69da127800
-- ================================================
-- Run this in Supabase SQL Editor to check what type of ID this is

-- Check if it's a CLUB
SELECT 
  'CLUB' as type,
  id,
  name,
  slug,
  stripe_account_id,
  onboarding_complete,
  total_tickets_sold,
  total_revenue / 100.0 as total_revenue_gbp,
  created_at
FROM clubs 
WHERE id = '955b675f-e135-41af-8d90-ee69da127800'

UNION ALL

-- Check if it's an EVENT
SELECT 
  'EVENT' as type,
  id,
  name,
  slug,
  club_id::text,
  tickets_sold::text,
  revenue / 100.0,
  start_time::text,
  created_at
FROM club_events 
WHERE id = '955b675f-e135-41af-8d90-ee69da127800'

UNION ALL

-- Check if it's a TICKET
SELECT 
  'TICKET' as type,
  id,
  qr_code,
  tier,
  event_id::text,
  status,
  price / 100.0,
  purchased_at::text,
  created_at
FROM club_tickets 
WHERE id = '955b675f-e135-41af-8d90-ee69da127800';

-- ================================================
-- INTERPRETATION:
-- ================================================

-- If result shows "CLUB":
--   1. This is a club/venue ID
--   2. To test payments, you need to:
--      a) Find an event in this club
--      b) Use that event ID in purchase URL
--   3. Check if stripe_account_id is set (Connect setup)

-- If result shows "EVENT":
--   1. This is an event ID ✅
--   2. Perfect for testing!
--   3. Use this URL:
--      /tickets/purchase?event=955b675f-e135-41af-8d90-ee69da127800&tier=ga

-- If result shows "TICKET":
--   1. This is a ticket ID
--   2. This ticket already exists
--   3. Check the QR code and status
--   4. Use the event_id to buy another ticket

-- If no results:
--   1. This ID doesn't exist in the database
--   2. Use the default demo club instead:
--      /club/default
--   3. Then click on any event to purchase

-- ================================================
-- NEXT STEPS BASED ON RESULT:
-- ================================================

-- After running the query above, run the appropriate query below:

-- ================================================
-- IF IT'S A CLUB - Find events in this club
-- ================================================
/*
SELECT 
  id,
  name,
  slug,
  tickets_sold,
  revenue / 100.0 as revenue_gbp,
  start_time,
  end_time
FROM club_events
WHERE club_id = '955b675f-e135-41af-8d90-ee69da127800'
ORDER BY start_time DESC;

-- Then use one of the event IDs in:
-- /tickets/purchase?event=<event_id>&tier=ga
*/

-- ================================================
-- IF IT'S AN EVENT - Get event details
-- ================================================
/*
SELECT 
  e.id as event_id,
  e.name as event_name,
  e.slug,
  e.tickets_sold,
  e.revenue / 100.0 as revenue_gbp,
  e.start_time,
  e.end_time,
  c.id as club_id,
  c.name as club_name,
  c.stripe_account_id,
  c.onboarding_complete
FROM club_events e
JOIN clubs c ON e.club_id = c.id
WHERE e.id = '955b675f-e135-41af-8d90-ee69da127800';

-- Check if venue has Stripe Connect setup:
-- - stripe_account_id should NOT be NULL
-- - onboarding_complete should be TRUE
-- 
-- If NULL, create Connect account first:
-- See /YOURE_LIVE.md "Troubleshooting" section
*/

-- ================================================
-- IF IT'S A TICKET - View ticket details
-- ================================================
/*
SELECT 
  t.id as ticket_id,
  t.qr_code,
  t.tier,
  t.status,
  t.price / 100.0 as price_gbp,
  t.purchased_at,
  e.id as event_id,
  e.name as event_name,
  c.name as club_name
FROM club_tickets t
JOIN club_events e ON t.event_id = e.id
JOIN clubs c ON e.club_id = c.id
WHERE t.id = '955b675f-e135-41af-8d90-ee69da127800';

-- To buy another ticket for this event:
-- /tickets/purchase?event=<event_id>&tier=ga
*/

-- ================================================
-- DEMO CLUB - If ID doesn't exist
-- ================================================
/*
-- Find the default demo club
SELECT 
  id,
  name,
  slug,
  stripe_account_id,
  onboarding_complete
FROM clubs
WHERE slug = 'default'
   OR name ILIKE '%demo%'
   OR name ILIKE '%test%'
LIMIT 1;

-- Find events in demo club
SELECT 
  id,
  name,
  slug,
  start_time
FROM club_events
WHERE club_id = (SELECT id FROM clubs WHERE slug = 'default' LIMIT 1)
ORDER BY start_time DESC
LIMIT 5;

-- Use one of these event IDs to test purchase
*/

-- ================================================
-- QUICK TEST - Get any working event
-- ================================================
/*
-- Just get ANY event that's ready for ticket sales
SELECT 
  e.id as event_id,
  e.name as event_name,
  e.slug,
  c.name as club_name,
  c.stripe_account_id IS NOT NULL as has_connect_setup,
  '/tickets/purchase?event=' || e.id || '&tier=ga' as purchase_url
FROM club_events e
JOIN clubs c ON e.club_id = c.id
WHERE c.stripe_account_id IS NOT NULL  -- Venue has Connect setup
  AND e.start_time > NOW()              -- Future event
ORDER BY e.created_at DESC
LIMIT 1;

-- Use the purchase_url from the result!
*/
