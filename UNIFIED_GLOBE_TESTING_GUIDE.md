# UnifiedGlobe Testing Guide

## Overview
This guide provides instructions for testing the new UnifiedGlobe component that replaces multiple globe implementations across the application.

## What Changed

### New Component
- **`src/components/globe/UnifiedGlobe.tsx`** - A single, unified 3D globe visualization component

### Updated Pages
1. **NightPulse** (`/night-pulse`) - Now uses UnifiedGlobe with realtime city data
2. **MapPage** (`/map`) - Now uses UnifiedGlobe with beacon markers and layer toggles

### Navigation Flow
```
Beacons Page → Click "Night Pulse Globe" → NightPulse Page (with UnifiedGlobe)
Home → Map → MapPage (with UnifiedGlobe)
```

## How to Test

### 1. NightPulse Page Testing

#### Access
1. Navigate to `/night-pulse` or click "Night Pulse Globe" from `/beacons`

#### Expected Behavior
- ✅ Globe should render with a dark background and pink glow (#ff1694)
- ✅ City markers should appear as pulsing spheres
- ✅ Stars should be visible in the background
- ✅ Stats overlay should show: "X CITIES" with last update time
- ✅ Globe should auto-rotate slowly when not interacting

#### Interactions
- **Mouse Drag**: Rotate the globe
- **Mouse Wheel**: Zoom in/out
- **Right-click + Drag**: Pan camera
- **Click City Marker**: Should show city details panel at bottom with:
  - City name and country
  - Active beacons count (or "Activity" if <5 for privacy)
  - Scans per hour
  - Heat intensity percentage
  - "VIEW BEACONS" button

#### Realtime Updates
- City markers should update automatically every 60 seconds
- Recent activity (within 5 minutes) should show enhanced pulsing
- Stats overlay should update with new timestamp

#### Visual Checklist
- [ ] Globe renders without glitches
- [ ] Pink atmospheric glow is visible
- [ ] City markers pulse smoothly
- [ ] No console errors
- [ ] Zoom level indicator updates in bottom-left
- [ ] Controls info visible in bottom-right

### 2. MapPage Testing

#### Access
1. Navigate to `/map`

#### Expected Behavior
- ✅ Globe should render with dark background
- ✅ Beacon markers should appear as colored spheres based on intensity
- ✅ Top bar should show 2D/3D toggle (3D should be active)
- ✅ Layer toggle pills should work (PINS, HEAT, TRAILS, CITIES)

#### Layer Toggles
Test each toggle button in the top bar:

1. **PINS Toggle**
   - ON: Beacon markers visible
   - OFF: Beacon markers hidden
   
2. **HEAT Toggle**
   - ON: Heat map overlay visible (semi-transparent colored sprites)
   - OFF: Heat map hidden
   
3. **TRAILS Toggle**
   - ON: Connection lines between recent beacons
   - OFF: Trails hidden
   
4. **CITIES Toggle**
   - ON: City labels/markers visible
   - OFF: City labels hidden

#### Beacon Interactions
- **Hover Beacon**: Should scale up and change cursor to pointer
- **Click Beacon**: Should:
  - Select the beacon
  - Show detail panel on right side with:
    - Beacon title and type
    - City location
    - XP amount
    - Countdown timer (if time-limited)
    - "COPY CODE" and "OPEN BEACON" buttons

#### Filters
- **Search**: Type in search bar should filter beacons
- **Type Filter**: Select beacon type should show only that type
- **Time Mode**: Toggle between LIVE, 10M, 1H, 24H

#### Visual Checklist
- [ ] Globe renders correctly
- [ ] Beacon markers appear and are clickable
- [ ] Layer toggles work for all layers
- [ ] Beacon selection shows detail panel
- [ ] Search and filter work
- [ ] No console errors
- [ ] UI controls are responsive

### 3. Mobile Testing

#### Test on Mobile Viewport
1. Resize browser to mobile width (< 768px) or use device emulator
2. Test both NightPulse and MapPage

#### Mobile Checklist
- [ ] Globe renders and fills viewport
- [ ] Touch drag rotates globe
- [ ] Pinch zoom works
- [ ] City/beacon clicks work with touch
- [ ] UI overlays are readable and accessible
- [ ] No horizontal scroll
- [ ] Performance is acceptable (no lag)

### 4. Performance Testing

#### Metrics to Check
- **Target**: 60 FPS animation
- **Loading**: Globe should load within 2-3 seconds
- **Memory**: No memory leaks (check DevTools Memory tab)

#### Performance Checklist
- [ ] Smooth rotation at 60 FPS
- [ ] Marker animations are fluid
- [ ] No frame drops during interaction
- [ ] Memory usage stays stable over time
- [ ] CPU usage is reasonable

### 5. Cross-Browser Testing

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Common Issues and Solutions

### Issue: Globe doesn't render
- **Check**: Browser console for errors
- **Check**: WebGL support (`chrome://gpu`)
- **Solution**: Ensure Three.js is loaded and WebGL is enabled

### Issue: Markers don't appear
- **Check**: Console for data loading errors
- **Check**: Layer toggles are ON
- **Solution**: Verify API endpoints are accessible

### Issue: Click doesn't work
- **Check**: Console for raycasting errors
- **Check**: Markers have `clickable: true` in userData
- **Solution**: Verify event handlers are attached

### Issue: Performance is poor
- **Check**: Number of markers on screen
- **Check**: Device capabilities
- **Solution**: Consider reducing marker count or detail level

## Reporting Issues

When reporting issues, please include:
1. **Page**: NightPulse or MapPage
2. **Browser**: Version and type
3. **Device**: Desktop/Mobile, OS
4. **Steps to reproduce**
5. **Expected vs Actual behavior**
6. **Console errors** (if any)
7. **Screenshot** (if visual issue)

## Success Criteria

All tests should pass:
- ✅ No console errors
- ✅ All interactions work as expected
- ✅ Visual appearance matches design (dark theme, pink accents)
- ✅ Performance is acceptable (60 FPS target)
- ✅ Mobile and desktop both work
- ✅ Layer toggles function correctly
- ✅ Realtime updates work in NightPulse

## After Testing

Once testing is complete and successful:
1. Deprecated components can be removed:
   - `NightPulseGlobe.tsx`
   - `NightPulseGlobeRealtime.tsx`
   - `ThreeGlobe.tsx`
   - `LiveGlobe3D.tsx`
2. Update any remaining references
3. Consider adding automated tests (optional)
