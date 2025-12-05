# 🎧 HOTMESS - RadioKing Live Listeners Integration

## Complete implementation of real-time radio analytics

---

## 📋 OVERVIEW

This integration pulls live listener data from RadioKing API every 15 seconds and displays it across the platform:

- **Live listener counts** (floating badge)
- **Current track metadata** (title, artist, artwork)
- **Peak listener stats** (analytics)
- **XP rewards** for listening (+10 XP immediate, +20 XP after 10 min, +50 XP after 30 min)
- **Now Playing bar** (sticky bottom)
- **City OS integration** (radio pulse panel)

---

## 🔧 SETUP

### 1. Get RadioKing API Credentials

```bash
# 1. Log into RadioKing dashboard
https://www.radioking.com

# 2. Go to Settings → API
# 3. Generate API key
# 4. Note your Station ID (from URL or settings)
```

### 2. Add Environment Variables

In **Supabase Dashboard** → **Edge Functions** → **Environment Variables**:

```bash
RADIOKING_STATION_ID=736103
RADIOKING_API_KEY=rk_live_xxxxxxxxxxxxxxxxxxxxx
```

### 3. Deploy Edge Function

The Edge Function is already created at:
```
/supabase/functions/radio/listeners/index.tsx
```

Deploy with:
```bash
supabase functions deploy radio
```

### 4. Test Integration

```bash
# Test the endpoint:
curl https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/make-server-a670c824/radio/listeners \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Expected response:
{
  "listeners": 248,
  "uniqueListeners": 221,
  "peakListeners": 341,
  "currentTrack": {
    "title": "Wet Black Chrome",
    "artist": "RAW CONVICT",
    "artwork": "https://...",
    "startedAt": "2025-12-02T16:30:00Z",
    "duration": 180
  },
  "isLive": true,
  "timestamp": "2025-12-02T16:35:22Z"
}
```

---

## 🎨 UI COMPONENTS

### 1. LiveListeners Badge

**File:** `/components/LiveListeners.tsx`

Floating badge showing real-time listener count with pulse animation.

**Usage:**
```tsx
import { LiveListeners } from '../components/LiveListeners';
import { useRadioStatus } from '../hooks/useRadioStatus';

function MyPage() {
  const { data: radioStatus } = useRadioStatus();
  
  return (
    <>
      {radioStatus && radioStatus.listeners > 0 && (
        <LiveListeners 
          listeners={radioStatus.listeners} 
          position="top-right" 
        />
      )}
    </>
  );
}
```

**Props:**
- `listeners: number` - Current listener count
- `position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'` - Badge position
- `className?: string` - Additional CSS classes

---

### 2. RadioStats Panel

**File:** `/components/RadioStats.tsx`

Analytics panel showing current track, listener stats, and peak data.

**Usage:**
```tsx
import { RadioStats } from '../components/RadioStats';

<RadioStats status={radioStatus} />
```

**Features:**
- Current track with artwork
- Live/Unique/Peak listener counts
- Hover animations
- Mock data warning (when API key not set)

---

### 3. RadioNowPlayingBar

**File:** `/components/RadioNowPlayingBar.tsx`

Sticky bottom bar showing current track with play/pause controls.

**Usage:**
```tsx
import { RadioNowPlayingBar } from '../components/RadioNowPlayingBar';

<RadioNowPlayingBar 
  status={radioStatus}
  isPlaying={isPlaying}
  onTogglePlay={handleTogglePlay}
  streamUrl="https://listen.radioking.com/radio/736103/radio.mp3"
/>
```

**Features:**
- Album artwork
- Track title & artist
- Live listener count
- Play/pause button
- External link to stream

---

## 🪝 REACT HOOKS

### useRadioStatus Hook

**File:** `/hooks/useRadioStatus.ts`

Fetches RadioKing API data every 15 seconds.

**Usage:**
```tsx
import { useRadioStatus } from '../hooks/useRadioStatus';

function MyComponent() {
  const { data, loading, error, refetch } = useRadioStatus({
    refreshInterval: 15000, // milliseconds
    enabled: true,
  });

  if (loading) return <div>Loading radio status...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      {data.listeners} people listening to {data.currentTrack.title}
    </div>
  );
}
```

**Returns:**
```typescript
{
  data: RadioStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

---

### useRadioXP Hook

**File:** `/hooks/useRadioXP.ts`

Tracks listening duration and awards XP at milestones.

**Usage:**
```tsx
import { useRadioXP } from '../hooks/useRadioXP';

function RadioPlayer() {
  const { 
    listenDuration, 
    xpAwarded, 
    isTracking, 
    startTracking, 
    stopTracking 
  } = useRadioXP({
    onXPAwarded: (xp) => console.log(`+${xp} XP earned!`),
  });

  return (
    <div>
      <button onClick={isTracking ? stopTracking : startTracking}>
        {isTracking ? 'Stop' : 'Play'}
      </button>
      {isTracking && (
        <div>
          Listening: {Math.floor(listenDuration / 60)} min
          XP earned: {xpAwarded}
        </div>
      )}
    </div>
  );
}
```

**XP Milestones:**
- **0 seconds:** +10 XP (immediate)
- **10 minutes:** +20 XP
- **30 minutes:** +50 XP

---

## 📡 API ENDPOINTS

### GET /radio/listeners

Returns current radio status.

**Request:**
```bash
GET https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/make-server-a670c824/radio/listeners
Authorization: Bearer YOUR_ANON_KEY
```

**Response:**
```json
{
  "listeners": 248,
  "uniqueListeners": 221,
  "peakListeners": 341,
  "currentTrack": {
    "title": "Wet Black Chrome",
    "artist": "RAW CONVICT",
    "artwork": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600",
    "startedAt": "2025-12-02T16:30:00Z",
    "duration": 180
  },
  "isLive": true,
  "timestamp": "2025-12-02T16:35:22Z"
}
```

**Mock Data:**
If `RADIOKING_API_KEY` is not set, returns mock data with `"mock": true` flag.

---

### POST /radio/track-listen

Awards XP for listening.

**Request:**
```bash
POST https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/make-server-a670c824/radio/track-listen
Authorization: Bearer YOUR_ANON_KEY
Content-Type: application/json

{
  "userId": "user-id-123",
  "durationSeconds": 620
}
```

**Response:**
```json
{
  "success": true,
  "xp": 20,
  "message": "+20 XP for listening to RAW CONVICT RADIO"
}
```

---

## 📄 PAGE INTEGRATIONS

### Radio Page

**File:** `/pages/RadioNew.tsx`

Complete radio landing page with:
- Live listeners badge (top-right)
- Radio stats panel
- Show schedule
- Podcast archive
- Now Playing bar (sticky bottom)
- XP tracking notifications

**Key features:**
```tsx
const { data: radioStatus } = useRadioStatus();
const { startTracking, stopTracking, xpAwarded } = useRadioXP();

// Show live listeners
<LiveListeners listeners={radioStatus.listeners} position="top-right" />

// Show stats panel
<RadioStats status={radioStatus} />

// Show now playing bar
<RadioNowPlayingBar 
  status={radioStatus}
  onTogglePlay={() => {
    if (!isPlaying) startTracking();
    else stopTracking();
  }}
/>
```

---

### City OS Page

**File:** `/pages/CityOS.tsx`

City intelligence dashboard with radio pulse:

```tsx
const { data: radioStatus } = useRadioStatus();

// Live listeners badge
<LiveListeners listeners={radioStatus.listeners} position="top-right" />

// Radio pulse panel
<RadioStats status={radioStatus} />
```

Shows real-time radio activity for the city's nightlife intelligence.

---

## 🎯 BUSINESS VALUE

### User Engagement
- **Passive engagement:** Radio listening keeps users on platform longer
- **XP rewards:** Gamification incentivizes listening (10 min avg session → +20 XP)
- **Social proof:** Live listener counts validate community size

### Platform Metrics
- **Listener analytics:** Track peak times, popular shows
- **Retention:** Radio provides background engagement between club nights
- **Culture building:** RAW CONVICT Radio becomes platform identity

### Monetization Opportunities
- **Show sponsorships:** Sell ad spots during peak times
- **Elite perks:** Exclusive radio content for PRO/ELITE members
- **Affiliate deals:** Partner with music platforms, headphone brands
- **Event tie-ins:** Radio drops during venue events drive ticket sales

---

## 📊 ANALYTICS TRACKING

### Recommended Events

Track these with Posthog/Mixpanel:

```typescript
// User starts listening
analytics.track('radio_play_started', {
  listeners: radioStatus.listeners,
  track: radioStatus.currentTrack.title,
  source: 'radio_page',
});

// XP milestone reached
analytics.track('radio_xp_earned', {
  xp: 20,
  duration: 600, // 10 minutes
  milestone: '10_minutes',
});

// User leaves radio
analytics.track('radio_stopped', {
  duration: listenDuration,
  xpEarned: xpAwarded,
  track: radioStatus.currentTrack.title,
});
```

### Key Metrics
- **Average session duration** (target: 15+ min)
- **XP conversion rate** (% users who earn +20 XP)
- **Peak concurrent listeners** (track by show/time)
- **Return rate** (% users who listen multiple times/week)

---

## 🚀 ADVANCED FEATURES (Future)

### 1. Telegram Radio Bot
```
POST /telegram/webhook
Notify rooms when radio goes live
"🎧 RAW CONVICT RADIO NOW LIVE - 248 listening"
```

### 2. 3D Globe Radio Pulse
```typescript
// On Globe.jsx
const intensity = radioStatus.listeners / 500; // 0-1 scale
<mesh scale={[1 + intensity, 1 + intensity, 1 + intensity]}>
  {/* Pulsing city marker */}
</mesh>
```

### 3. Auto-DJ Schedule Posts
```
Make.com scenario:
1. GET /radio/listeners every hour
2. If peak > 300, POST to social media
3. "🔥 300+ men listening to RAW CONVICT right now"
```

### 4. Elite Radio Rooms
```typescript
// PRO/ELITE members get exclusive listening rooms
if (user.tier === 'ELITE') {
  // Show "Elite Radio Lounge" with chat
}
```

---

## 🐛 TROUBLESHOOTING

### Issue: Shows 0 listeners (but radio is live)

**Cause:** RadioKing API key not set

**Fix:**
1. Check Supabase env vars have `RADIOKING_API_KEY`
2. Restart Edge Functions
3. Check logs: `supabase functions logs radio`

---

### Issue: Mock data showing

**Cause:** `RADIOKING_API_KEY` or `RADIOKING_STATION_ID` not configured

**Fix:**
```bash
# Add to Supabase Edge Functions environment:
RADIOKING_STATION_ID=736103
RADIOKING_API_KEY=rk_live_xxxxx
```

Then redeploy:
```bash
supabase functions deploy radio
```

---

### Issue: XP not awarding

**Cause:** `useRadioXP` hook not wired to play/pause

**Fix:**
```tsx
const { startTracking, stopTracking } = useRadioXP();

<button onClick={() => {
  if (!isPlaying) {
    startTracking(); // ✅ Start tracking
    play();
  } else {
    stopTracking(); // ✅ Stop tracking
    pause();
  }
}}>
  Play/Pause
</button>
```

---

### Issue: API rate limits

**Cause:** Polling too frequently

**Fix:**
```tsx
// Increase refresh interval (default: 15s)
useRadioStatus({ refreshInterval: 30000 }); // 30 seconds
```

---

## 📝 QUICK CHECKLIST

Before going live:

- [ ] RadioKing API key added to Supabase env
- [ ] Station ID correct (`736103`)
- [ ] Edge Function deployed
- [ ] Test endpoint returns real data (not mock)
- [ ] LiveListeners badge shows on Radio page
- [ ] RadioStats panel displays correctly
- [ ] Now Playing bar appears when playing
- [ ] XP awards at 0s, 10min, 30min milestones
- [ ] Toast notifications show for XP
- [ ] City OS shows radio pulse
- [ ] Mobile responsive (test on phone)

---

## 🎉 RESULT

Your platform now has:
- ✅ Real-time listener counts
- ✅ Live track metadata
- ✅ XP gamification for listening
- ✅ Social proof (listener badges)
- ✅ Professional radio analytics
- ✅ Sticky now playing bar
- ✅ City OS integration

**Total implementation time:** ~2 hours (all code provided)

**Business impact:**
- Higher user retention (passive engagement)
- XP loop incentivizes listening
- Radio becomes platform identity
- Data for sponsorships/partnerships

---

## 📚 FILES CREATED

```
/supabase/functions/radio/listeners/index.tsx  - RadioKing API endpoint
/hooks/useRadioStatus.ts                       - Radio data hook
/hooks/useRadioXP.ts                           - XP tracking hook
/components/LiveListeners.tsx                  - Floating badge
/components/RadioStats.tsx                     - Analytics panel
/components/RadioNowPlayingBar.tsx             - Sticky bottom bar
/pages/RadioNew.tsx                            - Updated with integration
/pages/CityOS.tsx                              - Updated with radio pulse
/docs/RADIOKING_INTEGRATION.md                 - This document
```

---

**Your RAW CONVICT RADIO is now live with real-time analytics.** 🎧🔥
