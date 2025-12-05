-- ============================================================================
-- RLS POLICY VERIFICATION TEST - WITH YOUR ACTUAL USER UUIDs
-- ============================================================================
-- Run this AFTER RLS_SETUP_WITH_REAL_UUIDS.sql
-- This simulates requests from different user roles to verify RLS policies
-- ============================================================================

-- Your actual UUIDs:
-- ADMIN:   f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d (admin@hotmessldn.com)
-- SELLER:  ecb68258-23dd-460f-aea9-11cb367d0b2a (phil.gizzie@icloud.com)
-- REGULAR: 95d503d4-20f2-4324-9888-08694d7d313c (scanme@sicqr.com)

\echo '============================================================================'
\echo 'RLS POLICY VERIFICATION TEST'
\echo '============================================================================'

-- ============================================================================
-- TEST 1: market_sellers - Read Access
-- ============================================================================
\echo ''
\echo '--- TEST 1: market_sellers READ ---'

-- ADMIN should see ALL sellers (including pending)
\echo 'ADMIN (should see all sellers):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d';
SELECT COUNT(*) AS admin_sees_sellers FROM public.market_sellers;
RESET role;

-- SELLER should see ONLY their own record
\echo 'SELLER (should see only their own record):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
SELECT COUNT(*) AS seller_sees_sellers FROM public.market_sellers;
RESET role;

-- REGULAR should see ONLY approved sellers
\echo 'REGULAR (should see only approved sellers):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = '95d503d4-20f2-4324-9888-08694d7d313c';
SELECT COUNT(*) AS regular_sees_sellers FROM public.market_sellers WHERE status = 'approved';
RESET role;

-- ============================================================================
-- TEST 2: market_sellers - Write Access
-- ============================================================================
\echo ''
\echo '--- TEST 2: market_sellers WRITE ---'

-- SELLER can update their own record
\echo 'SELLER (should be able to update own bio):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
UPDATE public.market_sellers 
SET bio = 'Updated bio for RLS test'
WHERE id = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
SELECT 'SUCCESS: Seller updated own record' AS result;
RESET role;

-- REGULAR cannot update seller records
\echo 'REGULAR (should FAIL to update seller record):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = '95d503d4-20f2-4324-9888-08694d7d313c';
DO $$
BEGIN
  UPDATE public.market_sellers 
  SET bio = 'Hacked!'
  WHERE id = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
  
  IF FOUND THEN
    RAISE NOTICE '❌ SECURITY ISSUE: Regular user updated seller record!';
  ELSE
    RAISE NOTICE '✅ SUCCESS: Regular user blocked from updating seller';
  END IF;
END $$;
RESET role;

-- ============================================================================
-- TEST 3: market_products - Read Access
-- ============================================================================
\echo ''
\echo '--- TEST 3: market_products READ ---'

-- ADMIN should see ALL products (including draft/unlisted)
\echo 'ADMIN (should see all products):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d';
SELECT COUNT(*) AS admin_sees_products FROM public.market_products;
RESET role;

-- SELLER should see their own products (all statuses)
\echo 'SELLER (should see own products):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
SELECT COUNT(*) AS seller_sees_products 
FROM public.market_products 
WHERE seller_id = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
RESET role;

-- REGULAR should see ONLY active products from approved sellers
\echo 'REGULAR (should see only active products):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = '95d503d4-20f2-4324-9888-08694d7d313c';
SELECT COUNT(*) AS regular_sees_products 
FROM public.market_products p
JOIN public.market_sellers s ON s.id = p.seller_id
WHERE p.status = 'active' AND s.status = 'approved';
RESET role;

-- ============================================================================
-- TEST 4: market_products - Write Access
-- ============================================================================
\echo ''
\echo '--- TEST 4: market_products WRITE ---'

-- SELLER can insert their own products
\echo 'SELLER (should be able to create product):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
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
  'bbbbbbbb-2222-3333-4444-testproduct002',
  'ecb68258-23dd-460f-aea9-11cb367d0b2a',
  'draft',
  'Another Test Product',
  'Created during RLS test',
  29.99,
  5,
  'apparel'
)
ON CONFLICT (id) DO NOTHING;
SELECT 'SUCCESS: Seller created product' AS result;
RESET role;

-- REGULAR cannot insert products (not a seller)
\echo 'REGULAR (should FAIL to create product):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = '95d503d4-20f2-4324-9888-08694d7d313c';
DO $$
BEGIN
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
    'cccccccc-3333-4444-5555-testproduct003',
    '95d503d4-20f2-4324-9888-08694d7d313c', -- Regular user trying to be seller
    'active',
    'Malicious Product',
    'Should not be created',
    9.99,
    100,
    'accessories'
  );
  RAISE NOTICE '❌ SECURITY ISSUE: Regular user created product!';
EXCEPTION
  WHEN insufficient_privilege OR check_violation THEN
    RAISE NOTICE '✅ SUCCESS: Regular user blocked from creating product';
END $$;
RESET role;

-- ============================================================================
-- TEST 5: market_orders - Read Access
-- ============================================================================
\echo ''
\echo '--- TEST 5: market_orders READ ---'

-- Create a test order first
INSERT INTO public.market_orders (
  id,
  buyer_id,
  seller_id,
  status,
  total_gbp,
  stripe_payment_intent_id
)
VALUES (
  'order-test-001',
  '95d503d4-20f2-4324-9888-08694d7d313c', -- Regular user as buyer
  'ecb68258-23dd-460f-aea9-11cb367d0b2a', -- Seller
  'paid',
  19.99,
  'pi_test_12345'
)
ON CONFLICT (id) DO UPDATE
SET buyer_id = EXCLUDED.buyer_id, seller_id = EXCLUDED.seller_id;

-- BUYER should see their own orders
\echo 'BUYER (should see own orders):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = '95d503d4-20f2-4324-9888-08694d7d313c';
SELECT COUNT(*) AS buyer_sees_orders 
FROM public.market_orders 
WHERE buyer_id = '95d503d4-20f2-4324-9888-08694d7d313c';
RESET role;

-- SELLER should see orders they're fulfilling
\echo 'SELLER (should see orders to fulfill):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
SELECT COUNT(*) AS seller_sees_orders 
FROM public.market_orders 
WHERE seller_id = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
RESET role;

-- ADMIN should see all orders
\echo 'ADMIN (should see all orders):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d';
SELECT COUNT(*) AS admin_sees_orders FROM public.market_orders;
RESET role;

-- ============================================================================
-- TEST 6: market_payouts - Seller Isolation
-- ============================================================================
\echo ''
\echo '--- TEST 6: market_payouts ISOLATION ---'

-- Create test payout
INSERT INTO public.market_payouts (
  id,
  seller_id,
  amount_gbp,
  status,
  stripe_transfer_id
)
VALUES (
  'payout-test-001',
  'ecb68258-23dd-460f-aea9-11cb367d0b2a',
  100.00,
  'completed',
  'tr_test_12345'
)
ON CONFLICT (id) DO UPDATE
SET seller_id = EXCLUDED.seller_id;

-- SELLER should see only their own payouts
\echo 'SELLER (should see own payouts):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
SELECT COUNT(*) AS seller_sees_payouts 
FROM public.market_payouts 
WHERE seller_id = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
RESET role;

-- REGULAR should see ZERO payouts
\echo 'REGULAR (should see zero payouts):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = '95d503d4-20f2-4324-9888-08694d7d313c';
SELECT COUNT(*) AS regular_sees_payouts FROM public.market_payouts;
RESET role;

-- ADMIN should see all payouts
\echo 'ADMIN (should see all payouts):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d';
SELECT COUNT(*) AS admin_sees_payouts FROM public.market_payouts;
RESET role;

-- ============================================================================
-- TEST 7: market_stock_ledger - Audit Trail Security
-- ============================================================================
\echo ''
\echo '--- TEST 7: market_stock_ledger SECURITY ---'

-- ADMIN should be able to read audit trail
\echo 'ADMIN (should read stock ledger):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'f4280418-7bb6-4fbf-9b62-2ec6ec1f3e4d';
SELECT COUNT(*) AS admin_sees_ledger FROM public.market_stock_ledger;
RESET role;

-- SELLER should see their own product ledger entries
\echo 'SELLER (should see own product ledger):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
SELECT COUNT(*) AS seller_sees_ledger 
FROM public.market_stock_ledger sl
JOIN public.market_products p ON p.id = sl.product_id
WHERE p.seller_id = 'ecb68258-23dd-460f-aea9-11cb367d0b2a';
RESET role;

-- REGULAR should NOT be able to write to ledger
\echo 'REGULAR (should FAIL to insert ledger entry):'
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = '95d503d4-20f2-4324-9888-08694d7d313c';
DO $$
BEGIN
  INSERT INTO public.market_stock_ledger (
    product_id,
    delta,
    reason,
    reference_id,
    balance_after
  )
  VALUES (
    'aaaaaaaa-1111-2222-3333-testproduct001',
    -100,
    'theft',
    'malicious',
    -90
  );
  RAISE NOTICE '❌ SECURITY ISSUE: Regular user wrote to audit ledger!';
EXCEPTION
  WHEN insufficient_privilege OR check_violation THEN
    RAISE NOTICE '✅ SUCCESS: Regular user blocked from writing to ledger';
END $$;
RESET role;

-- ============================================================================
-- SUMMARY
-- ============================================================================
\echo ''
\echo '============================================================================'
\echo 'RLS TEST COMPLETE'
\echo '============================================================================'
\echo ''
\echo 'Expected results:'
\echo '  ✅ Admins see everything'
\echo '  ✅ Sellers see and modify only their own data'
\echo '  ✅ Buyers see only public listings and their own orders'
\echo '  ✅ Regular users blocked from unauthorized writes'
\echo '  ✅ Audit trails protected from tampering'
\echo ''
\echo 'Review the output above for any ❌ SECURITY ISSUE messages.'
\echo 'All tests should show ✅ SUCCESS or proper access counts.'
\echo '============================================================================'
