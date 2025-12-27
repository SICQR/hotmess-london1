import * as React from "react";
import Map, { Marker, NavigationControl, type ViewStateChangeEvent } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import Supercluster from "supercluster";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { BeaconType, GateContext, RequirementChip } from "../lib/beaconTypes";
import {
  BEACON_TYPE_CONFIG,
  getBeaconPresentation,
  getUrgencyTier,
  urgencyUI,
  getMissingRequirements,
  requirementChipLabel,
} from "../lib/beaconTypes";
import { MapControlsSheet, type MapLayers } from "./MapControlsSheet";
import {
  upsertHeatLayer,
  setHeatVisible,
  upsertTrailsLayer,
  setTrailsVisible,
  fetchHeatData,
  fetchTrailsData,
} from "../lib/map-layers";

export type BeaconPoint = {
  id: string;
  type: BeaconType;
  title: string;
  description?: string;
  lng: number;
  lat: number;
  expiresAtMs: number;

  isSponsored?: boolean;
  underlyingType?: BeaconType;

  // instance-level capability toggles
  gpsRequired?: boolean;
  premiumOverride?: boolean;
};

type Props = {
  beacons: BeaconPoint[];
  mapStyleUrl: string; // e.g. a Mapbox style URL or JSON
  initialView?: { longitude: number; latitude: number; zoom: number };

  // user context for live now sorting and gating chips (not enforcement here)
  ctx: GateContext;

  // callbacks
  onOpenBeacon: (b: BeaconPoint) => void; // should open BeaconActionSheet
  onSaveBeacon: (id: string) => void;
  onScan?: () => void;
  onChangeLayers?: (layers: MapLayers) => void;

  // Optional: user location
  userLocation?: { lng: number; lat: number } | null;
};

type GeoJsonPoint = GeoJSON.Feature<GeoJSON.Point, {
  beaconId: string;
  type: BeaconType;
  label: string;
  icon: string;
  accentToken: string;
  accentHex: string;

  expiresAtMs: number;

  isSponsored?: boolean;
  gpsRequired?: boolean;
  premiumRequired?: boolean;
  requirements: RequirementChip[];
}>;

const ACCENT_HEX: Record<string, string> = {
  ACCENT_NEUTRAL: "#9CA3AF",
  ACCENT_CARE: "#F57C00",
  ACCENT_CONNECT: "#9C27B0",
  ACCENT_TICKET: "#2196F3",
  ACCENT_DROP: "#FF1744",
  ACCENT_CONTENT: "#00E676",
  ACCENT_RADIO: "#FFEB3B",
};

function formatRemaining(expiresAtMs: number, nowMs: number) {
  const delta = Math.max(0, expiresAtMs - nowMs);
  const totalSec = Math.floor(delta / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function toRad(d: number) {
  return (d * Math.PI) / 180;
}
function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function buildRequirements(point: BeaconPoint): RequirementChip[] {
  const presentation = getBeaconPresentation({
    type: point.type,
    isSponsored: point.isSponsored,
    underlyingType: point.underlyingType,
  });

  const base = BEACON_TYPE_CONFIG[presentation.type];
  const req = [...base.requirements];

  if (point.gpsRequired && !req.includes("GPS")) req.push("GPS");
  if (point.premiumOverride && !req.includes("PREMIUM")) req.push("PREMIUM");

  return req;
}

function toGeoJson(points: BeaconPoint[]): GeoJsonPoint[] {
  return points.map((p) => {
    const pres = getBeaconPresentation({
      type: p.type,
      isSponsored: p.isSponsored,
      underlyingType: p.underlyingType,
    });
    const cfg = BEACON_TYPE_CONFIG[pres.type];
    const requirements = buildRequirements(p);

    const accentToken = cfg.accent;
    const accentHex = ACCENT_HEX[accentToken] ?? ACCENT_HEX.ACCENT_NEUTRAL;

    return {
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: {
        beaconId: p.id,
        type: p.type,
        label: pres.label,
        icon: pres.icon,
        accentToken,
        accentHex,
        expiresAtMs: p.expiresAtMs,
        isSponsored: Boolean(p.isSponsored),
        gpsRequired: Boolean(p.gpsRequired),
        premiumRequired: Boolean(p.premiumOverride) || requirements.includes("PREMIUM"),
        requirements,
      },
    };
  });
}

type ClusterPoint =
  | GeoJsonPoint
  | GeoJSON.Feature<GeoJSON.Point, { cluster: true; cluster_id: number; point_count: number; point_count_abbreviated: number }>;

function useSuperclusterPoints(args: {
  points: GeoJsonPoint[];
  bounds: [number, number, number, number] | null;
  zoom: number;
}) {
  const { points, bounds, zoom } = args;

  const clusterer = React.useMemo(() => {
    const sc = new Supercluster({
      radius: 60,
      maxZoom: 18,
    });
    sc.load(points as any);
    return sc;
  }, [points]);

  const clusters = React.useMemo(() => {
    if (!bounds) return [] as ClusterPoint[];
    const [west, south, east, north] = bounds;
    return clusterer.getClusters([west, south, east, north], Math.round(zoom)) as any;
  }, [clusterer, bounds, zoom]);

  return { clusters, clusterer };
}

function boundsFromMap(map: maplibregl.Map | null): [number, number, number, number] | null {
  if (!map) return null;
  const b = map.getBounds();
  return [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
}

function UrgencyRank(tier: string) {
  switch (tier) {
    case "CRITICAL":
      return 4;
    case "FINAL":
      return 3;
    case "NUDGE":
      return 2;
    case "CALM":
      return 1;
    default:
      return 0;
  }
}

function Pin({
  accentHex,
  pulse,
  locked,
  gps,
  sponsored,
}: {
  accentHex: string;
  pulse: boolean;
  locked: boolean;
  gps: boolean;
  sponsored: boolean;
}) {
  return (
    <div className="relative cursor-pointer">
      {/* Pulse ring */}
      {pulse ? (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: accentHex, opacity: 0.18, width: 34, height: 34, left: -5, top: -5 }}
        />
      ) : null}

      {/* Outer ring */}
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: 24,
          height: 24,
          background: "rgba(0,0,0,0.75)",
          border: `2px solid ${accentHex}`,
          boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        }}
      >
        {/* inner dot */}
        <div
          className="rounded-full"
          style={{ width: 8, height: 8, background: accentHex, opacity: 0.9 }}
        />
      </div>

      {/* Overlays */}
      <div className="absolute -top-2 -right-2 flex gap-1">
        {locked ? (
          <span className="h-4 w-4 rounded-full bg-black/80 border border-white/20 grid place-items-center text-[10px]">
            🔒
          </span>
        ) : null}
        {gps ? (
          <span className="h-4 w-4 rounded-full bg-black/80 border border-white/20 grid place-items-center text-[10px]">
            📍
          </span>
        ) : null}
        {sponsored ? (
          <span className="h-4 w-4 rounded-full bg-black/80 border border-white/20 grid place-items-center text-[10px]">
            💠
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function MapBeaconView(props: Props) {
  const mapRef = React.useRef<MapRef | null>(null);

  // Local state for map layers
  const [layers, setLayers] = React.useState<MapLayers>({
    pins: true,
    heat: false,
    trails: false,
    cities: false,
    myLayer: false,
  });
  const [controlsOpen, setControlsOpen] = React.useState(false);

  const [viewState, setViewState] = React.useState(
    props.initialView ?? { longitude: -0.1276, latitude: 51.5072, zoom: 11 } // London default
  );

  const geoPoints = React.useMemo(() => toGeoJson(props.beacons), [props.beacons]);

  const [bounds, setBounds] = React.useState<[number, number, number, number] | null>(null);
  React.useEffect(() => {
    const map = mapRef.current?.getMap?.() as any;
    setBounds(boundsFromMap(map ?? null));
  }, []);

  const { clusters, clusterer } = useSuperclusterPoints({
    points: geoPoints,
    bounds,
    zoom: viewState.zoom,
  });

  function onMove(e: ViewStateChangeEvent) {
    setViewState(e.viewState);
    const map = mapRef.current?.getMap?.() as any;
    setBounds(boundsFromMap(map ?? null));
  }

  // Handle layer changes
  const handleLayerChange = React.useCallback((newLayers: MapLayers) => {
    setLayers(newLayers);
    props.onChangeLayers?.(newLayers);

    // Update MapLibre layers
    const map = mapRef.current?.getMap() as maplibregl.Map | undefined;
    if (!map) return;

    // Pins visibility handled by React markers
    
    // Heat layer
    if (newLayers.heat) {
      fetchHeatData({}).then((data) => {
        upsertHeatLayer(map, data);
        setHeatVisible(map, true);
      });
    } else {
      setHeatVisible(map, false);
    }

    // Trails layer
    if (newLayers.trails) {
      fetchTrailsData({}).then((data) => {
        upsertTrailsLayer(map, data);
        setTrailsVisible(map, true);
      });
    } else {
      setTrailsVisible(map, false);
    }
  }, [props, setLayers]);

  // Live Now list ranking
  const liveNow = React.useMemo(() => {
    const nowMs = Date.now();
    const loc = props.userLocation;

    const enriched = props.beacons.map((b) => {
      const pres = getBeaconPresentation({ type: b.type, isSponsored: b.isSponsored, underlyingType: b.underlyingType });
      const cfg = BEACON_TYPE_CONFIG[pres.type];
      const req = buildRequirements(b);
      const tier = getUrgencyTier({ nowMs, expiresAtMs: b.expiresAtMs });
      const remainingMs = Math.max(0, b.expiresAtMs - nowMs);
      const distance = loc ? haversineMeters({ lat: loc.lat, lng: loc.lng }, { lat: b.lat, lng: b.lng }) : null;

      return { b, cfg, req, tier, remainingMs, distance };
    });

    return enriched
      .filter((x) => x.tier !== "EXPIRED")
      .sort((a, b) => {
        const t = UrgencyRank(b.tier) - UrgencyRank(a.tier);
        if (t !== 0) return t;
        const r = a.remainingMs - b.remainingMs;
        if (r !== 0) return r;
        if (a.distance != null && b.distance != null) return a.distance - b.distance;
        return 0;
      })
      .slice(0, 12);
  }, [props.beacons, props.userLocation]);

  return (
    <div className="relative h-full w-full">
      {/* Top bar */}
      <div className="absolute left-3 right-3 top-3 z-10 flex items-center justify-between gap-2">
        <button
          className="rounded-2xl bg-black/80 text-white px-4 py-2 text-sm shadow-lg border border-white/10 hover:border-white/30 transition"
          onClick={props.onScan}
        >
          Scan
        </button>

        <div className="flex gap-2">
          <button
            className="rounded-2xl bg-black/80 text-white px-4 py-2 text-sm shadow-lg border border-white/10 hover:border-white/30 transition"
            onClick={() => {
              const first = liveNow[0]?.b;
              if (first) props.onOpenBeacon(first);
            }}
          >
            Live Now
          </button>

          <button
            className="rounded-2xl bg-black/80 text-white px-4 py-2 text-sm shadow-lg border border-white/10 hover:border-white/30 transition"
            onClick={() => setControlsOpen(true)}
          >
            Map Controls
          </button>
        </div>
      </div>

      {/* Map */}
      <Map
        ref={mapRef as any}
        mapLib={maplibregl as any}
        mapStyle={props.mapStyleUrl}
        initialViewState={viewState}
        onMove={onMove}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="bottom-right" />

        {/* Clusters + pins */}
        {layers.pins ? (
          <>
            {clusters.map((c: any) => {
              const [lng, lat] = c.geometry.coordinates;
              const isCluster = c.properties.cluster;

              if (isCluster) {
                const count = c.properties.point_count as number;

                return (
                  <Marker
                    key={`cluster_${c.properties.cluster_id}`}
                    longitude={lng}
                    latitude={lat}
                    anchor="center"
                    onClick={(e) => {
                      e.originalEvent.stopPropagation();
                      const expansionZoom = Math.min(
                        clusterer.getClusterExpansionZoom(c.properties.cluster_id),
                        18
                      );
                      mapRef.current?.flyTo({ center: [lng, lat] as any, zoom: expansionZoom, duration: 420 });
                    }}
                  >
                    <div 
                      className="rounded-full bg-black/80 border border-white/15 text-white shadow-lg grid place-items-center cursor-pointer hover:border-white/35 transition"
                      style={{ width: 36, height: 36 }}
                    >
                      <div className="text-xs font-semibold tabular-nums">{count}</div>
                    </div>
                  </Marker>
                );
              }

              // Unclustered point
              const p = c as GeoJsonPoint;
              const nowMs = Date.now();
              const tier = getUrgencyTier({ nowMs, expiresAtMs: p.properties.expiresAtMs });
              const ui = urgencyUI(tier);
              const missing = getMissingRequirements(p.properties.requirements, props.ctx);

              return (
                <Marker
                  key={p.properties.beaconId}
                  longitude={lng}
                  latitude={lat}
                  anchor="center"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    const found = props.beacons.find((b) => b.id === p.properties.beaconId);
                    if (found) props.onOpenBeacon(found);
                  }}
                >
                  <Pin
                    accentHex={p.properties.accentHex}
                    pulse={Boolean(ui.pulse)}
                    locked={missing.includes("PREMIUM")}
                    gps={missing.includes("GPS") || Boolean(p.properties.gpsRequired)}
                    sponsored={Boolean(p.properties.isSponsored)}
                  />
                </Marker>
              );
            })}
          </>
        ) : null}
      </Map>

      {/* Live Now compact list */}
      <div className="absolute left-3 right-3 bottom-3 z-10 space-y-2">
        <div className="rounded-2xl bg-black/75 border border-white/10 text-white shadow-lg p-3 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Live Now</div>
            <div className="text-xs opacity-75">
              {props.userLocation ? "Sorted by urgency + distance" : "Sorted by urgency"}
            </div>
          </div>

          <div className="mt-2 grid gap-2">
            {liveNow.slice(0, 4).map(({ b, tier }) => {
              const pres = getBeaconPresentation({ type: b.type, isSponsored: b.isSponsored, underlyingType: b.underlyingType });
              const cfg = BEACON_TYPE_CONFIG[pres.type];
              const req = buildRequirements(b);
              const missing = getMissingRequirements(req, props.ctx);
              const nowMs = Date.now();

              return (
                <button
                  key={b.id}
                  className="w-full text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 transition"
                  onClick={() => props.onOpenBeacon(b)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold opacity-90">
                      {pres.label} • Expires in {formatRemaining(b.expiresAtMs, nowMs)}
                    </div>
                    <div className="text-[10px] opacity-70">{tier}</div>
                  </div>
                  <div className="text-sm font-medium leading-snug">{b.title}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {req.map((r) => (
                      <span
                        key={r}
                        className="text-[11px] px-2 py-[2px] rounded-full border border-white/15 bg-black/30"
                      >
                        {requirementChipLabel(r)}
                      </span>
                    ))}
                    {missing.includes("PREMIUM") ? (
                      <span className="text-[11px] px-2 py-[2px] rounded-full border border-white/15 bg-black/30">
                        Premium locked
                      </span>
                    ) : null}
                    {b.isSponsored ? (
                      <span className="text-[11px] px-2 py-[2px] rounded-full border border-white/15 bg-black/30">
                        Sponsored
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-xs opacity-70">
            Tap a card or a pin to open the action sheet.
          </div>
        </div>
      </div>

      {/* Map Controls Sheet */}
      <MapControlsSheet
        open={controlsOpen}
        onOpenChange={setControlsOpen}
        layers={layers}
        onChange={handleLayerChange}
      />
    </div>
  );
}