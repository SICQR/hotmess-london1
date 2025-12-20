-- ============================================================================
-- HOTMESS BEACON SYSTEM MIGRATION
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- BEACONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS beacons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- short unique code for /l/:code
  type TEXT NOT NULL CHECK (type IN (
    'checkin', 'ticket', 'product', 'drop', 
    'event', 'chat', 'vendor', 'reward', 'sponsor'
  )),
  owner_id UUID, -- references user who created (nullable for system beacons)
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'expired')),
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  
  -- Timing
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  
  -- Geo
  geo_lat DECIMAL(10, 8),
  geo_lng DECIMAL(11, 8),
  city_slug TEXT,
  
  -- Limits & XP
  xp_amount INTEGER NOT NULL DEFAULT 0,
  max_scans_total INTEGER, -- null = unlimited
  max_scans_per_user_per_day INTEGER, -- null = unlimited
  
  -- References
  sponsor_id UUID, -- references sponsor
  chat_room_id UUID, -- references chat room
  
  -- Routing
  redirect_url TEXT NOT NULL,
  redirect_fallback TEXT,
  utm_json JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for beacons
CREATE INDEX IF NOT EXISTS idx_beacons_code ON beacons(code);
CREATE INDEX IF NOT EXISTS idx_beacons_status ON beacons(status);
CREATE INDEX IF NOT EXISTS idx_beacons_type ON beacons(type);
CREATE INDEX IF NOT EXISTS idx_beacons_owner ON beacons(owner_id);
CREATE INDEX IF NOT EXISTS idx_beacons_city ON beacons(city_slug);
CREATE INDEX IF NOT EXISTS idx_beacons_geo ON beacons(geo_lat, geo_lng) WHERE geo_lat IS NOT NULL AND geo_lng IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_beacons_active ON beacons(status, starts_at, ends_at) WHERE status = 'active';

-- ============================================================================
-- BEACON SCANS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS beacon_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beacon_id UUID NOT NULL REFERENCES beacons(id) ON DELETE CASCADE,
  user_id UUID, -- nullable for guest scans
  device_hash TEXT NOT NULL, -- rotating device fingerprint
  city_slug TEXT,
  geo_lat DECIMAL(10, 8),
  geo_lng DECIMAL(11, 8),
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  result TEXT NOT NULL CHECK (result IN (
    'accepted', 'rejected', 'duplicate', 
    'expired', 'rate_limited', 'quota_exceeded'
  )),
  reason_code TEXT,
  ip_hash TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for beacon_scans
CREATE INDEX IF NOT EXISTS idx_beacon_scans_beacon ON beacon_scans(beacon_id);
CREATE INDEX IF NOT EXISTS idx_beacon_scans_user ON beacon_scans(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_beacon_scans_time ON beacon_scans(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_beacon_scans_result ON beacon_scans(result);
CREATE INDEX IF NOT EXISTS idx_beacon_scans_accepted ON beacon_scans(beacon_id, result) WHERE result = 'accepted';
CREATE INDEX IF NOT EXISTS idx_beacon_scans_user_beacon ON beacon_scans(user_id, beacon_id, scanned_at) WHERE user_id IS NOT NULL;

-- ============================================================================
-- XP LEDGER TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS xp_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- references user
  kind TEXT NOT NULL CHECK (kind IN (
    'scan', 'purchase', 'post', 
    'referral', 'bonus', 'admin_adjustment'
  )),
  amount INTEGER NOT NULL, -- can be negative for adjustments
  beacon_id UUID REFERENCES beacons(id) ON DELETE SET NULL,
  ref_id TEXT, -- order_id / listing_id / post_id
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for xp_ledger
CREATE INDEX IF NOT EXISTS idx_xp_ledger_user ON xp_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_kind ON xp_ledger(kind);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_beacon ON xp_ledger(beacon_id) WHERE beacon_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_xp_ledger_time ON xp_ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_user_time ON xp_ledger(user_id, created_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at on beacons
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_beacons_updated_at
  BEFORE UPDATE ON beacons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES (Security)
-- ============================================================================

-- Enable RLS
ALTER TABLE beacons ENABLE ROW LEVEL SECURITY;
ALTER TABLE beacon_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_ledger ENABLE ROW LEVEL SECURITY;

-- Beacons: Public read for active, admin write
CREATE POLICY "Anyone can view active beacons"
  ON beacons FOR SELECT
  USING (status = 'active');

CREATE POLICY "Service role can manage beacons"
  ON beacons FOR ALL
  USING (auth.role() = 'service_role');

-- Beacon Scans: Users can view their own, service role can write
CREATE POLICY "Users can view their own scans"
  ON beacon_scans FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Service role can manage scans"
  ON beacon_scans FOR ALL
  USING (auth.role() = 'service_role');

-- XP Ledger: Users can view their own, service role can write
CREATE POLICY "Users can view their own XP"
  ON xp_ledger FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Service role can manage XP"
  ON xp_ledger FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Sample beacon: Vauxhall Tavern check-in
INSERT INTO beacons (
  code, type, status, title, description,
  geo_lat, geo_lng, city_slug,
  xp_amount, max_scans_per_user_per_day,
  redirect_url
) VALUES (
  'vxtavern1',
  'checkin',
  'active',
  'Vauxhall Tavern Check-In',
  'Scan when you arrive at Vauxhall Tavern. +10 XP',
  51.486050,
  -0.124750,
  'london',
  10,
  1,
  'https://hotmesslondon.com/map'
) ON CONFLICT (code) DO NOTHING;

-- Sample beacon: Shop drop
INSERT INTO beacons (
  code, type, status, title, description,
  xp_amount, max_scans_total,
  starts_at, ends_at,
  redirect_url
) VALUES (
  'raw-drop-001',
  'drop',
  'active',
  'RAW Collection Drop',
  'Limited RAW drop - first 100 scans get early access. +50 XP',
  50,
  100,
  NOW(),
  NOW() + INTERVAL '7 days',
  'https://hotmesslondon.com/shop-raw'
) ON CONFLICT (code) DO NOTHING;

-- Sample beacon: Radio show promo
INSERT INTO beacons (
  code, type, status, title, description,
  xp_amount,
  redirect_url
) VALUES (
  'radio-daddy',
  'sponsor',
  'active',
  'Daddy Radio Show',
  'Tune in to Daddy Radio - live tonight. +5 XP',
  5,
  'https://hotmesslondon.com/radio'
) ON CONFLICT (code) DO NOTHING;
