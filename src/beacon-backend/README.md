# HOTMESS Beacon OS - Demo Backend

**In-memory TypeScript/Express backend demonstrating the complete Beacon OS pipeline**

## 🎯 What This Is

A standalone, runnable backend that implements the full Beacon OS specification from `/docs/BEACONS.md`. No database required - everything runs in memory with mock data.

### What It Demonstrates

✅ Universal scan pipeline (`/l/:code` and `/x/:payload.:sig`)  
✅ 4 beacon types: presence, transaction, social, care  
✅ 6 demo beacons with real flows  
✅ XP calculation and caps  
✅ Geo-based check-ins  
✅ Signed beacon validation (HMAC-SHA256)  
✅ Type-specific handlers  

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Server runs on http://localhost:3001
```

## 📝 Demo Beacons

Visit these URLs in your browser to see JSON responses:

### Presence - Check-in
```
http://localhost:3001/l/DEMO_CHECKIN
http://localhost:3001/l/DEMO_CHECKIN?lat=51.5136&lng=-0.1357
```

### Transaction - Ticket
```
http://localhost:3001/l/DEMO_TICKET
http://localhost:3001/l/DEMO_TICKET?mode=validate
```

### Transaction - Product
```
http://localhost:3001/l/DEMO_PRODUCT
```

### Social - Person (Hook-up)
```
http://localhost:3001/l/DEMO_PERSON
```

### Social - Room
```
http://localhost:3001/l/DEMO_ROOM
```

### Care - Hand N Hand
```
http://localhost:3001/l/DEMO_HNH
```

## 📊 Response Format

All endpoints return JSON in this format:

```json
{
  "ok": true,
  "action": "checkin",
  "beacon": {
    "id": "b_checkin",
    "code": "DEMO_CHECKIN",
    "type": "presence",
    "subtype": "checkin",
    "label": "Soho Sauna Check-in",
    "status": "active"
  },
  "xp_awarded": 25,
  "ui": {
    "kind": "checkin",
    "venue_id": "venue_001",
    "insideVenue": true,
    "message": "You've checked in (demo)."
  }
}
```

The `ui` object varies by beacon type/subtype.

## 🔐 Signed Beacons (`/x/`)

To test signed beacons, you'll need to generate the signed payload:

```typescript
// Example: Generate signed URL
import crypto from 'crypto';

const BEACON_SECRET = 'dev-secret';

const payload = {
  code: 'DEMO_PERSON',
  nonce: crypto.randomUUID(),
  exp: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
  kind: 'person'
};

const payloadB64 = Buffer.from(JSON.stringify(payload))
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');

const sig = crypto.createHmac('sha256', BEACON_SECRET)
  .update(payloadB64)
  .digest('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');

const signedUrl = `/x/${payloadB64}.${sig}`;
console.log('Signed URL:', signedUrl);
```

## 🛠️ Project Structure

```
beacon-backend/
├── src/
│   ├── types/
│   │   ├── beacon.ts           # Beacon data models
│   │   └── signedBeacon.ts     # Signed payload model
│   ├── services/
│   │   ├── beacons.ts          # Beacon lookup
│   │   ├── beaconScan.ts       # Universal scan pipeline
│   │   ├── scanEvents.ts       # Event logging + geo
│   │   ├── xp.ts               # XP engine
│   │   ├── ticketFlows.ts      # Ticket handling
│   │   ├── ticketResaleFlows.ts
│   │   ├── productFlows.ts     # Product/drop handling
│   │   ├── personFlows.ts      # Hook-up QR handling
│   │   ├── roomFlows.ts        # Room joining
│   │   └── careFlows.ts        # Care/HNH handling
│   ├── routes/
│   │   ├── l.ts                # /l/:code handler
│   │   └── x.ts                # /x/:slug handler
│   ├── mockData.ts             # Demo beacons + data
│   └── index.ts                # Express server
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Testing Different Flows

### Check-in (Geo-gated)

```bash
# Outside venue (no XP)
curl http://localhost:3001/l/DEMO_CHECKIN

# Inside venue (25 XP)
curl "http://localhost:3001/l/DEMO_CHECKIN?lat=51.5136&lng=-0.1357"
```

### Ticket Door Scan

```bash
# View ticket
curl http://localhost:3001/l/DEMO_TICKET

# Validate ticket (door scan)
curl "http://localhost:3001/l/DEMO_TICKET?mode=validate"

# Try again (should show "scanned" status)
curl "http://localhost:3001/l/DEMO_TICKET?mode=validate"
```

### Product View

```bash
curl http://localhost:3001/l/DEMO_PRODUCT
```

## 🔄 Integration with Vite Frontend

Add to your `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/l': 'http://localhost:3001',
      '/x': 'http://localhost:3001'
    }
  }
});
```

Then in your React app:

```typescript
fetch('/l/DEMO_CHECKIN')
  .then(res => res.json())
  .then(data => {
    console.log('Beacon scan:', data);
    // Render based on data.ui.kind
  });
```

## 📚 Next Steps

1. **Connect to Real Database**: Replace `mockData.ts` with Supabase queries
2. **Add Auth**: Replace stub user with real JWT validation
3. **Add Payment**: Wire Stripe for product/ticket flows
4. **Add Messaging**: Wire room joins to actual chat system
5. **Deploy**: Add production config and deploy to Edge Functions

## 🔗 Documentation

- Full spec: `/docs/BEACONS.md`
- API contracts: `/docs/API_BEACONS.md`
- Quick start: `/docs/BEACON_OS_QUICK_START.md`

---

**Built with care for the queer nightlife community** 🖤💗
