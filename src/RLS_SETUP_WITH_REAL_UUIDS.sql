-- ============================================================================
-- RLS TEST SETUP - WITH YOUR ACTUAL USER UUIDs
-- ============================================================================
-- Run this ONCE to prepare your 3 test users with proper roles
-- ============================================================================

-- Your actual UUIDs:
-- ADMIN:   f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d (admin@hotmessldn.com)
-- SELLER:  ecb68258-23dd-460f-aea9-11cb367d0b2a (phil.gizzie@icloud.com)
-- REGULAR: 95d503d4-20f2-4324-9888-08694d7d313c (scanme@sicqr.com)

-- ============================================================================
-- STEP 1: Ensure profiles exist for all users
-- ============================================================================

-- Insert profiles if they don't exist (idempotent)
INSERT INTO public.profiles (id, role, age18_confirmed, consent_confirmed)
VALUES 
  ('f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d', 'admin', true, true),
  ('ecb68258-23dd-460f-aea9-11cb367d0b2a', 'user', true, true),
  ('95d503d4-20f2-4324-9888-08694d7d313c', 'user', true, true)
ON CONFLICT (id) DO UPDATE
SET 
  role = EXCLUDED.role,
  age18_confirmed = EXCLUDED.age18_confirmed,
  consent_confirmed = EXCLUDED.consent_confirmed;

-- ============================================================================
-- STEP 2: Create seller profile for SELLER user
-- ============================================================================

-- Insert seller record (idempotent)
INSERT INTO public.market_sellers (
  id,
  owner_id,
  status,
  brand_name,
  bio,
  approved_at,
  approved_by
)
VALUES (
  'ecb68258-23dd-460f-aea9-11cb367d0b2a', -- Use same UUID as owner_id
  'ecb68258-23dd-460f-aea9-11cb367d0b2a',
  'approved',
  'Test Seller Brand',
  'Test seller for RLS verification',
  NOW(),
  'f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d' -- Approved by admin
)
ON CONFLICT (id) DO UPDATE
SET 
  status = 'approved',
  brand_name = EXCLUDED.brand_name,
  approved_at = NOW(),
  approved_by = EXCLUDED.approved_by;

-- ============================================================================
-- STEP 3: Create a test product for the seller
-- ============================================================================

INSERT INTO public.market_products (
  id,
  seller_id,
  status,
  title,
  description,
  price_gbp,
  stock_qty,
  category
)
VALUES (
  'aaaaaaaa-1111-2222-3333-testproduct001',
  'ecb68258-23dd-460f-aea9-11cb367d0b2a', -- Seller UUID
  'active',
  'Test Product for RLS',
  'Used to test RLS policies',
  19.99,
  10,
  'accessories'
)
ON CONFLICT (id) DO UPDATE
SET
  status = 'active',
  seller_id = EXCLUDED.seller_id,
  stock_qty = 10;

-- ============================================================================
-- STEP 4: Verify setup
-- ============================================================================

-- Check profiles
SELECT 
  p.id,
  u.email,
  p.role,
  p.age18_confirmed,
  p.consent_confirmed
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.id IN (
  'f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d',
  'ecb68258-23dd-460f-aea9-11cb367d0b2a',
  '95d503d4-20f2-4324-9888-08694d7d313c'
)
ORDER BY 
  CASE p.role
    WHEN 'admin' THEN 1
    WHEN 'user' THEN 2
    ELSE 3
  END;

-- Check seller
SELECT 
  ms.id,
  ms.owner_id,
  u.email,
  ms.status,
  ms.brand_name,
  ms.approved_at IS NOT NULL AS is_approved
FROM public.market_sellers ms
JOIN auth.users u ON u.id = ms.owner_id
WHERE ms.owner_id = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';

-- Check product
SELECT 
  mp.id,
  mp.seller_id,
  ms.brand_name,
  mp.status,
  mp.title,
  mp.stock_qty
FROM public.market_products mp
JOIN public.market_sellers ms ON ms.id = mp.seller_id
WHERE mp.id = 'aaaaaaaa-1111-2222-3333-testproduct001';

-- ============================================================================
-- ✅ SUCCESS CRITERIA:
-- ============================================================================
-- You should see:
-- 1. Three profiles: admin, user (seller), user (regular)
-- 2. One seller record with status='approved'
-- 3. One product with status='active' and stock_qty=10
-- 
-- If all three queries return data, proceed to RLS_TEST_WITH_REAL_UUIDS.sql
-- ============================================================================
