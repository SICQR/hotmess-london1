# BOT NETWORK DEPLOYMENT GUIDE
## HOTMESS LONDON — Complete Bot Infrastructure

**Status:** Production-ready  
**Components:** 6 Telegram bots + Supabase Edge Functions + React Dashboard  
**Last Updated:** December 2, 2024

---

## 📦 WHAT'S INCLUDED

### Backend (Supabase Edge Functions)
1. **RadioBot** — `/functions/v1/botRadio`
2. **RoomsBot** — `/functions/v1/botRooms`
3. **CareBot** — `/functions/v1/botCare`
4. **DropBot** — `/functions/v1/botDrop`
5. **TicketsBot** — `/functions/v1/botTickets`
6. **AdminBot** — `/functions/v1/botAdmin`

### Shared Modules
- `/functions/_shared/supabase.ts` — Database client
- `/functions/_shared/telegram.ts` — Message sender
- `/functions/_shared/xp.ts` — XP engine
- `/functions/_shared/rooms.ts` — Room management
- `/functions/_shared/radio.ts` — Now playing
- `/functions/_shared/tickets.ts` — Event listings
- `/functions/_shared/care.ts` — Aftercare check-ins
- `/functions/_shared/market.ts` — Drop listings
- `/functions/_shared/moderation.ts` — Report handling

### Frontend (React)
- **Bot Dashboard** — `/pages/admin/bots/BotsDashboard.tsx`
- **Bot Status Cards** — Real-time monitoring
- **Moderation Queue** — Report handling UI
- **Rooms Stats** — Live room analytics
- **XP Stats** — Leaderboard & events
- **Bot Broadcast** — Manual messaging
- **Tickets Panel** — Bot-driven sales

### Landing Pages
- **HNH MESS Landing** — `/pages/MessLanding.tsx` (route: `mess`)

### Documentation
- **Bot Scripts Master** — `/docs/BOT_SCRIPTS_MASTER.md`
- **Beacon Poster Templates** — `/docs/BEACON_POSTER_TEMPLATES.md`

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Deploy Supabase Edge Functions

```bash
# Deploy all 6 bot functions
supabase functions deploy botRadio
supabase functions deploy botRooms
supabase functions deploy botCare
supabase functions deploy botDrop
supabase functions deploy botTickets
supabase functions deploy botAdmin
```

**Verify deployment:**
```bash
supabase functions list
```

---

### Step 2: Set Environment Variables

Each bot needs access to:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your-service-role-key
BOT_RADIO_TOKEN=your-telegram-bot-token
BOT_ROOMS_TOKEN=your-telegram-bot-token
BOT_CARE_TOKEN=your-telegram-bot-token
BOT_DROP_TOKEN=your-telegram-bot-token
BOT_TICKETS_TOKEN=your-telegram-bot-token
BOT_ADMIN_TOKEN=your-telegram-bot-token
RADIOKING_NOWPLAYING_URL=your-radioking-api-url
```

**Set in Supabase:**
```bash
supabase secrets set BOT_RADIO_TOKEN=xxx
supabase secrets set BOT_ROOMS_TOKEN=xxx
# ... repeat for all bots
```

---

### Step 3: Create Telegram Bots

**For each bot:**

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot`
3. Follow prompts to name your bot
4. Save the bot token
5. Set bot commands:

```
/setcommands

RadioBot:
live - Listen to HOTMESS Radio now
handnhand - HAND N HAND show schedule
schedule - Full radio schedule

RoomsBot:
rooms - List all city rooms
join - Join a specific room

CareBot:
checkin - Check in and get support
resources - View aftercare resources

DropBot:
drops - View latest MessMarket drops
notify - Turn on drop notifications

TicketsBot:
events - View upcoming events
tickets - View your tickets

AdminBot:
modqueue - View moderation queue
reports - View all reports
```

---

### Step 4: Set Telegram Webhooks

**For each bot, set webhook to your Edge Function:**

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<PROJECT_ID>.supabase.co/functions/v1/botRadio"
```

**Replace:**
- `<BOT_TOKEN>` — Your bot's token
- `<PROJECT_ID>` — Your Supabase project ID
- `botRadio` — Function name (botRooms, botCare, etc.)

**Verify webhook:**
```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

---

### Step 5: Database Setup

**Tables needed:**

```sql
-- XP Ledger
CREATE TABLE xp_ledger (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room Members
CREATE TABLE room_members (
  id BIGSERIAL PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id BIGINT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Rooms
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  members_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aftercare Checks
CREATE TABLE aftercare_checks (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  state INT NOT NULL, -- 1=good, 2=need aftercare, 3=need resources, 4=need to talk
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bot Analytics
CREATE TABLE bot_analytics (
  id BIGSERIAL PRIMARY KEY,
  bot_name TEXT NOT NULL,
  command TEXT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Run migrations:**
```bash
supabase db push
```

---

### Step 6: Frontend Integration

The Bot Dashboard is already integrated:

- **Route:** `adminBots`
- **URL:** `https://hotmess.london/?route=adminBots`
- **Access:** Admin users only

**Features:**
- Real-time bot status monitoring
- Moderation queue with actions
- Room membership stats
- XP leaderboard & events
- Manual bot broadcasts
- Ticket sales via bots

---

### Step 7: Test All Bots

**RadioBot:**
```
/live → Should return now playing track
/handnhand → Should return show schedule
```

**RoomsBot:**
```
/rooms → Should list all rooms
/join london-aftercare → Should confirm join
```

**CareBot:**
```
/checkin → Should show 4 options
1 → Should confirm you're okay
2 → Should provide aftercare resources
```

**DropBot:**
```
/drops → Should list active drops
```

**TicketsBot:**
```
/events → Should list upcoming events
```

**AdminBot:**
```
/modqueue → Should show pending reports
```

---

### Step 8: Deploy HNH MESS Landing Page

The landing page is already integrated:

- **Route:** `mess`
- **URL:** `https://hotmess.london/?route=mess`
- **Access:** Public (after age gate)

**QR Code Target:**
```
https://hotmess.london/?route=mess
```

**Print QR codes using templates in:**
```
/docs/BEACON_POSTER_TEMPLATES.md
```

---

## 🔧 MONITORING

### Bot Health Dashboard

Access at: `https://hotmess.london/?route=adminBots`

**Monitors:**
- ✅ Bot online/offline status
- 📊 Messages handled per bot
- ⏱️ Last activity timestamp
- 📈 Uptime percentage
- 🚨 Error alerts

### Real-time Stats

- **Moderation Queue** — New reports appear instantly
- **Room Stats** — Live member counts
- **XP Events** — Real-time XP awards
- **Ticket Sales** — Bot vs web sales comparison

---

## 📊 ANALYTICS

Track via Supabase:

```sql
-- Most popular bot
SELECT bot_name, COUNT(*) as messages
FROM bot_analytics
GROUP BY bot_name
ORDER BY messages DESC;

-- Most used commands
SELECT command, COUNT(*) as uses
FROM bot_analytics
GROUP BY command
ORDER BY uses DESC;

-- Daily active users
SELECT DATE(created_at) as date, COUNT(DISTINCT user_id) as dau
FROM bot_analytics
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🐛 TROUBLESHOOTING

### Bot not responding

1. Check webhook is set correctly
2. Verify bot token in secrets
3. Check Edge Function logs
4. Test manual API call

```bash
curl "https://api.telegram.org/bot<TOKEN>/getMe"
```

### "Unauthorized" error

- Bot token is wrong
- Token not set in Supabase secrets
- Using wrong token for wrong bot

### Webhook not receiving messages

```bash
# Delete webhook
curl "https://api.telegram.org/bot<TOKEN>/deleteWebhook"

# Set webhook again
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=<YOUR_URL>"

# Verify
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

### Database connection failed

- Check `SUPABASE_SERVICE_ROLE` is set
- Verify RLS policies allow service role access
- Check database is online

### Now playing not working

- Verify `RADIOKING_NOWPLAYING_URL` is set
- Test RadioKing API directly
- Check API response format

---

## 🔐 SECURITY

### Best Practices

✅ **DO:**
- Use service role key only in Edge Functions (never frontend)
- Store all bot tokens in Supabase secrets
- Enable RLS on all tables
- Validate user input in bot handlers
- Rate limit bot commands
- Log all admin actions

❌ **DON'T:**
- Commit bot tokens to git
- Expose service role key in frontend
- Allow arbitrary SQL from bots
- Trust Telegram user IDs without verification
- Skip input validation

### RLS Policies

```sql
-- Bot analytics: Admin read only
CREATE POLICY "Admin read bot analytics"
ON bot_analytics
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- XP ledger: Service role only
CREATE POLICY "Service role manage XP"
ON xp_ledger
FOR ALL
TO service_role
USING (true);
```

---

## 📈 SCALING

### High Volume Handling

For > 10k messages/day:

1. **Enable connection pooling** in Supabase
2. **Add Redis cache** for frequently accessed data
3. **Batch database writes** (every 5 seconds)
4. **Rate limit per user** (max 10 commands/minute)
5. **Queue heavy operations** (use Supabase queue)

### Multi-City Scaling

For multiple cities:

```
/functions/botRadio-london
/functions/botRadio-berlin
/functions/botRadio-nyc
```

Or use **single bot with city routing**:
```typescript
const city = detectUserCity(userId);
const rooms = await getRoomsForCity(city);
```

---

## 🎯 NEXT STEPS

After deployment:

1. ✅ Test all 6 bots
2. ✅ Print HNH MESS QR codes
3. ✅ Deploy beacon posters
4. ✅ Train city hosts on bot commands
5. ✅ Monitor dashboard for errors
6. ✅ Set up alert notifications
7. ✅ Launch bot network to users

---

## 📞 SUPPORT

**Bot issues:** Check Edge Function logs  
**Telegram API issues:** https://core.telegram.org/bots/api  
**Supabase issues:** https://supabase.com/docs  
**Frontend issues:** Check React console

---

## 🎉 LAUNCH CHECKLIST

- [ ] All 6 bots deployed to Supabase
- [ ] All webhooks configured
- [ ] All environment variables set
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Bot Dashboard accessible
- [ ] HNH MESS landing page live
- [ ] QR codes printed and tested
- [ ] Beacon posters deployed
- [ ] Bot scripts distributed to hosts
- [ ] Test messages sent and verified
- [ ] Monitoring configured
- [ ] Error alerts enabled
- [ ] City teams trained

---

**When all checkboxes are complete, you're ready to launch the bot network!**

🐺🔥 **THE NETWORK IS LIVE. THE BOTS ARE READY. THE PLATFORM IS COMPLETE.**

---

## 📁 FILE REFERENCE

```
/functions/
  /botRadio/index.ts
  /botRooms/index.ts
  /botCare/index.ts
  /botDrop/index.ts
  /botTickets/index.ts
  /botAdmin/index.ts
  /_shared/
    supabase.ts
    telegram.ts
    xp.ts
    rooms.ts
    radio.ts
    tickets.ts
    care.ts
    market.ts
    moderation.ts

/pages/admin/bots/
  BotsDashboard.tsx
  BotStatusCard.tsx
  ModQueue.tsx
  RoomsStats.tsx
  XPStats.tsx
  BotBroadcast.tsx
  TicketsPanel.tsx

/pages/
  MessLanding.tsx

/docs/
  BOT_SCRIPTS_MASTER.md
  BEACON_POSTER_TEMPLATES.md
  BOT_NETWORK_DEPLOYMENT.md (this file)
```

---

**ALL CODE IS PRODUCTION-READY. ALL DOCS ARE COMPLETE. ALL SYSTEMS ARE GO.**

🔥 SHIP IT.
