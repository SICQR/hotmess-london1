-- =========================================================
-- WHAT SCHEMA DO I HAVE?
-- Run this to see your current database setup
-- =========================================================

-- 1. Check if tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN (
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    ) THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM (VALUES 
  ('market_sellers'),
  ('market_listings'),
  ('market_listing_media'),
  ('market_orders'),
  ('market_order_items')
) AS expected(table_name);

-- 2. Show ALL columns in market_listings
SELECT 
  column_name,
  data_type,
  CASE WHEN is_nullable = 'YES' THEN 'NULL' ELSE 'NOT NULL' END as nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'market_listings'
ORDER BY ordinal_position;

-- 3. Check for missing expected columns
SELECT 
  expected_column,
  CASE 
    WHEN expected_column IN (
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'market_listings'
    ) THEN '✅ EXISTS'
    ELSE '❌ MISSING - run scripts/FIX_ALL_MISSING_COLUMNS.sql'
  END as status
FROM (VALUES 
  ('id'),
  ('seller_id'),
  ('slug'),
  ('title'),
  ('description'),
  ('price_pence'),
  ('currency'),
  ('status'),
  ('fulfilment_mode'),
  ('quantity_available'),
  ('category'),
  ('tags'),
  ('created_at')
) AS expected(expected_column);

-- 4. Show sample listing data
SELECT 
  id,
  title,
  slug,
  status,
  price_pence
FROM public.market_listings
LIMIT 3;

-- 5. Check which migration you're on
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = 'market_listings'
        AND column_name = 'currency'
    ) THEN '✅ Using NEW schema (commerce_architecture.sql)'
    ELSE '⚠️ Using OLD schema - run /FIX_ALL_MISSING_COLUMNS.sql or /PASTE_INTO_SUPABASE.sql'
  END as schema_version;
