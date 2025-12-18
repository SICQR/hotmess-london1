# Database Schema Documentation

**HOTMESS OS - Canonical Architecture 2025-12-17**

## Overview

This document describes the complete database schema for HOTMESS OS, implementing a privacy-first, consent-first, audit-everything architecture for a men-only, 18+, nightlife-first operating system.

## Architecture Principles

### 1. Privacy-First
- No raw user coordinates exposed publicly
- Scan events are admin-only
- IP addresses are hashed before storage
- Public views use aggregates only, never PII
- Geo-hashing for internal use only

### 2. Consent-First
- GDPR compliance via DSAR requests
- User-initiated reporting system
- Explicit consent tracking
- Right to be forgotten support

### 3. Audit-Everything
- All admin actions logged to `audit_log`
- Before/after state captured for changes
- Moderation actions require reason field
- State changes tracked with updated_at/updated_by

### 4. State Machines
All major entities use explicit state machines with CHECK constraints:
- Prevents invalid state transitions
- Makes workflow explicit
- Enables automated cleanup
- Supports lifecycle management

## Domain Models

### Nightlife OS

#### Beacons (Core Primitive)
The fundamental unit of HOTMESS OS - represents events, tickets, venues, experiences, or community gatherings.

**State Machine:**
```
draft → pending_review → live → expired
                       ↓
                    archived
                       ↓
                   disabled
```

**Key Fields:**
- `geo_hash`: Internal only, never exposed publicly
- `scan_count`, `view_count`: Aggregate metrics only
- `content_flags`: JSONB for flexible moderation markers
- `ruleset_id`: Links to content moderation ruleset

**Privacy:**
- Location stored as city_id + optional geo_hash
- No raw coordinates in public API
- Timezone stored for correct time display

#### QR Tokens (Ephemeral Credentials)
Short-lived tokens for beacon access control.

**Security:**
- Only `token_hash` stored (SHA-256)
- Never store raw tokens
- Automatic expiry
- Usage tracking (max_uses, current_uses)

**Scopes:**
- `check_in`: Basic beacon access
- `listing_proof`: Proof of attendance for ticket sales
- `experience`: Special access credentials
- `staff`: Venue staff tokens

#### Beacon Scans (Privacy-First Events)
Records of QR scans with strict privacy controls.

**Privacy Controls:**
- Admin-only access via RLS
- IP addresses hashed
- Optional user link (only if authenticated)
- City-level aggregation only

**Status Tracking:**
- `valid`: Successful scan
- `invalid`: Token issues
- `duplicate`: Already scanned
- `revoked`: Token revoked
- `expired`: Token expired

#### Evidence Events (Chain Glue)
Links proof elements in the evidence chain for ticket listing verification.

**Types:**
- `qr_scan`: Physical attendance proof
- `proof_post`: User-submitted proof
- `admin_verification`: Manual admin approval
- `seller_verification`: Seller validation

**Visibility:**
- `admin_only`: Internal evidence
- `thread_visible`: Shown in beacon thread

#### Beacon Posts (Proof-in-Thread)
Comments, proof submissions, and system messages within beacons.

**Types:**
- `comment`: User discussion
- `proof`: Attendance proof
- `system`: Automated messages

**Moderation:**
- Status field controls visibility
- `moderation_flags` JSONB for flexible flagging
- Admin/moderator override capability

#### Ticket Listings (P2P Marketplace)
Secondary ticket market within beacons.

**State Machine:**
```
draft → pending_review → live → sold
                       ↓
                    removed
```

**Evidence Requirements:**
- `none`: No proof required
- `proof_post`: Must submit proof post
- `qr_scan`: Must have QR scan record
- `both`: Both proof post and QR scan

**Safety:**
- `report_count`: Automated flagging threshold
- `review_notes`: Admin-only moderation notes
- Proof linkage via `proof_post_id`

### Safety OS

#### Moderation Reports
User-submitted reports for content/behavior issues.

**Categories:**
- `scam`: Fraudulent activity
- `harassment`: Abusive behavior
- `coercion`: Pressure/manipulation
- `hate`: Hate speech
- `doxxing`: Privacy violation
- `unsafe`: Physical safety concern
- `other`: Other issues

**Workflow:**
```
open → investigating → resolved
                    ↓
                 dismissed
```

#### Moderation Actions
Admin actions taken on reported content.

**Actions:**
- `remove_post`: Delete post
- `disable_beacon`: Disable beacon
- `remove_listing`: Remove ticket listing
- `suspend_seller`: Suspend marketplace seller
- `ban_user`: Ban user account
- `reinstate`: Restore previously actioned item
- `warn`: Issue warning

**Audit:**
- All actions require `reason` field
- Logged to `audit_log` table
- Cannot be deleted

#### Audit Log
Comprehensive trail of all administrative actions.

**Captures:**
- Who performed action (`actor_id`)
- What action was performed
- What object was affected
- Before/after state (JSONB)
- Reason for action
- Request correlation ID

**Retention:**
- Never delete
- Immutable after creation
- Admin-only access

#### DSAR Requests
GDPR data subject access requests.

**Types:**
- `export`: Data portability request
- `delete`: Right to be forgotten

**Workflow:**
```
received → verifying → processing → completed
                                 ↓
                              rejected
```

### Commerce OS

#### Products (Official Shop)
Official HOTMESS merchandise and products.

**Collections:**
- `hnhmess`: Hand-N-Hand brand
- `raw`: Raw line
- `hung`: Hung collection
- `high`: High series
- `super`: Super tier
- `superhung`: Premium tier

**Stock Management:**
- `stock_status`: in_stock, low_stock, out_of_stock
- `quantity_available`: Numeric inventory
- `limited_edition`: Special releases
- `drop_id`: Link to time-boxed drops

**Gamification:**
- `xp_reward`: XP awarded on purchase

#### Drops
Time-boxed product releases.

**State Machine:**
```
scheduled → live → ended
```

**Timing:**
- `start_at`: Drop opens
- `end_at`: Drop closes
- Auto-transition based on timestamps

#### Orders
Customer orders for official and marketplace items.

**Types:**
- `official`: Official shop orders
- `marketplace`: P2P marketplace orders

**Status Tracking:**
- **Fulfilment:** pending → processing → shipped → delivered (or cancelled)
- **Payment:** pending → paid (or failed/refunded)

**Data:**
- `shipping_address`: JSONB for flexible address formats
- Subtotal, shipping, tax, total in pence
- Currency field (default GBP)

#### Order Items
Line items for orders.

**Flexibility:**
- Can link to `products` OR `ticket_listings`
- Stores denormalized `title`, `quantity`, prices
- Preserves data if source deleted

#### Market Sellers
Marketplace vendor accounts.

**Verification:**
```
pending → approved → suspended
```

**Stripe Integration:**
- `stripe_account_id`: Stripe Connect account
- `stripe_onboarding_complete`: KYC status
- `white_label_enabled`: Custom branding

#### Market Listings
Marketplace product listings from sellers.

**State Machine:**
```
draft → pending_review → live → sold_out
                       ↓
                    removed
```

**Media:**
- `images`: JSONB array of storage URLs

### Identity OS

#### XP Events (Ledger)
Append-only ledger of XP-earning events.

**Event Types:**
- `beacon_scan`: Scanned a beacon
- `purchase`: Made a purchase
- `listing_approved`: Listing went live
- `radio_listen`: Listened to radio
- `daily_login`: Daily login streak
- `streak_bonus`: Streak milestone
- `admin_adjustment`: Manual correction

**Ledger Rules:**
- Never UPDATE or DELETE
- Only INSERT
- Balances derived via `xp_balances` view
- Metadata JSONB for event details

#### XP Balances (View)
Materialized aggregate of XP events.

**Fields:**
- `balance`: Total XP
- `total_events`: Event count
- `last_activity`: Most recent XP earn

### Music OS

#### Radio Shows
Radio show programs.

**Status:**
- `draft`: Not published
- `live`: Currently airing
- `archived`: Past show

#### Schedule Blocks
Weekly recurring schedule.

**Fields:**
- `day_of_week`: 0-6 (Sunday-Saturday)
- `start_time`: Time of day
- `end_time`: End time

**Status:**
- `live`: Active schedule
- `overridden`: Temporarily replaced

#### Now Playing Overrides
Manual "now playing" updates.

**Expiry:**
- Default 30 minutes
- Auto-cleanup via index on `expires_at`

#### Records Releases
Music catalog.

**State Machine:**
```
draft → scheduled → live → archived
```

**Integration:**
- `soundcloud_url`: Streaming link
- `artwork_url`: Cover art
- `label`: Record label (default: RAW CONVICT RECORDS)

## Privacy-Safe Public Views

### night_pulse_city_stats
Hourly city activity aggregates - no user identification.

### beacon_stats
Public beacon metrics - listing counts, post counts.

### popular_beacons
Trending beacons by recent scan activity.

### products_available
In-stock products with drop information.

### seller_reputation
Seller metrics without sensitive data.

### xp_leaderboard
Top 100 users by XP - only users with public usernames.

### city_heat_map
City-level beacon activity - no coordinates.

## RLS Policy Strategy

### Public (Anon + Authenticated)
- Read live beacons, products, releases
- Read visible posts on live beacons
- Read approved sellers
- Read public aggregate views

### Authenticated Users
- Create own resources (beacons, listings, posts)
- Update own draft content
- View own orders, XP events
- Create moderation reports

### Sellers
- Manage own marketplace listings
- View own seller account
- Update seller profile

### Moderators
- View all moderation reports
- Update report status
- Access moderation queue views

### Admin
- Full access to all tables
- View audit log
- Manage all content
- Access privacy-sensitive data (scans, evidence, tokens)

## Indexes Strategy

### Core Indexes (in tables)
- Primary keys (UUID)
- Foreign keys
- Status fields
- Date fields (created_at, expires_at)

### Composite Indexes
- (status, city_id) for location queries
- (user_id, created_at) for user history
- (beacon_id, status) for beacon content

### Partial Indexes
- WHERE status = 'live' for active content
- WHERE expires_at > now() for cleanup queries

## Data Types

### Monetary Values
- Stored as INTEGER in pence (or smallest unit)
- Currency field (TEXT, default 'GBP')
- Avoids floating point precision issues

### Timestamps
- All TIMESTAMPTZ (UTC)
- Timezone field on beacons for display
- Never store local time

### JSON Fields
- Use JSONB for performance
- Default to empty object/array
- Validate in application layer

### Enums
- Implemented as TEXT with CHECK constraints
- Allows for schema evolution
- Clear in SQL and logs

## Migration Strategy

1. **001_create_core_tables.sql**: All tables, RLS enabled
2. **002_create_rls_policies.sql**: All policies, helper functions
3. **003_create_indexes.sql**: Additional performance indexes
4. **004_create_views.sql**: Public aggregate views

Rollback scripts provided for each migration.

## Testing Checklist

- [ ] RLS: Public cannot read beacon_scans
- [ ] RLS: Public can read live beacons only
- [ ] RLS: Users can update own draft listings
- [ ] RLS: Admin can access all tables
- [ ] Privacy: Views expose no PII
- [ ] Privacy: Scan events never expose scanner publicly
- [ ] State: Invalid transitions rejected
- [ ] Audit: Admin actions logged
- [ ] GDPR: DSAR requests processed
- [ ] Performance: Indexes cover common queries

## Next Steps

1. Deploy migrations to Supabase
2. Generate TypeScript types
3. Seed initial data (cities, admin user)
4. Test RLS policies
5. Deploy Edge Functions
6. Configure Storage buckets
7. Integrate Stripe webhooks
8. Set up Telegram bot

---

**Version:** 1.0.0 (Canonical 2025-12-17)  
**Status:** Ready for Production
