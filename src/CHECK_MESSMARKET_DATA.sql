-- =========================================================
-- CHECK MESSMARKET DATA
-- Run this in Supabase SQL Editor to verify your test data
-- =========================================================

-- 1. Check if tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('market_sellers', 'market_listings', 'market_listing_media')
ORDER BY table_name;

-- 2. Check sellers
SELECT 
  id,
  display_name,
  status,
  created_at
FROM public.market_sellers
ORDER BY created_at DESC;

-- 3. Check listings (should show 11 items)
SELECT 
  id,
  title,
  slug,
  price_pence,
  quantity_available,
  category,
  status,
  seller_id,
  created_at
FROM public.market_listings
ORDER BY created_at DESC;

-- 4. Count by status
SELECT 
  status,
  COUNT(*) as count
FROM public.market_listings
GROUP BY status;

-- 5. Check if listings are connected to sellers
SELECT 
  l.title,
  l.status,
  l.price_pence / 100.0 as price_gbp,
  s.display_name as seller_name,
  s.status as seller_status
FROM public.market_listings l
LEFT JOIN public.market_sellers s ON s.id = l.seller_id
ORDER BY l.created_at DESC;

-- 6. Check RLS policies on market_listings
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'market_listings';
