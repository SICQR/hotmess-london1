# RIGHT NOW → HEAT MAP → GLOBE WIRING

**This shows exactly how a RIGHT NOW post becomes a hot glow on the globe.**

---

## 🔥 THE FLOW

```
User posts RIGHT NOW
  ↓
Edge Function inserts right_now_posts row
  ↓
Edge Function calls increment_heat_bin(geo_bin, 'right_now')
  ↓
heat_bins table gets new row
  ↓
Globe fetches /api/heat/heat?city=London
  ↓
Aggregates heat_bins by geo_bin + source
  ↓
Mapbox renders heatmap layer
  ↓
BOOM - Glowing cluster on globe
```

---

## 📍 GEO BIN CALCULATION

**What is a geo bin?**
- Coarse location grid (~250m square)
- Format: `{lat}_{lng}_250m`
- Example: `51.5000_-0.1200_250m`

**How it's calculated:**
```typescript
function calcGeoBin(lat: number, lng: number, sizeMeters = 250): string {
  // 0.0025 degrees ≈ 250m at equator
  const step = 0.0025
  const latBin = Math.round(lat / step) * step
  const lngBin = Math.round(lng / step) * step
  return `${latBin.toFixed(4)}_${lngBin.toFixed(4)}_${sizeMeters}m`
}

// Examples:
calcGeoBin(51.5074, -0.1278) // "51.5075_-0.1275_250m" (Covent Garden)
calcGeoBin(51.5074, -0.1250) // "51.5075_-0.1250_250m" (Leicester Square)
calcGeoBin(51.4545, -0.1087) // "51.4550_-0.1075_250m" (Vauxhall)
```

**Why bins not exact coords?**
- Privacy: Don't show exact door numbers
- Clustering: Multiple posts in same area = one hot spot
- Performance: Fewer unique bins to render

---

## 🗄️ HEAT BINS TABLE

```sql
CREATE TABLE public.heat_bins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geo_bin       TEXT NOT NULL,      -- "51.5075_-0.1275_250m"
  city          TEXT,                -- "London"
  lat_bin       DOUBLE PRECISION,   -- 51.5075
  lng_bin       DOUBLE PRECISION,   -- -0.1275
  source        TEXT NOT NULL,       -- 'right_now', 'party', 'scan', 'radio'
  heat_value    INTEGER NOT NULL,    -- 10 (base heat for RIGHT NOW post)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ         -- NOW() + 2 hours
);
```

**Sources:**
- `right_now` - RIGHT NOW posts (heat_value: 10)
- `party` - Party beacons (heat_value: 50)
- `scan` - QR code scans (heat_value: 5 per scan)
- `radio` - Radio listeners (heat_value: 2 per listener)

---

## 🔧 INCREMENT HEAT BIN FUNCTION

```sql
CREATE OR REPLACE FUNCTION public.increment_heat_bin(
  p_geo_bin TEXT,
  p_source TEXT,
  p_city TEXT DEFAULT NULL,
  p_lat DOUBLE PRECISION DEFAULT NULL,
  p_lng DOUBLE PRECISION DEFAULT NULL,
  p_heat_value INTEGER DEFAULT 10,
  p_ttl_hours INTEGER DEFAULT 2
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.heat_bins (
    geo_bin,
    city,
    lat_bin,
    lng_bin,
    source,
    heat_value,
    expires_at
  ) VALUES (
    p_geo_bin,
    p_city,
    p_lat,
    p_lng,
    p_source,
    p_heat_value,
    NOW() + (p_ttl_hours || ' hours')::INTERVAL
  );
END;
$$;
```

**Called from Edge Function:**
```typescript
await supabase.rpc('increment_heat_bin', {
  p_geo_bin: '51.5075_-0.1275_250m',
  p_source: 'right_now',
  p_city: 'London',
  p_lat: 51.5075,
  p_lng: -0.1275,
  p_heat_value: 10,
  p_ttl_hours: 2,
})
```

---

## 🌍 GLOBE API ENDPOINT

**Endpoint:** `GET /api/heat/heat?city=London&window=tonight`

**Returns aggregated heat:**
```json
{
  "bins": [
    {
      "geo_bin": "51.5075_-0.1275_250m",
      "lat": 51.5075,
      "lng": -0.1275,
      "city": "London",
      "total_heat": 75,
      "sources": {
        "right_now": 30,  // 3 RIGHT NOW posts
        "party": 50,      // 1 party beacon
        "scan": 15        // 3 scans
      },
      "near_party": true
    },
    {
      "geo_bin": "51.4550_-0.1075_250m",
      "lat": 51.4550,
      "lng": -0.1075,
      "city": "London",
      "total_heat": 20,
      "sources": {
        "right_now": 20   // 2 RIGHT NOW posts
      },
      "near_party": false
    }
  ]
}
```

**SQL query:**
```sql
SELECT 
  geo_bin,
  lat_bin as lat,
  lng_bin as lng,
  city,
  SUM(heat_value) as total_heat,
  JSONB_OBJECT_AGG(source, source_heat) as sources,
  BOOL_OR(source = 'party') as near_party
FROM (
  SELECT 
    geo_bin,
    lat_bin,
    lng_bin,
    city,
    source,
    SUM(heat_value) as source_heat,
    SUM(heat_value) as heat_value
  FROM public.heat_bins
  WHERE (expires_at IS NULL OR expires_at > NOW())
    AND ($1::TEXT IS NULL OR city ILIKE $1)
  GROUP BY geo_bin, lat_bin, lng_bin, city, source
) heat_by_source
GROUP BY geo_bin, lat_bin, lng_bin, city
ORDER BY total_heat DESC;
```

---

## 🗺️ MAPBOX RENDERING

**Frontend (MapboxGlobe component):**
```typescript
// Fetch heat data
const heatData = await fetch('/api/heat/heat?city=London')
const { bins } = await heatData.json()

// Convert to GeoJSON
const geojson = {
  type: 'FeatureCollection',
  features: bins.map(bin => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [bin.lng, bin.lat]
    },
    properties: {
      heat: bin.total_heat,
      near_party: bin.near_party,
      sources: bin.sources
    }
  }))
}

// Add to map
map.addSource('heat', {
  type: 'geojson',
  data: geojson
})

map.addLayer({
  id: 'heat-layer',
  type: 'heatmap',
  source: 'heat',
  paint: {
    // Heat intensity based on total_heat
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'heat'],
      0, 0,
      100, 1
    ],
    // Color ramp: blue → pink → red → white
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0,0,0,0)',
      0.2, 'rgba(103,58,183,0.5)',  // purple
      0.4, 'rgba(255,23,68,0.7)',   // hotmess red
      0.6, 'rgba(255,87,34,0.9)',   // orange
      0.8, 'rgba(255,235,59,1)'     // yellow/white
    ],
    // Intensity
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 1,
      9, 3
    ],
    // Radius
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 2,
      9, 20
    ]
  }
})

// Add near-party markers (optional)
map.addLayer({
  id: 'party-markers',
  type: 'symbol',
  source: 'heat',
  filter: ['==', ['get', 'near_party'], true],
  layout: {
    'icon-image': 'fire-icon',
    'icon-size': 1.5
  }
})
```

---

## 🔥 EXAMPLE SCENARIO

**Saturday night in Vauxhall:**

1. **22:00 - Party beacon created**
   - Host creates party beacon at `51.4545, -0.1087`
   - geo_bin: `51.4550_-0.1075_250m`
   - Calls: `increment_heat_bin(geo_bin, 'party', heat_value: 50)`

2. **22:30 - First guests scan QR**
   - 5 guests scan QR code
   - Each scan calls: `increment_heat_bin(geo_bin, 'scan', heat_value: 5)`
   - Total scan heat: 25

3. **23:00 - RIGHT NOW posts**
   - User posts: "Crowd in Vauxhall, 6 beds, aftercare vibes"
   - geo_bin calculated from lat/lng: `51.4550_-0.1075_250m`
   - Calls: `increment_heat_bin(geo_bin, 'right_now', heat_value: 10)`

4. **23:15 - More posts**
   - 2 more users post RIGHT NOW from same area
   - Same geo_bin: 2 more rows with heat_value: 10 each

5. **23:30 - Globe query**
   ```sql
   SELECT geo_bin, SUM(heat_value) as total_heat
   FROM heat_bins
   WHERE geo_bin = '51.4550_-0.1075_250m'
     AND expires_at > NOW()
   GROUP BY geo_bin
   ```
   
   **Result:**
   ```
   geo_bin                | total_heat
   ----------------------|------------
   51.4550_-0.1075_250m  | 105
   ```
   
   **Breakdown:**
   - Party beacon: 50
   - 5 QR scans: 25 (5 × 5)
   - 3 RIGHT NOW posts: 30 (3 × 10)
   - **Total: 105**

6. **Globe displays**
   - Massive hot spot in Vauxhall
   - Color: Bright yellow/white (high heat)
   - Marker: 🔥 (near_party = true)
   - Click reveals: "3 RIGHT NOW signals, 1 party, 5 guests"

---

## 🧮 HEAT SCORING ALGORITHM

**Base heat values:**
```typescript
const heatValues = {
  party: 50,        // Party beacon exists
  right_now: 10,    // RIGHT NOW post
  scan: 5,          // QR code scan
  radio: 2,         // Radio listener
}
```

**Multipliers:**
- **Crowd-verified party** (6+ scans): 1.5x
- **ICON member post**: 1.2x
- **Verified host**: 1.3x
- **Near party**: flag set (affects UI, not heat)

**Example:**
```typescript
// ICON member posts RIGHT NOW near verified party
const baseHeat = 10
const iconMultiplier = 1.2
const verifiedMultiplier = 1.3

const totalHeat = baseHeat * iconMultiplier * verifiedMultiplier
// = 10 × 1.2 × 1.3 = 15.6 → 16
```

---

## 🕐 TTL (TIME TO LIVE)

**Heat bins expire:**
- RIGHT NOW posts: 2 hours
- Party beacons: Until end_time
- QR scans: 2 hours
- Radio listeners: 1 hour

**Cron job cleans up:**
```sql
DELETE FROM public.heat_bins
WHERE expires_at IS NOT NULL
  AND expires_at <= NOW();
```

**Why TTL?**
- Heat fades as night progresses
- Shows "live" activity, not historical
- Keeps data fresh for globe

---

## 🔗 NEAR PARTY DETECTION

**How we detect "near party":**

```sql
-- When creating RIGHT NOW post, check if geo_bin overlaps party beacon
SELECT COUNT(*) > 0 as near_party
FROM party_beacons
WHERE geo_hash = NEW.geo_bin  -- Same geo bin
  AND end_time > NOW()         -- Party still active
  AND capacity_current >= 6;   -- Crowd-verified (6+ scans)
```

**Set flag on post:**
```typescript
const { data: nearbyParties } = await supabase
  .from('party_beacons')
  .select('id')
  .eq('geo_hash', geoBin)
  .gt('end_time', new Date().toISOString())
  .gte('capacity_current', 6)

const nearParty = (nearbyParties?.length || 0) > 0

// Update post
await supabase
  .from('right_now_posts')
  .update({ near_party: nearParty })
  .eq('id', postId)
```

**Feed shows:** "🔥 Near live party"

---

## 📊 MONITORING HEAT

**Check current heat map:**
```sql
SELECT 
  city,
  geo_bin,
  source,
  COUNT(*) as signal_count,
  SUM(heat_value) as total_heat,
  MIN(created_at) as first_signal,
  MAX(created_at) as last_signal
FROM public.heat_bins
WHERE expires_at > NOW()
GROUP BY city, geo_bin, source
ORDER BY total_heat DESC
LIMIT 20;
```

**Top heat clusters:**
```sql
SELECT 
  geo_bin,
  city,
  SUM(heat_value) as total_heat,
  COUNT(DISTINCT source) as unique_sources,
  ARRAY_AGG(DISTINCT source) as sources
FROM public.heat_bins
WHERE expires_at > NOW()
GROUP BY geo_bin, city
HAVING SUM(heat_value) > 50
ORDER BY total_heat DESC;
```

**Heat by source:**
```sql
SELECT 
  source,
  COUNT(*) as signals,
  SUM(heat_value) as total_heat,
  AVG(heat_value) as avg_heat
FROM public.heat_bins
WHERE expires_at > NOW()
GROUP BY source
ORDER BY total_heat DESC;
```

---

## ✅ WIRING CHECKLIST

- [ ] `heat_bins` table exists
- [ ] `increment_heat_bin()` function exists
- [ ] RIGHT NOW Edge Function calls `increment_heat_bin()` on post creation
- [ ] Party beacon creation calls `increment_heat_bin()`
- [ ] QR scan handler calls `increment_heat_bin()`
- [ ] Cron job expires old heat bins (every 10 min)
- [ ] `/api/heat/heat` endpoint aggregates bins
- [ ] Globe component fetches and renders heat
- [ ] `near_party` flag set on overlapping posts

---

**This is how RIGHT NOW posts become glowing clusters on the globe. Wire it. Deploy it. Watch it glow.** 🔥
