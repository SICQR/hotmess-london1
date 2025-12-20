# 🌍 HOW TO ACCESS NIGHT PULSE

**You're seeing old pages because you need to navigate to the new route.**

---

## ✅ QUICK ACCESS

### Option 1: Direct URL (Fastest)
**Click this URL or paste in your browser:**
```
?route=nightPulse
```

### Option 2: From Homepage
1. Navigate to: `?route=home`
2. Look for the **"🌍 NIGHT PULSE GLOBE"** button
3. Click it (should be bright hot pink)

### Option 3: From Navigation
1. Open the app
2. Look for the **Globe icon** (🌍) in the navigation
3. Click it

---

## 🔧 IF YOU STILL DON'T SEE IT

### Step 1: Hard Refresh
Clear your browser cache:
- **Windows/Linux:** Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** Press `Cmd + Shift + R`

### Step 2: Check Console
Open browser dev tools (F12) and check for errors:
```javascript
// You should see these logs:
console.log('✅ Mapbox loaded');
console.log('✅ Globe projection set');
console.log('✅ All layers added');
```

### Step 3: Verify Route Works
Test the route directly:
```
?route=nightPulse
```

---

## 📍 AVAILABLE ROUTES

All routes use the `?route=` parameter:

### New Features
- `?route=nightPulse` — **Night Pulse 3D Globe** ⭐ NEW
- `?route=beacons` — Beacons page
- `?route=map` — MessMap

### Core Pages
- `?route=home` — Homepage (with Night Pulse button)
- `?route=tickets` — Tickets marketplace
- `?route=messmarket` — MessMarket
- `?route=records` — Records label
- `?route=shop` — Shop
- `?route=care` — Care/HNH
- `?route=radio` — Radio player

### Account
- `?route=account` — Account settings
- `?route=login` — Login page
- `?route=signup` — Sign up

---

## 🎯 WHAT YOU SHOULD SEE

When you navigate to `?route=nightPulse`, you should see:

1. **Black background** with hot pink accents
2. **3D rotating globe** (Mapbox GL JS)
3. **31 pulsing venue markers** worldwide:
   - London (10 venues)
   - Berlin (5 venues)
   - New York (5 venues)
   - San Francisco (3 venues)
   - Los Angeles (1 venue)
   - Amsterdam (2 venues)
   - Sydney (2 venues)
   - Paris (2 venues)
   - Barcelona (1 venue)

4. **Time window buttons** at top:
   - TONIGHT (default, hot pink)
   - WEEKEND
   - 30 DAYS

5. **Legend panel** on left side
6. **Controls panel** on right side
7. **Interactive globe:**
   - Drag to rotate
   - Scroll to zoom
   - Click markers to see city details

8. **City detail panel** (when you click a marker):
   - City name
   - Country
   - Beacon scans count
   - Active users
   - Coordinates
   - "VIEW BEACONS" button

---

## 🚨 TROUBLESHOOTING

### Issue: "Route not found" or error page
**Solution:** Make sure you're using the exact route name:
```
?route=nightPulse
```
(Note the capital P in "Pulse")

### Issue: Blank screen
**Solution:** 
1. Check browser console for errors (F12)
2. Verify Mapbox token is valid
3. Check internet connection (Mapbox tiles need to load)

### Issue: No markers showing
**Solution:**
- Wait 2-3 seconds for Mapbox to initialize
- Check console for "✅ Updated map with 31 venues"
- Try zooming out

### Issue: Can't interact with globe
**Solution:**
- Make sure the map container loaded
- Try refreshing the page
- Check if any modal/overlay is blocking interaction

---

## ✅ VERIFICATION CHECKLIST

When Night Pulse loads correctly, you should see:

- [ ] Black background with hot pink accents
- [ ] 3D globe rotating smoothly
- [ ] 31 venue markers (hot pink pulsing dots)
- [ ] Time window buttons (TONIGHT/WEEKEND/30 DAYS)
- [ ] Legend panel on left
- [ ] Controls panel on right
- [ ] Can drag to rotate globe
- [ ] Can scroll to zoom
- [ ] Can click markers
- [ ] City detail panel appears on marker click
- [ ] No errors in console

**If all boxes are checked → Night Pulse is working perfectly!** ✅

---

## 📊 DEMO DATA

Night Pulse currently uses **static demo data** with 31 real gay nightlife venues:

### London (10)
- Heaven, Royal Vauxhall Tavern, The Glory, Dalston Superstore, Eagle London, XXL, Horse Meat Disco @ QEII, Circa, The Yard, G-A-Y Bar

### Berlin (5)
- Berghain, SchwuZ, Laboratory, Ficken 3000, Monster Ronson's

### New York (5)
- The Eagle NYC, Phoenix Bar, Therapy NYC, Industry Bar, The Ritz

### San Francisco (3)
- The Eagle SF, Powerhouse Bar, The Stud

### Other Cities
- Los Angeles (The Abbey)
- Amsterdam (Church, Prik)
- Sydney (ARQ, Imperial)
- Paris (Le Depot, CUD)
- Barcelona (Metro Disco)

**All markers are interactive!** Click to see city stats.

---

## 🔗 DIRECT LINKS

**Copy and paste these into your browser:**

```
Home:         ?route=home
Night Pulse:  ?route=nightPulse
Beacons:      ?route=beacons
Map:          ?route=map
Tickets:      ?route=tickets
```

---

## 💡 TIP

**Bookmark this URL for quick access:**
```
?route=nightPulse
```

Or add it to your navigation bar.

---

**Need help?** Check the console (F12) for error messages.  
**Still stuck?** Share the console output for debugging.

**Ready to explore the globe?** 🌍✨
