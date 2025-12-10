import type { Beacon } from "../types/beacon";
import type { SignedBeaconPayload } from "../types/signedBeacon";

export type GeoInfo = {
  mode: "none" | "venue" | "city" | "exact_fuzzed";
  lat?: number;
  lng?: number;
  insideVenue?: boolean;
};

export async function inferGeoFromRequest(req: any, beacon: Beacon): Promise<GeoInfo> {
  const geoMode = beacon.geo_mode || "none";
  const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
  const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;

  const info: GeoInfo = { mode: geoMode, lat, lng, insideVenue: false };

  if (geoMode === "venue" && beacon.geo && lat != null && lng != null) {
    const dx = lat - beacon.geo.lat;
    const dy = lng - beacon.geo.lng;
    const distSq = dx * dx + dy * dy;
    const radius = (beacon.geo.radius_m || 150) / 111_000;
    info.insideVenue = distSq <= radius * radius;
  }

  return info;
}

export async function createScanEvent({
  beacon,
  user,
  source,
  geo,
  action,
  xp_awarded,
  signedPayload
}: {
  beacon: Beacon;
  user: any;
  source: string;
  geo: GeoInfo;
  action: string;
  xp_awarded: number;
  signedPayload?: SignedBeaconPayload | null;
}) {
  console.log("[ScanEvent]", {
    beacon_id: beacon.id,
    code: beacon.code,
    user_id: user?.id || null,
    source,
    geo,
    action,
    xp_awarded,
    signed_kind: signedPayload?.kind || null
  });
}
