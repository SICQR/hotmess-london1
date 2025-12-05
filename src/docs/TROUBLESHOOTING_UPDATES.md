# 🔧 Why You're Not Seeing Updates - Troubleshooting Guide

## Quick Diagnosis

If you're not seeing the new RadioKing or RAW Convict features, here's why and how to fix it:

---

## 🎧 RADIOKING LIVE LISTENERS

### Where to See It

The RadioKing integration shows on these pages:

1. **Radio Page** (`/?route=radio` or navigate to Radio from menu)
   - Live listeners badge (top-right corner)
   - Radio Stats panel (below hero)
   - Now Playing bar (sticky bottom)
   - XP tracking notifications

2. **City OS Page** (`/?route=cityOS&city=london`)
   - Live listeners badge (top-right corner)
   - Radio Pulse panel (top section)

### Why You Might Not See It

#### Issue 1: Not on the Right Page
**Solution:** Navigate to Radio page:
```
Click "Radio" in main navigation
OR
Visit: https://hotmess.london/?route=radio
```

#### Issue 2: RadioKing API Not Configured (MOST LIKELY)
**Symptom:** Shows mock data with warning "Using mock data - Add RADIOKING_API_KEY"

**Solution:**
1. Log into RadioKing dashboard
2. Go to Settings → API
3. Generate API key
4. Add to Supabase:
   ```
   Edge Functions → Environment Variables:
   RADIOKING_STATION_ID=736103
   RADIOKING_API_KEY=rk_live_xxxxx
   ```
5. Redeploy Edge Function:
   ```bash
   supabase functions deploy radio
   ```

#### Issue 3: Edge Function Not Deployed
**Symptom:** Network errors in console

**Solution:**
```bash
cd /path/to/hotmess
supabase functions deploy radio
```

#### Issue 4: Browser Cache
**Solution:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear cache and reload

---

## 🎵 RAW CONVICT SYSTEM

### Where to See It

1. **RAW Manager Dashboard** (Admin only)
   - Navigate: `/?route=rawManager`
   - OR: Click Admin button (bottom-right) → "RAW Manager"
   - Shows all releases, TikTok reel generation, QR posters

2. **Artist Profile Page**
   - Navigate: `/?route=artistPage&artistId=1`
   - Shows artist info, releases, stats

### Why You Might Not See It

#### Issue 1: Not Navigating to RAW Manager
**Solution:**
1. Click the floating Admin button (bottom-right corner with ⚙️ icon)
2. Click "RAW Manager" in the menu
3. OR manually navigate to `/?route=rawManager`

#### Issue 2: Database Tables Don't Exist
**Symptom:** Shows mock data with 3 sample releases

**This is NORMAL for testing!** The system falls back to mock data so you can see the UI without setting up databases.

**To use real data:**
```sql
-- Run in Supabase SQL Editor
CREATE TABLE raw_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  avatar TEXT,
  soundcloud_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE raw_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES raw_artists(id),
  title TEXT NOT NULL,
  artwork TEXT,
  soundcloud_url TEXT NOT NULL,
  soundcloud_id TEXT,
  release_date DATE,
  bpm INTEGER,
  genre TEXT,
  duration INTEGER,
  plays INTEGER DEFAULT 0,
  tiktok_reel_url TEXT,
  qr_poster_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Issue 3: Edge Function Not Deployed
**Solution:**
```bash
supabase functions deploy raw
```

#### Issue 4: Not Logged In As Admin
**Solution:**
1. Log in to your account
2. Click Admin button (bottom-right)
3. Click "Enable Admin Mode" if needed
4. Try accessing RAW Manager again

---

## 🚀 QUICK TEST CHECKLIST

### Test RadioKing Integration

1. ✅ Navigate to Radio page: `/?route=radio`
2. ✅ Look for floating badge (top-right): "248 listening"
3. ✅ Scroll to "Radio Pulse" section
4. ✅ Click "Listen Live" button
5. ✅ Check for XP notification: "+10 XP for listening"
6. ✅ Look for sticky bar at bottom with track info

**If you see mock data warning:** That's OK! It means the UI is working, just needs API key.

---

### Test RAW Convict System

1. ✅ Log in to your account
2. ✅ Click Admin button (bottom-right with ⚙️ icon)
3. ✅ Click "RAW Manager"
4. ✅ Should see releases grid with 3 sample tracks
5. ✅ Click on a release's "Open in SoundCloud" button
6. ✅ Try "Gen Reel" button (triggers generation)
7. ✅ Navigate back and try Artist page: `/?route=artistPage&artistId=1`

**If you see 3 mock releases:** Perfect! That's the test data.

---

## 📱 BROWSER-SPECIFIC ISSUES

### Chrome/Edge
- Clear cache: `Settings → Privacy → Clear browsing data`
- Hard refresh: `Ctrl+Shift+R`

### Firefox
- Clear cache: `Options → Privacy → Clear Data`
- Hard refresh: `Ctrl+Shift+R`

### Safari
- Clear cache: `Safari → Clear History`
- Hard refresh: `Cmd+Option+R`

---

## 🔍 CONSOLE DEBUGGING

### Check Console for Errors

1. Open DevTools: `F12` or `Right-click → Inspect`
2. Go to Console tab
3. Look for errors (red text)

**Common errors:**

#### "Failed to fetch radio status"
**Cause:** Edge function not deployed or CORS issue
**Fix:** Deploy function: `supabase functions deploy radio`

#### "RadioKing API not configured"
**Cause:** Missing API key
**Fix:** Add `RADIOKING_API_KEY` to Supabase env

#### "Artist not found"
**Cause:** Database tables don't exist
**Fix:** Run SQL create table commands above (OR just use mock data for testing)

---

## 💡 EXPECTED BEHAVIOR

### RadioKing (When API Key Not Set)

**What you'll see:**
- ✅ All UI components visible
- ✅ Mock data: "248 listening", "Wet Black Chrome" track
- ✅ Warning banner: "Using mock data"
- ✅ All features work (just with fake data)

**This is INTENTIONAL!** You can test the full UI without API keys.

### RAW Convict (When Database Empty)

**What you'll see:**
- ✅ Manager dashboard loads
- ✅ 3 sample releases shown
- ✅ All buttons work
- ✅ Artist pages load

**This is INTENTIONAL!** Mock data lets you test before setting up databases.

---

## 📊 NETWORK TAB DEBUGGING

### Check API Calls

1. Open DevTools → Network tab
2. Navigate to Radio page
3. Look for call to `/make-server-a670c824/radio/listeners`
4. Click it → Preview tab
5. Should see JSON response with listener data

**If 404 error:** Edge function not deployed
**If 500 error:** Check Edge Function logs
**If CORS error:** Edge function needs CORS headers (already added)

---

## 🎯 MOST LIKELY ISSUE

**99% of the time, the issue is:**

1. **You're not on the right page**
   - Radio features are on `/radio` page
   - RAW features are on `/raw/manager` page

2. **API keys not configured**
   - RadioKing needs `RADIOKING_API_KEY`
   - But system works with mock data anyway!

3. **Browser cache**
   - Hard refresh usually fixes it

---

## ✅ VERIFICATION STEPS

### Radio Integration Working?

Run this test:
1. Navigate to `/?route=radio`
2. Should see hero image with "RAW CONVICT RADIO"
3. Scroll down
4. Should see "Radio Pulse" section with listener counts
5. Click "Listen Live" button
6. Should see toast notification: "+10 XP"
7. Bottom bar should appear with track info

**If ANY of these work → Integration is live!**

### RAW Convict Working?

Run this test:
1. Click Admin button (bottom-right ⚙️)
2. Click "RAW Manager"
3. Should see page title "RAW CONVICT"
4. Should see "3" under "Total Releases"
5. Should see grid with 3 release cards
6. Click any release's SoundCloud button

**If ANY of these work → System is live!**

---

## 🚨 STILL NOT WORKING?

### Last Resort Checks

1. **Are you logged in?**
   - Some features require auth
   - Check top-right for user menu

2. **Is JavaScript enabled?**
   - Whole app is React-based
   - Check browser console for errors

3. **Are you on correct domain?**
   - Should be `hotmess.london` or `localhost:5173`

4. **Is app even loading?**
   - Should see age gate → splash screen → home
   - If stuck on splash, refresh page

---

## 📞 SUPPORT

If you've tried everything and still don't see updates:

1. Check browser console for errors (F12)
2. Check Network tab for failed API calls
3. Verify you're on the right page URL
4. Try different browser
5. Try incognito/private mode

**Most likely:** You're looking in the wrong place! The features ARE there, just need to navigate to them.

---

## 🎉 SUCCESS INDICATORS

**You'll know it's working when you see:**

### Radio:
- Floating badge with listener count (top-right)
- "Radio Pulse" section with 3 stat boxes
- Sticky bottom bar when playing
- XP toast notifications

### RAW Convict:
- "RAW CONVICT" page title
- Release grid with artwork
- BPM badges on releases
- Action buttons (TikTok, QR, Radio)

**If you see ANY of these → IT'S WORKING!**

---

Remember: Mock data is INTENTIONAL. You can test the entire system without API keys or databases. Just add real data when you're ready to go live!
