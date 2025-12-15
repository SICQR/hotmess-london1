-- ============================================================================
-- RIGHT NOW TEST SEED DATA
-- Creates sample posts for testing and validation
-- ============================================================================
-- Version: 302
-- Date: 2024-12-09
-- Description: Seeds test posts for each mode with various configurations
-- ============================================================================

-- Clean up any existing test data
DELETE FROM right_now_posts WHERE headline LIKE '%[TEST]%';

-- Create a test user if needed (for non-auth testing)
-- Note: In production, use real authenticated users
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Try to find an existing test user
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'test@hotmesslondon.com'
  LIMIT 1;

  -- If no test user exists and we're in a test environment, log a note
  IF test_user_id IS NULL THEN
    RAISE NOTICE 'No test user found. Skipping seed data.';
    RAISE NOTICE 'To seed data, create a user via Supabase Auth first.';
    RAISE NOTICE 'Or use the Edge Function: POST /right-now-test/create';
  ELSE
    RAISE NOTICE 'Found test user: %', test_user_id;
    
    -- Seed test posts for all modes
    INSERT INTO right_now_posts (
      user_id,
      mode,
      headline,
      body,
      city,
      country,
      lat,
      lng,
      geo_bin,
      heat_bin_id,
      membership_tier,
      xp_band,
      safety_flags,
      near_party,
      sponsored,
      is_beacon,
      expires_at,
      score
    ) VALUES
    -- HOOKUP mode
    (
      test_user_id,
      'hookup',
      '[TEST] Vauxhall. Now. Top only.',
      'Eagle open til 3. Looking for muscle.',
      'London',
      'UK',
      51.4864,
      -0.1226,
      '9c2838b',
      '9c2838b',
      'GOLD',
      'INSIDER',
      ARRAY['crowd_verified'],
      true,
      false,
      true,
      NOW() + INTERVAL '1 hour',
      95
    ),
    
    -- CROWD mode
    (
      test_user_id,
      'crowd',
      '[TEST] Dalston Superstore is PACKED',
      'Queue down the street. Main floor at capacity. Roof terrace open.',
      'London',
      'UK',
      51.5484,
      -0.0755,
      '9c283d2',
      '9c283d2',
      'SILVER',
      'REGULAR',
      ARRAY['crowd_verified', 'verified_host'],
      true,
      false,
      true,
      NOW() + INTERVAL '2 hours',
      88
    ),
    
    -- DROP mode
    (
      test_user_id,
      'drop',
      '[TEST] Secret warehouse party location',
      'DM for address. Bring cash. IYKYK.',
      'London',
      'UK',
      51.5309,
      -0.1240,
      '9c283a4',
      '9c283a4',
      'GOLD',
      'INSIDER',
      ARRAY[]::text[],
      false,
      false,
      true,
      NOW() + INTERVAL '4 hours',
      92
    ),
    
    -- CARE mode
    (
      test_user_id,
      'care',
      '[TEST] Safe space at Heaven',
      'Chill room upstairs. Water, charging, quiet.',
      'London',
      'UK',
      51.5074,
      -0.1196,
      '9c2838c',
      '9c2838c',
      'BRONZE',
      'VISITOR',
      ARRAY['verified_host'],
      true,
      false,
      true,
      NOW() + INTERVAL '3 hours',
      100
    ),
    
    -- Additional test posts
    (
      test_user_id,
      'hookup',
      '[TEST] Shoreditch. Outdoor cruising.',
      NULL,
      'London',
      'UK',
      51.5265,
      -0.0810,
      '9c283d8',
      '9c283d8',
      'SILVER',
      'REGULAR',
      ARRAY[]::text[],
      false,
      false,
      true,
      NOW() + INTERVAL '30 minutes',
      78
    ),
    
    (
      test_user_id,
      'crowd',
      '[TEST] The Glory completely dead',
      'Maybe 10 people here. Save your cab fare.',
      'London',
      'UK',
      51.4622,
      -0.1175,
      '9c2839f',
      '9c2839f',
      'BRONZE',
      'VISITOR',
      ARRAY['crowd_verified'],
      false,
      false,
      true,
      NOW() + INTERVAL '1 hour',
      45
    ),
    
    (
      test_user_id,
      'drop',
      '[TEST] Last-minute tickets available',
      'Horse Meat Disco tonight. 2 tickets. Face value.',
      'London',
      'UK',
      51.5074,
      -0.1278,
      '9c2838b',
      '9c2838b',
      'GOLD',
      'INSIDER',
      ARRAY['verified_host'],
      false,
      true,
      false,
      NOW() + INTERVAL '6 hours',
      85
    ),
    
    (
      test_user_id,
      'care',
      '[TEST] Walking home from Soho',
      'Anyone heading east? Can share cab from Old Compton.',
      'London',
      'UK',
      51.5136,
      -0.1321,
      '9c2838e',
      '9c2838e',
      'SILVER',
      'REGULAR',
      ARRAY[]::text[],
      false,
      false,
      false,
      NOW() + INTERVAL '45 minutes',
      90
    );
    
    RAISE NOTICE 'Seeded 8 test posts across all modes';
  END IF;
END$$;

-- Create a helper function to generate test posts programmatically
CREATE OR REPLACE FUNCTION generate_test_post(
  p_user_id uuid,
  p_mode text DEFAULT 'hookup',
  p_city text DEFAULT 'London',
  p_lat float DEFAULT 51.5074,
  p_lng float DEFAULT -0.1278
)
RETURNS uuid AS $$
DECLARE
  new_post_id uuid;
  headlines text[] := ARRAY[
    '[TEST] Looking now',
    '[TEST] Anyone around?',
    '[TEST] Last minute plans',
    '[TEST] Who''s out tonight?',
    '[TEST] Meet me here'
  ];
  random_headline text;
BEGIN
  -- Pick random headline
  random_headline := headlines[1 + floor(random() * array_length(headlines, 1))::int];
  
  -- Insert post
  INSERT INTO right_now_posts (
    user_id,
    mode,
    headline,
    city,
    lat,
    lng,
    geo_bin,
    heat_bin_id,
    membership_tier,
    xp_band,
    safety_flags,
    near_party,
    sponsored,
    is_beacon,
    expires_at,
    score
  ) VALUES (
    p_user_id,
    p_mode,
    random_headline,
    p_city,
    p_lat,
    p_lng,
    '9c2838b',
    '9c2838b',
    'SILVER',
    'REGULAR',
    ARRAY[]::text[],
    false,
    false,
    true,
    NOW() + INTERVAL '1 hour',
    50 + floor(random() * 50)::int
  )
  RETURNING id INTO new_post_id;
  
  RETURN new_post_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_test_post IS 'Generate a random test post for a given user and location';

-- Create a helper function to clean up test posts
CREATE OR REPLACE FUNCTION cleanup_test_posts()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM right_now_posts
  WHERE headline LIKE '%[TEST]%'
     OR created_at < NOW() - INTERVAL '7 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_test_posts IS 'Remove all test posts and posts older than 7 days';

-- Verification query
DO $$
DECLARE
  post_count integer;
BEGIN
  SELECT COUNT(*) INTO post_count
  FROM right_now_posts
  WHERE headline LIKE '%[TEST]%';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RIGHT NOW TEST SEED COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Test posts created: %', post_count;
  RAISE NOTICE 'Helper functions:';
  RAISE NOTICE '  - generate_test_post(user_id, mode, city, lat, lng)';
  RAISE NOTICE '  - cleanup_test_posts()';
  RAISE NOTICE '========================================';
END$$;

-- Example usage:
-- SELECT generate_test_post('user-uuid-here', 'hookup', 'London', 51.5074, -0.1278);
-- SELECT cleanup_test_posts();
