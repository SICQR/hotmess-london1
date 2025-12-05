# HOTMESS HOOK-UP QRS — DEPLOYMENT GUIDE

**Step-by-step production deployment guide**

---

## 🎯 OVERVIEW

This guide walks you through deploying the complete Hook-Up QR system to production, including:
- Backend API
- Frontend pages
- Telegram bot integration
- Webhook configuration
- Testing and verification

**Estimated Time:** 30-45 minutes

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### Required Environment Variables

Verify these are set in your Supabase project:

```bash
# Core
SUPABASE_URL=https://<PROJECT_ID>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<YOUR_KEY>
SUPABASE_ANON_KEY=<YOUR_KEY>

# Bot (Already Configured)
HOTMESS_NEW_BOT_TOKEN=8222096804:AAFmU_P6V9CM03mbM0IfNIPnXqkyIkiJXeo
BOT_USERNAME=@HotmessNew_bot
BOT_CHANNEL_URL=https://t.me/HOTMESSRADIOXXX/69
```

### Files Created/Modified

**Backend (3 new files):**
- ✅ `/supabase/functions/server/hookup_api.tsx`
- ✅ `/supabase/functions/server/telegram_bot.tsx`
- ✅ `/supabase/functions/server/telegram_webhook.tsx`

**Frontend (3 pages):**
- ✅ `/pages/HookupScan.tsx`
- ✅ `/pages/HookupBeaconCreate.tsx`
- ✅ `/pages/HookupDashboard.tsx`

**Components (6 QR frames):**
- ✅ `/components/qr/frames/NeonFrame.tsx`
- ✅ `/components/qr/frames/BlackoutFrame.tsx`
- ✅ `/components/qr/frames/VioletHaloFrame.tsx`
- ✅ `/components/qr/frames/EliteFrame.tsx`
- ✅ `/components/qr/frames/MinimalFrame.tsx`
- ✅ `/components/qr/frames/index.ts`

**Types & Hooks:**
- ✅ `/types/hookup.ts`
- ✅ `/hooks/useHookupBeacons.ts`

**Configuration:**
- ✅ `/lib/beaconTypes.ts` (modified)
- ✅ `/lib/routes.ts` (modified)
- ✅ `/components/Router.tsx` (modified)
- ✅ `/supabase/functions/server/index.tsx` (modified)

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Deploy Backend

The backend should auto-deploy when you push to main. Verify:

```bash
# Check that server is running
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/

# Should return: {"message":"HOTMESS London Server Active"}
```

**Test hookup API:**
```bash
# Test beacon creation endpoint (requires auth)
curl -X POST https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/hookup/beacon/create \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "room",
    "name": "Test Beacon",
    "city": "london",
    "telegram_room_id": "test_room"
  }'
```

---

### Step 2: Configure Telegram Webhook

Set the webhook URL to receive bot updates:

```bash
curl -X POST https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/telegram/set-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/telegram/webhook"
  }'
```

**Verify webhook is set:**
```bash
curl https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/telegram/webhook-info
```

**Expected response:**
```json
{
  "ok": true,
  "result": {
    "url": "https://<PROJECT_ID>.supabase.co/functions/v1/make-server-a670c824/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "max_connections": 40
  }
}
```

---

### Step 3: Test Bot Integration

**Test 1: Send a test message to the bot**

Message `@HotmessNew_bot` on Telegram:
```
/help
```

**Expected:** Bot responds with help message.

**Test 2: Test /care command**
```
/care
```

**Expected:** Bot sends care resources.

**Test 3: Check webhook logs**

In Supabase dashboard:
- Go to Edge Functions
- Select `make-server-a670c824`
- Check logs for webhook updates

---

### Step 4: Test Frontend Routes

**Test Scan Page:**
```
https://hotmess.london/?route=hookupScan&code=test_beacon_123
```

**Expected:**
- Page loads
- Shows "Beacon not found" (since test_beacon_123 doesn't exist)
- No errors in console

**Test Create Page (requires login):**
```
https://hotmess.london/?route=hookupCreate
```

**Expected:**
- Redirects to login if not authenticated
- Shows beacon creation wizard if authenticated

**Test Dashboard (requires login):**
```
https://hotmess.london/?route=hookupDashboard
```

**Expected:**
- Redirects to login if not authenticated
- Shows "My Hook-Up QRs" dashboard if authenticated

---

### Step 5: Create Test Beacons

**Create a room-based beacon:**

1. Login to HOTMESS
2. Go to `/?route=hookupCreate`
3. Fill in form:
   - **Mode:** Room-Based
   - **Name:** "Test Club Basement"
   - **City:** London
   - **Telegram Room ID:** `hotmess_london_test`
   - **Venue:** "Test Venue"
   - **Zone:** "basement"
4. Click "Create Beacon"

**Expected:**
- Success message
- Beacon ID returned
- QR URL generated

**Create a 1:1 beacon (requires PRO):**

1. Upgrade to PRO membership
2. Go to `/?route=hookupCreate`
3. Fill in form:
   - **Mode:** 1-on-1
   - **Name:** "My Personal QR"
   - **City:** London
   - **Target User ID:** (your user ID)
4. Click "Create Beacon"

**Expected:**
- Success message
- Personal QR created
- Can scan to test 1:1 flow

---

### Step 6: Test Full Scan Flow

**Room-based flow:**

1. Get your beacon URL from dashboard
2. Open in new incognito window (or logged out)
3. Click through consent check
4. Verify XP awarded (if logged in)
5. Check Telegram for notification (if connected)

**1:1 flow:**

1. Get your 1:1 beacon URL
2. Share with another user (or test account)
3. They scan and accept consent
4. Check Telegram notifications on both sides
5. Verify connection created

---

### Step 7: Test Bot Callbacks

**Accept Connection:**

1. Create 1:1 connection (see Step 6)
2. Target user receives Telegram message with buttons
3. Click "✅ Accept & Connect"
4. Verify both users notified
5. Check connection status updated

**Decline Connection:**

1. Create 1:1 connection
2. Target user receives message
3. Click "❌ Not Tonight"
4. Verify gentle notification sent
5. Check connection marked as declined

**Care Resources:**

1. In any bot message with "🆘 Care" button
2. Click button
3. Verify care resources sent

---

## 🧪 TESTING CHECKLIST

### Backend API

- [ ] POST `/api/hookup/beacon/create` - Creates beacon
- [ ] GET `/api/hookup/beacon/:id` - Returns beacon details
- [ ] POST `/api/hookup/scan` - Processes scan with consent
- [ ] GET `/api/hookup/nearby` - Returns nearby beacons
- [ ] GET `/api/hookup/my-beacons` - Returns user's beacons
- [ ] DELETE `/api/hookup/beacon/:id` - Deactivates beacon
- [ ] GET `/api/hookup/stats/:id` - Returns analytics

### Telegram Bot

- [ ] Webhook receives updates
- [ ] /care command works
- [ ] /help command works
- [ ] /report command works
- [ ] Accept button works
- [ ] Decline button works
- [ ] Care button works
- [ ] Room notifications sent
- [ ] 1:1 notifications sent

### Frontend

- [ ] Scan page loads
- [ ] Consent flow works
- [ ] Create wizard works
- [ ] Dashboard loads
- [ ] Beacon list displays
- [ ] Analytics show
- [ ] QR download works
- [ ] Responsive on mobile

### Integration

- [ ] XP awarded correctly
- [ ] Membership gates work
- [ ] Rate limiting works
- [ ] Telegram notifications sent
- [ ] Bot callbacks processed
- [ ] Connection states update
- [ ] Care resources accessible

---

## 🐛 TROUBLESHOOTING

### Webhook not receiving updates

**Problem:** Bot not responding to messages.

**Solution:**
1. Check webhook is set: `/api/telegram/webhook-info`
2. Verify URL is correct
3. Check Supabase function logs
4. Test with `/api/telegram/set-webhook` again

---

### Notifications not sent

**Problem:** Users not receiving Telegram notifications.

**Solution:**
1. Check user has Telegram connected
2. Verify `user_profile:{userId}.telegram` exists
3. Check bot token is valid
4. Test message manually:
```bash
curl -X POST https://api.telegram.org/bot<TOKEN>/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "USER_ID", "text": "Test"}'
```

---

### Beacon not found

**Problem:** Scan page shows "Beacon not found".

**Solution:**
1. Check beacon ID is correct
2. Verify beacon exists: GET `/api/hookup/beacon/:id`
3. Check beacon status is "active"
4. Verify KV store has beacon data

---

### XP not awarded

**Problem:** User not receiving XP for scans.

**Solution:**
1. Check user is logged in
2. Verify XP system is working
3. Check `xp:{userId}` in KV store
4. Review hookup_api XP award logic

---

### Consent flow broken

**Problem:** Consent check not showing or not working.

**Solution:**
1. Check frontend state management
2. Verify API endpoint returns correct data
3. Check consent items array
4. Review browser console for errors

---

## 📊 POST-DEPLOYMENT MONITORING

### Metrics to Watch

**Usage:**
- Beacons created per day
- Scans per day
- Connections per day
- Active users

**Safety:**
- /report usage
- /care usage
- Declined connections
- "Not Tonight" clicks

**Bot Performance:**
- Notification delivery rate
- Button click rate
- Command usage
- Error rate

**Revenue:**
- PRO upgrades attributed
- ELITE upgrades attributed
- Average time to upgrade

### Monitoring Tools

**Supabase Dashboard:**
- Edge Function logs
- Database queries
- Error tracking

**Bot Analytics:**
- Webhook updates received
- Messages sent
- Commands processed
- Callback queries handled

**Frontend Analytics:**
- Page views (scan/create/dashboard)
- Conversion rates
- Drop-off points
- Mobile vs desktop

---

## 🔐 SECURITY REVIEW

### Before Going Live

- [ ] Webhook URL uses HTTPS
- [ ] Bot token stored securely in env vars
- [ ] User auth enforced on protected routes
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak data
- [ ] CORS configured correctly
- [ ] Membership gates enforced

### Privacy Checklist

- [ ] User Telegram IDs stored securely
- [ ] Connection history is private
- [ ] No real names in public data
- [ ] Profile photos not shared without consent
- [ ] Scan data anonymized in analytics
- [ ] Care requests are confidential

---

## 🎉 LAUNCH CHECKLIST

### Day Before Launch

- [ ] All tests passing
- [ ] Webhook configured
- [ ] Bot responding
- [ ] Frontend pages working
- [ ] Documentation complete
- [ ] Support email ready
- [ ] Marketing materials ready
- [ ] Club partners notified

### Launch Day

- [ ] Send announcement email
- [ ] Post on social media
- [ ] Monitor error logs
- [ ] Watch user feedback
- [ ] Be ready for support requests
- [ ] Celebrate! 🎉

### First Week

- [ ] Daily metrics review
- [ ] User feedback collection
- [ ] Bug fixes as needed
- [ ] Performance optimization
- [ ] Club partnership outreach
- [ ] Host/ambassador recruitment

---

## 📞 SUPPORT CONTACTS

**Technical Issues:**
- Developer team
- Supabase support

**User Support:**
- support@hotmess.london
- care@hotmess.london (safety/care)

**Partnership:**
- partners@hotmess.london

**Emergency:**
- [Emergency contact protocol]

---

## ✅ DEPLOYMENT COMPLETE

Once all steps are done:

✅ Backend API deployed  
✅ Telegram bot configured  
✅ Webhook active  
✅ Frontend pages live  
✅ Tests passing  
✅ Monitoring active  

**Status:** PRODUCTION READY 🚀

**Next:** Launch marketing campaign and start onboarding users!

---

**Built with care. Deployed with pride.** 🖤
