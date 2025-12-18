# HOTMESS OS - Database Migrations

**Canonical Architecture: 2025-12-17**  
**Compliance: Single-operator, consent-first, privacy-first, audit-everything**

## Overview

This directory contains the complete Supabase database schema for HOTMESS OS according to the frozen canonical architecture. These migrations implement the foundation for an 11-part implementation sequence.

## Migration Files

### 001_create_core_tables.sql
Creates all core tables with audit columns and state machines:

- **Profiles** - User profiles extending auth.users
- **Nightlife OS**: beacons, qr_tokens, beacon_scans, evidence_events, beacon_posts, ticket_listings
- **Safety OS**: moderation_reports, moderation_actions, audit_log, dsar_requests
- **Commerce OS**: products, drops, orders, order_items, market_sellers, market_listings
- **Identity OS**: xp_events (append-only ledger)
- **Music OS**: radio_shows, schedule_blocks, now_playing_overrides, records_releases

All tables include:
- UUID primary keys
- Audit columns (created_at, updated_at, created_by, updated_by where applicable)
- State machine enums with CHECK constraints
- Foreign key constraints
- Core indexes for performance
- Row Level Security enabled

### 002_create_rls_policies.sql
Implements strict Row Level Security policies:

- **Public Access**: Read-only, aggregate-safe access to live content
- **Authenticated Users**: Can create/manage own resources
- **Sellers**: Scoped to own marketplace listings
- **Moderators**: Access to moderation queue
- **Admin**: Full access to all data
- **Privacy**: beacon_scans, evidence_events, qr_tokens are admin-only

Helper functions:
- `is_admin()` - Check if user has admin role
- `is_moderator()` - Check if user has moderator or admin role

### 003_create_indexes.sql
Additional performance indexes:

- Composite indexes for common query patterns
- Partial indexes for active/visible content
- Optimizations for location-based queries
- Indexes for moderation and admin dashboards

### 004_create_views.sql
Safe public views (aggregate-only, no PII):

- `xp_balances` - Derived XP totals
- `night_pulse_city_stats` - City activity aggregates
- `beacon_stats` - Public beacon metrics
- `popular_beacons` - Trending content
- `products_available` - Shop inventory
- `seller_reputation` - Marketplace seller metrics
- `radio_schedule_this_week` - Current radio schedule
- `upcoming_releases` - Music catalog
- `xp_leaderboard` - Top 100 users (privacy-aware)
- `city_heat_map` - Geographic activity (no coordinates)
- Admin-only views for moderation queue

### 005_night_pulse_realtime.sql
Night Pulse real-time globe visualization infrastructure:

- **Support Columns**: Adds `active` boolean and `city` generated column to beacons table
- **Cities Table**: Reference table with coordinates and metadata for 24 major cities
- **Night Pulse Events**: Real-time delta stream table for live activity updates
- **Materialized View**: `night_pulse_realtime` - Aggregated city activity with privacy (<5 beacons hidden)
- **Triggers**: Auto-emit events on beacon status changes and scan creation
- **Refresh Function**: `refresh_night_pulse()` - Update materialized view and clean up old events
- **RLS Policies**: Public read access for cities and events, system-only insert

Features:
- Privacy-first aggregation (hide cities with <5 beacons)
- Real-time event stream via Supabase Realtime
- Heat intensity calculation (0-100 scale based on scans/hour)
- Auto-cleanup of events older than 24 hours
- Preflight diagnostics to verify schema requirements
- Idempotent (safe to run multiple times)

Usage:
```sql
-- Initial load
SELECT * FROM night_pulse_realtime ORDER BY heat_intensity DESC;

-- Manual refresh
SELECT refresh_night_pulse();

-- Subscribe to real-time events (client-side)
supabase.channel('night_pulse_updates')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'night_pulse_events' }, callback)
  .subscribe();
```

## Rollback Scripts

Each migration has a corresponding rollback script:

- `rollback_001_create_core_tables.sql` - Drops all tables
- `rollback_002_create_rls_policies.sql` - Drops all policies and helper functions
- `rollback_003_create_indexes.sql` - Drops additional indexes
- `rollback_004_create_views.sql` - Drops all views

## Running Migrations

### Using Supabase CLI

```bash
# Run all migrations
supabase db push

# Or run individually
supabase db execute -f supabase/migrations/001_create_core_tables.sql
supabase db execute -f supabase/migrations/002_create_rls_policies.sql
supabase db execute -f supabase/migrations/003_create_indexes.sql
supabase db execute -f supabase/migrations/004_create_views.sql
```

### Using Supabase Dashboard

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Execute

### Rollback

To rollback, run the rollback scripts in reverse order:

```bash
supabase db execute -f supabase/migrations/rollback_004_create_views.sql
supabase db execute -f supabase/migrations/rollback_003_create_indexes.sql
supabase db execute -f supabase/migrations/rollback_002_create_rls_policies.sql
supabase db execute -f supabase/migrations/rollback_001_create_core_tables.sql
```

## Generating TypeScript Types

After running migrations, generate TypeScript types:

```bash
# Generate types for your project
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts

# Or if using local Supabase
npx supabase gen types typescript --local > src/types/database.types.ts
```

## Schema Principles

### Privacy-First
- No raw user coordinates exposed publicly
- Scan events are admin-only
- IP addresses are hashed, not stored raw
- Public views use aggregates only

### Audit-Everything
- All admin actions logged to `audit_log`
- Before/after state captured
- Moderation actions require reason field
- State changes tracked with updated_at/updated_by

### State Machines
- Beacons: draft → pending_review → live → expired → archived → disabled
- Listings: draft → pending_review → live → sold → removed
- Products: draft → live → archived
- Orders: pending → processing → shipped → delivered
- Evidence required for listing approval

### Consent-First
- DSAR requests for GDPR compliance (export/delete)
- User-initiated reporting system
- Moderation transparency via audit log

## Testing RLS Policies

See `tests/rls_tests.sql` for comprehensive RLS test suite:

- Public user cannot read beacon_scans ✓
- Public user can read live beacons only ✓
- User can update own draft listings only ✓
- Admin can access all tables ✓
- Night Pulse aggregation returns no user IDs ✓
- Scan events never expose scanner identity publicly ✓

## Architecture Notes

- **XP Ledger**: Append-only, balances derived from view
- **Evidence Chain**: Links QR scans → proof posts → listing approval
- **Marketplace**: Seller verification required before listings go live
- **Moderation**: Reports feed into queue, actions logged to audit trail
- **Time Zones**: All timestamps in UTC, timezone stored per beacon

## Next Steps

After schema deployment:

1. ✅ Run all migrations
2. ✅ Generate TypeScript types
3. ✅ Test RLS policies
4. ⬜ Seed initial data (admin user, cities, etc.)
5. ⬜ Deploy Edge Functions
6. ⬜ Configure Storage buckets
7. ⬜ Set up Stripe webhooks
8. ⬜ Configure Telegram bot
9. ⬜ Deploy frontend application
10. ⬜ Run integration tests

## Support

For issues or questions:
- Review migration comments for table/column purpose
- Check RLS policies for access control logic
- Verify indexes match your query patterns
- Ensure views expose only aggregate data

**Ship this as PR #1 before any application code.**
