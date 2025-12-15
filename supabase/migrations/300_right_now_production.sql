-- RIGHT NOW PRODUCTION SCHEMA
-- Minimal, focused, wired to heat/XP/membership

-- 1) RIGHT NOW posts table
CREATE TABLE IF NOT EXISTS public.right_now_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode          TEXT NOT NULL CHECK (mode IN ('hookup','crowd','drop','ticket','radio','care')),
  headline      TEXT NOT NULL,
  body          TEXT,
  city          TEXT NOT NULL,
  country       TEXT,
  geo_bin       TEXT NOT NULL, -- e.g. "51.5000_-0.1200_250m"
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  membership_tier TEXT NOT NULL DEFAULT 'free', -- free|hnh|vendor|sponsor|icon
  xp_band       TEXT NOT NULL DEFAULT 'fresh',  -- fresh|regular|sinner|icon
  safety_flags  TEXT[] NOT NULL DEFAULT '{}',   -- e.g. { 'verified_host', 'high_risk', 'care_suggested' }
  near_party    BOOLEAN NOT NULL DEFAULT false,
  sponsored     BOOLEAN NOT NULL DEFAULT false,
  shadow_banned BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL,
  deleted_at    TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_right_now_posts_city_expires
  ON public.right_now_posts (city, expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_right_now_posts_geo_bin
  ON public.right_now_posts (geo_bin, expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_right_now_posts_user_created
  ON public.right_now_posts (user_id, created_at DESC);

-- Active posts only (feed query optimisation)
CREATE OR REPLACE VIEW public.right_now_active AS
SELECT *
FROM public.right_now_posts
WHERE deleted_at IS NULL
  AND expires_at > NOW()
  AND shadow_banned = false;

-- RLS policies
ALTER TABLE public.right_now_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read active RIGHT NOW posts
CREATE POLICY "Anyone can read active RIGHT NOW"
  ON public.right_now_posts
  FOR SELECT
  USING (expires_at > NOW() AND deleted_at IS NULL AND shadow_banned = false);

-- Owner can manage own posts
CREATE POLICY "Owner can manage own RIGHT NOW"
  ON public.right_now_posts
  FOR ALL
  USING (auth.uid() = user_id);

-- Only authed users can insert
CREATE POLICY "Only authed can insert RIGHT NOW"
  ON public.right_now_posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 2) Heat bin integration (if not already exists)
CREATE TABLE IF NOT EXISTS public.heat_bins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geo_bin       TEXT NOT NULL,
  city          TEXT,
  lat_bin       DOUBLE PRECISION,
  lng_bin       DOUBLE PRECISION,
  source        TEXT NOT NULL, -- 'right_now', 'party', 'scan', 'radio'
  heat_value    INTEGER NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_heat_bins_geo_source
  ON public.heat_bins (geo_bin, source, expires_at DESC);

-- Increment heat bin function
CREATE OR REPLACE FUNCTION public.increment_heat_bin(
  p_geo_bin TEXT,
  p_source TEXT,
  p_city TEXT DEFAULT NULL,
  p_lat DOUBLE PRECISION DEFAULT NULL,
  p_lng DOUBLE PRECISION DEFAULT NULL,
  p_heat_value INTEGER DEFAULT 10,
  p_ttl_hours INTEGER DEFAULT 2
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.heat_bins (
    geo_bin,
    city,
    lat_bin,
    lng_bin,
    source,
    heat_value,
    expires_at
  ) VALUES (
    p_geo_bin,
    p_city,
    p_lat,
    p_lng,
    p_source,
    p_heat_value,
    NOW() + (p_ttl_hours || ' hours')::INTERVAL
  );
END;
$$;

-- 3) Clean up expired posts (cron job)
CREATE OR REPLACE FUNCTION public.expire_right_now_posts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE public.right_now_posts
  SET deleted_at = NOW()
  WHERE deleted_at IS NULL
    AND expires_at <= NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

-- 4) Clean up expired heat bins (cron job)
CREATE OR REPLACE FUNCTION public.expire_heat_bins()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.heat_bins
  WHERE expires_at IS NOT NULL
    AND expires_at <= NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

-- 5) Profiles table adjustments (if not exists)
-- Add fields needed for RIGHT NOW gates
DO $$
BEGIN
  -- Add gender if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'gender'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN gender TEXT;
  END IF;

  -- Add dob if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'dob'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN dob DATE;
  END IF;

  -- Add home_city if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'home_city'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN home_city TEXT;
  END IF;

  -- Add country if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'country'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN country TEXT DEFAULT 'UK';
  END IF;

  -- Add xp_band if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'xp_band'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN xp_band TEXT DEFAULT 'fresh';
  END IF;

  -- Add membership_tier if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'membership_tier'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN membership_tier TEXT DEFAULT 'free';
  END IF;

  -- Add shadow_banned if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'shadow_banned'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN shadow_banned BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 6) Grant permissions
GRANT SELECT ON public.right_now_active TO authenticated, anon;
GRANT ALL ON public.right_now_posts TO authenticated;
GRANT SELECT ON public.heat_bins TO authenticated, anon;

-- Done
COMMENT ON TABLE public.right_now_posts IS 'RIGHT NOW temporal posts - hookup/crowd/care engine';
COMMENT ON VIEW public.right_now_active IS 'Active RIGHT NOW posts only (not expired/deleted/banned)';
COMMENT ON FUNCTION public.increment_heat_bin IS 'Adds heat to globe bins for RIGHT NOW/party/scan activity';
