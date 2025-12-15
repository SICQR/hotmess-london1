import { Beacon } from "./types/beacon";

const nowIso = new Date().toISOString();

// Example demo beacons
const beacons: Beacon[] = [
  {
    id: "b_checkin",
    code: "DEMO_CHECKIN",
    type: "presence",
    subtype: "checkin",
    owner_id: "venue_001",
    label: "Soho Sauna Check-in",
    description: "Venue check-in demo beacon",
    geo_mode: "venue",
    geo: { lat: 51.5136, lng: -0.1357, radius_m: 150 },
    time_window: null,
    xp_base: 25,
    xp_cap_per_user_per_day: 1,
    payload: { venue_id: "venue_001" },
    utm: null,
    status: "active",
    created_at: nowIso,
    updated_at: nowIso
  },
  {
    id: "b_ticket",
    code: "DEMO_TICKET",
    type: "transaction",
    subtype: "ticket",
    owner_id: "user_ticket_owner",
    label: "HOTMESS Launch Party Ticket",
    description: null,
    geo_mode: "venue",
    geo: { lat: 51.5136, lng: -0.1357, radius_m: 150 },
    time_window: null,
    xp_base: 10,
    xp_cap_per_user_per_day: 1,
    payload: { ticket_id: "t_demo", event_id: "evt_demo" },
    utm: null,
    status: "active",
    created_at: nowIso,
    updated_at: nowIso
  },
  {
    id: "b_product",
    code: "DEMO_PRODUCT",
    type: "transaction",
    subtype: "product",
    owner_id: "vendor_demo",
    label: "RAW Vest Demo Drop",
    description: "Demo product beacon",
    geo_mode: "none",
    geo: null,
    time_window: null,
    xp_base: 5,
    xp_cap_per_user_per_day: 5,
    payload: { listing_id: "lst_demo", vendor_id: "vendor_demo" },
    utm: null,
    status: "active",
    created_at: nowIso,
    updated_at: nowIso
  },
  {
    id: "b_person",
    code: "DEMO_PERSON",
    type: "social",
    subtype: "person",
    owner_id: "user_person_owner",
    label: "Person Hook-up Code Demo",
    description: null,
    geo_mode: "none",
    geo: null,
    time_window: null,
    xp_base: 1,
    xp_cap_per_user_per_day: 10,
    payload: {},
    utm: null,
    status: "active",
    created_at: nowIso,
    updated_at: nowIso
  },
  {
    id: "b_room",
    code: "DEMO_ROOM",
    type: "social",
    subtype: "room",
    owner_id: "user_room_owner",
    label: "Demo Chat Room",
    description: "Static room invite demo",
    geo_mode: "none",
    geo: null,
    time_window: null,
    xp_base: 1,
    xp_cap_per_user_per_day: 10,
    payload: { room_id: "room_demo" },
    utm: null,
    status: "active",
    created_at: nowIso,
    updated_at: nowIso
  },
  {
    id: "b_hnh",
    code: "DEMO_HNH",
    type: "care",
    subtype: "hnh",
    owner_id: "hotmess_care",
    label: "Hand N Hand Demo",
    description: "Care dressed as kink, dripping in sweat.",
    geo_mode: "none",
    geo: null,
    time_window: null,
    xp_base: 1,
    xp_cap_per_user_per_day: 3,
    payload: {},
    utm: null,
    status: "active",
    created_at: nowIso,
    updated_at: nowIso
  }
];

// Fake ticket, listing, resale, etc
export const mockTicket = {
  id: "t_demo",
  event_id: "evt_demo",
  owner_id: "user_ticket_owner",
  status: "valid" as const,
  history: [] as any[]
};

export const mockListing = {
  id: "lst_demo",
  vendor_id: "vendor_demo",
  title: "RAW Vest (Demo)",
  description: "Heavy-duty, sweat-ready vest – demo listing.",
  price_cents: 3500,
  currency: "GBP",
  fulfilment_mode: "vendor" as const,
  is_active: true
};

export const mockResale = {
  id: "tr_demo",
  ticket_id: "t_demo",
  seller_id: "user_ticket_owner",
  price_cents: 2000,
  status: "active" as const
};

export function getBeaconByCode(code: string) {
  return beacons.find(b => b.code === code) || null;
}
