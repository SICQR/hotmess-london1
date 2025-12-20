-- ============================================================================
-- HOTMESS LONDON - CLUB MODE SCHEMA (IDEMPOTENT VERSION)
-- Safe to run multiple times - handles existing policies gracefully
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE CLUB_EVENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS club_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  lineup TEXT[] DEFAULT '{}',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  doors_open TIMESTAMPTZ,
  timezone TEXT DEFAULT 'Europe/London',
  venue_name TEXT,
  address TEXT,
  city_slug TEXT,
  capacity INTEGER,
  capacity_ga INTEGER,
  capacity_vip INTEGER,
  price_ga INTEGER DEFAULT 0,
  price_vip INTEGER DEFAULT 0,
  guestlist JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'upcoming', 'live', 'ended', 'cancelled')),
  age_restriction INTEGER DEFAULT 18,
  gender_policy TEXT DEFAULT 'men_only' CHECK (gender_policy IN ('men_only', 'all_genders', 'women_only')),
  dress_code TEXT,
  event_beacon_id UUID,
  checkin_beacon_id UUID,
  tickets_sold INTEGER DEFAULT 0,
  tickets_sold_ga INTEGER DEFAULT 0,
  tickets_sold_vip INTEGER DEFAULT 0,
  revenue INTEGER DEFAULT 0,
  checked_in_count INTEGER DEFAULT 0,
  promoters JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(club_id, slug)
);

-- Indexes for club_events
CREATE INDEX IF NOT EXISTS idx_club_events_club_id ON club_events(club_id);
CREATE INDEX IF NOT EXISTS idx_club_events_status ON club_events(status);
CREATE INDEX IF NOT EXISTS idx_club_events_start_time ON club_events(start_time);
CREATE INDEX IF NOT EXISTS idx_club_events_slug ON club_events(slug);

-- Enable RLS
ALTER TABLE club_events ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policy (handles existing policy gracefully)
DROP POLICY IF EXISTS "Public read club events" ON club_events;
CREATE POLICY "Public read club events" ON club_events FOR SELECT USING (true);

-- ============================================================================
-- STEP 2: CREATE CLUB_TICKETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS club_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT DEFAULT 'club_primary' CHECK (type = 'club_primary'),
  event_id UUID NOT NULL REFERENCES club_events(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('ga', 'vip', 'guestlist')),
  price INTEGER NOT NULL DEFAULT 0,
  fee_buyer INTEGER DEFAULT 0,
  status TEXT DEFAULT 'purchased' CHECK (status IN ('purchased', 'checked_in', 'cancelled', 'refunded')),
  qr_code TEXT UNIQUE NOT NULL,
  access_beacon_id UUID,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID,
  checked_in_location JSONB,
  cancelled_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  promoter_id UUID,
  promoter_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for club_tickets
CREATE INDEX IF NOT EXISTS idx_club_tickets_event_id ON club_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_club_tickets_buyer_id ON club_tickets(buyer_id);
CREATE INDEX IF NOT EXISTS idx_club_tickets_qr_code ON club_tickets(qr_code);
CREATE INDEX IF NOT EXISTS idx_club_tickets_status ON club_tickets(status);

-- Enable RLS
ALTER TABLE club_tickets ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policy
DROP POLICY IF EXISTS "Public read club tickets" ON club_tickets;
CREATE POLICY "Public read club tickets" ON club_tickets FOR SELECT USING (true);

-- ============================================================================
-- STEP 3: ADD MISSING COLUMNS TO EXISTING CLUBS TABLE
-- ============================================================================

DO $$ 
BEGIN
  -- Core management fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'owner_id') THEN
    ALTER TABLE clubs ADD COLUMN owner_id UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'door_staff') THEN
    ALTER TABLE clubs ADD COLUMN door_staff UUID[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'managers') THEN
    ALTER TABLE clubs ADD COLUMN managers UUID[] DEFAULT '{}';
  END IF;
  
  -- Images (logo_url, banner_url)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'logo_url') THEN
    ALTER TABLE clubs ADD COLUMN logo_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'banner_url') THEN
    ALTER TABLE clubs ADD COLUMN banner_url TEXT;
  END IF;
  
  -- Stripe integration
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'stripe_account_id') THEN
    ALTER TABLE clubs ADD COLUMN stripe_account_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'onboarding_complete') THEN
    ALTER TABLE clubs ADD COLUMN onboarding_complete BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'payouts_enabled') THEN
    ALTER TABLE clubs ADD COLUMN payouts_enabled BOOLEAN DEFAULT false;
  END IF;
  
  -- Subscription
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'subscription_tier') THEN
    ALTER TABLE clubs ADD COLUMN subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'pro', 'enterprise'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'subscription_started_at') THEN
    ALTER TABLE clubs ADD COLUMN subscription_started_at TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'subscription_ends_at') THEN
    ALTER TABLE clubs ADD COLUMN subscription_ends_at TIMESTAMPTZ;
  END IF;
  
  -- Status and verification
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'status') THEN
    ALTER TABLE clubs ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'verified') THEN
    ALTER TABLE clubs ADD COLUMN verified BOOLEAN DEFAULT false;
  END IF;
  
  -- Stats
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'total_events') THEN
    ALTER TABLE clubs ADD COLUMN total_events INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'total_tickets_sold') THEN
    ALTER TABLE clubs ADD COLUMN total_tickets_sold INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'total_revenue') THEN
    ALTER TABLE clubs ADD COLUMN total_revenue INTEGER DEFAULT 0;
  END IF;
  
  -- Defaults
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'default_capacity') THEN
    ALTER TABLE clubs ADD COLUMN default_capacity INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'default_age_restriction') THEN
    ALTER TABLE clubs ADD COLUMN default_age_restriction INTEGER DEFAULT 18;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'gender_policy') THEN
    ALTER TABLE clubs ADD COLUMN gender_policy TEXT DEFAULT 'men_only' CHECK (gender_policy IN ('men_only', 'all_genders', 'women_only'));
  END IF;
END $$;

-- ============================================================================
-- STEP 4: ADD INDEX ON CLUBS.SLUG
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_clubs_slug ON clubs(slug);

-- ============================================================================
-- STEP 5: CREATE HELPER FUNCTIONS FOR TICKET OPERATIONS
-- ============================================================================

-- Increment event ticket sales
CREATE OR REPLACE FUNCTION increment_event_ticket_sales(
  event_id UUID,
  tier TEXT,
  amount INTEGER
) RETURNS void AS $$
BEGIN
  UPDATE club_events
  SET 
    tickets_sold = tickets_sold + 1,
    tickets_sold_ga = CASE WHEN tier = 'ga' THEN tickets_sold_ga + 1 ELSE tickets_sold_ga END,
    tickets_sold_vip = CASE WHEN tier = 'vip' THEN tickets_sold_vip + 1 ELSE tickets_sold_vip END,
    revenue = revenue + amount,
    updated_at = now()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment event check-in count
CREATE OR REPLACE FUNCTION increment_event_checkin_count(
  event_id UUID
) RETURNS void AS $$
BEGIN
  UPDATE club_events
  SET 
    checked_in_count = checked_in_count + 1,
    updated_at = now()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 6: SEED DEFAULT DEMO CLUB
-- ============================================================================

INSERT INTO clubs (
  name,
  slug,
  description,
  city_slug,
  lat,
  lng,
  status,
  verified,
  onboarding_complete,
  default_capacity,
  default_age_restriction,
  gender_policy
) VALUES (
  'HOTMESS Demo Venue',
  'default',
  'Demo venue for testing Club Mode features',
  'london',
  51.5074,
  -0.1278,
  'active',
  true,
  true,
  500,
  18,
  'men_only'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  verified = EXCLUDED.verified,
  onboarding_complete = EXCLUDED.onboarding_complete;

-- ============================================================================
-- VERIFICATION QUERIES (uncomment to run)
-- ============================================================================

-- Verify tables exist
SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clubs', 'club_events', 'club_tickets')
ORDER BY table_name;

-- Verify demo club was seeded
SELECT 'Demo club:' as status;
SELECT id, name, slug, status, verified FROM clubs WHERE slug = 'default';

-- Verify columns added to clubs
SELECT 'Clubs columns:' as status;
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'clubs' 
AND column_name IN ('owner_id', 'door_staff', 'managers', 'logo_url', 'stripe_account_id')
ORDER BY column_name;

-- ============================================================================
-- SUCCESS!
-- ============================================================================
SELECT '✅ Club Mode migration complete!' as status;
