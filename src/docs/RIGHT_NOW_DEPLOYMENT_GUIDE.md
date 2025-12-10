# 🚀 RIGHT NOW — DEPLOYMENT GUIDE

**Date:** December 9, 2025  
**Status:** ✅ **READY TO DEPLOY**

---

## 🎯 **WHAT YOU'RE DEPLOYING:**

The complete RIGHT NOW system:
- ✅ Creation form (React)
- ✅ Feed page (React)
- ✅ Panic overlay (React)
- ✅ Mess Brain AI (React)
- ✅ Admin War Room (React)
- ✅ Edge Function (Deno)
- ✅ Telegram bot spec (docs)
- ✅ Design system (CSS)

---

## 📦 **FILES ADDED:**

```
/supabase/functions/right-now-create/
  └─ index.ts                          ← Edge Function

/pages/
  ├─ RightNowPagePro.tsx               ← Feed + Panic + Mess Brain
  ├─ RightNowCreatePage.tsx            ← Creation form
  └─ admin/
      └─ AdminWarRoom.tsx              ← Monitoring dashboard

/docs/
  ├─ TELEGRAM_PULSE_BOT_SPEC.md        ← Bot implementation
  ├─ PRO_COMPONENTS_INTEGRATION.md     ← API contracts
  ├─ RIGHT_NOW_COMPLETE_SYSTEM.md      ← Master guide
  └─ RIGHT_NOW_DEPLOYMENT_GUIDE.md     ← This file

/styles/
  └─ globals.css                       ← Updated with RIGHT NOW utilities

/tailwind.config.js                    ← Updated with colors

/components/
  └─ Router.tsx                        ← Updated with routes

/QUICK_ACCESS_GUIDE.md                 ← User guide
```

---

## 🗄️ **DATABASE SCHEMA REQUIRED:**

Before deploying, ensure these tables exist:

### **1. right_now_posts**
```sql
CREATE TABLE right_now_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  intent TEXT NOT NULL CHECK (intent IN ('hookup', 'crowd', 'drop', 'ticket', 'radio', 'care')),
  text TEXT NOT NULL CHECK (LENGTH(text) >= 10 AND LENGTH(text) <= 240),
  city TEXT NOT NULL,
  country TEXT,
  room_mode TEXT NOT NULL CHECK (room_mode IN ('solo', 'host')),
  crowd_count INT CHECK (crowd_count >= 2 AND crowd_count <= 200),
  host_beacon_id UUID REFERENCES beacons(id),
  source TEXT NOT NULL DEFAULT 'app' CHECK (source IN ('app', 'telegram')),
  show_on_globe BOOLEAN NOT NULL DEFAULT true,
  share_to_telegram BOOLEAN NOT NULL DEFAULT false,
  allow_anon_signals BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_right_now_posts_expires ON right_now_posts(expires_at);
CREATE INDEX idx_right_now_posts_city ON right_now_posts(city);
CREATE INDEX idx_right_now_posts_user ON right_now_posts(user_id);
CREATE INDEX idx_right_now_posts_intent ON right_now_posts(intent);
```

### **2. heat_events**
```sql
CREATE TABLE heat_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  city TEXT NOT NULL,
  country TEXT,
  source TEXT NOT NULL CHECK (source IN ('right_now', 'beacon', 'event', 'ticket')),
  intent TEXT,
  crowd_count INT,
  beacon_id UUID REFERENCES beacons(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_heat_events_city ON heat_events(city);
CREATE INDEX idx_heat_events_created ON heat_events(created_at);
CREATE INDEX idx_heat_events_source ON heat_events(source);
```

### **3. telegram_outbox**
```sql
CREATE TABLE telegram_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  post_id UUID REFERENCES right_now_posts(id),
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_telegram_outbox_status ON telegram_outbox(status);
CREATE INDEX idx_telegram_outbox_created ON telegram_outbox(created_at);
```

### **4. beacons (if not exists)**
```sql
CREATE TABLE IF NOT EXISTS beacons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  city TEXT,
  venue_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_beacons_code ON beacons(code);
CREATE INDEX idx_beacons_active ON beacons(active);
```

---

## 🛠️ **DEPLOYMENT STEPS:**

### **STEP 1: Deploy Edge Function**

```bash
# Navigate to project root
cd /path/to/hotmess-london

# Deploy RIGHT NOW create function
supabase functions deploy right-now-create --no-verify-jwt

# Verify deployment
supabase functions list
```

**Expected output:**
```
┌────────────────────┬─────────┬────────────────┐
│ Name               │ Status  │ Version        │
├────────────────────┼─────────┼────────────────┤
│ right-now-create   │ Active  │ v1             │
└────────────────────┴─────────┴────────────────┘
```

---

### **STEP 2: Test Edge Function**

```bash
curl -X POST "https://{projectId}.supabase.co/functions/v1/right-now-create" \
  -H "Authorization: Bearer {publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "intent": "hookup",
    "text": "Test post from deployment",
    "city": "London",
    "country": "UK",
    "roomMode": "solo",
    "showOnGlobe": true,
    "shareToTelegram": false,
    "allowAnonSignals": true
  }'
```

**Expected response:**
```json
{
  "post": {
    "id": "...",
    "intent": "hookup",
    "text": "Test post from deployment",
    "city": "London",
    "expires_at": "2025-12-09T12:00:00Z",
    "created_at": "2025-12-09T11:00:00Z"
  },
  "xp_awarded": 10,
  "ttl_minutes": 60
}
```

---

### **STEP 3: Deploy Frontend**

```bash
# Build production bundle
npm run build

# Test locally first
npm run preview

# Deploy to your hosting (Vercel/Netlify/etc)
vercel deploy --prod
# or
netlify deploy --prod
```

---

### **STEP 4: Test Full Flow**

1. **Open app in browser**
2. **Click "RIGHT NOW" button on homepage**
3. **Fill out creation form:**
   - Intent: Hookup
   - Text: "Testing RIGHT NOW deployment"
   - City: London
   - Room mode: Solo
   - Check all visibility toggles
4. **Click "POST RIGHT NOW"**
5. **Verify:**
   - ✓ Success message appears
   - ✓ Redirects to feed
   - ✓ Post appears in feed
   - ✓ Database record created
   - ✓ XP awarded to user
   - ✓ Heat event created

---

### **STEP 5: Test Panic System**

1. **Go to RIGHT NOW feed**
2. **Press & hold PANIC button (2s)**
3. **Verify:**
   - ✓ Breathing animation appears
   - ✓ 3 feeling options show
   - ✓ Hand N Hand button works
   - ✓ Incident created in DB
   - ✓ Appears in Admin War Room

---

### **STEP 6: Test Admin War Room**

1. **Navigate to** `?route=adminWarRoom`
2. **Verify:**
   - ✓ Stats dashboard loads
   - ✓ Shows "Panic last hour"
   - ✓ Shows "Incidents open"
   - ✓ Shows "RIGHT NOW posts/hour"
   - ✓ Shows "Cities active"
   - ✓ Incident timeline updates
   - ✓ Kill switches toggle

---

## 🔍 **TROUBLESHOOTING:**

### **Edge Function returns 401:**
```
Problem: User not authenticated
Solution: Check Authorization header includes valid JWT
```

### **Edge Function returns 500:**
```
Problem: Database error
Solution: 
1. Check Supabase logs
2. Verify tables exist
3. Check column names match code
```

### **Post doesn't appear in feed:**
```
Problem: Expired or filtered out
Solution:
1. Check expires_at is in future
2. Check intent filter
3. Check radius filter
```

### **XP not awarded:**
```
Problem: award_xp function missing
Solution: Create Postgres function:

CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_amount INT,
  p_reason TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET xp = COALESCE(xp, 0) + p_amount
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

### **Heat not showing on globe:**
```
Problem: heat_events not created
Solution:
1. Check show_on_globe = true
2. Verify heat_events table exists
3. Check Edge Function logs
```

---

## 📊 **MONITORING:**

### **Watch Edge Function logs:**
```bash
supabase functions logs right-now-create --follow
```

### **Query database stats:**
```sql
-- Posts created today
SELECT COUNT(*) FROM right_now_posts 
WHERE created_at > NOW() - INTERVAL '1 day';

-- Posts by intent
SELECT intent, COUNT(*) 
FROM right_now_posts 
GROUP BY intent;

-- Active posts (not expired)
SELECT COUNT(*) FROM right_now_posts 
WHERE expires_at > NOW();

-- Heat events today
SELECT COUNT(*) FROM heat_events 
WHERE created_at > NOW() - INTERVAL '1 day';

-- Telegram outbox pending
SELECT COUNT(*) FROM telegram_outbox 
WHERE status = 'pending';
```

---

## 🎯 **SUCCESS CRITERIA:**

**Deployment is successful when:**

1. ✅ Edge Function deploys without errors
2. ✅ User can create RIGHT NOW post
3. ✅ Post appears in feed within 15s
4. ✅ XP is awarded
5. ✅ Heat event is created
6. ✅ Panic button triggers incident
7. ✅ Admin War Room shows stats
8. ✅ TTL countdown works
9. ✅ Expired posts disappear
10. ✅ No console errors

---

## 📈 **POST-DEPLOYMENT:**

### **Week 1:**
- Monitor error rates
- Watch database growth
- Check XP distribution
- Review heat map accuracy

### **Week 2:**
- Optimize queries if slow
- Add database indexes if needed
- Tune TTL based on engagement
- Adjust heat scoring algorithm

### **Week 3:**
- Launch Telegram bot
- Test full integration
- Monitor cross-platform flow
- Gather user feedback

---

## 🚨 **ROLLBACK PLAN:**

If something goes wrong:

```bash
# 1. Disable Edge Function
supabase functions delete right-now-create

# 2. Hide RIGHT NOW button on homepage
# Edit /pages/Homepage.tsx
# Comment out RIGHT NOW button

# 3. Clear failed jobs
DELETE FROM telegram_outbox WHERE status = 'failed';

# 4. Notify users
# Post in announcements
```

---

## 🔐 **SECURITY CHECKLIST:**

- [ ] JWT validation works
- [ ] Men-only 18+ enforced
- [ ] Text length validated
- [ ] SQL injection prevented (using parameterized queries)
- [ ] XSS prevented (React auto-escapes)
- [ ] Rate limiting enabled (via Supabase)
- [ ] CORS configured correctly
- [ ] Service role key not exposed
- [ ] User data encrypted at rest

---

## 📚 **NEXT FEATURES TO BUILD:**

After stable deployment:

1. **Feed endpoint** (`GET /right-now/feed`)
2. **Telegram bot** (see `/docs/TELEGRAM_PULSE_BOT_SPEC.md`)
3. **Mess Brain AI** (OpenAI integration)
4. **Admin kill switches** (PATCH endpoints)
5. **Heat bins aggregation** (cron job)
6. **QR scan verification** (increment crowd count)
7. **Expiry cleanup** (cron job to delete old posts)

---

## ✅ **YOU'RE READY TO SHIP:**

**Files exist:**
- ✅ `/supabase/functions/right-now-create/index.ts`
- ✅ `/pages/RightNowCreatePage.tsx`
- ✅ `/pages/RightNowPagePro.tsx`
- ✅ `/pages/admin/AdminWarRoom.tsx`
- ✅ `/docs/TELEGRAM_PULSE_BOT_SPEC.md`

**Design system updated:**
- ✅ `tailwind.config.js` (colors)
- ✅ `styles/globals.css` (utilities)

**Router wired:**
- ✅ `components/Router.tsx`

**Navigation added:**
- ✅ Homepage button
- ✅ Sidebar menu
- ✅ Direct routes

**Schema documented:**
- ✅ `right_now_posts` table
- ✅ `heat_events` table
- ✅ `telegram_outbox` table

---

## 🚀 **DEPLOY COMMAND:**

```bash
# One-liner to deploy everything
supabase functions deploy right-now-create --no-verify-jwt && \
npm run build && \
vercel deploy --prod
```

---

**Built with 🖤 • HOTMESS LONDON • The gay warp drive is live.**
