-- ============================================================================
-- HOTMESS LONDON - COMPLETE BEACON SYSTEM MIGRATION
-- ============================================================================
-- This drops your existing tables and creates the full HOTMESS architecture
-- ============================================================================

-- 1) DROP EXISTING TABLES (if you want to start fresh)
DROP TABLE IF EXISTS public.beacon_events CASCADE;
DROP TABLE IF EXISTS public.beacons CASCADE;
DROP TABLE IF EXISTS public.beacon_scans CASCADE;
DROP TABLE IF EXISTS public.xp_ledger CASCADE;

-- 2) CREATE EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- BEACONS TABLE
-- ============================================================================
CREATE TABLE public.beacons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- Short code for /l/:code
  type TEXT NOT NULL CHECK (type IN (
    'checkin', 'ticket', 'product', 'drop', 
    'event', 'chat', 'vendor', 'reward', 'sponsor'
  )),
  owner_id UUID, -- nullable for system beacons
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
  max_scans_total INTEGER,
  max_scans_per_user_per_day INTEGER,
  
  -- References
  sponsor_id UUID,
  chat_room_id UUID,
  
  -- Routing
  redirect_url TEXT NOT NULL,
  redirect_fallback TEXT,
  utm_json JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_beacons_code ON public.beacons(code);
CREATE INDEX idx_beacons_status ON public.beacons(status);
CREATE INDEX idx_beacons_type ON public.beacons(type);
CREATE INDEX idx_beacons_owner ON public.beacons(owner_id);
CREATE INDEX idx_beacons_city ON public.beacons(city_slug);
CREATE INDEX idx_beacons_geo ON public.beacons(geo_lat, geo_lng) WHERE geo_lat IS NOT NULL;

-- ============================================================================
-- BEACON SCANS TABLE
-- ============================================================================
CREATE TABLE public.beacon_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beacon_id UUID NOT NULL REFERENCES public.beacons(id) ON DELETE CASCADE,
  user_id UUID,
  device_hash TEXT NOT NULL,
  
  -- Location
  city_slug TEXT,
  geo_lat DECIMAL(10, 8),
  geo_lng DECIMAL(11, 8),
  
  -- Result
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  result TEXT NOT NULL CHECK (result IN (
    'accepted', 'rejected', 'duplicate', 
    'expired', 'rate_limited', 'quota_exceeded'
  )),
  reason_code TEXT,
  ip_hash TEXT
);

-- Indexes
CREATE INDEX idx_beacon_scans_beacon ON public.beacon_scans(beacon_id);
CREATE INDEX idx_beacon_scans_user ON public.beacon_scans(user_id);
CREATE INDEX idx_beacon_scans_device ON public.beacon_scans(device_hash);
CREATE INDEX idx_beacon_scans_time ON public.beacon_scans(scanned_at);
CREATE INDEX idx_beacon_scans_result ON public.beacon_scans(result);

-- ============================================================================
-- XP LEDGER TABLE
-- ============================================================================
CREATE TABLE public.xp_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN (
    'scan', 'purchase', 'post', 
    'referral', 'bonus', 'admin_adjustment'
  )),
  amount INTEGER NOT NULL,
  
  -- References
  beacon_id UUID REFERENCES public.beacons(id) ON DELETE SET NULL,
  ref_id TEXT,
  metadata JSONB,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_xp_ledger_user ON public.xp_ledger(user_id);
CREATE INDEX idx_xp_ledger_kind ON public.xp_ledger(kind);
CREATE INDEX idx_xp_ledger_beacon ON public.xp_ledger(beacon_id);
CREATE INDEX idx_xp_ledger_time ON public.xp_ledger(created_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_beacons_updated_at ON public.beacons;
CREATE TRIGGER update_beacons_updated_at
  BEFORE UPDATE ON public.beacons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.beacons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beacon_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;

-- BEACONS: Public can read ACTIVE beacons (for globe)
DROP POLICY IF EXISTS "Anyone can view active beacons" ON public.beacons;
CREATE POLICY "Anyone can view active beacons" ON public.beacons
  FOR SELECT USING (status = 'active');

-- BEACONS: Owners can manage their own
DROP POLICY IF EXISTS "Owners can manage own beacons" ON public.beacons;
CREATE POLICY "Owners can manage own beacons" ON public.beacons
  FOR ALL USING (owner_id = auth.uid());

-- SCANS: Anyone can create scans (anonymous scanning allowed)
DROP POLICY IF EXISTS "Anyone can create scans" ON public.beacon_scans;
CREATE POLICY "Anyone can create scans" ON public.beacon_scans
  FOR INSERT WITH CHECK (true);

-- SCANS: Users can view their own scans
DROP POLICY IF EXISTS "Users can view own scans" ON public.beacon_scans;
CREATE POLICY "Users can view own scans" ON public.beacon_scans
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

-- XP: Users can view their own XP
DROP POLICY IF EXISTS "Users can view own XP" ON public.xp_ledger;
CREATE POLICY "Users can view own XP" ON public.xp_ledger
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================================
-- SAMPLE BEACONS (London nightlife)
-- ============================================================================
INSERT INTO public.beacons (
  code, type, status, title, description,
  geo_lat, geo_lng, city_slug,
  xp_amount, max_scans_per_user_per_day,
  redirect_url
) VALUES 
  -- Vauxhall Tavern (iconic LGBTQ+ venue)
  (
    'vauxhall-tavern',
    'checkin',
    'active',
    'Vauxhall Tavern',
    'Check in at London''s most iconic queer pub',
    51.4867,
    -0.1235,
    'london',
    100,
    1,
    '/venues/vauxhall-tavern'
  ),
  -- Heaven Nightclub (Soho)
  (
    'heaven-soho',
    'event',
    'active',
    'Heaven @ Charing Cross',
    'Legendary LGBTQ+ club under the arches',
    51.5091,
    -0.1224,
    'london',
    150,
    1,
    '/venues/heaven'
  ),
  -- Royal Vauxhall Tavern
  (
    'rvt-main',
    'checkin',
    'active',
    'RVT Main Bar',
    'Grade II listed queer heritage site',
    51.4867,
    -0.1235,
    'london',
    100,
    1,
    '/venues/rvt'
  ),
  -- Fire Nightclub
  (
    'fire-vx',
    'event',
    'active',
    'Fire Nightclub Vauxhall',
    'XXL, Horse Meat Disco & more',
    51.4862,
    -0.1230,
    'london',
    150,
    1,
    '/venues/fire'
  ),
  -- Dalston Superstore
  (
    'dalston-store',
    'checkin',
    'active',
    'Dalston Superstore',
    'East London queer nightlife hub',
    51.5481,
    -0.0755,
    'london',
    100,
    1,
    '/venues/dalston-superstore'
  )
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- GRANTS
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.beacons TO authenticated;
GRANT SELECT, INSERT ON public.beacon_scans TO authenticated;
GRANT SELECT ON public.xp_ledger TO authenticated;

-- Allow anonymous users to view active beacons
GRANT SELECT ON public.beacons TO anon;
GRANT INSERT ON public.beacon_scans TO anon;

-- ============================================================================
-- DONE! 🔥
-- ============================================================================
-- You should now have:
--   ✅ 3 tables (beacons, beacon_scans, xp_ledger)
--   ✅ 5 sample London beacons
--   ✅ Public read access for active beacons
--   ✅ Anonymous scanning allowed
--   ✅ Full XP reward system
--
-- Go to Core → Beacons to see the 3D globe!
-- ============================================================================
