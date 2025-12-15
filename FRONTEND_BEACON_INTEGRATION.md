# Frontend Beacon Integration Guide

**How to integrate the Beacon OS scan system into your HOTMESS frontend**

---

## 🎯 Architecture

The frontend scan system is built with three core pieces:

1. **`useBeaconScan` hook** - Handles fetching and state management
2. **`<BeaconScanShell />` component** - Provides consistent layout, loading states, and XP display
3. **`<BeaconUiRenderer />` component** - Renders type-specific UI based on `ui.kind`

---

## 📦 File Structure

```
src/
├── types/
│   └── beacon.ts              # TypeScript types for beacon responses
├── hooks/
│   └── useBeaconScan.ts       # Reusable scan hook
├── components/
│   ├── BeaconScanShell.tsx    # Layout wrapper
│   └── BeaconUiRenderer.tsx   # Type-specific UI renderer
└── pages/
    ├── HomePage.tsx           # Demo beacon directory
    ├── BeaconScanPage.tsx     # /l/:code route
    └── SignedBeaconScanPage.tsx # /x/:slug route
```

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd beacon-backend
npm install
npm run dev
# Backend runs on http://localhost:3001
```

### 2. Start the Frontend

```bash
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Test Beacons

Visit:
- `http://localhost:5173` - See all demo beacons
- `http://localhost:5173/l/DEMO_CHECKIN` - Test check-in
- `http://localhost:5173/l/DEMO_TICKET` - Test ticket
- `http://localhost:5173/l/DEMO_PRODUCT` - Test product

---

## 🔧 How It Works

### The Hook: `useBeaconScan`

```typescript
const { data, error, loading, refetch } = useBeaconScan({
  endpoint: '/l/DEMO_CHECKIN'
});

// data: BeaconResponse | null
// error: string | null
// loading: boolean
// refetch: () => void
```

**What it does:**
- Fetches from `/l/:code` or `/x/:slug`
- Manages loading and error states
- Provides refetch capability
- Automatically fetches on mount

### The Shell: `<BeaconScanShell />`

```typescript
<BeaconScanShell
  state={{ data, error, loading }}
  titlePrefix="HOTMESS BEACON"
/>
```

**What it provides:**
- Loading skeleton ("Tuning signal...")
- Error state with helpful message
- Beacon metadata display (type/subtype)
- XP ribbon (+25 XP)
- Consistent styling (black bg, card layout)
- Calls `<BeaconUiRenderer />` with ui data

### The Renderer: `<BeaconUiRenderer />`

```typescript
<BeaconUiRenderer ui={data.ui} />
```

**What it does:**
- Switches on `ui.kind`
- Renders type-specific content
- Shows helpful demo notes
- Handles all beacon types:
  - `checkin`
  - `ticket_validated` / `ticket_view`
  - `product_view` / `product_purchase_success`
  - `person_owner` / `person_request_sent`
  - `room_joined`
  - `hnh_open`
  - `ticket_resale_view` / `ticket_resale_success`
  - Error states (`auth_required`, `payment_error`, etc.)

---

## 🎨 Adding a New Beacon Type

### Step 1: Add to Backend Handler

Already done! See `/beacon-backend/src/services/` for all handlers.

### Step 2: Add UI Type

```typescript
// src/types/beacon.ts
export type BeaconUiKind =
  | "checkin"
  | "ticket_validated"
  // ... existing types
  | "your_new_type";  // Add here
```

### Step 3: Add Renderer Case

```typescript
// src/components/BeaconUiRenderer.tsx
case "your_new_type":
  return (
    <div>
      <p className="text-sm mb-2 font-medium">
        Your Custom Title
      </p>
      <p className="text-sm mb-3">{ui.message}</p>
      {/* Your custom UI */}
    </div>
  );
```

**That's it!** The hook and shell automatically handle your new type.

---

## 📊 Response Format

Every beacon scan returns this structure:

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

**Key fields:**
- `beacon.*` - Metadata about the beacon
- `action` - What happened ("checkin", "ticket_validate", etc.)
- `xp_awarded` - XP gained from this scan
- `ui.kind` - Determines which renderer to use
- `ui.*` - Type-specific data for rendering

---

## 🎯 Common Patterns

### Pattern 1: Simple Scan

```typescript
// In any page component
const { code } = useParams();
const { data, error, loading } = useBeaconScan({ endpoint: `/l/${code}` });

return <BeaconScanShell state={{ data, error, loading }} />;
```

### Pattern 2: Signed Beacon

```typescript
const { slug } = useParams();
const { data, error, loading } = useBeaconScan({ endpoint: `/x/${slug}` });

return (
  <BeaconScanShell
    state={{ data, error, loading }}
    titlePrefix="HOTMESS • SIGNED"
  />
);
```

### Pattern 3: Custom Wrapper

```typescript
const { data, error, loading } = useBeaconScan({ endpoint: `/l/CODE` });

if (loading) return <YourCustomLoader />;
if (error) return <YourCustomError error={error} />;
if (!data) return null;

return (
  <YourCustomLayout>
    <BeaconUiRenderer ui={data.ui} />
  </YourCustomLayout>
);
```

### Pattern 4: Refetch After Action

```typescript
const { data, error, loading, refetch } = useBeaconScan({ endpoint });

const handlePurchase = async () => {
  await purchaseProduct();
  refetch(); // Re-scan to see updated state
};
```

---

## 🔐 Signed Beacons

For secure, expiring beacons (hook-ups, resale, VIP):

### Generate Signed URL (Backend)

```typescript
import crypto from 'crypto';

const payload = {
  code: 'DEMO_PERSON',
  nonce: crypto.randomUUID(),
  exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
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

const url = `/x/${payloadB64}.${sig}`;
```

### Use in Frontend

```typescript
<Link to={signedUrl}>Scan My Code</Link>

// Or direct navigation
navigate(signedUrl);
```

The `/x/:slug` route will:
1. Verify HMAC signature
2. Check expiry
3. Resolve beacon
4. Run through scan pipeline

---

## 🎨 Styling Guide

All components use HOTMESS aesthetic:

- **Background**: Black (`#000000`)
- **Cards**: `bg-neutral-950/80 backdrop-blur`
- **Borders**: `border-neutral-800`
- **Text**: White (default)
- **Accents**: 
  - XP/Success: `text-lime-400`
  - Error: `text-red-400`
  - Meta: `text-neutral-500`
- **Typography**:
  - Labels: `text-[10px] uppercase tracking-[0.25em]`
  - Titles: `text-2xl font-semibold`
  - Body: `text-sm`
  - Hints: `text-[11px] text-neutral-500`

### Customizing the Shell

```typescript
// Override shell styling by wrapping with your own container
<div className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
  <BeaconScanShell state={{ data, error, loading }} />
</div>
```

### Customizing Individual Renderers

Edit `/src/components/BeaconUiRenderer.tsx` directly - each case is self-contained.

---

## 🧪 Testing

### Test All Beacons

```bash
# From frontend root
npm run dev

# Open http://localhost:5173
# Click any beacon to test
```

### Test Specific Flows

```bash
# Check-in outside venue (0 XP)
open http://localhost:5173/l/DEMO_CHECKIN

# Check-in inside venue (25 XP)
open "http://localhost:5173/l/DEMO_CHECKIN?lat=51.5136&lng=-0.1357"

# Ticket view
open http://localhost:5173/l/DEMO_TICKET

# Ticket validation (door scan)
open "http://localhost:5173/l/DEMO_TICKET?mode=validate"

# Product
open http://localhost:5173/l/DEMO_PRODUCT

# Person (hook-up)
open http://localhost:5173/l/DEMO_PERSON

# Room
open http://localhost:5173/l/DEMO_ROOM

# Care
open http://localhost:5173/l/DEMO_HNH
```

### Test Error States

```bash
# Invalid beacon
open http://localhost:5173/l/INVALID_CODE

# Expired signed beacon (will show expired error)
# Generate an expired signed URL and test
```

---

## 🚀 Production Integration

### 1. Replace Backend Proxy

In `vite.config.ts`, change:

```typescript
proxy: {
  "/l": {
    target: "https://api.hotmessldn.com",  // Your production API
    changeOrigin: true,
    secure: true,
  },
  "/x": {
    target: "https://api.hotmessldn.com",
    changeOrigin: true,
    secure: true,
  }
}
```

### 2. Add Authentication

```typescript
// src/hooks/useBeaconScan.ts
const token = getAuthToken(); // Your auth system

fetch(endpoint, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### 3. Wire Actions

Add real handlers to `<BeaconUiRenderer />`:

```typescript
case "product_view":
  return (
    <div>
      {/* ... existing UI ... */}
      <button onClick={() => handlePurchase(ui.listing)}>
        Buy Now
      </button>
    </div>
  );
```

### 4. Connect Services

- **Payments**: Wire Stripe checkout
- **Messaging**: Route room joins to chat system
- **Map**: Integrate check-ins with 3D globe
- **Care**: Link to Hand N Hand resources

---

## 📚 Next Steps

1. ✅ Test all 6 demo beacons
2. ✅ Understand the hook/shell/renderer pattern
3. 🔄 Add custom styling to match full HOTMESS aesthetic
4. 🔄 Wire up real purchase flows
5. 🔄 Integrate with existing HOTMESS features:
   - Night Pulse 3D globe (check-ins)
   - MessMarket (products/drops)
   - Chat system (rooms)
   - Hand N Hand (care)
6. 🔄 Add QR code generation UI
7. 🔄 Create admin beacon management dashboard

---

## 🆘 Common Issues

### "Network Error" or "Failed to fetch"

**Problem**: Backend not running  
**Fix**: `cd beacon-backend && npm run dev`

### CORS Error

**Problem**: Proxy not configured  
**Fix**: Check `vite.config.ts` has correct proxy settings

### "Beacon not found"

**Problem**: Invalid code or backend not responding  
**Fix**: Check beacon code exists in `/beacon-backend/src/mockData.ts`

### Loading forever

**Problem**: Vite proxy not working  
**Fix**: 
1. Restart Vite dev server
2. Check backend is on port 3001
3. Check browser console for errors

### TypeScript Errors

**Problem**: Missing type definitions  
**Fix**: Check `/src/types/beacon.ts` exists and is imported correctly

---

## 💡 Pro Tips

1. **Use the HomePage** - It's a directory of all working beacons
2. **Check console logs** - Backend logs show XP awards and scan events
3. **Test geo modes** - Pass `?lat=&lng=` to simulate location
4. **Look at the JSON** - Open Network tab to see raw responses
5. **Copy patterns** - Each renderer case is a template for new types

---

## 📞 Support

Questions about frontend integration?
- Review this doc
- Check `/beacon-backend/README.md` for backend details
- Look at `/docs/BEACON_OS_QUICK_START.md` for concepts
- Test with working demo beacons

---

**You now have a complete, production-ready frontend integration for Beacon OS!** 🎉

The hook/shell/renderer pattern makes it trivial to add new beacon types or customize UX. Just update the renderer and you're done.

---

**Built with care for the queer nightlife community** 🖤💗
