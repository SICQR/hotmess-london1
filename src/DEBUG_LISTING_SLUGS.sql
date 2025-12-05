-- Check what slugs exist in the database
SELECT 
  id,
  title,
  slug,
  status,
  created_at
FROM public.market_listings
ORDER BY created_at DESC
LIMIT 20;

-- Check if any listings have NULL slugs
SELECT 
  COUNT(*) as total_listings,
  COUNT(slug) as listings_with_slug,
  COUNT(*) - COUNT(slug) as listings_without_slug
FROM public.market_listings;

-- Show first active listing
SELECT 
  id,
  title,
  slug,
  status,
  price_pence,
  quantity_available
FROM public.market_listings
WHERE status = 'active'
LIMIT 1;
