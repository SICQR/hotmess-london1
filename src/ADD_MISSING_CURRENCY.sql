-- =========================================================
-- ADD MISSING CURRENCY COLUMN
-- Run this if currency column is missing
-- =========================================================

-- Add currency column if it doesn't exist
ALTER TABLE public.market_listings 
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'GBP';

-- Verify it was added
SELECT 
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'market_listings'
  AND column_name = 'currency';

-- Show sample data
SELECT 
  id,
  title,
  price_pence,
  currency,
  price_pence / 100.0 as price_display
FROM public.market_listings
LIMIT 5;
