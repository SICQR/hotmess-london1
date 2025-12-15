# 🌍 HOTMESS MAPBOX 3D GLOBE — COMPLETE SYSTEM README

**Night Pulse Global Intelligence OS with 3D Earth Visualization**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Current Implementation](#current-implementation)
3. [Architecture](#architecture)
4. [API Endpoints](#api-endpoints)
5. [Frontend Components](#frontend-components)
6. [Data Models](#data-models)
7. [Future Vision](#future-vision)
8. [Setup & Installation](#setup--installation)
9. [Integration Points](#integration-points)
10. [GitHub Development Guide](#github-development-guide)

---

## 🎯 Overview

### What Is This?

The **HOTMESS 3D Globe** is an interactive real-time global visualization system that displays:

- **Gay male nightlife venues** (clubs, bars, saunas, cruise zones) across major cities worldwide
- **Beacon heat maps** showing real-time check-ins and activity
- **Event intelligence** (club nights, Pride events, festivals, queer markets)
- **DJ set times** and music drops
- **City-level intelligence** with Tonight's Digest, trends, and vibes

### Core Technologies

- **Frontend:** React + Three.js + OrbitControls
- **Backend:** TypeScript/Hono on Supabase Edge Functions
- **Data Store:** Supabase KV Store (Postgres key-value table)
- **Globe Engine:** THREE.js with custom WebGL rendering
- **Automation:** Make.com scenarios (planned)

### Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Backend API** | ✅ COMPLETE | 11 endpoints live |
| **3D Globe Component** | ✅ COMPLETE | `NightPulseGlobe.tsx` |
| **Admin Globe View** | ✅ COMPLETE | Canvas-based admin visualization |
| **City OS Pages** | ✅ COMPLETE | Global OS + City OS |
| **Mock Data** | ✅ COMPLETE | 10+ cities, 30+ venues |
| **API Integration** | 🟡 READY | Needs real data pipeline |
| **Automation** | ⏳ PLANNED | Make.com scenarios documented |
| **Mapbox Integration** | 🔴 FUTURE | Currently using mock data |

---

## 🏗️ Current Implementation

### What You Have Right Now

#### 1. **3D Globe Component** (`/components/globe/NightPulseGlobe.tsx`)

**Features:**
- Google Earth Pro-style interactive globe
- Full zoom, rotate, and pan controls (OrbitControls)
- Real-time venue markers with heat visualization
- City-level aggregation with stats (scans, listeners)
- Click handlers for city exploration
- Time window filtering (tonight/weekend/month)
- WebGL-based with Three.js Scene + PerspectiveCamera

**Mock Data Includes:**
- London (Heaven, G-A-Y, The Glory)
- New York (Stonewall, Phoenix, Hell's Kitchen)
- Berlin (Berghain, Lab.oratory, KitKat)
- Paris (Le Marais, Raidd Bar)
- Amsterdam (Reguliersdwarsstraat, Church)
- San Francisco (Castro, Oasis)
- Barcelona (Gaixample, Metro Disco)
- Sydney (ARQ, Oxford Street)
- Tokyo (Shinjuku Ni-chōme, Arty Farty)
- Tel Aviv (Lima Lima, Shpagat)

**Code Location:** `/components/globe/NightPulseGlobe.tsx` (600+ lines)

---

#### 2. **Admin Globe View** (`/pages/admin/AdminGlobeView.tsx`)

**Features:**
- 2D canvas-based projection for admin dashboard
- Beacon filtering (active/inactive/all)
- Search functionality
- Globe statistics dashboard
- Beacon list with click-to-view
- Manual canvas rendering with lat/long projection

**Code Location:** `/pages/admin/AdminGlobeView.tsx`

---

#### 3. **Backend API** (`/supabase/functions/server/intel_api.tsx`)

**Base URL:**
```
https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel
```

**11 Endpoints Live:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/events/normalise` | POST | Normalize raw scraped events |
| `/events/:city` | GET | Get all events for a city |
| `/tonight/:city` | GET | Get tonight's digest |
| `/settimes` | POST | Save DJ set times |
| `/music/drop` | POST | Process music releases |
| `/sentiment/analyze` | POST | Analyze room vibes |
| `/city/:city/full` | GET | Get complete city intel |
| `/cities` | GET | Get list of active cities |
| `/pride` | POST | Add Pride event |
| `/market` | POST | Add queer market/pop-up |
| `/festivals` | GET | Get festival data |

**Code Location:** `/supabase/functions/server/intel_api.tsx`

---

#### 4. **Frontend Pages**

**Global OS** (`/pages/GlobalOS.tsx`)
- Route: `/?route=globalOS`
- 3D globe interface
- Global stats overlay
- City navigation
- Auto-rotation toggle

**City OS** (`/pages/CityOS.tsx`)
- Route: `/?route=cityOS&city=london`
- Tonight's events
- DJ set times
- Markets & pop-ups
- Pride calendar
- Music drops
- TikTok trends
- Vibe indicator

---

## 🏛️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    HOTMESS 3D GLOBE SYSTEM                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   SCRAPERS   │ ───▶ │  INTEL API   │ ───▶ │   KV STORE   │
│  (Make.com)  │      │   (Hono)     │      │  (Supabase)  │
└──────────────┘      └──────────────┘      └──────────────┘
                             │
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                       FRONTEND APPS                          │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Global OS   │   City OS    │  Admin View  │  Beacon Map    │
│  (3D Globe)  │  (Intel Hub) │  (Canvas)    │  (Heat Layer)  │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

### Data Flow

```
1. SCRAPER (Make.com)
   ↓
2. POST /api/intel/events/normalise
   ↓
3. KV Store: event:city:timestamp:id
   ↓
4. GET /api/intel/cities
   ↓
5. FRONTEND: NightPulseGlobe Component
   ↓
6. User clicks city
   ↓
7. GET /api/intel/city/:city/full
   ↓
8. City OS Page renders
```

---

## 🔌 API Endpoints

### Base Configuration

```typescript
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/intel`;
const headers = {
  'Authorization': `Bearer ${publicAnonKey}`,
  'Content-Type': 'application/json'
};
```

---

### 1. **GET /api/intel/cities**

**Purpose:** Get all active cities with coordinates and stats

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
      "event_count": 15,
      "venue_count": 12,
      "beacon_scans": 350
    }
  ]
}
```

**Used By:** Global OS, Admin Globe View

---

### 2. **GET /api/intel/events/:city**

**Purpose:** Get all upcoming events for a city

**Example:** `/api/intel/events/london`

**Response:**
```json
{
  "city": "london",
  "events": [
    {
      "id": "event:london:1733140800:abc123",
      "title": "HOTMESS MAIN FLOOR",
      "venue": "The Factory",
      "date": "2025-12-02",
      "time": "22:00",
      "ticket_url": "https://example.com/tickets",
      "category": "club",
      "image": "https://example.com/flyer.jpg",
      "description": "Techno and house all night",
      "price_from": 15,
      "price_currency": "GBP"
    }
  ]
}
```

**Used By:** City OS (Tonight tab)

---

### 3. **GET /api/intel/tonight/:city**

**Purpose:** Get tonight's digest with events and set times

**Example:** `/api/intel/tonight/london`

**Response:**
```json
{
  "city": "london",
  "date": "2025-12-02",
  "events": [...],
  "set_times": [
    {
      "venue": "The Factory",
      "time": "22:00",
      "artist": "DOM TOP",
      "room": "Main Floor"
    }
  ],
  "summary": "15 events happening tonight in LONDON",
  "total_events": 15,
  "vibe": "positive"
}
```

**Used By:** City OS, Telegram Daily Digest Bot

---

### 4. **GET /api/intel/city/:city/full**

**Purpose:** Get complete intel package for a city

**Example:** `/api/intel/city/london/full`

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
  "trends": {
    "week_of": "2025-12-01",
    "hashtags": ["#gayclub", "#techno", "#nightlife"],
    "summary": "High energy techno week with 3 new club nights"
  },
  "vibe": {
    "label": "positive",
    "confidence": 0.85,
    "analyzed_at": "2025-12-02T22:00:00Z"
  },
  "last_updated": "2025-12-02T22:00:00Z"
}
```

**Used By:** City OS (all tabs)

---

### 5. **POST /api/intel/events/normalise**

**Purpose:** Normalize raw scraped events into unified schema

**Request Body:**
```json
{
  "source": "resident_advisor",
  "raw_data": {
    "title": "HOTMESS MAIN FLOOR",
    "venue": "The Factory",
    "date": "2025-12-02",
    "link": "https://ra.co/events/..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "normalized": 15,
  "events": [...]
}
```

**Used By:** Make.com Event Scraper

---

### 6. **POST /api/intel/settimes**

**Purpose:** Save DJ set times from Instagram/scrapers

**Request Body:**
```json
{
  "venue": "The Factory",
  "city": "london",
  "date": "2025-12-02",
  "lineup": [
    { "time": "22:00", "artist": "DOM TOP" },
    { "time": "00:00", "artist": "HARD SERVE" },
    { "time": "02:00", "artist": "RAW CONVICT" }
  ],
  "source": "instagram"
}
```

**Response:**
```json
{
  "success": true,
  "set_time_id": "settime:london:2025-12-02:factory"
}
```

**Used By:** Instagram Set Times Scraper

---

### 7. **POST /api/intel/sentiment/analyze**

**Purpose:** Analyze room vibes with AI

**Request Body:**
```json
{
  "room_id": "room_london_chat",
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

**Used By:** Room Sentiment Monitor

---

### 8. **POST /api/intel/music/drop**

**Purpose:** Process RAW CONVICT music releases

**Request Body:**
```json
{
  "title": "MAINFLOOR ANTHEM",
  "artist": "RAW CONVICT",
  "release_type": "single",
  "artwork_url": "https://...",
  "spotify_url": "https://open.spotify.com/track/...",
  "soundcloud_url": "https://soundcloud.com/..."
}
```

**Response:**
```json
{
  "success": true,
  "release_id": "release:1733140800:xyz789",
  "qr_code": "https://hotmessldn.com/l/RC123",
  "beacon_id": "beacon_drop_rc123"
}
```

**Used By:** DistroKid Webhook Handler

---

### 9. **POST /api/intel/pride**

**Purpose:** Add Pride event to calendar

**Request Body:**
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

---

### 10. **POST /api/intel/market**

**Purpose:** Add queer market or pop-up

**Request Body:**
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

### 11. **GET /api/intel/festivals**

**Purpose:** Get upcoming festivals

**Response:**
```json
{
  "festivals": [
    {
      "name": "Circuit Festival",
      "city": "barcelona",
      "dates": {
        "start": "2025-08-10",
        "end": "2025-08-17"
      },
      "type": "music",
      "website": "https://circuitfestival.net"
    }
  ]
}
```

---

## 🎨 Frontend Components

### 1. NightPulseGlobe Component

**File:** `/components/globe/NightPulseGlobe.tsx`

**Props:**
```typescript
interface NightPulseGlobeProps {
  onCityClick?: (city: CityStats) => void;
  timeWindow?: 'tonight' | 'weekend' | 'month';
}
```

**Usage:**
```tsx
import { NightPulseGlobe } from '@/components/globe/NightPulseGlobe';

function GlobalOS() {
  const handleCityClick = (city: CityStats) => {
    navigate('cityOS', { city: city.city.toLowerCase() });
  };

  return (
    <NightPulseGlobe 
      onCityClick={handleCityClick} 
      timeWindow="tonight" 
    />
  );
}
```

**Features:**
- Three.js Scene with PerspectiveCamera
- OrbitControls (drag to rotate, scroll to zoom, right-click to pan)
- Earth sphere with wireframe + atmosphere glow
- Venue markers with heat intensity (scan count)
- HTML overlays for city labels
- Loading states
- Responsive canvas sizing

**Key Methods:**
- `initGlobe()` - Initialize Three.js scene
- `createEarth()` - Create globe mesh
- `addVenueMarkers()` - Plot venues on globe
- `latLngToVector3()` - Convert lat/lng to 3D coordinates
- `animate()` - Animation loop

---

### 2. AdminGlobeView Component

**File:** `/pages/admin/AdminGlobeView.tsx`

**Features:**
- 2D canvas-based globe projection
- Manual lat/lng to x/y coordinate mapping
- Filter by status (active/inactive/all)
- Search by name, city, country
- Beacon statistics dashboard
- Click-to-select beacon details

---

### 3. GlobalOS Page

**File:** `/pages/GlobalOS.tsx`

**Route:** `/?route=globalOS`

**Features:**
- Full-screen 3D globe
- Global stats overlay (cities, events, live rooms)
- City list sidebar
- Auto-rotation toggle
- Quick links to other features

---

### 4. CityOS Page

**File:** `/pages/CityOS.tsx`

**Route:** `/?route=cityOS&city=london`

**Tabs:**
1. **Tonight** - Events happening tonight
2. **Set Times** - DJ lineups and schedules
3. **Markets** - Queer markets and pop-ups
4. **Pride** - Pride events and calendar
5. **Drops** - RAW CONVICT music releases
6. **Trends** - TikTok culture summaries

---

## 💾 Data Models

### KV Store Keys

```typescript
// Events
event_raw:<source>:<timestamp>          // Raw scraped data
event:<city>:<timestamp>:<id>           // Normalized events

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

### TypeScript Types

**File:** `/types/intel.ts`

```typescript
export interface CityData {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number;
    y: number;
    z: number;
  };
  timezone: string;
  active: boolean;
  event_count: number;
  venue_count: number;
  beacon_scans: number;
}

export interface Event {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  ticket_url: string;
  category: 'club' | 'bar' | 'sauna' | 'party' | 'queer' | 'pride';
  image?: string;
  description?: string;
  price_from?: number;
  price_currency?: string;
}

export interface SetTime {
  venue: string;
  city: string;
  date: string;
  time: string;
  artist: string;
  room?: string;
  source: 'instagram' | 'website' | 'manual';
}

export interface MusicDrop {
  id: string;
  title: string;
  artist: string;
  release_type: 'single' | 'album' | 'ep';
  artwork_url: string;
  spotify_url?: string;
  soundcloud_url?: string;
  apple_music_url?: string;
  released_at: string;
}

export interface Sentiment {
  room_id: string;
  room_name: string;
  label: 'positive' | 'neutral' | 'messy' | 'unsafe';
  confidence: number;
  analyzed_at: string;
}

export interface BeaconHeatData {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    scans: number;
    city: string;
    country: string;
    beaconId: string;
    venueName?: string;
    venueType?: string;
  };
}
```

---

## 🚀 Future Vision

### Phase 1: Real Data Integration (Q1 2025)

**Goal:** Replace mock data with real beacon scans and event data

**Tasks:**
1. ✅ Backend API complete
2. ✅ Frontend components complete
3. ⏳ Connect KV store to globe rendering
4. ⏳ Real beacon scan data pipeline
5. ⏳ City coordinates from real venues

**Dependencies:**
- Beacon OS implementation (see `/docs/BEACONS.md`)
- Make.com automation scenarios

---

### Phase 2: Mapbox Integration (Q2 2025)

**Goal:** Replace Three.js with Mapbox GL JS for professional globe

**Why Mapbox?**
- Production-grade 3D globe rendering
- Real-time data layers
- Built-in geocoding and search
- Custom markers and heat layers
- Mobile performance optimization
- Vector tile support

**Migration Plan:**

```typescript
// Current: Three.js
import * as THREE from 'three';
const scene = new THREE.Scene();

// Future: Mapbox GL JS
import mapboxgl from 'mapbox-gl';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  projection: 'globe',
  center: [-0.1276, 51.5074],
  zoom: 3
});
```

**Key Features:**
- **3D Terrain:** Enable globe projection with `projection: 'globe'`
- **Custom Markers:** GeoJSON source for venues
- **Heat Layer:** Beacon scan density visualization
- **Clustering:** Aggregate markers at low zoom levels
- **Real-time Updates:** WebSocket integration for live scans
- **Fly-to Animation:** Smooth city transitions

**Mapbox Layers:**
1. **Base Layer:** Dark theme globe
2. **Venue Layer:** Custom marker icons (club/bar/sauna)
3. **Heat Layer:** Scan density heatmap
4. **Pulse Layer:** Real-time beacon activations
5. **Labels Layer:** City names and stats

**Example Code:**
```typescript
// Add venue markers
map.addSource('venues', {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: venues.map(v => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [v.lng, v.lat]
      },
      properties: {
        name: v.name,
        scans: v.scans,
        type: v.type
      }
    }))
  }
});

map.addLayer({
  id: 'venue-markers',
  type: 'circle',
  source: 'venues',
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['get', 'scans'], 0, 4, 500, 20],
    'circle-color': '#FF0080',
    'circle-opacity': 0.8,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff'
  }
});
```

**Heatmap Layer:**
```typescript
map.addLayer({
  id: 'beacon-heat',
  type: 'heatmap',
  source: 'venues',
  paint: {
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'scans'], 0, 0, 500, 1],
    'heatmap-intensity': 1,
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0,0,0,0)',
      0.2, '#6B0080',
      0.4, '#8B008B',
      0.6, '#FF0080',
      0.8, '#FF1493',
      1, '#FF69B4'
    ],
    'heatmap-radius': 40,
    'heatmap-opacity': 0.7
  }
});
```

---

### Phase 3: Advanced Features (Q3-Q4 2025)

#### 3.1 Real-Time WebSocket Integration

**Goal:** Live beacon scans appear instantly on globe

**Implementation:**
```typescript
const ws = new WebSocket('wss://hotmessldn.com/ws/beacons');

ws.onmessage = (event) => {
  const scan = JSON.parse(event.data);
  
  // Add pulse animation at scan location
  addPulseEffect(scan.lat, scan.lng);
  
  // Update venue scan count
  updateVenueScans(scan.venue_id, scan.scans);
  
  // Update global stats
  updateStats();
};
```

---

#### 3.2 Time-Based Visualization

**Goal:** Show how nightlife moves across timezones

**Features:**
- Day/night cycle overlay
- "Right now" filter (venues open now)
- Time slider (view past 24 hours)
- Timezone-aware event display

**UI:**
```
┌─────────────────────────────────────────┐
│  🌍 HOTMESS NIGHT PULSE                 │
├─────────────────────────────────────────┤
│                                          │
│  ⏰ Right Now: 22:30 GMT                │
│  🌙 Night Mode: Active                  │
│                                          │
│  [━━━━━━━●━━━━━] 00:00                  │
│  Past 6h ◀────▶ Next 6h                 │
│                                          │
└─────────────────────────────────────────┘
```

---

#### 3.3 AR View Mode

**Goal:** Mobile AR for in-venue beacon discovery

**Tech Stack:**
- WebXR API
- Device camera + gyroscope
- Geolocation
- AR overlays

**Use Case:**
User in London club → Opens AR view → Sees nearby beacons floating in 3D space → Scans beacon by pointing camera

---

#### 3.4 Pride Rainbow Overlay

**Goal:** Visualize global Pride calendar

**Features:**
- Rainbow arc connecting Pride cities
- Pride month heat intensity
- Historical Pride events (Stonewall, etc.)
- Pride march routes

**Example:**
```typescript
// Draw rainbow arc between Pride cities
const prideArc = new THREE.CatmullRomCurve3([
  vectorFromLatLng(51.5074, -0.1278), // London
  vectorFromLatLng(40.7128, -74.0060), // NYC
  vectorFromLatLng(37.7749, -122.4194) // SF
]);

const arcGeometry = new THREE.TubeGeometry(prideArc, 100, 0.01, 8, false);
const arcMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xFF0080,
  transparent: true,
  opacity: 0.6
});
const arcMesh = new THREE.Mesh(arcGeometry, arcMaterial);
scene.add(arcMesh);
```

---

#### 3.5 AI-Powered Recommendations

**Goal:** Personalized event suggestions based on user behavior

**Features:**
- "Events for You" based on past scans
- "Similar Venues" recommendations
- "Your Tribe" (users with similar taste)
- Smart notifications (2h before events you'd like)

**ML Model:**
- User embedding: scan history + beacon types + cities
- Event embedding: venue type + music genre + vibe + time
- Cosine similarity matching
- Real-time inference via edge function

---

#### 3.6 Venue Detail Cards

**Goal:** Rich venue information on click

**UI:**
```
┌─────────────────────────────────────────┐
│  🏢 BERGHAIN                             │
│  📍 Berlin, Germany                      │
├─────────────────────────────────────────┤
│  🔥 Hot Right Now: 480 scans tonight    │
│  🎵 Genre: Techno, Industrial           │
│  🕐 Open: Thu-Mon, 00:00-late           │
│                                          │
│  ⭐ Reviews (4.8/5)                      │
│  "Best techno club in the world"        │
│  - User#4521                            │
│                                          │
│  📅 Upcoming Events (3)                 │
│  • Tonight: KLUBNACHT                   │
│  • Friday: SÄULE                        │
│  • Saturday: BERGHAIN SUNDAYS           │
│                                          │
│  [View Full Page] [Get Directions]      │
└─────────────────────────────────────────┘
```

---

#### 3.7 City Comparison Mode

**Goal:** Compare nightlife metrics across cities

**Metrics:**
- Total venues
- Events per week
- Average scan activity
- Vibe score (positive/neutral/messy)
- Pride friendliness index
- Safety rating

**UI:**
```
┌─────────────────────────────────────────┐
│  LONDON vs BERLIN vs NYC                │
├─────────────────────────────────────────┤
│  Venues:    52  ●  67  ●  89            │
│  Events/wk: 120 ●  95  ●  150           │
│  Activity:  ████████  ██████  ███████   │
│  Vibe:      😊 4.2   😊 4.5   😊 4.0    │
└─────────────────────────────────────────┘
```

---

### Phase 4: Monetization Features

#### 4.1 Sponsored Beacons on Globe

**Goal:** Revenue from venue/event sponsors

**Implementation:**
- Sponsored markers glow brighter
- "Featured" badge on venue cards
- Priority placement in search
- Boosted visibility in recommendations

**Pricing Model:**
- £100/week for featured placement
- £500/month for city-wide boost
- £2,000/year for global presence

---

#### 4.2 PRO/ELITE Features

**PRO Members ($9.99/mo):**
- Advanced event filtering
- Save favorite venues
- Custom notification settings
- Early access to tickets

**ELITE Members ($19.99/mo):**
- Priority RSVP at events
- Exclusive pre-sale access
- VIP venue check-in perks
- Personal venue recommendations
- Ad-free globe experience

---

#### 4.3 Venue Analytics Dashboard

**Goal:** Sell analytics to venue owners

**Metrics:**
- Weekly foot traffic (beacon scans)
- Peak hours analysis
- User demographics (anonymized)
- Competitor comparison
- Event performance tracking

**Pricing:** £199/month per venue

---

## 🛠️ Setup & Installation

### Prerequisites

```bash
# Node.js 18+
node -v

# npm or yarn
npm -v
```

---

### 1. Install Dependencies

```bash
# Three.js and React Three Fiber
npm install three @react-three/fiber @react-three/drei

# Type definitions
npm install -D @types/three
```

---

### 2. Environment Variables

Already configured in Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

### 3. Test Backend API

```bash
# Get active cities
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

### 4. Test Frontend

```bash
# Start dev server
npm run dev

# Visit routes
http://localhost:5173/?route=globalOS
http://localhost:5173/?route=cityOS&city=london
http://localhost:5173/?route=adminGlobeView
```

---

## 🔗 Integration Points

### 1. Beacon OS Integration

**File:** `/docs/BEACONS.md`

**Connection Points:**
- Every venue has check-in beacons
- Beacon scans → Globe heat data
- Real-time scan events → WebSocket → Globe pulse
- Venue coordinates from beacon geo data

**Data Flow:**
```
User scans venue beacon
  ↓
POST /api/beacons/scan
  ↓
KV Store: scan_event:<beacon_id>:<timestamp>
  ↓
WebSocket broadcast: { type: 'scan', lat, lng, venue }
  ↓
Globe updates real-time
```

---

### 2. XP System Integration

**Connection:**
- Scanning beacons at venues earns XP
- Globe shows XP density heat map
- Cities with more XP activity glow brighter

---

### 3. Telegram Bot Integration

**Connection:**
- Tonight's Digest auto-posts to Telegram
- Bot sends city intel on command
- Globe updates trigger bot notifications

**Commands:**
```
/tonight london - Get tonight's events
/globe - View global stats
/city berlin - Get Berlin intel
```

---

### 4. Ticket System Integration

**Connection:**
- Events on globe link to ticket purchase
- Ticket sales tracked per city
- High-selling events get boosted visibility

---

### 5. Radio Integration

**Connection:**
- Live listeners mapped to cities
- DJ set times appear on City OS
- Music drops geo-tagged to release city

---

## 📦 GitHub Development Guide

### Repository Structure

```
hotmess-london/
├── components/
│   └── globe/
│       └── NightPulseGlobe.tsx       # Main 3D globe component
├── pages/
│   ├── GlobalOS.tsx                  # Global view page
│   ├── CityOS.tsx                    # City view page
│   └── admin/
│       └── AdminGlobeView.tsx        # Admin 2D globe
├── supabase/functions/server/
│   └── intel_api.tsx                 # Backend API
├── types/
│   └── intel.ts                      # TypeScript types
├── docs/
│   ├── GLOBE_3D_SYSTEM_README.md     # This file
│   ├── AUTO_INTEL_ENGINE.md          # Full system docs
│   ├── AUTO_INTEL_SETUP_GUIDE.md     # Setup guide
│   └── BEACONS.md                    # Beacon OS spec
└── README.md                         # Main project README
```

---

### Development Workflow

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/hotmess-london.git
cd hotmess-london
```

---

#### 2. Create Feature Branch

```bash
# For globe features
git checkout -b feature/globe-mapbox-integration

# For API updates
git checkout -b feature/intel-api-realtime

# For bug fixes
git checkout -b fix/globe-rendering-bug
```

---

#### 3. Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
http://localhost:5173/?route=globalOS
```

---

#### 4. Test Changes

```bash
# Run type checks
npm run type-check

# Run linter
npm run lint

# Test API endpoints
npm run test:api
```

---

#### 5. Commit Changes

```bash
# Stage files
git add .

# Commit with descriptive message
git commit -m "feat(globe): Add Mapbox GL JS integration with heat layers"

# Push to GitHub
git push origin feature/globe-mapbox-integration
```

---

#### 6. Create Pull Request

**PR Template:**
```markdown
## Description
Add Mapbox GL JS integration to replace Three.js globe

## Changes
- ✅ Installed mapbox-gl dependency
- ✅ Migrated NightPulseGlobe to Mapbox
- ✅ Added heatmap layer for beacon scans
- ✅ Implemented clustering for venue markers

## Testing
- [x] Globe renders on Global OS page
- [x] Venue markers appear correctly
- [x] Heat layer shows scan density
- [x] Click handlers work for cities

## Screenshots
![Globe with Mapbox](screenshot.png)

## Related Issues
Closes #123
```

---

### Branching Strategy

```
main (production)
  ↓
develop (staging)
  ↓
├── feature/globe-*
├── feature/intel-*
├── fix/globe-*
└── docs/globe-*
```

---

### Commit Message Conventions

```bash
# Feature
feat(globe): Add real-time WebSocket updates

# Bug fix
fix(globe): Fix marker positioning on zoom

# Documentation
docs(globe): Update API endpoint examples

# Refactor
refactor(globe): Extract marker logic to hook

# Performance
perf(globe): Optimize render loop for 60fps

# Test
test(globe): Add unit tests for latLngToVector3

# Chore
chore(globe): Update Three.js to v0.160.0
```

---

### Issue Labels

```
globe:feature      - New globe feature
globe:bug          - Globe rendering bug
globe:perf         - Performance improvement
globe:docs         - Documentation update
intel:api          - Intel API change
intel:automation   - Make.com automation
priority:high      - Critical issue
priority:low       - Nice to have
status:blocked     - Waiting on dependency
status:in-progress - Currently being worked on
```

---

### Code Review Checklist

**Before submitting PR:**
- [ ] Code follows TypeScript best practices
- [ ] No console.log in production code
- [ ] Types are properly defined
- [ ] Components have proper error handling
- [ ] API endpoints return consistent responses
- [ ] Loading states implemented
- [ ] Mobile responsive
- [ ] No Tailwind font classes (per project rules)
- [ ] Documentation updated

---

### Release Process

```bash
# 1. Merge feature branches to develop
git checkout develop
git merge feature/globe-mapbox-integration

# 2. Test on staging
npm run deploy:staging

# 3. Create release branch
git checkout -b release/v2.0.0

# 4. Update version
npm version 2.0.0

# 5. Merge to main
git checkout main
git merge release/v2.0.0

# 6. Tag release
git tag -a v2.0.0 -m "Release v2.0.0: Mapbox Globe Integration"
git push origin v2.0.0

# 7. Deploy to production
npm run deploy:production
```

---

## 📊 Success Metrics

### Technical Metrics

- **Globe Load Time:** < 2 seconds
- **Frame Rate:** 60 FPS on desktop, 30 FPS on mobile
- **API Response Time:** < 200ms for city data
- **WebSocket Latency:** < 100ms for real-time updates
- **Bundle Size:** < 500KB for globe component

### User Metrics

- **Daily Active Users:** 10,000+ using globe
- **Average Session Time:** 3+ minutes on globe
- **City Clicks:** 50%+ click-through rate
- **Event Conversions:** 10%+ ticket purchases from City OS

### Business Metrics

- **Sponsored Beacons:** 50+ venues paying for placement
- **PRO Upgrades:** 5% conversion from globe usage
- **Venue Analytics:** 20+ venues subscribed
- **API Calls:** 1M+ requests/day

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **Mock Data Only:** Globe uses hardcoded venue data
2. **No Real-time Updates:** Beacon scans don't update live
3. **Limited Cities:** Only 10 cities with data
4. **No Mapbox:** Using Three.js (more basic than Mapbox)
5. **No Clustering:** All markers always visible
6. **Mobile Performance:** Can drop below 30 FPS on older devices

### Bug Tracker

| Issue | Priority | Status | ETA |
|-------|----------|--------|-----|
| Globe stutters on zoom | High | In Progress | Q1 2025 |
| Markers overlap at high zoom | Medium | Todo | Q2 2025 |
| Mobile touch controls buggy | High | Todo | Q1 2025 |
| City labels cut off | Low | Backlog | Q3 2025 |

---

## 📚 Additional Resources

### Documentation Files

- **[AUTO_INTEL_ENGINE.md](./AUTO_INTEL_ENGINE.md)** - Complete system documentation
- **[AUTO_INTEL_SETUP_GUIDE.md](./AUTO_INTEL_SETUP_GUIDE.md)** - Setup automation guide
- **[BEACONS.md](./BEACONS.md)** - Beacon OS specification
- **[API_BEACONS.md](./API_BEACONS.md)** - Beacon API documentation
- **[COMPLETE_SYSTEM_SUMMARY.md](./COMPLETE_SYSTEM_SUMMARY.md)** - Full platform overview

### External Links

- **Three.js Docs:** https://threejs.org/docs/
- **Mapbox GL JS:** https://docs.mapbox.com/mapbox-gl-js/
- **React Three Fiber:** https://docs.pmnd.rs/react-three-fiber/
- **Supabase Docs:** https://supabase.com/docs
- **Make.com Academy:** https://www.make.com/en/academy

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with descriptive messages**
6. **Push to your fork**
7. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Keep PRs focused and small
- Be responsive to code review feedback

---

## 📧 Support & Contact

**Issues:** https://github.com/yourusername/hotmess-london/issues
**Discussions:** https://github.com/yourusername/hotmess-london/discussions
**Email:** dev@hotmessldn.com

---

## 📄 License

**Proprietary - HOTMESS LONDON Ltd**

All rights reserved. This code is proprietary and confidential.

---

## 🎉 Acknowledgments

Built with care by the HOTMESS team for the global queer nightlife community.

**Special thanks to:**
- Three.js team for WebGL framework
- Mapbox for future globe engine
- Supabase for backend infrastructure
- Make.com for automation platform

---

**Last Updated:** December 8, 2025
**Version:** 1.0.0
**Status:** ✅ Complete - Ready for GitHub collaboration

---

## 🚀 Quick Start Commands

```bash
# Clone repo
git clone https://github.com/yourusername/hotmess-london.git
cd hotmess-london

# Install dependencies
npm install

# Start dev server
npm run dev

# View globe
http://localhost:5173/?route=globalOS

# View city
http://localhost:5173/?route=cityOS&city=london

# View admin
http://localhost:5173/?route=adminGlobeView

# Test API
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/cities \
  -H "Authorization: Bearer <ANON_KEY>"
```

---

**Built with 🖤 for the community. Let's light up the globe together.**
