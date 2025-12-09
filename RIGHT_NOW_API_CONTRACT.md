# RIGHT NOW API CONTRACT

**Status**: Production-Ready  
**Version**: 1.0  
**Purpose**: Real-time ephemeral community feed for nightlife intent

---

## Core Concept

RIGHT NOW is the **Grindr killer rebuilt for nightlife**:
- Ephemeral (60 minutes default)
- Location-aware
- Intent-based
- Monetizable
- Auto-posted from drops, radio, Telegram, beacons

---

## Post Types

```typescript
type RightNowType = 
  | 'hookup'     // 🔥 Hookup Signal
  | 'drop'       // 📦 Product Drop
  | 'ticket'     // 🎟 Ticket Drop
  | 'radio'      // 📻 Radio Alert
  | 'crowd'      // 🏳️‍🌈 Crowd Surge
  | 'care';      // 🚨 Care Alert
```

---

## API Endpoints

### 1. Get Active Posts

```
GET /api/right-now/posts
```

**Query Parameters**:
- `city` (optional) - Filter by city
- `post_type` (optional) - Filter by type
- `lat` (optional) - User latitude for distance sorting
- `lng` (optional) - User longitude for distance sorting
- `limit` (optional, default: 50) - Max results
- `offset` (optional, default: 0) - Pagination offset

**Response**:
```json
{
  "posts": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "beacon_id": "uuid",
      "post_type": "hookup",
      "message": "At the Hoist. Looking now.",
      "image_url": "https://...",
      "lat": 51.5074,
      "lng": -0.1278,
      "city": "London",
      "expires_at": "2025-12-09T16:30:00Z",
      "created_at": "2025-12-09T15:30:00Z",
      "user": {
        "username": "wolfldn",
        "xp_tier": "Sinner"
      }
    }
  ],
  "total": 42,
  "has_more": true
}
```

**Business Logic**:
- Only returns posts where `expires_at > NOW()`
- Automatically applies visibility weighting based on:
  - User XP tier
  - Membership level
  - Sponsored boosts
  - City relevance
- Distance calculated if lat/lng provided

---

### 2. Create Post

```
POST /api/right-now/posts
```

**Request Body**:
```json
{
  "post_type": "hookup",
  "message": "At the Hoist. Looking now.",
  "image_url": "https://...",
  "beacon_id": "uuid",
  "ttl": 3600
}
```

**Response**:
```json
{
  "id": "uuid",
  "post_type": "hookup",
  "message": "At the Hoist. Looking now.",
  "expires_at": "2025-12-09T16:30:00Z",
  "created_at": "2025-12-09T15:30:00Z",
  "xp_awarded": 15
}
```

**Business Logic**:
- Automatic location capture from beacon or user GPS
- Automatic city detection
- TTL validation (min: 60s, max: 3600s)
- XP reward granted on creation
- Automatic Telegram mirroring if city room exists
- Abuse prevention:
  - Rate limit: 5 posts per hour per user
  - Cooldown: 5 minutes between posts
  - Content moderation queue

---

### 3. Delete Post (Self-Delete)

```
DELETE /api/right-now/posts/:id
```

**Response**:
```json
{
  "success": true,
  "message": "Post deleted"
}
```

**Business Logic**:
- Only user who created post can delete
- XP NOT refunded
- Telegram post NOT deleted (platform policy)

---

### 4. Report Post

```
POST /api/right-now/posts/:id/report
```

**Request Body**:
```json
{
  "reason": "spam" | "harassment" | "inappropriate" | "fake",
  "details": "Optional description"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Report submitted"
}
```

**Business Logic**:
- Creates moderation queue item
- Auto-hides post if 3+ reports
- Triggers admin alert if severity high
- XP penalty for reported user if confirmed

---

### 5. Boost Post (Paid Feature)

```
POST /api/right-now/posts/:id/boost
```

**Request Body**:
```json
{
  "duration": 3600,
  "payment_method": "xp" | "stripe"
}
```

**Response**:
```json
{
  "success": true,
  "boosted_until": "2025-12-09T17:30:00Z",
  "cost_xp": 100
}
```

**Business Logic**:
- XP cost: 100 XP per hour
- Stripe cost: £5 per hour
- Boosted posts appear higher in feed
- Max boost duration: 6 hours

---

## TTL (Time To Live) Logic

### Default TTL by Post Type

```typescript
const DEFAULT_TTL = {
  hookup: 3600,   // 1 hour
  drop: 1800,     // 30 minutes
  ticket: 7200,   // 2 hours
  radio: 10800,   // 3 hours
  crowd: 1800,    // 30 minutes
  care: 21600     // 6 hours
};
```

### Auto-Expiry Behavior

- Posts automatically hidden when `expires_at` passes
- Cleanup cron runs every 5 minutes:
  ```sql
  DELETE FROM right_now_posts WHERE expires_at < NOW() - INTERVAL '1 hour';
  ```
- No hard delete immediately to preserve analytics

---

## Abuse Prevention

### Rate Limiting

```typescript
const RATE_LIMITS = {
  posts_per_hour: 5,
  posts_per_day: 20,
  cooldown_seconds: 300,
  reports_per_hour: 10
};
```

### Content Moderation

**Auto-Flag Triggers**:
- External links detected
- Phone numbers detected
- Repeated identical messages
- User has active reports
- New account (<24h old)

**Manual Review Queue**:
- Admins review flagged posts
- Actions: approve, remove, ban user
- Response time SLA: 30 minutes

### Shadow Ban System

Users with multiple violations:
- Posts still created (appear to user)
- Not shown to others
- XP still awarded (but worthless)
- Used to catch bots/spammers

---

## Visibility Weighting Algorithm

```typescript
function calculateVisibilityScore(post) {
  let score = 1000; // Base score
  
  // XP tier bonus
  const tierBonus = {
    Fresh: 0,
    Regular: 100,
    Sinner: 300,
    Icon: 1000
  };
  score += tierBonus[post.user.xp_tier];
  
  // Membership bonus
  const membershipBonus = {
    free: 0,
    hnh: 200,
    vendor: 500,
    sponsor: 1000,
    icon: 2000
  };
  score += membershipBonus[post.user.membership];
  
  // Recency bonus (decay over time)
  const ageMinutes = (Date.now() - post.created_at) / 60000;
  score -= ageMinutes * 10;
  
  // Sponsored boost
  if (post.is_boosted) {
    score += 5000;
  }
  
  // Location relevance
  if (post.distance_km < 1) {
    score += 500;
  } else if (post.distance_km < 5) {
    score += 200;
  }
  
  return score;
}
```

Posts sorted by `visibility_score DESC` in feed.

---

## Telegram Mirroring

### Automatic Mirroring

When post created:
1. Check if city room exists
2. Format message for Telegram
3. Send via bot with link back to app
4. Store Telegram message ID

### Message Format

```
🔥 RIGHT NOW in London

"At the Hoist. Looking now."

👤 @wolfldn (Sinner)
📍 0.5km away
⏰ Expires in 58 minutes

👉 View in app: https://hotmess.app/r/:id
```

---

## Sponsored Posts

Brands can sponsor RIGHT NOW posts:

**Pricing**:
- £50 per post
- £200 per day (unlimited posts)
- £500 per week

**Requirements**:
- Must be relevant to nightlife
- Must include "Sponsored" label
- Subject to approval

---

## Analytics Events

Track these events:

```typescript
type RightNowEvent = 
  | 'post_created'
  | 'post_viewed'
  | 'post_clicked'
  | 'post_shared'
  | 'post_reported'
  | 'post_expired'
  | 'post_boosted';
```

Store in analytics table for:
- User behavior insights
- Popular times/locations
- Conversion tracking
- Revenue attribution

---

## Edge Cases

### Handling Expired Posts Mid-View

If user viewing post when it expires:
- Show expiry notice
- Disable interactions
- Suggest similar active posts

### Location Privacy

Users can:
- Post without exact location (city only)
- Use "nearby" instead of distance
- Hide location completely (costs 50 XP)

### Post Ownership Transfer

Posts cannot be transferred. If user deletes account:
- Posts remain visible until expiry
- Username shows as "deleted_user"
- No profile link available

---

## Error Codes

```typescript
const ERROR_CODES = {
  RATE_LIMIT_EXCEEDED: 429,
  INVALID_TTL: 400,
  INSUFFICIENT_XP: 402,
  POST_NOT_FOUND: 404,
  POST_EXPIRED: 410,
  UNAUTHORIZED: 401,
  SHADOW_BANNED: 403
};
```

---

## Security

- All endpoints require authentication
- CSRF protection on POST/DELETE
- Input sanitization for message content
- SQL injection prevention via parameterized queries
- XSS prevention via content escaping

---

## Performance

- Cache active posts for 30 seconds
- Use Redis for rate limiting
- Index on `expires_at`, `city`, `post_type`
- Auto-archive posts older than 7 days

---

## Future Enhancements

- [ ] Direct message from post
- [ ] Post reactions (fire, eyes, etc)
- [ ] Post collections/saved posts
- [ ] Video posts
- [ ] Voice posts
- [ ] Live location updates
- [ ] Post threads/replies

---

**This API contract is production-ready and supports the full RIGHT NOW feature as specified in the HOTMESS OS master spec.**
