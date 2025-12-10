-- ============================================================================
-- RIGHT NOW SCHEMA POLISH
-- Adds missing columns and indexes for production readiness
-- ============================================================================
-- Version: 301
-- Date: 2024-12-09
-- Description: Defensive column additions and index creation with PostGIS guards
-- ============================================================================

-- Add missing columns on right_now_posts (guard geography by PostGIS presence)
DO $$
DECLARE
  has_postgis boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'postgis'
  ) INTO has_postgis;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'right_now_posts' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE public.right_now_posts
      ADD COLUMN deleted_at TIMESTAMPTZ;
    
    COMMENT ON COLUMN public.right_now_posts.deleted_at IS 'Soft delete timestamp for moderation';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'right_now_posts' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE public.right_now_posts
      ADD COLUMN expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 hour';
    
    COMMENT ON COLUMN public.right_now_posts.expires_at IS 'When this temporal post expires and should be hidden';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'right_now_posts' AND column_name = 'heat_bin_id'
  ) THEN
    ALTER TABLE public.right_now_posts
      ADD COLUMN heat_bin_id TEXT;
    
    COMMENT ON COLUMN public.right_now_posts.heat_bin_id IS 'Geohash or H3 cell ID for spatial indexing';
  END IF;

  IF has_postgis AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'right_now_posts' AND column_name = 'location'
  ) THEN
    ALTER TABLE public.right_now_posts
      ADD COLUMN location GEOGRAPHY(POINT, 4326);
    
    COMMENT ON COLUMN public.right_now_posts.location IS 'PostGIS geography point for spatial queries';
  END IF;
END$$;

-- Backfill location if lat/lng exist and PostGIS is available
DO $$
DECLARE
  has_postgis boolean;
  rows_updated integer;
BEGIN
  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') INTO has_postgis;

  IF has_postgis AND
     EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='right_now_posts' AND column_name='lat') AND
     EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='right_now_posts' AND column_name='lng')
  THEN
    UPDATE public.right_now_posts
    SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    WHERE location IS NULL AND lat IS NOT NULL AND lng IS NOT NULL;
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    RAISE NOTICE 'Backfilled location for % posts', rows_updated;
  END IF;
END$$;

-- Create indexes defensively (fall back if predicate columns missing)
DO $$
DECLARE
  has_postgis boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') INTO has_postgis;

  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
             WHERE n.nspname='public' AND c.relname='right_now_posts' AND c.relkind='r') THEN

    -- User ID index (always useful)
    BEGIN
      CREATE INDEX IF NOT EXISTS idx_right_now_posts_user_id ON public.right_now_posts(user_id);
      RAISE NOTICE 'Created index: idx_right_now_posts_user_id';
    EXCEPTION WHEN undefined_column THEN
      RAISE NOTICE 'Skipped idx_right_now_posts_user_id - column missing';
    END;

    -- PostGIS location index (if available)
    IF has_postgis THEN
      BEGIN
        CREATE INDEX IF NOT EXISTS idx_right_now_posts_location ON public.right_now_posts USING GIST(location);
        RAISE NOTICE 'Created index: idx_right_now_posts_location';
      EXCEPTION WHEN undefined_column THEN
        RAISE NOTICE 'Skipped idx_right_now_posts_location - column missing';
      END;
    END IF;

    -- Heat bin index (with deleted_at predicate if available)
    BEGIN
      CREATE INDEX IF NOT EXISTS idx_right_now_posts_heat_bin ON public.right_now_posts(heat_bin_id)
        WHERE deleted_at IS NULL;
      RAISE NOTICE 'Created index: idx_right_now_posts_heat_bin (with predicate)';
    EXCEPTION WHEN undefined_column THEN
      BEGIN
        CREATE INDEX IF NOT EXISTS idx_right_now_posts_heat_bin_np ON public.right_now_posts(heat_bin_id);
        RAISE NOTICE 'Created index: idx_right_now_posts_heat_bin_np (no predicate)';
      EXCEPTION WHEN undefined_column THEN
        RAISE NOTICE 'Skipped heat_bin index - column missing';
      END;
    END;

    -- Expires at index (for temporal cleanup queries)
    BEGIN
      CREATE INDEX IF NOT EXISTS idx_right_now_posts_expires_at ON public.right_now_posts(expires_at)
        WHERE deleted_at IS NULL;
      RAISE NOTICE 'Created index: idx_right_now_posts_expires_at (with predicate)';
    EXCEPTION WHEN undefined_column THEN
      BEGIN
        CREATE INDEX IF NOT EXISTS idx_right_now_posts_expires_at_np ON public.right_now_posts(expires_at);
        RAISE NOTICE 'Created index: idx_right_now_posts_expires_at_np (no predicate)';
      EXCEPTION WHEN undefined_column THEN
        RAISE NOTICE 'Skipped expires_at index - column missing';
      END;
    END;

    -- Created at index (for feed queries sorted by recency)
    BEGIN
      CREATE INDEX IF NOT EXISTS idx_right_now_posts_created_at ON public.right_now_posts(created_at DESC)
        WHERE deleted_at IS NULL;
      RAISE NOTICE 'Created index: idx_right_now_posts_created_at (with predicate)';
    EXCEPTION WHEN undefined_column THEN
      BEGIN
        CREATE INDEX IF NOT EXISTS idx_right_now_posts_created_at_np ON public.right_now_posts(created_at DESC);
        RAISE NOTICE 'Created index: idx_right_now_posts_created_at_np (no predicate)';
      EXCEPTION WHEN undefined_column THEN
        RAISE NOTICE 'Skipped created_at index - column missing';
      END;
    END;

    -- Beacon index (for filtering beacon-only posts)
    BEGIN
      CREATE INDEX IF NOT EXISTS idx_right_now_posts_is_beacon ON public.right_now_posts(is_beacon)
        WHERE is_beacon = TRUE AND deleted_at IS NULL;
      RAISE NOTICE 'Created index: idx_right_now_posts_is_beacon';
    EXCEPTION WHEN undefined_column THEN
      RAISE NOTICE 'Skipped is_beacon index - column missing';
    END;

    -- Composite index for heat bin + user queries
    BEGIN
      CREATE INDEX IF NOT EXISTS idx_right_now_posts_heatbin_user ON public.right_now_posts(heat_bin_id, user_id);
      RAISE NOTICE 'Created index: idx_right_now_posts_heatbin_user';
    EXCEPTION WHEN undefined_column THEN
      RAISE NOTICE 'Skipped heatbin_user index - column missing';
    END;

  END IF;
END$$;

-- Add helpful table comment
COMMENT ON TABLE public.right_now_posts IS 'Temporal, location-based posts for the RIGHT NOW live feed system. Posts expire after a configurable duration.';

-- Create function to auto-set expires_at on insert if not provided
CREATE OR REPLACE FUNCTION set_right_now_expires_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expires_at IS NULL THEN
    -- Default to 1 hour from now
    NEW.expires_at := NOW() + INTERVAL '1 hour';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_set_right_now_expires_at'
  ) THEN
    CREATE TRIGGER trigger_set_right_now_expires_at
      BEFORE INSERT ON public.right_now_posts
      FOR EACH ROW
      EXECUTE FUNCTION set_right_now_expires_at();
    
    RAISE NOTICE 'Created trigger: trigger_set_right_now_expires_at';
  END IF;
END$$;

-- Create function to auto-update location from lat/lng (if PostGIS available)
CREATE OR REPLACE FUNCTION sync_right_now_location()
RETURNS TRIGGER AS $$
DECLARE
  has_postgis boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') INTO has_postgis;
  
  IF has_postgis AND NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync location (if it doesn't exist)
DO $$
DECLARE
  has_postgis boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') INTO has_postgis;
  
  IF has_postgis AND NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_sync_right_now_location'
  ) THEN
    CREATE TRIGGER trigger_sync_right_now_location
      BEFORE INSERT OR UPDATE OF lat, lng ON public.right_now_posts
      FOR EACH ROW
      EXECUTE FUNCTION sync_right_now_location();
    
    RAISE NOTICE 'Created trigger: trigger_sync_right_now_location';
  END IF;
END$$;

-- Grant permissions (adjust role names as needed)
DO $$
BEGIN
  -- Grant to authenticated users
  GRANT SELECT, INSERT ON public.right_now_posts TO authenticated;
  GRANT UPDATE (deleted_at) ON public.right_now_posts TO authenticated; -- For soft deletes
  
  RAISE NOTICE 'Granted permissions on right_now_posts';
EXCEPTION WHEN undefined_object THEN
  RAISE NOTICE 'Skipped grant - authenticated role does not exist';
END$$;

-- Final report
DO $$
DECLARE
  has_postgis boolean;
  col_count integer;
  idx_count integer;
BEGIN
  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') INTO has_postgis;
  
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'right_now_posts';
  
  SELECT COUNT(*) INTO idx_count
  FROM pg_indexes
  WHERE schemaname = 'public' AND tablename = 'right_now_posts';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RIGHT NOW SCHEMA POLISH COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PostGIS available: %', has_postgis;
  RAISE NOTICE 'Total columns: %', col_count;
  RAISE NOTICE 'Total indexes: %', idx_count;
  RAISE NOTICE '========================================';
END$$;
