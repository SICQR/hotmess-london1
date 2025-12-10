# RIGHT NOW Schema Migration Guide

**Migration:** `301_right_now_schema_polish.sql`  
**Date:** December 9, 2024  
**Status:** ✅ Ready to Apply

---

## 🎯 What This Migration Does

Adds production-ready columns and indexes to `right_now_posts` table:

### New Columns Added

1. **`deleted_at`** (TIMESTAMPTZ, nullable)
   - Soft delete timestamp for moderation
   - Posts with `deleted_at` are hidden from feeds
   - Allows recovery if needed

2. **`expires_at`** (TIMESTAMPTZ, NOT NULL)
   - When the temporal post expires
   - Default: 1 hour from creation
   - Auto-set by trigger if not provided

3. **`heat_bin_id`** (TEXT, nullable)
   - Geohash or H3 cell ID for spatial indexing
   - Groups nearby posts for heat map calculations
   - Example: `"9c2838b"`

4. **`location`** (GEOGRAPHY(POINT, 4326), nullable)
   - PostGIS geography point (if PostGIS installed)
   - Auto-synced from `lat`/`lng` by trigger
   - Enables advanced spatial queries

### New Indexes Created

1. **`idx_right_now_posts_user_id`**
   - Fast user post lookups
   - Query: "Show all my posts"

2. **`idx_right_now_posts_location`** (GIST, if PostGIS)
   - Spatial queries (nearest posts, within radius)
   - Query: "Posts within 5km of me"

3. **`idx_right_now_posts_heat_bin`**
   - Heat map aggregation
   - Query: "All active posts in this geo bin"
   - Predicate: `WHERE deleted_at IS NULL`

4. **`idx_right_now_posts_expires_at`**
   - Temporal cleanup queries
   - Query: "Find expired posts to hide"
   - Predicate: `WHERE deleted_at IS NULL`

5. **`idx_right_now_posts_created_at`**
   - Feed sorting (newest first)
   - Query: "Show latest posts"
   - DESC order for efficiency

6. **`idx_right_now_posts_is_beacon`**
   - Filter beacon-only posts
   - Query: "Show only beacons on map"
   - Predicate: `WHERE is_beacon = TRUE AND deleted_at IS NULL`

7. **`idx_right_now_posts_heatbin_user`**
   - Composite index for rate limiting
   - Query: "How many posts has user X made in geo bin Y?"

### New Triggers

1. **`trigger_set_right_now_expires_at`**
   - Auto-sets `expires_at` to NOW() + 1 hour if not provided
   - Runs: BEFORE INSERT

2. **`trigger_sync_right_now_location`** (if PostGIS)
   - Auto-syncs `location` from `lat`/`lng`
   - Runs: BEFORE INSERT OR UPDATE OF lat, lng

---

## 🔒 Safety Features

### Defensive Design
- ✅ Checks if columns already exist before adding
- ✅ Guards PostGIS features with existence check
- ✅ Falls back to simpler indexes if predicate columns missing
- ✅ Uses `IF NOT EXISTS` for all indexes
- ✅ Graceful error handling with EXCEPTION blocks

### Idempotent
- ✅ Safe to run multiple times
- ✅ Won't duplicate columns or indexes
- ✅ Won't fail if already applied

### PostGIS Optional
- ✅ Works without PostGIS (skips geography features)
- ✅ Adds PostGIS features if available
- ✅ Checks extension at runtime

---

## 📊 Migration Impact

### Database Size
- **Minimal:** ~5 columns × row count
- **Indexes:** ~10-20% of table size per index
- **Total:** Expect 50-100MB increase for 100k posts

### Performance
- ✅ **Faster feeds:** Created_at DESC index
- ✅ **Faster user queries:** User_id index
- ✅ **Faster spatial queries:** Location GIST index
- ✅ **Faster expiry cleanup:** Expires_at index

### Breaking Changes
- ❌ **NONE** - All new columns are nullable or have defaults
- ✅ Existing queries continue to work
- ✅ TypeScript types updated with optional fields

---

## 🚀 How to Apply

### Option 1: Via Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Paste migration SQL
3. Click "Run"
4. Check notices for success messages

### Option 2: Via Supabase CLI
```bash
supabase db push
```

### Option 3: Manually via psql
```bash
psql -h <host> -U postgres -d postgres -f supabase/migrations/301_right_now_schema_polish.sql
```

---

## ✅ Verification

After running the migration, verify with:

```sql
-- Check columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'right_now_posts'
ORDER BY ordinal_position;

-- Check indexes exist
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename = 'right_now_posts'
ORDER BY indexname;

-- Check triggers exist
SELECT tgname, proname
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'public.right_now_posts'::regclass;

-- Check PostGIS availability
SELECT EXISTS (
  SELECT 1 FROM pg_extension WHERE extname = 'postgis'
) AS has_postgis;
```

Expected output:
```
Columns: id, user_id, mode, headline, body, city, lat, lng, 
         deleted_at, expires_at, heat_bin_id, location (if PostGIS), ...
         
Indexes: 7-8 new indexes with idx_right_now_posts_ prefix

Triggers: trigger_set_right_now_expires_at
          trigger_sync_right_now_location (if PostGIS)
```

---

## 🔄 Backfill Process

The migration automatically backfills:

### 1. Location Column (if PostGIS)
```sql
UPDATE right_now_posts
SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
WHERE location IS NULL AND lat IS NOT NULL AND lng IS NOT NULL;
```
- Converts existing `lat`/`lng` to PostGIS geography
- Only updates rows with NULL location
- Logged: "Backfilled location for X posts"

### 2. Expires_at Column
- Existing rows: Keep existing value
- New rows: Auto-set by trigger to NOW() + 1 hour
- No backfill needed (has DEFAULT)

---

## 📝 Updated TypeScript Types

```typescript
export interface RightNowPost {
  id: string
  user_id: string
  mode: RightNowMode
  headline: string
  body?: string | null
  city: string
  country?: string | null
  lat?: number | null
  lng?: number | null
  geo_bin: string
  membership_tier: string
  xp_band: string
  safety_flags: string[]
  near_party: boolean
  sponsored: boolean
  created_at: string
  expires_at: string
  score: number
  
  // NEW FIELDS
  deleted_at?: string | null
  heat_bin_id?: string | null
  location?: any // PostGIS GEOGRAPHY (optional)
  is_beacon?: boolean | null
}
```

---

## 🎮 New Query Capabilities

### 1. Soft Delete Posts
```typescript
// Soft delete (hide from feed)
await supabase
  .from('right_now_posts')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', postId);

// Restore (un-delete)
await supabase
  .from('right_now_posts')
  .update({ deleted_at: null })
  .eq('id', postId);

// Query only active posts
const { data } = await supabase
  .from('right_now_posts')
  .select('*')
  .is('deleted_at', null);
```

### 2. Custom Expiry Times
```typescript
// Post expires in 2 hours
await supabase
  .from('right_now_posts')
  .insert({
    mode: 'hookup',
    headline: 'Looking now',
    expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
  });

// Find expiring soon
const { data } = await supabase
  .from('right_now_posts')
  .select('*')
  .lt('expires_at', new Date(Date.now() + 15 * 60 * 1000).toISOString())
  .is('deleted_at', null);
```

### 3. Spatial Queries (if PostGIS)
```typescript
// Posts within 5km radius (requires raw SQL)
const { data } = await supabase.rpc('posts_near_location', {
  search_lat: 51.5074,
  search_lng: -0.1278,
  radius_meters: 5000
});

// SQL function to create:
/*
CREATE FUNCTION posts_near_location(
  search_lat float,
  search_lng float,
  radius_meters int
)
RETURNS SETOF right_now_posts AS $$
  SELECT *
  FROM right_now_posts
  WHERE location IS NOT NULL
    AND deleted_at IS NULL
    AND ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography,
      radius_meters
    )
  ORDER BY location <-> ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography
$$ LANGUAGE SQL;
*/
```

### 4. Heat Map Aggregation
```typescript
// Count posts per heat bin
const { data } = await supabase
  .from('right_now_posts')
  .select('heat_bin_id, count:heat_bin_id.count()')
  .is('deleted_at', null)
  .gte('created_at', oneDayAgo)
  .groupBy('heat_bin_id');
```

---

## 🔥 Cleanup Queries

### Expire Old Posts
```sql
-- Mark expired posts as deleted (soft delete)
UPDATE right_now_posts
SET deleted_at = NOW()
WHERE expires_at < NOW()
  AND deleted_at IS NULL;
```

### Hard Delete Very Old Posts
```sql
-- Permanently remove posts older than 30 days
DELETE FROM right_now_posts
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Vacuum Table
```sql
-- Reclaim space after deletions
VACUUM ANALYZE right_now_posts;
```

---

## 📈 Performance Tips

1. **Use predicates in WHERE clauses:**
   ```sql
   -- Good (uses index predicate)
   SELECT * FROM right_now_posts
   WHERE deleted_at IS NULL
   ORDER BY created_at DESC;
   
   -- Bad (full table scan)
   SELECT * FROM right_now_posts
   ORDER BY created_at DESC;
   ```

2. **Query by heat_bin_id for locality:**
   ```sql
   -- Good (uses composite index)
   SELECT * FROM right_now_posts
   WHERE heat_bin_id = 'abc123'
     AND user_id = 'user-uuid'
     AND deleted_at IS NULL;
   ```

3. **Use expires_at for temporal queries:**
   ```sql
   -- Good (uses expires_at index)
   SELECT * FROM right_now_posts
   WHERE expires_at > NOW()
     AND deleted_at IS NULL;
   ```

---

## 🎉 Summary

✅ **Migration created:** `/supabase/migrations/301_right_now_schema_polish.sql`  
✅ **Types updated:** `/lib/rightNowClient.ts`  
✅ **Safe to apply:** Defensive, idempotent, no breaking changes  
✅ **Performance boost:** 7-8 new indexes for faster queries  
✅ **New features:** Soft deletes, custom expiry, spatial queries  

**Ready to deploy.** 🚀
