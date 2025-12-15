# Beacon OS - Quick Start Guide

**For developers working with the HOTMESS Beacon system**

---

## 🎯 What You Need to Know

Beacon OS is the **routing brain** for HOTMESS LONDON. Instead of building separate systems for check-ins, tickets, products, hook-ups, and care resources, everything flows through **one unified pipeline**.

### The Big Picture

```
QR Code → Beacon → Scan Pipeline → Type Handler → Your Feature
```

---

## 🚀 5-Minute Setup

### 1. Understand the Types

Every beacon has a `type` and `subtype`:

| Type | Subtypes | Use Cases |
|------|----------|-----------|
| `presence` | checkin, event_presence | Venue check-ins, event attendance |
| `transaction` | ticket, ticket_resale, product, drop | Commerce, tickets, resale |
| `social` | person, room, geo_room | Hook-ups, chat rooms, venue chat |
| `care` | hnh | Hand N Hand aftercare/resources |

### 2. Know Your Endpoints

**Public (users scan these)**:
- `GET /l/:code` - Standard beacon scan
- `GET /x/:payload.:sig` - Signed beacon (secure, expiring)

**Admin (create/manage beacons)**:
- `GET /api/beacons` - List beacons
- `POST /api/beacons` - Create beacon
- `PATCH /api/beacons/:id` - Update beacon
- `DELETE /api/beacons/:id` - End beacon

### 3. Create Your First Beacon

```typescript
// Example: Create a venue check-in beacon
const beacon = await fetch('/api/beacons', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'presence',
    subtype: 'checkin',
    label: 'Soho Sauna Check-in',
    geo_mode: 'venue',
    geo: {
      lat: 51.5142,
      lng: -0.1350,
      radius_m: 100
    },
    xp_base: 10,
    xp_cap_per_user_per_day: 1,
    payload: {
      venue_id: 'venue_123'
    }
  })
});

const { code } = await beacon.json();
// code = "HM9X73" (auto-generated)
```

### 4. Generate QR Code

```html
<!-- Standard QR -->
<img src="/qr/HM9X73.svg?style=hotmess&size=600" />

<!-- For discreet hook-ups, use signed QR -->
<img src="/qr/signed/{payload}.{sig}.svg?style=stealth&size=512" />
```

### 5. Handle the Scan

When a user scans, the **universal pipeline** handles everything:

1. ✅ Resolve beacon
2. ✅ Age & men-only gate
3. ✅ Consent prompts
4. ✅ Geo check (if needed)
5. ✅ XP calculation
6. ✅ Log scan event
7. ✅ **Your handler** gets called
8. ✅ Events emitted

You only need to implement **your specific flow**.

---

## 🛠️ Adding a New Feature

### Step 1: Choose Your Beacon Type

**Need location check-in?** → `presence/checkin`  
**Need event ticket?** → `transaction/ticket`  
**Need hook-up QR?** → `social/person`  
**Need venue chat?** → `social/geo_room`  
**Need product sale?** → `transaction/product`  

### Step 2: Create Handler

All handlers follow this pattern:

```typescript
// Example: Custom product handler
export async function handleProductScan({
  req,
  beacon,
  user,
  geo,
  signedPayload
}: {
  req: Request;
  beacon: Beacon;
  user: any;
  geo: GeoInfo;
  signedPayload?: SignedBeaconPayload | null;
}): Promise<{ ui: any; xp?: number; actionOverride?: string }> {
  
  // 1. Get your data
  const product = await getProduct(beacon.payload.listing_id);
  
  // 2. Handle GET (show product)
  if (req.method === 'GET') {
    return {
      xp: 0,
      ui: {
        kind: 'product_view',
        product,
      }
    };
  }
  
  // 3. Handle POST (purchase)
  if (req.method === 'POST') {
    const order = await createOrder(user.id, product.id);
    return {
      xp: 5, // Award XP
      actionOverride: 'product_purchase',
      ui: {
        kind: 'product_purchase_success',
        order,
      }
    };
  }
}
```

### Step 3: Register Handler

Add to `beaconScan.ts`:

```typescript
if (beacon.type === "transaction" && beacon.subtype === "product") {
  result = await handleProductScan({ req, beacon, user, geo, signedPayload });
}
```

**That's it!** The pipeline handles everything else.

---

## 📋 Common Patterns

### Pattern 1: Geo-Gated Check-In

```typescript
const beacon = {
  type: 'presence',
  subtype: 'checkin',
  geo_mode: 'venue',
  geo: {
    lat: 51.5142,
    lng: -0.1350,
    radius_m: 100 // Must be within 100m
  },
  xp_base: 10,
  xp_cap_per_user_per_day: 1 // Only once per day
};
```

### Pattern 2: Signed Hook-Up QR

```typescript
// Mint signed QR (expires at 6am)
const tomorrow6am = new Date();
tomorrow6am.setDate(tomorrow6am.getDate() + 1);
tomorrow6am.setHours(6, 0, 0, 0);

const payload: SignedBeaconPayload = {
  code: beacon.code,
  nonce: crypto.randomUUID(),
  exp: Math.floor(tomorrow6am.getTime() / 1000),
  kind: 'person'
};

const payloadB64 = base64url(JSON.stringify(payload));
const sig = base64url(hmacSha256(payloadB64, BEACON_SECRET));

// QR URL: /x/{payloadB64}.{sig}
```

### Pattern 3: Ticket Resale

```typescript
// Create resale beacon
const resaleBeacon = await createBeacon({
  type: 'transaction',
  subtype: 'ticket_resale',
  payload: {
    ticket_id: 't_001',
    event_id: 'evt_001'
  },
  // Use signed URL for security
});

// Generate signed shortlink
const signedUrl = await mintSignedUrl(resaleBeacon.code, {
  exp: eventDate.getTime() / 1000
});

// Share: /x/{payload}.{sig}
```

### Pattern 4: Product Drop

```typescript
const dropBeacon = {
  type: 'transaction',
  subtype: 'drop',
  label: 'RAW Vest Drop - 50 units',
  payload: {
    listing_id: 'lst_001',
    vendor_id: 'vendor_raw'
  },
  xp_base: 5,
  time_window: {
    starts_at: '2024-12-07T00:00:00Z',
    ends_at: '2024-12-07T23:59:59Z'
  }
};
```

---

## 🔐 Privacy & Safety

### Always Include

1. **Age & Men-Only Gate**: Handled by pipeline ✅
2. **Consent Prompts**: Handled by pipeline ✅
3. **Geo Privacy**: Use appropriate `geo_mode`
4. **XP Caps**: Set `xp_cap_per_user_per_day`

### Geo Modes Explained

| Mode | What It Does | When to Use |
|------|--------------|-------------|
| `none` | No geo tracking | Online-only features |
| `venue` | Distance check (radius) | Check-ins, venue chat |
| `city` | Round to safe grid | City-level features |
| `exact_fuzzed` | Precise but anonymized | Analytics only |

**Rule of thumb**: If you don't need precise location, use `none` or `city`.

---

## 🎮 XP System

### How XP Works

```typescript
// Base XP
xp = beacon.xp_base;

// Apply tier multiplier
xp *= tierMultiplier[user.tier]; // starter:1.0, pro:1.5, elite:2.0

// Apply caps
xp = Math.min(xp, beacon.xp_cap_per_user_per_day);
xp = Math.min(xp, dailyRemainingXP(user));

// Award
if (xp > 0) {
  await awardXP({ userId: user.id, beaconId: beacon.id, amount: xp });
}
```

### XP Sources

- **Presence**: Check-ins (once per venue per day)
- **Transaction**: Ticket attendance, purchases
- **Social**: Connection accepts, room joins (limited)
- **Care**: HNH visits (weekly cap)

---

## 🧪 Testing

### Test a Beacon Scan

```bash
# Standard beacon
curl https://hotmessldn.com/l/HM9X73

# With mode
curl https://hotmessldn.com/l/HM9X73?mode=validate

# Signed beacon
curl https://hotmessldn.com/x/{payload}.{sig}
```

### Test Response Format

```json
{
  "ok": true,
  "action": "checkin",
  "beacon": {
    "id": "b_123",
    "code": "HM9X73",
    "type": "presence",
    "subtype": "checkin",
    "label": "Soho Sauna",
    "status": "active"
  },
  "xp_awarded": 10,
  "ui": {
    "kind": "checkin_success",
    "message": "You've checked in.",
    "venue_id": "venue_123"
  }
}
```

---

## 📚 Full Documentation

- **Spec**: `/docs/BEACONS.md` - Complete data models and flows
- **API**: `/docs/API_BEACONS.md` - All endpoints and contracts
- **Summary**: `/BEACON_OS_SUMMARY.md` - Implementation guide

---

## 🆘 Common Issues

### "Beacon not found"
- Check `status` is `"active"`
- Verify code exists in database

### "Too far from venue"
- `geo_mode` is `"venue"` but user is outside `radius_m`
- Either increase radius or change to `"city"`

### "XP not awarded"
- Check `xp_cap_per_user_per_day` not reached
- Check global daily cap (500 XP)
- Check user already scanned today

### "Signed beacon expired"
- `exp` timestamp in past
- Generate new signed URL

---

## ⚡ Pro Tips

1. **Use signed URLs for anything sensitive** (hook-ups, resale, VIP)
2. **Set appropriate XP caps** to prevent farming
3. **Use `geo_mode: "venue"` for physical locations** only
4. **Test with both authenticated and anonymous users**
5. **Always set `time_window` for time-limited features**
6. **Use care disclaimers** for any safety/health content

---

## 🎯 Next Steps

1. **Read** `/docs/BEACONS.md` for complete spec
2. **Review** handler examples in `/supabase/functions/server/`
3. **Create** your first beacon via API
4. **Test** the scan flow
5. **Customize** the UI response in your handler

---

## 💬 Support

Questions? Check:
- Full spec: `/docs/BEACONS.md`
- API docs: `/docs/API_BEACONS.md`
- Implementation: `/BEACON_OS_SUMMARY.md`

---

**Built with care for the queer nightlife community** 🖤💗
