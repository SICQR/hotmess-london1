// lib/actions/beacons.ts
// Server Actions for beacon operations (scan, create, etc.)

"use server";

import { callRpc, ActionResult } from "./_helpers";
import type { Json } from '@/types/database.types';

// ============================================================================
// Types
// ============================================================================

export type BeaconScanResult = {
  sessionToken: string;
  xpAwarded: number;
  beacon: {
    id: string;
    status: string;
    type: string;
    title: string;
    description: string | null;
    startsAt: string;
    expiresAt: string;
    durationHours: number;
    isSponsored: boolean;
    sponsorName: string | null;
    sponsorDisclosure: string | null;
    requirements: {
      age18: boolean;
      consent: boolean;
      premium: boolean;
      gpsMode: string;
      gpsRadiusM: number;
    };
    xp: {
      scan: number;
      action: number;
    };
    actionRoute: string;
    actionConfig: Record<string, Json>;
  };
};

export type BeaconSessionData = {
  token: string;
  beacon: BeaconScanResult["beacon"];
};

export type BeaconCreateResult = {
  beaconId: string;
  status: string;
  startsAt: string;
  expiresAt: string;
  qrKey: string;
};

export type ProximityResult = {
  passed: boolean;
  distance: number | null;
  required: number;
  mode: string;
};

// ============================================================================
// Actions
// ============================================================================

/**
 * Redeem a QR scan (server-side XP award, idempotent)
 */
export async function redeemBeaconScan(
  qrKey: string,
  source: string = "qr",
  guestId?: string,
  deviceHash?: string,
  ipHash?: string
): Promise<ActionResult<BeaconScanResult>> {
  return callRpc("redeem_scan", {
    p_qr_key: qrKey,
    p_source: source,
    p_guest_id: guestId ?? null,
    p_device_hash: deviceHash ?? null,
    p_ip_hash: ipHash ?? null,
  });
}

/**
 * Get beacon session data from session token
 */
export async function getBeaconSession(
  token: string
): Promise<ActionResult<BeaconSessionData>> {
  return callRpc("get_scan_session", {
    p_token: token,
  });
}

/**
 * Verify user proximity to beacon (GPS hard requirement)
 */
export async function verifyBeaconProximity(
  beaconId: string,
  lat: number,
  lng: number
): Promise<ActionResult<ProximityResult>> {
  return callRpc("verify_proximity", {
    p_beacon_id: beaconId,
    p_user_lat: lat,
    p_user_lng: lng,
  });
}

/**
 * Create a new beacon (creator only)
 */
export async function createBeacon(input: {
  type: string;
  title: string;
  description?: string;
  durationHours: number;
  startsAt: string;
  city?: string;
  lat?: number;
  lng?: number;
  mapVisibility?: boolean;
  previewMode?: boolean;
  consentRequired?: boolean;
  premiumRequired?: boolean;
  gpsMode?: string;
  gpsRadiusM?: number;
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorDisclosure?: string;
  actionRoute?: string;
  actionConfig?: Record<string, Json>;
  xpScan?: number;
  xpAction?: number;
  publishNow?: boolean;
}): Promise<ActionResult<BeaconCreateResult>> {
  // Validation
  if (!input.title || input.title.trim().length === 0) {
    return {
      ok: false,
      error: { code: "validation", message: "Title is required." }
    };
  }

  if (![3, 6, 9].includes(input.durationHours)) {
    return {
      ok: false,
      error: { code: "validation", message: "Duration must be 3, 6, or 9 hours." }
    };
  }

  return callRpc("create_beacon", {
    p_type: input.type,
    p_title: input.title.trim(),
    p_description: input.description?.trim() || null,
    p_duration_hours: input.durationHours,
    p_starts_at: input.startsAt,
    p_city: input.city || null,
    p_lat: input.lat ?? null,
    p_lng: input.lng ?? null,
    p_map_visibility: input.mapVisibility ?? true,
    p_preview_mode: input.previewMode ?? true,
    p_consent_required: input.consentRequired ?? false,
    p_premium_required: input.premiumRequired ?? false,
    p_gps_mode: input.gpsMode ?? "off",
    p_gps_radius_m: input.gpsRadiusM ?? 200,
    p_is_sponsored: input.isSponsored ?? false,
    p_sponsor_name: input.sponsorName || null,
    p_sponsor_disclosure: input.sponsorDisclosure || null,
    p_action_route: input.actionRoute ?? "/beacons",
    p_action_config: input.actionConfig ?? {},
    p_xp_scan: input.xpScan ?? 10,
    p_xp_action: input.xpAction ?? 25,
    p_publish_now: input.publishNow ?? false,
  });
}

/**
 * Rotate beacon QR key (if leaked)
 */
export async function rotateBeaconQR(
  beaconId: string
): Promise<ActionResult<{ beaconId: string; qrKey: string }>> {
  return callRpc("rotate_beacon_qr", {
    p_beacon_id: beaconId,
  });
}
