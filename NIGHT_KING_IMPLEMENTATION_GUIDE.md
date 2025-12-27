# HOTMESS OS — Extended Architecture Implementation Guide

## Overview

This implementation transforms HOTMESS from a nightlife discovery app into a complete **competitive territorial operating system** with:

- **Night King System**: Users compete to "own" venues through scan activity
- **Territorial Wars**: 500 XP challenges with 2X multipliers and Telegram broadcasts
- **Passive XP Economy**: Kings earn 1 XP tax from every scan at their venues
- **Real-time Intelligence**: Admin War Room for fraud detection and platform monitoring
- **Automated Bounties**: AI-driven XP boosts for cold venues to drive foot traffic

---

## Architecture Layers

### Layer 0: OS Engine (Persistent Background)
**Files**: `lib/os-bus.ts`, `store/useHotmessStore.ts`, `sw.ts`

The OS Bus is a custom event system that syncs state across the entire platform:

```typescript
// Emit an event
OSBus.emit({ type: 'KING_CROWNED', venueId: '...', userId: '...', username: '...' });

// Subscribe to specific event types
OSBus.subscribeToType('TRACK_BPM_CHANGE', (event) => {
  console.log('New BPM:', event.bpm);
  // Update globe building vibrations
});
```

**Zustand Global Store** manages:
- User profile & authentication
- XP queue with animations
- Radio BPM sync
- Night King territorial data
- Globe state (selected beacon, hover states)

**Service Worker** provides:
- Offline beacon scan queue (syncs when back online)
- Mapbox tile caching (30 days)
- Background XP ledger sync

---

### Layer 1: Night King System

#### Database Schema
**Migration**: `supabase/migrations/120_night_king_system.sql`

**New Columns on `beacons` table:**
- `king_user_id` — Current ruler
- `king_since` — Coronation timestamp
- `weekly_scan_count` — Scans in last 7 days
- `bounty_multiplier` — XP multiplier (1.0 normal, 2.0 during war, 5.0 for bounties)

**New Tables:**
- `king_royalties` — Passive XP ledger (tax collection)
- `beacon_wars` — Active and historical territorial conflicts

#### Key Functions

**1. Crown Night Kings (Weekly Cron)**
```sql
SELECT crown_night_kings();
-- Runs every Monday at 4 AM
-- Awards kingship to user with most scans in last 7 days per venue
```

**2. Passive XP Tax (Automatic Trigger)**
```sql
-- Trigger: award_king_tax()
-- Fires on every beacon scan
-- Awards 1 XP to the king if someone else scans their venue
```

**3. Declare War (500 XP Cost)**
```sql
SELECT declare_beacon_war('beacon-uuid', 'challenger-uuid');
-- Burns 500 XP from challenger
-- Creates war record (24 hour duration)
-- Sets venue multiplier to 2.0
-- Returns war_id for Telegram broadcast
```

#### Frontend Components

**Night King Dashboard**: `pages/NightKingDashboard.tsx`
- Real-time royalty feed (Supabase subscriptions)
- Empire overview (venues owned, passive XP flow)
- Threat detection (active wars)
- Venue integrity monitoring

**Usage:**
```tsx
import { NightKingDashboard } from './pages/NightKingDashboard';

// Add to router
<Route path="/king" element={<NightKingDashboard />} />
```

---

### Layer 2: War Declaration System

**Edge Function**: `supabase/functions/os-war/index.ts`

**Deployment:**
```bash
supabase functions deploy os-war --no-verify-jwt
```

**Environment Variables Required:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `HOTMESS_BOT_TOKEN` (Telegram)
- `COMMUNITY_CHAT_ID` (Telegram)

**API Call from Frontend:**
```typescript
const response = await fetch(`${SUPABASE_URL}/functions/v1/os-war`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    beacon_id: 'venue-uuid',
    challenger_id: user.id
  })
});

if (response.ok) {
  const { war_id, multiplier } = await response.json();
  // War declared! 2X XP active for 24 hours
}
```

**Telegram Broadcast Message:**
```
⚔️ **TERRITORIAL WAR DECLARED** ⚔️

🔥 **@Challenger** has challenged **@King** for the crown of **Venue Name**!

⚡️ **THE STAKES:** All scans at this venue count for **2X XP** for the next 24 hours.

📍 Head to the venue and pulse now to defend or conquer.
🔗 [hotmessldn.com/pulse](https://hotmessldn.com/pulse)
```

---

### Layer 3: Globe Visualization

**Night King Visuals**: `lib/night-king-visuals.ts`

**Golden King Beacons:**
- Gold color (#FFD700) for crowned venues
- Pulsing aura ring around king-owned venues
- Multiplier text sprite (2X, 5X, etc.)
- Red pulsing sphere for venues under attack

**Building BPM Sync:**
```typescript
import { syncBuildingsWithBPM } from './lib/night-king-visuals';

// In render loop
const bpm = useHotmessStore(state => state.currentBPM);
syncBuildingsWithBPM(scene, bpm, time);
// Buildings vibrate height at 128bpm (or current track BPM)
```

**Integration with UnifiedGlobe:**
```typescript
import { createKingBeacon, animateKingBeacons } from './lib/night-king-visuals';

// When creating beacon markers
beacons.forEach(beacon => {
  if (beacon.kingData) {
    const kingMarker = createKingBeacon(position, {
      hasKing: true,
      kingUsername: beacon.kingData.username,
      isUnderAttack: beacon.activeWar,
      bountyMultiplier: beacon.bountyMultiplier
    });
    scene.add(kingMarker);
  }
});

// In animation loop
animateKingBeacons(markersGroup, deltaTime);
```

---

### Layer 4: Admin War Room

**Pulse Monitor**: `components/admin/PulseMonitor.tsx`

Real-time surveillance dashboard showing:
- Live activity feed (all scans, listens, purchases)
- Daily stats (scans, listens, purchases, XP awarded)
- Ghost XP detection (suspicious activity patterns)

**SQL Functions**: `supabase/migrations/121_admin_war_room_functions.sql`

**1. Detect Suspicious Activity**
```sql
SELECT * FROM detect_suspicious_activity();
-- Returns users with high suspicious scores
-- Checks: scan frequency, beacon diversity, rapid XP gain
```

**2. Platform Stats**
```sql
SELECT * FROM get_platform_stats('today');
-- Returns: total users, active users, scans, XP, purchases, wars, kings
```

**3. User Risk Profile**
```sql
SELECT * FROM get_user_risk_profile('user-uuid');
-- Detailed fraud analysis for specific user
```

---

### Layer 5: Automated Bounty System

**Pulse Bounties Engine**: `lib/pulse-bounties.ts`

**How it works:**
1. **Hourly scan** of all venue activity
2. **Identifies "cold" venues** (< 50% of historical average scans)
3. **Boosts XP multiplier** to 5.0 and increases base reward to 500 XP
4. **Sends Telegram notifications** to users within 2km
5. **Auto-resets** when venue becomes "hot" again

**Usage:**
```typescript
import { pulseBountiesEngine } from './lib/pulse-bounties';

// Start the engine (in App.tsx or main entry point)
useEffect(() => {
  pulseBountiesEngine.start();
  return () => pulseBountiesEngine.stop();
}, []);
```

**SQL Support Function:**
```sql
-- Add to migrations
SELECT * FROM get_venue_activity(24); -- Last 24 hours
-- Returns: beacon_id, title, recent_scans, historical_average
```

---

## End-to-End Workflows

### Flow A: Night King Coronation
1. **Weekly Cron** (Monday 4 AM): `SELECT crown_night_kings();`
2. **SQL Logic**: Counts scans per user per venue over last 7 days
3. **Winner**: User with most scans at each venue becomes king
4. **Database Update**: `king_user_id`, `king_since`, `weekly_scan_count`
5. **OS Event**: `OSBus.emit({ type: 'KING_CROWNED', ... })`
6. **Visual Update**: Globe shows golden beacon with aura
7. **Dashboard**: User sees their empire in Night King Dashboard

### Flow B: Territorial War
1. **User Action**: Clicks "CHALLENGE STATUS" on king-owned venue
2. **Frontend**: Confirms 500 XP cost with modal
3. **API Call**: `POST /functions/v1/os-war`
4. **Edge Function**:
   - Executes `declare_beacon_war()` RPC
   - Burns 500 XP from challenger
   - Creates war record (24h duration)
   - Sets `bounty_multiplier = 2.0`
   - Fetches user details for broadcast
5. **Telegram**: Sends war announcement to community chat
6. **Globe Update**: Venue shows red pulsing indicator
7. **24 Hours Later**: Cron resolves war, crowns winner

### Flow C: Passive XP Tax Collection
1. **User Scans**: Regular user scans QR at king-owned venue
2. **XP Award**: User receives base XP (100) × multiplier
3. **Trigger**: `award_king_tax()` fires automatically
4. **Tax Logic**:
   - Checks if venue has a king
   - Checks king != scanner
   - Awards 1 XP to king
   - Records in `king_royalties` table
5. **Real-time Update**: King's dashboard shows "+1 XP ROYALTY" instantly
6. **OS Event**: `OSBus.emit({ type: 'KING_TAX_COLLECTED', ... })`

### Flow D: Automated Bounty Activation
1. **Hourly Check**: Pulse Bounties Engine wakes up
2. **SQL Query**: `SELECT * FROM get_venue_activity(24);`
3. **Analysis**: Venue X has 5 recent scans vs 30 historical average
4. **Action**: Updates venue:
   - `bounty_multiplier = 5.0`
   - `xp_reward = 500`
5. **Notification**: Telegram ping to users within 2km
6. **Globe**: Venue shows large "5X" multiplier badge
7. **First Scan**: User earns 500 × 5 = 2,500 XP
8. **Auto-reset**: After target met, returns to 1.0 multiplier

---

## Event Types Reference

### OS Bus Events

```typescript
// XP & Rewards
{ type: 'XP_EARNED', amount: 500, reason: 'beacon_scan', userId: '...' }
{ type: 'LEVEL_UP', newLevel: 10, userId: '...' }

// Radio & Audio
{ type: 'TRACK_BPM_CHANGE', bpm: 128, trackId: '...' }
{ type: 'AUDIO_DROP_SPAWNED', beaconId: '...', trackId: '...', bpm: 128 }

// Beacons & Globe
{ type: 'BEACON_SCANNED', beaconId: '...', userId: '...', xpAwarded: 100 }
{ type: 'BEACON_SPAWNED', beaconId: '...', type: 'reward', lat: 51.5, lng: -0.1 }

// Night King System
{ type: 'KING_CROWNED', venueId: '...', userId: '...', username: '...' }
{ type: 'KING_DETHRONED', venueId: '...', formerKingId: '...', newKingId: '...' }
{ type: 'WAR_STARTED', venueId: '...', challengerId: '...', defenderId: '...' }
{ type: 'WAR_ENDED', venueId: '...', winnerId: '...' }
{ type: 'KING_TAX_COLLECTED', kingId: '...', amount: 1, venueId: '...' }

// Commerce
{ type: 'PURCHASE_COMPLETE', orderId: '...', userId: '...', amount: 2000 }
{ type: 'SONIC_KEY_BOUGHT', trackId: '...', userId: '...', beaconSpawned: true }
```

---

## Security & RLS Policies

All new tables have Row Level Security enabled:

**king_royalties:**
- `SELECT`: Public (anyone can view for transparency)
- `INSERT`: System only (via trigger)

**beacon_wars:**
- `SELECT`: Public (anyone can see active wars)
- `INSERT`: Authenticated users only (via RPC)

**beacons table updates:**
- King columns updated by system functions only
- Users cannot manually set themselves as kings

---

## Testing Checklist

### Manual Testing
- [ ] Create test users and scan venues to accumulate XP
- [ ] Verify weekly coronation (or run `SELECT crown_night_kings();` manually)
- [ ] Check Night King Dashboard shows correct venues and royalties
- [ ] Test war declaration (ensure 500 XP is deducted)
- [ ] Verify 2X multiplier during wars
- [ ] Test Telegram broadcast (requires bot setup)
- [ ] Check passive XP tax (scan venue owned by another user)
- [ ] Verify Admin War Room shows real-time activity
- [ ] Test suspicious activity detection with rapid scans

### Integration Tests
```typescript
// TODO: Add to test suite
describe('Night King System', () => {
  it('should crown the user with most scans', async () => {
    // Create test beacons and scans
    // Run coronation function
    // Verify king_user_id is set correctly
  });

  it('should collect passive XP tax', async () => {
    // Scan beacon owned by another user
    // Check king's XP increased by 1
    // Verify entry in king_royalties table
  });

  it('should handle war declaration', async () => {
    // User with >500 XP declares war
    // Verify XP deducted
    // Check beacon_wars record created
    // Confirm multiplier set to 2.0
  });
});
```

---

## Deployment

### 1. Database Migrations
```bash
# Apply migrations in order
supabase migration up 120_night_king_system
supabase migration up 121_admin_war_room_functions
```

### 2. Edge Functions
```bash
supabase functions deploy os-war --no-verify-jwt
```

### 3. Environment Variables
Add to Supabase dashboard:
- `HOTMESS_BOT_TOKEN` - Telegram bot token
- `COMMUNITY_CHAT_ID` - Telegram chat ID for broadcasts

### 4. Cron Jobs
If pg_cron is enabled:
```sql
SELECT cron.schedule('weekly-coronation', '0 4 * * 1', $$ SELECT crown_night_kings(); $$);
SELECT cron.schedule('resolve-wars', '0 * * * *', $$ SELECT resolve_expired_wars(); $$);
```

Otherwise, set up external cron (GitHub Actions, Vercel Cron, etc.)

---

## Performance Considerations

- **Indexes**: All foreign keys and frequently queried columns indexed
- **Views**: `night_king_stats` view pre-aggregates data for dashboard
- **Caching**: Service worker caches Mapbox tiles and beacon data
- **Real-time**: Supabase subscriptions only on critical tables
- **Pagination**: All admin queries limited to reasonable page sizes

---

## Business Value

### User Retention
- **Passive Income**: Kings log in daily to watch tax roll in
- **Competitive Tension**: Wars create urgency and tribal loyalty
- **Territory Defense**: Users recruit friends to defend their crown

### Revenue
- **XP Sinks**: 500 XP war cost creates demand for XP packages
- **Venue Promotion**: Clubs pay for "War Sponsor" spots
- **Radio Integration**: Wars trigger special broadcast hours

### Data Intelligence
- **Foot Traffic**: Precise venue visit patterns
- **Social Graphs**: War participants reveal friend networks
- **High-Value Users**: Kings are top 1% of engaged users

---

## Future Enhancements

- [ ] **Squad System**: Teams of 5-10 users can pool scans
- [ ] **King Perks**: Special merch drops, backstage access
- [ ] **Territory Expansion**: Multi-venue empires with capital cities
- [ ] **War Leagues**: Monthly tournaments with prize pools
- [ ] **AI Predictions**: ML model predicts next king based on patterns
- [ ] **NFT Crowns**: Blockchain-backed proof of kingship

---

## Support

For questions or issues:
- GitHub Issues: [SICQR/hotmess-london1](https://github.com/SICQR/hotmess-london1/issues)
- Email: support@hotmessldn.com
