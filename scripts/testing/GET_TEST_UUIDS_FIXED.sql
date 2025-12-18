-- ========================================
-- GET TEST UUIDs - FIXED VERSION
-- Simplified queries that work with your schema
-- ========================================

-- ========================================
-- 🎯 QUICK METHOD: Get All Three UUIDs
-- ========================================

-- STEP 1: Get SELLER UUID
SELECT 
  'SELLER' AS role,
  ms.owner_id AS uuid,
  u.email
FROM public.market_sellers ms
JOIN auth.users u ON u.id = ms.owner_id
WHERE ms.status = 'approved'
ORDER BY ms.created_at DESC
LIMIT 1;

-- Copy the UUID from above ⬆️

-- ========================================

-- STEP 2: Get ADMIN UUID
SELECT 
  'ADMIN' AS role,
  p.user_id AS uuid,
  u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.role = 'admin'
LIMIT 1;

-- Copy the UUID from above ⬆️
-- If NO ROWS: You need to make yourself admin first (see below)

-- ========================================

-- STEP 3: Get REGULAR USER UUID (non-seller, non-admin)
SELECT 
  'REGULAR' AS role,
  u.id AS uuid,
  u.email
FROM auth.users u
WHERE u.id NOT IN (SELECT owner_id FROM public.market_sellers WHERE owner_id IS NOT NULL)
  AND u.id NOT IN (SELECT user_id FROM public.profiles WHERE role = 'admin')
LIMIT 1;

-- Copy the UUID from above ⬆️
-- If NO ROWS: Use your admin UUID instead (admins are also authenticated users)

-- ========================================
-- ⚠️ IF NO ADMIN EXISTS: Make Yourself Admin
-- ========================================

/*
-- Uncomment and run this if STEP 2 returned no rows:

-- First, find your user ID:
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then make yourself admin:
UPDATE public.profiles 
SET role = 'admin'
WHERE user_id = 'PASTE-YOUR-USER-ID-HERE';

-- Verify:
SELECT p.user_id, u.email, p.role 
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.role = 'admin';
*/

-- ========================================
-- 📋 ALTERNATIVE: One Combined Query
-- ========================================

-- Run this to see all at once:
SELECT 'SELLER' AS role, ms.owner_id AS uuid, u.email
FROM public.market_sellers ms
JOIN auth.users u ON u.id = ms.owner_id
WHERE ms.status = 'approved'
LIMIT 1

UNION ALL

SELECT 'ADMIN' AS role, p.user_id AS uuid, u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.role = 'admin'
LIMIT 1

UNION ALL

SELECT 'REGULAR' AS role, u.id AS uuid, u.email
FROM auth.users u
WHERE u.id NOT IN (SELECT owner_id FROM public.market_sellers WHERE owner_id IS NOT NULL)
  AND u.id NOT IN (SELECT user_id FROM public.profiles WHERE role = 'admin')
LIMIT 1;

-- ========================================
-- 📤 PASTE ALL THREE UUIDs HERE:
-- ========================================

/*
After running the query above, you'll see something like:

role    | uuid                                  | email
--------|---------------------------------------|----------------------
SELLER  | f9e8d7c6-5432-10fe-dcba-098765432101  | seller@hotmess.com
ADMIN   | 11223344-5566-7788-99aa-bbccddeeff00  | admin@hotmess.com
REGULAR | a1b2c3d4-5678-90ab-cdef-123456789012  | user@hotmess.com

COPY THE THREE UUIDs AND PASTE IN CHAT:

SELLER: f9e8d7c6-5432-10fe-dcba-098765432101
ADMIN: 11223344-5566-7788-99aa-bbccddeeff00
REGULAR: a1b2c3d4-5678-90ab-cdef-123456789012
*/

-- ========================================
-- 🔍 DEBUGGING: Check What You Have
-- ========================================

-- Count available users of each type:
SELECT 
  'Total auth.users' AS type,
  COUNT(*) AS count
FROM auth.users

UNION ALL

SELECT 
  'Approved sellers',
  COUNT(*)
FROM public.market_sellers
WHERE status = 'approved'

UNION ALL

SELECT 
  'Admin users',
  COUNT(*)
FROM public.profiles
WHERE role = 'admin'

UNION ALL

SELECT 
  'Regular users (non-seller, non-admin)',
  COUNT(*)
FROM auth.users u
WHERE u.id NOT IN (SELECT owner_id FROM public.market_sellers WHERE owner_id IS NOT NULL)
  AND u.id NOT IN (SELECT user_id FROM public.profiles WHERE role = 'admin');

-- If any count is 0, you'll need to create that type of user
