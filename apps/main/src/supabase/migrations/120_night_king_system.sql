-- ============================================================================
-- HOTMESS OS — NIGHT KING TERRITORIAL GAME SYSTEM
-- ============================================================================
-- This migration adds the competitive territorial mechanics:
-- - King tracking per venue
-- - Royalties ledger for passive XP tax
-- - Coronation engine (weekly reset)
-- - War declaration system
-- - 2X XP multipliers during wars
-- ============================================================================

-- ============================================================================
-- 1. KINGSHIP COLUMNS ON BEACONS TABLE
-- ============================================================================
ALTER TABLE public.beacons 
ADD COLUMN IF NOT EXISTS king_user_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS king_since TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS weekly_scan_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bounty_multiplier NUMERIC DEFAULT 1.0;

CREATE INDEX IF NOT EXISTS idx_beacons_king_user_id ON public.beacons(king_user_id);
CREATE INDEX IF NOT EXISTS idx_beacons_weekly_scan_count ON public.beacons(weekly_scan_count DESC);

-- ============================================================================
-- 2. KING ROYALTIES LEDGER (Passive Income Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.king_royalties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  king_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.beacons(id) ON DELETE CASCADE,
  amount_xp INTEGER DEFAULT 1,
  scanned_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_king_royalties_king_id ON public.king_royalties(king_id);
CREATE INDEX IF NOT EXISTS idx_king_royalties_venue_id ON public.king_royalties(venue_id);
CREATE INDEX IF NOT EXISTS idx_king_royalties_created_at ON public.king_royalties(created_at DESC);

-- ============================================================================
-- 3. TERRITORIAL WARS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.beacon_wars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beacon_id UUID REFERENCES public.beacons(id) ON DELETE CASCADE,
  challenger_id UUID REFERENCES public.profiles(id),
  current_king_id UUID REFERENCES public.profiles(id),
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + interval '24 hours'),
  challenger_scans_start INTEGER DEFAULT 0,
  king_scans_start INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'challenger_won', 'king_defended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_beacon_wars_beacon_id ON public.beacon_wars(beacon_id);
CREATE INDEX IF NOT EXISTS idx_beacon_wars_status ON public.beacon_wars(status);
CREATE INDEX IF NOT EXISTS idx_beacon_wars_expires_at ON public.beacon_wars(expires_at);

-- ============================================================================
-- 4. CORONATION ENGINE (Weekly Reset Function)
-- ============================================================================
CREATE OR REPLACE FUNCTION crown_night_kings()
RETURNS void AS $$
BEGIN
  -- Update each beacon with the user who has the most scans in the last 7 days
  UPDATE public.beacons b
  SET 
    king_user_id = (
      SELECT user_id 
      FROM public.xp_ledger 
      WHERE source_id = b.id::text 
      AND reason = 'beacon_scan'
      AND created_at > NOW() - interval '7 days'
      GROUP BY user_id
      ORDER BY count(*) DESC, MAX(created_at) DESC
      LIMIT 1
    ),
    king_since = CASE 
      WHEN king_user_id != (
        SELECT user_id 
        FROM public.xp_ledger 
        WHERE source_id = b.id::text 
        AND reason = 'beacon_scan'
        AND created_at > NOW() - interval '7 days'
        GROUP BY user_id
        ORDER BY count(*) DESC, MAX(created_at) DESC
        LIMIT 1
      ) THEN NOW()
      ELSE king_since
    END,
    weekly_scan_count = (
      SELECT COALESCE(count(*), 0)
      FROM public.xp_ledger 
      WHERE source_id = b.id::text 
      AND reason = 'beacon_scan'
      AND created_at > NOW() - interval '7 days'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. PASSIVE XP TAX TRIGGER (The "Vassal" Flow)
-- ============================================================================
CREATE OR REPLACE FUNCTION award_king_tax()
RETURNS TRIGGER AS $$
DECLARE
  current_king_id UUID;
  beacon_id_uuid UUID;
BEGIN
  -- Convert source_id to UUID if it's a beacon scan
  BEGIN
    beacon_id_uuid := NEW.source_id::uuid;
  EXCEPTION WHEN OTHERS THEN
    RETURN NEW; -- Not a beacon scan, skip
  END;

  -- Find the King of the venue being scanned
  SELECT king_user_id INTO current_king_id 
  FROM public.beacons 
  WHERE id = beacon_id_uuid;

  -- If a King exists and it's not the person scanning
  IF current_king_id IS NOT NULL AND current_king_id != NEW.user_id THEN
    -- Insert royalty into the ledger
    INSERT INTO public.xp_ledger (user_id, amount, reason, source_id)
    VALUES (current_king_id, 1, 'king_tax_royalty', NEW.source_id);
    
    -- Log the specific event
    INSERT INTO public.king_royalties (king_id, venue_id, amount_xp, scanned_by)
    VALUES (current_king_id, beacon_id_uuid, 1, NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_on_scan_award_tax ON public.xp_ledger;
CREATE TRIGGER tr_on_scan_award_tax
AFTER INSERT ON public.xp_ledger
FOR EACH ROW 
WHEN (NEW.reason = 'beacon_scan')
EXECUTE FUNCTION award_king_tax();

-- ============================================================================
-- 6. WAR DECLARATION FUNCTION (Atomic XP Burn + Record Creation)
-- ============================================================================
CREATE OR REPLACE FUNCTION declare_beacon_war(p_beacon_id UUID, p_challenger_id UUID)
RETURNS json AS $$
DECLARE
  v_king_id UUID;
  v_current_xp INTEGER;
  v_war_id UUID;
  v_cost INTEGER := 500; -- Cost to start a war
  v_challenger_scans INTEGER;
  v_king_scans INTEGER;
BEGIN
  -- 1. Get the current King
  SELECT king_user_id INTO v_king_id FROM public.beacons WHERE id = p_beacon_id;
  
  IF v_king_id IS NULL THEN
    RAISE EXCEPTION 'This venue has no King to challenge.';
  END IF;

  IF v_king_id = p_challenger_id THEN
    RAISE EXCEPTION 'You cannot declare war on yourself.';
  END IF;

  -- 2. Check for existing active war
  IF EXISTS (
    SELECT 1 FROM public.beacon_wars 
    WHERE beacon_id = p_beacon_id 
    AND status = 'active' 
    AND expires_at > NOW()
  ) THEN
    RAISE EXCEPTION 'A war is already active at this venue.';
  END IF;

  -- 3. Check Challenger XP (use xp field from profiles or calculate from xp_ledger)
  SELECT COALESCE(SUM(amount), 0) INTO v_current_xp 
  FROM public.xp_ledger 
  WHERE user_id = p_challenger_id;
  
  IF v_current_xp < v_cost THEN
    RAISE EXCEPTION 'Insufficient XP. You need 500 XP to declare war.';
  END IF;

  -- 4. Get current scan counts for both parties
  SELECT COALESCE(COUNT(*), 0) INTO v_challenger_scans
  FROM public.xp_ledger
  WHERE user_id = p_challenger_id 
  AND source_id = p_beacon_id::text 
  AND reason = 'beacon_scan'
  AND created_at > NOW() - interval '7 days';

  SELECT COALESCE(COUNT(*), 0) INTO v_king_scans
  FROM public.xp_ledger
  WHERE user_id = v_king_id 
  AND source_id = p_beacon_id::text 
  AND reason = 'beacon_scan'
  AND created_at > NOW() - interval '7 days';

  -- 5. Burn the XP
  INSERT INTO public.xp_ledger (user_id, amount, reason, source_id)
  VALUES (p_challenger_id, -v_cost, 'war_declaration', p_beacon_id::text);

  -- 6. Create the War Record
  INSERT INTO public.beacon_wars (
    beacon_id, 
    challenger_id, 
    current_king_id,
    challenger_scans_start,
    king_scans_start
  )
  VALUES (p_beacon_id, p_challenger_id, v_king_id, v_challenger_scans, v_king_scans)
  RETURNING id INTO v_war_id;

  -- 7. Set 2X XP multiplier for the venue
  UPDATE public.beacons 
  SET bounty_multiplier = 2.0 
  WHERE id = p_beacon_id;

  RETURN json_build_object(
    'success', true, 
    'war_id', v_war_id,
    'king_id', v_king_id,
    'challenger_id', p_challenger_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. WAR RESOLUTION FUNCTION (Called by cron or manual trigger)
-- ============================================================================
CREATE OR REPLACE FUNCTION resolve_expired_wars()
RETURNS void AS $$
DECLARE
  war_record RECORD;
  challenger_final INTEGER;
  king_final INTEGER;
  winner_id UUID;
BEGIN
  FOR war_record IN 
    SELECT * FROM public.beacon_wars 
    WHERE status = 'active' AND expires_at < NOW()
  LOOP
    -- Count scans during war period
    SELECT COALESCE(COUNT(*), 0) INTO challenger_final
    FROM public.xp_ledger
    WHERE user_id = war_record.challenger_id
    AND source_id = war_record.beacon_id::text
    AND reason = 'beacon_scan'
    AND created_at BETWEEN war_record.starts_at AND war_record.expires_at;

    SELECT COALESCE(COUNT(*), 0) INTO king_final
    FROM public.xp_ledger
    WHERE user_id = war_record.current_king_id
    AND source_id = war_record.beacon_id::text
    AND reason = 'beacon_scan'
    AND created_at BETWEEN war_record.starts_at AND war_record.expires_at;

    -- Determine winner
    IF challenger_final > king_final THEN
      winner_id := war_record.challenger_id;
      
      UPDATE public.beacon_wars 
      SET status = 'challenger_won' 
      WHERE id = war_record.id;
      
      -- Crown the new king
      UPDATE public.beacons 
      SET king_user_id = winner_id, king_since = NOW()
      WHERE id = war_record.beacon_id;
    ELSE
      winner_id := war_record.current_king_id;
      
      UPDATE public.beacon_wars 
      SET status = 'king_defended' 
      WHERE id = war_record.id;
    END IF;

    -- Reset multiplier to 1.0
    UPDATE public.beacons 
    SET bounty_multiplier = 1.0 
    WHERE id = war_record.beacon_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. NIGHT KING STATS VIEW (Dashboard Intelligence)
-- ============================================================================
CREATE OR REPLACE VIEW night_king_stats AS
SELECT 
  b.id as beacon_id,
  b.title as venue_name,
  b.king_user_id,
  b.king_since,
  b.weekly_scan_count,
  b.bounty_multiplier,
  COALESCE(SUM(r.amount_xp), 0) as total_royalties_earned,
  (SELECT count(*) FROM beacon_wars w WHERE w.beacon_id = b.id AND w.status = 'active' AND w.expires_at > NOW()) as active_threats
FROM beacons b
LEFT JOIN king_royalties r ON r.venue_id = b.id
WHERE b.king_user_id IS NOT NULL
GROUP BY b.id, b.title, b.king_user_id, b.king_since, b.weekly_scan_count, b.bounty_multiplier;

-- ============================================================================
-- 9. CRON JOBS (If pg_cron extension is enabled)
-- ============================================================================
-- Note: pg_cron needs to be enabled by Supabase support or self-hosted
-- Run weekly coronation every Monday at 4 AM
-- SELECT cron.schedule(
--   'weekly-coronation',
--   '0 4 * * 1', 
--   $$ SELECT crown_night_kings(); $$
-- );

-- Resolve expired wars every hour
-- SELECT cron.schedule(
--   'resolve-wars',
--   '0 * * * *',
--   $$ SELECT resolve_expired_wars(); $$
-- );

-- ============================================================================
-- 10. RLS POLICIES FOR NIGHT KING FEATURES
-- ============================================================================

-- Allow users to view all king royalties (for transparency)
ALTER TABLE public.king_royalties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view king royalties" ON public.king_royalties
  FOR SELECT USING (true);

-- Allow system to insert royalties (via trigger)
CREATE POLICY "System can insert royalties" ON public.king_royalties
  FOR INSERT WITH CHECK (true);

-- Beacon wars are publicly visible
ALTER TABLE public.beacon_wars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view beacon wars" ON public.beacon_wars
  FOR SELECT USING (true);

-- Only authenticated users can declare wars (via RPC)
CREATE POLICY "Authenticated users can create wars via RPC" ON public.beacon_wars
  FOR INSERT WITH CHECK (auth.uid() = challenger_id);

COMMENT ON TABLE public.king_royalties IS 'Tracks passive XP earned by Night Kings when vassals scan their venues';
COMMENT ON TABLE public.beacon_wars IS 'Tracks territorial wars between challengers and current kings';
COMMENT ON FUNCTION crown_night_kings() IS 'Weekly cron job to crown new Night Kings based on scan activity';
COMMENT ON FUNCTION declare_beacon_war(UUID, UUID) IS 'Atomic function to start a territorial war (burns 500 XP)';
COMMENT ON FUNCTION resolve_expired_wars() IS 'Resolves finished wars and crowns winners';
