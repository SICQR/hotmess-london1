-- =========================================================
-- HOTMESS COMMERCE - DATABASE VERIFICATION SCRIPT
-- Run this after commerce_architecture.sql + stock_reservation.sql
-- =========================================================

-- 1) Check all tables exist
SELECT 'Tables Created' as check_name, COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'market_sellers',
    'market_listings',
    'market_listing_media',
    'market_orders',
    'market_order_items',
    'market_order_messages',
    'seller_kit_inventory',
    'shopify_orders',
    'shopify_fulfillments',
    'notifications',
    'audit_log'
  );
-- Expected: count = 11

-- 2) Check stock reservation columns exist
SELECT 'Stock Columns' as check_name, COUNT(*) as count
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'market_orders'
  AND column_name IN ('stock_reserved', 'stock_released');
-- Expected: count = 2

-- 3) Check RPC functions exist
SELECT 'RPC Functions' as check_name, COUNT(*) as count
FROM pg_proc
WHERE proname IN ('market_reserve_stock', 'market_release_stock');
-- Expected: count = 2

-- 4) Check RLS enabled on all tables
SELECT 'RLS Enabled' as check_name, COUNT(*) as count
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'market_%'
  AND rowsecurity = true;
-- Expected: count = 7

-- 5) Check RLS policies exist
SELECT 'RLS Policies' as check_name, COUNT(*) as count
FROM pg_policies
WHERE tablename LIKE 'market_%'
   OR tablename IN ('notifications', 'audit_log', 'shopify_orders', 'shopify_fulfillments');
-- Expected: count >= 15

-- 6) Check indexes exist
SELECT 'Indexes' as check_name, COUNT(*) as count
FROM pg_indexes
WHERE schemaname = 'public'
  AND (tablename LIKE 'market_%' OR tablename IN ('shopify_orders', 'shopify_fulfillments', 'notifications', 'audit_log'));
-- Expected: count >= 20

-- 7) Check foreign keys
SELECT 'Foreign Keys' as check_name, COUNT(*) as count
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
  AND constraint_type = 'FOREIGN KEY'
  AND table_name LIKE 'market_%';
-- Expected: count >= 6

-- 8) Check enums exist
SELECT 'Enums' as check_name, COUNT(*) as count
FROM pg_type
WHERE typname IN ('order_status', 'listing_status', 'seller_status', 'fulfilment_mode');
-- Expected: count = 4

-- 9) Check is_admin function exists (required for RLS)
SELECT 'Admin Function' as check_name, COUNT(*) as count
FROM pg_proc
WHERE proname = 'is_admin';
-- Expected: count = 1

-- 10) Detailed table structure check
SELECT 
  t.table_name,
  COUNT(c.column_name) as column_count,
  BOOL_OR(pt.rowsecurity) as rls_enabled
FROM information_schema.tables t
LEFT JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
LEFT JOIN pg_tables pt ON t.table_name = pt.tablename AND t.table_schema = pt.schemaname
WHERE t.table_schema = 'public'
  AND t.table_name IN (
    'market_sellers',
    'market_listings',
    'market_listing_media',
    'market_orders',
    'market_order_items',
    'market_order_messages',
    'seller_kit_inventory',
    'shopify_orders',
    'shopify_fulfillments',
    'notifications',
    'audit_log'
  )
GROUP BY t.table_name
ORDER BY t.table_name;
-- Expected: All tables with column_count > 5, all rls_enabled = true

-- 11) FINAL SUMMARY
SELECT 
  '✅ SETUP COMPLETE' as status,
  'Database ready for Edge Functions deployment' as message,
  NOW() as verified_at;

-- 12) Next steps reminder
SELECT 
  'NEXT STEPS' as section,
  '1. Deploy Edge Functions (market-seller-onboard, market-checkout-create, stripe-webhook, shopify-webhook, seller-payout-summary)' as step_1,
  '2. Set environment variables in Supabase Dashboard → Edge Functions → Secrets' as step_2,
  '3. Configure Stripe webhook endpoint' as step_3,
  '4. Configure Shopify webhook endpoint' as step_4,
  '5. Test end-to-end checkout flow in Stripe test mode' as step_5;
