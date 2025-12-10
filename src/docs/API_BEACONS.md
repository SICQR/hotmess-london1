# API_BEACONS.md  
**Beacon OS API – Routes & Contracts**

This document describes the main API endpoints around **Beacon OS**, not the whole HOTMESS app.

## 1. Public Entry Points

### 1.1 `GET /l/:code`

**Purpose:**  
Entry point for *standard* beacon scans (QR or shortlink).

**Path params:**
- `code` – `Beacon.code` (e.g. `HM9X73`)

**Query params (optional):**
- `mode=validate` – mark as door-scan for tickets.
- `source=qr|link|bot|embed` – for analytics override.

**Flow:**
1. Resolve Beacon by `code`.
2. Run age/men-only gate and consent.
3. Apply geo logic (if required).
4. Dispatch to type-specific handler:
   - `presence/checkin` → check-in flow.
   - `transaction/ticket` → `mode=validate` door logic, else ticket preview.
   - `transaction/product|drop` → product/drop flow.
   - `social/room|geo_room` → join-room suggestion.
   - `social/person` → connection request handler.
   - `care/hnh` → care landing.

**Response (example JSON for API clients):**
```json
{
  "beacon": { "id": "...", "type": "presence", "subtype": "checkin", "label": "Soho Venue Check-in" },
  "action": "checkin",
  "xp_awarded": 25,
  "ui": {
    "kind": "checkin_success",
    "message": "You've checked into [Venue]."
  }
}
```

The exact UI is rendered client-side; API JSON is internal.

---

### 1.2 `GET /x/:payloadB64.:sig`

**Purpose:**  
Entry point for signed, expiring, discreet beacons.

**Examples:**
- one-night person QR
- resale ticket QR
- invite-only room QR

**Path params:**
- `payloadB64` – base64url JSON of SignedBeaconPayload.
- `sig` – HMAC-SHA256 signature of payloadB64 with BEACON_SECRET.

**Flow:**
1. Recompute HMAC and verify sig.
2. Decode payloadB64 into SignedBeaconPayload.
3. Validate:
   - `exp >= now()`
   - nonce optional anti-reuse check.
4. Resolve Beacon by payload.code.
5. Attach signedPayload to request context.
6. Hand off to the same pipeline as /l/:code.

**Error cases:**
- Invalid signature → 403.
- Expired → 410.
- Unknown beacon → 404.

**Response:**  
Same shape as /l/:code but with signed context for internal use.

---

## 2. Internal Admin & Management APIs

### 2.1 Beacon CRUD

These are authenticated admin or owner routes.

#### `GET /api/beacons`

List beacons with filters.

**Query params:**
- `type` – filter by type.
- `subtype`
- `owner_id`
- `venue_id`
- `event_id`
- `status`

**Response:**
```json
[
  {
    "id": "b_123",
    "code": "HM9X73",
    "type": "presence",
    "subtype": "checkin",
    "label": "Soho Sauna Check-in",
    "status": "active",
    "payload": { "venue_id": "v_001" }
  }
]
```

---

#### `POST /api/beacons`

Create a new beacon (admin/vendor/user depending on subtype).

**Body (example):**
```json
{
  "type": "transaction",
  "subtype": "product",
  "owner_id": "vendor_123",
  "label": "RAW Vest Drop",
  "geo_mode": "none",
  "xp_base": 5,
  "xp_cap_per_user_per_day": 5,
  "payload": {
    "listing_id": "lst_001",
    "vendor_id": "vendor_123"
  }
}
```

**Response:**
```json
{
  "id": "b_456",
  "code": "HMABCD",
  "label": "RAW Vest Drop",
  "status": "active"
}
```

---

#### `PATCH /api/beacons/:id`

Update beacon properties (limited per subtype).

**Body (example):**
```json
{
  "label": "RAW Vest Drop – Round 2",
  "status": "paused",
  "xp_base": 10
}
```

**Response:** updated beacon JSON.

---

#### `DELETE /api/beacons/:id`

Soft-delete or mark status="ended"; should not hard-delete records because scan history needs to remain.

---

### 2.2 Nearby Beacons

#### `GET /api/beacons/nearby?lat&lng`

**Purpose:**  
Expose "nearby" beacons, typically:
- `geo_room` (venue chat)
- `checkin` (venue check-ins)

**Query params:**
- `lat`: number
- `lng`: number
- optional: `radius_m` (default e.g. 500m)

**Response:**
```json
{
  "beacons": [
    {
      "id": "b_room",
      "code": "HMROOM",
      "type": "social",
      "subtype": "geo_room",
      "label": "Basement Tonight",
      "payload": { "room_id": "room_001", "venue_id": "v_001" },
      "distance_m": 120
    },
    {
      "id": "b_checkin",
      "code": "HMCHK1",
      "type": "presence",
      "subtype": "checkin",
      "label": "Soho Check-in",
      "payload": { "venue_id": "v_001" },
      "distance_m": 80
    }
  ]
}
```

Used by client for "Nearby" UI & join prompts.

---

## 3. Tickets API

### 3.1 `POST /api/tickets`

**Purpose:**  
Issue a new ticket for a given event & user.

**Body:**
```json
{
  "event_id": "evt_001",
  "owner_id": "user_123"
}
```

**Response:**
```json
{
  "ticket": {
    "id": "t_001",
    "event_id": "evt_001",
    "owner_id": "user_123",
    "status": "valid",
    "qr_code": "HMTKT1"
  },
  "beacon": {
    "id": "b_tkt",
    "code": "HMTKT1",
    "type": "transaction",
    "subtype": "ticket"
  }
}
```

---

### 3.2 `POST /api/tickets/:id/validate`

**Purpose:**  
Door scanning API – mark ticket as used.

**Body:**
```json
{
  "scanner_id": "door_user_1"
}
```

**Response:**
```json
{
  "ok": true,
  "ticket_id": "t_001",
  "status": "scanned"
}
```

Internally this is usually reached via /l/:code?mode=validate, but the explicit API can be used by custom door hardware.

---

### 3.3 `POST /api/tickets/:id/resale`

**Purpose:**  
Create a resale offer & signed beacon URL.

**Body:**
```json
{
  "seller_id": "user_123",
  "price_cents": 2000
}
```

**Response:**
```json
{
  "resale": {
    "id": "tr_001",
    "ticket_id": "t_001",
    "seller_id": "user_123",
    "price_cents": 2000,
    "status": "active"
  },
  "beacon": {
    "id": "b_resale",
    "code": "HMRS1",
    "type": "transaction",
    "subtype": "ticket_resale"
  },
  "signed": {
    "url": "https://hotmessldn.com/x/<payload>.<sig>",
    "payloadB64": "<payload>",
    "sig": "<sig>"
  }
}
```

---

### 3.4 `POST /api/tickets/resale/:resale_id/purchase`

**Purpose:**  
Complete resale after payment.

**Body:**
```json
{
  "buyer_id": "user_999",
  "payment_intent_id": "pi_..."
}
```

**Response:**
```json
{
  "ok": true,
  "ticket_id": "t_001",
  "new_owner_id": "user_999"
}
```

XP awarded internally to buyer & seller.

---

## 4. Products / MessMarket API

### 4.1 `POST /api/listings/:id/beacon`

Create a product/drop beacon for a listing.

**Body (optional):**
```json
{
  "owner_id": "vendor_123",
  "drop": true
}
```

**Response:**
```json
{
  "beacon": {
    "id": "b_drop",
    "code": "HMDROP1",
    "type": "transaction",
    "subtype": "drop",
    "payload": { "listing_id": "lst_001", "vendor_id": "vendor_123" }
  }
}
```

---

### 4.2 `GET /api/listings/:id`

Return listing info (title, price, source, fulfilment).

---

### 4.3 `POST /api/orders`

Create order after successful payment.

**Body:**
```json
{
  "user_id": "user_123",
  "listing_id": "lst_001",
  "vendor_id": "vendor_123",
  "price_cents": 3500,
  "payment_intent_id": "pi_..."
}
```

**Response:**
```json
{
  "ok": true,
  "order_id": "ord_001"
}
```

XP engine called internally via awardXP.

---

## 5. Social / Person API

### 5.1 `POST /api/person-beacons/mint`

Mint a one-night signed QR for the logged-in user.

**Body:** (optional options)
```json
{}
```

**Response:**
```json
{
  "beacon": {
    "id": "b_person",
    "code": "HMPERS1",
    "type": "social",
    "subtype": "person"
  },
  "signed": {
    "url": "https://hotmessldn.com/x/<payload>.<sig>",
    "payloadB64": "<payload>",
    "sig": "<sig>"
  }
}
```

Use signed.url with QR Worker: `/qr/signed/<payload>.<sig>.svg?style=stealth`.

---

### 5.2 `POST /api/person-requests`

Create a connection request (usually triggered inside /l//x flow).

**Body:**
```json
{
  "beacon_code": "HMPERS1",
  "message": "You look fit.",
  "area": "Soho"
}
```

**Response:**
```json
{
  "status": "pending",
  "request_id": "cr_001"
}
```

---

### 5.3 `POST /api/person-requests/:id/accept`

Owner accepts a connection request.

**Response:**
```json
{
  "status": "connected",
  "room_id": "room_abc"
}
```

XP engine is called internally.

---

## 6. Rooms / Chat API

### 6.1 `POST /api/rooms/:room_id/join`

Join a web or Telegram room.

**Body (optional):**
```json
{
  "from_beacon_code": "HMROOM1"
}
```

**Response:**
```json
{
  "ok": true,
  "room_id": "room_abc"
}
```

Used by:
- room beacons (room)
- GPS chat beacons (geo_room)

---

## 7. Care / HNH API

### 7.1 `GET /api/care/hnh`

Return care resources.

**Response:**
```json
{
  "title": "Hand N Hand",
  "message": "Care dressed as kink, dripping in sweat. Community, not clinics.",
  "resources": [
    { "label": "Grounding audio", "url": "..." },
    { "label": "Breathing exercise", "url": "..." }
  ]
}
```

---

### 7.2 `POST /api/care/hnh/contact`

Optional anonymous follow-up / check-in form.

**Body:**
```json
{
  "mode": "anon",
  "message": "I feel rough after last night."
}
```

**Response:**
```json
{
  "ok": true
}
```

---

## 8. QR Worker API

(Edge service; separate from core backend.)

### 8.1 `GET /qr/:code.(png|svg)?style=&size=`

Generate QR for standard beacons.
- `:code` – Beacon.code
- `style` – raw | hotmess | chrome | stealth (default raw)
- `size` – pixels (default 512)

**Example:**
- `/qr/HM9X73.svg?style=hotmess&size=600`

---

### 8.2 `GET /qr/signed/:payloadB64.:sig.(png|svg)?style=&size=`

Generate QR for signed beacons.
- `:payloadB64.:sig` – same pair used in /x/.
- `style` – recommended stealth for discreet use.
- `size` – pixels.

**Example:**
- `/qr/signed/eyJjb2RlIjoi...etc...YyIsImV4cCI6MT...}.Qf3...svg?style=stealth&size=512`

---

This API spec plus BEACONS.md is the full contract for your Beacon + QR + scan flows.
