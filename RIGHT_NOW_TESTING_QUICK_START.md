# RIGHT NOW - Testing Quick Start (Figma Make)

**Status:** ✅ Ready to Test  
**Date:** December 10, 2024  
**Environment:** Figma Make

---

## 🎯 Quick Access

### Main Testing Routes

1. **Test Dashboard** → `/right-now/test-dashboard`
   - Complete infrastructure overview
   - System health status
   - API endpoint documentation
   - Quick links to all test tools

2. **Interactive Test Panel** → `/right-now/test`
   - Create posts with UI
   - Test all 4 modes (hookup, crowd, drop, care)
   - Realtime logs
   - Delete & broadcast testing

3. **Live Feed** → `/right-now/live`
   - Production RIGHT NOW feed
   - 3D globe with heat clusters
   - Real posts from database

4. **Demo Feed** → `/right-now/demo`
   - Demo version with mock data
   - No authentication required

---

## 🚀 Getting Started (3 Steps)

### Step 1: Check System Health
1. Go to the homepage
2. Scroll to "RIGHT NOW Testing" section
3. Click **"Test Dashboard"**
4. Verify system status shows **"LIVE"** (green)

### Step 2: Create Test Posts
1. From Test Dashboard, click **"Test Panel"**
2. Select a post mode (hookup/crowd/drop/care)
3. Click **"Create"** button
4. Watch realtime log for success message

### Step 3: Verify Realtime
1. Open **"Live Feed"** in a new tab
2. Create a post in the Test Panel
3. See it appear instantly in Live Feed
4. Broadcasts should show in both panels

---

## 📡 Test Endpoints

### Base URL
```
https://{PROJECT_ID}.supabase.co/functions/v1/right-now-test
```

### Available Endpoints

1. **GET /health** - No auth required
   - Verify the Edge Function is running
   - Returns system status and available routes

2. **POST /create** - Requires auth token
   - Create test posts
   - Respects RLS policies
   - Returns created post with ID

3. **POST /delete** - Requires auth token
   - Soft-delete posts (sets deleted_at)
   - Can only delete your own posts

4. **POST /broadcast** - No auth required
   - Send realtime broadcasts
   - Uses service role key internally
   - Broadcasts to city channels

---

## 🎨 Post Modes

Test all 4 modes from the Test Panel:

| Mode | Icon | Color | Purpose |
|------|------|-------|---------|
| **hookup** | ⚡ | Hot Pink (#FF1744) | Hookup posts |
| **crowd** | 👥 | Cyan (#00E5FF) | Crowd verification |
| **drop** | 💧 | Magenta (#FF10F0) | Drop announcements |
| **care** | ❤️ | Purple (#7C4DFF) | Care check-ins |

---

## 🧪 Testing Workflows

### Test 1: Basic Create & Delete
1. Open Test Panel
2. Select mode: **hookup**
3. Click **Create** → Note the Post ID
4. Click **Delete** → Verify success
5. Check logs for both operations

### Test 2: Test All Modes
1. Open Test Panel
2. Create one post for each mode:
   - hookup
   - crowd
   - drop
   - care
3. Open Live Feed in new tab
4. Verify all 4 posts appear with correct styling

### Test 3: Realtime Updates
1. Open Live Feed in Tab 1
2. Open Test Panel in Tab 2
3. Create a post in Tab 2
4. Watch it appear in Tab 1 instantly
5. Delete the post in Tab 2
6. Watch it disappear from Tab 1

### Test 4: Broadcast Testing
1. Open Test Panel
2. Set city: **London**
3. Click **Broadcast** button
4. Check logs for broadcast confirmation
5. Verify channel: `city:london`

---

## 🔍 What to Look For

### Success Indicators ✅
- Health endpoint returns `"status": "LIVE"`
- Create returns Post ID
- Logs show green checkmarks
- Posts appear in Live Feed
- Realtime updates work instantly
- Delete sets `deleted_at` timestamp

### Common Issues 🐛

**Issue:** 401 Unauthorized
- **Cause:** Not signed in
- **Fix:** Sign in first (auth bypass is auto-enabled in dev mode)

**Issue:** Broadcast not received
- **Cause:** Channel mismatch
- **Fix:** Ensure city name matches (case-insensitive)

**Issue:** Post doesn't appear in feed
- **Cause:** Expired or deleted
- **Fix:** Check `expires_at` and `deleted_at` fields

---

## 📊 Infrastructure Summary

### What's Ready
✅ Edge Function: `right-now-test` (4 endpoints)  
✅ Frontend Test Panel: `/right-now/test`  
✅ Test Dashboard: `/right-now/test-dashboard`  
✅ Realtime hooks: `useRightNowRealtime`  
✅ SQL seed data: 8 test posts  
✅ Bash script: `./scripts/test-right-now.sh`  
✅ Documentation: `/docs/RIGHT_NOW_E2E_TESTING.md`

### Test Data
- 8 seed posts across all modes
- Various locations around London
- Mix of safety flags and scores
- Test posts have `[TEST]` prefix

---

## 🎯 Quick Test Checklist

Use this to verify everything works:

- [ ] Health endpoint responds
- [ ] Can create hookup post
- [ ] Can create crowd post
- [ ] Can create drop post
- [ ] Can create care post
- [ ] Can delete own post
- [ ] Broadcast reaches channel
- [ ] Realtime updates work
- [ ] Live Feed shows posts
- [ ] Globe view renders
- [ ] Test Dashboard loads

---

## 🔥 Pro Tips

1. **Use the Test Dashboard first** - It gives you the full overview
2. **Keep Test Panel and Live Feed open** - See realtime updates
3. **Watch the logs** - They show exactly what's happening
4. **Test all 4 modes** - Make sure each mode renders correctly
5. **Check expires_at** - Posts expire after 1 hour by default

---

## 📱 Mobile Testing

All test tools work on mobile:
- Test Dashboard is responsive
- Test Panel works on touch devices
- Live Feed adapts to mobile screens
- Globe view supports touch gestures

---

## 🎉 Success Criteria

You'll know it's working when:

✅ Health check shows green "LIVE" status  
✅ Creating posts returns Post IDs  
✅ Posts appear in Live Feed instantly  
✅ All 4 modes render with correct colors  
✅ Deleting posts removes them from feed  
✅ Broadcasts reach subscribers  
✅ Logs show detailed operation info  
✅ No auth errors (dev bypass enabled)

---

## 🆘 Need Help?

1. Check `/docs/RIGHT_NOW_E2E_TESTING.md` for detailed docs
2. Review logs in Test Panel for errors
3. Verify health endpoint is responding
4. Check browser console for frontend errors

---

**Ready to test. Drop it. Right now. 🔥**

Access the Test Dashboard: `/right-now/test-dashboard`
