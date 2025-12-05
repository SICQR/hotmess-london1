## 🔥 HOTMESS AUTO-INTEL ENGINE

**Complete automated nightlife intelligence system with 3D Globe visualization**

---

## 📦 WHAT'S BEEN BUILT

The complete one-man-band automation system for pulling real-time events, tickets, club nights, drops, DJ sets, parties, queer listings, and nightlife intel **with ZERO manual work**.

### Core Components

1. **Backend Intelligence API** (`/supabase/functions/server/intel_api.tsx`)
2. **3D Globe Component** (`/components/Globe3D.tsx`)
3. **Global OS Page** (`/pages/GlobalOS.tsx`) - 3D globe navigator
4. **City OS Page** (`/pages/CityOS.tsx`) - Per-city intelligence view
5. **TypeScript Types** (`/types/intel.ts`)
6. **Mounted Routes** in Router and routes.ts

---

## 🌍 THE 3D GLOBE

### Interactive Global Navigator

The 3D Globe is the visual interface for navigating worldwide HOTMESS intelligence.

**Features:**
- ✅ Interactive 3D globe with React Three Fiber
- ✅ City markers with hover states
- ✅ Auto-rotation
- ✅ Zoom and pan controls
- ✅ Click to explore cities
- ✅ Event count badges
- ✅ Neon glow aesthetics
- ✅ Stars background
- ✅ Real-time stats overlay

**Navigation:**
```
Global OS → Click City → City OS → View all intel
```

---

## 🎯 INTELLIGENCE TYPES

The system automatically collects and displays:

### 1. **Events**
- Club nights
- Raves
- Queer parties
- Drag shows
- Community events

### 2. **DJ Set Times**
- Pulled from Instagram (public posts)
- Club social media
- Promoter accounts
- Real-time lineup updates

### 3. **Queer Markets & Pop-Ups**
- LGBTQ+ markets
- Pop-up shops
- Craft fairs
- Community stalls

### 4. **Sex-Positive Events**
- Sauna nights
- Fetish parties
- Kink events
- Leather nights
- Cruise parties

### 5. **Pride Events**
- Pride parades
- Pride parties
- Pride festivals
- Community marches
- Global Pride calendar

### 6. **Festivals**
- Music festivals
- Cultural festivals
- Queer festivals
- Line-up information

### 7. **RAW CONVICT Drops**
- New music releases
- Album drops
- Single releases
- Exclusive previews

### 8. **TikTok Trends**
- Weekly culture summaries
- Trending hashtags
- Popular creators
- Nightlife trends

### 9. **Room Sentiment**
- AI-powered vibe analysis
- Safety monitoring
- Community health
- Positive/messy/unsafe detection

---

## 📡 BACKEND API

### Base URL
```
https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel
```

### Endpoints

#### **POST /intel/events/normalise**
Normalize raw scraped events into unified schema

**Response:**
```json
{
  "success": true,
  "normalized": 15,
  "events": [...]
}
```

#### **GET /intel/events/:city**
Get all upcoming events for a city

**Response:**
```json
{
  "city": "london",
  "events": [
    {
      "id": "event:london:123",
      "title": "HOTMESS MAIN FLOOR",
      "venue": "The Factory",
      "date": "2025-12-02",
      "time": "22:00",
      "ticket_url": "https://...",
      "category": "club",
      "image": "https://..."
    }
  ]
}
```

#### **GET /intel/tonight/:city**
Get tonight's digest

**Response:**
```json
{
  "city": "london",
  "date": "2025-12-02",
  "events": [...],
  "set_times": [...],
  "summary": "15 events happening tonight in LONDON",
  "total_events": 15
}
```

#### **POST /intel/settimes**
Save DJ set times

**Request:**
```json
{
  "venue": "The Factory",
  "city": "london",
  "date": "2025-12-02",
  "lineup": [
    { "time": "22:00", "artist": "DOM TOP" },
    { "time": "00:00", "artist": "HARD SERVE" },
    { "time": "02:00", "artist": "RAW CONVICT SHOWCASE" }
  ],
  "source": "instagram"
}
```

#### **POST /intel/music/drop**
Process RAW CONVICT music drop

**Request:**
```json
{
  "title": "MAINFLOOR ANTHEM",
  "artist": "RAW CONVICT",
  "release_type": "single",
  "artwork_url": "https://...",
  "spotify_url": "https://...",
  "soundcloud_url": "https://..."
}
```

#### **POST /intel/sentiment/analyze**
Analyze room sentiment

**Request:**
```json
{
  "room_id": "room_123",
  "room_name": "London Chat",
  "messages": [
    "This night is amazing!",
    "Best vibes ever",
    "Love this community"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "sentiment": {
    "label": "positive",
    "confidence": 0.85,
    "analyzed_at": "2025-12-02T22:00:00Z"
  }
}
```

#### **GET /intel/city/:city/full**
Get complete intel package for a city

**Response:**
```json
{
  "city": "london",
  "events": [...],
  "set_times": [...],
  "queer_markets": [...],
  "sex_positive_events": [...],
  "pride_events": [...],
  "festivals": [...],
  "releases": [...],
  "trends": {...},
  "vibe": {...},
  "last_updated": "2025-12-02T22:00:00Z"
}
```

#### **GET /intel/cities**
Get list of active cities

**Response:**
```json
{
  "cities": [
    {
      "id": "london",
      "name": "London",
      "country": "UK",
      "coordinates": {
        "lat": 51.5074,
        "lng": -0.1278,
        "x": -0.05,
        "y": 0.51,
        "z": 0.86
      },
      "timezone": "Europe/London",
      "active": true,
      "event_count": 15
    }
  ]
}
```

#### **POST /intel/pride**
Add Pride event

**Request:**
```json
{
  "name": "London Pride 2025",
  "city": "london",
  "country": "UK",
  "date": "2025-06-28",
  "type": "parade",
  "website": "https://prideinlondon.org"
}
```

#### **POST /intel/market**
Add queer market/pop-up

**Request:**
```json
{
  "title": "Queer Makers Market",
  "location": "Shoreditch",
  "city": "london",
  "date": "2025-12-15",
  "time": "12:00-18:00",
  "type": "market",
  "instagram": "@queermakers"
}
```

---

## 🖥️ FRONTEND PAGES

### Global OS (`/?route=globalOS`)

**3D Globe interface for navigating cities**

Features:
- Interactive globe with city markers
- Click cities to explore
- Global stats (cities, events, live rooms)
- Auto-rotation
- Quick links to other HOTMESS features

### City OS (`/?route=cityOS&city=london`)

**Complete intelligence view for a city**

Tabs:
1. **Tonight** - All events happening tonight
2. **Set Times** - DJ lineups and schedules
3. **Markets** - Queer markets and pop-ups
4. **Pride** - Pride events and festivals
5. **Drops** - RAW CONVICT music releases
6. **Trends** - TikTok culture summaries

Features:
- Real-time event listings
- Ticket links
- Venue information
- Set time schedules
- Vibe indicator (positive/neutral/messy/unsafe)
- Responsive grid layouts
- Category filtering
- Back to globe navigation

---

## 🤖 AUTOMATION SYSTEM

### Data Sources

**Events:**
- Resident Advisor (London)
- QX Magazine (LGBTQ+)
- GayTimes Events
- Ticketmaster (LGBTQ+ category)
- DesignMyNight (London Clubs)
- Eventbrite (LGBTQ+, London)

**DJ Set Times:**
- Instagram public posts (tracked club accounts)
- Club websites
- Promoter social media

**Markets:**
- Eventbrite (LGBTQ+ markets)
- Instagram hashtags (#queermarket #queerpopup)
- Local queer collective pages

**Sex-Positive Events:**
- QX Magazine nightlife section
- Fetish venue websites
- Instagram hashtags (#fetishnight #kinklondon)

**Pride:**
- Pride Calendar API
- Eventbrite Pride filter
- Global Pride organization feeds

**Music:**
- SoundCloud API
- Spotify RSS
- DistroKid webhooks
- RAW CONVICT Airtable

**Trends:**
- TikTok trending endpoint (public)
- Creator RSS feeds
- GPT-4 summarization

---

## 🔄 MAKE.COM SCENARIOS

### 1. Daily Events Scraper
**Runs:** Every 6 hours  
**Purpose:** Pull events from all sources

Steps:
1. HTTP GET → Resident Advisor, Eventbrite, QX, GayTimes
2. Parse HTML/JSON/RSS
3. Merge arrays
4. Filter by city
5. Upsert to KV store (`event_raw:`)
6. Call `/intel/events/normalise`
7. Save clean events to `event:`

### 2. Set Times Scanner
**Runs:** Every 1 hour  
**Purpose:** Pull DJ set times from Instagram

Steps:
1. Instagram Graph API → Get posts from tracked clubs
2. Extract captions
3. Parse set times
4. POST to `/intel/settimes`
5. Auto-post to Events room (Telegram)

### 3. Tonight's Digest
**Runs:** 16:00 daily  
**Purpose:** Send "What's On Tonight" to Telegram

Steps:
1. GET `/intel/tonight/:city`
2. Format digest message
3. Post to: General, Events, Elite rooms

### 4. Music Drop Processor
**Runs:** On webhook from DistroKid  
**Purpose:** Process RAW CONVICT releases

Steps:
1. Webhook receives new track
2. POST to `/intel/music/drop`
3. Generate QR code
4. Generate poster
5. Post to: RAW, Drops, General, Radio rooms
6. Award XP to first 50 listeners

### 5. Sentiment Monitor
**Runs:** Every 15 minutes  
**Purpose:** Monitor room vibes

Steps:
1. Fetch last 50 messages per room (Telegram)
2. POST to `/intel/sentiment/analyze`
3. If "unsafe" → Alert hosts
4. If "positive" → Auto-post positive stinger
5. Log to KV store

### 6. Pride Batch Import
**Runs:** Monthly  
**Purpose:** Import upcoming Pride events

Steps:
1. Fetch from Pride Calendar API
2. Filter next 30 days
3. POST each to `/intel/pride`
4. Generate beacons
5. Post early alerts to Elite room

### 7. Market Scanner
**Runs:** Every 12 hours  
**Purpose:** Find queer markets/pop-ups

Steps:
1. Eventbrite LGBTQ feed
2. Instagram hashtag scraper
3. Filter for "market", "popup", "stall"
4. POST to `/intel/market`
5. Post to Drops room

### 8. TikTok Trend Summary
**Runs:** Weekly (Sunday)  
**Purpose:** Culture trend summary

Steps:
1. Fetch TikTok trending hashtags
2. Filter LGBTQ+ / nightlife terms
3. GPT-4 summary generation
4. Save to KV store
5. Post to Social + Elite rooms

### 9. Cross-Post Engine
**Runs:** On Drop/Event/Release post  
**Purpose:** Multi-channel distribution

Steps:
1. Trigger from Telegram post
2. Format for each platform
3. Post to:
   - Instagram Story
   - WhatsApp channel
   - Threads
4. Attach QR code
5. Log to KV store

---

## 💾 DATA STRUCTURES

### KV Store Keys

```typescript
// Events
event_raw:<source>:<timestamp>  // Raw scraped data
event:<city>:<timestamp>        // Normalized events

// Set Times
settime:<city>:<date>:<venue>

// Markets
market:<city>:<date>:<id>

// Sex-Positive Events
sex_event:<city>:<date>:<id>

// Pride
pride:<city>:<date>:<id>

// Festivals
festival:<city>:<id>

// Releases (RAW CONVICT)
release:<timestamp>:<id>

// Trends
trends:<city>:latest
trends:<city>:<week_of>

// Sentiment
sentiment:<room_id>:<timestamp>
sentiment:<city>:latest

// Cities
cities:active
```

---

## 🎨 UI COMPONENTS

### Globe3D Component

**Location:** `/components/Globe3D.tsx`

**Props:**
```typescript
interface Globe3DProps {
  cities: CityData[];
  onCitySelect?: (city: CityData) => void;
  autoRotate?: boolean;
}
```

**Features:**
- React Three Fiber canvas
- Sphere with wireframe + glow
- City markers with HTML labels
- Hover effects
- Click handlers
- OrbitControls
- Stars background

### City Marker

**Features:**
- Positioned on globe via x/y/z coordinates
- Hover scale animation
- Glow effect on hover
- Event count badge
- Click to navigate to City OS

### Loading State

```tsx
<Globe3DLoading />
```

Shows animated spinner while loading.

---

## 🚀 DEPLOYMENT

### Environment Variables

No additional variables needed. Uses existing:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

### Install Dependencies

```bash
npm install @react-three/fiber @react-three/drei three
```

### Routes Configuration

Already configured in `/lib/routes.ts`:
```typescript
globalOS: {
  id: "globalOS",
  label: "Global OS",
  href: "/global",
  group: "primary",
  description: "3D Globe - Worldwide nightlife intelligence",
},
cityOS: {
  id: "cityOS",
  label: "City OS",
  href: "/city",
  group: "hidden",
  description: "City intelligence view",
},
```

### Router Configuration

Already mounted in `/components/Router.tsx`:
```typescript
globalOS: <GlobalOS />,
cityOS: <CityOS />,
```

---

## 🧪 TESTING

### Test Global OS

```
https://hotmess.london/?route=globalOS
```

Should show:
- 3D globe with London marker
- Global stats
- City list at bottom
- Auto-rotation

### Test City OS

```
https://hotmess.london/?route=cityOS&city=london
```

Should show:
- City header with back button
- Vibe indicator (if sentiment data exists)
- Tabs: Tonight / Set Times / Markets / Pride / Drops / Trends
- Empty states if no data yet

### Test API Endpoints

```bash
# Get cities
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/cities \
  -H "Authorization: Bearer <ANON_KEY>"

# Get London events
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/events/london \
  -H "Authorization: Bearer <ANON_KEY>"

# Get tonight's digest
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/tonight/london \
  -H "Authorization: Bearer <ANON_KEY>"
```

---

## 📊 METRICS TO TRACK

### Usage
- Cities viewed
- Events viewed
- Ticket clicks
- Set times viewed
- Market interest
- Release plays

### Automation Health
- Scraper success rate
- Events normalized per day
- API response times
- Sentiment analysis accuracy

### Revenue
- Ticket conversions
- PRO upgrades from City OS
- Event beacon creation
- Market beacon creation

---

## 🔮 FUTURE ENHANCEMENTS

### More Cities
Add markers for:
- Berlin
- NYC
- LA
- Barcelona
- Amsterdam
- Tokyo

### More Data Sources
- Facebook Events
- Meetup.com
- Dice (ticket platform)
- Bandcamp (music)
- Mixcloud (DJ sets)

### AI Features
- Personalized event recommendations
- "Events for You" based on history
- Smart notifications (2h before events)
- Automatic friend matching at events

### Globe Features
- Heatmap visualization (activity levels)
- Event density visualization
- Pride rainbow overlay
- Night/day cycle
- Weather overlay
- Real-time beacon pings

---

## ✅ STATUS

**Development:** ✅ COMPLETE  
**API:** ✅ 11 ENDPOINTS LIVE  
**Frontend:** ✅ 2 PAGES + GLOBE COMPONENT  
**Types:** ✅ COMPLETE  
**Routes:** ✅ CONFIGURED  
**Router:** ✅ MOUNTED  
**Documentation:** ✅ COMPLETE  

**Overall:** 🚀 **PRODUCTION READY**

---

## 📞 INTEGRATION WITH EXISTING SYSTEMS

### Hookup Beacons
- Auto-create beacons for events
- Link events to hookup zones
- Venue-specific QR codes

### XP System
- Award XP for attending events
- Bonus XP for early RSVPs
- Streak bonuses for regular attendees

### Membership
- PRO: Advanced event filtering
- ELITE: Early access to events, priority RSVP

### Tickets
- Auto-link to ticket purchase flow
- Track conversions
- Affiliate revenue

### Bot Integration
- Auto-post new events to Telegram
- Send tonight's digest daily
- Alert on vibe changes
- Announce new drops

---

**Built with care. Automated for scale.** 🖤
