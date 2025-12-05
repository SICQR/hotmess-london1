-- =========================================================
-- MIGRATION SCRIPT: OLD → NEW MARKETPLACE SYSTEM
-- =========================================================
-- Migrates data from messmarket_products to market_* tables
-- Run this AFTER running /PASTE_INTO_SUPABASE.sql
-- =========================================================

-- =========================================================
-- STEP 1: CREATE SELLERS FROM OLD CREATOR_IDs
-- =========================================================
-- For each unique creator_id in messmarket_products,
-- create a market_sellers row with auto-approved status

INSERT INTO public.market_sellers (
  owner_id,
  display_name,
  status,
  stripe_account_id,
  stripe_onboarding_complete,
  white_label_enabled,
  created_at
)
SELECT DISTINCT
  mp.creator_id AS owner_id,
  COALESCE(
    u.raw_user_meta_data->>'name',
    SPLIT_PART(u.email, '@', 1),
    'Seller ' || SUBSTRING(mp.creator_id::text, 1, 8)
  ) AS display_name,
  'approved'::public.seller_status AS status,  -- Auto-approve existing creators
  NULL AS stripe_account_id,  -- Will be created during onboarding
  false AS stripe_onboarding_complete,  -- User needs to complete Stripe Connect
  false AS white_label_enabled,  -- Can upgrade later
  MIN(mp.created_at) AS created_at
FROM public.messmarket_products mp
JOIN auth.users u ON u.id = mp.creator_id
WHERE mp.creator_id IS NOT NULL
  AND NOT EXISTS (
    -- Don't create duplicate sellers
    SELECT 1 FROM public.market_sellers ms
    WHERE ms.owner_id = mp.creator_id
  )
GROUP BY mp.creator_id, u.email, u.raw_user_meta_data
ORDER BY MIN(mp.created_at);

-- =========================================================
-- STEP 2: MIGRATE PRODUCTS TO LISTINGS
-- =========================================================
-- Copy all products from messmarket_products to market_listings

INSERT INTO public.market_listings (
  id,  -- Preserve IDs for URL compatibility
  seller_id,
  slug,  -- Preserve slugs for URL routing
  title,
  description,
  price_pence,
  quantity_available,
  category,
  status,
  created_at,
  updated_at
)
SELECT
  mp.id,
  ms.id AS seller_id,  -- Link to newly created seller
  mp.slug,  -- Preserve original slug
  mp.title,
  mp.description,
  mp.price_pence,
  GREATEST(mp.stock_count, 0) AS quantity_available,  -- Ensure non-negative
  COALESCE(mp.category, 'general') AS category,
  CASE 
    WHEN mp.active = true THEN 'active'::public.listing_status
    ELSE 'draft'::public.listing_status
  END AS status,
  mp.created_at,
  mp.updated_at
FROM public.messmarket_products mp
JOIN public.market_sellers ms ON ms.owner_id = mp.creator_id
WHERE NOT EXISTS (
  -- Skip if already migrated
  SELECT 1 FROM public.market_listings ml
  WHERE ml.id = mp.id
);

-- =========================================================
-- STEP 3: MIGRATE PRODUCT IMAGES TO MEDIA TABLE
-- =========================================================
-- For each product with images, create market_listing_media rows

WITH product_images AS (
  SELECT 
    mp.id AS listing_id,
    unnest(mp.images) AS image_url,
    ROW_NUMBER() OVER (PARTITION BY mp.id ORDER BY ordinality) - 1 AS sort_order
  FROM public.messmarket_products mp
  CROSS JOIN unnest(mp.images) WITH ORDINALITY
  WHERE mp.images IS NOT NULL AND array_length(mp.images, 1) > 0
)
INSERT INTO public.market_listing_media (
  listing_id,
  storage_path,
  sort,
  alt
)
SELECT
  listing_id,
  image_url AS storage_path,
  sort_order AS sort,
  'Product image' AS alt
FROM product_images
WHERE EXISTS (
  SELECT 1 FROM public.market_listings ml
  WHERE ml.id = listing_id
)
AND NOT EXISTS (
  -- Skip if already migrated
  SELECT 1 FROM public.market_listing_media mlm
  WHERE mlm.listing_id = product_images.listing_id
    AND mlm.storage_path = product_images.image_url
);

-- =========================================================
-- STEP 4: VERIFICATION
-- =========================================================

-- Check seller migration
SELECT 
  'SELLER MIGRATION' AS check_type,
  COUNT(*) AS total_sellers,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending,
  COUNT(*) FILTER (WHERE status = 'approved') AS approved,
  COUNT(*) FILTER (WHERE stripe_onboarding_complete = true) AS onboarded
FROM public.market_sellers;

-- Check product migration
SELECT
  'LISTING MIGRATION' AS check_type,
  COUNT(*) AS total_listings,
  COUNT(*) FILTER (WHERE status = 'active') AS active_listings,
  COUNT(*) FILTER (WHERE status = 'draft') AS draft_listings,
  SUM(quantity_available) AS total_stock
FROM public.market_listings;

-- Check media migration
SELECT
  'MEDIA MIGRATION' AS check_type,
  COUNT(*) AS total_media_items,
  COUNT(DISTINCT listing_id) AS products_with_media
FROM public.market_listing_media;

-- Check orphaned products (shouldn't exist if migration successful)
SELECT
  'ORPHANED CHECK' AS check_type,
  COUNT(*) AS orphaned_products,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All products migrated'
    ELSE '⚠️ Some products not migrated'
  END AS status
FROM public.messmarket_products mp
WHERE NOT EXISTS (
  SELECT 1 FROM public.market_listings ml
  WHERE ml.id = mp.id
);

-- View seller summary with product counts
SELECT
  ms.display_name,
  ms.owner_id,
  ms.status AS seller_status,
  ms.stripe_onboarding_complete,
  COUNT(ml.id) AS product_count,
  SUM(ml.quantity_available) AS total_stock,
  COUNT(mlm.id) AS total_images
FROM public.market_sellers ms
LEFT JOIN public.market_listings ml ON ml.seller_id = ms.id
LEFT JOIN public.market_listing_media mlm ON mlm.listing_id = ml.id
GROUP BY ms.id, ms.display_name, ms.owner_id, ms.status, ms.stripe_onboarding_complete
ORDER BY product_count DESC;

-- =========================================================
-- STEP 5: POST-MIGRATION CLEANUP (OPTIONAL)
-- =========================================================
-- CAUTION: Only run this after verifying migration success!

-- Archive old tables (don't delete yet, just rename)
-- Uncomment when ready:

/*
ALTER TABLE public.messmarket_products RENAME TO messmarket_products_archived_backup;
ALTER TABLE public.vendor_applications RENAME TO vendor_applications_archived_backup;
-- Keep messmarket_notifications if still using it
*/

-- =========================================================
-- MIGRATION COMPLETE! 🎉
-- =========================================================

-- NEXT STEPS:
-- 1. ✅ Verify data looks correct (run queries above)
-- 2. ✅ Slugs migrated (URLs preserved)
-- 3. ⏳ Test frontend with new market_listings table
-- 4. ⏳ Notify sellers to complete Stripe Connect onboarding
-- 5. ⏳ Update frontend to use new API endpoints

-- =========================================================
-- MIGRATION SUMMARY
-- =========================================================

SELECT 
  '🎉 MIGRATION COMPLETE!' AS status,
  (SELECT COUNT(*) FROM public.market_sellers) AS sellers_created,
  (SELECT COUNT(*) FROM public.market_listings) AS listings_migrated,
  (SELECT SUM(quantity_available) FROM public.market_listings) AS total_stock,
  (SELECT COUNT(*) FROM public.market_listing_media) AS media_items_created;

-- IMPORTANT NOTES FOR SELLERS:
-- - All existing creators are now "sellers" with APPROVED status
-- - They need to complete Stripe Connect onboarding to receive payouts
-- - Their products are live (if they were active before)
-- - Send them onboarding link: /messmarket/seller/onboarding
