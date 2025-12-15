# RIGHT NOW Unified Engine – Quick Start

**Get the complete RIGHT NOW system live in 5 minutes.**

---

## 1. Deploy Edge Function

```bash
# Navigate to your project
cd your-hotmess-repo

# Deploy the unified RIGHT NOW edge function
supabase functions deploy right-now

# Verify deployment
supabase functions list
# Should show: right-now (deployed)
```

---

## 2. Set Environment Variables (Optional Telegram)

If you want Telegram mirroring:

```bash
# Via Supabase Dashboard
# Settings → Edge Functions → Environment Variables

TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_ROOM_ID=-1001234567890
```

Or via CLI:
```bash
supabase secrets set TELEGRAM_BOT_TOKEN=your-token
supabase secrets set TELEGRAM_ROOM_ID=your-chat-id
```

---

## 3. Run Database Migrations (If Needed)

If you don't already have these tables:

```bash
# Create migration file
supabase migration new right_now_unified

# Add this SQL:
```

```sql
-- RIGHT NOW posts table
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

-- RIGHT NOW reports table
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

-- Increment report count function
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

Then push:
```bash
supabase db push
```

---

## 4. Test the API

### Test Create Endpoint

```bash
# Get your JWT token from browser (DevTools → Application → Local Storage)
# Or use supabase CLI
supabase auth login

# Create a test post
curl -X POST https://your-project.supabase.co/functions/v1/right-now/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "kind": "hookup",
    "text": "Test post from API - looking for vibes in Vauxhall",
    "city": "London",
    "expires_in_minutes": 60
  }'
```

Expected response:
```json
{
  "post": {
    "id": "uuid-here",
    "intent": "hookup",
    "text": "Test post from API...",
    "city": "London",
    "expires_at": "2024-12-10T02:00:00Z",
    "created_at": "2024-12-10T01:00:00Z"
  },
  "xp_awarded": 10,
  "ttl_minutes": 60,
  "message": "Post live. The city is watching."
}
```

### Test Feed Endpoint

```bash
curl https://your-project.supabase.co/functions/v1/right-now/feed?city=London&limit=10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected response:
```json
{
  "posts": [
    {
      "id": "uuid",
      "intent": "hookup",
      "text": "...",
      "city": "London",
      "created_at": "...",
      "expires_at": "..."
    }
  ],
  "total": 1,
  "filters": {
    "city": "London"
  }
}
```

---

## 5. Access the UI

### Option A: Globe View (Recommended)
```
https://your-app.com/right-now/globe
```

Features:
- Full 3D Mapbox globe with live posts as beacons
- Composer with intent-based char limits
- Live feed with filters
- Realtime updates
- Click beacons to scroll to posts

### Option B: Existing RIGHT NOW Shell
```
https://your-app.com/right-now
```

Uses existing `RightNowShell` component with filters and composer.

---

## 6. Verify Everything Works

### Checklist
- [ ] Edge function deployed and accessible
- [ ] Can create a post via curl/API
- [ ] Post appears in feed query
- [ ] XP awarded to user (check `xp_ledger` table)
- [ ] Analytics event logged (check `analytics_events` table)
- [ ] Heat event created (check `heat_events` table)
- [ ] Post appears on globe (if lat/lng provided)
- [ ] Can delete own post
- [ ] Can report post
- [ ] Rate limiting works (try 6 posts in 1 hour)
- [ ] Telegram mirroring works (if configured)

---

## 7. Frontend Integration

### Import and Use
```typescript
import { 
  fetchRightNowFeed, 
  createRightNowPost 
} from '@/lib/right-now';

// In your component
const { posts } = await fetchRightNowFeed({ city: 'London' });

await createRightNowPost({
  kind: 'hookup',
  text: 'Looking for bearded muscle, Soho, next 60min',
  city: 'London',
  expires_in_minutes: 60
});
```

### Add to Navigation
```typescript
// In your nav component
<Link href="/right-now/globe">
  <button>RIGHT NOW · GLOBE</button>
</Link>
```

---

## 8. Customize (Optional)

### Adjust Rate Limits
Edit `/supabase/functions/right-now/index.ts`:
```typescript
// Line ~145
if (lastHour.length >= 10) {  // Changed from 5 to 10
  return json({ error: "Rate limit: 10 posts/hour" }, 429);
}
```

### Change XP Awards
Edit `/supabase/functions/right-now/index.ts`:
```typescript
// Line ~200
const xpAmount = kind === "care" ? 20 : 15; // Increased rewards
```

### Customize Intent Emojis
Edit `/pages/RightNowGlobePage.tsx`:
```typescript
const INTENT_CONFIG: Record<RightNowIntent, {...}> = {
  hookup: { 
    icon: <YourCustomIcon />, 
    label: "YOUR LABEL",
    color: "#YOURCOLOR"
  },
  // ...
};
```

---

## 9. Monitor & Debug

### Check Logs
```bash
# Via Supabase Dashboard
# Edge Functions → right-now → Logs

# Or via CLI
supabase functions logs right-now --follow
```

### Common Issues

**"Missing auth"**
→ User not signed in. Check `supabase.auth.getSession()`

**"18+ verification required"**
→ Set `user_profiles.age_verified = true` for test user

**"Men-only space"**
→ Set `user_profiles.gender = 'man'` or `'masc'`

**Rate limit errors during testing**
→ Temporarily increase limits or wait 1 hour

**Posts not on globe**
→ Ensure `show_on_globe: true` and `lat/lng` provided

---

## 10. Go Live

```bash
# Final deployment
git add .
git commit -m "feat: RIGHT NOW unified engine deployed"
git push

# Verify production
curl https://your-production-url.com/api/right-now/feed

# Monitor analytics
# Supabase → Table Editor → analytics_events
# Filter: event_name LIKE 'right_now_%'
```

---

## Support

- **Full Docs**: `/docs/RIGHT_NOW_UNIFIED_ENGINE.md`
- **API Reference**: See edge function code
- **Design System**: `/docs/DESIGN_SYSTEM.md`
- **Troubleshooting**: See main docs

---

## Next: Add Features

Once core system is live, add:

1. **Push Notifications** – Notify users of new posts in their city
2. **Photo Uploads** – Supabase Storage integration
3. **Crowd Verification** – Auto-verify posts with ≥6 scans
4. **Premium Bumps** – Paid members can re-up expiring posts
5. **Heat Zones** – Cluster posts into hotspots on globe

See `/docs/RIGHT_NOW_UNIFIED_ENGINE.md` → Next Steps for details.

---

**You're live. The city is watching. 🔥**
