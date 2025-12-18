-- ========================================
-- RLS VERIFICATION QUERIES
-- Run these in Supabase SQL Editor
-- ========================================

-- ✅ STEP 1: Check RLS is enabled on all market_* tables
-- Expected: All should show rowsecurity = true

SELECT 
  schemaname,
  tablename,
  rowsecurity AS rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED' 
    ELSE '❌ DISABLED' 
  END AS status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'market_%'
ORDER BY tablename;

-- Expected result:
-- All tables should have rls_enabled = true
-- market_sellers, market_listings, market_listing_media, 
-- market_orders, market_order_items, market_order_messages,
-- market_shipments, market_disputes, market_dispute_messages

-- ========================================

-- ✅ STEP 2: List all policies on market_* tables with details
-- Shows policy name, command type, and whether USING/WITH CHECK exist

SELECT 
  tablename,
  policyname,
  cmd AS command,
  CASE 
    WHEN cmd = 'SELECT' THEN '🔍 Read'
    WHEN cmd = 'INSERT' THEN '➕ Create'
    WHEN cmd = 'UPDATE' THEN '✏️ Modify'
    WHEN cmd = 'DELETE' THEN '🗑️ Delete'
    WHEN cmd = '*' THEN '🔓 All Ops'
  END AS operation,
  CASE WHEN qual IS NOT NULL THEN '✅ Has USING' ELSE '⚠️ No USING' END AS using_clause,
  CASE WHEN with_check IS NOT NULL THEN '✅ Has WITH CHECK' ELSE '⚠️ No WITH CHECK' END AS with_check_clause,
  permissive AS is_permissive,
  roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename LIKE 'market_%'
ORDER BY tablename, cmd, policyname;

-- Expected: Multiple policies per table
-- market_sellers should have: seller_select_own, seller_insert_own, seller_update_own
-- market_listings should have: listing_select_public, listing_insert_seller, listing_update_seller
-- market_listing_media should have: media_select_follow_listing, media_write_seller

-- ========================================

-- ✅ STEP 3: Detailed policy definitions (see actual SQL)
-- This shows the exact USING and WITH CHECK conditions

SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  pg_get_expr(qual, c.oid) AS using_expression,
  pg_get_expr(with_check, c.oid) AS with_check_expression
FROM pg_policies p
JOIN pg_class c ON c.relname = p.tablename
WHERE p.schemaname = 'public'
  AND p.tablename LIKE 'market_%'
ORDER BY p.tablename, p.cmd, p.policyname;

-- This will show the actual SQL conditions for each policy
-- Review to ensure they match expectations from /RLS_POLICIES_SUMMARY.md

-- ========================================

-- ✅ STEP 4: Check is_admin() function exists
-- Expected: Should return the function definition

SELECT 
  proname AS function_name,
  pg_get_functiondef(oid) AS definition
FROM pg_proc
WHERE proname = 'is_admin'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Expected: Function should check profiles table for role='admin'

-- ========================================

-- ✅ STEP 5: Count policies per table (summary view)
-- Expected: Each table should have at least 1-3 policies

SELECT 
  tablename,
  COUNT(*) AS policy_count,
  string_agg(DISTINCT cmd::text, ', ') AS operations_covered
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename LIKE 'market_%'
GROUP BY tablename
ORDER BY tablename;

-- Expected results:
-- market_sellers: 3 policies (SELECT, INSERT, UPDATE)
-- market_listings: 3 policies (SELECT, INSERT, UPDATE)
-- market_listing_media: 2 policies (SELECT, *)
-- market_orders: 3-4 policies
-- market_order_items: 1-2 policies
-- etc.

-- ========================================

-- ✅ STEP 6: Check if any market_* tables are MISSING policies
-- Expected: Should return 0 rows (all tables should have policies)

SELECT 
  t.tablename,
  '⚠️ NO POLICIES!' AS warning,
  t.rowsecurity AS rls_enabled
FROM pg_tables t
LEFT JOIN (
  SELECT tablename, COUNT(*) AS policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename LIKE 'market_%'
  GROUP BY tablename
) p ON p.tablename = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename LIKE 'market_%'
  AND (p.policy_count IS NULL OR p.policy_count = 0)
ORDER BY t.tablename;

-- Expected: 0 rows (all tables should have at least one policy)
-- If any tables show up here, they need policies added!

-- ========================================

-- ✅ STEP 7: Security audit - Public read access check
-- Shows which tables/policies allow public (unauthenticated) access

SELECT 
  tablename,
  policyname,
  cmd,
  roles,
  CASE 
    WHEN 'public' = ANY(roles) OR roles = '{public}' 
    THEN '🌍 PUBLIC ACCESS' 
    ELSE '🔒 Auth Required' 
  END AS access_level
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename LIKE 'market_%'
ORDER BY access_level DESC, tablename;

-- Expected: Most policies should require authentication
-- Only listing_select_public should allow public read for active listings

-- ========================================

-- 📊 SUMMARY: What to look for in results
-- ========================================

/*
STEP 1 - All tables should show rls_enabled = true
✅ market_sellers: true
✅ market_listings: true
✅ market_listing_media: true
✅ market_orders: true
... etc

STEP 2 - Each table should have multiple policies
✅ market_sellers: 3 policies (SELECT, INSERT, UPDATE)
✅ market_listings: 3 policies (SELECT, INSERT, UPDATE)
✅ market_listing_media: 2 policies (SELECT, *)

STEP 3 - Check USING expressions contain:
✅ owner_id = auth.uid() checks
✅ is_admin() checks
✅ EXISTS subqueries for joins

STEP 4 - is_admin() function should exist and reference profiles.role

STEP 5 - No tables should have 0 policies

STEP 6 - Tables missing policies should be empty (0 rows)

STEP 7 - Public access should be limited to:
✅ market_listings (active only)
✅ market_listing_media (for active listings)
*/

-- ========================================
-- 🎯 WHAT TO SHARE WITH ME:
-- ========================================

/*
After running these queries, share:

1. Results of STEP 1 (RLS enabled check)
2. Results of STEP 5 (policy count per table)
3. Results of STEP 6 (tables missing policies)

If everything looks good:
✅ All tables have RLS enabled
✅ All tables have policies
✅ Policy counts look reasonable

Then you're ready to test the app!

If there are issues:
❌ Tables with RLS disabled
❌ Tables with no policies
❌ Missing is_admin() function

Share the specific errors and I'll help fix them.
*/
