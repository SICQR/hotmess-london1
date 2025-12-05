# HOTMESS HOOKUP BEACONS - SYSTEM FLOWS

Visual diagrams of all hookup beacon flows.

---

## FLOW 1: Create Room-Based Beacon

```
┌──────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                               │
└──────────────────────────────────────────────────────────────┘

User (logged in, any tier)
    │
    ├──> Navigate to /?route=hookupCreate
    │
    ├──> Choose "Room-Based Hook-Up"
    │
    ├──> Fill Form:
    │    • Name: "MEN ON THIS FLOOR TONIGHT"
    │    • City: london
    │    • Venue: Club XYZ
    │    • Zone: basement
    │    • Telegram Room ID: hotmess_london_xyz_basement
    │    • Membership: FREE/PRO/ELITE
    │
    ├──> Submit → API: POST /api/hookup/beacon/create
    │
    ├──> Backend:
    │    • Validate fields
    │    • Generate beacon ID
    │    • Save to KV store
    │    • Award +100 XP
    │    • Generate QR URL
    │
    ├──> Response:
    │    • beacon { id, name, ... }
    │    • qr_url: "https://hotmess.london/?route=hookupScan&code=..."
    │    • xp_earned: 100
    │
    └──> User gets QR code → Print → Post in venue

┌──────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                  │
└──────────────────────────────────────────────────────────────┘

Frontend                Backend (Hono)               KV Store
   │                         │                          │
   ├──────POST /create──────>│                          │
   │    { mode, name, ... }  │                          │
   │                         │                          │
   │                         ├──── Validate ────────>  │
   │                         │                          │
   │                         ├── set(beacon:ID) ──────>│
   │                         │                          │
   │                         ├── set(xp:userID) ──────>│
   │                         │                          │
   │<────── Response ────────┤                          │
   │  { beacon, qr_url }     │                          │
   │                         │                          │

```

---

## FLOW 2: Create 1:1 Beacon (PRO Feature)

```
┌──────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                               │
└──────────────────────────────────────────────────────────────┘

User (logged in, PRO/ELITE tier)
    │
    ├──> Navigate to /?route=hookupCreate
    │
    ├──> Choose "1-on-1 Connection"
    │
    ├──> Check membership:
    │    • FREE tier → Show upgrade prompt
    │    • PRO/ELITE → Continue
    │
    ├──> Fill Form:
    │    • Name: "Connect with me"
    │    • Description: "Looking to chat"
    │    • City: london
    │    • Max connections/hour: 10
    │
    ├──> Submit → API: POST /api/hookup/beacon/create
    │
    ├──> Backend:
    │    • Validate fields
    │    • Check membership tier
    │    • Generate beacon ID
    │    • Set target_user_id = current user
    │    • Save to KV store
    │    • Award +50 XP
    │    • Generate QR URL
    │
    ├──> Response:
    │    • beacon { id, name, target_user_id, ... }
    │    • qr_url: "https://hotmess.london/?route=hookupScan&code=..."
    │    • xp_earned: 50
    │
    └──> User gets QR code → Add to phone case, profile, etc.

```

---

## FLOW 3: Scan Room-Based Beacon

```
┌──────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                               │
└──────────────────────────────────────────────────────────────┘

User (any tier, can be guest)
    │
    ├──> Sees QR on club wall
    │
    ├──> Scans with phone camera
    │
    ├──> Opens: /?route=hookupScan&code=hookup_room_123
    │
    ├──> Landing Page Shows:
    │    • Beacon name & description
    │    • City, venue, zone
    │    • "Men-Only. 18+. Consent-First." notice
    │    • [ Enter Hook-Up Room ] button
    │    • [ Not Tonight / Care ] button
    │
    ├──> User taps "Enter Hook-Up Room"
    │
    ├──> API: POST /api/hookup/scan
    │    { beacon_id, consent_confirmed: false }
    │
    ├──> Backend Returns Consent Message:
    │    • requires_consent: true
    │    • consent_message: "You're entering a hook-up zone..."
    │
    ├──> UI Shows Consent Check-In:
    │    ✓ Respect boundaries and consent
    │    ✓ No screenshots without permission
    │    ✓ What happens here stays here
    │    ✓ You can leave anytime
    │    [ I Confirm ] [ Not Right Now ]
    │
    ├──> User taps "I Confirm"
    │
    ├──> API: POST /api/hookup/scan
    │    { beacon_id, consent_confirmed: true }
    │
    ├──> Backend:
    │    • Check beacon status (active)
    │    • Check time bounds
    │    • Check membership requirement
    │    • Increment beacon.total_connections
    │    • Award +15 XP (if logged in)
    │    • Return room link
    │
    ├──> Response:
    │    • mode: 'room'
    │    • room_link: "https://t.me/hotmess_london_xyz_basement"
    │    • xp_earned: 15
    │
    ├──> UI Shows Success:
    │    • "Room Unlocked!"
    │    • XP earned badge
    │    • [ Open Telegram Room ] button
    │
    └──> User taps → Opens Telegram → Joins room → Connects with men

┌──────────────────────────────────────────────────────────────┐
│                    DECISION TREE                              │
└──────────────────────────────────────────────────────────────┘

Scan Beacon
    │
    ├──> Beacon active? ───No──> "Beacon expired"
    │        │
    │       Yes
    │        │
    ├──> Time bounds OK? ──No──> "Not yet active" / "Has expired"
    │        │
    │       Yes
    │        │
    ├──> Membership OK? ───No──> "Upgrade required"
    │        │
    │       Yes
    │        │
    ├──> Consent confirmed? ─No──> Show consent check
    │        │
    │       Yes
    │        │
    └──> Open room link ✓

```

---

## FLOW 4: Scan 1:1 Beacon

```
┌──────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                               │
└──────────────────────────────────────────────────────────────┘

User (must be logged in for 1:1)
    │
    ├──> Sees QR on person's phone/profile
    │
    ├──> Scans with phone camera
    │
    ├──> Opens: /?route=hookupScan&code=hookup_1to1_123
    │
    ├──> Landing Page Shows:
    │    • "You're connecting with @username"
    │    • Target user avatar
    │    • Description
    │    • "Men-Only. 18+. Consent-First." notice
    │    • [ Start Private Chat ] button
    │    • [ Not Tonight / Care ] button
    │
    ├──> Check if logged in:
    │    • Not logged in → "Must sign in for 1:1"
    │    • Logged in → Continue
    │
    ├──> User taps "Start Private Chat"
    │
    ├──> API: POST /api/hookup/scan
    │    { beacon_id, consent_confirmed: false }
    │
    ├──> Backend Returns Consent Message:
    │    • requires_consent: true
    │    • consent_message: "You're connecting with a member..."
    │
    ├──> UI Shows Consent Check-In:
    │    ✓ I'm clear-minded and sober
    │    ✓ I've thought about what I want
    │    ✓ I'm okay to stop if it doesn't feel right
    │    ✓ I won't screenshot or share without consent
    │    [ I Confirm ] [ Actually, Not Right Now ]
    │
    ├──> User taps "I Confirm"
    │
    ├──> API: POST /api/hookup/scan
    │    { beacon_id, consent_confirmed: true }
    │
    ├──> Backend:
    │    • Check beacon status
    │    • Check rate limit (connections this hour)
    │    • Rate limit exceeded? → "Connection limit reached"
    │    • Create connection record
    │    • Increment beacon.total_connections
    │    • Update rate limit counter
    │    • Award +10 XP
    │    • [Future] Notify target user via bot
    │    • [Future] Create private thread
    │
    ├──> Response:
    │    • mode: '1to1'
    │    • connection_id
    │    • bot_message: "Connection initiated..."
    │    • next_steps: ["Both users notified", "Target can accept/decline", ...]
    │    • xp_earned: 10
    │
    ├──> UI Shows Success:
    │    • "Connection Initiated!"
    │    • XP earned badge
    │    • Next steps list
    │    • [Future] "Opening chat..." → Private thread
    │
    └──> [Future] Bot creates DM → Both users chat

┌──────────────────────────────────────────────────────────────┐
│                    RATE LIMITING                              │
└──────────────────────────────────────────────────────────────┘

hookup_rate:beaconID:YYYY-MM-DD
    │
    ├──> Get current count
    │
    ├──> Count >= max_connections_per_hour? ───Yes──> Block (429)
    │        │
    │       No
    │        │
    └──> Increment count ─> Allow connection

```

---

## FLOW 5: Manage Beacons

```
┌──────────────────────────────────────────────────────────────┐
│                    USER ACTIONS                               │
└──────────────────────────────────────────────────────────────┘

User (beacon owner)
    │
    ├──> GET /api/hookup/my-beacons
    │    Returns: [ { id, name, mode, total_scans, ... }, ... ]
    │
    ├──> View Analytics (PRO/ELITE):
    │    • GET /api/hookup/stats/:beaconId
    │    • Returns: { total_scans, total_connections, conversion_rate }
    │
    ├──> Deactivate Beacon:
    │    • DELETE /api/hookup/beacon/:beaconId
    │    • Sets status = 'inactive'
    │    • Future scans will fail
    │
    └──> Share QR:
         • Copy qr_url
         • Generate poster/sticker
         • Post physically or digitally

```

---

## FLOW 6: Bot Integration (Future)

```
┌──────────────────────────────────────────────────────────────┐
│              1:1 CONNECTION WITH BOT                          │
└──────────────────────────────────────────────────────────────┘

Scanner scans target's QR
    │
    ├──> Consent confirmed
    │
    ├──> Backend creates connection record
    │
    ├──> Bot receives webhook:
    │    • scanner_id
    │    • target_id
    │    • beacon_id
    │
    ├──> Bot sends notification to target:
    │    "🔥 @scanner wants to connect with you.
    │     View profile? [Accept] [Decline]"
    │
    ├──> Target taps [Accept]
    │
    ├──> Bot creates private thread/group:
    │    • Adds scanner + target
    │    • Pins safety message
    │    • "You're now connected. Stay safe. 🖤"
    │
    └──> Both users can now chat

┌──────────────────────────────────────────────────────────────┐
│              ROOM ANNOUNCEMENT (Future)                       │
└──────────────────────────────────────────────────────────────┘

User scans room beacon
    │
    ├──> Joins Telegram room
    │
    ├──> Bot announces (optional):
    │    "👤 A new guy just joined via HOTMESS QR.
    │     Welcome! Remember: consent first. 🖤"
    │
    └──> User sees pinned safety message

```

---

## ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HOTMESS PLATFORM                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌──────────────────┐        ┌──────────────┐
│                 │         │                  │        │              │
│   FRONTEND      │◄────────┤   BACKEND API    │◄───────┤   KV STORE   │
│   (React)       │         │   (Hono)         │        │   (Supabase) │
│                 │         │                  │        │              │
│  • HookupScan   │         │ /api/hookup/*    │        │ beacon:ID    │
│  • HookupCreate │         │                  │        │ xp:userID    │
│  • Router       │         │ • /create        │        │ membership:  │
│                 │         │ • /scan          │        │ connection:  │
│                 │         │ • /nearby        │        │ rate_limit:  │
└────────┬────────┘         │ • /my-beacons    │        │              │
         │                  │ • /stats         │        └──────────────┘
         │                  └──────────────────┘
         │
         │
         ▼
┌─────────────────┐
│                 │
│   USER'S PHONE  │
│   (Camera/QR)   │
│                 │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                             │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │
│  TELEGRAM ROOMS  │◄────────┤  TELEGRAM BOT    │
│                  │         │  (Future)        │
│  • City rooms    │         │                  │
│  • Hookup zones  │         │  • DM creation   │
│  • Private DMs   │         │  • Notifications │
│                  │         │  • Moderation    │
└──────────────────┘         └──────────────────┘

```

---

## STATE MACHINE: Beacon Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                  BEACON STATE MACHINE                         │
└──────────────────────────────────────────────────────────────┘

    CREATED
       │
       │ (active_from reached)
       ▼
    ACTIVE ──────────────────┐
       │                     │
       │ (scanned)           │ (owner deactivates)
       │                     │
       ├──> +scans           ▼
       ├──> +connections  INACTIVE
       │                     │
       │ (active_until)      │
       ▼                     │
    EXPIRED ◄────────────────┘

ACTIVE: Scans work, connections made, XP awarded
INACTIVE: Owner deactivated, scans fail
EXPIRED: Past active_until, scans fail

```

---

## ERROR HANDLING FLOW

```
┌──────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                            │
└──────────────────────────────────────────────────────────────┘

Scan Beacon
    │
    ├──> Beacon not found (404)
    │    └──> "This beacon doesn't exist or has been deleted"
    │
    ├──> Beacon inactive (400)
    │    └──> "This beacon is no longer active"
    │
    ├──> Beacon expired (400)
    │    └──> "This beacon has expired"
    │
    ├──> Membership required (403)
    │    └──> "This requires PRO membership. Upgrade?"
    │
    ├──> Rate limit exceeded (429)
    │    └──> "Connection limit reached. Try again later."
    │
    ├──> Must be logged in (401)
    │    └──> "Sign in required for 1:1 connections"
    │
    └──> Server error (500)
         └──> "Something went wrong. Please try again."

All errors:
  • Show clear message
  • Offer "Care Resources" link
  • Log to console for debugging
  • Track in analytics

```

---

## MEMBERSHIP GATES

```
┌──────────────────────────────────────────────────────────────┐
│                  FEATURE ACCESS BY TIER                       │
└──────────────────────────────────────────────────────────────┘

Feature                     FREE    PRO     ELITE
────────────────────────────────────────────────────────────────
Create room beacon           ✓       ✓       ✓
Create 1:1 beacon            ✗       ✓       ✓
Scan room beacons (2/night)  ✓       ✓       ✓
Scan room beacons (∞)        ✗       ✓       ✓
Use 1:1 QRs (5/week)         ✓       ✓       ✓
Use 1:1 QRs (∞)              ✗       ✗       ✓
View analytics               ✗       ✓       ✓
Time-bound beacons           ✗       ✗       ✓
Geo-bound beacons            ✗       ✗       ✓
Priority listing             ✗       ✗       ✓

```

---

## DATA MODEL

```
┌──────────────────────────────────────────────────────────────┐
│                     KV STORE KEYS                             │
└──────────────────────────────────────────────────────────────┘

beacon:hookup_room_1733123456_abc123
  └──> { id, type, mode, name, city, telegram_room_id, ... }

beacon:hookup_1to1_1733123456_xyz789
  └──> { id, type, mode, name, target_user_id, ... }

beacon_by_user:user_uuid:hookup_room_1733123456_abc123
  └──> { ... } (copy for easy user lookup)

hookup_connection:user1:user2:1733123456
  └──> { scanner_id, target_id, beacon_id, timestamp, status }

hookup_rate:hookup_1to1_abc123:2024-12-02
  └──> { count: 8 } (resets daily)

xp:user_uuid
  └──> { total: 1500, ... } (increment on beacon actions)

membership:user_uuid
  └──> { tier: 'pro', ... } (check for feature access)

```

---

**This completes the visual flow documentation.**

For implementation details, see:
- [HOOKUP_BEACONS.md](./HOOKUP_BEACONS.md)
- [HOOKUP_SYSTEM_SUMMARY.md](./HOOKUP_SYSTEM_SUMMARY.md)
- [HOOKUP_QUICK_START.md](./HOOKUP_QUICK_START.md)

🖤
