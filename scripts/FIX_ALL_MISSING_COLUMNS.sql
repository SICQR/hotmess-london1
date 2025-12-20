-- =========================================================
-- FIX ALL MISSING COLUMNS IN market_listings
-- Run this to add any columns that don't exist
-- =========================================================

-- 1. Check what you currently have
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'market_listings'
ORDER BY ordinal_position;

-- 2. Add missing columns (safe - only adds if they don't exist)

-- Currency column
ALTER TABLE public.market_listings 
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'GBP';

-- Fulfilment mode enum (need to create enum first)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fulfilment_mode') THEN
    CREATE TYPE public.fulfilment_mode AS ENUM ('seller_fulfilled','white_label_partner');
  END IF;
END $$;

ALTER TABLE public.market_listings 
  ADD COLUMN IF NOT EXISTS fulfilment_mode public.fulfilment_mode NOT NULL DEFAULT 'seller_fulfilled';

-- SKU column
ALTER TABLE public.market_listings 
  ADD COLUMN IF NOT EXISTS sku text;

-- White label columns
ALTER TABLE public.market_listings 
  ADD COLUMN IF NOT EXISTS public_brand_name text,
  ADD COLUMN IF NOT EXISTS public_support_name text;

-- Policy columns
ALTER TABLE public.market_listings 
  ADD COLUMN IF NOT EXISTS shipping_policy text,
  ADD COLUMN IF NOT EXISTS returns_policy text;

-- 3. Check for white_label_enabled in market_sellers
ALTER TABLE public.market_sellers
  ADD COLUMN IF NOT EXISTS white_label_enabled boolean NOT NULL DEFAULT false;

-- 4. Verify all columns are now present
SELECT 
  'market_listings columns' as table_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'market_listings';

-- 5. Show first listing with all columns
SELECT 
  id,
  title,
  slug,
  price_pence,
  currency,
  fulfilment_mode,
  status,
  quantity_available
FROM public.market_listings
LIMIT 1;

-- ✅ Done! Now refresh your app and try clicking a product
