# HOTMESS LONDON - GITHUB ISSUES (BUILD CHECKLIST)

**Platform:** Complete masculine nightlife operating system  
**Date:** December 9, 2024  
**Status:** Foundation complete, wiring in progress

---

## 🔥 CRITICAL PATH - DO THESE FIRST

### Issue #1: Database Migration & Schema Deployment

**Labels:** `database`, `critical`, `backend`  
**Priority:** P0

**Description:**
Deploy the core HOTMESS OS database schema including profiles, XP system, RIGHT NOW posts, party beacons, and heat map infrastructure.

**Files:**
- `/supabase/migrations/201_hotmess_core_schema.sql`

**Tasks:**
- [ ] Run migration on Supabase project `rfoftonnlwudilafhfkl`
- [ ] Verify all tables created successfully
- [ ] Test RLS policies with authenticated users
- [ ] Verify XP award function works
- [ ] Test heat map materialized view
- [ ] Create cron job to refresh heat map every 5 minutes

**SQL to run:**
```sql
-- Refresh heat map
SELECT cron.schedule('refresh-heat-map', '*/5 * * * *', $$SELECT refresh_heat_map()$$);

-- Expire old RIGHT NOW posts
SELECT cron.schedule('expire-right-now-posts', '*/5 * * * *', $$SELECT expire_right_now_posts()$$);
```

**Acceptance Criteria:**
- All tables exist and have proper indexes
- RLS policies prevent unauthorized access
- XP awards trigger correctly on events
- Heat map refreshes automatically

---

### Issue #2: Deploy Unified HOTMESS OS API

**Labels:** `backend`, `critical`, `api`  
**Priority:** P0

**Description:**
Deploy the unified Edge Function that powers RIGHT NOW posts, party beacons, and heat map delivery.

**Files:**
- `/supabase/functions/hotmess-os/index.ts`
- `/supabase/functions/_shared/cors.ts`

**Deploy Command:**
```bash
supabase functions deploy hotmess-os --project-ref rfoftonnlwudilafhfkl
```

**Environment Variables Needed:**
- `SUPABASE_URL` - Already set
- `SUPABASE_SERVICE_ROLE_KEY` - Already set
- `APP_BASE_URL` - Set to `https://hotmess.london` (or your domain)

**Tasks:**
- [ ] Deploy function to Supabase
- [ ] Test all endpoints with curl/Postman
- [ ] Verify CORS headers work from frontend
- [ ] Test authentication flow
- [ ] Monitor error logs

**Test Commands:**
```bash
# Test RIGHT NOW feed
curl "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/hotmess-os/right-now?city=London"

# Test heat map
curl "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/hotmess-os/heat-map?city=London"

# Test party beacons
curl "https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/hotmess-os/party-beacons?city=London"
```

**Acceptance Criteria:**
- Function deploys without errors
- All API endpoints return valid JSON
- Authentication works correctly
- XP awards trigger on post creation
- Error handling returns useful messages

---

### Issue #3: Wire Auth System to RIGHT NOW

**Labels:** `frontend`, `auth`, `critical`  
**Priority:** P0

**Description:**
Connect Supabase Auth to the frontend so users can sign up, log in, and post to RIGHT NOW with proper authentication.

**Files to Modify:**
- `/components/rightnow/RightNowCreateForm.tsx` - Add auth token to requests
- `/components/rightnow/RightNowFeed.tsx` - Pass auth token for personalized feed
- Create: `/lib/supabase-client.ts` - Supabase client singleton
- Create: `/hooks/useAuth.ts` - Auth state management

**Tasks:**
- [ ] Create Supabase client singleton
- [ ] Build useAuth hook with session management
- [ ] Add auth gate to `/right-now/new` page
- [ ] Pass auth token in API requests
- [ ] Handle auth errors gracefully
- [ ] Add sign-out button

**New Files:**

`/lib/supabase-client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

`/hooks/useAuth.ts`:
```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}
```

**Acceptance Criteria:**
- Users can sign up with email/password
- Auth state persists across page reloads
- Protected routes redirect to login
- API requests include auth tokens
- Sign out works correctly

---

## 🎯 HIGH PRIORITY - PARTY BEACON SYSTEM

### Issue #4: Party Beacon Creation UI

**Labels:** `frontend`, `party-beacons`, `high-priority`  
**Priority:** P1

**Description:**
Build the UI for hosts to create party beacons with QR codes for guest check-ins.

**Create Files:**
- `/app/party/create/page.tsx` - Create party beacon form
- `/components/party/PartyBeaconForm.tsx` - Reusable form component
- `/components/party/QRCodeDisplay.tsx` - Display generated QR code

**Features:**
- Form fields: name, venue type, location, start/end time, capacity, rules
- Location picker (map or address input)
- Entry requirements checkboxes
- Generate QR code on creation
- Display scannable QR + download/print options

**Tasks:**
- [ ] Create party beacon creation form
- [ ] Add location picker (Mapbox geocoder)
- [ ] Generate QR code using `qrcode.react` library
- [ ] Wire to API endpoint `POST /hotmess-os/party-beacons`
- [ ] Display success with QR code
- [ ] Add download/print QR functionality

**QR Code Library:**
```bash
npm install qrcode.react
```

**Acceptance Criteria:**
- Host can create party beacon
- QR code generates correctly
- QR URL format: `https://hotmess.london/party/{qr_code}`
- Can download QR as PNG/SVG
- Location binning preserves privacy

---

### Issue #5: Party Beacon Scanning & Check-In

**Labels:** `frontend`, `party-beacons`, `qr`, `high-priority`  
**Priority:** P1

**Description:**
Build QR scanner and check-in flow for guests arriving at parties.

**Create Files:**
- `/app/party/[qr_code]/page.tsx` - Party check-in page
- `/components/party/QRScanner.tsx` - Camera QR scanner component
- `/components/party/PartyDetails.tsx` - Show party info after scan

**Features:**
- QR code scanner using device camera
- Manual code entry fallback
- Display party details (name, venue, capacity, rules)
- Check-in button
- XP reward notification
- Crowd verification status

**Tasks:**
- [ ] Build QR scanner with `html5-qrcode` or `react-qr-reader`
- [ ] Create party details page
- [ ] Wire to API `POST /hotmess-os/party-beacons/scan/{qr_code}`
- [ ] Show XP reward animation
- [ ] Display current capacity / crowd status
- [ ] Handle errors (party ended, capacity full)

**QR Scanner Library:**
```bash
npm install html5-qrcode
```

**Acceptance Criteria:**
- Camera opens on mobile/desktop
- QR scan triggers check-in
- XP awarded to guest
- Party capacity updates in real-time
- Crowd verification triggers at 6+ scans

---

### Issue #6: Party Beacon List & Globe Integration

**Labels:** `frontend`, `globe`, `party-beacons`, `high-priority`  
**Priority:** P1

**Description:**
Display active party beacons in feed and on 3D globe as heat clusters.

**Modify Files:**
- `/app/party/page.tsx` - Party beacon feed
- `/app/map/page.tsx` - Add party beacons to globe
- `/components/party/PartyCard.tsx` - Individual party card component

**Features:**
- List view of active parties in city
- Filter by venue type, capacity, time
- Show crowd verification status
- Click party → see details
- Add party beacons to globe as pulsing pins

**Tasks:**
- [ ] Create party feed page
- [ ] Build party card component
- [ ] Add filters (venue type, time, verified)
- [ ] Wire to API `GET /hotmess-os/party-beacons?city=London&active_only=true`
- [ ] Add party layer to Mapbox globe
- [ ] Cluster nearby parties
- [ ] Show heat intensity by capacity

**Acceptance Criteria:**
- Parties display in list view
- Filters work correctly
- Globe shows party locations
- Heat intensity reflects crowd size
- Click party → navigate to details

---

## 🌍 GLOBE & HEAT MAP INTEGRATION

### Issue #7: Heat Map Layer on 3D Globe

**Labels:** `frontend`, `globe`, `mapbox`, `high-priority`  
**Priority:** P1

**Description:**
Integrate the heat map data from the database into the Mapbox 3D globe visualization.

**Modify Files:**
- `/app/map/page.tsx` - Main globe page
- `/components/globe/HeatLayer.tsx` - Heat map visualization layer

**Features:**
- Fetch heat map bins from API
- Render as heatmap layer on Mapbox
- Color by dominant mode (hookup=red, crowd=orange, care=green)
- Intensity by total_heat score
- Click heat zone → show breakdown (X RIGHT NOW, Y parties, Z scans)

**Tasks:**
- [ ] Fetch heat map from `GET /hotmess-os/heat-map?city=London`
- [ ] Add Mapbox heatmap layer
- [ ] Color code by dominant mode
- [ ] Add click handler to show heat breakdown
- [ ] Auto-refresh every 5 minutes
- [ ] Add legend for heat intensity

**Mapbox Heatmap Example:**
```typescript
map.addLayer({
  id: 'heat-layer',
  type: 'heatmap',
  source: 'heat-source',
  paint: {
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0,0,255,0)',
      0.2, 'royalblue',
      0.4, 'cyan',
      0.6, 'lime',
      0.8, 'yellow',
      1, 'red'
    ],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
  },
});
```

**Acceptance Criteria:**
- Heat map displays on globe
- Colors match HOTMESS aesthetic
- Intensity reflects activity
- Click shows breakdown
- Auto-refreshes every 5 min

---

### Issue #8: Globe Click → City OS View

**Labels:** `frontend`, `globe`, `city-os`, `medium-priority`  
**Priority:** P2

**Description:**
When user clicks a city/region on the globe, show a CityOS panel with all activity in that location.

**Create Files:**
- `/components/globe/CityOSPanel.tsx` - Sliding panel for city details
- `/components/cityos/CityPulse.tsx` - City activity overview

**Features:**
- Sliding panel from bottom on mobile, sidebar on desktop
- Show city name, current heat score, vibe label
- Tabs: RIGHT NOW, Parties, Radio, Mess Market
- Quick stats (active posts, parties, scans)
- Dominant mode indicator

**Tasks:**
- [ ] Build CityOSPanel component
- [ ] Add city selection on globe click
- [ ] Fetch all city data (RIGHT NOW + parties + heat)
- [ ] Display tabs for different modes
- [ ] Add "Jump to this city" button
- [ ] Show AI vibe label from Mess Brain

**Acceptance Criteria:**
- Click city → panel opens
- Shows all activity in that city
- Tabs switch content
- Can navigate to RIGHT NOW feed for that city
- AI vibe label displays correctly

---

## 🤖 AI & INTELLIGENCE FEATURES

### Issue #9: AI Safety Scanner for RIGHT NOW Posts

**Labels:** `backend`, `ai`, `safety`, `medium-priority`  
**Priority:** P2

**Description:**
Implement AI content moderation to auto-flag unsafe RIGHT NOW posts before they go live.

**Modify Files:**
- `/supabase/functions/hotmess-os/index.ts` - Add AI safety check in createRightNowPost

**AI Features:**
- NSFW classification
- Risk detection (minors, coercion, violence, self-harm)
- Auto-hide high-risk posts
- Flag medium-risk for manual review
- Log to safety_reports table

**Tasks:**
- [ ] Integrate OpenAI Moderation API
- [ ] Add safety check before post creation
- [ ] Store safety_flags in right_now_posts
- [ ] Auto-hide posts with score > 0.8
- [ ] Send flagged posts to moderation queue
- [ ] Add human review dashboard

**OpenAI Integration:**
```typescript
const response = await fetch('https://api.openai.com/v1/moderations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ input: text }),
});

const { results } = await response.json();
const flagged = results[0].flagged;
const categories = results[0].categories;
```

**Acceptance Criteria:**
- AI checks all posts before publishing
- High-risk posts auto-hidden
- Moderation queue populates
- Safety scores stored in DB
- No false positives on common slang

---

### Issue #10: Mess Brain AI Chat Integration

**Labels:** `frontend`, `backend`, `ai`, `medium-priority`  
**Priority:** P2

**Description:**
Wire the Mess Brain chat to real AI using OpenAI GPT-4 with city intelligence context.

**Create Files:**
- `/supabase/functions/mess-brain/index.ts` - AI chat endpoint
- Modify: `/components/rightnow/MessBrainChat.tsx` - Use real API

**AI Context:**
- Current city heat data
- Recent RIGHT NOW posts in area
- Active parties nearby
- Recent panic incidents (anonymized)
- Safety recommendations

**System Prompt:**
```
You are MESS BRAIN, the gay nightlife intelligence AI for HOTMESS LONDON. You're slightly mean but always on the user's side. You help men decide where to go, stay safe, and navigate the scene.

You have real-time data on:
- RIGHT NOW posts (hookups, parties, care requests)
- Party beacons with crowd verification
- Heat maps showing where men are gathering
- Panic incidents (anonymized for safety patterns)

Be direct, don't sugarcoat, but always prioritize safety. Use dark humor when appropriate. Never give medical advice - route to Hand N Hand for that.
```

**Tasks:**
- [ ] Create Mess Brain Edge Function
- [ ] Build OpenAI GPT-4 integration
- [ ] Pass city context (heat, posts, parties)
- [ ] Wire frontend chat to real API
- [ ] Add safety alert cards
- [ ] Implement quick prompt suggestions

**Acceptance Criteria:**
- Chat responds with real AI
- Answers include current city data
- Safety alerts trigger on high-risk queries
- Personality matches "slightly mean but helpful"
- No hallucinated data

---

## 🎨 POLISH & UX IMPROVEMENTS

### Issue #11: Real-Time Countdown Timers

**Labels:** `frontend`, `ux`, `low-priority`  
**Priority:** P3

**Description:**
Make the countdown timers on RIGHT NOW posts update every minute without refresh.

**Modify Files:**
- `/components/rightnow/RightNowFeed.tsx`

**Implementation:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setItems(prevItems => [...prevItems]); // Force re-render to update countdown
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, []);
```

**Tasks:**
- [ ] Add interval to re-render feed every minute
- [ ] Auto-remove expired posts from feed
- [ ] Add "Post expired" notification
- [ ] Animate post removal

**Acceptance Criteria:**
- Timers update every minute
- Expired posts disappear
- No memory leaks from intervals

---

### Issue #12: XP Notification Animations

**Labels:** `frontend`, `ux`, `xp`, `low-priority`  
**Priority:** P3

**Description:**
Show animated XP rewards when users complete actions (post, scan, etc).

**Create Files:**
- `/components/xp/XPToast.tsx` - Floating XP notification
- `/hooks/useXP.ts` - XP state management

**Animation:**
- Float up from action button
- "+15 XP" with sparkle effect
- Progress bar showing XP to next tier
- Fade out after 2 seconds

**Tasks:**
- [ ] Build XPToast component with Motion
- [ ] Add to post creation success
- [ ] Add to party beacon scan
- [ ] Show tier-up notification
- [ ] Store XP in local state

**Acceptance Criteria:**
- XP toast appears on actions
- Animation smooth (60fps)
- Shows progress to next tier
- Tier-up celebration

---

### Issue #13: Panic Button Improvements

**Labels:** `frontend`, `safety`, `hnh`, `medium-priority`  
**Priority:** P2

**Description:**
Wire panic button to real Hand N Hand care system with location sharing and trusted contact SMS.

**Modify Files:**
- `/components/rightnow/PanicOverlay.tsx`

**Features to Add:**
- Save panic incident to database
- Share location for 30min (consent required)
- Send SMS to trusted contact
- Open Hand N Hand chat room
- Log panic for heat map avoidance

**Tasks:**
- [ ] Create panic incident API endpoint
- [ ] Add location sharing consent flow
- [ ] Integrate Twilio for SMS
- [ ] Create Hand N Hand chat room on trigger
- [ ] Update heat map to show panic zones
- [ ] Add "Panic resolved" flow

**Acceptance Criteria:**
- Panic saves to database
- Location shared with consent
- SMS sent to trusted contact
- Hand N Hand chat opens
- Incident logged for safety patterns

---

## 📱 TELEGRAM INTEGRATION

### Issue #14: Telegram Bot for City Rooms

**Labels:** `backend`, `telegram`, `integration`, `medium-priority`  
**Priority:** P2

**Description:**
Build Telegram bot that mirrors RIGHT NOW posts to city/group channels and handles QR drops.

**Create Files:**
- `/supabase/functions/telegram-bot/index.ts` - Webhook handler
- `/lib/telegram.ts` - Telegram API helpers

**Features:**
- Mirror RIGHT NOW posts to city channels
- Post party beacon QR codes
- Drop vendor products
- Handle /join, /help, /nearby commands

**Tasks:**
- [ ] Create Telegram bot with BotFather
- [ ] Set up webhook to Edge Function
- [ ] Handle incoming messages
- [ ] Mirror RIGHT NOW posts to channels
- [ ] Send QR codes for party beacons
- [ ] Implement commands
- [ ] Link Telegram user_id to HOTMESS profile

**Acceptance Criteria:**
- Bot responds to messages
- RIGHT NOW posts mirror correctly
- QR codes display in Telegram
- Commands work
- User linking functional

---

## 🛍 MESS MARKET (VENDOR SYSTEM)

### Issue #15: Vendor Product Drops

**Labels:** `frontend`, `backend`, `mess-market`, `medium-priority`  
**Priority:** P2

**Description:**
Allow vendors to drop products (lube, merch, digital content) as RIGHT NOW drops with Stripe checkout.

**Create Files:**
- `/app/mess-market/page.tsx` - Vendor marketplace
- `/components/market/ProductCard.tsx` - Product display
- `/supabase/functions/create-checkout/index.ts` - Stripe integration

**Features:**
- Vendors create product drops
- Products appear in RIGHT NOW feed with "DROP" mode
- Click → Stripe checkout
- Digital delivery (mp3, mp4, PDF)
- Physical shipping (lube, tees)

**Tasks:**
- [ ] Create products table
- [ ] Build product creation form
- [ ] Integrate Stripe Checkout
- [ ] Handle digital delivery
- [ ] Add vendor dashboard
- [ ] Award XP on purchase

**Acceptance Criteria:**
- Vendors can create drops
- Products appear in feed
- Checkout works via Stripe
- Digital content delivered instantly
- Vendors get paid (minus platform fee)

---

## 📊 ADMIN & MODERATION

### Issue #16: Moderation Dashboard

**Labels:** `frontend`, `backend`, `admin`, `moderation`, `high-priority`  
**Priority:** P1

**Description:**
Build admin dashboard for moderating RIGHT NOW posts, party beacons, and safety reports.

**Create Files:**
- `/app/admin/moderation/page.tsx` - Moderation queue
- `/components/admin/ModerationCard.tsx` - Post review card
- `/components/admin/SafetyReports.tsx` - Safety report list

**Features:**
- Queue of flagged posts
- One-click approve/remove
- Ban user flow
- Safety report review
- Panic incident monitoring

**Tasks:**
- [ ] Create moderation queue page
- [ ] Fetch flagged posts from API
- [ ] Add approve/remove actions
- [ ] Build user ban system
- [ ] Add safety report review
- [ ] Monitor panic incidents

**Acceptance Criteria:**
- Mods can review flagged content
- Actions persist to database
- Banned users can't post
- Safety reports clear from queue
- Panic incidents visible

---

## 🎯 FUTURE ENHANCEMENTS

### Issue #17: Radio Show Integration
**Priority:** P3  
Stream live radio shows with RIGHT NOW "listening pulses" on globe.

### Issue #18: Connect Module (Dating Platform)
**Priority:** P3  
Traditional profiles with RIGHT NOW integration for dating.

### Issue #19: Event Ticketing System
**Priority:** P3  
Sell/resell tickets with QR verification.

### Issue #20: HNH Aftercare Resources
**Priority:** P2  
Curated care content, peer support, resource directory.

---

## ✅ CURRENT STATUS

**Completed:**
- ✅ Database schema designed
- ✅ Unified API built
- ✅ RIGHT NOW feed UI complete
- ✅ Post creation wizard complete
- ✅ Panic system UI built
- ✅ Mess Brain chat UI built
- ✅ API wired to frontend (with fallback to mocks)

**In Progress:**
- 🔄 Auth integration (Issue #3)
- 🔄 Database deployment (Issue #1)
- 🔄 API deployment (Issue #2)

**Next Up:**
- Party beacon creation (Issue #4)
- Party beacon scanning (Issue #5)
- Heat map on globe (Issue #7)

---

**HOTMESS LONDON is ready to build. Let's wire this OS together.**
