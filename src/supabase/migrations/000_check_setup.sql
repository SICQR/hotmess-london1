-- =========================================================
-- CHECK IF DATABASE IS SET UP
-- Run this to see if you need to run the setup scripts
-- =========================================================

-- Check if commerce tables exist
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'market_listings'
    ) 
    THEN '✅ Database is set up'
    ELSE '❌ Database NOT set up - Run commerce_architecture.sql first'
  END as setup_status;

-- If tables exist, show table details
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'market_listings'
  ) THEN
    -- Show all commerce tables
    RAISE NOTICE '--- TABLES FOUND ---';
    RAISE NOTICE 'Run this query to see all tables:';
    RAISE NOTICE 'SELECT table_name FROM information_schema.tables WHERE table_schema = ''public'' AND table_name LIKE ''market_%%'';';
  ELSE
    RAISE NOTICE '--- DATABASE NOT SET UP ---';
    RAISE NOTICE '1. Run /supabase/migrations/commerce_architecture.sql';
    RAISE NOTICE '2. Run /supabase/migrations/stock_reservation.sql';
    RAISE NOTICE '3. Run /supabase/migrations/999_verify_setup.sql';
  END IF;
END $$;

-- Show detailed status
SELECT 
  'Tables' as component,
  COUNT(*) as count,
  CASE WHEN COUNT(*) >= 11 THEN '✅' ELSE '❌' END as status
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
  )

UNION ALL

SELECT 
  'Functions' as component,
  COUNT(*) as count,
  CASE WHEN COUNT(*) >= 2 THEN '✅' ELSE '❌' END as status
FROM pg_proc
WHERE proname IN ('market_reserve_stock', 'market_release_stock')

UNION ALL

SELECT 
  'Foreign Keys' as component,
  COUNT(*) as count,
  CASE WHEN COUNT(*) >= 1 THEN '✅' ELSE '❌' END as status
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
  AND constraint_type = 'FOREIGN KEY'
  AND constraint_name = 'market_listings_seller_id_fkey';
