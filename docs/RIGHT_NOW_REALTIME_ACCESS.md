# RIGHT NOW REALTIME - LIVE IN PREVIEW! 🔥

## ✅ ACCESS RIGHT NOW

### Main Feed
```
?page=rightNow
```

### Realtime Test Page (Debug)
```
?page=rightNowRealtimeTest
```

---

## 🧪 HOW TO TEST REALTIME

### Quick Test (2 Tabs):

1. **Tab 1**: Open `?page=rightNowRealtimeTest`
   - Shows connection status
   - Displays event log
   - Confirms realtime subscription

2. **Tab 2**: Open `?page=rightNow`
   - Create a new post
   - Watch Tab 1 for broadcast event

3. **Expected Result**: 
   - Tab 1 shows `INSERT` event with full post payload
   - Post appears in Tab 2 feed instantly (no refresh)

---

## 📡 WHAT YOU'LL SEE IN TEST PAGE

### Connection States:
- ⏳ **Connecting** - Setting up realtime subscription
- ✅ **Connected** - Successfully subscribed to `right_now:city:London`
- ❌ **Error** - Connection failed (check auth or RLS)

### Event Types:
- 🟢 **status** - Channel subscription status
- 🔴 **broadcast** - Live realtime event (INSERT/UPDATE/DELETE)
- 🔴 **error** - Error message (no auth, RLS block, etc.)

---

## 🎯 DEBUGGING CHECKLIST

### If Test Page Shows "Error":

**1. Check Auth**
```typescript
// Should see in console:
[RIGHT NOW REALTIME] Auth token set for realtime

// If not, sign in first
?page=login
```

**2. Verify Channel Topic**
```typescript
// Test page subscribes to:
right_now:city:London

// Must match trigger logic exactly
```

**3. Check RLS Policies**
```sql
-- Should return 2 policies:
SELECT policyname FROM pg_policies 
WHERE schemaname='realtime' AND tablename='messages';

-- Expected:
-- rn_can_read
-- rn_can_broadcast
```

---

## 🔥 EXPECTED BROADCAST PAYLOAD

When you create a post, Tab 1 should show:

```json
{
  "type": "broadcast",
  "event": "INSERT",
  "payload": {
    "type": "INSERT",
    "schema": "public",
    "table": "right_now_posts",
    "new": {
      "id": "...",
      "user_id": "...",
      "mode": "hookup",
      "headline": "Test post from preview",
      "body": null,
      "city": "London",
      "geo_bin": "51.5075_-0.1275_250m",
      "membership_tier": "free",
      "xp_band": "fresh",
      "safety_flags": [],
      "near_party": false,
      "sponsored": false,
      "score": 50,
      "created_at": "2024-...",
      "expires_at": "2024-...",
      "deleted_at": null,
      "shadow_banned": false
    },
    "old": null
  }
}
```

---

## 🚨 COMMON ISSUES

### Issue: "No auth session found"
**Fix:** Sign in first, then reload test page

### Issue: Channel stuck on "JOINING"
**Fix:** 
1. Check Supabase Dashboard → Realtime → Private channels enabled
2. Verify RLS policies exist
3. Check auth token is set

### Issue: No broadcasts received
**Fix:**
1. Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'right_now_posts_broadcast_trigger'`
2. Check Supabase Logs → Realtime for broadcast events
3. Ensure post is in same city (London)

---

## 📊 MONITORING IN SUPABASE

### Check Active Channels:
1. Go to Supabase Dashboard
2. Click **Database → Realtime**
3. See active channels + subscriber count

### Check Broadcast History:
1. Go to **Logs → Realtime**
2. Filter by `broadcast` events
3. See recent broadcasts with payload

### Check RLS Policies:
```sql
SELECT * FROM pg_policies 
WHERE schemaname='realtime';
```

---

## ✅ SUCCESS CRITERIA

You know realtime is working when:

1. ✅ Test page shows "Connected to realtime channel"
2. ✅ Creating a post triggers a broadcast event in test page
3. ✅ Main feed updates instantly without refresh
4. ✅ Deleting a post removes it from all tabs
5. ✅ Multiple tabs stay in sync

---

**Test it now! Open the preview and navigate to `?page=rightNowRealtimeTest`** 🔥
