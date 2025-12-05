# BEACONS.md  
**HOTMESS Beacon OS – Single Source of Truth for QR, Shortlinks, Tickets, Drops, Chat & Care**

---

## 1. Purpose

The Beacon system is the **central routing brain** for HOTMESS:

- Every QR and shortlink points to a **Beacon**.
- Every Beacon is **one intent**: check-in, ticket, drop, hook-up, room, care, sponsor.
- Every scan runs through **one pipeline** and then fans out to:
  - XP engine  
  - Tickets  
  - Commerce / MessMarket  
  - Chat / Rooms  
  - Care / Hand N Hand  
  - Map / 3D globe  
  - Bots / Automations  

This file defines:

- Data model (Beacon + related objects)  
- Beacon types & subtypes  
- Scan pipeline  
- API surface  
- XP rules  
- Safety & privacy rules  

---

## 2. Core Concepts

### 2.1 Master Types

All beacons belong to one of four master types:

- `presence` – where someone is (venues, saunas, parties, cruise zones).  
- `transaction` – money and access (tickets, resale, products, drops, affiliates, sponsors).  
- `social` – connections and rooms (person QR, group chat, GPS chat).  
- `care` – Hand N Hand, aftercare, support and resources.

Subtypes refine behaviour (see matrix below).

---

## 3. Data Model

> Type hints are TypeScript-style for clarity. Actual implementation = Postgres / Supabase.

### 3.1 Beacon

```ts
type BeaconType = "presence" | "transaction" | "social" | "care";

type BeaconSubtype =
  | "checkin"          // venue, sauna, cruise area, free event presence
  | "event_presence"   // optional event-only check-in
  | "ticket"           // primary ticket access
  | "ticket_resale"    // resale flow
  | "product"          // merch / MessMarket product
  | "drop"             // limited-time drop
  | "affiliate"        // creator/affiliate link
  | "sponsor"          // sponsored beacon/inventory
  | "person"           // personal QR for hook-ups
  | "room"             // static room invite
  | "geo_room"         // GPS-based room (venue/event chat)
  | "hnh";             // Hand N Hand / care

type GeoMode = "none" | "venue" | "city" | "exact_fuzzed";

type BeaconStatus = "draft" | "active" | "paused" | "ended";

interface Beacon {
  id: string;                          // uuid
  code: string;                        // HM9X73 – used in QR & shortlink /l/:code
  type: BeaconType;
  subtype: BeaconSubtype;
  owner_id: string;                    // user, venue, vendor, HOTMESS account

  label: string;
  description?: string | null;

  geo_mode: GeoMode;
  geo?: {
    lat: number;
    lng: number;
    radius_m?: number;                 // used for "venue" mode
  } | null;

  time_window?: {
    starts_at: string;                 // ISO
    ends_at: string | null;
  } | null;

  xp_base: number;                     // base XP per valid action
  xp_cap_per_user_per_day: number;     // per-beacon cap

  // Optional payload links (all nullable)
  payload: {
    venue_id?: string;
    event_id?: string;
    ticket_id?: string;
    listing_id?: string;
    vendor_id?: string;
    room_id?: string;
    sponsor_id?: string;
    affiliate_id?: string;
  };

  utm?: Record<string, string> | null;

  status: BeaconStatus;
  created_at: string;
  updated_at: string;
}
```

---

### 3.2 Scan Event

Every scan creates a scan_events row.

```ts
type ScanAction =
  | "view"
  | "checkin"
  | "ticket_validate"
  | "purchase"
  | "join_room"
  | "hookup_request"
  | "hookup_accept"
  | "care_open";

interface ScanEvent {
  id: string;
  beacon_id: string;
  user_id?: string | null;             // anonymous possible
  source: "qr" | "link" | "bot" | "embed";
  ip_hash?: string | null;

  geo: {
    mode: GeoMode;
    lat?: number;
    lng?: number;
    accuracy_m?: number;
  };

  user_agent?: string | null;

  action: ScanAction;
  xp_awarded: number;
  created_at: string;
}
```

---

### 3.3 XP Ledger

```ts
type XPDirection = "earn" | "spend";

interface XPEntry {
  id: string;
  user_id: string;
  beacon_id?: string | null;
  amount: number;               // positive for earn, negative for spend
  direction: XPDirection;
  reason: string;               // "checkin", "ticket_attend", "product_buy", "care", "social_connect", ...
  created_at: string;
}
```

Global XP caps enforced outside the DB (per-user per-day).

---

### 3.4 Tickets (Ticket Service)

```ts
type TicketStatus = "valid" | "transferred" | "scanned" | "void";

interface TicketHistoryItem {
  action: string;               // "created" | "transferred" | "scanned" | ...
  at: string;
  from?: string;
  to?: string;
}

interface Ticket {
  id: string;
  event_id: string;
  owner_id: string;
  status: TicketStatus;
  qr_code: string;              // usually Beacon.code
  history: TicketHistoryItem[];
  created_at: string;
  updated_at: string;
}
```

Resale offer:

```ts
type ResaleStatus = "active" | "sold" | "cancelled" | "expired";

interface TicketResale {
  id: string;
  ticket_id: string;
  seller_id: string;
  price_cents: number;
  status: ResaleStatus;
  created_at: string;
  updated_at: string;
}
```

---

### 3.5 Listings (Products / MessMarket)

```ts
type ListingSource = "internal" | "shopify" | "etsy" | "gumroad" | "vendor_shopify";
type FulfilmentMode = "hotmess" | "vendor" | "hybrid";

interface Listing {
  id: string;
  vendor_id: string;
  source: ListingSource;
  external_ref?: string | null;       // external listing id
  title: string;
  description?: string | null;
  price_cents: number;
  currency: string;
  fulfilment_mode: FulfilmentMode;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

---

### 3.6 Rooms (Chat)

```ts
type RoomType = "web" | "telegram";

interface Room {
  id: string;
  type: RoomType;
  name: string;
  external_ref?: string | null;      // e.g. Telegram chat id
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

---

## 4. Beacon Types Matrix

### 4.1 Presence

| subtype | use | geo_mode | payload | primary action |
|---------|-----|----------|---------|----------------|
| checkin | venue/sauna/cruise check-in | venue | venue_id | checkin |
| event_presence | non-ticketed event presence | venue | event_id, venue_id | checkin |

---

### 4.2 Transaction

| subtype | use | payload | primary action |
|---------|-----|---------|----------------|
| ticket | primary event access | ticket_id, event_id | ticket_validate |
| ticket_resale | second-hand ticket | ticket_id, event_id | purchase + transfer |
| product | merch / MessMarket product | listing_id, vendor_id | purchase |
| drop | limited-time hype drop | listing_id, vendor_id | purchase |
| affiliate | creator/affiliate link | listing_id/event_id, affiliate_id | purchase / redirect |
| sponsor | sponsored action / inventory | sponsor_id, optional nested links | depends: view / purchase / checkin |

---

### 4.3 Social

| subtype | use | geo_mode | payload | primary action |
|---------|-----|----------|---------|----------------|
| person | personal QR, hook-up requests | none | owner only | hookup_request / hookup_accept |
| room | static room invite | none or city | room_id | join_room |
| geo_room | GPS-based venue/event chat | venue / city | room_id, venue_id / event_id | join_room |

---

### 4.4 Care

| subtype | use | geo_mode | payload | primary action |
|---------|-----|----------|---------|----------------|
| hnh | Hand N Hand / aftercare | none or city | optional room_id | care_open / join_room |

---

## 5. Universal Scan Pipeline

**Endpoint:** `GET/POST /l/:code` (edge function / API route)

### 5.1 Steps

1. **Resolve Beacon**
   - Look up beacons by code.
   - If not found or status != "active" → show error page:
     - "This Beacon is closed or doesn't exist."

2. **Age & men-only gate**
   - If not previously passed:
     - Show modal:
       - "HOTMESS is for adult men, 18+ only."
       - [ I'm 18+ and a man ] → set cookie/flag, log consent.
       - [ Leave ] → redirect away.

3. **Consent prompts**
   - If no prior consent for this user/browser:
     - **Location:** "Can we use your location for check-ins, heatmaps and XP?"
       → store yes/no as geo_consent.
     - **Data:** "We log scans to give you XP and safer tools. You can delete this any time."
       → store yes/no as data_consent.

4. **Geo acquisition (if allowed)**
   - If geo_consent == true and beacon.geo_mode != "none":
     - Request browser location; if denied, fall back to IP city or geo_mode="none".
     - Apply mode:
       - **venue:**
         - require distance <= geo.radius_m for full XP.
         - otherwise mark as out-of-venue.
       - **city:**
         - round/jitter coords to a safe grid.
       - **exact_fuzzed:**
         - store precise, but never expose directly.

5. **Compute action type**
   - Map beacon.type/subtype to default ScanAction:
     - presence/checkin → "checkin"
     - transaction/ticket → "ticket_validate" (if entry mode)
     - transaction/product/drop → "purchase" (after confirmation)
     - social/room/geo_room → "join_room" (after confirmation)
     - social/person → "hookup_request" / "hookup_accept" (on accept)
     - care/hnh → "care_open"

6. **XP calculation**
   - Look up user's membership tier (or "anon").
   - Candidate XP:

```ts
let xp = beacon.xp_base * tierMultiplier[tier];

// per-beacon per-user per-day cap
// global per-user per-day cap
```

   - Apply geo rules:
     - If geo_mode="venue" and user outside → xp = 0 by default.
     - If data_consent = false and beacon policy requires it → xp = 0.
   - If xp > 0 and caps not exceeded:
     - insert XPEntry (direction="earn").

7. **Log ScanEvent**
   - Save ScanEvent with:
     - action
     - xp_awarded
     - geo (mode + coords per rules).

8. **Dispatch to specific flow handler**
   - **Presence:** check-in UX, show venue/event details.
   - **Transaction:** ticket validation or purchase screen.
   - **Social:** show connection/room UI.
   - **Care:** show HNH UI + disclaimer.

9. **Emit internal event**
   - `scan.created` with payload:
     - Beacon, ScanEvent, optional user & related IDs.
   - Consumers:
     - XP engine (already handled).
     - Ticket service.
     - Commerce / MessMarket.
     - Chat / Room service.
     - Care service.
     - Map / analytics.
     - Bots & automations (via webhooks/Make.com).

---

## 6. Type-Specific Flows (Summary)

### 6.1 Presence → Venue Check-in

- Scan venue's checkin beacon.
- If in radius:
  - Mark ScanEvent.action = "checkin".
  - Award XP once per venue per night.
  - Venue appears "live" on 3D globe.
- If outside radius:
  - Option: show "You're not at this venue" and no XP.

---

### 6.2 Transaction → Ticket

- **Ticket creation:**
  - Ticket Service creates Ticket.
  - Beacon created with subtype="ticket", payload.ticket_id.

- **Door scan:**
  - mode=validate flag in query or header.
  - Beacon Service resolves beacon & passes ticket_id to Ticket Service.
  - Ticket Service:
    - validates status/time window.
    - marks status="scanned".

- **XP:**
  - XP for ticket owner on successful scan.

- **Option:**
  - after validation, offer to join event geo_room or check-in.

---

### 6.3 Transaction → Ticket Resale

- User initiates resale from Ticket UI.
- Ticket Service:
  - creates TicketResale.
  - locks ticket until sale completes/cancels.
  - creates ticket_resale beacon with references.

- Scan resale beacon:
  - Shows resale UX:
    - price, event, seller note.
  - Stripe handles payment.
  - On success:
    - Ticket owner is updated to buyer.
    - Resale marked sold.
    - XP awarded (small) to seller & buyer.

---

### 6.4 Transaction → Product / Drop / MessMarket

- Vendor / HOTMESS selects Listing & creates beacon (product or drop).
- Scan:
  - Show product/drop page.
  - On purchase:
    - call commerce / MessMarket service.
    - record order with vendor fulfilment rules.
    - XP awarded to buyer (and vendor if configured).
  - On globe:
    - if tied to venue/event: spike at that location.
    - if global: generic online drop marker.

---

### 6.5 Social → Person (Hook-ups)

- User generates person beacon (personal QR).
- Scan:
  - show safe profile snippet.
  - allow message + optional rough area ("Soho", "East", etc. – not GPS).

- Backend:
  - create ConnectionRequest and notify owner.

- Owner:
  - **Accept:**
    - create/join private Room between two users.
    - ScanEvent.action = "hookup_accept" + small XP for both.
  - **Decline:**
    - soft decline; no further contact unless allowed.
  - **Block:**
    - prevent future requests from that user.

---

### 6.6 Social → Room (Static) & Geo Room (GPS Chat)

**Static Room (subtype="room"):**
- Payload: room_id.
- Scan:
  - confirm join.
  - add user to room.
  - log join_room + optional XP.

**Geo Room (subtype="geo_room"):**
- Payload: room_id + venue_id or event_id.
- geo_mode = "venue" or "city".
- Entry paths:
  - QR posters in venue.
  - Suggested after check-in or ticket scan.
  - "Nearby rooms" when user is inside radius & has geo enabled.
- Map:
  - aggregated count feeds into "room activity" glow for venue.

---

### 6.7 Care → HNH

- type="care", subtype="hnh".
- Payload:
  - optional room_id for care chat.

- Scan:
  - show Hand N Hand landing:
    - "You're not alone. You're on the right frequency."
    - Care resources.
    - Sunday show / radio call-out.
  - Always shows Care Disclaimer:
    - Community & information, not medical advice.

- XP:
  - small, capped per week.

- Option:
  - join care chat room.

---

## 7. XP Rules (Engine-Level)

### 7.1 Tier multipliers (example)

```ts
const tierMultiplier = {
  starter: 1.0,
  pro: 1.5,
  elite: 2.0,
};
```

### 7.2 Source categories

- **Presence:**
  - checkin, event_presence

- **Transaction:**
  - ticket_attend, ticket_resale, product_buy, drop_buy

- **Social:**
  - hookup_accept, room_join (first per night), first_message

- **Care:**
  - hnh_visit, hnh_room_join (strict caps)

### 7.3 Caps

- **Per-beacon per-user per-day:** beacon.xp_cap_per_user_per_day
  - default 1; higher for some drops if needed.

- **Global per-user per-day XP cap:**
  - e.g. MAX_DAILY_XP = 500.

- **Social:**
  - XP only when mutual (e.g. both accept).

- **Care:**
  - small weekly cap to avoid perverse incentives.

---

## 8. Safety, Privacy, and Compliance

- **Men-only, 18+ gate**
  - enforced on every beacon scan before any sensitive action.

- **Geo modes**
  - **none** → minimal logging; only coarse (country/region).
  - **venue** → used for check-ins; not shown individually on map.
  - **city** → aggregated heatmaps; no precise location.
  - **exact_fuzzed** → stored precisely; never exposed without jitter & aggregation.

- **Visibility & map**
  - Individual users are never plotted as unique dots.
  - Map shows:
    - venues, saunas, cruise zones (public POIs),
    - aggregated check-ins & XP heat,
    - beacon activity (drops, sponsors),
    - not who, just where & how hot.

- **Care**
  - All care-related beacons and flows must:
    - show disclaimer,
    - avoid glamorising drugs,
    - prioritise safety and support.

- **Moderation**
  - All social beacons and rooms must support:
    - block / mute,
    - report (ties into Admin / moderation queue),
    - admin tools to pause or end beacons instantly.

---

## 9. APIs (Sketch)

Concrete routes may be implemented as REST, RPC, or edge functions. This is the logical contract.

### 9.1 Beacon Service

- `GET /api/beacons/:code`
  - resolve beacon meta (for admin/ui).

- `POST /api/beacons`
  - create (admin / vendor / user depending on subtype).

- `PATCH /api/beacons/:id`
  - update properties, status.

- `POST /api/beacons/:code/scan`
  - optional explicit scan endpoint (if not using /l/:code directly).

- `GET /api/beacons/nearby?lat&lng`
  - returns active beacons with geo_mode != "none" around location:
    - used for nearby rooms, venue suggestions.

---

### 9.2 Ticket Service

- `POST /api/tickets` (internal)
- `POST /api/tickets/:id/validate`
- `POST /api/tickets/:id/resale`
- `POST /api/tickets/resale/:resale_id/purchase`

All ticket flows initiated after Beacon resolution.

---

### 9.3 Commerce / MessMarket

- `POST /api/orders`
- `GET /api/listings/:id`

Triggered from product/drop/affiliate beacons.

---

### 9.4 Rooms / Social

- `POST /api/rooms/:room_id/join`
- `POST /api/person-beacons/:id/request`
- `POST /api/person-requests/:id/accept`
- `POST /api/person-requests/:id/decline`
- `POST /api/person-requests/:id/block`

All anchored via beacon flows.

---

### 9.5 Care / HNH

- `GET /api/care/hnh` – resources.
- `POST /api/care/hnh/contact` – anon support request.

---

## 10. Beacon Manager (Admin UX – High Level)

Beacon Manager should allow:

### List view
- filter by type/subtype, owner, venue, event.
- show scans, unique users, XP, conversions.

### Create
- choose template:
  - Venue Check-in, Event Check-in, Ticket Access, Ticket Resale,
  - Product / Drop, MessMarket, Affiliate, Sponsor,
  - Person, Room, GPS Room, Care / HNH.
- set:
  - label, description,
  - links (venue/event/ticket/listing/room),
  - geo & time window,
  - XP & caps,
  - sponsor / affiliate IDs.

### Edit
- pause / end beacon,
- duplicate beacon (for similar events),
- see analytics.

---

## 11. Mental Model Summary

- **Beacon is the router.**
- **QR & shortlinks are just physical/digital handles for Beacons.**
- **Ticket / Listing / Room / Venue / Sponsor / Affiliate are payloads.**
- **Scan triggers one pipeline and then everything else subscribes to events.**
- **Map, XP, bots, care, hook-ups all sit on top of the same Beacon OS.**

When adding anything new:

1. Decide master type (presence | transaction | social | care).
2. Pick or define a subtype.
3. Attach appropriate payload IDs.
4. Configure geo + XP rules.
5. Use or extend existing scan → action mapping.

**If it can be expressed as a Beacon, it belongs here.**

---
