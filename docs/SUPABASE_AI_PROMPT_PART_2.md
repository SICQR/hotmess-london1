# 🚨 SUPABASE AI - DEPLOY MISSING ENDPOINTS (PART 2)

## Copy this prompt to Supabase AI:

```
Add these 2 new Edge Functions to complete the RIGHT NOW system:

## EDGE FUNCTION 1: right-now-reply

- Method: POST
- URL: /functions/v1/right-now-reply
- Body: { post_id, sender_user_id, message }
- Logic:
  - Validate post exists and is not expired
  - Create a DM thread or room connection
  - Store in kv_store with key pattern: "right_now_reply:{post_id}:{sender_user_id}"
  - Value: { post_id, sender_user_id, message, created_at, telegram_link }
  - Generate Telegram deep link: "https://t.me/hotmess_bot?start=reply_{post_id}"
  - Return { success: true, telegram_link, thread_id }
- Response example:
  {
    "success": true,
    "telegram_link": "https://t.me/hotmess_bot?start=reply_abc123",
    "thread_id": "thread_xyz789",
    "message": "DM request sent. Open in Telegram to continue."
  }
- CORS: Allow all origins
- No JWT verification required

## EDGE FUNCTION 2: panic-alert

- Method: POST
- URL: /functions/v1/panic-alert
- Body: { user_id, situation, location_city, additional_notes }
- Logic:
  - Validate situation is one of: "unsafe", "overwhelmed", "talk"
  - Store panic event in kv_store with key: "panic_alert:{user_id}:{timestamp}"
  - Value: { user_id, situation, location_city, additional_notes, created_at }
  - Generate emergency response with contacts:
    * UK Emergency: 999
    * LGBT+ Switchboard: 0300 330 0630
    * Samaritans: 116 123
    * Telegram HNH Bot: https://t.me/hotmess_bot?start=panic
  - Return contacts + Telegram link
- Response example:
  {
    "success": true,
    "alert_id": "panic_123456",
    "emergency_contacts": [
      { "name": "Emergency Services", "number": "999", "type": "emergency" },
      { "name": "LGBT+ Switchboard", "number": "0300 330 0630", "type": "support" },
      { "name": "Samaritans", "number": "116 123", "type": "crisis" }
    ],
    "telegram_link": "https://t.me/hotmess_bot?start=panic",
    "message": "Panic alert logged. We're here. Call emergency services if you're in danger."
  }
- CORS: Allow all origins
- No JWT verification required

Deploy both functions with --no-verify-jwt flag.
```

---

## FRONTEND IMPLEMENTATION

After deployment, update these files:

### File: `/pages/RightNowPagePro.tsx`

**Line 440-443:** Replace "REPLY / OPEN ROOM" button:

```tsx
<button
  type=\"button\"
  onClick={async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/right-now-reply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            post_id: selectedPost.id,
            sender_user_id: 'anon_' + Date.now(),
            message: 'Interested in connecting'
          }),
        }
      );
      const json = await res.json();
      if (json.telegram_link) {
        window.open(json.telegram_link, '_blank');
      }
    } catch (e) {
      console.error('Reply error', e);
    }
  }}
  className=\"inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black text-[11px] uppercase tracking-[0.26em] px-3 py-2\"
>
  REPLY / OPEN ROOM
</button>
```

**Line 701-707:** Replace "TEXT A TRUSTED CONTACT" button:

```tsx
<button
  type=\"button\"
  onClick={async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/panic-alert`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 'anon_' + Date.now(),
            situation: selection || 'talk',
            location_city: 'Unknown',
            additional_notes: 'User requested emergency contact'
          }),
        }
      );
      const json = await res.json();
      
      // Open SMS to emergency contact
      const contact = json.emergency_contacts?.[1]; // LGBT+ Switchboard
      if (contact) {
        window.location.href = `sms:${contact.number}?body=I need support. I'm using HOTMESS app and need someone to talk to.`;
      }
    } catch (e) {
      console.error('Contact error', e);
    }
  }}
  className=\"w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 text-[11px] uppercase tracking-[0.24em] px-3 py-2 text-white/80 hover:border-white/60\"
>
  <ArrowUpRight className=\"w-4 h-4\" />
  TEXT A TRUSTED CONTACT
</button>
```

---

## EXPECTED RESULT

After deploying:

✅ **"REPLY / OPEN ROOM"** → Creates DM thread, opens Telegram deep link  
✅ **"TEXT A TRUSTED CONTACT"** → Logs panic alert, opens SMS with crisis line number  

All buttons will have real endpoints and functionality.
