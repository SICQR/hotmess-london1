-- HOTMESS LONDON Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  collection TEXT NOT NULL, -- 'raw', 'hung', 'high', 'super'
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify products"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- CART ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one row per user + product + size combination
  UNIQUE(user_id, product_id, size)
);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CONSENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'community_posting', 'marketing', 'analytics', etc.
  granted BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  
  -- Unique constraint: one row per user + consent_type
  UNIQUE(user_id, consent_type)
);

-- Enable RLS
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own consents"
  ON consents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consents"
  ON consents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consents"
  ON consents FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA (Sample Products)
-- ============================================

-- Insert sample products for each collection
INSERT INTO products (shopify_id, title, collection, price, image_url, description, sizes) VALUES
  ('raw-001', 'RAW TANK', 'raw', 35.00, 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800', 'Classic black tank with RAW logo. Breathable mesh fabric.', ARRAY['S', 'M', 'L', 'XL']),
  ('raw-002', 'RAW JOGGERS', 'raw', 55.00, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800', 'Tapered fit joggers with side stripe. Sweat-wicking material.', ARRAY['S', 'M', 'L', 'XL']),
  ('raw-003', 'RAW HARNESS', 'raw', 45.00, 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', 'Adjustable leather harness. Hardware in matte black.', ARRAY['S', 'M', 'L', 'XL']),
  
  ('hung-001', 'HUNG SHORTS', 'hung', 40.00, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800', 'Loose athletic shorts with mesh liner. Quick-dry fabric.', ARRAY['S', 'M', 'L', 'XL']),
  ('hung-002', 'HUNG HOODIE', 'hung', 65.00, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', 'Oversized fit hoodie with embroidered logo. Heavyweight cotton.', ARRAY['S', 'M', 'L', 'XL']),
  ('hung-003', 'HUNG CAP', 'hung', 28.00, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', 'Adjustable snapback cap. Embroidered front logo.', ARRAY['ONE SIZE']),
  
  ('high-001', 'HIGH JOCK', 'high', 32.00, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800', 'Performance jockstrap. Moisture-wicking waistband.', ARRAY['S', 'M', 'L', 'XL']),
  ('high-002', 'HIGH SINGLET', 'high', 38.00, 'https://images.unsplash.com/photo-1622445275576-721325f6dbd6?w=800', 'Mesh singlet with deep side cuts. Reflective logo.', ARRAY['S', 'M', 'L', 'XL']),
  ('high-003', 'HIGH SOCKS', 'high', 18.00, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800', 'Compression crew socks. Arch support.', ARRAY['S', 'M', 'L', 'XL']),
  
  ('super-001', 'SUPER JACKET', 'super', 120.00, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'Technical bomber jacket. Water-resistant shell. Limited edition.', ARRAY['S', 'M', 'L', 'XL']),
  ('super-002', 'SUPER PANTS', 'super', 85.00, 'https://images.unsplash.com/photo-1624378440070-7b44c15bc50a?w=800', 'Cargo pants with multiple pockets. Reinforced knees.', ARRAY['S', 'M', 'L', 'XL']),
  ('super-003', 'SUPER BACKPACK', 'super', 95.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'Water-resistant backpack. Laptop sleeve + multiple compartments.', ARRAY['ONE SIZE'])
ON CONFLICT (shopify_id) DO NOTHING;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consents_user_id ON consents(user_id);

-- ============================================
-- COMPLETED
-- ============================================

-- Run this script in Supabase SQL Editor
-- Then verify tables exist with: SELECT * FROM products LIMIT 5;
