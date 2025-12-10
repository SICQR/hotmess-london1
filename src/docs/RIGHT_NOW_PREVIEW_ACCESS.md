# RIGHT NOW - HOW TO ACCESS IN PREVIEW

**The RIGHT NOW page is now live in your preview window.**

---

## 🎯 HOW TO ACCESS

### Method 1: Query Parameter (Direct)
```
?page=rightNow
```

### Method 2: Navigation Menu
1. Click the hamburger menu (top right)
2. Under **"Nightlife"** section
3. Click **"Right Now"** (first item, marked with LIVE badge)

---

## ✅ WHAT YOU'LL SEE

### Header
- 🔴 **LIVE NOW** indicator (pulsing red icon)
- **RIGHT NOW** title
- City: London

### Filters
- **All** / Hookup / Crowd / Drop / Care mode buttons
- Safe / Verified only toggle

### Composer
- Click "Drop Something Right Now" to expand
- Select mode (hookup/crowd/drop/care)
- Enter headline + optional details
- Check consent box
- Click "Drop it Right Now" to post

### Feed
- Live posts from RIGHT NOW system
- Auto-updates via realtime (no refresh needed)
- Each post shows:
  - Mode badge (hookup/crowd/drop/care)
  - Membership tier (if not free)
  - 🔥 Near live party (if applicable)
  - ✓ Verified badge (if verified_host)
  - Time remaining (countdown to expiry)
  - Score (algorithmic ranking)

### Panic Button
- Fixed bottom-right corner
- Always accessible
- Click to trigger Hand N Hand care flow

---

## 🧪 TESTING REALTIME

### Open Two Tabs:
1. **Tab 1**: `?page=rightNow`
2. **Tab 2**: `?page=rightNow`

### Create a post in Tab 1:
- Click "Drop Something Right Now"
- Fill out form
- Submit

### Watch Tab 2:
- Post should appear **instantly** (no refresh)
- This confirms realtime is working

---

## 🔧 CURRENT STATE

### ✅ WORKING:
- Feed loads posts from backend
- Composer creates posts
- Realtime updates (INSERT/UPDATE/DELETE)
- Filters (mode, safe-only)
- Delete posts (hover to see trash icon)
- Panic button
- Responsive design
- HOTMESS dark neon aesthetic

### ⚠️ REQUIRES AUTH:
- You need to be signed in to post
- If not signed in:
  - Feed will load (read-only)
  - Composer will require login
  - Middleware will redirect to `/login` if accessing certain features

### 🔜 NOT YET WIRED:
- Onboarding wizard (men-only, 18+ flow)
- Near party detection (needs party_beacons data)
- AI safety scanner (needs OpenAI integration)
- Telegram mirroring (needs bot setup)
- Night Pulse AI chat (needs OpenAI chat endpoint)

---

## 📊 BACKEND STATUS

### ✅ DEPLOYED:
- Database migration (`300_right_now_production.sql`)
- Edge Function (`/supabase/functions/right-now/index.ts`)
- Realtime triggers + RLS policies

### 🧪 TO TEST:
```bash
# Test feed endpoint
curl "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/right-now?city=London"

# Expected: {"posts":[...]}
```

---

## 🎨 UI COMPONENTS

All in `/components/rightnow/`:
- ✅ `RightNowShell.tsx` - Main page (updated to production)
- ✅ `RightNowFeed.tsx` - Feed rendering
- ✅ `RightNowComposer.tsx` - Post creation form
- ✅ `RightNowFilters.tsx` - Mode/distance filters
- ✅ `PanicButton.tsx` - Emergency care trigger
- ✅ `PanicOverlay.tsx` - Full-screen panic flow

---

## 🔥 REALTIME FEATURES

### What updates live:
- **New posts** → Prepended to feed
- **Expired posts** → Removed from feed
- **Deleted posts** → Removed from feed
- **Shadow banned posts** → Removed from feed

### Topics:
- `right_now:city:London` - All posts in London
- `right_now:geo_bin:{geo_bin}` - Hyperlocal (250m grid)

### Debug:
Visit `?page=rightNowTestRealtime` to see realtime event log

---

**The preview is ready. Navigate to RIGHT NOW and start posting.** 🔥
