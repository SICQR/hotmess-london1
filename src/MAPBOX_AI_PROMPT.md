# MAPBOX AI PROMPT: NIGHT PULSE 3D GLOBE

## Project Context
Build a professional 3D interactive globe for **HOTMESS LONDON** - a masculine nightlife operating system for gay men 18+. This is the "Night Pulse" feature showing real-time global beacon activity across 31 gay nightlife venues worldwide.

## Design Aesthetic
- **HOTMESS Dark Neon Kink Aesthetic**: Black backgrounds (#000000), hot pink accents (#ff1694, #ff0080), white text
- **Google Earth Pro style**: Professional, smooth, high-performance 3D globe
- **Atmosphere**: Pink/magenta atmospheric glow around Earth's edge
- **Night mode**: Dark Earth textures, glowing city lights visible

## Technical Stack
- **Mapbox GL JS** v3+ with 3D terrain/globe capabilities
- **React** functional component with TypeScript
- **Tailwind CSS** for styling
- Responsive design (mobile + desktop)
- Smooth 60fps animations

## Core Features Required

### 1. 3D Globe Rendering
- Full 3D Earth sphere (not flat map projection)
- Realistic Earth textures with continents visible
- Smooth rotation and orbit controls
- Dark/night theme with city lights
- Hot pink atmospheric glow effect around globe edge

### 2. Venue Markers (31 Locations)
Display these 31 gay nightlife venues as **pulsing, color-coded markers**:

**LONDON (10 venues)**
- Heaven: 51.5081°N, 0.1206°W
- Royal Vauxhall Tavern: 51.4862°N, 0.1235°W
- The Glory: 51.5392°N, 0.0559°W
- Dalston Superstore: 51.5466°N, 0.0750°W
- Eagle London: 51.4848°N, 0.1208°W
- XXL London: 51.5145°N, 0.1270°W
- Horse Meat Disco @ QEII: 51.5074°N, 0.0272°W
- Circa: 51.4837°N, 0.1149°W
- The Yard: 51.5124°N, 0.1319°W
- G-A-Y Bar: 51.5101°N, 0.1340°W

**NEW YORK CITY (5 venues)**
- The Eagle NYC: 40.7484°N, 73.9857°W
- Phoenix Bar: 40.7338°N, 73.9973°W
- Therapy NYC: 40.7625°N, 73.9918°W
- Industry Bar: 40.7427°N, 74.0070°W
- The Ritz: 40.7442°N, 73.9878°W

**BERLIN (5 venues)**
- Berghain: 52.5108°N, 13.4427°E
- SchwuZ: 52.4889°N, 13.4294°E
- Laboratory: 52.5026°N, 13.4125°E
- Ficken 3000: 52.5244°N, 13.4105°E
- Monster Ronson's: 52.4965°N, 13.4205°E

**SAN FRANCISCO (3 venues)**
- The Eagle SF: 37.7749°N, 122.4115°W
- Powerhouse Bar: 37.7633°N, 122.4147°W
- The Stud: 37.7585°N, 122.4105°W

**AMSTERDAM (2 venues)**
- Church: 52.3676°N, 4.8945°E
- Prik: 52.3702°N, 4.8952°E

**SYDNEY (2 venues)**
- ARQ Sydney: -33.8688°S, 151.2093°E
- Imperial Erskineville: -33.9013°S, 151.1847°E

**PARIS (2 venues)**
- Le Depot: 48.8606°N, 2.3522°E
- CUD Bar: 48.8584°N, 2.3470°E

**BARCELONA (1 venue)**
- Metro Disco: 41.3851°N, 2.1734°E

**LOS ANGELES (1 venue)**
- West Hollywood (The Abbey): 34.0901°N, 118.3617°W

### 3. Marker Styling
Each marker should:
- **Pulse animation**: Smooth scale 1.0 → 1.3 → 1.0 (2s duration, infinite loop)
- **Color coding by activity level**:
  - **Hot Pink (#ff1694)**: High activity (100+ scans)
  - **Pink (#ff0080)**: Medium activity (10-99 scans)
  - **Red (#e70f3c)**: Low activity (1-9 scans)
- **3D elevation**: Markers elevated above Earth surface
- **Glow effect**: Soft shadow/glow around each marker
- **Clickable**: Each marker clickable to show venue details

### 4. Interactive Controls
- **Drag to rotate**: Smooth orbital rotation around globe
- **Scroll to zoom**: Zoom in (close-up city level) to zoom out (full Earth view)
- **Auto-rotation**: Gentle automatic rotation when idle (0.1°/sec)
- **Click marker**: Show popup with venue name, city, country, activity stats
- **Double-click**: Fly to location and zoom in smoothly

### 5. Heat Zones (Bonus Feature)
- **3D Hexagonal heat zones** around cities with multiple venues
- Semi-transparent pink hexagons hovering above surface
- Intensity based on total scans in area
- Subtle pulsing glow effect

### 6. UI Overlays

**Stats Panel (Top Left)**
```
🌍 NIGHT PULSE GLOBAL
━━━━━━━━━━━━━━━━━━━━
📍 31 Active Venues
⚡ 2,847 Scans Tonight
👥 1,234 Users Online
🔥 London Leading (578 scans)
```

**Legend (Bottom Left)**
```
HEAT INTENSITY
━━━━━━━━━━━━━
● Hot Pink: 100+ scans
● Pink: 10-99 scans  
● Red: 1-9 scans
```

**Controls (Bottom Right)**
```
CONTROLS
━━━━━━━━━━━━━
• Drag to rotate
• Scroll to zoom
• Click venue for details
• Double-click to fly to location
```

### 7. Performance Requirements
- Smooth 60fps rendering
- Lazy load textures
- Optimize marker count for mobile
- Progressive detail loading based on zoom level
- Memory-efficient texture management

### 8. React Component Structure
```tsx
interface NightPulseGlobeProps {
  timeWindow: 'tonight' | 'weekend' | 'month';
  onVenueClick?: (venue: VenueData) => void;
}

interface VenueData {
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  scans: number;
  activeUsers: number;
}
```

### 9. Mapbox Configuration
- **Access Token**: Use environment variable `VITE_MAPBOX_TOKEN`
- **Style**: `mapbox://styles/mapbox/dark-v11` (or custom dark style)
- **Projection**: `globe` (not mercator)
- **Pitch**: 0° (top-down initially, allow user to adjust)
- **Bearing**: 0° (north up)
- **Fog**: Enable atmospheric fog with pink tint

### 10. Additional Requirements
- **Loading state**: Show pink spinner with "LOADING GLOBAL NETWORK..." text
- **Error handling**: Graceful fallback if Mapbox fails to load
- **Accessibility**: Keyboard navigation support (arrow keys to rotate, +/- to zoom)
- **Mobile optimization**: Touch gestures (pinch-zoom, swipe-rotate)
- **Cleanup**: Proper cleanup on unmount (remove event listeners, dispose Mapbox instance)

## Expected Output
A production-ready React component that renders a stunning 3D globe matching the HOTMESS aesthetic with smooth animations, interactive venue markers, and professional polish comparable to Google Earth Pro.

---

**Usage Instructions:**
1. Copy this entire prompt
2. Paste into Mapbox AI, ChatGPT, Claude, or your preferred AI tool
3. Request: "Generate a Mapbox GL JS React component based on this specification"
4. Review the generated code
5. Replace the current ThreeGlobeComponent with the Mapbox version

**Expected File Output:**
- `/components/globe/MapboxGlobe.tsx` - Main component
- Update `/pages/NightPulse.tsx` to import MapboxGlobe instead of ThreeGlobe
- Add `VITE_MAPBOX_TOKEN` to environment variables
