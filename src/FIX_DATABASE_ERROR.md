# 🔧 FIX DATABASE ERROR - PGRST200

## ❌ **THE ERROR YOU'RE SEEING:**

```
Error fetching listings: {
  "code": "PGRST200",
  "details": "Searched for a foreign key relationship between 'market_listings' and 'market_sellers' in the schema 'public', but no matches were found.",
  "message": "Could not find a relationship between 'market_listings' and 'market_sellers' in the schema cache"
}
```

---

## ✅ **THE FIX (2 STEPS)**

### **STEP 1: Create New Database Tables** ⚡ 30 seconds

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Open `/PASTE_INTO_SUPABASE.sql` in this project
5. **Copy the ENTIRE file** (Ctrl+A, Ctrl+C)
6. **Paste into Supabase SQL Editor**
7. Click **RUN** (or press Ctrl+Enter)

**Wait for:** ✅ "Success. No rows returned"

This creates:
- ✅ 11 new tables (`market_sellers`, `market_listings`, `market_orders`, etc.)
- ✅ All foreign key relationships
- ✅ RLS policies
- ✅ Indexes
- ✅ Helper functions

---

### **STEP 2: Migrate Your Existing Data** ⚡ 10 seconds

1. Same SQL Editor in Supabase
2. **New query**
3. Open `/MIGRATION_OLD_TO_NEW.sql` in this project
4. **Copy the ENTIRE file**
5. **Paste into Supabase SQL Editor**
6. Click **RUN**

**Wait for:** ✅ Migration summary showing sellers created, listings migrated

This copies:
- ✅ All products from `messmarket_products` → `market_listings`
- ✅ All product images → `market_listing_media`
- ✅ Auto-creates seller accounts for existing creators
- ✅ Preserves IDs and slugs (URLs won't break)

---

## 🎉 **THAT'S IT!**

Refresh your app and the error should be gone.

---

## 🔍 **WHAT WAS FIXED:**

### **Problem 1: Column Name Mismatches**
❌ Migration script used wrong column names:
- `business_name` → ✅ Fixed to `display_name`
- `stock_quantity` → ✅ Fixed to `quantity_available`
- Missing `slug` column → ✅ Added to `market_listings`

### **Problem 2: Table Structure Mismatch**
❌ Migration script referenced columns that don't exist:
- `stripe_connect_account_id` → ✅ Fixed to `stripe_account_id`
- `stripe_connect_status` → ✅ Fixed to `status` (enum)
- `is_white_label` → ✅ Fixed to `white_label_enabled`

### **Problem 3: Missing Slug for URL Routing**
❌ New `market_listings` table had no slug column
✅ Added `slug text UNIQUE` to preserve old URLs
✅ Migration now copies slugs from `messmarket_products`

---

## 📊 **VERIFY MIGRATION SUCCESS**

After running both SQL files, check in Supabase:

### **Go to Table Editor:**

1. **`market_sellers`** - Should show your creators as approved sellers
2. **`market_listings`** - Should show all your products with slugs
3. **`market_listing_media`** - Should show product images

### **Run this query in SQL Editor:**

```sql
-- Check migration results
SELECT 
  (SELECT COUNT(*) FROM market_sellers) AS sellers_created,
  (SELECT COUNT(*) FROM market_listings) AS listings_migrated,
  (SELECT COUNT(*) FROM market_listing_media) AS images_migrated,
  (SELECT SUM(quantity_available) FROM market_listings) AS total_stock;
```

**Expected:** Numbers matching your old `messmarket_products` data

---

## 🚨 **TROUBLESHOOTING**

### **Error: "relation market_listings already exists"**

You've already run the first SQL file. Skip to STEP 2 (migration).

### **Error: "column business_name does not exist"**

You're running the OLD migration file. Use the **FIXED** version: `/MIGRATION_OLD_TO_NEW.sql`

### **Error: "duplicate key value violates unique constraint"**

You've already migrated. Data is already in new tables. You're done! ✅

### **No products showing after migration**

Check product status:
```sql
SELECT status, COUNT(*) 
FROM market_listings 
GROUP BY status;
```

If all are `draft`, change them to `active`:
```sql
UPDATE market_listings 
SET status = 'active'::listing_status 
WHERE status = 'draft';
```

---

## 📝 **FILES UPDATED:**

✅ `/PASTE_INTO_SUPABASE.sql` - Added `slug` column to `market_listings`
✅ `/MIGRATION_OLD_TO_NEW.sql` - Fixed all column name mismatches
✅ `/FIX_DATABASE_ERROR.md` - This guide

---

## 🎯 **SUMMARY OF CHANGES:**

### **PASTE_INTO_SUPABASE.sql:**
```sql
-- ADDED slug column for URL routing
CREATE TABLE IF NOT EXISTS public.market_listings (
  ...
  slug text UNIQUE,  -- ← NEW! For /messmarket/product/slug URLs
  ...
);

-- ADDED slug index
CREATE UNIQUE INDEX IF NOT EXISTS ux_market_listings_slug 
  ON public.market_listings(slug) WHERE slug IS NOT NULL;
```

### **MIGRATION_OLD_TO_NEW.sql:**
```sql
-- FIXED seller creation (correct column names)
INSERT INTO market_sellers (
  display_name,  -- Was: business_name ✅
  status,  -- Was: stripe_connect_status ✅
  stripe_account_id,  -- Was: stripe_connect_account_id ✅
  ...
)

-- FIXED listing migration (added slug, correct columns)
INSERT INTO market_listings (
  slug,  -- ← NEW! Preserve old URLs
  quantity_available,  -- Was: stock_quantity ✅
  ...
)

-- ADDED image migration (new feature)
INSERT INTO market_listing_media (...)
FROM unnest(messmarket_products.images);
```

---

## ✅ **YOU'RE ALL SET!**

After running both SQL files:
1. ✅ Database tables created
2. ✅ Old data migrated
3. ✅ Foreign key relationships working
4. ✅ URLs preserved (slugs copied)
5. ✅ Images migrated to media table

**Refresh your app** - error should be gone! 🎉

---

## 🔗 **NEXT STEPS:**

See `/MIGRATION_PLAN.md` for:
- Frontend updates needed
- Stripe Connect onboarding
- Testing checklist
- Seller notification emails
