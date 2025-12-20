-- ========================================
-- GET TEST UUIDs FOR RLS SIMULATION
-- Run this first to get the UUIDs you need
-- ========================================

-- ========================================
-- 🎯 STEP 1: Get a Seller User UUID
-- ========================================

-- Get the first seller's owner_id
SELECT 
  'SELLER UUID' AS uuid_type,
  ms.owner_id AS uuid_to_use,
  ms.display_name AS seller_name,
  ms.status AS seller_status,
  COUNT(ml.id) AS product_count,
  u.email AS user_email
FROM public.market_sellers ms
LEFT JOIN public.market_listings ml ON ml.seller_id = ms.id
LEFT JOIN auth.users u ON u.id = ms.owner_id
WHERE ms.status = 'approved'  -- Use an approved seller
GROUP BY ms.owner_id, ms.display_name, ms.status, u.email
ORDER BY product_count DESC  -- Pick seller with most products
LIMIT 1;

-- Copy the uuid_to_use value for the SELLER TEST

-- ========================================
-- 🎯 STEP 2: Get or Create an Admin User UUID
-- ========================================

-- First, check if you have any admin users
SELECT 
  'ADMIN UUID (Existing)' AS uuid_type,
  p.user_id AS uuid_to_use,
  u.email AS user_email,
  p.role AS current_role
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.role = 'admin'
LIMIT 1;

-- If above returns 0 rows, you need to make someone an admin
-- Run this to make YOUR account an admin:

/*
-- ⬇️ UNCOMMENT AND REPLACE WITH YOUR EMAIL ⬇️

UPDATE public.profiles 
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR-EMAIL@example.com'  -- ⬅️ CHANGE THIS
);

-- Then verify it worked:
SELECT 
  'ADMIN UUID (Just Created)' AS uuid_type,
  p.user_id AS uuid_to_use,
  u.email AS user_email,
  p.role AS current_role
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.role = 'admin'
LIMIT 1;
*/

-- Copy the uuid_to_use value for the ADMIN TEST

-- ========================================
-- 🎯 STEP 3: Get a Regular (Non-Seller) User UUID
-- ========================================

-- Find a user who is NOT a seller and NOT an admin
SELECT 
  'REGULAR USER UUID' AS uuid_type,
  u.id AS uuid_to_use,
  u.email AS user_email,
  p.role AS current_role,
  CASE 
    WHEN ms.owner_id IS NOT NULL THEN '⚠️ Is a seller'
    WHEN p.role = 'admin' THEN '⚠️ Is an admin'
    ELSE '✅ Regular user'
  END AS user_type
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
LEFT JOIN public.market_sellers ms ON ms.owner_id = u.id
WHERE ms.owner_id IS NULL  -- NOT a seller
  AND (p.role IS NULL OR p.role != 'admin')  -- NOT an admin
LIMIT 1;

-- If above returns 0 rows, you don't have a regular user
-- Options:
-- A) Use the admin UUID (they're also authenticated)
-- B) Create a test user account manually in Supabase Auth UI

-- ========================================
-- 📋 QUICK SUMMARY - COPY THESE VALUES
-- ========================================

-- Run this to see all three UUIDs in one result:

WITH 
  seller_uuid AS (
    SELECT ms.owner_id AS uuid, 'SELLER' AS role, u.email
    FROM public.market_sellers ms
    JOIN auth.users u ON u.id = ms.owner_id
    WHERE ms.status = 'approved'
    LIMIT 1
  ),
  admin_uuid AS (
    SELECT p.user_id AS uuid, 'ADMIN' AS role, u.email
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.user_id
    WHERE p.role = 'admin'
    LIMIT 1
  ),
  regular_uuid AS (
    SELECT u.id AS uuid, 'REGULAR' AS role, u.email
    FROM auth.users u
    LEFT JOIN public.profiles p ON p.user_id = u.id
    LEFT JOIN public.market_sellers ms ON ms.owner_id = u.id
    WHERE ms.owner_id IS NULL 
      AND (p.role IS NULL OR p.role != 'admin')
    LIMIT 1
  )
SELECT 
  role,
  uuid AS "📋 UUID TO COPY",
  email AS "User Email"
FROM (
  SELECT * FROM seller_uuid
  UNION ALL
  SELECT * FROM admin_uuid
  UNION ALL
  SELECT * FROM regular_uuid
) combined
ORDER BY CASE role WHEN 'REGULAR' THEN 1 WHEN 'SELLER' THEN 2 WHEN 'ADMIN' THEN 3 END;

-- Copy these three UUIDs and share them!

-- ========================================
-- 🎯 WHAT TO DO WITH RESULTS:
-- ========================================

/*
SCENARIO A: All 3 UUIDs found ✅
→ Copy all three UUIDs
→ Share them with me
→ I'll substitute into /TEST_RLS_ACCESS_SIMULATION.sql

SCENARIO B: Missing ADMIN UUID ⚠️
→ Uncomment the UPDATE query above
→ Replace 'YOUR-EMAIL@example.com' with your email
→ Run it to make yourself admin
→ Then get all 3 UUIDs

SCENARIO C: Missing REGULAR USER UUID ⚠️
→ No problem! Use the ADMIN UUID for regular user test
→ (Admins are also authenticated users)
→ Just need SELLER + ADMIN UUIDs

SCENARIO D: Missing SELLER UUID 🚨
→ This shouldn't happen if migration worked
→ Check: SELECT COUNT(*) FROM market_sellers;
→ If 0, something went wrong with migration
→ Share this result and I'll help debug
*/

-- ========================================
-- 🔍 DEBUGGING: If No UUIDs Found
-- ========================================

-- Check how many of each type of user you have:

SELECT 
  'Total Users' AS category,
  COUNT(*) AS count
FROM auth.users
UNION ALL
SELECT 
  'Sellers (Approved)',
  COUNT(*)
FROM market_sellers
WHERE status = 'approved'
UNION ALL
SELECT 
  'Admins',
  COUNT(*)
FROM profiles
WHERE role = 'admin'
UNION ALL
SELECT 
  'Regular Users (non-seller, non-admin)',
  COUNT(*)
FROM auth.users u
LEFT JOIN market_sellers ms ON ms.owner_id = u.id
LEFT JOIN profiles p ON p.user_id = u.id
WHERE ms.owner_id IS NULL 
  AND (p.role IS NULL OR p.role != 'admin');

-- If any count is 0, you'll need to create that user type

-- ========================================
-- 📤 WHAT TO SHARE WITH ME:
-- ========================================

/*
Just run the "QUICK SUMMARY" query above and paste the results:

role    | UUID TO COPY                          | User Email
--------|---------------------------------------|------------------
REGULAR | 123e4567-e89b-12d3-a456-426614174000  | user@example.com
SELLER  | 223e4567-e89b-12d3-a456-426614174001  | seller@example.com
ADMIN   | 323e4567-e89b-12d3-a456-426614174002  | admin@example.com

Then I'll:
1. Substitute these UUIDs into the test script
2. Give you a ready-to-run version
3. You execute it
4. Share results
*/
