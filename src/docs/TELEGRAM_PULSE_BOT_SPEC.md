# 🤖 TELEGRAM PULSE BOT — COMPLETE SPECIFICATION

**Bot Name:** `@HotmessPulseBot`  
**Purpose:** Wire Telegram supergroups + private chats into the RIGHT NOW system  
**Scope:** Men-only, 18+, nightlife OS integration  
**Date:** December 9, 2025

---

## 🎯 **CORE CONCEPT**

The Pulse Bot makes Telegram groups **part of the same real-time system** as the HOTMESS app:

- **Users** can post RIGHT NOW pulses from Telegram → appear in app feed + globe heat
- **Groups** can be linked to venues/cities → crowd scans build verified heat
- **Panic** works in DMs → creates incidents in Admin War Room
- **Mess Brain** answers safety questions → same AI, different interface

**This is NOT a separate product. It's the same nightlife OS, different door.**

---

## 🔗 **ARCHITECTURE**

### Data Model:
```sql
-- Link Telegram users to HOTMESS accounts
telegram_links (
  id UUID PRIMARY KEY,
  telegram_user_id TEXT UNIQUE,      -- Telegram user ID
  hotmess_user_id UUID REFERENCES users(id),
  linked_at TIMESTAMP,
  active BOOLEAN DEFAULT true
)

-- Link Telegram groups to venues/cities
telegram_groups (
  id UUID PRIMARY KEY,
  telegram_chat_id TEXT UNIQUE,      -- Telegram group ID
  hotmess_venue_id UUID REFERENCES venues(id),  -- Optional: specific venue
  city TEXT NOT NULL,
  country TEXT,
  beacon_id UUID REFERENCES beacons(id),  -- Optional: host QR
  linked_at TIMESTAMP,
  active BOOLEAN DEFAULT true
)

-- Track Telegram-sourced RIGHT NOW posts
rightnow_posts (
  ...existing fields...
  source TEXT,                       -- 'web' | 'telegram' | 'api'
  telegram_chat_id TEXT,             -- If posted from group
  telegram_user_id TEXT,             -- If posted from DM
  mirrored_to_telegram BOOLEAN DEFAULT false
)
```

### Bot Stack:
- **Framework:** `grammy` (modern Telegram bot framework for Deno/Node)
- **Hosted:** Supabase Edge Function (same as your web server)
- **Endpoint:** `https://{projectId}.supabase.co/functions/v1/telegram-bot`
- **Webhook:** Telegram → your Edge Function → Supabase DB + KV

---

## 📋 **COMMANDS**

### 1. `/link` — Link Account or Group

**Scope:** Private chat (user) OR group chat (admin only)

#### **Private Chat Flow:**
1. User: `/link`
2. Bot:
   ```
   🔗 LINK YOUR HOTMESS ACCOUNT
   
   Tap the button below to connect this Telegram to your HOTMESS profile.
   
   You'll be able to:
   • Post RIGHT NOW pulses from Telegram
   • Get heat + safety updates
   • Use panic in DMs
   
   [Connect HOTMESS Account]
   ```
3. Button opens deep link: `https://hotmess.lgbt/telegram/link?token={jwt_token}`
4. User logs into HOTMESS web (if not already)
5. HOTMESS backend:
   - Verifies JWT
   - Creates `telegram_links` record
   - Returns success
6. Bot sends confirmation:
   ```
   ✅ LINKED
   
   Your Telegram is now wired to HOTMESS.
   
   Try:
   /pulse — Post RIGHT NOW
   /heat — Ask about city safety
   /panic — Emergency help (DM only)
   ```

#### **Group Chat Flow (Admin Only):**
1. Admin: `/link`
2. Bot (only visible to admin):
   ```
   🔗 LINK THIS GROUP TO A VENUE
   
   Paste your venue/host QR code or beacon ID.
   
   This lets:
   • Group members post RIGHT NOW pulses
   • QR scans at your party build heat on the globe
   • City-specific safety alerts
   
   Reply with your beacon code or QR:
   ```
3. Admin replies with beacon code (e.g., `BEACON_abc123xyz`)
4. Bot:
   - Validates beacon exists
   - Creates `telegram_groups` record
   - Sends confirmation:
   ```
   ✅ GROUP LINKED
   
   This room is now tied to:
   📍 Venue Name · London
   
   Members can use:
   /pulse — Post RIGHT NOW
   /hostqr — Update host QR
   ```

---

### 2. `/pulse` — Create RIGHT NOW Post

**Scope:** Private chat OR group chat (linked users only)

#### **Flow (Conversational):**

**Step 1: Trigger**
```
User: /pulse
```

**Step 2: Intent Selection**
```
Bot: 
🔴 RIGHT NOW PULSE

What kind of signal is this?

[Hookup / Play]    [Crowd / Party]
[Drop / Offer]     [Ticket / Event]
[Radio / Listen]   [Care / Support]
```

**Step 3: User taps button → saves intent**

**Step 4: Message Input**
```
Bot:
Type your message (max 240 characters).

Remember:
• Men-only, 18+
• No minors, no hate, no outing
• Say what you want, where you are
```

**Step 5: User sends text**

**Step 6: City Detection**
```
Bot:
Which city are you in right now?

[Use Profile City: London]
[Enter Different City]
```

If user taps "Enter Different City":
```
Bot: Type the city name:
User: Berlin
```

**Step 7: Visibility Options**
```
Bot:
📊 VISIBILITY

[✓ Show on Globe]       (Heat map)
[✓ Share to Telegram]   (This chat)
[✓ Allow Mess Brain]    (Safety AI)

Tap to toggle. Then:
[Send Pulse]
```

**Step 8: Backend Processing**
```typescript
// Bot calls Edge Function
POST /functions/v1/make-server-a670c824/right-now/create
{
  "intent": "hookup",
  "text": "Solo at E1, looking for dark room energy",
  "city": "London",
  "country": "UK",
  "source": "telegram",
  "telegram_user_id": "123456789",
  "telegram_chat_id": null,  // If from DM
  "showOnGlobe": true,
  "shareToTelegram": true,
  "allowAnonSignals": true
}
```

**Step 9: Confirmation**
```
Bot:
✅ PULSE SENT

Your signal is live on HOTMESS for ~60 mins.

🌍 Visible on globe: YES
📱 Shared to Telegram: YES
🧠 Mess Brain can use: YES

View on HOTMESS: [Open App]
```

**Step 10: If `shareToTelegram = true` AND in group:**
```
[Bot posts in group:]

🔴 RIGHT NOW · HOOKUP
"Solo at E1, looking for dark room energy"

📍 London · expires in ~60 mins

[View on HOTMESS]  [Report]
```

---

### 3. `/hostqr` — Update Host QR/Beacon

**Scope:** Group chat (admin only)

**Purpose:** Tie a host's QR to the Telegram chat so crowd scans build verified heat.

#### **Flow:**
```
Admin: /hostqr

Bot:
🎫 HOST QR / BEACON CODE

Paste your HOTMESS host QR or beacon code.

When people scan this QR:
• Heat builds on the globe
• RIGHT NOW posts get crowd verified
• Party shows as "CROWD VERIFIED"

Reply with your code:

Admin: BEACON_party2025_e1

Bot:
✅ HOST QR UPDATED

This chat is now locked to:
🎫 Beacon: BEACON_party2025_e1
📍 E1 · London

Current scans: 0
Verified crowd: NO (need 6+ scans)
```

**Backend Effect:**
- Updates `telegram_groups.beacon_id`
- Links all future QR scans from this beacon to:
  - `telegram_chat_id`
  - RIGHT NOW posts from this group get `verified_crowd_count++`

---

### 4. `/panic` — Emergency Help

**Scope:** Private chat ONLY (never in groups)

**Purpose:** Direct into Hand N Hand panic flow without leaving Telegram.

#### **Flow:**
```
User: /panic

Bot (DM only):
🚨 HAND N HAND · PANIC

We're not emergency services. If you're in immediate danger, call your local emergency number.

What's going on?

[I feel unsafe and want out]
[I'm spun out / overwhelmed]
[I just need to talk]
```

**User taps option (e.g., "I feel unsafe")**

```
Bot:
📍 Where are you right now?

[Use Last City: London]
[Enter Location]
```

**User confirms/enters city**

```
Bot:
✅ INCIDENT LOGGED

We've created a safety record. This is anonymous and helps us watch heat.

What do you need?

[Message Hand N Hand]      → Deep link to HOTMESS care
[Text a Trusted Contact]   → Pre-filled SMS
[Breathing Exercise]       → 4-7-8 technique
[I'm OK Now]              → Close
```

**Backend Effect:**
```typescript
// Create incident
POST /admin/incidents
{
  "severity": "high",          // "unsafe" → high
  "city": "London",
  "source": "panic",
  "description": "Telegram panic: unsafe & want out",
  "telegram_user_id": "123456789",
  "created_at": "2025-12-09T23:45:00Z"
}

// This appears in Admin War Room
// Contributes to panic-per-hour stats
// Triggers Mess Brain risk assessment
```

---

### 5. `/heat` — Ask Mess Brain

**Scope:** Private chat OR group chat

**Purpose:** Get safety + heat intel from Mess Brain AI (same as app).

#### **Flow:**
```
User: /heat

Bot:
🧠 MESS BRAIN

Which city or neighbourhood?

[Use Profile City: London]
[Enter Location]
```

**User selects/enters city**

```
Bot (thinking...):

[Bot calls AI endpoint:]
POST /api/mess-brain
{
  "query": "What's the safety and heat situation in London tonight?",
  "city": "London",
  "source": "telegram"
}
```

**Bot responds with AI summary:**
```
🧠 MESS BRAIN · LONDON

Tonight's vibe:
• 🔥 Heat: HIGH — 47 RIGHT NOW posts in last hour
• ⚠️  Safety: MEDIUM — 2 consent complaints earlier
• 🎪 Crowds: E1, The Glory, Dalston Superstore

If you're solo:
• Stay near staffed venues
• Leave if anything feels off
• Use panic if you need help

Last updated: 23:47
```

---

## 🔄 **BOT → GLOBE/HEAT WIRING**

### Every `/pulse` from Telegram:
1. ✅ Creates `rightnow_posts` record with `source = 'telegram'`
2. ✅ If group is linked to beacon:
   - Bumps `heat_score` for that beacon
   - Shows on globe as verified heat
3. ✅ If user chose `showOnGlobe = true`:
   - Adds to city heat bins
   - Shows on map as anonymous pulse
4. ✅ If `shareToTelegram = true`:
   - Bot posts formatted message in chat
   - Includes deep link to app

### Every `/hostqr`:
1. ✅ Links `telegram_chat_id` to `beacon_id`
2. ✅ Future QR scans:
   - Increment `verified_crowd_count` for posts from this group
   - Show "CROWD VERIFIED" badge when ≥6 scans

### Every `/panic`:
1. ✅ Creates incident with `source = 'panic'`
2. ✅ Appears in Admin War Room timeline
3. ✅ Contributes to "Panic last hour" stat
4. ✅ Feeds Mess Brain risk model

### Every `/heat`:
1. ✅ Calls same AI endpoint as app
2. ✅ Uses same heat data (RIGHT NOW posts, incidents, beacons)
3. ✅ Returns city-specific safety summary

---

## 🔐 **SECURITY & GDPR**

### What We Store:
```
✅ telegram_user_id (hashed)
✅ telegram_chat_id
✅ hotmess_user_id (linked account)
✅ RIGHT NOW post text (same as app)
✅ Incident records (anonymous after 30 days)
```

### What We DON'T Store:
```
❌ Phone number
❌ Real name
❌ Message history (beyond RIGHT NOW posts)
❌ Group member list
❌ Media files
```

### User Controls:
**In HOTMESS app settings:**
```
🔗 TELEGRAM CONNECTION

Account: @username
Linked: 12 days ago

[ Disconnect Telegram ]
  → Breaks link
  → Stops future mirrors
  → Optionally deletes Telegram-sourced posts

Privacy:
[ ] Allow Telegram posts to show on globe
[ ] Mirror my app posts to Telegram
[ ] Let Mess Brain use my Telegram signals
```

### Compliance:
- ✅ **GDPR Article 17:** Right to be forgotten (disconnect + delete)
- ✅ **GDPR Article 20:** Data portability (export Telegram posts)
- ✅ **Age Gate:** All linked accounts verified 18+ on HOTMESS side
- ✅ **Consent:** Explicit opt-in for heat, Mess Brain, mirroring

---

## 🛠️ **IMPLEMENTATION (Edge Function)**

### File: `/supabase/functions/telegram-bot/index.ts`

```typescript
import { Bot, webhookCallback } from 'npm:grammy';
import { Hono } from 'npm:hono';

const bot = new Bot(Deno.env.get('TELEGRAM_BOT_TOKEN')!);

// Command handlers
bot.command('link', async (ctx) => {
  if (ctx.chat.type === 'private') {
    // Private chat: link user account
    const token = await generateLinkToken(ctx.from.id);
    await ctx.reply(
      '🔗 LINK YOUR HOTMESS ACCOUNT\n\nTap below to connect:',
      {
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'Connect HOTMESS Account',
              url: `https://hotmess.lgbt/telegram/link?token=${token}`
            }]
          ]
        }
      }
    );
  } else {
    // Group chat: admin only
    const member = await ctx.getChatMember(ctx.from.id);
    if (member.status !== 'administrator' && member.status !== 'creator') {
      return;
    }
    
    await ctx.reply(
      '🔗 LINK THIS GROUP TO A VENUE\n\nReply with your beacon code:',
      { reply_to_message_id: ctx.message.message_id }
    );
    
    // Set conversation state (use KV store)
    await setConversationState(ctx.chat.id, 'awaiting_beacon');
  }
});

bot.command('pulse', async (ctx) => {
  // Check if user is linked
  const link = await getTelegramLink(ctx.from.id.toString());
  if (!link) {
    return ctx.reply(
      '⚠️  Link your HOTMESS account first.\n\nUse /link to connect.'
    );
  }
  
  // Start pulse creation flow
  await ctx.reply(
    '🔴 RIGHT NOW PULSE\n\nWhat kind of signal is this?',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Hookup / Play', callback_data: 'intent:hookup' },
            { text: 'Crowd / Party', callback_data: 'intent:crowd' }
          ],
          [
            { text: 'Drop / Offer', callback_data: 'intent:drop' },
            { text: 'Ticket / Event', callback_data: 'intent:ticket' }
          ],
          [
            { text: 'Radio / Listen', callback_data: 'intent:radio' },
            { text: 'Care / Support', callback_data: 'intent:care' }
          ]
        ]
      }
    }
  );
  
  await setConversationState(ctx.from.id, 'pulse:awaiting_intent');
});

bot.command('panic', async (ctx) => {
  // DM only
  if (ctx.chat.type !== 'private') {
    return;
  }
  
  await ctx.reply(
    '🚨 HAND N HAND · PANIC\n\n' +
    'We\'re not emergency services. If you\'re in immediate danger, call 999/112.\n\n' +
    'What\'s going on?',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'I feel unsafe and want out', callback_data: 'panic:unsafe' }],
          [{ text: 'I\'m spun out / overwhelmed', callback_data: 'panic:overwhelmed' }],
          [{ text: 'I just need to talk', callback_data: 'panic:talk' }]
        ]
      }
    }
  );
});

bot.command('heat', async (ctx) => {
  const link = await getTelegramLink(ctx.from.id.toString());
  if (!link) {
    return ctx.reply('⚠️  Link your account first: /link');
  }
  
  // Get user's city or ask
  const city = await getUserCity(link.hotmess_user_id);
  
  if (city) {
    await ctx.reply('🧠 MESS BRAIN\n\nAnalyzing heat in ' + city + '...');
    const answer = await queryMessBrain(city);
    await ctx.reply(
      `🧠 MESS BRAIN · ${city.toUpperCase()}\n\n${answer}\n\n` +
      'Last updated: ' + new Date().toLocaleTimeString()
    );
  } else {
    await ctx.reply(
      '🧠 MESS BRAIN\n\nWhich city?',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Enter City', callback_data: 'heat:enter_city' }]
          ]
        }
      }
    );
  }
});

// Callback query handlers (button presses)
bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data;
  
  if (data.startsWith('intent:')) {
    const intent = data.split(':')[1];
    await setConversationData(ctx.from.id, 'pulse_intent', intent);
    await ctx.editMessageText(
      `✅ ${intent.toUpperCase()}\n\nNow type your message (max 240 chars):`
    );
    await setConversationState(ctx.from.id, 'pulse:awaiting_text');
  }
  
  if (data.startsWith('panic:')) {
    const feeling = data.split(':')[1];
    // Create incident
    await createIncident({
      severity: feeling === 'unsafe' ? 'high' : feeling === 'overwhelmed' ? 'medium' : 'low',
      source: 'panic',
      telegram_user_id: ctx.from.id.toString(),
      description: `Telegram panic: ${feeling}`
    });
    
    await ctx.editMessageText(
      '✅ INCIDENT LOGGED\n\n' +
      'What do you need?',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Message Hand N Hand', url: 'https://hotmess.lgbt/care' }],
            [{ text: 'Text Trusted Contact', url: 'sms:?body=I need help' }],
            [{ text: 'I\'m OK Now', callback_data: 'panic:ok' }]
          ]
        }
      }
    );
  }
  
  await ctx.answerCallbackQuery();
});

// Message handler (for conversation flows)
bot.on('message:text', async (ctx) => {
  const state = await getConversationState(ctx.from.id);
  
  if (state === 'pulse:awaiting_text') {
    const text = ctx.message.text;
    if (text.length > 240) {
      return ctx.reply('⚠️  Max 240 characters. Try again:');
    }
    
    await setConversationData(ctx.from.id, 'pulse_text', text);
    
    // Ask for city
    const city = await getUserCity(ctx.from.id);
    if (city) {
      await ctx.reply(
        `📍 City: ${city}\n\nVisibility:`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✓ Globe', callback_data: 'toggle:globe' },
                { text: '✓ Telegram', callback_data: 'toggle:telegram' },
                { text: '✓ Mess Brain', callback_data: 'toggle:brain' }
              ],
              [{ text: 'Send Pulse', callback_data: 'pulse:send' }]
            ]
          }
        }
      );
      await setConversationState(ctx.from.id, 'pulse:awaiting_send');
    } else {
      await ctx.reply('📍 Which city?');
      await setConversationState(ctx.from.id, 'pulse:awaiting_city');
    }
  }
  
  if (state === 'awaiting_beacon') {
    const beaconCode = ctx.message.text.trim();
    const beacon = await validateBeacon(beaconCode);
    
    if (!beacon) {
      return ctx.reply('⚠️  Invalid beacon code. Try again:');
    }
    
    await linkGroupToBeacon(ctx.chat.id.toString(), beacon.id);
    await ctx.reply(
      `✅ GROUP LINKED\n\n` +
      `📍 ${beacon.venue_name} · ${beacon.city}\n\n` +
      `Members can now use:\n/pulse — Post RIGHT NOW\n/hostqr — Update QR`
    );
  }
});

// Webhook handler
const app = new Hono();
app.post('/telegram-bot', webhookCallback(bot, 'hono'));

Deno.serve(app.fetch);
```

---

## 📊 **METRICS TO TRACK**

```typescript
// KPIs for Telegram integration
interface TelegramMetrics {
  linked_users: number;              // Total linked accounts
  linked_groups: number;             // Total linked groups
  pulses_from_telegram_24h: number;  // RIGHT NOW posts from Telegram
  pulses_mirrored_24h: number;       // App posts shared to Telegram
  panic_triggers_telegram_7d: number; // Panic commands
  heat_queries_24h: number;          // /heat usage
  avg_pulse_engagement: number;      // Clicks on mirrored posts
}
```

**Dashboard View (Admin War Room):**
```
TELEGRAM INTEGRATION

Linked Users:        1,247
Linked Groups:       89
Pulses (24h):        342 (Telegram) + 891 (App)
Mirrored:            68%
Panic (7d):          12
Heat Queries (24h):  156
```

---

## 🚀 **DEPLOYMENT CHECKLIST**

### 1. **Create Telegram Bot:**
```bash
# Talk to @BotFather on Telegram
/newbot
Name: HOTMESS Pulse Bot
Username: @HotmessPulseBot

# Get token
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
```

### 2. **Add to Supabase Secrets:**
```bash
supabase secrets set TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
```

### 3. **Deploy Edge Function:**
```bash
supabase functions deploy telegram-bot
```

### 4. **Set Webhook:**
```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://{projectId}.supabase.co/functions/v1/telegram-bot"
  }'
```

### 5. **Test Commands:**
```
Open Telegram → Search @HotmessPulseBot
/link → Should show button
/pulse → Should ask for intent
/panic → Should show options
/heat → Should ask for city
```

---

## ✅ **SUCCESS CRITERIA**

Bot is working when:
1. ✅ `/link` creates `telegram_links` record
2. ✅ `/pulse` creates RIGHT NOW post in app
3. ✅ Mirrored posts show in Telegram group
4. ✅ `/hostqr` updates `telegram_groups.beacon_id`
5. ✅ QR scans increment `verified_crowd_count`
6. ✅ `/panic` creates incident in War Room
7. ✅ `/heat` returns Mess Brain response
8. ✅ Posts from Telegram show on globe heat
9. ✅ User can disconnect in app settings
10. ✅ GDPR export includes Telegram data

---

## 🖤 **FINAL NOTES**

**This is NOT a chatbot. This is a door.**

Telegram users are posting to the same RIGHT NOW feed, same globe, same safety system. The bot is just another interface—like opening HOTMESS on desktop vs mobile.

**The wiring matters more than the polish.**

Get `/link` + `/pulse` working first. Then panic, then Mess Brain. The magic is in the **heat loop**: Telegram post → globe glow → app user sees it → they scan QR → heat++ → Telegram group gets "CROWD VERIFIED".

**That's the gay warp drive.** 🚀
