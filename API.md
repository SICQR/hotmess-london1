# HOTMESS LONDON - API Documentation

This document provides an overview of the HOTMESS LONDON API structure and key endpoints.

## 🌐 Base URL

All API routes are prefixed with:
```
https://rfoftonnlwudilafhfkl.supabase.co/functions/v1/make-server-a670c824
```

## 🔐 Authentication

Most endpoints require authentication via Bearer token:

```http
Authorization: Bearer {SUPABASE_ANON_KEY}
```

Protected endpoints require user session token:
```http
Authorization: Bearer {USER_ACCESS_TOKEN}
```

## 📋 API Modules

### 🎯 Beacons

**Base Path**: `/beacons`

#### Get All Beacons
```http
GET /beacons
```

#### Get Beacon by ID
```http
GET /beacons/:id
```

#### Create Beacon (Protected)
```http
POST /beacons/create
Content-Type: application/json

{
  "type": "venue|event|hookup|drop|popup|private",
  "name": "string",
  "location": {
    "lat": number,
    "lng": number
  },
  "description": "string",
  "metadata": object
}
```

#### Resolve Beacon (QR Scan)
```http
POST /beacon/resolve
Content-Type: application/json

{
  "payload": "string (signed JWT)"
}
```

---

### 🎫 Tickets

**Base Path**: `/tickets`

#### Get Event Tickets
```http
GET /tickets/event/:beaconId
```

#### Create Listing (Protected)
```http
POST /tickets/listing/create
Content-Type: application/json

{
  "beaconId": "string",
  "quantity": number,
  "price": number,
  "description": "string"
}
```

#### Get My Listings (Protected)
```http
GET /tickets/me/listings
```

#### Purchase Ticket
```http
POST /tickets/purchase
Content-Type: application/json

{
  "listingId": "string",
  "stripePaymentMethodId": "string"
}
```

---

### 💬 Messaging

**Base Path**: `/connect`

#### Get Threads (Protected)
```http
GET /connect/threads
```

#### Get Thread Messages (Protected)
```http
GET /connect/thread/:threadId/messages
```

#### Send Message (Protected)
```http
POST /connect/thread/:threadId/send
Content-Type: application/json

{
  "message": "string",
  "attachments": ["url1", "url2"]
}
```

---

### 🛒 MessMarket

**Base Path**: `/messmarket`

#### Get All Listings
```http
GET /messmarket/listings
```

#### Get Listing by ID
```http
GET /messmarket/listing/:id
```

#### Create Listing (Seller)
```http
POST /messmarket/listing/create
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "price": number,
  "images": ["url1", "url2"],
  "category": "string"
}
```

---

### 🎵 Records

**Base Path**: `/records`

#### Get All Releases
```http
GET /records/releases
```

#### Get Release by Slug
```http
GET /records/release/:slug
```

#### Get Next Up Releases
```http
GET /records/next-up
```

#### Stream Track (Protected)
```http
GET /records/stream/:trackVersionId
```

#### Download Track (Protected)
```http
GET /records/download/:assetId
```

#### Log Play (Protected)
```http
POST /records/play
Content-Type: application/json

{
  "trackVersionId": "string"
}
```

---

### 📻 Radio

**Base Path**: `/radio`

#### Get Live Status
```http
GET /radio/status
```

#### Get Live Listeners
```http
GET /radio/listeners
```

#### Connect Last.fm (Protected)
```http
GET /radio/lastfm/connect
```

#### Last.fm Callback
```http
GET /radio/lastfm/callback?token={token}
```

#### Scrobble Track (Protected)
```http
POST /radio/scrobble
Content-Type: application/json

{
  "artist": "string",
  "track": "string",
  "timestamp": number
}
```

---

### 🔐 Authentication

**Base Path**: `/auth`

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

#### Sign In
Uses Supabase Auth directly (client-side)

#### Password Reset Request
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "string"
}
```

---

### 👤 User

**Base Path**: `/user`

#### Get Profile (Protected)
```http
GET /user/profile
```

#### Update Profile (Protected)
```http
PUT /user/profile
Content-Type: application/json

{
  "name": "string",
  "bio": "string",
  "avatar": "string"
}
```

#### Get XP Stats (Protected)
```http
GET /user/xp
```

---

### 💳 Stripe

**Base Path**: `/stripe`

#### Create Checkout Session
```http
POST /stripe/checkout
Content-Type: application/json

{
  "items": [
    {
      "id": "string",
      "quantity": number
    }
  ]
}
```

#### Stripe Connect Onboarding (Seller)
```http
POST /stripe/connect/onboard
```

#### Stripe Connect Dashboard (Seller)
```http
GET /stripe/connect/dashboard
```

---

### 🛡️ Trust & Safety

**Base Path**: `/trust`

#### Block User (Protected)
```http
POST /trust/block
Content-Type: application/json

{
  "userId": "string"
}
```

#### Mute User (Protected)
```http
POST /trust/mute
Content-Type: application/json

{
  "userId": "string"
}
```

#### Report Content (Protected)
```http
POST /trust/report
Content-Type: application/json

{
  "targetType": "user|listing|message|beacon",
  "targetId": "string",
  "reason": "string",
  "description": "string"
}
```

---

### 👨‍💼 Admin

**Base Path**: `/admin` (Requires admin role)

#### Get All Users
```http
GET /admin/users
```

#### Get Moderation Queue
```http
GET /admin/moderation/queue
```

#### Take Moderation Action
```http
POST /admin/moderation/action
Content-Type: application/json

{
  "reportId": "string",
  "action": "approve|remove|ban",
  "notes": "string"
}
```

#### Get All Beacons
```http
GET /admin/beacons
```

---

### 🛍️ Shop (Shopify)

**Base Path**: `/shop`

#### Get Products
```http
GET /shop/products
```

#### Get Product by ID
```http
GET /shop/product/:id
```

---

### 🎨 QR Code Generation

**Base Path**: `/qr`

#### Generate Beacon QR
```http
POST /qr/generate
Content-Type: application/json

{
  "beaconId": "string",
  "style": "raw|hotmess|chrome|stealth",
  "format": "svg|png"
}
```

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔢 HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🚦 Rate Limiting

Currently no rate limiting implemented. Consider adding for production.

## 📝 Notes

- All timestamps are in ISO 8601 format
- All monetary amounts are in cents (GBP)
- Pagination follows `?page=1&limit=20` pattern
- File uploads use presigned URLs (request upload URL first)

## 🔗 WebSocket Endpoints

Real-time features use Supabase Realtime:
- Subscribe to beacon updates
- Subscribe to message threads
- Subscribe to listener counts

Example (client-side):
```javascript
const channel = supabase
  .channel('beacons')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'beacons' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

---

## 🆘 Support

For API issues or questions:
- Check server logs: `supabase functions logs server`
- Review error response for details
- Verify authentication tokens are valid
- Ensure request format matches documentation

**Built with care for the queer nightlife community** 🖤💗
