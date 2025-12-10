import type { Request } from "express";
import type { Beacon } from "../types/beacon";
import type { SignedBeaconPayload } from "../types/signedBeacon";
import type { GeoInfo } from "./scanEvents";

export async function handleCareBeaconScan({
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
  const xp = 1;

  return {
    actionOverride: "care_open",
    xp,
    ui: {
      kind: "hnh_open",
      message:
        "Care dressed as kink, dripping in sweat. Community support, not medical advice. (demo)",
      beacon_id: beacon.id
    }
  };
}
