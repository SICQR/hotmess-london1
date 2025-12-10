# RIGHT NOW Unified Engine – Complete System

**HOTMESS LONDON** – Masculine nightlife OS for queer men 18+

---

## Overview

The **RIGHT NOW Unified Engine** is a complete, production-ready system that combines:

- **Single Supabase Edge Function** handling auth, rate limiting, XP, realtime broadcasts, Telegram mirroring, and analytics
- **Frontend API helper** with TypeScript types and full CRUD operations
- **Globe-integrated live feed page** with MapboxGlobe visualization
- **Safety-first architecture** with 18+/men-only gates, rate limiting, and reporting

This replaces the previous split between `right-now-create` and `right-now-feed` with one cohesive system.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (React/Vite)                                      │
│  ├─ /lib/right-now.ts          API helper                  │
│  ├─ /pages/RightNowGlobePage.tsx  Main UI + Globe          │
│  └─ /components/rightnow/*     Existing components         │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS + JWT Auth
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  EDGE FUNCTION                                              │
│  /supabase/functions/right-now/index.ts                     │
│                                                             │
│  Routes:                                                    │
│  • POST   /create      Create post + XP + Telegram         │
│  • GET    /feed        Query feed with filters             │
│  • DELETE /posts       Delete user's post                  │
│  • POST   /report      Report post for moderation          │
│                                                             │
│  Enforces:                                                  │
│  • 18+ verification (age_verified = true)                  │
│  • Men-only (gender = 'man' or 'masc')                     │
│  • Rate limits (5/hour, 20/day)                            │
│  • XP awards (10 XP per post, 15 for care)                 │
│  • Telegram mirroring (optional)                           │
│  • Analytics logging                                       │
│  • Heat event creation for globe                           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE POSTGRES                                          │
│  Tables:                                                    │
│  • right_now_posts          Main feed                      │
│  • right_now_reports        User reports                   │
│  • heat_events              Globe visualization            │
│  • analytics_events         Usage tracking                 │
│  • xp_ledger                Gamification                   │
│  • telegram_outbox          Message queue (optional)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Files Delivered

### 1. Edge Function
**`/supabase/functions/right-now/index.ts`**

Unified backend handling:
- Auth verification (JWT → user profile)
- Safety gates (18+, men-only)
- Rate limiting (5 posts/hour, 20/day via query-based check)
- Post CRUD (create, read, delete)
- XP awards via `award_xp` RPC
- Heat event creation for globe
- Realtime broadcast on `right_now:{city}` channel
- Telegram mirroring (optional, via `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ROOM_ID`)
- Analytics events logging
- Report submission

**Key Features:**
```typescript
// Routes
POST   /right-now/create     Create new RIGHT NOW post
GET    /right-now/feed       Fetch filtered feed
DELETE /right-now/posts?id=  Delete user's own post
POST   /right-now/report     Report a post

// Auth Flow
1. Extract JWT from Authorization header
2. Verify user with Supabase Auth
3. Load user_profile (age_verified, gender, membership_tier)
4. Enforce 18+ and men-only gates
5. Proceed to handler

// Rate Limiting
- Query last 24h posts for user
- Count last 1h posts
- Reject if >5/hour or >20/day
```

### 2. Frontend API Helper
**`/lib/right-now.ts`**

TypeScript-first API client:
```typescript
import { 
  fetchRightNowFeed, 
  createRightNowPost, 
  deleteRightNowPost,
  reportRightNowPost,
  subscribeToRightNowUpdates 
} from '@/lib/right-now';

// Fetch feed
const { posts, total } = await fetchRightNowFeed({
  city: 'London',
  intent: 'hookup',
  limit: 50,
  crowd_verified_only: true,
  aftercare_only: false
});

// Create post
const result = await createRightNowPost({
  kind: 'hookup',
  text: 'Looking for muscle daddy vibes, Vauxhall area, next 60min',
  city: 'London',
  lat: 51.4862,
  lng: -0.1235,
  expires_in_minutes: 60,
  show_on_globe: true,
  safe_tags: ['aftercare']
});

// Realtime updates
const unsubscribe = subscribeToRightNowUpdates('London', (post) => {
  console.log('New post:', post);
});
```

### 3. Globe-Integrated Page
**`/pages/RightNowGlobePage.tsx`**

Complete UI featuring:
- **MapboxGlobe background** showing live RIGHT NOW posts as beacons
- **Intent-based composer** with dynamic char limits (200-600)
- **Live feed** with filters (intent, city, crowd-verified, aftercare)
- **Realtime updates** via Supabase channels
- **Safety microcopy** inline
- **GlobeControls** for time window selection
- **Responsive design** following HOTMESS dark neon kink aesthetic

**Intent Types & Char Limits:**
| Intent   | Emoji | Char Limit | Use Case                          |
|----------|-------|------------|-----------------------------------|
| `hookup` | 🔥    | 200        | Hookup posts, immediate           |
| `crowd`  | 🎭    | 300        | Party vibes, crowd energy         |
| `drop`   | 💧    | 400        | Exclusive drops, releases         |
| `ticket` | 🎫    | 300        | Ticket resale, last-minute        |
| `radio`  | 📻    | 350        | Music vibes, what's playing       |
| `care`   | 💜    | 600        | Aftercare, check-ins, safety      |

---

## Environment Variables

### Required
```bash
# Supabase (already configured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...

# Telegram (optional, for mirroring)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_ROOM_ID=-1001234567890
```

### Vite Frontend
```bash
# .env or .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## Database Schema Requirements

### Core Table: `right_now_posts`
```sql
create table if not exists right_now_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  -- Content
  intent text not null check (intent in ('hookup', 'crowd', 'drop', 'ticket', 'radio', 'care')),
  text text not null,
  media_url text,
  safe_tags text[] default '{}',
  
  -- Location
  city text not null,
  country text,
  lat double precision,
  lng double precision,
  beacon_id uuid references beacons(id),
  
  -- Lifecycle
  status text not null default 'active' check (status in ('active', 'deleted', 'removed')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  
  -- Engagement
  view_count integer not null default 0,
  reply_count integer not null default 0,
  report_count integer not null default 0,
  
  -- Features
  show_on_globe boolean not null default true,
  share_to_telegram boolean not null default false,
  telegram_mirrored boolean not null default false,
  crowd_verified boolean not null default false,
  crowd_count integer,
  heat_score integer not null default 0,
  
  -- Metadata
  source text not null default 'app' check (source in ('app', 'telegram'))
);

-- Indexes
create index idx_right_now_posts_user on right_now_posts(user_id);
create index idx_right_now_posts_city on right_now_posts(city);
create index idx_right_now_posts_intent on right_now_posts(intent);
create index idx_right_now_posts_expires on right_now_posts(expires_at desc);
create index idx_right_now_posts_created on right_now_posts(created_at desc);
create index idx_right_now_posts_status on right_now_posts(status) where status = 'active';
```

### Reports Table: `right_now_reports`
```sql
create table if not exists right_now_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references right_now_posts(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'actioned', 'dismissed')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

create index idx_right_now_reports_post on right_now_reports(post_id);
create index idx_right_now_reports_status on right_now_reports(status);
```

### Heat Events Table (for Globe)
```sql
create table if not exists heat_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  city text not null,
  country text,
  lat double precision,
  lng double precision,
  source text not null check (source in ('right_now', 'scan', 'telegram', 'radio', 'drop')),
  intent text,
  crowd_count integer,
  beacon_id uuid references beacons(id),
  created_at timestamptz not null default now()
);

create index idx_heat_events_created on heat_events(created_at desc);
create index idx_heat_events_city on heat_events(city);
create index idx_heat_events_source on heat_events(source);
```

### RPC Functions Required
```sql
-- Award XP (should already exist)
create or replace function award_xp(
  p_user_id uuid,
  p_amount integer,
  p_reason text
) returns void as $$
begin
  insert into xp_ledger (user_id, amount, reason, created_at)
  values (p_user_id, p_amount, p_reason, now());
  
  -- Update user_profiles.total_xp
  update user_profiles
  set total_xp = coalesce(total_xp, 0) + p_amount
  where user_id = p_user_id;
end;
$$ language plpgsql security definer;

-- Increment report count
create or replace function increment_post_report_count(
  p_post_id uuid
) returns void as $$
begin
  update right_now_posts
  set report_count = report_count + 1
  where id = p_post_id;
end;
$$ language plpgsql security definer;
```

---

## Rate Limiting Implementation

**Current: Query-Based (Simple)**
```typescript
// Check last 24h posts
const { data: recentPosts } = await supabase
  .from("right_now_posts")
  .select("id, created_at")
  .eq("user_id", userId)
  .gte("created_at", oneDayAgo);

// Filter last hour
const lastHour = recentPosts.filter(p => p.created_at >= oneHourAgo);

// Enforce limits
if (lastHour.length >= 5) return error(429);
if (recentPosts.length >= 20) return error(429);
```

**Future: Table-Based (Scalable)**
```sql
create table if not exists right_now_rate_limits (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  window_start timestamptz not null default now(),
  posts_in_window integer not null default 0,
  window_seconds integer not null default 3600,
  constraint right_now_rate_limits_user_window_unique unique (user_id, window_start)
);
```

---

## Telegram Integration

### Setup
1. Create Telegram bot via [@BotFather](https://t.me/BotFather)
2. Get bot token: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`
3. Create private group/channel for RIGHT NOW
4. Add bot to group, make it admin
5. Get chat ID (use [getUpdates](https://core.telegram.org/bots/api#getupdates))
6. Set env vars in Supabase:
   ```bash
   TELEGRAM_BOT_TOKEN=your-token
   TELEGRAM_ROOM_ID=-1001234567890
   ```

### Message Format
```
🔥 RIGHT NOW – HOOKUP
@username in London:

Looking for muscle daddy vibes, Vauxhall area, next 60min

⏱ Expires in 60min
```

---

## Globe Heat Integration

### How RIGHT NOW Posts Appear on Globe

1. **User creates post** with `show_on_globe: true` and includes `lat/lng`
2. **Edge function creates heat_event** row with source = `right_now`
3. **MapboxGlobe component** fetches heat data and renders:
   - Post appears as **beacon pin** (color-coded by intent)
   - Contributes to **heat cluster** in that geo bin
   - Clicking beacon scrolls feed to that post

### Heat Aggregation Logic
```typescript
// When multiple RIGHT NOW posts + QR scans in same location:
// 1. Each RIGHT NOW post = +3 heat units
// 2. Each QR scan = +1 heat unit
// 3. Crowd-verified posts = +5 heat units
// Result: Party with 20 scans + 5 RIGHT NOW posts = SUPERNOVA on globe
```

---

## Safety & Moderation

### Pre-Post Gates
1. **18+ verification** (`age_verified = true` in user_profile)
2. **Men-only** (`gender IN ('man', 'masc')`)
3. **Rate limiting** (5/hour, 20/day)
4. **Content length** (3-600 chars, varies by intent)
5. **City required** (no anonymous location-less posts)

### Post-Publish Safety
1. **Report button** on every post
2. **Auto-flag** if `report_count >= 3`
3. **Admin moderation** via existing moderation queue
4. **Soft delete** preserves data for audit
5. **Panic zone detection** (optional, via `panic_incidents` table)

### Safety Microcopy (In-UI)
```
Men-only, 18+. Keep it consensual. No hate, no minors, no illegal content.
```

Displayed inline in composer, above submit button.

---

## Analytics Events Tracked

```typescript
// Post lifecycle
- right_now_post_created      { kind, city, show_on_globe }
- right_now_post_deleted       { post_id }
- right_now_post_reported      { post_id, reason }

// Engagement
- right_now_feed_viewed        { city, intent, limit }
- right_now_click_globe_cluster { post_id }
- right_now_telegram_mirrored  { post_id }
```

---

## XP Economy

| Action              | XP Awarded | Reason                  |
|---------------------|------------|-------------------------|
| Create hookup post  | +10        | `right_now_post_create` |
| Create crowd post   | +10        | `right_now_post_create` |
| Create care post    | +15        | Care-first bonus        |
| Post gets 10 views  | +5         | Engagement              |
| Crowd-verified post | +25        | Quality content         |

---

## GDPR & Data Privacy

### User Rights
1. **View all my posts**: Query `right_now_posts` by `user_id`
2. **Delete all my posts**: Soft-delete via status = `deleted`
3. **Export data**: Include in DSAR export
4. **Location consent**: Prompt before using `lat/lng`

### Data Retention
- **Active posts**: Until `expires_at` (15-240 min)
- **Deleted posts**: Retained for 30 days (audit), then hard-delete
- **Reports**: Retained for 90 days after resolution
- **Analytics events**: Aggregated after 90 days, PII removed

---

## Migration from Old System

### If you have existing `right-now-create` and `right-now-feed`:

1. **Deploy new unified function**:
   ```bash
   supabase functions deploy right-now
   ```

2. **Update frontend imports**:
   ```typescript
   // Old
   import { createPost } from '@/lib/api/rightnow';
   
   // New
   import { createRightNowPost } from '@/lib/right-now';
   ```

3. **Run schema migration** (if needed):
   ```bash
   supabase migration new right_now_unified
   # Add schema from Database Schema Requirements section
   supabase db push
   ```

4. **Deprecate old functions** (optional):
   ```bash
   # Keep for 30 days, then remove
   supabase functions delete right-now-create
   supabase functions delete right-now-feed
   ```

---

## Testing

### Local Development
```bash
# Start Supabase locally
supabase start

# Deploy function locally
supabase functions serve right-now --env-file .env.local

# Test create endpoint
curl -X POST http://localhost:54321/functions/v1/right-now/create \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "hookup",
    "text": "Test post from local dev",
    "city": "London"
  }'

# Test feed endpoint
curl http://localhost:54321/functions/v1/right-now/feed?city=London \
  -H "Authorization: Bearer YOUR_JWT"
```

### Production
```bash
# Deploy to Supabase
supabase functions deploy right-now

# Test live endpoint
curl https://your-project.supabase.co/functions/v1/right-now/feed?city=London \
  -H "Authorization: Bearer YOUR_PROD_JWT"
```

---

## Next Steps

### Immediate (Ship It)
- [x] Deploy edge function
- [x] Add frontend API helper
- [x] Create globe-integrated page
- [ ] Run schema migrations
- [ ] Test on staging
- [ ] Deploy to production

### Phase 2 (Post-Launch)
- [ ] Add Web Push notifications for new posts in user's city
- [ ] Implement crowd verification logic (≥6 scans in 30min)
- [ ] Add "Bump" feature (Premium members can re-up posts)
- [ ] Build admin moderation dashboard
- [ ] Add photo uploads (via Supabase Storage)

### Phase 3 (Scale)
- [ ] Add Redis-based rate limiting (replace query-based)
- [ ] Implement geo-fencing for location privacy
- [ ] Add "Heat Zones" clustering on globe
- [ ] Build Telegram bot for 2-way sync
- [ ] Add voice notes (Supabase Storage + transcription)

---

## Troubleshooting

### "Missing auth" Error
**Cause**: JWT not in Authorization header  
**Fix**: Ensure session exists, use `supabase.auth.getSession()`

### "18+ verification required"
**Cause**: `user_profiles.age_verified = false`  
**Fix**: Complete age verification flow, set flag to `true`

### "Men-only space"
**Cause**: `user_profiles.gender` not 'man' or 'masc'  
**Fix**: Update profile gender field

### "Rate limit: 5 posts/hour"
**Cause**: User exceeded hourly limit  
**Fix**: Wait 1 hour or adjust limits in edge function

### Posts not appearing on globe
**Cause**: Missing `lat/lng` or `show_on_globe = false`  
**Fix**: Enable location permissions, set `show_on_globe: true`

### Telegram not mirroring
**Cause**: Missing env vars or bot not admin in group  
**Fix**: 
1. Check `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ROOM_ID`
2. Make bot admin in Telegram group
3. Send test message to verify

---

## Support & Documentation

- **Main Docs**: `/docs/RIGHT_NOW_COMPLETE_SYSTEM.md`
- **API Reference**: `/docs/API_BEACONS.md`
- **Design System**: `/docs/DESIGN_SYSTEM.md`
- **Deployment**: `/docs/DEPLOYMENT.md`

---

## Credits

**Built for HOTMESS LONDON**  
Care-first masculine nightlife OS for queer men 18+

**Tech Stack**:
- Supabase (Auth, DB, Edge Functions, Realtime)
- React + Vite (Frontend)
- Mapbox GL JS (3D Globe)
- Telegram Bot API (Mirroring)
- TypeScript (Type safety)

**Architecture**: One unified edge function replacing split system  
**Safety**: 18+/men-only gates, rate limiting, reporting  
**Features**: XP, Telegram, analytics, realtime, globe heat
