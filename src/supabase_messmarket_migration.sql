-- HOTMESS LONDON — MessMarket Schema Extension
-- Run this AFTER the main migration (supabase_migration.sql)

-- ============================================
-- MESSMARKET_PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messmarket_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_pence INTEGER NOT NULL CHECK (price_pence >= 0),
  images TEXT[] NOT NULL DEFAULT '{}',
  stock_count INTEGER NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  category TEXT DEFAULT 'general', -- 'general', 'adult', 'intimate', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messmarket_products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "MessMarket products are viewable by everyone"
  ON messmarket_products FOR SELECT
  USING (active = true);

CREATE POLICY "Only admins can create MessMarket products"
  ON messmarket_products FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update MessMarket products"
  ON messmarket_products FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete MessMarket products"
  ON messmarket_products FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- MESSMARKET_NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messmarket_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES messmarket_products(id) ON DELETE CASCADE,
  consent_given BOOLEAN NOT NULL DEFAULT true,
  ip_address TEXT,
  user_agent TEXT,
  notified BOOLEAN NOT NULL DEFAULT false,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One notification per email per product
  UNIQUE(email, product_id)
);

-- Enable RLS
ALTER TABLE messmarket_notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own notification requests"
  ON messmarket_notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view notifications"
  ON messmarket_notifications FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update notifications"
  ON messmarket_notifications FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- VENDOR_APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vendor_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  portfolio_url TEXT,
  instagram_handle TEXT,
  referral_source TEXT, -- 'messmarket', 'shop', 'community', etc.
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can submit their own vendor applications"
  ON vendor_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own applications"
  ON vendor_applications FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update vendor applications"
  ON vendor_applications FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at on messmarket_products
CREATE TRIGGER update_messmarket_products_updated_at
  BEFORE UPDATE ON messmarket_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at on vendor_applications
CREATE TRIGGER update_vendor_applications_updated_at
  BEFORE UPDATE ON vendor_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_messmarket_products_active ON messmarket_products(active);
CREATE INDEX IF NOT EXISTS idx_messmarket_products_creator_id ON messmarket_products(creator_id);
CREATE INDEX IF NOT EXISTS idx_messmarket_products_slug ON messmarket_products(slug);
CREATE INDEX IF NOT EXISTS idx_messmarket_notifications_product_id ON messmarket_notifications(product_id);
CREATE INDEX IF NOT EXISTS idx_messmarket_notifications_email ON messmarket_notifications(email);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_user_id ON vendor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status ON vendor_applications(status);

-- ============================================
-- SEED DATA (Sample MessMarket Products)
-- ============================================

INSERT INTO messmarket_products (slug, title, description, price_pence, images, stock_count, category, active) VALUES
  (
    'neon-harness-limited',
    'NEON HARNESS (Limited Run)',
    'Hand-assembled neon harness with reflective straps. Only 50 made. UV-reactive hardware.',
    6500,
    ARRAY[
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800'
    ],
    12,
    'general',
    true
  ),
  (
    'sweat-print-tee',
    'SWEAT PRINT TEE (Artist Collab)',
    'Limited collaboration with @hot_pixels. Screen-printed on heavyweight cotton. Unique sweat-reactive ink.',
    3500,
    ARRAY[
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800',
      'https://images.unsplash.com/photo-1622445275576-721325f6dbd6?w=800'
    ],
    25,
    'general',
    true
  ),
  (
    'chrome-choker-chain',
    'CHROME CHOKER CHAIN',
    'Chunky chrome chain with magnetic clasp. Adjustable length 12-16". Heavy metal construction.',
    4500,
    ARRAY[
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
    ],
    8,
    'general',
    true
  ),
  (
    'mesh-jock-glow',
    'MESH JOCK (Glow Edition)',
    'Semi-transparent mesh jockstrap with glow-in-the-dark waistband. Performance fabric.',
    3200,
    ARRAY[
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800'
    ],
    15,
    'intimate',
    true
  ),
  (
    'protest-tank-pride',
    'PROTEST TANK (Pride Edition)',
    'Statement tank with bold typography. 100% proceeds to LGBTQ+ youth organizations. Limited to 100.',
    2800,
    ARRAY[
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800'
    ],
    0, -- SOLD OUT
    'general',
    true
  ),
  (
    'leather-wrist-cuff',
    'LEATHER WRIST CUFF (Handmade)',
    'Hand-stitched leather cuff with metal hardware. Each one unique. Made to order.',
    5500,
    ARRAY[
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'
    ],
    5,
    'general',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMPLETED
-- ============================================

-- Run this in Supabase SQL Editor AFTER running supabase_migration.sql
-- Verify with: SELECT * FROM messmarket_products;
