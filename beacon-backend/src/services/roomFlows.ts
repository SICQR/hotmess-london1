import type { Request } from "express";
import type { Beacon } from "../types/beacon";
import type { SignedBeaconPayload } from "../types/signedBeacon";
import type { GeoInfo } from "./scanEvents";

async function joinRoom(roomId: string, userId: string) {
  console.log("[Room] join", { roomId, userId });
  return { id: roomId };
}

export async function handleRoomBeaconScan({
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
  const roomId = beacon.payload.room_id;
  if (!roomId) {
    return { ui: { kind: "room_error", message: "Room not bound to beacon." } };
  }

  if (!user) {
    return {
      ui: { kind: "auth_required", message: "Login required to join room." }
    };
  }

  const isGeoRoom = beacon.subtype === "geo_room";
  const insideVenue = geo.insideVenue === true;

  const room = await joinRoom(roomId, user.id);
  const xp = 1;

  return {
    actionOverride: "join_room",
    xp,
    ui: {
      kind: "room_joined",
      room_id: room.id,
      geo_room: isGeoRoom,
      insideVenue,
      message: "Joined room (demo)."
    }
  };
}
