import type { Request } from "express";
import type { Beacon } from "../types/beacon";
import type { SignedBeaconPayload } from "../types/signedBeacon";
import type { GeoInfo } from "./scanEvents";

async function createConnectionRequest({
  fromUserId,
  toUserId,
  beaconId,
  message,
  roughArea,
  signedKind
}: {
  fromUserId: string;
  toUserId: string;
  beaconId: string;
  message?: string | null;
  roughArea?: string | null;
  signedKind?: string | null;
}) {
  console.log("[ConnectionRequest] create", {
    fromUserId,
    toUserId,
    beaconId,
    message,
    roughArea,
    signedKind
  });
  return { id: "cr_demo" };
}

export async function handlePersonBeaconScan({
  req,
  beacon,
  user,
  geo,
  signedPayload
}: {
  req: Request;
  beacon: Beacon;
  user: any;
  geo: GeoInfo;
  signedPayload?: SignedBeaconPayload | null;
}): Promise<{ ui: any; xp?: number; actionOverride?: string }> {
  if (!user) {
    return {
      ui: { kind: "auth_required", message: "Login required to connect." }
    };
  }

  if (user.id === beacon.owner_id) {
    return {
      actionOverride: "person_owner_view",
      xp: 0,
      ui: {
        kind: "person_owner",
        message:
          "This is your HOTMESS code (demo). Show it to someone you want to connect with."
      }
    };
  }

  const { message, area } = (req.body || {}) as { message?: string; area?: string };

  const cr = await createConnectionRequest({
    fromUserId: user.id,
    toUserId: beacon.owner_id,
    beaconId: beacon.id,
    message: message || null,
    roughArea: area || null,
    signedKind: signedPayload?.kind || null
  });

  const xp = 1;

  return {
    actionOverride: "hookup_request",
    xp,
    ui: {
      kind: "person_request_sent",
      request_id: cr.id,
      message: "Request sent (demo). If they accept, you'd be dropped into a private chat."
    }
  };
}
