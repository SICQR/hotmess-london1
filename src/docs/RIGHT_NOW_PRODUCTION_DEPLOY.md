# RIGHT NOW - PRODUCTION DEPLOYMENT CHECKLIST

**This is the real deal. Not a demo. Not a prototype. Production.**

---

## ✅ PRE-FLIGHT CHECKLIST

### 1. Database Schema (CRITICAL - DO FIRST)

```bash
# Connect to Supabase
supabase link --project-ref rfoftonnlwudilafhfkl

# Deploy migration
supabase db push

# Verify tables exist
supabase db diff
# Should show no differences if successful
```

**Tables that MUST exist:**
- `profiles` (with gender, dob, has_onboarded_right_now, shadow_banned fields)
- `right_now_posts` (with all fields from schema)
- `xp_events` (XP ledger)
- `party_beacons` (for near_party detection)
- `heat_map_bins` (materialized view)

---

### 2. Cron Jobs (CRITICAL - AUTO-EXPIRY DEPENDS ON THIS)

Go to **Supabase Dashboard → Database → Cron Jobs**

#### Job 1: Expire RIGHT NOW posts (every 5 minutes)
```sql
SELECT cron.schedule(
  'expire-right-now-posts',
  '*/5 * * * *',
  $$SELECT expire_right_now_posts()$$
);
```

#### Job 2: Refresh heat map (every 5 minutes)
```sql
SELECT cron.schedule(
  'refresh-heat-map',
  '*/5 * * * *',
  $$SELECT refresh_heat_map()$$
);
```

**Verify cron jobs are running:**
```sql
SELECT * FROM cron.job;
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

### 3. Environment Variables

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://rfoftonnlwudilafhfkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_EDGE_BASE_URL=https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/make-server-a670c824
```

**Backend (Supabase Secrets)**:
Already set (from your existing setup):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

---

### 4. Server Function Deployment

Your server function is already deployed, but verify RIGHT NOW routes work:

```bash
# Test feed endpoint
curl "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/make-server-a670c824/right-now/feed?city=London"

# Should return:
# {"posts":[],"serverTime":"2024-12-09T..."}
```

---

## 🚨 GATES & ENFORCEMENT

### Auth Flow (What Actually Happens)

1. **User hits `/right-now`**
   - Middleware checks if authenticated
   - If no → redirect to `/login?next=/right-now`

2. **User signs in**
   - Supabase Auth handles this
   - Returns to `/right-now`

3. **Middleware checks profile**
   - Query `profiles` table for user
   - If no profile → redirect to `/onboarding?next=/right-now`
   - If shadow_banned → redirect to `/banned`
   - If gender !== 'male' → redirect to `/not-eligible`
   - If age < 18 → redirect to `/not-eligible`
   - If !has_onboarded_right_now → redirect to `/onboarding/right-now`

4. **Onboarding flow**
   - 4 steps: Gender → Age → Location → Consent
   - Creates/updates profile with all required fields
   - Sets `has_onboarded_right_now = true`
   - Redirects to `/right-now`

5. **User can now access RIGHT NOW**
   - See feed
   - Post (respecting membership limits)
   - Delete own posts

---

## 📊 MEMBERSHIP LIMITS (ENFORCED IN BACKEND)

### Post Limits (per user, active posts)
- **FREE**: 1 active post
- **HNH**: 2 active posts
- **VENDOR**: 2 active posts
- **SPONSOR**: 3 active posts
- **ICON**: 3 active posts

### TTL (Time To Live)
- **FREE**: 30 minutes
- **HNH+**: 60 minutes

### Mode Access
- **FREE**: hookup, crowd, drop
- **HNH+**: All modes (hookup, crowd, drop, ticket, radio, care)

Backend checks these on `POST /right-now`:
```typescript
// Get user's membership
const { data: profile } = await supabase
  .from('profiles')
  .select('membership_tier')
  .eq('id', userId)
  .single();

// Check active post count
const { count } = await supabase
  .from('right_now_posts')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)
  .is('deleted_at', null)
  .gt('expires_at', NOW);

// Enforce limit
if (count >= postLimits[profile.membership_tier]) {
  return error('Post limit reached. Upgrade for more posts.');
}
```

---

## 🔥 XP INTEGRATION

### XP Amounts (per action)
- **Post hookup**: +15 XP
- **Post crowd**: +20 XP
- **Post care**: +25 XP (highest)
- **Post drop**: +10 XP
- **Post ticket**: +10 XP
- **Post radio**: +15 XP

### Membership Multipliers
- **FREE**: 1.0x
- **HNH**: 1.5x
- **VENDOR**: 1.5x
- **SPONSOR**: 1.75x
- **ICON**: 2.0x

**Example:**
- FREE user posts hookup → 15 XP
- HNH user posts hookup → 15 × 1.5 = 22 XP
- ICON user posts care → 25 × 2.0 = 50 XP

Backend awards XP after post creation:
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

---

## 🌍 HEAT MAP INTEGRATION

### How Heat Works

1. **User posts RIGHT NOW**
   - Post stored in `right_now_posts`
   - `geo_hash` field set (binned location, ~100m precision)

2. **Cron job refreshes heat map** (every 5 min)
   - Materialized view `heat_map_bins` aggregates:
     - RIGHT NOW posts (by geo_hash)
     - Party beacon scans (by geo_hash)
     - Radio listeners (by city)
   - Each bin gets a `total_heat` score

3. **Globe fetches heat data**
   - `GET /api/heat/heat?city=London`
   - Returns heat bins with coordinates + intensity
   - Mapbox renders as heatmap layer

4. **near_party detection**
   - When creating post, check if geo_hash overlaps active party beacon
   - If yes: set `near_party = true`
   - Feed shows "Near live party" chip

---

## 🤖 AI & SAFETY (FUTURE)

### Night Pulse Assistant (AI Chat)
**Status**: UI complete, backend stub

**To wire:**
1. Create `/api/night-pulse/chat` endpoint
2. Call OpenAI GPT-4 with prompt:
   ```
   You are Night Pulse, the HOTMESS nightlife intelligence AI.
   Context: City={city}, Heat={heatScore}, Events={activeParties}
   User query: {userMessage}
   
   Be helpful, slightly mean, safety-first. Route to /care for medical needs.
   ```
3. Update `NightPulseAssistant.tsx` to call real endpoint

### Safety Scanning (AI Moderation)
**Status**: Not implemented yet

**To wire:**
1. On `POST /right-now`, send text to OpenAI Moderation API
2. If flagged → add to `safety_flags` array
3. If high risk → auto-hide post, send to mod queue
4. Store in `safety_reports` table

---

## 🧪 TESTING CHECKLIST

### Test 1: Anon User Flow
- [ ] Go to `/right-now` (not logged in)
- [ ] Should redirect to `/login?next=/right-now`
- [ ] Sign in with test account
- [ ] Should redirect back to `/right-now`

### Test 2: Onboarding Flow
- [ ] Create new user (delete profile from DB to test)
- [ ] Should redirect to `/onboarding/right-now`
- [ ] Step 1: Select "I'm a man (18+)"
- [ ] Step 2: Enter DOB (must be 18+)
- [ ] Step 3: Enter city "London"
- [ ] Step 4: Check all consent boxes
- [ ] Click "Enter HOTMESS"
- [ ] Should redirect to `/right-now`
- [ ] Check DB: `has_onboarded_right_now = true`

### Test 3: Post Creation (FREE User)
- [ ] Fill out composer form
- [ ] Select mode "hookup"
- [ ] Enter headline "Test post from Shoreditch"
- [ ] Check consent checkbox
- [ ] Click "Drop it Right Now"
- [ ] Post should appear in feed
- [ ] Check DB: post exists, expires_at is 30 min from now
- [ ] Try to create 2nd post → should error "Post limit reached"

### Test 4: Post Expiry
- [ ] Create post
- [ ] Manually set expires_at to past time in DB
- [ ] Wait 5 minutes (for cron job)
- [ ] Post should disappear from feed
- [ ] Check DB: deleted_at is set

### Test 5: Membership Limits
- [ ] Upgrade user to HNH in DB
- [ ] Should be able to create 2 active posts
- [ ] TTL should be 60 minutes
- [ ] XP should be 1.5x multiplier

### Test 6: Men-Only Gate
- [ ] Set user gender to 'other' in DB
- [ ] Try to access `/right-now`
- [ ] Should redirect to `/not-eligible`

### Test 7: Age Gate
- [ ] Set user DOB to < 18 years ago
- [ ] Try to access `/right-now`
- [ ] Should redirect to `/not-eligible`

### Test 8: Shadow Ban
- [ ] Set user shadow_banned = true in DB
- [ ] Try to access `/right-now`
- [ ] Should redirect to `/banned`

---

## 🚀 GO LIVE SEQUENCE

### Pre-Launch (30 minutes)

1. **Deploy database** (5 min)
   ```bash
   supabase db push
   ```

2. **Set up cron jobs** (5 min)
   - Run SQL from section 2 above

3. **Test all gates** (10 min)
   - Run tests 1-8 from testing checklist

4. **Create test data** (5 min)
   - Create 3-5 RIGHT NOW posts in different cities
   - Verify they appear in feed

5. **Final smoke test** (5 min)
   - Fresh incognito window
   - Sign up → onboard → post → see feed
   - Everything should work end-to-end

### Launch

1. **Enable RIGHT NOW in navigation**
   - Add link in main nav: `/right-now`
   - Add to dock component

2. **Monitor first 24 hours**
   - Watch Supabase logs for errors
   - Check cron job executions
   - Monitor post creation rate
   - Watch for abuse/spam

---

## 🐛 KNOWN ISSUES & FIXES

### Issue 1: Auth JWT Not Decoded
**Status**: Workaround in place (temp user IDs)

**Fix:**
```typescript
// In rightnow_api.tsx
async function getUserFromAuth(authHeader: string | null): Promise<string | null> {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  
  return user.id;
}
```

**Priority**: HIGH (do before public launch)

---

### Issue 2: Location Not Auto-Detected
**Status**: Uses hardcoded city or profile city

**Fix:**
Add browser geolocation to frontend:
```typescript
navigator.geolocation.getCurrentPosition(
  (pos) => {
    // Reverse geocode lat/lng → city
    // Set city in composer
  }
);
```

**Priority**: MEDIUM (can launch without this)

---

### Issue 3: AI Chat Not Real
**Status**: Mock responses

**Fix:**
Create `/api/night-pulse/chat` endpoint with OpenAI integration

**Priority**: LOW (nice to have, not blocking)

---

## 📈 METRICS TO TRACK

### Core Metrics
- Daily active users (posting or viewing RIGHT NOW)
- Posts per day (by mode)
- Average TTL before manual delete
- XP earned from RIGHT NOW (total)

### Engagement
- Posts per user per week
- Feed views per session
- Click-through to globe from feed
- near_party posts vs regular posts

### Safety
- Shadow bans issued
- Posts flagged for moderation
- Panic button presses from RIGHT NOW
- Reports per 1000 posts

### Revenue
- FREE → HNH upgrades driven by post limits
- ICON members posting ratio
- Sponsored posts created

---

## ✅ FINAL CHECKLIST

Before you push the big red button:

- [ ] Database migration deployed successfully
- [ ] Cron jobs running (check last execution)
- [ ] Environment variables set (frontend + backend)
- [ ] Server function deployed and responding
- [ ] Middleware enforcing auth gates
- [ ] Onboarding flow complete and tested
- [ ] Membership limits enforced in backend
- [ ] XP awards triggering correctly
- [ ] Heat map updating with RIGHT NOW posts
- [ ] All 8 tests passed
- [ ] Test data created and visible
- [ ] Smoke test successful (fresh user → post → feed)

---

**RIGHT NOW is ready. This is production. Let's go live.** 🔥
