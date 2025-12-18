/**
 * MAP LAYERS - Privacy-safe Heat + Trails
 * 
 * PRIVACY RULES:
 * - Heat: k-anonymity threshold (k≥5), 10min delay, aggregated grid
 * - Trails: k-anonymity threshold (k≥20), coarse OD pairs only
 * - No individual tracking, no precise movement, no live stalking
 */

import type { Map as MapLibreMap } from "maplibre-gl";

// ============================================================================
// HEAT LAYER - Aggregated scan activity
// ============================================================================

export function upsertHeatLayer(map: MapLibreMap, geojson: any) {
  const srcId = "heat-src";
  const layerId = "heat-layer";

  if (!map.getSource(srcId)) {
    map.addSource(srcId, { type: "geojson", data: geojson });
  } else {
    (map.getSource(srcId) as any).setData(geojson);
  }

  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId,
      type: "heatmap",
      source: srcId,
      paint: {
        // Mapbox heatmap paint properties
        "heatmap-weight": ["interpolate", ["linear"], ["get", "count"], 0, 0, 50, 1],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.6, 12, 1.2, 16, 1.6],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 14, 12, 26, 16, 40],
        "heatmap-opacity": 0.8,
        // HOTMESS brand: red/pink gradient
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(0,0,0,0)",
          0.2, "rgba(255,23,68,0.2)",
          0.4, "rgba(255,23,68,0.4)",
          0.6, "rgba(255,23,68,0.6)",
          0.8, "rgba(255,23,68,0.8)",
          1, "rgba(255,23,68,1)"
        ],
      },
    });
  }
}

export function setHeatVisible(map: MapLibreMap, visible: boolean) {
  const layerId = "heat-layer";
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
  }
}

export function removeHeatLayer(map: MapLibreMap) {
  const layerId = "heat-layer";
  const srcId = "heat-src";
  if (map.getLayer(layerId)) map.removeLayer(layerId);
  if (map.getSource(srcId)) map.removeSource(srcId);
}

// ============================================================================
// TRAILS LAYER - Anonymous movement flows
// ============================================================================

export function upsertTrailsLayer(map: MapLibreMap, geojson: any) {
  const srcId = "trails-src";
  const layerId = "trails-layer";

  if (!map.getSource(srcId)) {
    map.addSource(srcId, { type: "geojson", data: geojson });
  } else {
    (map.getSource(srcId) as any).setData(geojson);
  }

  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId,
      type: "line",
      source: srcId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-width": ["interpolate", ["linear"], ["get", "count"], 0, 1, 50, 6],
        "line-color": "#FF1744",
        "line-opacity": 0.35,
        "line-blur": 2,
      },
    });
  }
}

export function setTrailsVisible(map: MapLibreMap, visible: boolean) {
  const layerId = "trails-layer";
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
  }
}

export function removeTrailsLayer(map: MapLibreMap) {
  const layerId = "trails-layer";
  const srcId = "trails-src";
  if (map.getLayer(layerId)) map.removeLayer(layerId);
  if (map.getSource(srcId)) map.removeSource(srcId);
}

// ============================================================================
// DATA FETCHERS - Privacy-safe APIs
// ============================================================================

/**
 * Fetch privacy-safe heat data
 * - Aggregated to coarse grid (H3/geohash)
 * - 10min delay
 * - k≥5 threshold
 * - Optional noise
 */
export async function fetchHeatData(args: {
  city?: string;
  bucket?: string; // e.g. "15m"
  bounds?: [number, number, number, number];
}): Promise<GeoJSON.FeatureCollection> {
  try {
    if (import.meta.env.DEV) {
      console.log("[MapLayers] fetchHeatData", args);
    }
    
    // Build query params
    const params = new URLSearchParams();
    if (args.city) params.set('city', args.city);
    if (args.bucket) params.set('bucket', args.bucket);
    
    // Call real backend API
    const response = await fetch(
      `https://${import.meta.env.VITE_SUPABASE_URL?.replace('https://', '')}/functions/v1/make-server-a670c824/api/map/heat?${params.toString()}`
    );
    
    if (!response.ok) {
      console.error('[MapLayers] Heat data API error:', response.status);
      // Return empty on error
      return { type: "FeatureCollection", features: [] };
    }
    
    const data = await response.json();
    if (import.meta.env.DEV) {
      console.log('[MapLayers] ✅ Heat data loaded:', data.metadata);
    }
    return data;
    
  } catch (error) {
    console.error('[MapLayers] Heat data fetch error:', error);
    // Return empty on error
    return { type: "FeatureCollection", features: [] };
  }
}

/**
 * Fetch privacy-safe trails data
 * - Aggregated OD pairs (origin-destination)
 * - k≥20 threshold
 * - Coarse grid cells only
 * - 30min+ delay
 */
export async function fetchTrailsData(args: {
  city?: string;
  bucket?: string; // e.g. "60m"
  bounds?: [number, number, number, number];
}): Promise<GeoJSON.FeatureCollection> {
  try {
    if (import.meta.env.DEV) {
      console.log("[MapLayers] fetchTrailsData", args);
    }
    
    // Build query params
    const params = new URLSearchParams();
    if (args.city) params.set('city', args.city);
    if (args.bucket) params.set('bucket', args.bucket);
    
    // Call real backend API
    const response = await fetch(
      `https://${import.meta.env.VITE_SUPABASE_URL?.replace('https://', '')}/functions/v1/make-server-a670c824/api/map/trails?${params.toString()}`
    );
    
    if (!response.ok) {
      console.error('[MapLayers] Trails data API error:', response.status);
      // Return empty on error
      return { type: "FeatureCollection", features: [] };
    }
    
    const data = await response.json();
    if (import.meta.env.DEV) {
      console.log('[MapLayers] ✅ Trails data loaded:', data.metadata);
    }
    return data;
    
  } catch (error) {
    console.error('[MapLayers] Trails data fetch error:', error);
    // Return empty on error
    return { type: "FeatureCollection", features: [] };
  }
}

// ============================================================================
// PRIVACY UTILITIES
// ============================================================================

/**
 * Client-side k-anonymity check
 * Filter out any cells/flows below threshold
 */
export function enforceKAnonymity<T extends { properties: { count: number } }>(
  features: T[],
  k: number
): T[] {
  return features.filter((f) => f.properties.count >= k);
}

/**
 * Add statistical noise to counts (optional privacy enhancement)
 */
export function addNoise(count: number, noisePercent: number = 10): number {
  const noise = Math.random() * noisePercent * 2 - noisePercent;
  return Math.max(0, Math.round(count * (1 + noise / 100)));
}
