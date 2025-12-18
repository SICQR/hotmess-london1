-- ============================================================================
-- HOTMESS GLOBAL DATABASE SCHEMA V3.0
-- Complete schema for all 8 surfaces + City OS
-- ============================================================================
-- Date: November 29, 2025
-- Author: HOTMESS Engineering
-- Purpose: Production-ready schema for global deployment
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- for geo queries

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- users (already exists, expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  
  -- Profile
  avatar TEXT,
  banner TEXT,
  bio TEXT,
  
  -- Age & verification
  date_of_birth DATE,
  age_verified BOOLEAN DEFAULT false,
  age_verified_at TIMESTAMP,
  
  -- Consent
  consent_granted BOOLEAN DEFAULT false,
  consent_granted_at TIMESTAMP,
  terms_accepted_version VARCHAR(20),
  
  -- XP & gamification
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  
  -- Membership
  membership_tier VARCHAR(20) DEFAULT 'starter', -- 'starter', 'pro', 'elite'
  membership_started_at TIMESTAMP,
  membership_expires_at TIMESTAMP,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'banned', 'deleted'
  banned_reason TEXT,
  banned_at TIMESTAMP,
  
  -- Preferences
  notification_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP,
  
  -- Stripe
  stripe_customer_id VARCHAR(100) UNIQUE
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_xp ON users(xp DESC);
CREATE INDEX idx_users_level ON users(level DESC);
CREATE INDEX idx_users_membership ON users(membership_tier);

-- ----------------------------------------------------------------------------
-- cities (NEW - for City OS)
-- ----------------------------------------------------------------------------

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  country VARCHAR(100) NOT NULL,
  country_code VARCHAR(2), -- ISO 3166-1 alpha-2
  
  -- Geographic
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  timezone VARCHAR(50) NOT NULL, -- e.g., 'Europe/London'
  
  -- Localization
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(3) DEFAULT 'GBP',
  
  -- Ambassadors (array of user IDs)
  ambassadors UUID[],
  
  -- Telegram
  telegram_main_room TEXT,
  telegram_marketplace_room TEXT,
  telegram_tickets_room TEXT,
  
  -- Partners
  partner_venues JSONB DEFAULT '[]', -- [{ name, address, type }]
  
  -- Status
  status VARCHAR(20) DEFAULT 'planned', -- 'planned', 'beta', 'live', 'paused'
  launched_at TIMESTAMP,
  
  -- Analytics
  user_count INTEGER DEFAULT 0,
  beacon_count INTEGER DEFAULT 0,
  weekly_scans INTEGER DEFAULT 0,
  
  -- Media
  cover_image TEXT,
  icon TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_cities_status ON cities(status);
CREATE INDEX idx_cities_country ON cities(country_code);

-- ============================================================================
-- BEACON SYSTEM
-- ============================================================================

-- ----------------------------------------------------------------------------
-- beacons (expanding existing)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS beacons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  code VARCHAR(12) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'checkin', 'ticket', 'product', 'drop', 'event', 'chat', 'vendor', 'reward', 'sponsor', 'playlist', 'radio', 'quest', 'room'
  
  -- Ownership
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Content
  title VARCHAR(200),
  description TEXT,
  image TEXT,
  
  -- Action
  action JSONB NOT NULL, -- { type, params }
  redirect_url TEXT,
  
  -- Geographic
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  radius INTEGER, -- meters
  city_id UUID REFERENCES cities(id),
  geofence_required BOOLEAN DEFAULT false,
  
  -- Timing
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  timezone VARCHAR(50),
  
  -- Limits
  max_scans INTEGER,
  max_scans_per_user INTEGER DEFAULT 1,
  cooldown_minutes INTEGER DEFAULT 0,
  
  -- Access control
  premium_only BOOLEAN DEFAULT false,
  consent_required BOOLEAN DEFAULT true,
  membership_tier VARCHAR(20), -- 'starter', 'pro', 'elite', null = all
  age_min INTEGER DEFAULT 18,
  
  -- XP rewards
  xp_base INTEGER DEFAULT 0,
  xp_multiplier DECIMAL(3, 2) DEFAULT 1.0,
  xp_bonus_conditions JSONB, -- { "first_scan": 50, "weekend": 1.5 }
  
  -- Analytics
  scan_count INTEGER DEFAULT 0,
  unique_scan_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  
  -- Commerce
  sponsor_id UUID REFERENCES users(id),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  commission_rate DECIMAL(5, 4), -- for affiliate beacons
  
  -- Flags
  requires_aftercare BOOLEAN DEFAULT false,
  high_risk BOOLEAN DEFAULT false,
  
  -- Metadata
  metadata JSONB,
  tags TEXT[],
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'draft', 'active', 'paused', 'expired', 'deleted'
  moderation_status VARCHAR(20) DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_beacons_code ON beacons(code);
CREATE INDEX idx_beacons_type ON beacons(type);
CREATE INDEX idx_beacons_city ON beacons(city_id);
CREATE INDEX idx_beacons_creator ON beacons(creator_id);
CREATE INDEX idx_beacons_geo ON beacons(lat, lng);
CREATE INDEX idx_beacons_expires ON beacons(expires_at);
CREATE INDEX idx_beacons_status ON beacons(status);

-- ----------------------------------------------------------------------------
-- beacon_rules (NEW - CRITICAL FOR BRE)
-- ----------------------------------------------------------------------------

CREATE TABLE beacon_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beacon_id UUID REFERENCES beacons(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 0, -- higher = evaluated first
  
  -- Condition
  condition_type VARCHAR(50) NOT NULL, -- 'user_tier', 'scan_count', 'time_range', 'geo_distance', 'xp_balance', 'first_scan', 'weekend', 'city_match'
  condition_operator VARCHAR(20), -- 'eq', 'gt', 'lt', 'gte', 'lte', 'in', 'between'
  condition_value JSONB,
  
  -- Action
  action_type VARCHAR(50) NOT NULL, -- 'award_xp', 'send_bot_dm', 'create_thread', 'fire_webhook', 'grant_access', 'add_to_leaderboard', 'trigger_aftercare'
  action_params JSONB,
  
  -- Status
  enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_beacon_rules_beacon ON beacon_rules(beacon_id, priority DESC);
CREATE INDEX idx_beacon_rules_enabled ON beacon_rules(enabled);

-- ----------------------------------------------------------------------------
-- beacon_scans (expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS beacon_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beacon_id UUID REFERENCES beacons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Location
  scan_lat DECIMAL(10, 8),
  scan_lng DECIMAL(11, 8),
  city_id UUID REFERENCES cities(id),
  
  -- Results
  success BOOLEAN DEFAULT true,
  failure_reason VARCHAR(100),
  xp_awarded INTEGER DEFAULT 0,
  action_taken VARCHAR(50),
  redirect_to TEXT,
  
  -- Attribution
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  referrer TEXT,
  
  -- Device
  user_agent TEXT,
  device_type VARCHAR(20), -- 'mobile', 'desktop', 'tablet'
  ip_address INET,
  
  -- Timing
  scanned_at TIMESTAMP DEFAULT NOW(),
  
  -- Automation
  rules_evaluated JSONB, -- which rules matched
  automation_fired BOOLEAN DEFAULT false,
  automation_response JSONB,
  bot_notified BOOLEAN DEFAULT false,
  bot_notification_sent_at TIMESTAMP,
  
  metadata JSONB
);

CREATE INDEX idx_beacon_scans_beacon ON beacon_scans(beacon_id);
CREATE INDEX idx_beacon_scans_user ON beacon_scans(user_id);
CREATE INDEX idx_beacon_scans_time ON beacon_scans(scanned_at DESC);
CREATE INDEX idx_beacon_scans_city ON beacon_scans(city_id);
CREATE INDEX idx_beacon_scans_success ON beacon_scans(success);

-- ============================================================================
-- XP SYSTEM
-- ============================================================================

-- ----------------------------------------------------------------------------
-- xp_ledger (expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS xp_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction
  amount INTEGER NOT NULL, -- can be negative for deductions
  balance_after INTEGER NOT NULL,
  
  -- Source
  source VARCHAR(50) NOT NULL, -- 'beacon_scan', 'purchase', 'listing_sale', 'level_up_bonus', 'manual_award', 'redemption'
  source_id UUID, -- ID of beacon, order, etc.
  reason TEXT,
  
  -- Context
  beacon_id UUID REFERENCES beacons(id),
  city_id UUID REFERENCES cities(id),
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_xp_ledger_user ON xp_ledger(user_id, created_at DESC);
CREATE INDEX idx_xp_ledger_source ON xp_ledger(source);
CREATE INDEX idx_xp_ledger_city ON xp_ledger(city_id);

-- ----------------------------------------------------------------------------
-- rewards (NEW - for XP redemption)
-- ----------------------------------------------------------------------------

CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  name VARCHAR(200) NOT NULL,
  description TEXT,
  image TEXT,
  
  -- Cost
  xp_cost INTEGER NOT NULL,
  
  -- Type
  type VARCHAR(50) NOT NULL, -- 'merch', 'access', 'perk', 'discount', 'mystery'
  
  -- Delivery
  delivery_method VARCHAR(50), -- 'code', 'beacon', 'physical', 'digital', 'auto'
  
  -- Stock
  stock_quantity INTEGER,
  stock_unlimited BOOLEAN DEFAULT false,
  redeemed_count INTEGER DEFAULT 0,
  
  -- Restrictions
  membership_tier_required VARCHAR(20),
  city_id UUID REFERENCES cities(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'sold_out'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rewards_status ON rewards(status);
CREATE INDEX idx_rewards_xp_cost ON rewards(xp_cost);

-- ----------------------------------------------------------------------------
-- reward_redemptions
-- ----------------------------------------------------------------------------

CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Transaction
  xp_spent INTEGER NOT NULL,
  
  -- Fulfillment
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'fulfilled', 'cancelled'
  fulfillment_code VARCHAR(100),
  fulfillment_beacon_id UUID REFERENCES beacons(id),
  fulfilled_at TIMESTAMP,
  
  redeemed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_redemptions_user ON reward_redemptions(user_id);
CREATE INDEX idx_redemptions_reward ON reward_redemptions(reward_id);
CREATE INDEX idx_redemptions_status ON reward_redemptions(status);

-- ============================================================================
-- TICKETING SYSTEM
-- ============================================================================

-- ----------------------------------------------------------------------------
-- clubs (NEW - for Club Mode)
-- ----------------------------------------------------------------------------

CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identity
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- Details
  description TEXT,
  logo TEXT,
  cover_image TEXT,
  website TEXT,
  
  -- Location
  address TEXT,
  city_id UUID REFERENCES cities(id),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  
  -- Owner
  owner_id UUID REFERENCES users(id),
  
  -- Staff (array of user IDs with door access)
  door_staff UUID[],
  managers UUID[],
  
  -- Commerce
  stripe_account_id VARCHAR(100) UNIQUE,
  onboarding_complete BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  
  -- Subscription (Club Mode SaaS)
  subscription_tier VARCHAR(20), -- 'starter', 'pro', 'enterprise'
  subscription_started_at TIMESTAMP,
  subscription_ends_at TIMESTAMP,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'suspended'
  verified BOOLEAN DEFAULT false,
  
  -- Analytics
  total_events INTEGER DEFAULT 0,
  total_tickets_sold INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0, -- in cents
  
  -- Settings
  default_capacity INTEGER,
  default_age_restriction INTEGER DEFAULT 18,
  gender_policy VARCHAR(50), -- 'men_only', 'all_genders', 'women_only'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clubs_city ON clubs(city_id);
CREATE INDEX idx_clubs_slug ON clubs(slug);
CREATE INDEX idx_clubs_owner ON clubs(owner_id);
CREATE INDEX idx_clubs_status ON clubs(status);

-- ----------------------------------------------------------------------------
-- events (NEW - for Club Mode)
-- ----------------------------------------------------------------------------

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID REFERENCES clubs(id) NOT NULL,
  
  -- Event details
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200),
  description TEXT,
  cover_image TEXT,
  lineup TEXT[], -- array of artist names
  
  -- Timing
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  doors_open TIMESTAMP,
  timezone VARCHAR(50),
  
  -- Venue
  venue_name VARCHAR(200),
  address TEXT,
  city_id UUID REFERENCES cities(id),
  
  -- Capacity
  capacity INTEGER,
  capacity_ga INTEGER,
  capacity_vip INTEGER,
  
  -- Pricing (in cents)
  price_ga INTEGER,
  price_vip INTEGER,
  
  -- Guestlist
  guestlist JSONB DEFAULT '[]', -- [{ name, email, tier, promoter }]
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'upcoming', 'live', 'ended', 'cancelled'
  
  -- Policies
  age_restriction INTEGER DEFAULT 18,
  gender_policy VARCHAR(50),
  dress_code TEXT,
  
  -- Beacons
  event_beacon_id UUID REFERENCES beacons(id),
  checkin_beacon_id UUID REFERENCES beacons(id),
  
  -- Analytics
  tickets_sold INTEGER DEFAULT 0,
  tickets_sold_ga INTEGER DEFAULT 0,
  tickets_sold_vip INTEGER DEFAULT 0,
  revenue INTEGER DEFAULT 0, -- in cents
  checked_in_count INTEGER DEFAULT 0,
  
  -- Promoters (user IDs with tracking codes)
  promoters JSONB DEFAULT '[]', -- [{ user_id, code, commission_rate }]
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_club ON events(club_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_city ON events(city_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_slug ON events(slug);

-- ----------------------------------------------------------------------------
-- tickets (expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Type
  type VARCHAR(20) DEFAULT 'resale', -- 'resale' (C2C), 'club_primary' (Club Mode)
  
  -- Event details (for C2C)
  event_name VARCHAR(200),
  event_date TIMESTAMP,
  venue VARCHAR(200),
  
  -- Event reference (for Club Mode)
  event_id UUID REFERENCES events(id),
  tier VARCHAR(50), -- 'ga', 'vip', 'guestlist'
  
  -- Seller (for C2C)
  seller_id UUID REFERENCES users(id),
  
  -- Buyer
  buyer_id UUID REFERENCES users(id),
  
  -- Pricing (in cents)
  price INTEGER NOT NULL,
  fee_buyer INTEGER, -- buyer fee
  fee_seller INTEGER, -- seller fee
  
  -- Status
  status VARCHAR(20) DEFAULT 'listed', -- 'listed', 'reserved', 'purchased', 'transferred', 'checked_in', 'cancelled'
  
  -- Proof (for C2C)
  proof_images TEXT[],
  original_receipt TEXT,
  
  -- QR codes
  listing_beacon_id UUID REFERENCES beacons(id), -- for sharing listing
  access_beacon_id UUID REFERENCES beacons(id), -- generated after purchase
  qr_code TEXT, -- the actual ticket QR for door scanning
  
  -- Commerce
  stripe_payment_intent VARCHAR(100),
  stripe_transfer_id VARCHAR(100),
  escrow_released BOOLEAN DEFAULT false,
  
  -- Tracking
  purchased_at TIMESTAMP,
  transferred_at TIMESTAMP,
  checked_in_at TIMESTAMP,
  checked_in_by UUID REFERENCES users(id), -- door staff user
  checked_in_location POINT, -- PostGIS point
  
  -- Attribution (for Club Mode)
  promoter_id UUID REFERENCES users(id),
  promoter_code VARCHAR(50),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  -- Thread (for C2C communication)
  thread_id UUID,
  
  -- City
  city_id UUID REFERENCES cities(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tickets_event_date ON tickets(event_date);
CREATE INDEX idx_tickets_seller ON tickets(seller_id);
CREATE INDEX idx_tickets_buyer ON tickets(buyer_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_type ON tickets(type);
CREATE INDEX idx_tickets_city ON tickets(city_id);

-- ============================================================================
-- MESSMARKET
-- ============================================================================

-- ----------------------------------------------------------------------------
-- messmarket_vendors (expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS messmarket_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
  
  -- Profile
  shop_name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  avatar TEXT,
  banner TEXT,
  
  -- Tier
  tier VARCHAR(20) DEFAULT 'starter', -- 'starter', 'pro'
  tier_started_at TIMESTAMP,
  tier_billing_cycle VARCHAR(20), -- 'monthly', 'yearly'
  
  -- Commerce
  stripe_account_id VARCHAR(100) UNIQUE,
  onboarding_complete BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  
  -- Verification
  id_verified BOOLEAN DEFAULT false,
  id_verification_provider VARCHAR(50),
  verified_at TIMESTAMP,
  
  -- Reputation
  reputation_score INTEGER DEFAULT 100,
  total_sales INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0, -- in cents
  total_orders_fulfilled INTEGER DEFAULT 0,
  avg_fulfillment_days DECIMAL(5, 2),
  
  -- Stats
  listing_count INTEGER DEFAULT 0,
  active_listing_count INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'banned'
  suspension_reason TEXT,
  
  -- Settings
  auto_announce_new_listings BOOLEAN DEFAULT true,
  notification_preferences JSONB,
  shipping_countries TEXT[], -- array of ISO country codes
  
  -- City
  city_id UUID REFERENCES cities(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vendors_user ON messmarket_vendors(user_id);
CREATE INDEX idx_vendors_slug ON messmarket_vendors(slug);
CREATE INDEX idx_vendors_tier ON messmarket_vendors(tier);
CREATE INDEX idx_vendors_status ON messmarket_vendors(status);
CREATE INDEX idx_vendors_city ON messmarket_vendors(city_id);

-- ----------------------------------------------------------------------------
-- messmarket_listings (expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS messmarket_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES messmarket_vendors(id) NOT NULL,
  
  -- Content
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(50),
  tags TEXT[],
  
  -- Media
  images TEXT[] NOT NULL,
  video_url TEXT,
  
  -- Pricing (in cents)
  price INTEGER NOT NULL,
  compare_at_price INTEGER,
  currency VARCHAR(3) DEFAULT 'GBP',
  
  -- Stock
  stock_quantity INTEGER DEFAULT 1,
  stock_unlimited BOOLEAN DEFAULT false,
  
  -- Content rating
  content_rating VARCHAR(20) DEFAULT 'SFW', -- 'SFW', 'SUGGESTIVE', 'NSFW', 'EXPLICIT'
  requires_age_verification BOOLEAN DEFAULT false,
  ai_detected_rating VARCHAR(20), -- what AI thinks it should be
  
  -- Moderation
  moderation_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'flagged'
  moderation_notes TEXT,
  moderated_by UUID REFERENCES users(id),
  moderated_at TIMESTAMP,
  ai_moderation_flags JSONB, -- what AI detected
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'sold', 'archived'
  
  -- Commerce
  stripe_product_id VARCHAR(100),
  stripe_price_id VARCHAR(100),
  
  -- Beacon
  beacon_id UUID REFERENCES beacons(id),
  
  -- Import (if applicable)
  imported_from VARCHAR(50), -- 'shopify', 'etsy', 'ebay', 'gumroad'
  external_id VARCHAR(100),
  external_url TEXT,
  sync_enabled BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMP,
  
  -- Analytics
  views INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  beacon_scans INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  
  -- SEO
  slug VARCHAR(200),
  
  -- City
  city_id UUID REFERENCES cities(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_listings_vendor ON messmarket_listings(vendor_id);
CREATE INDEX idx_listings_category ON messmarket_listings(category);
CREATE INDEX idx_listings_status ON messmarket_listings(status);
CREATE INDEX idx_listings_rating ON messmarket_listings(content_rating);
CREATE INDEX idx_listings_moderation ON messmarket_listings(moderation_status);
CREATE INDEX idx_listings_slug ON messmarket_listings(slug);
CREATE INDEX idx_listings_city ON messmarket_listings(city_id);

-- ----------------------------------------------------------------------------
-- messmarket_orders
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS messmarket_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  
  -- Parties
  buyer_id UUID REFERENCES users(id) NOT NULL,
  vendor_id UUID REFERENCES messmarket_vendors(id) NOT NULL,
  listing_id UUID REFERENCES messmarket_listings(id) NOT NULL,
  
  -- Quantity
  quantity INTEGER DEFAULT 1,
  
  -- Amount (in cents)
  subtotal INTEGER NOT NULL,
  fee_buyer INTEGER NOT NULL,
  fee_platform INTEGER NOT NULL,
  total INTEGER NOT NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'delivered', 'disputed', 'refunded', 'cancelled'
  
  -- Shipping
  shipping_address JSONB,
  shipping_method VARCHAR(50),
  tracking_number VARCHAR(100),
  tracking_url TEXT,
  shipped_at TIMESTAMP,
  estimated_delivery DATE,
  delivered_at TIMESTAMP,
  
  -- Commerce
  stripe_payment_intent VARCHAR(100),
  stripe_transfer_id VARCHAR(100),
  payout_released BOOLEAN DEFAULT false,
  payout_released_at TIMESTAMP,
  
  -- Thread
  thread_id UUID,
  
  -- XP
  xp_awarded_buyer INTEGER DEFAULT 0,
  xp_awarded_seller INTEGER DEFAULT 0,
  
  -- Dispute
  disputed BOOLEAN DEFAULT false,
  dispute_reason TEXT,
  dispute_resolution TEXT,
  
  -- City
  city_id UUID REFERENCES cities(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_buyer ON messmarket_orders(buyer_id);
CREATE INDEX idx_orders_vendor ON messmarket_orders(vendor_id);
CREATE INDEX idx_orders_status ON messmarket_orders(status);
CREATE INDEX idx_orders_city ON messmarket_orders(city_id);

-- ============================================================================
-- RAW CONVICT RECORDS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- releases (expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Release info
  title VARCHAR(200) NOT NULL,
  artist VARCHAR(200) NOT NULL,
  artist_ids UUID[], -- array of user IDs
  label VARCHAR(100) DEFAULT 'RAW CONVICT',
  release_type VARCHAR(50), -- 'single', 'ep', 'album', 'compilation'
  
  -- Dates
  release_date DATE NOT NULL,
  presave_date DATE,
  announcement_date DATE,
  
  -- Media
  artwork TEXT NOT NULL,
  artwork_large TEXT,
  
  -- Distribution codes
  isrc_prefix VARCHAR(20),
  upc_code VARCHAR(20),
  catalog_number VARCHAR(50),
  
  -- Platform URLs
  soundcloud_url TEXT,
  soundcloud_id VARCHAR(100),
  spotify_url TEXT,
  spotify_id VARCHAR(100),
  apple_music_url TEXT,
  youtube_url TEXT,
  beatport_url TEXT,
  bandcamp_url TEXT,
  smartlink_url TEXT,
  
  -- Beacon
  beacon_id UUID REFERENCES beacons(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'live', 'archived'
  distribution_status VARCHAR(20), -- 'pending', 'distributed', 'failed'
  
  -- Analytics
  streams_soundcloud INTEGER DEFAULT 0,
  streams_spotify INTEGER DEFAULT 0,
  streams_apple INTEGER DEFAULT 0,
  streams_total INTEGER DEFAULT 0,
  downloads_total INTEGER DEFAULT 0,
  saves_total INTEGER DEFAULT 0,
  beacon_scans INTEGER DEFAULT 0,
  
  -- Royalties
  royalty_splits JSONB, -- { "user_id": 0.70, "user_id_2": 0.30 }
  total_royalties_paid INTEGER DEFAULT 0, -- in cents
  
  -- Radio
  radio_rotation_priority INTEGER DEFAULT 0, -- 0 = normal, 1 = high, 2 = priority
  radio_plays INTEGER DEFAULT 0,
  
  -- Merchandise
  merch_available BOOLEAN DEFAULT false,
  merch_listing_ids UUID[], -- references messmarket_listings
  
  -- City
  city_id UUID REFERENCES cities(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_releases_release_date ON releases(release_date DESC);
CREATE INDEX idx_releases_artist ON releases(artist);
CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_releases_city ON releases(city_id);

-- ----------------------------------------------------------------------------
-- tracks (expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE,
  
  -- Track info
  title VARCHAR(200) NOT NULL,
  position INTEGER NOT NULL,
  duration INTEGER, -- in seconds
  
  -- Versions
  version VARCHAR(50), -- 'original', 'clean', 'explicit', 'instrumental', 'remix', 'radio_edit'
  remix_artist VARCHAR(200),
  
  -- ISRC
  isrc VARCHAR(20) UNIQUE,
  
  -- Audio files
  audio_url TEXT, -- full track (authenticated)
  audio_url_high_quality TEXT, -- FLAC/WAV
  preview_url TEXT, -- 30s preview (public)
  stems_url TEXT, -- DJ pack (authenticated)
  
  -- Lyrics
  lyrics TEXT,
  explicit_lyrics BOOLEAN DEFAULT false,
  
  -- Analytics
  streams INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  radio_plays INTEGER DEFAULT 0,
  
  -- Metadata
  bpm INTEGER,
  key VARCHAR(10),
  genre VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tracks_release ON tracks(release_id, position);
CREATE INDEX idx_tracks_isrc ON tracks(isrc);

-- ----------------------------------------------------------------------------
-- track_streams (NEW - for XP awards)
-- ----------------------------------------------------------------------------

CREATE TABLE track_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Platform
  platform VARCHAR(50), -- 'soundcloud', 'spotify', 'apple', 'hotmess_radio', 'hotmess_web'
  
  -- Tracking
  duration_seconds INTEGER,
  completed BOOLEAN DEFAULT false, -- listened to >80%
  
  -- XP
  xp_awarded INTEGER DEFAULT 0,
  
  -- Context
  beacon_id UUID REFERENCES beacons(id),
  
  streamed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_streams_track ON track_streams(track_id);
CREATE INDEX idx_streams_user ON track_streams(user_id);
CREATE INDEX idx_streams_time ON track_streams(streamed_at DESC);

-- ============================================================================
-- RADIO
-- ============================================================================

-- ----------------------------------------------------------------------------
-- radio_shows (expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS radio_shows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Show info
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE,
  description TEXT,
  host_name VARCHAR(200),
  host_id UUID REFERENCES users(id),
  
  -- Media
  cover_art TEXT,
  
  -- Schedule
  schedule_type VARCHAR(20), -- 'weekly', 'biweekly', 'monthly', 'one_off'
  day_of_week INTEGER, -- 0 = Sunday, 6 = Saturday
  start_time TIME,
  duration_minutes INTEGER,
  timezone VARCHAR(50),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'ended'
  
  -- Analytics
  total_episodes INTEGER DEFAULT 0,
  total_listeners INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shows_slug ON radio_shows(slug);
CREATE INDEX idx_shows_host ON radio_shows(host_id);
CREATE INDEX idx_shows_status ON radio_shows(status);

-- ----------------------------------------------------------------------------
-- radio_episodes (NEW)
-- ----------------------------------------------------------------------------

CREATE TABLE radio_episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_id UUID REFERENCES radio_shows(id) ON DELETE CASCADE,
  
  -- Episode info
  title VARCHAR(200),
  description TEXT,
  episode_number INTEGER,
  
  -- Timing
  aired_at TIMESTAMP,
  duration_minutes INTEGER,
  
  -- Content
  tracklist JSONB, -- [{ artist, title, timestamp }]
  recording_url TEXT,
  
  -- Guest
  guest_name VARCHAR(200),
  guest_id UUID REFERENCES users(id),
  
  -- Analytics
  listeners INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_episodes_show ON radio_episodes(show_id, aired_at DESC);

-- ----------------------------------------------------------------------------
-- radio_sponsors (NEW)
-- ----------------------------------------------------------------------------

CREATE TABLE radio_sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Sponsor info
  name VARCHAR(200) NOT NULL,
  logo TEXT,
  website TEXT,
  
  -- Contact
  contact_name VARCHAR(200),
  contact_email VARCHAR(200),
  
  -- Sponsorship
  tier VARCHAR(20), -- 'spot', 'show', 'day', 'week', 'month'
  start_date DATE,
  end_date DATE,
  
  -- Ad creative
  ad_script TEXT,
  ad_audio_url TEXT, -- pre-recorded spot
  
  -- Beacon
  beacon_id UUID REFERENCES beacons(id),
  
  -- Analytics
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sponsors_status ON radio_sponsors(status);
CREATE INDEX idx_sponsors_dates ON radio_sponsors(start_date, end_date);

-- ============================================================================
-- AUTOMATION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- automations (NEW - Make.com integration)
-- ----------------------------------------------------------------------------

CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Automation info
  name VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Trigger
  trigger_type VARCHAR(50) NOT NULL, -- 'beacon_scan', 'ticket_purchase', 'listing_approved', 'user_level_up', 'scheduled'
  trigger_conditions JSONB,
  
  -- Target
  beacon_type VARCHAR(20), -- if trigger is beacon_scan
  entity_type VARCHAR(50), -- 'beacon', 'listing', 'ticket', 'user'
  
  -- Actions
  actions JSONB NOT NULL, -- [{ type, params }]
  
  -- Make.com
  make_scenario_url TEXT,
  make_scenario_id VARCHAR(100),
  
  -- Status
  enabled BOOLEAN DEFAULT true,
  
  -- Analytics
  triggered_count INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_automations_trigger ON automations(trigger_type);
CREATE INDEX idx_automations_enabled ON automations(enabled);

-- ----------------------------------------------------------------------------
-- automation_logs
-- ----------------------------------------------------------------------------

CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
  
  -- Trigger context
  trigger_entity_type VARCHAR(50),
  trigger_entity_id UUID,
  user_id UUID REFERENCES users(id),
  
  -- Execution
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- Response
  response_data JSONB,
  
  executed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_automation_logs_automation ON automation_logs(automation_id, executed_at DESC);
CREATE INDEX idx_automation_logs_success ON automation_logs(success);

-- ============================================================================
-- ANALYTICS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- analytics_snapshots (NEW - for KPI tracking)
-- ----------------------------------------------------------------------------

CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Timeframe
  snapshot_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  snapshot_date DATE NOT NULL,
  
  -- Scope
  city_id UUID REFERENCES cities(id), -- null = global
  
  -- User metrics
  dau INTEGER,
  wau INTEGER,
  mau INTEGER,
  new_signups INTEGER,
  
  -- Engagement
  total_scans INTEGER,
  unique_scanners INTEGER,
  avg_scans_per_user DECIMAL(10, 2),
  xp_issued INTEGER,
  
  -- Commerce
  marketplace_gmv INTEGER, -- in cents
  marketplace_orders INTEGER,
  ticket_gmv INTEGER,
  tickets_sold INTEGER,
  shop_gmv INTEGER,
  total_platform_revenue INTEGER,
  
  -- Content
  radio_streams INTEGER,
  track_plays INTEGER,
  new_releases INTEGER,
  
  -- Community
  messages_sent INTEGER,
  threads_created INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(snapshot_type, snapshot_date, city_id)
);

CREATE INDEX idx_snapshots_type_date ON analytics_snapshots(snapshot_type, snapshot_date DESC);
CREATE INDEX idx_snapshots_city ON analytics_snapshots(city_id);

-- ============================================================================
-- COMMUNITY & MESSAGING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- threads (expanding)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Type
  type VARCHAR(50) DEFAULT 'direct', -- 'direct', 'ticket', 'marketplace', 'support'
  
  -- Participants (array of user IDs)
  participants UUID[] NOT NULL,
  
  -- Context (what this thread is about)
  context_type VARCHAR(50), -- 'ticket', 'listing', 'order', 'beacon', 'report'
  context_id UUID,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'blocked'
  
  -- Last message
  last_message_at TIMESTAMP,
  last_message_preview TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_threads_participants ON threads USING GIN(participants);
CREATE INDEX idx_threads_context ON threads(context_type, context_id);

-- ----------------------------------------------------------------------------
-- messages
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  
  -- Content
  content TEXT,
  attachments TEXT[], -- array of URLs
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  -- Moderation
  flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  
  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_thread ON messages(thread_id, sent_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- ============================================================================
-- MODERATION & SAFETY
-- ============================================================================

-- ----------------------------------------------------------------------------
-- reports
-- ----------------------------------------------------------------------------

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Reporter
  reporter_id UUID REFERENCES users(id),
  
  -- Target
  target_type VARCHAR(50), -- 'user', 'listing', 'beacon', 'message', 'event'
  target_id UUID,
  
  -- Report
  reason VARCHAR(50), -- 'spam', 'harassment', 'illegal', 'underage', 'inappropriate'
  description TEXT,
  evidence_urls TEXT[],
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'investigating', 'resolved', 'dismissed'
  resolution TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMP,
  
  reported_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);

-- ----------------------------------------------------------------------------
-- aftercare_checks (NEW)
-- ----------------------------------------------------------------------------

CREATE TABLE aftercare_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Trigger
  trigger_type VARCHAR(50), -- 'high_risk_beacon', 'event_attendance', 'scheduled'
  trigger_id UUID,
  beacon_id UUID REFERENCES beacons(id),
  
  -- Check
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  
  -- Response
  response VARCHAR(50), -- 'ok', 'need_support', 'no_response'
  response_at TIMESTAMP,
  support_provided BOOLEAN DEFAULT false,
  
  -- Status
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'sent', 'responded', 'escalated'
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_aftercare_user ON aftercare_checks(user_id, scheduled_for);
CREATE INDEX idx_aftercare_status ON aftercare_checks(status);

-- ============================================================================
-- VIEWS (for convenience)
-- ============================================================================

-- Global stats view
CREATE OR REPLACE VIEW global_stats AS
SELECT
  (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
  (SELECT COUNT(*) FROM beacons WHERE status = 'active') as active_beacons,
  (SELECT COUNT(*) FROM beacon_scans WHERE scanned_at > NOW() - INTERVAL '7 days') as scans_7d,
  (SELECT SUM(xp) FROM users) as total_xp_issued,
  (SELECT COUNT(*) FROM messmarket_listings WHERE status = 'active') as active_listings,
  (SELECT COUNT(*) FROM tickets WHERE status IN ('listed', 'purchased')) as active_tickets,
  (SELECT COUNT(*) FROM releases WHERE status = 'live') as live_releases,
  (SELECT COUNT(*) FROM cities WHERE status = 'live') as live_cities;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to award XP and update user level
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source VARCHAR(50),
  p_source_id UUID,
  p_reason TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Update user XP
  UPDATE users
  SET xp = xp + p_amount,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING xp INTO v_new_balance;
  
  -- Calculate new level (every 1000 XP = 1 level)
  v_new_level := FLOOR(v_new_balance / 1000) + 1;
  
  -- Update level if changed
  UPDATE users
  SET level = v_new_level
  WHERE id = p_user_id AND level < v_new_level;
  
  -- Insert ledger entry
  INSERT INTO xp_ledger (user_id, amount, balance_after, source, source_id, reason)
  VALUES (p_user_id, p_amount, v_new_balance, p_source, p_source_id, p_reason);
  
  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert London as first city
INSERT INTO cities (name, slug, country, country_code, lat, lng, timezone, status, launched_at)
VALUES ('London', 'london', 'United Kingdom', 'GB', 51.5074, -0.1278, 'Europe/London', 'live', NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
