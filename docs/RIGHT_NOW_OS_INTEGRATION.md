# RIGHT NOW → HOTMESS OS INTEGRATION MAP

**This document shows exactly how RIGHT NOW plugs into the entire HOTMESS operating system.**

---

## 🔌 INTEGRATION POINTS

### 1. AUTH SYSTEM
**File**: `/middleware.ts`

**How it connects:**
- User tries to access `/right-now`
- Middleware checks Supabase auth session
- If no session → redirect to `/login?next=/right-now`
- If session → check profile in database

**Data flow:**
```
User → /right-now
  ↓
Middleware: Check session
  ↓
No session? → /login
  ↓
Has session? → Check profiles table
  ↓
No profile? → /onboarding
Has profile? → Check gates (men-only, 18+, onboarded)
  ↓
All clear? → Allow access to RIGHT NOW
```

---

### 2. ONBOARDING SYSTEM
**File**: `/app/onboarding/right-now/page.tsx`

**Gates enforced:**
1. **Gender**: Must be 'male'
2. **Age**: Must be 18+ (verified via DOB)
3. **Location**: City required for feed
4. **Consent**: Men-only, age, data privacy

**Creates profile:**
```typescript
{
  id: user.id,
  gender: 'male',
  dob: '1995-06-15',
  city: 'London',
  country: 'UK',
  has_onboarded_right_now: true,
  age_verified: true,
  men_only_consent: true,
  behaviour_consent: true,
  location_consent: true,
}
```

**Redirects to**: Original destination (`/right-now`)

---

### 3. XP SYSTEM
**Integration**: Backend awards XP on post creation

**XP amounts** (base, before multipliers):
```typescript
const xpAmounts: Record<RightNowMode, number> = {
  hookup: 15,
  crowd: 20,
  drop: 10,
  ticket: 10,
  radio: 15,
  care: 25, // Highest (encourages care posts)
};
```

**Multipliers by membership**:
- FREE: 1.0x
- HNH: 1.5x
- VENDOR: 1.5x
- SPONSOR: 1.75x
- ICON: 2.0x

**Example**: ICON user posts care → 25 × 2.0 = **50 XP**

**Backend call**:
```typescript
await supabase.rpc('award_xp', {
  p_user_id: userId,
  p_event_type: 'post_right_now',
  p_xp_amount: xpAmounts[mode],
  p_related_id: post.id,
  p_related_type: 'right_now_post',
  p_city: city,
});
```

**XP ledger** (`xp_events` table):
```sql
INSERT INTO xp_events (
  user_id,
  event_type,
  xp_amount,
  multiplier,
  related_id,
  related_type,
  city
) VALUES (
  'user-123',
  'post_right_now',
  25,
  2.0,
  'post-456',
  'right_now_post',
  'London'
);
```

**User's total XP updated**:
```sql
UPDATE profiles
SET xp_total = xp_total + 50
WHERE id = 'user-123';
```

---

### 4. MEMBERSHIP SYSTEM
**Integration**: Post limits enforced based on membership tier

**Limits**:
```typescript
const postLimits = {
  free: 1,    // 1 active post at a time
  hnh: 2,     // 2 active posts
  vendor: 2,
  sponsor: 3,
  icon: 3,    // 3 active posts
};
```

**TTL (Time To Live)**:
- FREE: 30 minutes
- HNH+: 60 minutes

**Check on post creation**:
```typescript
const { count: activePosts } = await supabase
  .from('right_now_posts')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)
  .is('deleted_at', null)
  .gt('expires_at', NOW);

if (activePosts >= postLimits[membershipTier]) {
  return error('Post limit reached. Upgrade for more posts.');
}
```

**Upgrade flow**:
- User hits limit → Error message with upgrade CTA
- Click "Upgrade to HNH" → `/membership`
- Purchase membership → `profiles.membership_tier` updated
- Returns to RIGHT NOW → can now post more

---

### 5. HEAT MAP / GLOBE SYSTEM
**Integration**: Posts feed into heat map, globe visualizes

**When user posts RIGHT NOW**:
```typescript
// Backend inserts post with geo_hash
INSERT INTO right_now_posts (
  user_id,
  mode,
  text,
  city,
  geo_hash,  // Binned location (~100m precision)
  lat_bin,
  lng_bin,
  ...
);
```

**Cron job aggregates heat** (every 5 min):
```sql
REFRESH MATERIALIZED VIEW heat_map_bins;
```

**Heat calculation**:
```sql
SELECT
  geo_hash,
  lat_bin,
  lng_bin,
  city,
  COUNT(DISTINCT CASE WHEN source = 'right_now' THEN id END) as right_now_count,
  COUNT(DISTINCT CASE WHEN source = 'party' THEN id END) as party_count,
  COUNT(DISTINCT CASE WHEN source = 'scan' THEN id END) as scan_count,
  SUM(heat_value) as total_heat
FROM (
  -- RIGHT NOW posts
  SELECT id, geo_hash, 10 + view_count as heat_value, 'right_now' as source
  FROM right_now_posts
  WHERE deleted_at IS NULL AND expires_at > NOW()
  
  UNION ALL
  
  -- Party beacons
  SELECT id, geo_hash, 50 + (capacity_current * 5) as heat_value, 'party' as source
  FROM party_beacons
  WHERE deleted_at IS NULL AND end_time > NOW()
  
  UNION ALL
  
  -- Beacon scans
  SELECT s.id, b.geo_hash, 5 as heat_value, 'scan' as source
  FROM party_beacon_scans s
  JOIN party_beacons b ON s.beacon_id = b.id
  WHERE s.scanned_at > NOW() - INTERVAL '2 hours'
) heat_sources
GROUP BY geo_hash, lat_bin, lng_bin, city;
```

**Globe displays heat**:
```typescript
// Frontend: /app/earth/page.tsx
const heatData = await fetch('/api/heat/heat?city=London');
mapbox.addLayer({
  type: 'heatmap',
  source: heatData,
  paint: {
    'heatmap-intensity': total_heat / 100,
    'heatmap-color': ['interpolate', [...], 'red'],
  },
});
```

**near_party detection**:
```sql
-- When creating post, check if geo_hash overlaps active party
SELECT COUNT(*) > 0 as near_party
FROM party_beacons
WHERE geo_hash = NEW.geo_hash
  AND end_time > NOW()
  AND capacity_current >= 6;  -- Crowd-verified

-- Set flag on post
UPDATE right_now_posts
SET near_party = true
WHERE id = NEW.id;
```

**Feed shows chip**: "🔥 Near live party"

---

### 6. PARTY BEACON SYSTEM
**Integration**: RIGHT NOW posts can attach to party beacons

**Flow**:
1. Host creates party beacon → generates QR code
2. Guests scan QR at door → check in, earn XP
3. Backend increments `party_beacons.capacity_current`
4. When capacity >= 6 → `crowd_verified = true`
5. User posts RIGHT NOW near the party
6. Backend detects geo_hash overlap → sets `near_party = true`
7. Post appears in feed with party chip

**Database link**:
```sql
-- Party beacon
CREATE TABLE party_beacons (
  id UUID,
  geo_hash TEXT,
  capacity_current INTEGER,
  crowd_verified BOOLEAN,
  ...
);

-- RIGHT NOW post
CREATE TABLE right_now_posts (
  id UUID,
  geo_hash TEXT,
  near_party BOOLEAN,
  party_beacon_id UUID REFERENCES party_beacons(id),
  ...
);
```

**Example**:
- Party in Vauxhall, geo_hash `gcpuvp`
- 8 people scan QR → capacity_current = 8, crowd_verified = true
- User posts RIGHT NOW from geo_hash `gcpuvp`
- Backend sets near_party = true, party_beacon_id = party-id
- Feed shows: "Solo, Vauxhall 🔥 Near live party"

---

### 7. TELEGRAM INTEGRATION
**Integration**: RIGHT NOW posts can mirror to Telegram city channels

**Flow**:
1. User creates RIGHT NOW post
2. Optional: tick "Mirror to Telegram" checkbox
3. Backend inserts post with `telegram_mirrored = true`
4. Webhook triggers Telegram bot
5. Bot posts to city channel: `#London #hookup "Solo at E1, dark room energy"`
6. Stores `telegram_message_id` on post

**Database**:
```sql
CREATE TABLE right_now_posts (
  ...
  telegram_mirrored BOOLEAN DEFAULT false,
  telegram_message_id TEXT,
  telegram_room_id TEXT,
);
```

**Backend**:
```typescript
if (telegram_mirror) {
  await fetch('https://api.telegram.org/bot{TOKEN}/sendMessage', {
    method: 'POST',
    body: JSON.stringify({
      chat_id: getCityChannelId(city),
      text: `#${city} #${mode}\n\n${headline}`,
    }),
  });
}
```

**Telegram rooms**:
- `/telegram` → List of city channels
- Click "Join London" → Opens Telegram app
- Posts from RIGHT NOW appear in channel

---

### 8. MESS MARKET (VENDOR DROPS)
**Integration**: Vendors can drop products as RIGHT NOW posts

**Flow**:
1. Vendor creates product (lube, merch, mp3)
2. Posts RIGHT NOW with mode = 'drop'
3. Feed shows product tile with price
4. User clicks → Stripe checkout
5. Purchase triggers XP award + delivery

**Database**:
```sql
CREATE TABLE right_now_posts (
  ...
  mode TEXT CHECK (mode IN ('hookup', 'crowd', 'drop', ...)),
);

CREATE TABLE vendor_products (
  id UUID,
  vendor_id UUID,
  right_now_post_id UUID REFERENCES right_now_posts(id),
  stripe_product_id TEXT,
  price_gbp NUMERIC,
  ...
);
```

**Frontend**:
```typescript
// Feed shows product card
{post.mode === 'drop' && (
  <div className="border-pink-400">
    <h3>{post.headline}</h3>
    <p>£{product.price_gbp}</p>
    <button onClick={() => checkout(product.id)}>
      Buy Now
    </button>
  </div>
)}
```

---

### 9. CARE / SAFETY SYSTEM
**Integration**: Safety flags, panic button, Hand N Hand

**Safety flags on posts**:
```typescript
safety_flags: ['verified_host', 'high_risk', 'care_suggested']
```

**Frontend filter**:
```typescript
// "Safe / Verified only" toggle
const filteredPosts = safeOnly
  ? posts.filter(p => !p.safetyFlags?.includes('high_risk'))
  : posts;
```

**Panic button** (always visible in RIGHT NOW):
```typescript
<PanicButton
  onTrigger={async () => {
    // Create panic incident
    await fetch('/api/panic', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        city,
        trigger: 'right_now',
        feeling: 'unsafe',
      }),
    });
    
    // Open Hand N Hand chat
    router.push('/care?emergency=true');
  }}
/>
```

**Database**:
```sql
CREATE TABLE panic_incidents (
  id UUID,
  user_id UUID,
  city TEXT,
  trigger TEXT,  -- 'right_now', 'party', 'qr_bottle'
  feeling TEXT,  -- 'unsafe', 'overwhelmed', 'unsure'
  status TEXT,   -- 'active', 'resolved'
  ...
);
```

---

### 10. ADMIN / MODERATION SYSTEM
**Integration**: Admins can review flagged posts

**Admin dashboard**: `/admin/moderation`

**Shows**:
- Posts flagged by AI (`safety_flags: ['high_risk']`)
- User reports (`safety_reports` table)
- Posts with high report count

**Actions**:
- Approve → clears flags
- Remove → soft delete (`deleted_at = NOW()`)
- Shadow ban user → prevents future posts
- Hard ban → blocks account

**Database**:
```sql
CREATE TABLE safety_reports (
  id UUID,
  reporter_id UUID,
  reported_type TEXT,  -- 'user', 'right_now_post', 'party_beacon'
  reported_id UUID,
  reason TEXT,
  severity TEXT,
  status TEXT,
  ...
);
```

---

## 🔗 FULL DATA FLOW EXAMPLE

### User Journey: Post hookup → Appears on globe → Gets XP

1. **User opens app**
   - Not logged in → Redirected to `/login`
   - Signs in → Redirected to `/right-now`
   - No profile → Redirected to `/onboarding/right-now`

2. **Onboarding**
   - Step 1: Confirms gender = 'male'
   - Step 2: Enters DOB (verified 18+)
   - Step 3: Enters city 'London'
   - Step 4: Checks all consent boxes
   - Profile created in DB with `has_onboarded_right_now = true`

3. **Access granted**
   - Middleware allows access to `/right-now`
   - Feed loads (empty for first-time user)

4. **Create post**
   - Selects mode: 'hookup'
   - Enters headline: "Solo at E1, looking for dark room energy"
   - Checks consent checkbox
   - Clicks "Drop it Right Now"

5. **Backend processes**
   - Validates user is authenticated
   - Checks gender = 'male', age >= 18
   - Checks active post count (0 for new user)
   - FREE tier → limit is 1 → OK to post
   - Calculates TTL: 30 minutes (FREE tier)
   - Bins location to geo_hash
   - Inserts post into `right_now_posts`
   - Awards +15 XP (hookup mode, 1.0x multiplier for FREE)
   - Returns created post to frontend

6. **Post appears in feed**
   - Frontend receives post
   - Prepends to feed list
   - Shows: "Solo at E1... | Hookup | London | 30 min left"

7. **Cron job runs** (within 5 min)
   - Aggregates heat from RIGHT NOW posts
   - Adds post's geo_hash to `heat_map_bins`
   - Bin for East London (`gcpuvp`) gets +10 heat

8. **Globe updates**
   - User opens `/earth`
   - Fetches heat map from API
   - Mapbox shows hot spot in East London
   - Click hot spot → shows "1 RIGHT NOW post in this area"

9. **Someone scans party beacon nearby**
   - Party beacon geo_hash = `gcpuvp` (same as post)
   - Backend detects overlap
   - Updates post: `near_party = true`
   - Feed refreshes
   - Post now shows: "🔥 Near live party"

10. **Post expires**
    - 30 minutes pass
    - Cron job runs `expire_right_now_posts()`
    - Post soft-deleted: `deleted_at = NOW()`
    - Disappears from feed
    - Heat map decrements

11. **User gains XP**
    - Check `/xp` page
    - Shows: "+15 XP · Posted RIGHT NOW hookup · London · 30 min ago"
    - Total XP: 15
    - Tier: Fresh (0-500 XP)

---

## 🎯 INTEGRATION CHECKLIST

Use this to verify all systems are wired:

- [ ] **Auth**: Middleware redirects unauthenticated users
- [ ] **Onboarding**: New users forced through 4-step wizard
- [ ] **Gates**: Men-only and 18+ enforced
- [ ] **Profiles**: `has_onboarded_right_now` flag set
- [ ] **Membership**: Post limits respected (FREE=1, HNH=2, ICON=3)
- [ ] **TTL**: FREE posts expire in 30 min, HNH in 60 min
- [ ] **XP**: Awards trigger on post creation
- [ ] **Multipliers**: HNH gets 1.5x, ICON gets 2.0x XP
- [ ] **Heat**: Posts add to `heat_map_bins`
- [ ] **Cron**: Jobs run every 5 min (expire + heat refresh)
- [ ] **Globe**: Heat map displays RIGHT NOW activity
- [ ] **near_party**: Flag sets when post near party beacon
- [ ] **Feed**: Shows posts sorted by freshness
- [ ] **Filters**: Mode/distance/safe-only work
- [ ] **Safety**: Panic button accessible
- [ ] **Telegram**: (Future) Posts mirror to city channels
- [ ] **Mess Market**: (Future) Drop mode shows products
- [ ] **Admin**: (Future) Moderation queue populated

---

**THIS IS THE FULL OS. RIGHT NOW IS PROPERLY WIRED.** 🔥
