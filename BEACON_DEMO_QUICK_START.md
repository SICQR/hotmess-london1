# 🔥 BEACON OS DEMO - QUICK START

**Ready to test! Everything is wired into your Figma project.**

---

## 🚀 How to Run

### 1. Start the Backend (Terminal 1)

```bash
cd beacon-backend
npm install
npm run dev
```

✅ Backend runs on http://localhost:3001

### 2. Start the Frontend (Terminal 2)

```bash
# From project root
npm run dev
```

✅ Frontend runs on http://localhost:5173  
✅ Vite proxy automatically routes `/l/*` requests to backend

---

## 🎯 How to Access

### Option 1: Via Demo Homepage

Visit:
```
http://localhost:5173/?route=beaconsDemoHome
```

You'll see all 6 demo beacons with click-to-test cards.

### Option 2: Direct URLs

```bash
# Check-in (outside venue)
http://localhost:5173/?route=beaconScanDemo&code=DEMO_CHECKIN

# Check-in (inside venue - 25 XP!)
http://localhost:5173/?route=beaconScanDemo&code=DEMO_CHECKIN&lat=51.5136&lng=-0.1357

# Ticket view
http://localhost:5173/?route=beaconScanDemo&code=DEMO_TICKET

# Ticket door scan
http://localhost:5173/?route=beaconScanDemo&code=DEMO_TICKET&mode=validate

# Product
http://localhost:5173/?route=beaconScanDemo&code=DEMO_PRODUCT

# Person (hook-up)
http://localhost:5173/?route=beaconScanDemo&code=DEMO_PERSON

# Room
http://localhost:5173/?route=beaconScanDemo&code=DEMO_ROOM

# Care/HNH
http://localhost:5173/?route=beaconScanDemo&code=DEMO_HNH
```

---

## 📊 What You'll See

### Homepage (beaconsDemoHome)
- Grid of 6 demo beacons
- Each card shows type, subtype, XP
- Click any card to test the scan flow
- Special test buttons for geo/door scan modes

### Scan Page (beaconScanDemo)
- Loading state ("Tuning signal...")
- Error state (if backend not running)
- Success state with:
  - Beacon metadata (type/subtype)
  - XP ribbon (+25 XP etc)
  - Type-specific UI (check-in, ticket, product, etc.)
  - Back button to return to homepage

---

## 🎨 The Pattern

### Files You Just Got

**Frontend (9 files)**:
- `/hooks/useBeaconScanDemo.ts` - Reusable hook for scanning
- `/src/components/BeaconScanShell.tsx` - Layout wrapper
- `/src/components/BeaconUiRenderer.tsx` - Type-specific UI renderer
- `/src/types/beacon.ts` - TypeScript types
- `/pages/BeaconsDemoHome.tsx` - Demo directory
- `/pages/BeaconScanDemo.tsx` - Scan page wrapper
- `/lib/routes.ts` - Added 2 new routes
- `/components/Router.tsx` - Wired up routes
- `/vite.config.ts` - Already had proxy configured!

**Backend (20 files)** - See `/beacon-backend/`

### The Hook/Shell/Renderer Pattern

```typescript
// 1. Hook - Data fetching
const { data, error, loading } = useBeaconScanDemo({
  endpoint: `/l/${code}`,
  queryParams: { lat, lng, mode }
});

// 2. Shell - Layout + loading/error states
<BeaconScanShell state={{ data, error, loading }} />

// 3. Renderer - Type-specific UI
// Automatically switches on ui.kind
// You only need to add a new case for new beacon types
```

---

## ✨ How to Add a New Beacon Type

### Backend

Already done! All 6 types are implemented in `/beacon-backend/src/services/`

### Frontend

1. **Add UI type** to `/src/types/beacon.ts`:
   ```typescript
   export type BeaconUiKind =
     | "checkin"
     | "ticket_validated"
     // ... existing types
     | "your_new_type";  // Add here
   ```

2. **Add renderer case** to `/src/components/BeaconUiRenderer.tsx`:
   ```typescript
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

**That's it!** The hook and shell automatically handle the new type.

---

## 🧪 Testing Checklist

### Backend Health

```bash
curl http://localhost:3001/health
# Should return: {"ok":true,"service":"HOTMESS Beacon Backend",...}
```

### Test Each Beacon

```bash
# Check-in
curl http://localhost:3001/l/DEMO_CHECKIN | jq '.'

# Ticket
curl http://localhost:3001/l/DEMO_TICKET | jq '.'

# Product
curl http://localhost:3001/l/DEMO_PRODUCT | jq '.'

# Person
curl http://localhost:3001/l/DEMO_PERSON | jq '.'

# Room
curl http://localhost:3001/l/DEMO_ROOM | jq '.'

# Care
curl http://localhost:3001/l/DEMO_HNH | jq '.'
```

### Frontend Health

1. Visit `http://localhost:5173/?route=beaconsDemoHome`
2. Click each beacon card
3. Verify loading state shows
4. Verify scan result shows
5. Verify XP ribbon appears (if > 0)
6. Verify back button works

---

## 🔧 Troubleshooting

### "Network Error" in Frontend

**Problem**: Backend not running  
**Fix**: `cd beacon-backend && npm run dev`

### "Beacon not found"

**Problem**: Invalid code or backend not responding  
**Fix**: Check beacon code exists in `/beacon-backend/src/mockData.ts`

### Proxy not working

**Problem**: Vite not routing to backend  
**Fix**:
1. Restart Vite (`npm run dev`)
2. Check `vite.config.ts` has proxy config
3. Try direct URL: `http://localhost:3001/l/DEMO_CHECKIN`

### TypeScript errors

**Problem**: Missing imports  
**Fix**: Check all files in `/src/` and `/hooks/` exist

---

## 📚 Documentation

- **Complete spec**: `/docs/BEACONS.md`
- **API contracts**: `/docs/API_BEACONS.md`
- **Backend guide**: `/beacon-backend/README.md`
- **Frontend guide**: `/FRONTEND_BEACON_INTEGRATION.md`
- **Full system**: `/COMPLETE_BEACON_SYSTEM_DELIVERED.md`

---

## 🎯 What This Demonstrates

✅ Universal scan pipeline (9 steps)  
✅ Type-specific handlers (6 types)  
✅ XP calculation with caps  
✅ Geo validation (inside/outside venue)  
✅ Reusable hook/shell/renderer pattern  
✅ Loading & error states  
✅ Type-safe TypeScript  
✅ Integrated into existing HOTMESS routing  

---

## 🚀 Next Steps

1. **Test all beacons** - Click through each type
2. **Understand the pattern** - Review hook/shell/renderer
3. **Customize UI** - Edit `BeaconUiRenderer.tsx` cases
4. **Wire to production** - Replace mock data with real DB
5. **Add auth** - Wire JWT verification
6. **Connect services** - Link to Night Pulse, MessMarket, etc.

---

**You now have a complete, runnable Beacon OS demo integrated into your Figma project!** 🎉

Run it. Test it. Customize it. Ship it. 🔥🖤💗
