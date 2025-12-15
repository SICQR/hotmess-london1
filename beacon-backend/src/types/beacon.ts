export type BeaconType = "presence" | "transaction" | "social" | "care";

export type BeaconSubtype =
  | "checkin"
  | "event_presence"
  | "ticket"
  | "ticket_resale"
  | "product"
  | "drop"
  | "affiliate"
  | "sponsor"
  | "person"
  | "room"
  | "geo_room"
  | "hnh";

export type GeoMode = "none" | "venue" | "city" | "exact_fuzzed";

export type BeaconStatus = "draft" | "active" | "paused" | "ended";

export interface BeaconPayload {
  venue_id?: string;
  event_id?: string;
  ticket_id?: string;
  listing_id?: string;
  vendor_id?: string;
  room_id?: string;
  sponsor_id?: string;
  affiliate_id?: string;
}

export interface Beacon {
  id: string;
  code: string;
  type: BeaconType;
  subtype: BeaconSubtype;
  owner_id: string;

  label: string;
  description?: string | null;

  geo_mode: GeoMode;
  geo?: {
    lat: number;
    lng: number;
    radius_m?: number;
  } | null;

  time_window?: {
    starts_at: string;
    ends_at: string | null;
  } | null;

  xp_base: number;
  xp_cap_per_user_per_day: number;

  payload: BeaconPayload;

  utm?: Record<string, string> | null;

  status: BeaconStatus;
  created_at: string;
  updated_at: string;
}
