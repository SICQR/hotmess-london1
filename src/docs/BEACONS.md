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
- Signed beacon payloads (`/x/:payload.:sig`)  
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

### 3.7 Signed Beacon Payload (for /x/:payload.:sig)

Signed payloads are used for:
- one-night person QRs
- ticket resale shortlinks
- invite-only rooms
- expiring special codes

```ts
export interface SignedBeaconPayload {
  code: string;        // Beacon.code
  nonce: string;       // random, unique-ish
  exp: number;         // unix timestamp (seconds)
  kind?: string;       // "person" | "resale" | "one_night_room" | "vip" | ...
}
```

Encode:
1. `payloadJson = JSON.stringify(payload)`
2. `payloadB64 = base64url(payloadJson)`
3. `sig = base64url(HMAC_SHA256(payloadB64, BEACON_SECRET))`

QR encodes:
```
https://hotmessldn.com/x/{payloadB64}.{sig}
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
| sponsor | sponsored beacon/inventory | sponsor_id, optional nested links | depends: view / purchase / checkin |

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

Public entrypoints:
- `GET /l/:code` – normal beacon scan
- `GET /x/:payload.:sig` – signed beacon scan (expiring, discreet)

Both end up in the same internal pipeline.

### 5.1 Steps

1. **Resolve Beacon**
   - `/l/:code` → look up beacons by code.
   - `/x/:payload.:sig` → verify signature & expiry, then look up beacons by payload.code.
   - If not found or status != "active" → show "Beacon closed or invalid".

2. **Age & men-only gate**
   - If not previously passed:
     - Modal: "HOTMESS is for adult men, 18+ only."
     - [ I'm 18+ and a man ] → set cookie/flag, log consent.
     - [ Leave ] → redirect.
   - Logged to consent_logs (age_gate).

3. **Consent prompts**
   - **Location**: "Can we use your location for check-ins, heatmaps and XP?" → store geo_consent.
   - **Data**: "We log scans to give you XP and safer tools. You can delete this any time." → store data_consent.

4. **Geo acquisition (if allowed)**
   - If geo_consent == true and beacon.geo_mode != "none":
     - request browser location or IP-based city.
   - geo_mode behaviours:
     - **venue**: require distance <= geo.radius_m for full XP. Otherwise mark as out-of-venue (usually no XP).
     - **city**: round/jitter coords to a safe grid.
     - **exact_fuzzed**: store precise; only expose aggregated, jittered.

5. **Compute action type**
   - Map beacon.type/subtype to default ScanAction:
     - presence/checkin → "checkin"
     - transaction/ticket → "ticket_validate"
     - transaction/product/drop → "purchase"
     - social/room/geo_room → "join_room"
     - social/person → "hookup_request" / "hookup_accept"
     - care/hnh → "care_open"

6. **XP calculation**
   - Lookup membership tier.
   - Candidate XP: `xp = beacon.xp_base * tierMultiplier[tier];`
   - Apply:
     - per-beacon per-user per-day cap,
     - global per-user per-day cap,
     - geo requirements,
     - care/social-specific caps.
   - If > 0, insert XPEntry.

7. **Log ScanEvent**
   - Save with final action and xp_awarded.

8. **Dispatch to specific flow handler**
   - Presence: check-in UX.
   - Ticket: validate / show ticket info.
   - Resale: show buying UX, call Stripe, transfer ticket.
   - Product/drop: show product UX, call commerce, create order.
   - Person: create connection request, allow accept/decline.
   - Room/geo_room: join chat.
   - HNH: show care landing + optional room.

9. **Emit internal event**
   - `scan.created` with Beacon, ScanEvent, user & related IDs.
   - Subscribers:
     - XP engine (already applied),
     - Ticket service,
     - Commerce / MessMarket,
     - Chat / Room service,
     - Care service,
     - Map / analytics,
     - Bots & automations (via webhooks/Make.com).

---

## 6. Type-Specific Flow Summaries

### 6.1 Presence – Check-in
- Venue, sauna, cruise, event presence.
- geo_mode="venue".
- XP: once per venue per night.
- Map: aggregated counts → live heat on 3D globe.

---

### 6.2 Ticket
- **Ticket purchase**: Ticket record + ticket beacon bound by ticket_id.
- **Door scanning**: `/l/:code?mode=validate` calls Ticket Service. Ticket status flips valid → scanned. XP added: ticket_attend.
- **Resale**: ticket_resale beacon + signed /x/ URLs for safe resale. Stripe purchase → owner change, history update, XP for seller + buyer.

---

### 6.3 Product / Drop / MessMarket
- Listings represent products.
- Product or drop beacons wrap listing with XP rules.
- Scan:
  - GET → product/drop info.
  - POST → purchase via Shopify/Stripe/MessMarket.
- Vendor fulfilment via listing.fulfilment_mode.
- XP: buyer (and option for vendor).

---

### 6.4 Social – Person
- User has one person beacon.
- One-night signed QRs minted via /x/:payload.:sig with expiry.
- Scan:
  - If owner: show sharing UX.
  - If other user:
    - show safe profile snippet,
    - allow message + rough area,
    - create ConnectionRequest.
  - Owner:
    - Accept → private room + XP for both.
    - Decline / block → stop contact.

---

### 6.5 Social – Room & Geo Room
- **Static room (room)**: always-on invite to Room.
- **Geo room (geo_room)**: venue/event chat, either QR or "nearby room" suggestion when inside geo radius, can be auto-suggested after check-in or ticket validation.

---

### 6.6 Care – Hand N Hand
- type="care", subtype="hnh".
- Scan:
  - shows care landing (resources + optional room),
  - displays care disclaimer (community support, not medical advice).
- XP: small, capped, symbolic.

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
- **Presence**: checkin, event_presence
- **Transaction**: ticket_attend, ticket_resale_buy, ticket_resale_sell, product_buy, drop_buy
- **Social**: hookup_request, hookup_accept, first room_join per night
- **Care**: hnh_visit, hnh_room_join (strict caps)

### 7.3 Caps
- **Per-beacon per-user per-day**: beacon.xp_cap_per_user_per_day (default 1 for check-ins).
- **Global per-user per-day**: e.g. MAX_DAILY_XP = 500.
- **Care XP**: capped weekly.
- **Social XP**: only on mutual actions (accept), not spam.

---

## 8. Safety, Privacy, and Compliance

- **Men-only, 18+ gate**: enforced before any beacon action.
- **Geo modes**:
  - **none**: minimal logging, only coarse region.
  - **venue**: used for check-ins and access; not shown individually on map.
  - **city**: aggregated heatmaps, never precise.
  - **exact_fuzzed**: precise in DB, jittered & aggregated in analytics.
- **Map**: never shows per-user dots. Shows:
  - venues, saunas, cruise zones (POIs),
  - aggregated check-ins,
  - XP heat,
  - beacon activity (drops, sponsors).
- **Care**: always show Care Disclaimer. Never glamorise drugs. Emphasise community support and safety.
- **Moderation**: all social flows must support:
  - block / mute,
  - abuse reports (AdminBot + moderation queue),
  - emergency pause/end beacon.

---

## 9. Mental Model Summary

- **Beacon is the router.**
- **QR & shortlinks are handles for Beacons.**
- **Tickets / Listings / Rooms / Venues / Sponsors / Affiliates hang off as payloads.**
- **Scan triggers one pipeline; everything else subscribes to events.**
- **Map, XP, bots, care, hook-ups, drops, tickets, vendors all sit on top of the same Beacon OS.**

**If it can be expressed as a Beacon, it lives here.**
