# AUTO-INTEL ENGINE — SETUP GUIDE

**Step-by-step guide to get the automated intelligence system running**

---

## ✅ PHASE 1: BACKEND (ALREADY DONE)

The backend is complete and deployed:
- ✅ Intel API with 11 endpoints
- ✅ Event normalization
- ✅ Set times processing
- ✅ Sentiment analysis
- ✅ Music drop pipeline
- ✅ City intel aggregation

**API Base:**
```
https://<YOUR_PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel
```

---

## ✅ PHASE 2: FRONTEND (ALREADY DONE)

The frontend is complete:
- ✅ 3D Globe component (`/components/Globe3D.tsx`)
- ✅ Global OS page (`/pages/GlobalOS.tsx`)
- ✅ City OS page (`/pages/CityOS.tsx`)
- ✅ Routes configured
- ✅ Router mounted

**Access:**
```
Global OS: /?route=globalOS
City OS:   /?route=cityOS&city=london
```

---

## 🚀 PHASE 3: AUTOMATION (TODO)

This is where you set up Make.com to auto-scrape and populate intel.

### Install Dependencies

```bash
npm install @react-three/fiber @react-three/drei three
```

These are needed for the 3D Globe component.

---

## 🤖 MAKE.COM SCENARIO 1: DAILY EVENTS SCRAPER

**Purpose:** Pull events from multiple sources every 6 hours

### Scenario Structure

```
┌─────────────────┐
│  Schedule       │ Every 6 hours
│  (Cron)         │
└────────┬────────┘
         │
         ├──► HTTP: Resident Advisor
         │    └──► Text Parser (events)
         │
         ├──► HTTP: Eventbrite API
         │    └──► JSON Parser
         │
         ├──► HTTP: QX Magazine RSS
         │    └──► XML Parser
         │
         └──► Aggregate Arrays
              └──► Iterator
                   └──► HTTP POST to Supabase
                        /api/intel/events/normalise
```

### Example HTTP Module (Resident Advisor)

**URL:** `https://ra.co/events/uk/london`  
**Method:** GET  
**Parse:** Extract events from HTML

**Data to Extract:**
- Event title
- Venue name
- Date
- Time
- Ticket link
- Image URL

### Example HTTP Module (Eventbrite)

**URL:** `https://www.eventbriteapi.com/v3/events/search/`  
**Method:** GET  
**Headers:**
```
Authorization: Bearer YOUR_EVENTBRITE_TOKEN
```
**Query Params:**
```
location.address: London
categories: 118 (LGBTQ+)
```

**Parse Response:**
```json
{
  "events": [
    {
      "name": { "text": "Event Title" },
      "start": { "local": "2025-12-02T22:00:00" },
      "venue": { "name": "The Factory" },
      "url": "https://..."
    }
  ]
}
```

### Save to Your API

**HTTP POST to:**
```
https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/events/normalise
```

**Headers:**
```
Authorization: Bearer <YOUR_ANON_KEY>
Content-Type: application/json
```

---

## 🤖 MAKE.COM SCENARIO 2: SET TIMES FROM INSTAGRAM

**Purpose:** Pull DJ set times from club Instagram posts every hour

### Scenario Structure

```
┌─────────────────┐
│  Schedule       │ Every 1 hour
│  (Cron)         │
└────────┬────────┘
         │
         └──► Instagram: Get Media
              │ (for tracked accounts)
              │
              └──► Iterator
                   └──► Text Parser
                        │ (extract set times)
                        │
                        └──► HTTP POST
                             /api/intel/settimes
```

### Instagram Setup

You need:
1. Instagram Business Account
2. Facebook App
3. Access Token

**API Call:**
```
GET https://graph.instagram.com/me/media
  ?fields=id,caption,timestamp
  &access_token=YOUR_ACCESS_TOKEN
```

### Parse Caption

Look for patterns:
```
"SET TIMES
22:00 - DOM TOP
00:00 - HARD SERVE
02:00 - RAW CONVICT"
```

### Save to API

**HTTP POST to:**
```
https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/settimes
```

**Body:**
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

---

## 🤖 MAKE.COM SCENARIO 3: TONIGHT'S DIGEST

**Purpose:** Send "What's On Tonight" to Telegram at 4pm daily

### Scenario Structure

```
┌─────────────────┐
│  Schedule       │ Daily at 16:00
│  (Cron)         │
└────────┬────────┘
         │
         └──► HTTP GET
              /api/intel/tonight/london
              │
              └──► Text Formatter
                   │ (build digest)
                   │
                   └──► Telegram: Send Message
                        (to General, Events, Elite rooms)
```

### Get Tonight's Data

**HTTP GET:**
```
https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/tonight/london
```

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

### Format Message

```
🔥 TONIGHT IN LONDON

• HOTMESS MAIN FLOOR @ The Factory — from £15
• UNDERGROUND @ The Vaults — Free before 11pm
• PRIDE AFTER PARTY @ Heaven — £20

Full list: hotmess.london/?route=cityOS&city=london
```

### Send to Telegram

**Telegram Bot API:**
```
POST https://api.telegram.org/bot<BOT_TOKEN>/sendMessage

Body:
{
  "chat_id": "<CHAT_ID>",
  "text": "<MESSAGE>",
  "parse_mode": "Markdown"
}
```

Send to:
- General room
- Events room
- Elite room

---

## 🤖 MAKE.COM SCENARIO 4: MUSIC DROP PROCESSOR

**Purpose:** Auto-process RAW CONVICT releases from DistroKid webhook

### Scenario Structure

```
┌─────────────────┐
│  Webhook        │ DistroKid sends new release
│  (Trigger)      │
└────────┬────────┘
         │
         └──► HTTP POST
              /api/intel/music/drop
              │
              └──► Generate QR Code
                   │
                   └──► Generate Poster
                        │
                        └──► Telegram: Post to Rooms
                             (RAW, Drops, General, Radio)
```

### DistroKid Webhook

Set up webhook in DistroKid to:
```
https://<YOUR_MAKE_WEBHOOK_URL>
```

**Payload:**
```json
{
  "track": "MAINFLOOR ANTHEM",
  "artist": "RAW CONVICT",
  "release_date": "2025-12-02",
  "artwork": "https://...",
  "spotify": "https://...",
  "soundcloud": "https://..."
}
```

### Save to API

**HTTP POST to:**
```
https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/music/drop
```

**Body:**
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

### Generate QR

Use existing hookup QR API:
```
POST /api/qr/generate
{
  "url": "https://open.spotify.com/track/..."
}
```

### Post to Telegram

Message template:
```
🔥 NEW RELEASE (RAW CONVICT)

MAINFLOOR ANTHEM

Listen now:
Spotify: <link>
SoundCloud: <link>

Scan QR to save + earn XP.

[QR CODE IMAGE]
```

---

## 🤖 MAKE.COM SCENARIO 5: SENTIMENT MONITOR

**Purpose:** Monitor Telegram room vibes every 15 minutes

### Scenario Structure

```
┌─────────────────┐
│  Schedule       │ Every 15 minutes
│  (Cron)         │
└────────┬────────┘
         │
         └──► Telegram: Get Updates
              │ (last 50 messages per room)
              │
              └──► HTTP POST
                   /api/intel/sentiment/analyze
                   │
                   └──► Router
                        │
                        ├──► If "unsafe" → Alert Hosts
                        ├──► If "positive" → Post stinger
                        └──► If "messy" → Log for review
```

### Get Messages

**Telegram Bot API:**
```
POST https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
```

Extract last 50 messages from each room you want to monitor.

### Analyze

**HTTP POST to:**
```
https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/sentiment/analyze
```

**Body:**
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
    "confidence": 0.85
  }
}
```

### Take Action

**If "unsafe":**
- Send alert to host room
- Log to moderation system
- Auto-send care resources

**If "positive":**
- Post automated stinger: "Good energy in here tonight 🖤"

---

## 🧪 TESTING THE SYSTEM

### 1. Test Backend Endpoints

```bash
# Get cities
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/cities

# Get London events
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/events/london

# Get tonight's digest
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/tonight/london

# Get full city intel
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/city/london/full
```

### 2. Test Frontend

```
Global OS: https://hotmess.london/?route=globalOS
City OS:   https://hotmess.london/?route=cityOS&city=london
```

### 3. Manually Add Test Event

```bash
# Create test event via KV store helper
curl -X POST https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/events/normalise
```

Or add directly via Supabase dashboard.

### 4. Test Sentiment Analysis

```bash
curl -X POST https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/intel/sentiment/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": "test_room",
    "room_name": "Test Room",
    "messages": ["Amazing vibes!", "Love this", "Best night ever"]
  }'
```

---

## 📊 MONITORING

### What to Watch

**Scraper Health:**
- Events scraped per day
- Parse success rate
- API errors

**User Engagement:**
- Globe interactions
- City views
- Event clicks
- Ticket conversions

**Data Quality:**
- Duplicate events
- Missing venue info
- Broken ticket links
- Outdated events

### Where to Monitor

**Supabase Dashboard:**
- Edge Function logs
- KV store inspection
- Error tracking

**Make.com Dashboard:**
- Scenario run history
- Success/failure rates
- Execution times

**Telegram:**
- Posted messages
- User engagement
- Room vibes

---

## 🔐 API KEYS NEEDED

### For Full Automation

1. **Eventbrite API Key**
   - Sign up: https://www.eventbrite.com/platform/
   - Get OAuth token

2. **Instagram Graph API**
   - Facebook Developer account
   - Instagram Business account
   - Access token

3. **OpenAI API Key** (for sentiment)
   - Sign up: https://platform.openai.com
   - Get API key
   - Add to Supabase secrets

4. **Telegram Bot Token**
   - Already have: `HOTMESS_NEW_BOT_TOKEN`

5. **Spotify API** (optional)
   - For music enrichment
   - https://developer.spotify.com

---

## 💡 QUICK WINS

### Start Simple

**Week 1:**
1. Set up Eventbrite scraper
2. Test event normalization
3. View on City OS

**Week 2:**
1. Add Tonight's Digest
2. Post to Telegram daily
3. Monitor engagement

**Week 3:**
1. Add Instagram set times
2. Test sentiment analysis
3. Launch Globe publicly

**Week 4:**
1. Add remaining scrapers
2. Full automation
3. Market the feature

---

## 🎯 SUCCESS METRICS

### Week 1 Targets
- 10+ events in database
- Globe loads successfully
- City OS shows data

### Month 1 Targets
- 500+ events scraped
- 50+ Globe interactions
- 10+ Tonight Digest sent
- 5+ PRO upgrades attributed

### Quarter 1 Targets
- 5,000+ events
- 3+ cities active
- 500+ daily active users
- Automated pipeline stable

---

## 🛟 TROUBLESHOOTING

### Globe not loading

**Check:**
- Three.js dependencies installed
- No console errors
- Browser supports WebGL

**Fix:**
```bash
npm install @react-three/fiber @react-three/drei three
```

### No events showing

**Check:**
- API endpoint returns data
- KV store has events
- City parameter correct

**Fix:**
Manually add test event via API or Supabase dashboard.

### Sentiment analysis not working

**Check:**
- Messages array not empty
- Room ID provided
- API endpoint reachable

**Fix:**
Test with simple keyword matching first, add AI later.

---

## ✅ CHECKLIST

### Before Launch

- [ ] Install Three.js dependencies
- [ ] Test Globe loads
- [ ] Test City OS loads
- [ ] Add at least 1 test event
- [ ] Verify API endpoints work
- [ ] Set up Make.com account
- [ ] Configure 1 scraper scenario
- [ ] Test Tonight's Digest
- [ ] Announce in General room
- [ ] Monitor for 24 hours

### Post-Launch

- [ ] Daily monitoring
- [ ] Weekly data quality check
- [ ] Monthly metrics review
- [ ] Expand to more cities
- [ ] Add more scrapers
- [ ] Improve sentiment AI
- [ ] Add personalization

---

## 📞 NEXT STEPS

1. **Install dependencies** (5 min)
2. **Test frontend** (10 min)
3. **Set up Make.com** (30 min)
4. **Configure first scraper** (1 hour)
5. **Launch!** 🚀

---

**Everything is built. Now just automate the data flow.** 🖤
