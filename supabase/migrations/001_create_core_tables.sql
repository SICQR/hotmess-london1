-- ============================================================================
-- HOTMESS OS - Core Database Schema (Canonical Architecture 2025-12-17)
-- ============================================================================
-- Migration 001: Create all core tables with audit columns and state machines
-- Compliance: Single-operator, consent-first, privacy-first, audit-everything
-- ============================================================================

-- Enable required extensions
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- PROFILES (extends auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  
  city_id TEXT,
  
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'seller', 'user')),
  
  telegram_id TEXT,
  telegram_username TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city_id);

COMMENT ON TABLE profiles IS 'User profiles extending auth.users with HOTMESS-specific fields';

-- ============================================================================
-- NIGHTLIFE OS: Beacons (core primitive)
-- ============================================================================

CREATE TABLE IF NOT EXISTS beacons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('event', 'ticket', 'venue', 'experience', 'community')),
  
  -- Location (privacy-first)
  city_id TEXT NOT NULL,
  region_id TEXT,
  venue_id UUID,
  geo_hash TEXT, -- Internal only, never exposed publicly
  timezone TEXT NOT NULL DEFAULT 'Europe/London',
  
  -- Temporal
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  
  -- Ownership & Control
  host_type TEXT NOT NULL CHECK (host_type IN ('admin', 'venue', 'approved_host')),
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- State Machine
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'live', 'expired', 'archived', 'disabled')),
  
  -- Moderation & Safety
  ruleset_id UUID,
  content_flags JSONB DEFAULT '[]'::jsonb,
  report_count INTEGER DEFAULT 0,
  last_moderation_at TIMESTAMPTZ,
  
  -- Analytics (aggregates only)
  scan_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_beacons_status ON beacons(status);
CREATE INDEX IF NOT EXISTS idx_beacons_city ON beacons(city_id);
CREATE INDEX IF NOT EXISTS idx_beacons_end_at ON beacons(end_at);
CREATE INDEX IF NOT EXISTS idx_beacons_type ON beacons(type);
CREATE INDEX IF NOT EXISTS idx_beacons_creator ON beacons(creator_id);

COMMENT ON TABLE beacons IS 'Core beacon primitive for events, tickets, venues, experiences';
COMMENT ON COLUMN beacons.geo_hash IS 'Internal only - never exposed publicly';

-- ============================================================================
-- NIGHTLIFE OS: QR Tokens (ephemeral credentials)
-- ============================================================================

CREATE TABLE IF NOT EXISTS qr_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beacon_id UUID NOT NULL REFERENCES beacons(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL, -- SHA-256 hash, never store raw token
  scope TEXT NOT NULL CHECK (scope IN ('check_in', 'listing_proof', 'experience', 'staff')),
  
  issued_by UUID NOT NULL REFERENCES auth.users(id),
  issued_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qr_tokens_beacon ON qr_tokens(beacon_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_hash ON qr_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_status ON qr_tokens(status);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_expires ON qr_tokens(expires_at);

COMMENT ON TABLE qr_tokens IS 'Ephemeral QR credentials - token_hash only, never raw tokens';

-- ============================================================================
-- NIGHTLIFE OS: Beacon Scans (privacy-first scan events)
-- ============================================================================

CREATE TABLE IF NOT EXISTS beacon_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beacon_id UUID NOT NULL REFERENCES beacons(id),
  token_hash TEXT NOT NULL,
  
  scanned_at TIMESTAMPTZ DEFAULT now(),
  
  -- Optional user link (only if logged in)
  scanner_profile_id UUID REFERENCES auth.users(id),
  
  -- Aggregate-friendly fields only
  city_id TEXT NOT NULL,
  
  -- Metadata (no PII)
  client_meta JSONB DEFAULT '{}'::jsonb, -- device type, app version
  ip_hash TEXT, -- Hashed IP, not raw
  
  status TEXT NOT NULL CHECK (status IN ('valid', 'invalid', 'duplicate', 'revoked', 'expired')),
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_beacon_scans_beacon ON beacon_scans(beacon_id);
CREATE INDEX IF NOT EXISTS idx_beacon_scans_city ON beacon_scans(city_id);
CREATE INDEX IF NOT EXISTS idx_beacon_scans_created ON beacon_scans(created_at);
CREATE INDEX IF NOT EXISTS idx_beacon_scans_scanner ON beacon_scans(scanner_profile_id);

COMMENT ON TABLE beacon_scans IS 'Privacy-first scan events - admin-only access, no public PII exposure';

-- ============================================================================
-- NIGHTLIFE OS: Evidence Events (the chain glue)
-- ============================================================================

CREATE TABLE IF NOT EXISTS evidence_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beacon_id UUID NOT NULL REFERENCES beacons(id),
  type TEXT NOT NULL CHECK (type IN ('qr_scan', 'proof_post', 'admin_verification', 'seller_verification')),
  
  actor_profile_id UUID REFERENCES auth.users(id),
  source_id UUID, -- scan_id or post_id
  
  visibility TEXT NOT NULL DEFAULT 'admin_only' CHECK (visibility IN ('admin_only', 'thread_visible')),
  
  payload JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_events_beacon ON evidence_events(beacon_id);
CREATE INDEX IF NOT EXISTS idx_evidence_events_type ON evidence_events(type);
CREATE INDEX IF NOT EXISTS idx_evidence_events_actor ON evidence_events(actor_profile_id);

COMMENT ON TABLE evidence_events IS 'Evidence chain for proof-in-thread workflow';

-- ============================================================================
-- NIGHTLIFE OS: Beacon Posts (proof-in-thread)
-- ============================================================================

CREATE TABLE IF NOT EXISTS beacon_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beacon_id UUID NOT NULL REFERENCES beacons(id),
  author_profile_id UUID NOT NULL REFERENCES auth.users(id),
  
  type TEXT NOT NULL CHECK (type IN ('comment', 'proof', 'system')),
  body TEXT NOT NULL,
  
  attachments JSONB DEFAULT '[]'::jsonb, -- Storage references
  
  status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden', 'removed', 'locked')),
  
  moderation_flags JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_beacon_posts_beacon ON beacon_posts(beacon_id);
CREATE INDEX IF NOT EXISTS idx_beacon_posts_author ON beacon_posts(author_profile_id);
CREATE INDEX IF NOT EXISTS idx_beacon_posts_status ON beacon_posts(status);

COMMENT ON TABLE beacon_posts IS 'Posts/comments/proof within beacon threads';

-- ============================================================================
-- NIGHTLIFE OS: Ticket Listings (inside beacons)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ticket_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beacon_id UUID NOT NULL REFERENCES beacons(id),
  seller_profile_id UUID NOT NULL REFERENCES auth.users(id),
  
  price INTEGER NOT NULL, -- pence
  quantity INTEGER NOT NULL DEFAULT 1,
  currency TEXT DEFAULT 'GBP',
  terms TEXT,
  
  proof_required BOOLEAN DEFAULT false,
  proof_post_id UUID REFERENCES beacon_posts(id),
  
  evidence_required TEXT DEFAULT 'none' CHECK (evidence_required IN ('none', 'proof_post', 'qr_scan', 'both')),
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'live', 'sold', 'removed')),
  
  review_notes TEXT, -- Admin-only
  report_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_ticket_listings_status ON ticket_listings(status);
CREATE INDEX IF NOT EXISTS idx_ticket_listings_beacon ON ticket_listings(beacon_id);
CREATE INDEX IF NOT EXISTS idx_ticket_listings_seller ON ticket_listings(seller_profile_id);

COMMENT ON TABLE ticket_listings IS 'P2P ticket listings within beacons';

-- ============================================================================
-- SAFETY OS: Moderation Reports
-- ============================================================================

CREATE TABLE IF NOT EXISTS moderation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_profile_id UUID REFERENCES auth.users(id),
  
  target_type TEXT NOT NULL CHECK (target_type IN ('beacon', 'listing', 'post', 'seller', 'user')),
  target_id UUID NOT NULL,
  
  category TEXT NOT NULL CHECK (category IN ('scam', 'harassment', 'coercion', 'hate', 'doxxing', 'unsafe', 'other')),
  details TEXT NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  
  assigned_to UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_moderation_reports_status ON moderation_reports(status);
CREATE INDEX IF NOT EXISTS idx_moderation_reports_target ON moderation_reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_moderation_reports_reporter ON moderation_reports(reporter_profile_id);

COMMENT ON TABLE moderation_reports IS 'User-submitted moderation reports for safety';

-- ============================================================================
-- SAFETY OS: Moderation Actions
-- ============================================================================

CREATE TABLE IF NOT EXISTS moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_admin_id UUID NOT NULL REFERENCES auth.users(id),
  
  action TEXT NOT NULL CHECK (action IN ('remove_post', 'disable_beacon', 'remove_listing', 'suspend_seller', 'ban_user', 'reinstate', 'warn')),
  
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  
  reason TEXT NOT NULL, -- Required for audit
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_moderation_actions_admin ON moderation_actions(actor_admin_id);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_target ON moderation_actions(target_type, target_id);

COMMENT ON TABLE moderation_actions IS 'Admin moderation actions - all changes logged';

-- ============================================================================
-- SAFETY OS: Audit Log (mandatory for all admin actions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  
  action TEXT NOT NULL,
  object_type TEXT NOT NULL,
  object_id UUID,
  
  before_state JSONB,
  after_state JSONB,
  
  reason TEXT,
  request_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_object ON audit_log(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);

COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for all admin actions';

-- ============================================================================
-- SAFETY OS: DSAR Requests (GDPR compliance)
-- ============================================================================

CREATE TABLE IF NOT EXISTS dsar_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  
  type TEXT NOT NULL CHECK (type IN ('export', 'delete')),
  
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'verifying', 'processing', 'completed', 'rejected')),
  
  admin_notes TEXT,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dsar_requests_status ON dsar_requests(status);
CREATE INDEX IF NOT EXISTS idx_dsar_requests_user ON dsar_requests(user_id);

COMMENT ON TABLE dsar_requests IS 'GDPR data subject access requests';

-- ============================================================================
-- COMMERCE OS: Products (official shop)
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  
  collection TEXT CHECK (collection IN ('hnhmess', 'raw', 'hung', 'high', 'super', 'superhung')),
  
  price INTEGER NOT NULL, -- pence
  currency TEXT DEFAULT 'GBP',
  
  stock_status TEXT NOT NULL CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
  quantity_available INTEGER DEFAULT 0,
  
  xp_reward INTEGER DEFAULT 10,
  
  images JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  
  limited_edition BOOLEAN DEFAULT false,
  drop_id UUID,
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'archived')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);

COMMENT ON TABLE products IS 'Official HOTMESS shop products';

-- ============================================================================
-- COMMERCE OS: Drops (time-boxed releases)
-- ============================================================================

CREATE TABLE IF NOT EXISTS drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK constraint for products.drop_id after drops table exists
ALTER TABLE products ADD CONSTRAINT fk_products_drop FOREIGN KEY (drop_id) REFERENCES drops(id);

CREATE INDEX IF NOT EXISTS idx_drops_status ON drops(status);
CREATE INDEX IF NOT EXISTS idx_drops_dates ON drops(start_at, end_at);

COMMENT ON TABLE drops IS 'Time-boxed product releases';

-- ============================================================================
-- COMMERCE OS: Orders
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  
  order_type TEXT NOT NULL CHECK (order_type IN ('official', 'marketplace')),
  
  subtotal INTEGER NOT NULL,
  shipping INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  currency TEXT DEFAULT 'GBP',
  
  fulfilment_status TEXT DEFAULT 'pending' CHECK (fulfilment_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  shipping_address JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(fulfilment_status, payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

COMMENT ON TABLE orders IS 'Customer orders for official and marketplace products';

-- ============================================================================
-- COMMERCE OS: Order Items
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  product_id UUID REFERENCES products(id),
  listing_id UUID REFERENCES ticket_listings(id),
  
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

COMMENT ON TABLE order_items IS 'Line items for orders';

-- ============================================================================
-- COMMERCE OS: Market Sellers (marketplace)
-- ============================================================================

CREATE TABLE IF NOT EXISTS market_sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  
  display_name TEXT NOT NULL,
  bio TEXT,
  
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'suspended')),
  
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT false,
  
  white_label_enabled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_market_sellers_owner ON market_sellers(owner_id);
CREATE INDEX IF NOT EXISTS idx_market_sellers_status ON market_sellers(verification_status);

COMMENT ON TABLE market_sellers IS 'Marketplace seller accounts';

-- ============================================================================
-- COMMERCE OS: Market Listings
-- ============================================================================

CREATE TABLE IF NOT EXISTS market_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES market_sellers(id),
  
  title TEXT NOT NULL,
  description TEXT,
  
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'GBP',
  
  quantity_available INTEGER DEFAULT 1,
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'live', 'removed', 'sold_out')),
  
  images JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_market_listings_seller ON market_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_market_listings_status ON market_listings(status);

COMMENT ON TABLE market_listings IS 'Marketplace product listings';

-- ============================================================================
-- IDENTITY OS: XP Events (append-only ledger)
-- ============================================================================

CREATE TABLE IF NOT EXISTS xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id),
  
  event_type TEXT NOT NULL CHECK (event_type IN (
    'beacon_scan', 'purchase', 'listing_approved', 'radio_listen', 
    'daily_login', 'streak_bonus', 'admin_adjustment'
  )),
  
  points INTEGER NOT NULL,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xp_events_actor ON xp_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_created ON xp_events(created_at);
CREATE INDEX IF NOT EXISTS idx_xp_events_type ON xp_events(event_type);

COMMENT ON TABLE xp_events IS 'Append-only XP ledger - never update, only insert';

-- ============================================================================
-- MUSIC OS: Radio Shows
-- ============================================================================

CREATE TABLE IF NOT EXISTS radio_shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  host TEXT,
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'archived')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_radio_shows_status ON radio_shows(status);

COMMENT ON TABLE radio_shows IS 'Radio show programs';

-- ============================================================================
-- MUSIC OS: Schedule Blocks
-- ============================================================================

CREATE TABLE IF NOT EXISTS schedule_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID REFERENCES radio_shows(id),
  
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('draft', 'live', 'overridden')),
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schedule_blocks_show ON schedule_blocks(show_id);
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_day ON schedule_blocks(day_of_week);

COMMENT ON TABLE schedule_blocks IS 'Weekly schedule for radio shows';

-- ============================================================================
-- MUSIC OS: Now Playing Overrides
-- ============================================================================

CREATE TABLE IF NOT EXISTS now_playing_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  track TEXT NOT NULL,
  artist TEXT NOT NULL,
  artwork_url TEXT,
  
  set_by UUID NOT NULL REFERENCES auth.users(id),
  set_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 minutes')
);

CREATE INDEX IF NOT EXISTS idx_now_playing_expires ON now_playing_overrides(expires_at);

COMMENT ON TABLE now_playing_overrides IS 'Manual now playing overrides for radio';

-- ============================================================================
-- MUSIC OS: Records Releases
-- ============================================================================

CREATE TABLE IF NOT EXISTS records_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  label TEXT DEFAULT 'RAW CONVICT RECORDS',
  
  release_date DATE,
  
  artwork_url TEXT,
  soundcloud_url TEXT,
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'live', 'archived')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_records_releases_status ON records_releases(status);
CREATE INDEX IF NOT EXISTS idx_records_releases_date ON records_releases(release_date);

COMMENT ON TABLE records_releases IS 'Music releases catalog';

-- ============================================================================
-- Enable Row Level Security on all tables
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE beacons ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE beacon_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE beacon_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsar_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE now_playing_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE records_releases ENABLE ROW LEVEL SECURITY;
