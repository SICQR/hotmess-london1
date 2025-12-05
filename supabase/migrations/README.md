# HOTMESS Beacon System - Production Migration

## 🎯 Overview

This migration creates the complete **production-ready beacon system** with:

- ✅ **Secure QR keys** (hashed SHA256, unguessable 256-bit random tokens)
- ✅ **Server-side XP awards** (no client-side manipulation)
- ✅ **Rate limiting** (10 scans per device per 10 minutes)
- ✅ **GPS verification** (server-side proximity checks with Haversine)
- ✅ **Idempotent scans** (one XP award per beacon per day per user)
- ✅ **Session tokens** (short-lived 15min reveal tokens)
- ✅ **Notification outbox** (reliable async notifications with dedupe)
- ✅ **RLS policies** (row-level security for all tables)
- ✅ **Creator wizard** (secure RPCs for beacon creation)
- ✅ **Audit logs** (gate logs for compliance tracking)

---

## 🚀 Installation Steps

### 1. Run the Migration

Go to **Supabase Dashboard** → **SQL Editor** → **New Query**:

```sql
-- Paste the entire contents of 001_beacon_system_complete.sql
-- Then click "Run"
```

Or use the Supabase CLI:

```bash
supabase db push
```

### 2. Set Up Cron Jobs

Go to **Supabase Dashboard** → **Database** → **Cron Jobs**:

#### Job 1: Expire Beacons
- **Name:** `expire_beacons`
- **Schedule:** `*/5 * * * *` (every 5 minutes)
- **Command:** `select public.expire_beacons();`

#### Job 2: Cleanup Scan Sessions
- **Name:** `cleanup_scan_sessions`
- **Schedule:** `*/10 * * * *` (every 10 minutes)
- **Command:** `select public.cleanup_scan_sessions();`

#### Job 3: Cleanup Rate Limits
- **Name:** `cleanup_rate_limits`
- **Schedule:** `*/15 * * * *` (every 15 minutes)
- **Command:** `select public.cleanup_rate_limits();`

### 3. Create Your First Creator Account

In **SQL Editor**, run:

```sql
-- Replace with your auth user ID
insert into public.profiles (user_id, role, age18_confirmed, consent_confirmed)
values (
  'YOUR_USER_ID_HERE'::uuid,
  'creator',
  true,
  true
);
```

### 4. Deploy Edge Functions

The beacon API routes are already in `/supabase/functions/server/beacon_api.tsx`.

Deploy with:

```bash
supabase functions deploy server
```

---

## 📋 Schema Overview

### Core Tables

#### `profiles`
- User roles (`user` | `creator` | `admin`)
- Compliance flags (age18, consent)
- Premium tier tracking

#### `beacons`
- Complete beacon metadata
- Requirements (GPS, age, premium)
- Action config (type-specific JSONB)
- XP rewards (scan vs action)

#### `beacon_qr_keys`
- **HASHED QR keys** (SHA256)
- Active/inactive status
- Rotation tracking

#### `scan_events`
- Idempotent scan logs
- Unique indexes prevent duplicates
- Device + IP hashing for privacy

#### `xp_ledger`
- Immutable XP log
- Reason tracking (scan/action/streak/bonus)
- Unique index prevents double-award

#### `scan_sessions`
- Short-lived tokens (15min TTL)
- Enable `/s/:token` reveal pages
- Auto-cleanup via cron

#### `gate_logs`
- Compliance audit trail
- Track all gate checks (AGE_18, GPS, PREMIUM, CONSENT)

#### `notification_queue`
- Outbox pattern for reliable delivery
- Dedupe keys prevent spam
- Retry logic with exponential backoff

#### `rate_limits`
- Key-based rate limiting
- Sliding window counters
- Auto-expiry

---

## 🔒 Security Features

### 1. Unguessable QR Keys
- 256-bit random tokens (32 bytes base64url)
- **Stored as SHA256 hash only**
- Even if DB is leaked, QR keys are safe

### 2. Server-Side XP
- All XP awards happen in `security definer` RPCs
- Clients **cannot** manipulate XP
- Idempotency enforced by DB unique indexes

### 3. Rate Limiting
- Prevents brute-force QR guessing
- Device-based limits (10 scans / 10 minutes)
- IP-based fallback for unidentified devices

### 4. GPS Verification
- **Server-side Haversine distance calculation**
- Never trust client "yes I'm close"
- Logs all proximity checks in `gate_logs`

### 5. RLS Policies
- Users can only read their own XP/scans
- QR keys have **no select policy** (RPC-only access)
- Creators can only manage their own beacons

---

## 🛠️ API Endpoints

All routes are prefixed with:
```
https://{PROJECT_ID}.supabase.co/functions/v1/make-server-a670c824/api/beacons
```

### POST `/redeem`
Redeem a QR scan → award XP → return session token

**Request:**
```json
{
  "qrKey": "abc123...",
  "source": "qr" // or "telegram", "map", "manual"
}
```

**Response:**
```json
{
  "sessionToken": "xyz789...",
  "xpAwarded": 10,
  "beacon": { ... }
}
```

**Errors:**
- `400` - `invalid_qr`, `beacon_inactive`, `beacon_scheduled`
- `429` - `rate_limit`
- `500` - `scan_failed`

### GET `/session/:token`
Fetch beacon reveal data from session token

**Response:**
```json
{
  "token": "xyz789...",
  "beacon": { ... }
}
```

**Errors:**
- `410` - `session_expired`
- `500` - `session_failed`

### POST `/verify-proximity`
Verify user is within GPS radius

**Request:**
```json
{
  "beaconId": "uuid",
  "lat": 51.5074,
  "lng": -0.1278
}
```

**Response:**
```json
{
  "passed": true,
  "distance": 42.5,
  "required": 200,
  "mode": "hard"
}
```

### POST `/create` (Creator Only)
Create new beacon with secure QR key

**Request:**
```json
{
  "type": "drop",
  "title": "Ministry of Sound - Free Entry",
  "description": "Skip the queue tonight",
  "durationHours": 6,
  "startsAt": "2025-11-26T20:00:00Z",
  "city": "London",
  "lat": 51.4975,
  "lng": -0.1030,
  "gpsMode": "hard",
  "gpsRadiusM": 100,
  "xpScan": 15,
  "xpAction": 50,
  "publishNow": true
}
```

**Response:**
```json
{
  "beaconId": "uuid",
  "status": "live",
  "startsAt": "2025-11-26T20:00:00Z",
  "expiresAt": "2025-11-27T02:00:00Z",
  "qrKey": "abc123..." // ⚠️ ONLY RETURNED ONCE - Store securely!
}
```

### POST `/:beaconId/rotate-qr` (Creator Only)
Rotate QR key (revoke leaked key)

**Response:**
```json
{
  "beaconId": "uuid",
  "qrKey": "new_key_abc..." // ⚠️ Store new key!
}
```

---

## 🎨 Frontend Integration

### Using the Hook

```tsx
import { useBeaconScan } from '../hooks/useBeaconScan';

function ScannerPage() {
  const { 
    redeemScan, 
    beacon, 
    xpAwarded, 
    isScanning, 
    error 
  } = useBeaconScan();

  const handleScan = async (qrKey: string) => {
    const result = await redeemScan(qrKey, 'qr');
    
    if (result) {
      console.log('Beacon revealed:', result.beacon);
      console.log('XP awarded:', result.xpAwarded);
      
      // Redirect to reveal page
      window.location.href = `/s/${result.sessionToken}`;
    }
  };

  return (
    <div>
      {/* Your QR scanner UI */}
      {isScanning && <div>Scanning...</div>}
      {error && <div className="error">{error}</div>}
      {beacon && <BeaconReveal beacon={beacon} xp={xpAwarded} />}
    </div>
  );
}
```

### Session Reveal Page

```tsx
import { useBeaconScan } from '../hooks/useBeaconScan';
import { useEffect } from 'react';

function RevealPage({ token }: { token: string }) {
  const { getSession, beacon, isLoading, error } = useBeaconScan();

  useEffect(() => {
    getSession(token);
  }, [token]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Session expired</div>;
  if (!beacon) return null;

  return (
    <div>
      <h1>{beacon.title}</h1>
      <p>{beacon.description}</p>
      <p>XP: {beacon.xp.scan} (scan) + {beacon.xp.action} (action)</p>
      {/* Rest of reveal UI */}
    </div>
  );
}
```

---

## 🔄 QR Code Flow

### Standard Flow
```
1. User scans QR with key "abc123..."
   ↓
2. Frontend calls POST /api/beacons/redeem { qrKey: "abc123..." }
   ↓
3. Server:
   - Hashes key → lookup in beacon_qr_keys
   - Logs scan in scan_events (idempotent)
   - Awards XP in xp_ledger (idempotent)
   - Creates 15min session token
   ↓
4. Returns { sessionToken: "xyz789", xpAwarded: 10, beacon: {...} }
   ↓
5. Frontend redirects to /s/xyz789
   ↓
6. Reveal page calls GET /api/beacons/session/xyz789
   ↓
7. Full beacon details rendered (title, description, CTA, etc.)
```

### GPS-Gated Flow
```
1-4. Same as above
   ↓
5. Reveal page checks beacon.requirements.gpsMode === 'hard'
   ↓
6. Request location permission
   ↓
7. Call POST /api/beacons/verify-proximity { beaconId, lat, lng }
   ↓
8. Server calculates Haversine distance
   ↓
9. If passed: show CTA
   If failed: show "too far" message with distance
```

---

## 📊 Analytics Queries

### Total XP by User
```sql
select 
  user_id,
  sum(amount) as total_xp,
  count(*) as transactions
from public.xp_ledger
where user_id = 'YOUR_USER_ID'
group by user_id;
```

### Beacon Performance
```sql
select 
  b.id,
  b.title,
  count(distinct s.user_id) as unique_scanners,
  count(*) as total_scans,
  sum(x.amount) as total_xp_awarded
from public.beacons b
left join public.scan_events s on s.beacon_id = b.id
left join public.xp_ledger x on x.beacon_id = b.id and x.reason = 'scan'
where b.created_by = 'YOUR_USER_ID'
group by b.id, b.title
order by total_scans desc;
```

### Rate Limit Violations
```sql
select 
  key,
  count,
  window_start,
  expires_at
from public.rate_limits
where count >= 10
order by window_start desc
limit 50;
```

---

## 🚨 Common Issues

### Issue: "function redeem_scan does not exist"
**Solution:** Run the migration SQL again. Make sure all functions are created.

### Issue: QR scan returns "invalid_qr"
**Solution:** 
1. Check that the QR key matches the hash in `beacon_qr_keys`
2. Verify `active = true` on the QR key
3. Try rotating the QR key and regenerating QR code

### Issue: XP not awarded
**Solution:**
1. Check `xp_ledger` for existing entry (idempotency)
2. Verify user is authenticated (guests don't get XP)
3. Check beacon status is 'live' and not expired

### Issue: "rate_limit_exceeded"
**Solution:**
1. Wait 10 minutes
2. Or manually clear rate limits: `delete from public.rate_limits where key = 'scan:DEVICE_HASH';`

---

## 🎯 Next Steps

### A. Add Type Modules
Implement specialized tables for:
- **Connect:** `connect_intents`, `connect_threads`, `connect_messages`
- **Tickets:** `ticket_listings`, `ticket_threads`, moderation
- **Content:** `content_unlocks`, view tracking
- **Drops:** `drop_waitlist`, `drop_subscriptions`

### B. Notification Worker
Create Edge Function to process `notification_queue`:
```tsx
// /supabase/functions/notify-worker/index.ts
// Process queued notifications every 1 minute
// Send via Resend (email), FCM (push), etc.
```

### C. Admin Dashboard
Build creator tools:
- Beacon analytics
- QR code generation
- Scan heatmaps
- XP leaderboards

---

## 📚 References

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Cron Jobs](https://supabase.com/docs/guides/database/cron-jobs)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
- [Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html)

---

## 🔥 Production Checklist

Before launching:

- [ ] Run migration SQL
- [ ] Set up cron jobs (expire_beacons, cleanup_scan_sessions, cleanup_rate_limits)
- [ ] Create at least one creator account
- [ ] Deploy Edge Functions
- [ ] Test QR scan flow end-to-end
- [ ] Test rate limiting (try 11 scans in 10 minutes)
- [ ] Test GPS verification with hard requirement beacon
- [ ] Set up monitoring/alerts for failed scans
- [ ] Configure notification outbox worker (if using email/push)
- [ ] Document QR key storage process for creators
- [ ] Add backup/disaster recovery plan for leaked QR keys

---

**Built with 🔥 for HOTMESS LONDON**
