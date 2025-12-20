-- =========================================================
-- FIX MISSING SLUGS FOR MARKET LISTINGS
-- Run this if your listings don't have slugs
-- =========================================================

-- Check current slug status
SELECT 
  id,
  title,
  slug,
  CASE 
    WHEN slug IS NULL THEN '❌ MISSING'
    ELSE '✅ OK'
  END as slug_status
FROM public.market_listings
ORDER BY created_at DESC;

-- Auto-generate slugs for listings that don't have them
-- This creates URL-safe slugs from the title
UPDATE public.market_listings
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),  -- Remove special chars
      '\s+', '-', 'g'  -- Replace spaces with hyphens
    ),
    '-+', '-', 'g'  -- Replace multiple hyphens with single
  )
)
WHERE slug IS NULL;

-- Verify all listings now have slugs
SELECT 
  COUNT(*) as total_listings,
  COUNT(slug) as listings_with_slug,
  COUNT(*) - COUNT(slug) as listings_without_slug
FROM public.market_listings;

-- Show all listings with their new slugs
SELECT 
  id,
  title,
  slug,
  status,
  price_pence / 100.0 as price_gbp
FROM public.market_listings
ORDER BY created_at DESC;
