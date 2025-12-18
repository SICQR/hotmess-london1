-- =========================================================
-- DEBUG PRODUCT PAGE ISSUE
-- Run this to diagnose why products aren't loading
-- =========================================================

-- 1. Check if listings table exists and has data
SELECT 
  'Total listings' as check_name,
  COUNT(*)::text as result
FROM public.market_listings
UNION ALL
SELECT 
  'Active listings',
  COUNT(*)::text
FROM public.market_listings
WHERE status = 'active'
UNION ALL
SELECT 
  'Listings with slugs',
  COUNT(slug)::text
FROM public.market_listings
UNION ALL
SELECT 
  'Listings without slugs',
  (COUNT(*) - COUNT(slug))::text
FROM public.market_listings;

-- 2. Show first 5 active listings with all details
SELECT 
  id,
  title,
  slug,
  status,
  price_pence,
  quantity_available,
  seller_id,
  created_at
FROM public.market_listings
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check RLS policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  SUBSTRING(qual::text, 1, 100) as policy_check
FROM pg_policies
WHERE tablename = 'market_listings';

-- 4. Test the exact query the frontend uses (with a sample slug)
-- Replace 'YOUR_SLUG_HERE' with an actual slug from step 2
SELECT 
  l.id,
  l.title,
  l.slug,
  l.description,
  l.price_pence,
  l.currency,
  l.status,
  l.fulfilment_mode,
  l.quantity_available,
  l.category,
  l.tags,
  l.created_at,
  s.id as seller_id,
  s.display_name as seller_name,
  s.status as seller_status,
  s.white_label_enabled
FROM public.market_listings l
LEFT JOIN public.market_sellers s ON s.id = l.seller_id
WHERE l.status = 'active'
  AND l.slug = 'YOUR_SLUG_HERE'  -- Replace with actual slug
LIMIT 1;

-- 5. If slugs are NULL, try searching by ID
-- Replace 'YOUR_UUID_HERE' with an actual ID from step 2
SELECT 
  l.id,
  l.title,
  l.slug,
  l.status
FROM public.market_listings l
WHERE l.status = 'active'
  AND l.id = 'YOUR_UUID_HERE'::uuid  -- Replace with actual UUID
LIMIT 1;

-- 6. Check seller relationships
SELECT 
  l.id,
  l.title,
  l.slug,
  l.seller_id,
  s.display_name as seller_name,
  CASE 
    WHEN s.id IS NULL THEN '❌ ORPHANED (no seller)'
    ELSE '✅ OK'
  END as relationship_status
FROM public.market_listings l
LEFT JOIN public.market_sellers s ON s.id = l.seller_id
WHERE l.status = 'active'
ORDER BY l.created_at DESC;
