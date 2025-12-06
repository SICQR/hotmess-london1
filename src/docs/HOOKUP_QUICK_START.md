# HOTMESS HOOKUP BEACONS - QUICK START GUIDE

**Get started with the hookup beacon system in 5 minutes.**

---

## For Developers

### Test the Routes

```bash
# Create beacon page
https://hotmess.london/?route=hookupCreate

# Scan beacon page (replace CODE with actual beacon ID)
https://hotmess.london/?route=hookupScan&code=CODE
```

### Test the API

```typescript
// Create a room-based beacon
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/hookup/beacon/create`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      mode: 'room',
      name: 'TEST HOOKUP ZONE',
      description: 'Test zone for development',
      city: 'london',
      venue: 'Test Venue',
      zone: 'basement',
      telegram_room_id: 'hotmess_test_room',
      membership_required: 'free',
    }),
  }
);

const data = await response.json();
console.log('Created beacon:', data.beacon);
console.log('QR URL:', data.qr_url);
console.log('XP earned:', data.xp_earned);
```

### Use the React Hook

```tsx
import { useHookupBeacons } from '../hooks/useHookupBeacons';

function MyComponent() {
  const { createBeacon, getBeacon, scanBeacon, loading, error } = useHookupBeacons();

  const handleCreate = async () => {
    const result = await createBeacon({
      mode: 'room',
      name: 'My Hookup Zone',
      city: 'london',
      telegram_room_id: 'my_room_id',
    });
    
    if (result) {
      console.log('Created:', result.qr_url);
    }
  };

  const handleScan = async (beaconId: string) => {
    // First call to check consent
    const consentCheck = await scanBeacon({
      beacon_id: beaconId,
      consent_confirmed: false,
    });
    
    if (consentCheck?.requires_consent) {
      // Show consent UI
      // ...then call again with consent_confirmed: true
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleCreate}>Create Beacon</button>
    </div>
  );
}
```

---

## For Content Creators

### Create a Room-Based QR

1. Go to: `/?route=hookupCreate`
2. Click "Room-Based Hook-Up"
3. Fill in:
   - **Name:** "MEN ON THIS FLOOR TONIGHT"
   - **City:** london
   - **Venue:** Your club name
   - **Zone:** basement (or main-floor, darkroom, etc.)
   - **Telegram Room ID:** Your room ID (e.g., `hotmess_london_yourclub_basement`)
4. Click "Create Beacon"
5. Copy the QR URL
6. Design a poster with the QR code
7. Print and post in your venue

### Create a Personal 1:1 QR

1. Go to: `/?route=hookupCreate`
2. Click "1-on-1 Connection"
3. Fill in:
   - **Name:** "Connect with me"
   - **Description:** "Looking to connect. Let's chat."
   - **City:** london
4. Click "Create Beacon"
5. Copy the QR URL
6. Add to:
   - Phone case
   - Instagram bio
   - Profile sticker
   - Event wristband
   - Business card

---

## For Club Owners

### Set Up a Hookup Zone

**Step 1: Create Telegram Room**
```
Create a private or public Telegram room for your zone
Example: @hotmess_yourclub_basement
```

**Step 2: Contact HOTMESS**
```
Email: hello@hotmess.london
Subject: Hookup Zone Setup

Include:
- Your club name
- Zone description (e.g., "basement floor")
- Telegram room ID
- Preferred QR placement locations
```

**Step 3: We Create the Beacon**
```
We'll create the hookup beacon and send you:
- QR code (high-res PNG)
- Poster design (print-ready PDF)
- Sticker designs
- Installation guide
```

**Step 4: Post the QR**
```
Print and post in visible locations:
- Club entrance
- Zone entrance
- Bathroom walls
- Bar areas
- Chill zones
```

**Step 5: We Moderate**
```
HOTMESS team moderates your hookup room:
- Keeps vibes positive
- Removes bad actors
- Responds to reports
- Checks in regularly
```

### Benefits for Your Venue

✅ **Increased Dwell Time**
- Men stay longer to connect
- More time = more bar spend

✅ **Safety Reputation**
- Consent-first messaging
- Built-in moderation
- Care resources prominent

✅ **Low Effort Setup**
- We do the technical work
- You just post the QR
- We handle moderation

✅ **No App Required**
- Just scan and connect
- Works on any phone
- No download friction

✅ **Data & Insights**
- See scan counts
- Track engagement
- Understand your audience

---

## For Users

### Scan a Hookup QR

1. **See a QR** on a club wall, poster, or someone's phone
2. **Scan it** with your phone camera
3. **Read the info** about the hookup zone or person
4. **Check the consent notice** (Men-only, 18+, consent-first)
5. **Decide** if you're in a good place to connect
6. **Tap "Enter"** or "Connect"
7. **See consent check-in** with 4 items
8. **Confirm** if you're ready
9. **Connect** via Telegram room or private DM
10. **Stay safe** - "Not tonight" is always okay

### What to Expect

**Room-Based (Group Vibes):**
```
You'll join a Telegram room with other men in that zone.
- Chat openly
- DM people if you want
- Leave anytime
- Report if needed
```

**1-on-1 (Direct Connection):**
```
You'll get a private chat with that person via bot.
- Both get notified
- Target can accept/decline
- Private thread created
- Chat with safety reminder
```

### Safety Tips

✅ Check in with yourself before connecting
✅ Stay sober enough to consent
✅ Respect boundaries and "no"
✅ No screenshots without permission
✅ Use /report if needed
✅ Visit Care page if you need support
✅ "Not tonight" is always valid

---

## Troubleshooting

### "Beacon not found"
- Check the QR code is correct
- Beacon might be expired or deactivated
- Contact the beacon creator

### "Membership upgrade required"
- This beacon requires PRO or ELITE tier
- Tap "Upgrade" to see pricing
- Or scan a FREE-tier beacon

### "Connection limit reached"
- 1:1 beacons have rate limits (10-20/hour)
- Try again later
- Or message the person directly on Telegram

### "Must be logged in"
- 1:1 connections require login
- Room-based works without login
- Sign up: `/?route=register`

### "Telegram room won't open"
- Make sure Telegram is installed
- Open the link in Telegram app
- Room might be private - ask moderator for access

---

## Examples

### Example 1: Club Basement Hookup Zone

**QR Poster:**
```
━━━━━━━━━━━━━━━━━━━━━━━
MEN ON THIS FLOOR TONIGHT
━━━━━━━━━━━━━━━━━━━━━━━

[QR CODE]

SCAN → JOIN HOOK-UP ROOM

Basement floor • Men-only • 18+
HOTMESS.LONDON
```

**Telegram Room:** `@hotmess_london_venue_basement`

**Result:** Men on that floor scan, join room, connect

---

### Example 2: Personal Connection QR

**Phone Case Sticker:**
```
SCAN IF YOU WANT TO CONNECT

[QR CODE]

@username
HOTMESS.LONDON
```

**Result:** People scan, get consent check, bot creates private thread

---

### Example 3: Event Wristband QR

**Wristband Design:**
```
HOTMESS
[Small QR Code]
@username
```

**Result:** At party, guys scan wristbands to connect directly

---

## FAQ

**Q: Do I need to download an app?**
A: No, just scan the QR with your phone camera.

**Q: Is it safe?**
A: Yes. Consent checks, moderation, and care resources built-in.

**Q: Can I create my own QR?**
A: Yes! Room-based is free. 1:1 requires PRO (£15/mo).

**Q: What if I change my mind?**
A: "Not tonight" button always visible. No pressure.

**Q: Can I delete my beacon?**
A: Yes, go to your beacons and deactivate.

**Q: How do I report abuse?**
A: Use /report in any room, or contact care@hotmess.london

**Q: Does this replace regular chat?**
A: No, it's a tool for physical spaces + quick connections.

**Q: Who can see my 1:1 QR?**
A: Anyone you share it with. Don't post publicly if you want privacy.

**Q: Can straight people use this?**
A: No, HOTMESS is a men-only queer space.

---

## Support

**Technical Issues:**
- Discord: discord.gg/hotmess
- Email: tech@hotmess.london

**Safety/Care:**
- Care page: `/?route=care`
- Email: care@hotmess.london
- Telegram: @hotmess_care_bot

**Partnership Inquiries:**
- Email: partners@hotmess.london

---

## Resources

- [Full Documentation](./HOOKUP_BEACONS.md)
- [Integration Guide](./HOOKUP_QR_GENERATOR_INTEGRATION.md)
- [Summary](./HOOKUP_SYSTEM_SUMMARY.md)
- [TypeScript Types](/types/hookup.ts)
- [React Hook](/hooks/useHookupBeacons.ts)

---

**Ready to connect? Start here:** `/?route=hookupCreate`

🖤
