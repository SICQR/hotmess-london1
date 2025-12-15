# 🔥 RIGHT NOW FEED — DEPLOYMENT GUIDE

**Date:** December 9, 2025  
**Status:** ✅ **PRODUCTION READY**

---

## 🎯 **WHAT THIS IS:**

A **readable, filterable feed** of live RIGHT NOW posts with:
- Real-time data from Supabase
- City/Intent/Time filters
- Clean Tailwind UI
- Globe integration ready
- Public read-only API

---

## 📦 **FILES DEPLOYED:**

```
/supabase/functions/right-now-feed/
  └─ index.ts                          ← GET endpoint

/components/rightnow/
  └─ RightNowFeed.tsx                  ← Feed UI component

/pages/
  └─ RightNowLivePage.tsx              ← Feed + Globe page

/components/
  └─ Router.tsx                        ← Updated with routes
```

---

## 🚀 **DEPLOYMENT STEPS:**

### **STEP 1: Deploy Edge Function**

```bash
# Deploy feed endpoint
supabase functions deploy right-now-feed --no-verify-jwt

# Verify
supabase functions list
```

**Expected output:**
```
┌────────────────────┬─────────┬────────────────┐
│ Name               │ Status  │ Version        │
├────────────────────┼─────────┼────────────────┤
│ right-now-create   │ Active  │ v1             │
│ right-now-feed     │ Active  │ v1             │
└────────────────────┴─────────┴────────────────┘
```

---

### **STEP 2: Test Feed Endpoint**

```bash
# Get all live posts
curl "https://{projectId}.supabase.co/functions/v1/right-now-feed?window=live"

# Filter by city
curl "https://{projectId}.supabase.co/functions/v1/right-now-feed?city=London"

# Filter by intent
curl "https://{projectId}.supabase.co/functions/v1/right-now-feed?intent=hookup"

# Combine filters
curl "https://{projectId}.supabase.co/functions/v1/right-now-feed?city=London&intent=hookup&window=1h"
```

**Expected response:**
```json
{
  "items": [
    {
      "id": "...",
      "intent": "hookup",
      "text": "Solo at E1, looking for dark room energy",
      "city": "London",
      "country": "UK",
      "roomMode": "solo",
      "crowdCount": null,
      "createdAt": "2025-12-09T23:45:00Z",
      "expiresAt": "2025-12-10T00:45:00Z",
      "hostBeaconId": null,
      "allowAnonSignals": true
    }
  ],
  "window": "live"
}
```

---

### **STEP 3: Test React Component**

```bash
# Build and preview
npm run build
npm run preview

# Navigate to:
http://localhost:4173/?route=rightNowLivePage
```

**Verify:**
- ✓ Feed loads
- ✓ Posts display
- ✓ Filters work
- ✓ Countdown updates
- ✓ City filter works
- ✓ Intent badges colored correctly

---

### **STEP 4: Deploy Frontend**

```bash
# Production build
npm run build

# Deploy
vercel deploy --prod
# or
netlify deploy --prod
```

---

## 🗺️ **HOW TO ACCESS:**

### **Via Direct Route:**
```
https://hotmess.lgbt/?route=rightNowLivePage
```

### **Via Homepage:**
```
Homepage → Click "RIGHT NOW" → See live feed
```

### **Via Sidebar:**
```
Sidebar → Nightlife → Right Now [LIVE]
```

---

## 🔍 **API PARAMETERS:**

### **GET /right-now-feed**

**Query Parameters:**
```
?window=live|10m|1h|24h    (default: live)
?city=London               (optional, case-insensitive)
?intent=hookup             (optional: hookup|crowd|drop|ticket|radio|care)
?limit=40                  (optional, max: 100, default: 40)
```

**Time Windows:**
- `live` → Last 90 minutes
- `10m` → Last 10 minutes
- `1h` → Last 1 hour
- `24h` → Last 24 hours

**Response Schema:**
```typescript
{
  items: Array<{
    id: string;
    intent: 'hookup' | 'crowd' | 'drop' | 'ticket' | 'radio' | 'care';
    text: string;
    city: string;
    country: string | null;
    roomMode: 'solo' | 'host';
    crowdCount: number | null;
    createdAt: string;  // ISO 8601
    expiresAt: string;  // ISO 8601
    hostBeaconId: string | null;
    allowAnonSignals: boolean;
  }>;
  window: string;
}
```

---

## 🎨 **UI FEATURES:**

### **Filters:**
- **Time Window:** Live, 10m, 1h, 24h
- **Intent:** All, Hookup, Party, Drop, Ticket, Radio, Care
- **City:** Free text input

### **Post Cards:**
- Intent badge (colored by type)
- Host/Solo indicator
- Crowd count (if host mode)
- City + Country
- Live countdown timer
- Click to view on map (if callback provided)

### **Stats:**
- Active pulse count
- Hottest post (by crowd + room mode)

### **Design:**
- Uses `.hm-panel`, `.hm-label`, `.hm-chip` utilities
- Responsive (mobile-first)
- Scrollable feed (max-height: 420px)
- Intent colors match globe heat

---

## 🌍 **GLOBE INTEGRATION:**

### **Heat Data Flow:**

```
1. User creates RIGHT NOW post
   └─> right-now-create Edge Function

2. Creates heat_events record
   └─> {city, country, source: 'right_now', intent, crowd_count}

3. Globe queries heat_events
   └─> Aggregates by city
   └─> Shows intensity based on count

4. Feed queries right_now_posts
   └─> Filters by city/intent/time
   └─> Shows individual posts

5. User clicks city on globe
   └─> Updates feed city filter
   └─> Shows posts for that city
```

### **Integration Example:**

```tsx
import { RightNowFeed } from '../components/rightnow/RightNowFeed';
import { MapboxGlobe } from '../components/globe/MapboxGlobe';

export function RightNowPage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <div className="flex">
      {/* Feed */}
      <RightNowFeed
        apiBase={API_BASE}
        defaultCity={selectedCity || ""}
        onOpenOnMap={(item) => setSelectedCity(item.city)}
      />

      {/* Globe */}
      <MapboxGlobe
        onCityClick={(city) => setSelectedCity(city.name)}
        highlightedCity={selectedCity}
      />
    </div>
  );
}
```

---

## 🔥 **INTENT COLORS:**

```typescript
const INTENT_COLOR = {
  hookup: "#FF1744",  // Red
  crowd: "#FF6E40",   // Orange
  drop: "#FF10F0",    // Magenta
  ticket: "#FFD600",  // Yellow
  radio: "#00E5FF",   // Cyan
  care: "#00C853",    // Green
};
```

**Use these same colors on globe heat visualization.**

---

## 📊 **DATABASE QUERIES:**

### **Check feed data:**
```sql
-- All live posts
SELECT 
  id, intent, city, 
  EXTRACT(EPOCH FROM (expires_at - NOW())) / 60 AS minutes_remaining
FROM right_now_posts
WHERE expires_at > NOW()
  AND show_on_globe = true
ORDER BY created_at DESC;

-- Posts by city
SELECT city, COUNT(*) AS count
FROM right_now_posts
WHERE expires_at > NOW()
  AND show_on_globe = true
GROUP BY city
ORDER BY count DESC;

-- Posts by intent
SELECT intent, COUNT(*) AS count
FROM right_now_posts
WHERE expires_at > NOW()
  AND show_on_globe = true
GROUP BY intent;

-- Heat events today
SELECT 
  city,
  intent,
  COUNT(*) AS heat_count
FROM heat_events
WHERE created_at > NOW() - INTERVAL '1 day'
  AND source = 'right_now'
GROUP BY city, intent
ORDER BY heat_count DESC;
```

---

## 🧪 **TESTING CHECKLIST:**

### **Edge Function:**
- [ ] Returns empty array when no posts
- [ ] Filters by city (case-insensitive)
- [ ] Filters by intent
- [ ] Filters by time window
- [ ] Respects limit parameter
- [ ] Only returns show_on_globe=true
- [ ] Only returns non-expired posts
- [ ] CORS headers present

### **React Component:**
- [ ] Loads without errors
- [ ] Shows loading state
- [ ] Shows empty state
- [ ] Shows error state
- [ ] Filters toggle on/off
- [ ] City input updates on blur
- [ ] Intent chips toggle correctly
- [ ] Time window chips work
- [ ] Countdown updates every second
- [ ] Post click calls onOpenOnMap
- [ ] Responsive on mobile
- [ ] Scrollable when > 420px height

---

## 🚨 **TROUBLESHOOTING:**

### **Feed returns empty:**
```
Problem: No posts match filters
Solution:
1. Check database has live posts
2. Try removing filters
3. Check expires_at > NOW()
4. Verify show_on_globe = true
```

### **Countdown shows EXPIRED:**
```
Problem: expires_at in past
Solution:
1. Check system time
2. Verify TTL set correctly on create
3. Clear expired posts from DB
```

### **Filters don't work:**
```
Problem: State not updating
Solution:
1. Check loadFeed called in useEffect
2. Verify dependency array correct
3. Check API params sent correctly
```

### **Globe not syncing:**
```
Problem: Missing callback
Solution:
1. Pass onOpenOnMap prop
2. Implement setSelectedCity state
3. Pass selectedCity to defaultCity
```

---

## 🎯 **PERFORMANCE:**

### **Optimization:**
- Feed polls every 15s (configurable)
- Limit default: 40 posts
- Max limit: 100 posts
- Database indexed on:
  - `expires_at`
  - `city`
  - `created_at`
  - `intent`

### **Caching:**
```typescript
// TODO: Add Redis cache for feed endpoint
// Cache key: `feed:${city}:${intent}:${window}`
// TTL: 15 seconds
```

---

## 📈 **METRICS TO TRACK:**

```sql
-- Feed endpoint calls per hour
SELECT 
  DATE_TRUNC('hour', timestamp) AS hour,
  COUNT(*) AS requests
FROM api_logs
WHERE endpoint = '/right-now-feed'
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;

-- Most filtered cities
SELECT 
  city_param AS city,
  COUNT(*) AS searches
FROM api_logs
WHERE endpoint = '/right-now-feed'
  AND city_param IS NOT NULL
GROUP BY city
ORDER BY searches DESC
LIMIT 10;

-- Most filtered intents
SELECT 
  intent_param AS intent,
  COUNT(*) AS searches
FROM api_logs
WHERE endpoint = '/right-now-feed'
  AND intent_param IS NOT NULL
GROUP BY intent
ORDER BY searches DESC;
```

---

## ✅ **SUCCESS CRITERIA:**

**Feed is working when:**
1. ✅ Edge Function returns data
2. ✅ React component renders
3. ✅ Filters update results
4. ✅ Countdown updates live
5. ✅ Posts disappear when expired
6. ✅ City filter syncs with globe
7. ✅ Intent colors match
8. ✅ Mobile responsive
9. ✅ No console errors
10. ✅ Loads < 500ms

---

## 🔮 **NEXT FEATURES:**

**After stable deployment:**

1. **Real-time subscriptions** (Supabase Realtime)
   ```typescript
   supabase
     .channel('right_now_posts')
     .on('postgres_changes', 
       { event: 'INSERT', schema: 'public', table: 'right_now_posts' },
       (payload) => { /* Add to feed */ }
     )
     .subscribe();
   ```

2. **Infinite scroll** (Pagination)
   ```typescript
   const [cursor, setCursor] = useState<string | null>(null);
   // Load more when scrolling to bottom
   ```

3. **User blocking** (Hide posts from blocked users)
   ```typescript
   WHERE user_id NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = $1)
   ```

4. **Saved searches** (Remember filters)
   ```typescript
   localStorage.setItem('rnFilters', JSON.stringify({ city, intent, window }));
   ```

5. **Push notifications** (New posts in your city)
   ```typescript
   if (newPost.city === userCity && userPrefs.notifyRightNow) {
     sendPushNotification(...);
   }
   ```

---

## 🖤 **FINAL NOTES:**

**This is NOT a social feed. This is a SIGNAL NETWORK.**

- Posts expire in 60 mins (not forever)
- No likes, no comments, no shares
- Just raw pulses from men RIGHT NOW
- Wired into globe, beacons, heat, safety

**The feed is the UI. The globe is the truth.**

When someone posts "Solo at E1" at 11:47 PM:
- It appears in feed
- It glows on globe
- It trains Mess Brain
- It expires at 12:47 AM
- It's gone forever

**That's the temporal warp drive.** ⏱️🚀

---

**Built with 🖤 • HOTMESS LONDON • The global queer nightlife OS.**
