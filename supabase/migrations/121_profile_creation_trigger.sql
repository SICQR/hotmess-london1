-- ============================================================================
-- PROFILE CREATION TRIGGER
-- Auto-create profile when user signs up
-- ============================================================================

-- First, ensure profiles table exists with correct schema
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  city_id UUID REFERENCES cities(id),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  role TEXT DEFAULT 'user', -- 'user', 'host', 'seller', 'admin'
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'displayName', NEW.email),
    NOW()
  );
  
  -- Also create initial XP ledger entry (100 XP for signup)
  INSERT INTO public.xp_ledger (user_id, amount, reason, created_at)
  VALUES (
    NEW.id,
    100,
    'signup_bonus',
    NOW()
  );
  
  -- Update profile XP
  UPDATE public.profiles
  SET xp = 100
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users without profiles
INSERT INTO public.profiles (id, display_name, created_at)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'displayName', u.email),
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Profile creation trigger installed and backfilled';
END $$;
