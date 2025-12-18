# Deprecated Globe Components

The following globe components have been replaced by the unified `UnifiedGlobe` component located at `src/components/globe/UnifiedGlobe.tsx`.

## Deprecated Components

### ✅ Can be removed after testing

1. **`src/components/globe/NightPulseGlobe.tsx`**
   - Replaced by: `UnifiedGlobe` with `nightPulseCities` prop
   - Used in: Was previously used in NightPulse page (now using UnifiedGlobe)
   - Status: No longer in use

2. **`src/components/globe/NightPulseGlobeRealtime.tsx`**
   - Replaced by: `UnifiedGlobe` with `nightPulseCities` prop and `realtimeEnabled={true}`
   - Used in: `NightPulse.tsx` (now using UnifiedGlobe)
   - Status: No longer in use

3. **`src/components/globe/ThreeGlobe.tsx`**
   - Replaced by: `UnifiedGlobe`
   - Used in: Unknown (needs verification)
   - Status: Potentially unused

### ⚠️ Needs verification before removal

4. **`src/components/LiveGlobe3D.tsx`**
   - Replaced by: `UnifiedGlobe` with beacon conversion layer
   - Used in: `MapPage.tsx` (now using UnifiedGlobe)
   - Status: No longer in use, but has complex implementation with CSS2D labels
   - **Note**: Verify CSS2D city labels functionality is not lost

## Migration Guide

### From NightPulseGlobeRealtime to UnifiedGlobe

**Before:**
```tsx
import { NightPulseGlobeRealtime } from '../components/globe/NightPulseGlobeRealtime';

<NightPulseGlobeRealtime 
  onCityClick={setSelectedCity}
/>
```

**After:**
```tsx
import { UnifiedGlobe } from '../components/globe/UnifiedGlobe';
import { useNightPulseRealtime } from '../hooks/useNightPulseRealtime';

const { cities } = useNightPulseRealtime();

<UnifiedGlobe 
  nightPulseCities={cities}
  showBeacons={false}
  showHeat={true}
  showCities={true}
  onCityClick={setSelectedCity}
  realtimeEnabled={true}
/>
```

### From LiveGlobe3D to UnifiedGlobe

**Before:**
```tsx
import LiveGlobe3D from '../components/LiveGlobe3D';

<LiveGlobe3D
  beacons={beacons}
  onBeaconClick={handleClick}
/>
```

**After:**
```tsx
import { UnifiedGlobe, type BeaconMarker } from '../components/globe/UnifiedGlobe';

// Convert beacons to BeaconMarker format
const beaconMarkers: BeaconMarker[] = beacons.map(b => ({
  id: b.id,
  title: b.title,
  lat: b.lat,
  lng: b.lng,
  city: b.city,
  kind: b.type,
  intensity: 0.5,
  sponsored: b.sponsored,
}));

<UnifiedGlobe
  beacons={beaconMarkers}
  showBeacons={true}
  onMarkerClick={handleClick}
/>
```

## UnifiedGlobe Features

The new UnifiedGlobe component provides:

- ✅ Configurable data layers (beacons, heat, tickets, cities, trails)
- ✅ Layer visibility toggles
- ✅ Static and realtime data support
- ✅ OrbitControls (rotate, zoom, pan)
- ✅ Click/hover interactions
- ✅ Proper resource cleanup
- ✅ Mobile and desktop support
- ✅ Dark theme with pink/red accent colors (#ff1694)
- ✅ Loading states
- ✅ Zoom level indicator
- ✅ Control UI overlays

## Removal Timeline

1. **Testing Phase** (Current)
   - Verify UnifiedGlobe works correctly in all pages
   - Test on mobile and desktop
   - Verify realtime updates
   - Check performance

2. **Deprecation Phase** (After testing)
   - Mark components as deprecated with JSDoc comments
   - Add console warnings if they're still used

3. **Removal Phase** (After 1-2 weeks)
   - Remove deprecated components from codebase
   - Update imports if any remain

## Testing Checklist

- [ ] NightPulse page globe renders correctly
- [ ] NightPulse realtime city updates work
- [ ] NightPulse city click and stats panel work
- [ ] MapPage 3D globe renders correctly
- [ ] MapPage beacon markers appear and are clickable
- [ ] MapPage layer toggles (pins, heat, trails, cities) work
- [ ] MapPage beacon selection and detail panel work
- [ ] Mobile viewport works for both pages
- [ ] Desktop viewport works for both pages
- [ ] No console errors or warnings
- [ ] Performance is acceptable (60fps target)
- [ ] Resource cleanup verified (no memory leaks)
