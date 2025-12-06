# 📍 HOTMESS RADIO - COMPONENT MAP

## Quick Reference: What File Controls What UI

---

## 🎯 MAIN RADIO PAGES

### 1️⃣ **Radio Homepage** → `/radio`

**File**: `/pages/RadioNew.tsx`

**Shows**:
- Hero banner with live stream artwork
- "🔴 LIVE NOW" badge
- "👥 248 listeners" count
- Large PLAY button
- Current track title/artist
- Upcoming shows grid
- Recent podcast episodes
- Featured shows carousel

**API Calls**:
```typescript
useRadioStatus()  // → /api/radio/listeners
useRadio()        // → RadioContext global state
useRadioXP()      // → XP tracking
```

**Screenshot Layout**:
```
┌──────────────────────────────────────┐
│ [Dark background with DJ image]      │
│                                       │
│ 🔴 LIVE NOW    👥 248 listening      │
│                                       │
│ HOTMESS RADIO                         │
│ ══════════════════════════════════   │
│                                       │
│ ▶️ PLAY LIVE STREAM                  │
│                                       │
│ NOW: Wet Black Chrome - RAW CONVICT  │
└──────────────────────────────────────┘
│                                       │
│ UPCOMING SHOWS                        │
│ ┌───────┐ ┌───────┐ ┌───────┐       │
│ │Wake   │ │Dial-A-│ │Night- │       │
│ │Mess   │ │Daddy  │ │body   │       │
│ └───────┘ └───────┘ └───────┘       │
└──────────────────────────────────────┘
```

---

### 2️⃣ **Now Playing Detail** → `/radio/now-playing`

**File**: `/pages/RadioNowPlaying.tsx`

**Shows**:
- Full-screen album artwork
- Large play/pause button
- Like/heart button
- Chat toggle button
- Volume slider
- Show information card
- DJ profile with avatar
- Listener count + schedule time
- Recently played tracks
- Sliding chat panel

**API Calls**:
```typescript
useRadio()  // → nowPlaying, currentShow, stats
```

**Screenshot Layout**:
```
┌──────────────────────────────────────┐
│ ◀ Back    🔴 LIVE NOW    Share 🔗   │
├──────────────────────────────────────┤
│                                       │
│                                       │
│     [LARGE ALBUM ARTWORK IMAGE]       │
│                                       │
│     ❤️      ▶️ PLAY      💬         │
│                                       │
├──────────────────────────────────────┤
│ Wet Black Chrome                      │
│ RAW CONVICT                           │
│ Techno / Industrial                   │
├──────────────────────────────────────┤
│ 🔊 ━━━━━━━━━━━━━●─── 80%            │
├──────────────────────────────────────┤
│ 📻 LATE NIGHT FREQUENCIES             │
│    with DJ VOLTAGE                    │
│                                       │
│ 👥 247 listening  📅 23:00-02:00     │
│                                       │
│ Underground techno and industrial...  │
├──────────────────────────────────────┤
│ RECENTLY PLAYED                       │
│ • Dark Energy - Voltage (5m ago)      │
│ • Industrial Complex - Hacker (12m)   │
└──────────────────────────────────────┘
```

---

### 3️⃣ **Radio Schedule** → `/radio/schedule`

**File**: `/pages/RadioScheduleNew.tsx`

**Shows**:
- Weekly grid layout
- Day-by-day show schedule
- Show cards with times
- DJ names & photos
- "LIVE NOW" indicators
- Show descriptions

**API Calls**:
```typescript
getSchedule()      // → /lib/radioking-api.ts
getCurrentShow()   // → Highlights active show
```

**Screenshot Layout**:
```
┌──────────────────────────────────────┐
│ RADIO SCHEDULE                        │
├──────────────────────────────────────┤
│                                       │
│ MONDAY                                │
│ ──────────────────────────────────   │
│ 06:00 - 09:00                         │
│ ┌─────────────────────────────────┐  │
│ │ Wake the Mess                   │  │
│ │ DJ Dominik                      │  │
│ │ Morning growl. Coffee, sweat... │  │
│ └─────────────────────────────────┘  │
│                                       │
│ 22:00 - 02:00          🔴 LIVE NOW   │
│ ┌─────────────────────────────────┐  │
│ │ Nightbody Mixes                 │  │
│ │ Various DJs                     │  │
│ │ Sweaty silhouettes in sound...  │  │
│ └─────────────────────────────────┘  │
│                                       │
│ TUESDAY                               │
│ ──────────────────────────────────   │
│ ...                                   │
└──────────────────────────────────────┘
```

---

### 4️⃣ **Show Detail Page** → `/radio/show/[slug]`

**File**: `/pages/RadioShowDetail.tsx`

**Shows**:
- Show hero banner
- Host bio & photo
- Schedule times
- Show description
- "LIVE NOW" play button (if active)
- Past episodes archive
- Related shows

**Screenshot Layout**:
```
┌──────────────────────────────────────┐
│ [Show Banner Image]                  │
├──────────────────────────────────────┤
│ 🎧 NIGHTBODY MIXES                   │
│ Sweaty silhouettes in sound form     │
│                                       │
│ 📅 Every Night, 22:00 - 02:00        │
│ 🎤 Hosted by Various DJs             │
│                                       │
│ ▶️ LIVE NOW - TUNE IN                │
├──────────────────────────────────────┤
│ ABOUT THE SHOW                        │
│ Bass-heavy, sweat-soaked beats for   │
│ the men who move. No rules, no...    │
├──────────────────────────────────────┤
│ PAST EPISODES                         │
│ • Episode #127 - Nov 30 (2h 15m)     │
│ • Episode #126 - Nov 29 (2h 30m)     │
│ • Episode #125 - Nov 28 (2h 45m)     │
└──────────────────────────────────────┘
```

---

### 5️⃣ **Episode Player** → `/radio/episode/[slug]`

**File**: `/pages/RadioEpisodePlayer.tsx`

**Shows**:
- Podcast episode playback
- Episode artwork
- Custom audio player with scrubbing
- Show notes
- Timestamps for topics
- Download button
- Share button

---

## 🎛️ GLOBAL COMPONENTS

### 🎵 **Persistent Radio Player Bar**

**File**: `/components/RadioNowPlayingBar.tsx`

**Location**: Sticky footer on ALL pages when radio is playing

**Shows**:
- Mini album artwork
- Track title + artist (scrolling text)
- Play/Pause button
- Volume slider
- Listener count badge
- Expand button

**Controls in**: `RadioContext.tsx`

**Screenshot**:
```
┌──────────────────────────────────────┐
│ 🎵 [Art] Wet Black Chrome - RAW...  │
│          ▶️  🔊 ━━━●─  👥 248  ⬆️   │
└──────────────────────────────────────┘
```

---

### 💬 **Live Chat**

**File**: `/components/radio/LiveChat.tsx`

**Used In**:
- RadioNew.tsx (main radio page)
- RadioNowPlaying.tsx (full player)

**Shows**:
- Real-time messages
- User avatars
- Timestamp
- Send message input
- Auto-scroll to latest

**Screenshot**:
```
┌──────────────────────────────────────┐
│ 💬 LIVE CHAT                    ❌   │
├──────────────────────────────────────┤
│                                       │
│ DJ VOLTAGE                            │
│ New track incoming 🔥                 │
│ 23:47                                 │
│                                       │
│ marcus_ldn                            │
│ This set is fire!!!                   │
│ 23:48                                 │
│                                       │
├──────────────────────────────────────┤
│ Type your message...           SEND   │
└──────────────────────────────────────┘
```

---

### 📊 **Live Listener Counter**

**File**: `/components/LiveListeners.tsx`

**Shows**:
- Animated counter
- Real-time updates
- Pulsing indicator
- Icons

**API**: `GET /api/radio/listeners`

**Example**: `👥 248 listening 🔴`

---

### 📈 **Radio Stats Widget**

**File**: `/components/RadioStats.tsx`

**Shows**:
- Current listeners
- Peak listeners today
- Total streams this week
- Animated bars/graphs

---

## 🔌 API & DATA LAYER

### 🌐 **Backend API Routes**

**File**: `/supabase/functions/server/radio_api.tsx`

**Endpoints**:
```
GET  /api/radio/listeners
     → Fetches RadioKing live listener data
     → Returns: { listeners, uniqueListeners, peakListeners, currentTrack, isLive }

POST /api/radio/track-listen
     → Awards XP for listening duration
     → Body: { userId, durationSeconds }
     → Returns: { success, xp, message }
```

---

### 🎵 **Last.fm Integration**

**File**: `/supabase/functions/server/lastfm_api.tsx`

**Endpoints**:
```
GET  /api/lastfm/auth/status
     → Check if Last.fm is connected

GET  /api/lastfm/auth/url
     → Get authorization URL

GET  /api/lastfm/auth/callback
     → OAuth callback handler

POST /api/lastfm/scrobble
     → Scrobble track to Last.fm
     → Body: { artist, track, album, timestamp }

GET  /api/lastfm/now-playing
     → Update now playing status

GET  /api/lastfm/recent-tracks
     → Get user's recent Last.fm tracks
```

---

### 📡 **Frontend API Client**

**File**: `/lib/radioking-api.ts`

**Functions**:
```typescript
getNowPlaying()      // Current track info
getRadioStats()      // Listener count, peak
getCurrentShow()     // Active show details
getSchedule()        // Weekly schedule
getRecentTracks()    // Track history
getStreamUrl()       // Stream URL
```

---

### 🎯 **Global Radio State**

**File**: `/contexts/RadioContext.tsx`

**Provides**:
```typescript
{
  // State
  isPlaying: boolean
  isLoading: boolean
  volume: number
  isMuted: boolean
  isMinimized: boolean
  isExpanded: boolean
  
  // Live Data
  nowPlaying: RadioTrack | null
  currentShow: RadioShow | null
  stats: RadioStats | null
  
  // Audio Control
  audioRef: RefObject<HTMLAudioElement>
  
  // Actions
  play()
  pause()
  togglePlay()
  setVolume(volume)
  toggleMute()
  minimize()
  expand()
  close()
}
```

**Usage in Components**:
```typescript
import { useRadio } from '../contexts/RadioContext';

const { isPlaying, nowPlaying, stats, play, pause } = useRadio();
```

---

## 🎨 DESIGN SYSTEM COMPONENTS

### Radio-Specific Cards

**File**: `/components/library/HMCard.tsx`

**Component**: `HMRadioShowCard`

**Props**:
```typescript
{
  name: string
  host: string
  time: string
  live: boolean
  description?: string
  image?: string
}
```

**Example**:
```tsx
<HMRadioShowCard
  name="Nightbody Mixes"
  host="Various DJs"
  time="Every Night, 22:00 - 02:00"
  live={true}
  description="Sweaty silhouettes in sound form."
/>
```

---

## 🪝 CUSTOM HOOKS

### `useRadioStatus()`

**File**: `/hooks/useRadioStatus.tsx`

**Purpose**: Polls RadioKing API for live data

**Returns**:
```typescript
{
  data: {
    listeners: number
    currentTrack: { title, artist, artwork }
    isLive: boolean
  },
  loading: boolean,
  error: Error | null
}
```

**Polling**: Every 30 seconds

---

### `useRadioXP()`

**File**: `/hooks/useRadioXP.tsx`

**Purpose**: Tracks listening time and awards XP

**Options**:
```typescript
{
  initialXP: 10,        // XP for starting stream
  extendedXP: 20,       // XP for extended listening
  extendedThresholdMinutes: 10
}
```

**Returns**:
```typescript
{
  startTracking()
  stopTracking()
  isTracking: boolean
  listenDuration: number
  xpAwarded: number
  hasAwardedInitial: boolean
  hasAwardedExtended: boolean
}
```

---

## 🎬 USER JOURNEY EXAMPLE

```
1. User visits hotmessldn.com
   ├─ Sees "Listen Live" in navigation
   └─ File: /components/Navigation.tsx

2. Clicks "Radio" nav item
   ├─ Routes to /radio
   ├─ Component: /pages/RadioNew.tsx
   └─ Sees hero with PLAY button

3. Clicks "PLAY LIVE STREAM"
   ├─ RadioContext.play() called
   ├─ Audio element starts streaming
   ├─ useRadioXP() awards +10 XP
   └─ RadioNowPlayingBar.tsx appears at bottom

4. Player bar shows current track
   ├─ Data from: useRadio().nowPlaying
   ├─ API: /api/radio/listeners
   └─ Updates every 30s via useRadioStatus()

5. User navigates to /shop
   ├─ Radio keeps playing (global context)
   └─ Player bar stays visible (sticky footer)

6. After 10 minutes
   ├─ useRadioXP() awards +20 XP
   └─ Toast: "Radio Enthusiast +20 XP"

7. User clicks player bar
   ├─ Expands to full screen
   ├─ Routes to /radio/now-playing
   └─ Component: /pages/RadioNowPlaying.tsx

8. Full player shows
   ├─ Large artwork from nowPlaying.artwork
   ├─ Volume slider
   ├─ Live chat toggle
   └─ Recently played tracks
```

---

## 📦 FILE STRUCTURE SUMMARY

```
/pages/
├─ RadioNew.tsx                  → /radio (main landing)
├─ RadioNowPlaying.tsx           → /radio/now-playing (full player)
├─ RadioScheduleNew.tsx          → /radio/schedule
├─ RadioShowDetail.tsx           → /radio/show/[slug]
└─ RadioEpisodePlayer.tsx        → /radio/episode/[slug]

/components/
├─ RadioNowPlayingBar.tsx        → Persistent footer player
├─ LiveListeners.tsx             → Live count widget
├─ RadioStats.tsx                → Stats dashboard
└─ radio/
   └─ LiveChat.tsx               → Chat component

/contexts/
└─ RadioContext.tsx              → Global radio state

/hooks/
├─ useRadioStatus.tsx            → Live data polling
└─ useRadioXP.tsx                → XP tracking

/lib/
└─ radioking-api.ts              → RadioKing API client

/supabase/functions/server/
├─ radio_api.tsx                 → Backend radio API
└─ lastfm_api.tsx                → Last.fm integration
```

---

## 🚀 QUICK REFERENCE

**Want to change the hero image?**
→ Edit `/pages/RadioNew.tsx` line 115-117

**Want to modify the player bar design?**
→ Edit `/components/RadioNowPlayingBar.tsx`

**Want to add a new show?**
→ Edit `/pages/RadioNew.tsx` `upcomingShows` array

**Want to change stream URL?**
→ Edit `/contexts/RadioContext.tsx` line 44

**Want to adjust XP rewards?**
→ Edit `/pages/RadioNew.tsx` line 30 `useRadioXP()` params

**Want to customize chat UI?**
→ Edit `/components/radio/LiveChat.tsx`

---

**Status**: ✅ All components mapped and documented  
**Pages**: 5 radio pages + global player  
**Components**: 7 specialized radio components  
**Hooks**: 2 custom radio hooks  
**APIs**: 2 backend integrations (RadioKing + Last.fm)
