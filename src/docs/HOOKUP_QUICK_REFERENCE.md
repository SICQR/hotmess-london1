# HOTMESS HOOK-UP QRS — QUICK REFERENCE CARD

**One-page reference for everything you need**

---

## 🔗 KEY URLS

**Frontend Routes:**
```
/?route=hookupScan&code=<id>    - Scan page
/?route=hookupCreate            - Create beacon
/?route=hookupDashboard         - Manage beacons
```

**API Endpoints:**
```
POST   /api/hookup/beacon/create
GET    /api/hookup/beacon/:id
POST   /api/hookup/scan
GET    /api/hookup/nearby
GET    /api/hookup/my-beacons
DELETE /api/hookup/beacon/:id
GET    /api/hookup/stats/:id

POST   /api/telegram/webhook
GET    /api/telegram/webhook-info
POST   /api/telegram/set-webhook
POST   /api/telegram/delete-webhook
```

---

## 🤖 BOT CREDENTIALS

```bash
Token: HOTMESS_NEW_BOT_TOKEN
Username: @HotmessNew_bot
Webhook: https://<PROJECT_ID>.supabase.co/functions/v1/
         make-server-a670c824/api/telegram/webhook
```

---

## 🎯 TWO MODES

### Room-Based
- QR on club wall
- Scan → Consent → Join Telegram room
- +15 XP per scan
- FREE tier access

### 1-on-1
- Personal QR
- Scan → Consent → DM via bot
- +10 XP per connection
- PRO tier to create

---

## 💎 MEMBERSHIP GATES

| Feature | FREE | PRO | ELITE |
|---------|------|-----|-------|
| Room scans | 2/night | ∞ | ∞ |
| 1:1 connections | 5/week | 20/week | ∞ |
| Create 1:1 QR | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Advanced controls | ❌ | ❌ | ✅ |

---

## 🎮 XP REWARDS

```
Create room beacon:     +100 XP
Create 1:1 beacon:      +50 XP
Scan room beacon:       +15 XP (once per night)
Connect 1:1:            +10 XP (per unique person)
Accept connection:      +5 XP
```

---

## 🛡️ CONSENT FLOW

### Room Mode (4 checks)
```
✓ Respect boundaries and consent
✓ No screenshots without permission
✓ What happens here stays here
✓ You can leave anytime
```

### 1:1 Mode (4 checks)
```
✓ I'm clear-minded and sober
✓ I've thought about what I want
✓ I'm okay to stop if it doesn't feel right
✓ I won't screenshot or share without consent
```

---

## 🤖 BOT COMMANDS

```
/care        - Care resources
/help        - Help message
/report      - Report safety concern
/decline     - Decline connection
```

---

## 📊 KEY METRICS

**Usage:**
- Beacons created
- Total scans
- Connections made
- Conversion rate

**Safety:**
- /report usage
- /care usage
- Declined connections
- "Not tonight" clicks

**Revenue:**
- PRO upgrades
- ELITE upgrades
- Club partnerships

---

## 🚨 SAFETY FEATURES

✅ Men-Only, 18+  
✅ Mandatory consent  
✅ "Not tonight" button  
✅ Care always accessible  
✅ Rate limiting  
✅ Enhanced moderation  
✅ /report command  
✅ No-screenshot reminders  

---

## 📁 KEY FILES

**Backend:**
```
/supabase/functions/server/hookup_api.tsx
/supabase/functions/server/telegram_bot.tsx
/supabase/functions/server/telegram_webhook.tsx
```

**Frontend:**
```
/pages/HookupScan.tsx
/pages/HookupBeaconCreate.tsx
/pages/HookupDashboard.tsx
```

**Hooks:**
```
/hooks/useHookupBeacons.ts
```

**Types:**
```
/types/hookup.ts
```

---

## 📚 DOCUMENTATION

**Start here:**
- [HOOKUP_FINAL_SUMMARY.md](./HOOKUP_FINAL_SUMMARY.md) - Executive summary
- [HOOKUP_DEPLOYMENT_GUIDE.md](./HOOKUP_DEPLOYMENT_GUIDE.md) - Deploy step-by-step

**By role:**
- Developers → [HOOKUP_COMPLETE_INDEX.md](./HOOKUP_COMPLETE_INDEX.md)
- Hosts → [HOOKUP_HOST_SCRIPTS.md](./HOOKUP_HOST_SCRIPTS.md)
- Ambassadors → [HOOKUP_AMBASSADOR_KIT.md](./HOOKUP_AMBASSADOR_KIT.md)
- Marketing → [HOOKUP_MARKETING_LAUNCH_PACK.md](./HOOKUP_MARKETING_LAUNCH_PACK.md)
- Clubs → [HOOKUP_CLUB_PARTNER_KIT.md](./HOOKUP_CLUB_PARTNER_KIT.md)

---

## 🚀 QUICK DEPLOYMENT

```bash
# 1. Set webhook
curl -X POST .../api/telegram/set-webhook \
  -d '{"url": "https://...webhook"}'

# 2. Verify
curl .../api/telegram/webhook-info

# 3. Test bot
# Message @HotmessNew_bot: /help

# 4. Create test beacon
# Go to /?route=hookupCreate

# 5. Test scan
# Go to /?route=hookupScan&code=<id>
```

---

## 🔧 TROUBLESHOOTING

**Webhook not working?**
```bash
curl .../api/telegram/webhook-info
# Check URL is correct
```

**Notifications not sent?**
- Check user has Telegram connected
- Verify user_profile:{userId}.telegram exists

**Beacon not found?**
- Check beacon ID
- Verify beacon status is "active"

**XP not awarded?**
- Check user is logged in
- Verify XP system working

---

## 📞 SUPPORT

**Users:** support@hotmess.london  
**Care:** care@hotmess.london  
**Partners:** partners@hotmess.london  
**Hosts:** hosts@hotmess.london  
**Ambassadors:** ambassadors@hotmess.london  

---

## ✅ READY TO LAUNCH

**Status:** 🚀 PRODUCTION READY

**What's included:**
- ✅ Backend API (11 endpoints)
- ✅ Frontend pages (3 routes)
- ✅ Bot integration (full)
- ✅ QR frames (5 designs)
- ✅ Documentation (15 files)
- ✅ Operational guides
- ✅ Marketing materials
- ✅ Partnership kits

**Built with care. Ready to ship.** 🖤
