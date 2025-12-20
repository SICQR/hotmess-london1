-- =========================================================
-- CHECK ACTUAL SCHEMA OF market_listings TABLE
-- Run this to see what columns exist
-- =========================================================

-- Check all columns in market_listings
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'market_listings'
ORDER BY ordinal_position;

-- Check if currency column specifically exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'market_listings' 
        AND column_name = 'currency'
    ) THEN '✅ currency column EXISTS'
    ELSE '❌ currency column MISSING - needs migration'
  END as currency_status;

-- If currency is missing, add it:
-- ALTER TABLE public.market_listings 
--   ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'GBP';
