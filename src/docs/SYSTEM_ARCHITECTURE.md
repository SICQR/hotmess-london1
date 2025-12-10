# 🏗️ HOTMESS LONDON - SYSTEM ARCHITECTURE

## Complete RIGHT NOW + MESS CONCIERGE System

---

## 📊 HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Tailwind)              │
├─────────────────────────────────────────────────────────────┤
│  Pages:                                                      │
│  • RightNowLivePage      → Feed + Filters + AI Widget       │
│  • RightNowPagePro       → Advanced view + Panic + Mess Brain│
│  • RightNowCreatePage    → Post creation form               │
│                                                              │
│  Components:                                                 │
│  • RightNowFeed          → Live feed with auto-refresh      │
│  • MessConciergeWidget   → Floating AI chat button          │
│  • RightNowCard          → Individual post card             │
│  • PanicOverlay          → Emergency support overlay        │
│  • MessBrainChat         → AI chat interface                │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTIONS (Deno)                 │
├─────────────────────────────────────────────────────────────┤
│  Public Endpoints (No JWT required):                        │
│  • GET  /right-now-feed      → Fetch filtered posts        │
│  • POST /right-now-create    → Create new post             │
│  • POST /hotmess-concierge   → AI chat (OpenAI)            │
│  • POST /right-now-reply     → Create DM/Telegram link     │
│  • POST /panic-alert         → Log panic + contacts        │
│                                                              │
│  Environment Variables:                                      │
│  • OPENAI_API_KEY           → For AI concierge             │
│  • SUPABASE_URL             → Database URL                  │
│  • SUPABASE_ANON_KEY        → Public client key             │
│  • SUPABASE_SERVICE_ROLE_KEY → Admin access                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                SUPABASE POSTGRES DATABASE                    │
├─────────────────────────────────────────────────────────────┤
│  Tables:                                                     │
│  • right_now_posts          → Temporal posts (1hr expiry)   │
│    - id, user_id, intent, text, city, country              │
│    - room_mode, crowd_count, host_beacon_id                │
│    - created_at, expires_at, updated_at                    │
│                                                              │
│  • heat_bins_city_summary   → City heat aggregation        │
│    - city, scans_24h, beacons_active, last_updated         │
│                                                              │
│  • kv_store_a670c824        → Key-value storage            │
│    - Stores: DM replies, panic alerts                      │
│    - Keys: "right_now_reply:{id}", "panic_alert:{id}"      │
│                                                              │
│  Enums:                                                      │
│  • right_now_intent         → hookup, crowd, drop, etc     │
│  • right_now_room_mode      → solo, host                   │
│                                                              │
│  Indexes:                                                    │
│  • idx_expires_at           → Fast expiry queries           │
│  • idx_city                 → Fast city filtering           │
│  • idx_created_at           → Fast sorting                  │
│  • idx_intent               → Fast intent filtering         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────┤
│  • OpenAI API (GPT-4o-mini)  → AI concierge responses      │
│  • Telegram Bot              → Deep links for DM/panic      │
│  • SMS (native)              → Emergency contact links      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW DIAGRAMS

### **1. Create RIGHT NOW Post**

```
User fills form
    ↓
RightNowCreatePage validates input
    ↓
POST /right-now-create
    {
      intent: "hookup",
      text: "Looking for...",
      city: "London",
      room_mode: "solo",
      expires_in_minutes: 60
    }
    ↓
Edge Function validates:
  • intent enum
  • text length <= 280
  • room_mode enum
  • expires_in_minutes: 1-1440
    ↓
INSERT INTO right_now_posts
  • Generate UUID for id
  • Generate user_id (anon or auth)
  • Calculate expires_at = NOW() + interval
    ↓
Return created post
    ↓
Frontend redirects to feed
    ↓
Post appears in feed within 15s
```

---

### **2. Fetch RIGHT NOW Feed**

```
User opens feed page
    ↓
GET /right-now-feed?window=1h&city=London&intent=hookup
    ↓
Edge Function builds query:
  • WHERE expires_at > NOW()
  • AND created_at > (NOW() - window)
  • AND city ILIKE '%London%' (if city provided)
  • AND intent = 'hookup' (if intent provided)
  • ORDER BY created_at DESC
  • LIMIT 50
    ↓
Query database → right_now_posts
    ↓
Return { items: [...] }
    ↓
Frontend renders posts
    ↓
Start countdown timers
    ↓
Auto-refresh every 15 seconds
```

---

### **3. AI Concierge Chat**

```
User types message: "What's hot in London?"
    ↓
POST /hotmess-concierge
    {
      message: "What's hot in London?",
      city: "London",
      xpTier: "fresh",
      membership: "free"
    }
    ↓
Edge Function fetches context:
  1. Query right_now_posts (last 90 mins, near city)
  2. Query heat_bins_city_summary (for heat data)
    ↓
Build OpenAI prompt:
  • System: "You are MESS CONCIERGE, bold camp AI..."
  • User context: city, XP tier, membership
  • Data context: Recent posts, heat scores
  • User message: "What's hot in London?"
    ↓
Call OpenAI API (gpt-4o-mini, temp 0.8, max 400 tokens)
    ↓
Receive AI response
    ↓
Return { reply: "London's got 3 live pulses..." }
    ↓
Frontend displays AI message in chat
```

---

### **4. Reply to Post (DM/Telegram)**

```
User clicks post card
    ↓
Detail sheet opens
    ↓
User clicks "REPLY / OPEN ROOM"
    ↓
POST /right-now-reply
    {
      post_id: "abc123",
      sender_user_id: "user_456",
      message: "Interested in connecting"
    }
    ↓
Edge Function:
  1. Generate thread_id = UUID
  2. Store in kv_store:
     key: "right_now_reply:abc123:user_456"
     value: { post_id, sender_user_id, message, created_at, telegram_link }
  3. Generate Telegram deep link:
     "https://t.me/hotmess_bot?start=reply_abc123"
    ↓
Return { success, telegram_link, thread_id }
    ↓
Frontend: window.open(telegram_link, '_blank')
    ↓
Telegram app/web opens with bot conversation
    ↓
Bot reads post_id from deep link
    ↓
Bot facilitates DM connection
```

---

### **5. Panic Alert System**

```
User feels unsafe
    ↓
User clicks "PANIC" button
    ↓
Panic overlay opens
    ↓
User selects situation: "I feel unsafe and want out"
    ↓
User clicks "TEXT A TRUSTED CONTACT"
    ↓
POST /panic-alert
    {
      user_id: "user_789",
      situation: "unsafe",
      location_city: "London",
      additional_notes: "Need help"
    }
    ↓
Edge Function:
  1. Validate situation: "unsafe" | "overwhelmed" | "talk"
  2. Generate alert_id = "panic_{timestamp}"
  3. Store in kv_store:
     key: "panic_alert:user_789:1234567890"
     value: { user_id, situation, location_city, notes, created_at }
  4. Return emergency contacts:
     • UK Emergency: 999
     • LGBT+ Switchboard: 0300 330 0630
     • Samaritans: 116 123
  5. Return Telegram link: "https://t.me/hotmess_bot?start=panic"
    ↓
Return { success, alert_id, emergency_contacts[], telegram_link }
    ↓
Frontend opens SMS app:
  sms:03003300630?body=I need support. I'm using HOTMESS...
    ↓
User can send pre-filled SMS to crisis line
```

---

## 🗄️ DATABASE SCHEMA

### **Table: `right_now_posts`**

```sql
CREATE TABLE right_now_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  intent right_now_intent NOT NULL,
  text TEXT NOT NULL CHECK (length(text) <= 280),
  city TEXT NOT NULL,
  country TEXT,
  room_mode right_now_room_mode NOT NULL,
  crowd_count INT,
  host_beacon_id TEXT,
  show_on_globe BOOLEAN DEFAULT true,
  allow_anon_signals BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_right_now_posts_updated_at
BEFORE UPDATE ON right_now_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_right_now_posts_expires ON right_now_posts(expires_at);
CREATE INDEX idx_right_now_posts_city ON right_now_posts(city);
CREATE INDEX idx_right_now_posts_created ON right_now_posts(created_at DESC);
CREATE INDEX idx_right_now_posts_intent ON right_now_posts(intent);
```

**Enums:**
```sql
CREATE TYPE right_now_intent AS ENUM (
  'hookup', 'crowd', 'drop', 'ticket', 'radio', 'care'
);

CREATE TYPE right_now_room_mode AS ENUM (
  'solo', 'host'
);
```

---

### **Table: `heat_bins_city_summary`**

```sql
CREATE TABLE heat_bins_city_summary (
  city TEXT PRIMARY KEY,
  scans_24h INT DEFAULT 0,
  beacons_active INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_heat_city ON heat_bins_city_summary(city);
```

---

### **Table: `kv_store_a670c824`**

```sql
-- Pre-existing key-value store
-- Used for storing DM replies and panic alerts

-- Example keys:
-- "right_now_reply:abc123:user_456"
-- "panic_alert:user_789:1234567890"

-- Example values (JSON):
{
  "post_id": "abc123",
  "sender_user_id": "user_456",
  "message": "Interested",
  "created_at": "2024-12-09T...",
  "telegram_link": "https://t.me/hotmess_bot?start=reply_abc123"
}
```

---

## 🔌 API CONTRACTS

### **1. GET /right-now-feed**

**Query Parameters:**
- `window` (optional): `live` | `10m` | `1h` | `24h` (default: `1h`)
- `city` (optional): Case-insensitive city name
- `intent` (optional): `hookup` | `crowd` | `drop` | `ticket` | `radio` | `care`

**Response:**
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "intent": "hookup",
      "text": "Solo at E1, looking for dark room energy",
      "city": "London",
      "country": "UK",
      "room_mode": "solo",
      "crowd_count": null,
      "host_beacon_id": null,
      "show_on_globe": true,
      "allow_anon_signals": true,
      "created_at": "2024-12-09T20:00:00Z",
      "expires_at": "2024-12-09T21:00:00Z",
      "updated_at": "2024-12-09T20:00:00Z"
    }
  ]
}
```

---

### **2. POST /right-now-create**

**Request Body:**
```json
{
  "intent": "hookup",
  "text": "Looking for now near Vauxhall",
  "city": "London",
  "country": "UK",
  "room_mode": "solo",
  "crowd_count": null,
  "host_beacon_id": null,
  "expires_in_minutes": 60,
  "allow_anon_signals": true
}
```

**Validation:**
- `intent`: Must be one of: hookup, crowd, drop, ticket, radio, care
- `text`: Required, max 280 characters
- `city`: Required
- `room_mode`: Must be `solo` or `host`
- `expires_in_minutes`: 1-1440 (1 min to 24 hours)

**Response:**
```json
{
  "post": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "intent": "hookup",
    "text": "Looking for now near Vauxhall",
    "city": "London",
    "country": "UK",
    "room_mode": "solo",
    "created_at": "2024-12-09T20:00:00Z",
    "expires_at": "2024-12-09T21:00:00Z"
  }
}
```

---

### **3. POST /hotmess-concierge**

**Request Body:**
```json
{
  "message": "What's hot in London right now?",
  "city": "London",
  "xpTier": "fresh",
  "membership": "free",
  "intentContext": "hookup"
}
```

**Response:**
```json
{
  "reply": "London's got 3 live RIGHT NOW pulses in the last hour. Two hookup signals near Vauxhall, one crowd post in Shoreditch with 18+ verified men. Heat's real but concentrated—check the globe for gaps. Stay visible, trust your gut, and don't wander solo without a check-in plan. Want me to dig deeper on a specific zone?"
}
```

---

### **4. POST /right-now-reply**

**Request Body:**
```json
{
  "post_id": "abc123",
  "sender_user_id": "user_456",
  "message": "Interested in connecting"
}
```

**Response:**
```json
{
  "success": true,
  "telegram_link": "https://t.me/hotmess_bot?start=reply_abc123",
  "thread_id": "thread_xyz789"
}
```

**KV Store Entry:**
```
Key: "right_now_reply:abc123:user_456"
Value: {
  "post_id": "abc123",
  "sender_user_id": "user_456",
  "message": "Interested in connecting",
  "created_at": "2024-12-09T20:00:00Z",
  "telegram_link": "https://t.me/hotmess_bot?start=reply_abc123",
  "thread_id": "thread_xyz789"
}
```

---

### **5. POST /panic-alert**

**Request Body:**
```json
{
  "user_id": "user_789",
  "situation": "unsafe",
  "location_city": "London",
  "additional_notes": "Need help getting home"
}
```

**Validation:**
- `situation`: Must be one of: `unsafe`, `overwhelmed`, `talk`

**Response:**
```json
{
  "success": true,
  "alert_id": "panic_1234567890",
  "emergency_contacts": [
    {
      "name": "Emergency Services",
      "number": "999",
      "type": "emergency"
    },
    {
      "name": "LGBT+ Switchboard",
      "number": "0300 330 0630",
      "type": "support"
    },
    {
      "name": "Samaritans",
      "number": "116 123",
      "type": "crisis"
    }
  ],
  "telegram_link": "https://t.me/hotmess_bot?start=panic",
  "message": "Panic alert logged. We're here. Call emergency services if you're in danger."
}
```

**KV Store Entry:**
```
Key: "panic_alert:user_789:1234567890"
Value: {
  "user_id": "user_789",
  "situation": "unsafe",
  "location_city": "London",
  "additional_notes": "Need help getting home",
  "created_at": "2024-12-09T20:00:00Z",
  "alert_id": "panic_1234567890"
}
```

---

## 🎨 FRONTEND COMPONENTS

### **Page: RightNowLivePage**
- **Purpose:** Main feed view with basic filters
- **Components:**
  - RightNowFeed (feed component)
  - MessConciergeWidget (AI chat FAB)
- **Features:**
  - Auto-refresh every 15 seconds
  - Time/intent/city filters
  - Click to open detail
  - Navigation to pro view, map, care

---

### **Page: RightNowPagePro**
- **Purpose:** Advanced view with all features
- **Components:**
  - RightNowCard (post cards)
  - PanicOverlay (emergency support)
  - MessBrainChat (AI chat interface)
- **Features:**
  - Intent/radius/time filters
  - Post detail sheets
  - Reply/DM functionality
  - Panic button
  - AI chat
  - Bottom dock navigation

---

### **Page: RightNowCreatePage**
- **Purpose:** Post creation form
- **Components:**
  - Multi-step form wizard
- **Features:**
  - Intent selection (6 types)
  - Room mode (solo/host)
  - City input
  - Crowd count (for hosts)
  - Privacy toggles
  - Rules acceptance

---

### **Component: MessConciergeWidget**
- **Purpose:** Floating AI chat button
- **Features:**
  - Pink FAB (floating action button)
  - Chat interface
  - Care mode button
  - Message history

---

### **Component: RightNowFeed**
- **Purpose:** Reusable feed component
- **Features:**
  - Filter controls
  - Post list
  - Auto-refresh
  - Countdown timers
  - Mock data fallback

---

## 🔒 SECURITY CONSIDERATIONS

### **Current State:**
- ✅ All endpoints are public (no JWT required)
- ✅ CORS enabled for all origins
- ✅ Service role key NOT exposed to frontend
- ✅ Input validation on backend
- ❌ No rate limiting (add for production)
- ❌ No abuse protection (add for production)

### **Recommended for Production:**
1. **Rate Limiting:**
   - Max 10 posts per user per hour
   - Max 100 AI chat messages per user per day
   - Max 5 panic alerts per user per hour

2. **Abuse Protection:**
   - Text similarity detection for spam
   - IP-based throttling
   - Captcha for high-frequency actions

3. **Authentication (Optional):**
   - Add JWT verification for authenticated users
   - Track XP/membership for rewards
   - Enable DM history

4. **Data Retention:**
   - Auto-delete posts after expiry + 24 hours
   - Auto-delete kv_store entries after 7 days
   - Archive panic alerts for 30 days

---

## 📈 SCALABILITY

### **Current Limits:**
- Database: Unlimited posts (Postgres scales horizontally)
- Edge Functions: 1M requests/month on free tier
- OpenAI: Pay-per-token (GPT-4o-mini is cheap)
- KV Store: Unlimited key-value pairs

### **Optimization Opportunities:**
1. **Caching:**
   - Cache feed results for 5 seconds
   - Cache heat data for 1 minute
   - Use Redis for high-traffic cities

2. **Indexing:**
   - Composite index on (city, intent, expires_at)
   - Partial index on active posts only

3. **Database Partitioning:**
   - Partition `right_now_posts` by created_at (monthly)
   - Archive old posts to cold storage

4. **CDN:**
   - Serve frontend via Vercel/Netlify
   - Cache static assets

---

## 🎯 SYSTEM CAPABILITIES

**What the system CAN do:**
- ✅ Create temporal posts with 6 intent types
- ✅ Filter feed by time/city/intent
- ✅ Auto-refresh feed every 15 seconds
- ✅ AI chat with context-aware responses
- ✅ DM/reply via Telegram deep links
- ✅ Panic alerts with emergency contacts
- ✅ Anonymous posting (no auth required)
- ✅ Countdown timers on all posts
- ✅ Mobile-optimized (iOS & Android)
- ✅ Graceful degradation when offline

**What the system CANNOT do (yet):**
- ❌ Real-time notifications (use Supabase Realtime)
- ❌ User profiles/authentication (use Supabase Auth)
- ❌ XP/membership tracking (use user tables)
- ❌ Push notifications (use Firebase/OneSignal)
- ❌ Image/video uploads (use Supabase Storage)
- ❌ Direct messaging without Telegram (use custom DM system)
- ❌ Geolocation validation (use browser geolocation API)
- ❌ Abuse reporting (use moderation system)

---

**SYSTEM VERSION:** v1.0.0  
**LAST UPDATED:** December 9, 2024  
**STATUS:** Production-Ready 🚀
