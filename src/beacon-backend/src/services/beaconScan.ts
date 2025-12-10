import type { Request, Response } from "express";
import type { Beacon } from "../types/beacon";
import type { SignedBeaconPayload } from "../types/signedBeacon";

import { awardXP } from "./xp";
import {
  createScanEvent,
  inferGeoFromRequest,
  type GeoInfo
} from "./scanEvents";
import { handleTicketScan } from "./ticketFlows";
import { handleTicketResaleScan } from "./ticketResaleFlows";
import { handleProductOrDropScan } from "./productFlows";
import { handlePersonBeaconScan } from "./personFlows";
import { handleRoomBeaconScan } from "./roomFlows";
import { handleCareBeaconScan } from "./careFlows";

export interface BeaconScanContext {
  beacon: Beacon;
  signedPayload?: SignedBeaconPayload | null;
}

export async function handleBeaconScan(
  req: Request,
  res: Response,
  ctx: BeaconScanContext
): Promise<void> {
  const { beacon, signedPayload = null } = ctx;
  const user = (req as any).user || null;
  const scanSource = (req as any).scanSource || "qr";

  const geo: GeoInfo = await inferGeoFromRequest(req, beacon);

  let action: string = "view";
  if (beacon.type === "presence" && beacon.subtype === "checkin") {
    action = "checkin";
  } else if (beacon.type === "transaction" && beacon.subtype === "ticket") {
    action = "ticket_validate";
  } else if (
    beacon.type === "transaction" &&
    (beacon.subtype === "product" || beacon.subtype === "drop")
  ) {
    action = "purchase";
  } else if (beacon.type === "social" && beacon.subtype === "person") {
    action = "hookup_request";
  } else if (beacon.type === "social") {
    action = "join_room";
  } else if (beacon.type === "care") {
    action = "care_open";
  }

  let result:
    | {
        ui: any;
        xp?: number;
        actionOverride?: string;
      }
    | undefined;

  if (beacon.type === "presence") {
    result = await handlePresenceScan({ req, beacon, user, geo });
  } else if (beacon.type === "transaction" && beacon.subtype === "ticket") {
    result = await handleTicketScan({ req, beacon, user, geo, signedPayload });
  } else if (
    beacon.type === "transaction" &&
    beacon.subtype === "ticket_resale"
  ) {
    result = await handleTicketResaleScan({
      req,
      beacon,
      user,
      geo,
      signedPayload
    });
  } else if (
    beacon.type === "transaction" &&
    (beacon.subtype === "product" || beacon.subtype === "drop")
  ) {
    result = await handleProductOrDropScan({
      req,
      beacon,
      user,
      geo,
      signedPayload
    });
  } else if (beacon.type === "social" && beacon.subtype === "person") {
    result = await handlePersonBeaconScan({
      req,
      beacon,
      user,
      geo,
      signedPayload
    });
  } else if (
    beacon.type === "social" &&
    (beacon.subtype === "room" || beacon.subtype === "geo_room")
  ) {
    result = await handleRoomBeaconScan({
      req,
      beacon,
      user,
      geo,
      signedPayload
    });
  } else if (beacon.type === "care" && beacon.subtype === "hnh") {
    result = await handleCareBeaconScan({
      req,
      beacon,
      user,
      geo,
      signedPayload
    });
  } else {
    result = {
      ui: {
        kind: "unsupported_beacon",
        message: `Beacon type ${beacon.type}/${beacon.subtype} is not yet implemented.`
      }
    };
  }

  if (result?.actionOverride) {
    action = result.actionOverride;
  }
  const xpAwarded = result?.xp || 0;

  await createScanEvent({
    beacon,
    user,
    source: scanSource,
    geo,
    action,
    xp_awarded: xpAwarded,
    signedPayload
  });

  if (user && xpAwarded > 0) {
    await awardXP({
      userId: user.id,
      beaconId: beacon.id,
      amount: xpAwarded,
      reason: action
    });
  }

  res.json({
    ok: true,
    action,
    beacon: {
      id: beacon.id,
      code: beacon.code,
      type: beacon.type,
      subtype: beacon.subtype,
      label: beacon.label,
      status: beacon.status
    },
    xp_awarded: xpAwarded,
    ui: result?.ui || null
  });
}

async function handlePresenceScan({
  req,
  beacon,
  user,
  geo
}: {
  req: Request;
  beacon: Beacon;
  user: any;
  geo: GeoInfo;
}): Promise<{ ui: any; xp?: number; actionOverride?: string }> {
  let xp = 0;
  const insideVenue =
    beacon.geo_mode === "venue" && geo.insideVenue === true;

  if (user && insideVenue) {
    xp = beacon.xp_base || 1;
  }

  return {
    actionOverride: "checkin",
    xp,
    ui: {
      kind: "checkin",
      venue_id: beacon.payload.venue_id || null,
      insideVenue,
      message: insideVenue
        ? "You've checked in (demo)."
        : "You're outside the demo venue radius."
    }
  };
}
