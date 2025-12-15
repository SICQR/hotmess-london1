# RIGHT NOW REALTIME - SETUP & TESTING

**Live updates when posts are created/updated/deleted.**

---

## ✅ WHAT YOU ALREADY DEPLOYED

From your SQL execution, you now have:

1. **Helper function**: `right_now_topic()`
   - Determines realtime topic based on geo_bin or city
   - Example: `right_now:city:London` or `right_now:geo_bin:51.5075_-0.1275_250m`

2. **Broadcast trigger**: `right_now_posts_broadcast_trigger`
   - Fires on INSERT/UPDATE/DELETE
   - Calls `realtime.broadcast_changes()` to send to subscribers

3. **RLS policies**: `rn_can_read` and `rn_can_broadcast`
   - Allows authenticated users to subscribe to private channels
   - Restricts topics to `right_now:city:%` and `right_now:geo_bin:%`

---

## 🔧 SUPABASE DASHBOARD SETTINGS

### Enable Realtime (if not already)

1. Go to **Supabase Dashboard → Project Settings → API**
2. Scroll to **Realtime**
3. Ensure **Realtime is enabled**: ✅

### Enable Private Channels (CRITICAL)

1. Go to **Database → Realtime**
2. Under **Settings**, enable:
   - ✅ **Private channels only**
   - This ensures only authenticated users can subscribe

3. **Optional**: Set max connections
   - Default: 100 concurrent connections
   - For production, increase to 500-1000

---

## 📡 HOW IT WORKS

### Flow: Post Created → Realtime Broadcast

```
1. User creates RIGHT NOW post via Edge Function
   ↓
2. Edge Function inserts row into right_now_posts
   ↓
3. Postgres trigger fires: right_now_posts_broadcast_trigger
   ↓
4. Trigger calls: right_now_topic(NEW, OLD)
   → Returns: "right_now:city:London"
   ↓
5. Trigger calls: realtime.broadcast_changes(topic, 'INSERT', ...)
   ↓
6. Supabase Realtime server broadcasts to all subscribers on that topic
   ↓
7. Frontend receives broadcast event
   ↓
8. Frontend adds post to feed (no reload needed)
```

---

## 🧪 TESTING REALTIME

### Test 1: Dedicated Test Page

1. **Sign in** (realtime requires auth)
2. Go to: `http://localhost:3000/right-now/test-realtime`
3. Should see: "Connected to realtime channel"
4. Open another tab: `http://localhost:3000/right-now`
5. Create a new post in London
6. Watch test page → Should receive broadcast event

**Expected output:**
```json
{
  "type": "INSERT",
  "schema": "public",
  "table": "right_now_posts",
  "new": {
    "id": "...",
    "mode": "hookup",
    "headline": "Test post",
    "city": "London",
    ...
  }
}
```

---

### Test 2: Main Feed Page

1. Open: `http://localhost:3000/right-now`
2. Open browser console (F12)
3. Look for: `[RIGHT NOW REALTIME] Subscribing to: right_now:city:London`
4. Create a post → Should appear instantly without refresh

---

### Test 3: Multiple Tabs (Collaborative Test)

1. Open `/right-now` in 2 browser tabs side-by-side
2. In tab 1: Create a post
3. In tab 2: Post should appear instantly (no refresh)
4. In tab 1: Delete the post
5. In tab 2: Post should disappear instantly

---

## 🐛 TROUBLESHOOTING

### Problem: "Not authenticated" error

**Cause:** Realtime requires auth token

**Fix:**
```typescript
const { data: { session } } = await supabase.auth.getSession()
if (!session?.access_token) {
  console.error('No auth - sign in first')
  return
}

// CRITICAL: Set auth before subscribing
supabase.realtime.setAuth(session.access_token)
```

---

### Problem: Channel stuck on "JOINING"

**Cause:** Private channel not enabled or RLS policy blocking

**Fix:**
1. Check Supabase Dashboard → Database → Realtime → **Private channels only**: ✅
2. Verify RLS policy exists:
   ```sql
   SELECT * FROM pg_policies 
   WHERE schemaname='realtime' 
   AND tablename='messages';
   ```
   Should show `rn_can_read` and `rn_can_broadcast`

---

### Problem: No broadcasts received

**Cause:** Trigger not firing or topic mismatch

**Fix 1: Verify trigger exists**
```sql
SELECT * FROM pg_trigger 
WHERE tgname = 'right_now_posts_broadcast_trigger';
```

**Fix 2: Test topic function**
```sql
SELECT right_now_topic(
  ROW('test-id', 'user-id', 'hookup', 'Test', NULL, 'London', NULL, '51.5075_-0.1275_250m', NULL, NULL, 'free', 'fresh', '{}', false, false, false, NOW(), NOW() + INTERVAL '1 hour', NULL)::right_now_posts,
  NULL::right_now_posts
);
```
Should return: `right_now:geo_bin:51.5075_-0.1275_250m`

**Fix 3: Check logs**
Go to Supabase Dashboard → Logs → Realtime
Look for broadcast events

---

### Problem: "Missing FROM-clause entry" error (original SQL)

**Cause:** Function signature used `new_row` instead of correct parameter

**Fixed version** (already deployed):
```sql
CREATE OR REPLACE FUNCTION public.right_now_topic(
  new_row public.right_now_posts,  -- Parameter name matches function body
  old_row public.right_now_posts
)
```

---

## 📊 MONITORING REALTIME

### Check Active Channels

**Supabase Dashboard:**
1. Go to **Database → Realtime**
2. See active channels and subscriber count

**SQL Query:**
```sql
-- Note: Realtime channels are ephemeral, not stored in DB
-- Use Supabase Dashboard for monitoring
```

---

### Check Broadcast History

**Supabase Dashboard:**
1. Go to **Logs → Realtime**
2. Filter by `broadcast` events
3. See recent broadcasts with payload

---

### Check RLS Policies

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'realtime';
```

Should show:
```
schemaname | tablename | policyname        | cmd    | roles
-----------|-----------|-------------------|--------|----------------
realtime   | messages  | rn_can_read       | SELECT | {authenticated}
realtime   | messages  | rn_can_broadcast  | INSERT | {authenticated}
```

---

## 🎯 TOPIC PATTERNS

### City-based (broader updates)
```typescript
const channel = supabase.channel('right_now:city:London', {
  config: { private: true }
})
```
- Receives: All posts in London
- Use case: City-wide feed

### Geo-bin-based (hyperlocal)
```typescript
const channel = supabase.channel('right_now:geo_bin:51.5075_-0.1275_250m', {
  config: { private: true }
})
```
- Receives: Only posts in that 250m grid
- Use case: Neighborhood-specific feed

### Multiple subscriptions
```typescript
// Subscribe to multiple cities
const london = supabase.channel('right_now:city:London', { config: { private: true } })
const manchester = supabase.channel('right_now:city:Manchester', { config: { private: true } })

london.subscribe()
manchester.subscribe()
```

---

## 🔒 SECURITY

### Why Private Channels?

**Without private channels:**
- Anyone can subscribe to any topic
- No authentication required
- Security risk

**With private channels:**
- Requires `supabase.realtime.setAuth(token)`
- RLS policies enforce who can read/broadcast
- Only authenticated users can subscribe

### RLS Policy Breakdown

**`rn_can_read`** (SELECT on realtime.messages):
```sql
USING (
  private = true
  AND (
    topic LIKE 'right_now:city:%'
    OR topic LIKE 'right_now:geo_bin:%'
  )
)
```
- Only allows reading messages from RIGHT NOW topics
- Requires `private = true` (auth token)

**`rn_can_broadcast`** (INSERT on realtime.messages):
```sql
WITH CHECK (
  private = true
  AND (
    topic LIKE 'right_now:city:%'
    OR topic LIKE 'right_now:geo_bin:%'
  )
)
```
- Only allows broadcasting to RIGHT NOW topics
- Prevents spam on unrelated channels

---

## 📈 PERFORMANCE

### Connection Limits

**Free tier:**
- 100 concurrent realtime connections
- Upgrade for more

**Pro tier:**
- 500+ concurrent connections

### Broadcast Throttling

**Current setup:** No throttling (broadcasts immediately)

**Optional throttling** (if needed):
```typescript
// Client-side debounce
const debouncedHandler = debounce((payload) => {
  handleInsert(payload.new)
}, 100)

channel.on('broadcast', { event: '*' }, debouncedHandler)
```

### Database Impact

**Triggers are lightweight:**
- Only fires on INSERT/UPDATE/DELETE
- Calls `realtime.broadcast_changes()` (non-blocking)
- No performance impact on feed queries

---

## ✅ DEPLOYMENT CHECKLIST

- [x] SQL migration deployed (trigger + policies)
- [x] Realtime enabled in Supabase Dashboard
- [x] Private channels enabled
- [x] Frontend hook created (`useRightNowRealtime`)
- [x] Test page created (`/right-now/test-realtime`)
- [ ] Test realtime in browser (both tabs)
- [ ] Monitor Supabase Realtime logs for broadcasts
- [ ] Verify posts appear instantly without refresh

---

## 🚀 NEXT STEPS

### 1. Globe Integration (Realtime Heat)

When a post is created, also broadcast heat update:

```typescript
// In Edge Function after creating post
await supabase.rpc('increment_heat_bin', { ... })

// Also broadcast heat update
const heatChannel = supabase.channel('heat:city:London')
heatChannel.send({
  type: 'broadcast',
  event: 'heat_update',
  payload: {
    geo_bin: geoBin,
    heat_delta: +10,
  }
})
```

### 2. Typing Indicators

Show when someone is typing a post:

```typescript
// User typing
channel.send({
  type: 'broadcast',
  event: 'typing',
  payload: { user_id: userId }
})

// Other users see: "Someone is crafting a signal..."
```

### 3. Presence (Who's Online)

Track who's viewing RIGHT NOW feed:

```typescript
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState()
  console.log('Online users:', Object.keys(state).length)
})

channel.track({ user_id: userId, city: 'London' })
```

---

**Realtime is live. Test it. Ship it.** 🔥
