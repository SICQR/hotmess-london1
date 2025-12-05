-- =========================================================
-- IMPROVEMENTS FOR OLD messmarket_products SYSTEM
-- Only use this if keeping the old messmarket_products table
-- =========================================================
-- Run in Supabase SQL Editor
-- =========================================================

-- DROP old policies to replace them
DROP POLICY IF EXISTS "MessMarket products are viewable by everyone" ON messmarket_products;
DROP POLICY IF EXISTS "Only admins can update MessMarket products" ON messmarket_products;

-- =========================================================
-- 1. ALLOW CREATORS TO VIEW THEIR OWN INACTIVE PRODUCTS
-- =========================================================
-- This lets creators edit their draft products before activating them

CREATE POLICY "messmarket_products_select_public_or_own"
  ON messmarket_products FOR SELECT
  USING (
    active = true  -- Public can see active products
    OR creator_id = auth.uid()  -- Creators can see their own (even if inactive)
    OR public.is_admin()  -- Admins can see all
  );

-- =========================================================
-- 2. PREVENT CREATORS FROM CHANGING creator_id
-- =========================================================
-- Creators can update their own products but can't reassign ownership

CREATE POLICY "messmarket_products_update_own_no_reassign"
  ON messmarket_products FOR UPDATE
  USING (
    creator_id = auth.uid()  -- Can only update their own products
    OR public.is_admin()  -- Admins can update any
  )
  WITH CHECK (
    -- Admin can do anything
    public.is_admin()
    -- Creators can update their products but...
    OR (
      creator_id = auth.uid()  -- Must be theirs
      AND creator_id = (SELECT creator_id FROM messmarket_products WHERE id = messmarket_products.id)  -- Can't change creator_id
    )
  );

-- =========================================================
-- 3. OPTIONAL: ADD VALIDATION CHECKS
-- =========================================================

-- Email format validation (if you want it on notifications table)
-- Uncomment if desired:
/*
ALTER TABLE messmarket_notifications
ADD CONSTRAINT email_format_check
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
*/

-- =========================================================
-- 4. ADD INDEX ON (creator_id, active) FOR PERFORMANCE
-- =========================================================
-- This speeds up "show me my products" queries

CREATE INDEX IF NOT EXISTS idx_messmarket_products_creator_active 
  ON messmarket_products(creator_id, active);

-- =========================================================
-- 5. ADD HELPFUL RPC FUNCTION FOR CREATORS
-- =========================================================
-- Lets creators easily get their product count

CREATE OR REPLACE FUNCTION public.messmarket_get_my_product_stats()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'total', COUNT(*),
    'active', COUNT(*) FILTER (WHERE active = true),
    'inactive', COUNT(*) FILTER (WHERE active = false),
    'total_stock', COALESCE(SUM(stock_count), 0)
  )
  FROM messmarket_products
  WHERE creator_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.messmarket_get_my_product_stats TO authenticated;

-- =========================================================
-- VERIFICATION
-- =========================================================

-- Check policies exist
SELECT 
  schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'messmarket_products'
ORDER BY policyname;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'messmarket_products';

-- Test the stats function (run as authenticated user)
-- SELECT public.messmarket_get_my_product_stats();

-- =========================================================
-- DONE!
-- =========================================================
-- Creators can now:
-- ✅ View their own inactive products for editing
-- ✅ Update their products (but not change creator_id)
-- ✅ Get product statistics
-- 
-- Admins can still:
-- ✅ Do everything
-- =========================================================
