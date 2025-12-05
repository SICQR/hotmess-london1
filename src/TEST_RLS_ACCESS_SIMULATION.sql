-- ========================================
-- RLS ACCESS SIMULATION (OPTIONAL)
-- Run AFTER catalog checks pass
-- ========================================

-- ⚠️ IMPORTANT: These tests are READ-ONLY and safe to run
-- They simulate what different users would see without modifying data

-- ========================================
-- 🌍 TEST 1: Anonymous (unauthenticated) User Access
-- ========================================

-- Reset to anonymous user (no auth)
RESET request.jwt.claim.sub;
RESET request.jwt.claims;
RESET ROLE;

-- What can anonymous users see?

-- Should see ONLY active listings
SELECT 
  'Anonymous User' AS test_scenario,
  'market_listings' AS table_tested,
  COUNT(*) AS visible_rows,
  string_agg(DISTINCT status::text, ', ') AS statuses_visible
FROM market_listings;

-- Expected: Only active listings visible
-- If 0 rows: Either no active listings exist OR RLS is too restrictive
-- If shows draft/archived: RLS policy is broken

-- Should see ONLY media for active listings
SELECT 
  'Anonymous User' AS test_scenario,
  'market_listing_media' AS table_tested,
  COUNT(DISTINCT mlm.id) AS visible_media,
  COUNT(DISTINCT ml.id) AS listings_with_media
FROM market_listing_media mlm
JOIN market_listings ml ON ml.id = mlm.listing_id;

-- Expected: Only media for active listings visible

-- Should see NO sellers (not public data)
SELECT 
  'Anonymous User' AS test_scenario,
  'market_sellers' AS table_tested,
  COUNT(*) AS visible_rows
FROM market_sellers;

-- Expected: 0 rows (seller profiles are not public)

-- Should see NO orders (not public data)
SELECT 
  'Anonymous User' AS test_scenario,
  'market_orders' AS table_tested,
  COUNT(*) AS visible_rows
FROM market_orders;

-- Expected: 0 rows (orders are private)

-- ========================================
-- 🔓 TEST 2: Authenticated User (Non-Seller) Access
-- ========================================

-- 📝 REPLACE WITH A REAL USER UUID FROM YOUR DATABASE
-- Get one with: SELECT id FROM auth.users LIMIT 1;

DO $$
DECLARE
  test_user_id uuid := 'PASTE-USER-UUID-HERE'::uuid;  -- ⬅️ REPLACE THIS
BEGIN
  -- Simulate authenticated user
  PERFORM set_config('request.jwt.claim.sub', test_user_id::text, true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', test_user_id)::text, true);
END $$;

-- What can authenticated (but not seller) users see?

-- Should still see only active listings
SELECT 
  'Authenticated User (Non-Seller)' AS test_scenario,
  'market_listings' AS table_tested,
  COUNT(*) AS visible_rows,
  string_agg(DISTINCT status::text, ', ') AS statuses_visible
FROM market_listings;

-- Expected: Only active listings (same as anonymous)

-- Should see their own seller profile IF they have one
SELECT 
  'Authenticated User (Non-Seller)' AS test_scenario,
  'market_sellers' AS table_tested,
  COUNT(*) AS visible_rows
FROM market_sellers;

-- Expected: 0 rows (this user is not a seller)
-- If they ARE a seller, will show 1 row

-- Should see their own orders
SELECT 
  'Authenticated User (Non-Seller)' AS test_scenario,
  'market_orders' AS table_tested,
  COUNT(*) AS my_purchases,
  COUNT(*) FILTER (WHERE buyer_id = current_setting('request.jwt.claim.sub')::uuid) AS confirmed_mine
FROM market_orders;

-- Expected: Only orders where buyer_id matches test user

RESET request.jwt.claim.sub;
RESET request.jwt.claims;

-- ========================================
-- 👤 TEST 3: Seller Access
-- ========================================

-- 📝 REPLACE WITH A REAL SELLER USER UUID
-- Get one with: SELECT owner_id FROM market_sellers LIMIT 1;

DO $$
DECLARE
  seller_user_id uuid := 'PASTE-SELLER-UUID-HERE'::uuid;  -- ⬅️ REPLACE THIS
BEGIN
  PERFORM set_config('request.jwt.claim.sub', seller_user_id::text, true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', seller_user_id)::text, true);
END $$;

-- What can sellers see?

-- Should see active listings + their own drafts
SELECT 
  'Seller User' AS test_scenario,
  'market_listings' AS table_tested,
  COUNT(*) AS total_visible,
  COUNT(*) FILTER (WHERE status = 'active') AS active_listings,
  COUNT(*) FILTER (WHERE status = 'draft') AS draft_listings,
  COUNT(*) FILTER (
    WHERE seller_id IN (
      SELECT id FROM market_sellers 
      WHERE owner_id = current_setting('request.jwt.claim.sub')::uuid
    )
  ) AS my_own_listings
FROM market_listings;

-- Expected: See all active + their own drafts
-- my_own_listings should be > 0 for this seller

-- Should see their own seller profile
SELECT 
  'Seller User' AS test_scenario,
  'market_sellers' AS table_tested,
  COUNT(*) AS visible_profiles,
  MAX(display_name) AS my_seller_name,
  MAX(status) AS my_status
FROM market_sellers
WHERE owner_id = current_setting('request.jwt.claim.sub')::uuid;

-- Expected: 1 row (their own profile)

-- Should see orders for their products
SELECT 
  'Seller User' AS test_scenario,
  'market_orders' AS table_tested,
  COUNT(*) AS visible_orders,
  COUNT(*) FILTER (
    WHERE seller_id IN (
      SELECT id FROM market_sellers 
      WHERE owner_id = current_setting('request.jwt.claim.sub')::uuid
    )
  ) AS my_sales
FROM market_orders;

-- Expected: Only orders for their products

RESET request.jwt.claim.sub;
RESET request.jwt.claims;

-- ========================================
-- 👑 TEST 4: Admin Access
-- ========================================

-- 📝 REPLACE WITH AN ADMIN USER UUID
-- First make someone admin:
-- UPDATE profiles SET role = 'admin' 
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
--
-- Then get their ID:
-- SELECT user_id FROM profiles WHERE role = 'admin' LIMIT 1;

DO $$
DECLARE
  admin_user_id uuid := 'PASTE-ADMIN-UUID-HERE'::uuid;  -- ⬅️ REPLACE THIS
BEGIN
  PERFORM set_config('request.jwt.claim.sub', admin_user_id::text, true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', admin_user_id)::text, true);
END $$;

-- What can admins see?

-- Should see ALL listings (active, draft, archived, etc.)
SELECT 
  'Admin User' AS test_scenario,
  'market_listings' AS table_tested,
  COUNT(*) AS total_visible,
  COUNT(*) FILTER (WHERE status = 'active') AS active_count,
  COUNT(*) FILTER (WHERE status = 'draft') AS draft_count,
  COUNT(*) FILTER (WHERE status = 'archived') AS archived_count,
  string_agg(DISTINCT status::text, ', ') AS all_statuses
FROM market_listings;

-- Expected: ALL listings regardless of status

-- Should see ALL sellers
SELECT 
  'Admin User' AS test_scenario,
  'market_sellers' AS table_tested,
  COUNT(*) AS all_sellers,
  COUNT(*) FILTER (WHERE status = 'approved') AS approved,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending,
  COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
FROM market_sellers;

-- Expected: ALL seller profiles

-- Should see ALL orders
SELECT 
  'Admin User' AS test_scenario,
  'market_orders' AS table_tested,
  COUNT(*) AS all_orders,
  COUNT(DISTINCT buyer_id) AS unique_buyers,
  COUNT(DISTINCT seller_id) AS unique_sellers
FROM market_orders;

-- Expected: ALL orders in the system

-- Verify is_admin() returns true
SELECT 
  'Admin User' AS test_scenario,
  'is_admin()' AS function_tested,
  public.is_admin() AS returns_true
FROM dual;

-- Expected: returns_true = true

RESET request.jwt.claim.sub;
RESET request.jwt.claims;
RESET ROLE;

-- ========================================
-- 📊 SUMMARY TEST MATRIX
-- ========================================

-- Run this to see a summary of what each role should access

WITH access_matrix AS (
  SELECT 'Anonymous' AS role, 'market_listings' AS table_name, 
         'Active only' AS expected_access, '🌍 Public' AS permission_level
  UNION ALL
  SELECT 'Anonymous', 'market_sellers', 'None', '🔒 Private'
  UNION ALL
  SELECT 'Anonymous', 'market_orders', 'None', '🔒 Private'
  UNION ALL
  
  SELECT 'Authenticated (Non-Seller)', 'market_listings', 'Active only', '🌍 Public'
  UNION ALL
  SELECT 'Authenticated (Non-Seller)', 'market_sellers', 'None', '🔒 Private'
  UNION ALL
  SELECT 'Authenticated (Non-Seller)', 'market_orders', 'Own purchases', '👤 Own Data'
  UNION ALL
  
  SELECT 'Seller', 'market_listings', 'Active + Own Drafts', '👤 Own + Public'
  UNION ALL
  SELECT 'Seller', 'market_sellers', 'Own profile', '👤 Own Data'
  UNION ALL
  SELECT 'Seller', 'market_orders', 'Own sales', '👤 Own Data'
  UNION ALL
  
  SELECT 'Admin', 'market_listings', 'All', '👑 Full Access'
  UNION ALL
  SELECT 'Admin', 'market_sellers', 'All', '👑 Full Access'
  UNION ALL
  SELECT 'Admin', 'market_orders', 'All', '👑 Full Access'
)
SELECT 
  role,
  table_name,
  expected_access AS "What They See",
  permission_level AS "Access Level"
FROM access_matrix
ORDER BY 
  CASE role
    WHEN 'Anonymous' THEN 1
    WHEN 'Authenticated (Non-Seller)' THEN 2
    WHEN 'Seller' THEN 3
    WHEN 'Admin' THEN 4
  END,
  table_name;

-- ========================================
-- 🎯 WHAT TO SHARE WITH ME:
-- ========================================

/*
BEFORE running these tests, you need:

1. ✅ Catalog checks passed (/VERIFY_RLS_CATALOG.sql)
2. 📝 Real UUIDs to test with:
   - Get a regular user: SELECT id FROM auth.users WHERE email != 'admin@example.com' LIMIT 1;
   - Get a seller: SELECT owner_id FROM market_sellers LIMIT 1;
   - Get an admin: SELECT user_id FROM profiles WHERE role = 'admin' LIMIT 1;

3. Replace the 'PASTE-UUID-HERE' placeholders in this file

AFTER running:
Share any unexpected results:
- Anonymous users seeing private data (❌ BAD)
- Sellers NOT seeing their own listings (❌ BAD)
- Admins NOT seeing everything (❌ BAD)
- Any permission denied errors (⚠️ INVESTIGATE)

If all tests pass as expected:
✅ RLS is working correctly!
✅ Security is properly configured!
✅ Ready for production!
*/

-- ========================================
-- 🔧 TROUBLESHOOTING COMMON ISSUES
-- ========================================

/*
ISSUE: "permission denied for table market_listings"
Cause: RLS is enabled but no policies match the current user
Fix: Check policies exist (STEP 5 of catalog check)

ISSUE: Anonymous users see ALL listings (including drafts)
Cause: listing_select_public policy is too permissive
Fix: Check USING clause requires status='active'

ISSUE: Sellers can't see their own drafts
Cause: Policy missing OR seller_id doesn't match
Fix: Check seller_id in listings matches market_sellers.id

ISSUE: is_admin() returns NULL or false for admin users
Cause: profiles.role not set to 'admin'
Fix: UPDATE profiles SET role = 'admin' WHERE user_id = 'your-uuid';

ISSUE: Can't simulate authenticated access
Cause: request.jwt.claim.sub not recognized
Fix: This is a Supabase limitation - test with real logged-in users instead
*/
