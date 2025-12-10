# HOTMESS LONDON - SYSTEM ARCHITECTURE

**Complete Masculine Nightlife Operating System for Queer Men 18+**

---

## 🏗 SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  RIGHT NOW   │  │  3D GLOBE    │  │ PARTY BEACON │          │
│  │  Feed/Post   │  │  Heat Map    │  │  QR Scanner  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
└─────────┼─────────────────┼──────────────────┼───────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HOTMESS OS API (Supabase Edge Functions)      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │  RIGHT NOW API │  │  Party Beacons │  │  Heat Map API    │  │
│  │  POST /create  │  │  POST /scan    │  │  GET /heat-map   │  │
│  │  GET  /feed    │  │  POST /create  │  │                  │  │
│  └────────┬───────┘  └────────┬───────┘  └────────┬─────────┘  │
│           │                   │                     │            │
│           └───────────────────┴─────────────────────┘            │
│                               │                                  │
└───────────────────────────────┼──────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     POSTGRESQL DATABASE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   profiles   │  │ right_now_   │  │    party_    │          │
│  │  (users/XP)  │  │    posts     │  │   beacons    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
│         └─────────────────┴──────────────────┘                   │
│                           │                                      │
│  ┌──────────────┐  ┌──────┴───────┐  ┌──────────────┐          │
│  │  xp_events   │  │ heat_map_    │  │   safety_    │          │
│  │  (ledger)    │  │    bins      │  │   reports    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   OpenAI     │  │   Telegram   │  │    Stripe    │          │
│  │ (Mess Brain, │  │  (City Rooms,│  │  (Payments)  │          │
│  │   Safety)    │  │   Mirroring) │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 CORE MODULES

### 1. **Auth + Membership + XP**

**Purpose:** User identity, membership tiers, and gamification spine.

**Components:**
- Sign up / sign in (email, magic link, OAuth)
- Profile creation with age gate (18+, men-only)
- Membership tiers: FREE, HNH, VENDOR, SPONSOR, ICON
- XP ledger tracking all user actions
- XP tiers: Fresh → Regular → Sinner → Icon

**Database Tables:**
- `profiles` - User data, location (binned), consent flags
- `xp_events` - Ledger of all XP-earning actions
- Function: `award_xp()` - Awards XP with membership multiplier

**XP Awards:**
- Post RIGHT NOW: +15 XP (hookup), +25 XP (care)
- Scan party beacon: +15 XP
- Create party: +100 XP (host)
- Purchase from vendor: +10 XP
- Listen to radio: +5 XP/hour

**Membership Limits:**
| Tier | Active Posts | Max Radius | XP Multiplier |
|------|--------------|------------|---------------|
| FREE | 1 | 10km | 1.0x |
| HNH | 2 | 50km | 1.5x |
| VENDOR | 2 | Global | 1.5x |
| SPONSOR | 3 | Global | 1.75x |
| ICON | 3 | Global | 2.0x |

---

### 2. **Globe + Heat Engine**

**Purpose:** 3D visualization of all platform activity in real-time.

**Components:**
- Mapbox GL JS 3D globe
- Heat map layer (color-coded by mode)
- Clustered pins for RIGHT NOW posts, parties, beacons
- Click city → CityOS panel

**Heat Sources:**
1. **RIGHT NOW posts** - 10 base + views + replies
2. **Party beacons** - 50 base + (capacity × 5)
3. **Beacon scans** - 5 per scan (last 2 hours)
4. **Radio listeners** - 3 per active listener

**Heat Map Calculation:**
```sql
-- Materialized view refreshed every 5 minutes
CREATE MATERIALIZED VIEW heat_map_bins AS
SELECT
  geo_hash,
  lat_bin,
  lng_bin,
  city,
  COUNT(DISTINCT right_now_posts) as right_now_count,
  COUNT(DISTINCT party_beacons) as party_count,
  COUNT(DISTINCT beacon_scans) as scan_count,
  SUM(heat_value) as total_heat,
  MODE() WITHIN GROUP (ORDER BY mode) as dominant_mode
FROM heat_sources
GROUP BY geo_hash, lat_bin, lng_bin, city;
```

**Geo Binning (Privacy):**
- User locations rounded to ~100m grid
- Geo hash at h6 precision (~1.2km × 0.6km)
- Exact locations NEVER exposed, only bins

---

### 3. **RIGHT NOW (Hookup + Pulse Feed)**

**Purpose:** Temporal posts for hookups, parties, care, and drops.

**6 Modes:**
1. **HOOKUP** 🔥 - Looking for men, hosting, visiting
2. **CROWD** 👥 - Party / flat gathering
3. **DROP** 🛍 - Vendor products (lube, merch, digital)
4. **TICKET** 🎟 - Event tickets (sell/resale)
5. **RADIO** 📻 - Live radio show, drop in
6. **CARE** 🧴 - Aftercare, need to talk, support

**Post Lifecycle:**
1. User creates post (4-step wizard)
2. AI safety check (OpenAI Moderation API)
3. If safe → goes live in feed + globe
4. Post visible for TTL (15-90 minutes)
5. Auto-deleted after TTL expires
6. No permanent record

**Filters:**
- Distance: Local (1km), Near (3km), City (10km), Global
- Intent: Hookup, Crowd, Drop, Ticket, Radio, Care
- Time: Now, Tonight, Weekend
- Safety: Verified only, HNH recommended

**API Endpoints:**
- `GET /hotmess-os/right-now?city=London&mode=hookup&radius_km=3`
- `POST /hotmess-os/right-now` - Create post
- `DELETE /hotmess-os/right-now/:id` - Delete own post

---

### 4. **Party Beacons (QR Check-In System)**

**Purpose:** Hosts create party beacons, guests scan QR to check in.

**Flow:**
1. **Host creates party beacon:**
   - Name, venue type, location, time, capacity, rules
   - Generates unique QR code
   - Awards host +100 XP

2. **Guest scans QR at door:**
   - Camera scan or manual code entry
   - Checks party is active
   - Records scan in database
   - Awards guest +15 XP
   - Updates party capacity

3. **Crowd Verification:**
   - ≥6 unique scans in 30min → `crowd_verified = true`
   - Verified parties get boosted visibility
   - Appear as high-heat clusters on globe

**Party Beacon Data:**
```typescript
{
  id: UUID,
  host_id: UUID,
  name: "Vauxhall Dark Room Night",
  venue_type: "club",
  city: "London",
  lat/lng: (exact, private),
  lat_bin/lng_bin: (public, binned),
  start_time: "2024-12-09T22:00:00Z",
  end_time: "2024-12-10T04:00:00Z",
  capacity_max: 50,
  capacity_current: 18,
  crowd_verified: true,
  qr_code: "party_abc123xyz",
}
```

**API Endpoints:**
- `GET /hotmess-os/party-beacons?city=London&active_only=true`
- `POST /hotmess-os/party-beacons` - Create beacon
- `POST /hotmess-os/party-beacons/scan/:qr_code` - Check in

---

## 🤖 AI LAYER

### 1. **AI Safety Scanner**

**Purpose:** Auto-moderate RIGHT NOW posts before they go live.

**Process:**
1. User submits post
2. Text sent to OpenAI Moderation API
3. Receives safety score (0.0 - 1.0)
4. If score < 0.5 → Auto-approve
5. If 0.5 - 0.8 → Flag for review (but post)
6. If > 0.8 → Auto-hide, send to moderation queue

**Flags:**
- Underage mentions
- Coercion language
- Violence threats
- Self-harm indicators
- Spam/commercial

**Storage:**
```sql
right_now_posts.safety_flags = {
  "sexual": 0.02,
  "hate": 0.001,
  "violence": 0.12,
  "self-harm": 0.03
}
```

---

### 2. **Mess Brain AI Chat**

**Purpose:** Gay nightlife intelligence assistant.

**Personality:**
- Slightly mean but always on your side
- Dark humor, no sugarcoating
- Safety-first, never medical advice

**Context Passed to AI:**
```typescript
{
  city: "London",
  current_heat: 247,
  right_now_posts: [...], // Recent posts in area
  active_parties: [...],  // Crowd-verified parties
  panic_incidents: [...], // Anonymized safety patterns
  user_xp_tier: "sinner",
  user_membership: "hnh"
}
```

**System Prompt:**
```
You are MESS BRAIN, the gay nightlife intelligence AI for HOTMESS LONDON. 
You're slightly mean but always on the user's side. You help men decide 
where to go, stay safe, and navigate the scene.

You have real-time data on RIGHT NOW posts, party beacons, heat maps, 
and anonymized panic incidents. Be direct, use dark humor when appropriate, 
but always prioritize safety. Route to Hand N Hand for care/medical needs.
```

**API Endpoint:**
- `POST /mess-brain` - Chat query with context

---

## 🚨 SAFETY SYSTEMS

### 1. **Panic Button (Hand N Hand)**

**Flow:**
1. User press & hold panic button (2 seconds)
2. Breathing animation appears
3. Select feeling: unsafe, overwhelmed, unsure
4. Choose action:
   - Message Hand N Hand care room
   - Text trusted contact (SMS via Twilio)
   - Just calm down (close overlay)

**Database Record:**
```sql
panic_incidents:
  user_id, city, geo_hash, lat/lng (private),
  severity, trigger, feeling, message,
  status, care_room_id, responder_id,
  location_shared (30min consent window)
```

**Integration:**
- Creates incident in database
- Sends SMS to trusted contact if selected
- Opens Hand N Hand chat room
- Logs for heat map avoidance (other users warned)

---

### 2. **Content Moderation Queue**

**Admin Dashboard:**
- List of flagged RIGHT NOW posts
- Safety reports from users
- Panic incidents requiring review
- One-click approve/remove actions
- User ban system

**Moderation Actions:**
- Approve post → clears from queue
- Remove post → soft delete, user notified
- Shadow ban user → posts hidden from most users
- Hard ban → user blocked from posting

---

## 🔗 INTEGRATIONS

### 1. **Telegram Bot**

**Features:**
- Mirror RIGHT NOW posts to city channels
- Drop party beacon QR codes
- Vendor product drops
- Commands: /join, /help, /nearby

**Webhook Flow:**
```
Telegram → Webhook → Edge Function → Database
```

---

### 2. **Stripe Payments**

**Use Cases:**
- Membership upgrades (FREE → HNH)
- Vendor product purchases (Mess Market)
- Event ticket sales
- Donations to Hand N Hand

**Stripe Connect:**
- Vendors have their own Stripe accounts
- Platform takes 10% fee
- Instant payouts

---

## 📊 DATA FLOW

### Example: User Posts RIGHT NOW → Globe Heat Updates

```
1. User clicks "+ POST" in dock
   ↓
2. 4-step wizard (Intent → Message → Location → Duration)
   ↓
3. Submit POST /hotmess-os/right-now
   ↓
4. Backend:
   - Check membership limits
   - Run AI safety scan
   - Bin location for privacy
   - Check if near party beacon
   - Calculate expiry time
   - Insert into right_now_posts
   - Award XP to user
   ↓
5. Post appears in:
   - RIGHT NOW feed (filtered by city/mode)
   - Globe as heat pin (if show_in_globe=true)
   - Telegram city channel (if telegram_mirror=true)
   ↓
6. Heat map job (runs every 5 min):
   - Recalculates heat_map_bins materialized view
   - Aggregates RIGHT NOW + parties + scans
   - Updates globe visualization
   ↓
7. After TTL expires:
   - Cron job soft-deletes post
   - Disappears from feed
   - Heat score decrements
```

---

## 🗄 DATABASE TABLES

### Core Tables

1. **profiles** - User identity, membership, XP
2. **xp_events** - XP ledger (all earning actions)
3. **right_now_posts** - Temporal posts (hookups, care, etc)
4. **party_beacons** - QR check-in events
5. **party_beacon_scans** - Guest check-ins
6. **heat_map_bins** - Aggregated heat (materialized view)
7. **safety_reports** - User-reported content
8. **panic_incidents** - Hand N Hand emergencies

### Indexes

```sql
-- RIGHT NOW posts
CREATE INDEX idx_right_now_city_active 
ON right_now_posts(city, created_at DESC) 
WHERE deleted_at IS NULL AND expires_at > NOW();

-- Heat map geo lookup
CREATE INDEX idx_heat_map_geo 
ON heat_map_bins(geo_hash);

-- Party beacon scans
CREATE INDEX idx_party_scans_beacon 
ON party_beacon_scans(beacon_id, scanned_at DESC);
```

---

## 🚀 DEPLOYMENT

### Frontend (Vercel/Netlify)
- Next.js 14 app
- Mapbox GL JS for globe
- Motion for animations
- Tailwind CSS for styling

### Backend (Supabase Edge Functions)
- Deno runtime
- `/hotmess-os` - Unified API
- `/mess-brain` - AI chat
- `/telegram-bot` - Webhook handler

### Database (Supabase PostgreSQL)
- Migrations in `/supabase/migrations/`
- Row-Level Security (RLS) enabled
- Cron jobs for heat refresh + post expiry

### Secrets
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
OPENAI_API_KEY
STRIPE_SECRET_KEY
TELEGRAM_BOT_TOKEN
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
APP_BASE_URL
```

---

## ✅ SYSTEM CHECKLIST

### Phase 1: Foundation (COMPLETE)
- [x] Database schema designed
- [x] Unified API built
- [x] RIGHT NOW feed UI
- [x] Post creation wizard
- [x] Panic system UI
- [x] Mess Brain chat UI

### Phase 2: Core Wiring (IN PROGRESS)
- [ ] Deploy database migration
- [ ] Deploy Edge Functions
- [ ] Wire auth to frontend
- [ ] Connect feed to API
- [ ] Connect post creation to API

### Phase 3: Party Beacons
- [ ] Party creation form
- [ ] QR code generation
- [ ] QR scanner + check-in
- [ ] Party feed UI
- [ ] Globe party layer

### Phase 4: Globe Heat
- [ ] Heat map API endpoint
- [ ] Mapbox heatmap layer
- [ ] CityOS panel
- [ ] Click-to-filter flow

### Phase 5: AI & Safety
- [ ] AI safety scanner
- [ ] Mess Brain real AI
- [ ] Moderation dashboard
- [ ] Panic incident logging

### Phase 6: Integrations
- [ ] Telegram bot
- [ ] Stripe payments
- [ ] Vendor marketplace
- [ ] Radio integration

---

**HOTMESS LONDON is the complete operating system for gay nightlife. This architecture supports the entire ecosystem from hookups to care, parties to safety, all wired together through XP and the globe.**
