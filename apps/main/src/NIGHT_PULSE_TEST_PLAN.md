# NIGHT PULSE - End-to-End Test Plan

## ✅ Component Integration Tests

### 1. **Homepage → Night Pulse Navigation**
- [ ] Go to Homepage (`/`)
- [ ] Locate "🌍 NIGHT PULSE GLOBE" button
- [ ] Click button → should navigate to `/nightPulse`
- [ ] Page should load without errors

### 2. **Mapbox Globe Rendering**
- [ ] Globe should display within 2-3 seconds
- [ ] Should see "LOADING NIGHT PULSE..." message initially
- [ ] Message should disappear when globe loads
- [ ] Console should show:
  - `✅ Mapbox loaded`
  - `✅ Globe projection set`
  - `✅ Fog enabled`
  - `✅ All layers added`

### 3. **Venue Markers**
- [ ] Should see **31 hot pink markers** on globe
- [ ] Markers should be located in:
  - **London** (10 venues)
  - **Berlin** (5 venues)
  - **New York** (5 venues)
  - **San Francisco** (3 venues)
  - **Los Angeles** (1 venue)
  - **Amsterdam** (2 venues)
  - **Sydney** (2 venues)
  - **Paris** (2 venues)
  - **Barcelona** (1 venue)
- [ ] Markers should pulse/glow with animation
- [ ] Marker colors should vary by activity level:
  - **Hot Pink (#ff1694)**: 100+ scans (Berghain, ARQ Sydney, Le Depot, Heaven, etc.)
  - **Pink (#ff0080)**: 10-99 scans (most venues)
  - **Red (#e70f3c)**: 1-9 scans (XXL London, Monster Ronson's)

### 4. **Globe Interactions**
- [ ] **Drag**: Should rotate globe smoothly
- [ ] **Scroll**: Should zoom in/out
- [ ] **Hover over marker**: Cursor should change to pointer
- [ ] **Zoom in**: Venue labels should appear

### 5. **Time Window Filters**
- [ ] Three buttons in header: **TONIGHT**, **WEEKEND**, **30 DAYS**
- [ ] **TONIGHT** should be selected by default (hot pink background)
- [ ] Click **WEEKEND** → button should turn hot pink
- [ ] Click **30 DAYS** → button should turn hot pink
- [ ] Console should log data updates (if useLiveData enabled)

### 6. **City Detail Panel**
- [ ] Click any venue marker on globe
- [ ] City detail panel should slide up from bottom
- [ ] Panel should show:
  - City name (bold, large)
  - Country name
  - **Beacon Scans** stat card
  - **Active Users** stat card (60% of scans)
  - **Coordinates** in lat/lng format
  - **VIEW BEACONS** button
- [ ] Click **X** or back arrow → panel should close
- [ ] Click **VIEW BEACONS** → should navigate to `/beacons`

### 7. **Legend & Instructions**
- [ ] Left panel should show **HEAT INTENSITY** legend with 3 colors
- [ ] Right panel should show **CONTROLS** instructions
- [ ] Both panels should have dark background with border

### 8. **Back Navigation**
- [ ] Click **←** back arrow in header
- [ ] Should navigate back to `/home`

---

## 🔌 Backend Integration Tests (Optional - Requires Live Beacons)

### 9. **Heat API - Live Data Mode**
To enable live data mode, pass `useLiveData={true}` to `<MapboxGlobe>`:

```tsx
<MapboxGlobe 
  timeWindow={timeWindow}
  onCityClick={setSelectedCity}
  useLiveData={true}  // Enable Heat API
/>
```

- [ ] Check console for API request:
  ```
  GET /api/heat/heat?window=tonight
  ```
- [ ] Should see response with GeoJSON FeatureCollection
- [ ] If no beacons exist, should fallback to demo data
- [ ] Console should show:
  ```
  ✅ Loaded X live venues from Heat API
  ```
  OR
  ```
  ℹ️ No live data, using demo venues
  ```

### 10. **Time Window API Updates**
- [ ] Switch time window to **WEEKEND**
- [ ] API should be called with `?window=weekend`
- [ ] Switch to **30 DAYS**
- [ ] API should be called with `?window=month`
- [ ] Map markers should update if live data available

---

## 🎨 Visual Quality Checks

### 11. **HOTMESS Aesthetic**
- [ ] Black background throughout
- [ ] Hot pink accent colors (#ff1694, #ff0080)
- [ ] White text for readability
- [ ] Proper typography (no Tailwind text classes visible)
- [ ] Smooth animations and transitions
- [ ] Professional globe atmosphere glow

### 12. **Responsive Behavior**
- [ ] Desktop: Globe fills viewport height properly
- [ ] City panel doesn't cover markers
- [ ] Header stays fixed at top
- [ ] All UI elements readable and accessible

---

## 🐛 Error Handling Tests

### 13. **Mapbox Errors**
- [ ] No console errors about map container
- [ ] No CSS loading warnings
- [ ] Globe projection sets successfully
- [ ] Fog effects apply without errors

### 14. **Network Failures**
If `useLiveData={true}`:
- [ ] Disable network in DevTools
- [ ] Reload page
- [ ] Should fallback to demo venues
- [ ] Console should show error but app continues working

---

## 📊 Performance Tests

### 15. **Load Time**
- [ ] Initial page load: < 2 seconds
- [ ] Globe render: < 3 seconds
- [ ] Smooth 60fps rotation
- [ ] No lag when clicking markers

### 16. **Memory**
- [ ] Check DevTools Performance tab
- [ ] No memory leaks
- [ ] Animation frame cleanup on unmount

---

## ✅ Acceptance Criteria

**The Night Pulse feature is ready for production when:**

1. ✅ All 31 venue markers display correctly on globe
2. ✅ Globe rotates, zooms, and responds to interactions
3. ✅ Clicking markers shows city detail panel with accurate data
4. ✅ Time window filters update the UI
5. ✅ No console errors or warnings
6. ✅ Navigation to/from Night Pulse works perfectly
7. ✅ HOTMESS aesthetic is maintained (dark/pink/white)
8. ✅ Pulsing animations run smoothly
9. ✅ Works in both demo data and live data modes
10. ✅ All UI text uses inline styles (no Tailwind typography classes)

---

## 🚀 Deployment Checklist

Before deploying Night Pulse to production:

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on desktop and mobile viewports
- [ ] Verify Mapbox access token is valid
- [ ] Confirm Heat API endpoints are deployed
- [ ] Check that demo data is accurate
- [ ] Review console for any warnings
- [ ] Performance audit passes (Lighthouse)
- [ ] Accessibility audit passes (ARIA labels, keyboard nav)

---

## 📝 Notes

**Demo vs Live Data:**
- By default, Night Pulse uses **static demo data** (31 venues)
- This ensures the globe always has content to display
- Enable `useLiveData` prop only when beacons are deployed
- Live data automatically falls back to demo if API fails

**Current Data Source:**
- Static demo data embedded in `MapboxGlobe.tsx`
- Represents real gay nightlife venues worldwide
- Scan counts are realistic estimates for demo purposes

**Future Enhancements:**
- Real-time WebSocket updates for scan activity
- Venue photos in city detail panel
- "Now Playing" music integration
- Event listings per city
- Filter by music genre/vibe
