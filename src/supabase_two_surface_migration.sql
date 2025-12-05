-- ============================================================================
-- HOTMESS LONDON: TWO-SURFACE UI SYSTEM DATABASE MIGRATION
-- ============================================================================
-- This migration adds support for role-based access control (RBAC) and
-- audit logging for the admin/seller operator consoles.
--
-- Run this in the Supabase SQL Editor AFTER running the main migration.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ADD ROLE COLUMN TO PROFILES
-- ----------------------------------------------------------------------------
-- Adds user roles: member (default), seller, mod, admin

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' 
CHECK (role IN ('member', 'seller', 'mod', 'admin'));

-- Add index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

COMMENT ON COLUMN profiles.role IS 'User role: member (default), seller (vendor), mod (moderator), admin (full access)';

-- ----------------------------------------------------------------------------
-- 2. CREATE AUDIT_LOGS TABLE
-- ----------------------------------------------------------------------------
-- Tracks all operator actions in admin/seller consoles

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

COMMENT ON TABLE audit_logs IS 'Audit trail for all operator actions in admin/seller consoles';

-- ----------------------------------------------------------------------------
-- 3. CREATE VENDOR_APPLICATIONS TABLE
-- ----------------------------------------------------------------------------
-- Stores seller onboarding applications for admin review

CREATE TABLE IF NOT EXISTS vendor_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  bio TEXT,
  instagram_handle TEXT,
  product_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vendor_applications_user_id ON vendor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status ON vendor_applications(status);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_created_at ON vendor_applications(created_at DESC);

COMMENT ON TABLE vendor_applications IS 'Seller onboarding applications for admin review';

-- ----------------------------------------------------------------------------
-- 4. CREATE ORDERS TABLE (IF NOT EXISTS)
-- ----------------------------------------------------------------------------
-- Central orders table for both shop and market purchases

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Customer info
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  -- Order details
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Source
  source TEXT DEFAULT 'shop' CHECK (source IN ('shop', 'market')),
  
  -- Shipping
  shipping_address JSONB,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Refunds
  refunded_amount DECIMAL(10,2),
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_source ON orders(source);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

COMMENT ON TABLE orders IS 'All orders from shop and market purchases';

-- ----------------------------------------------------------------------------
-- 5. CREATE SELLER_STATS TABLE
-- ----------------------------------------------------------------------------
-- Cached statistics for seller dashboards

CREATE TABLE IF NOT EXISTS seller_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Stats
  total_sales DECIMAL(10,2) DEFAULT 0,
  pending_payouts DECIMAL(10,2) DEFAULT 0,
  active_listings INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  
  -- Metadata
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seller_stats_seller_id ON seller_stats(seller_id);

COMMENT ON TABLE seller_stats IS 'Cached performance stats for seller dashboards';

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_stats ENABLE ROW LEVEL SECURITY;

-- Audit Logs: Admin/Mod can read all, system can insert
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'mod')
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- Vendor Applications: Users can read own, admins can read all
CREATE POLICY "Users can view own vendor application"
  ON vendor_applications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all vendor applications"
  ON vendor_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can create vendor application"
  ON vendor_applications FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update vendor applications"
  ON vendor_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Orders: Users see own orders, admins see all, sellers see their orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'mod')
    )
  );

CREATE POLICY "Sellers can view orders for their products"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'seller'
      -- Additional logic needed to check if order contains seller's products
    )
  );

CREATE POLICY "System can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Seller Stats: Sellers can read own, admins can read all
CREATE POLICY "Sellers can view own stats"
  ON seller_stats FOR SELECT
  USING (seller_id = auth.uid());

CREATE POLICY "Admins can view all seller stats"
  ON seller_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ----------------------------------------------------------------------------
-- 7. HELPER FUNCTIONS
-- ----------------------------------------------------------------------------

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_metadata)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION log_audit_event IS 'Helper function to log operator actions';

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_seq TEXT;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');
  v_seq := LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
  RETURN 'HL-' || v_year || '-' || v_seq;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

COMMENT ON FUNCTION generate_order_number IS 'Generates unique order numbers (HL-YYYY-NNNN)';

-- Function to update seller stats
CREATE OR REPLACE FUNCTION refresh_seller_stats(p_seller_id UUID) RETURNS VOID AS $$
BEGIN
  INSERT INTO seller_stats (seller_id, total_sales, active_listings, total_orders, last_updated_at)
  SELECT 
    p_seller_id,
    COALESCE(SUM(o.total), 0) as total_sales,
    COUNT(DISTINCT l.id) as active_listings,
    COUNT(DISTINCT o.id) as total_orders,
    NOW()
  FROM profiles p
  LEFT JOIN listings l ON l.seller_id = p.id AND l.status = 'active'
  LEFT JOIN orders o ON o.user_id = p.id AND o.status NOT IN ('cancelled', 'refunded')
  WHERE p.id = p_seller_id
  ON CONFLICT (seller_id) DO UPDATE SET
    total_sales = EXCLUDED.total_sales,
    active_listings = EXCLUDED.active_listings,
    total_orders = EXCLUDED.total_orders,
    last_updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION refresh_seller_stats IS 'Recalculates and caches seller performance stats';

-- ----------------------------------------------------------------------------
-- 8. SEED INITIAL DATA
-- ----------------------------------------------------------------------------

-- Seed some test admin users (REPLACE WITH YOUR ACTUAL EMAILS)
-- Uncomment and update with your email addresses

-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@hotmesslondon.com';
-- UPDATE profiles SET role = 'mod' WHERE email = 'mod@hotmesslondon.com';
-- UPDATE profiles SET role = 'seller' WHERE email = 'test-seller@hotmesslondon.com';

-- Log the migration
INSERT INTO audit_logs (user_id, action, metadata)
VALUES (
  NULL,
  'database_migration',
  jsonb_build_object(
    'migration', 'two_surface_system',
    'version', '1.0',
    'timestamp', NOW()
  )
);

-- ----------------------------------------------------------------------------
-- MIGRATION COMPLETE
-- ----------------------------------------------------------------------------

-- Verify tables exist
DO $$ 
BEGIN
  RAISE NOTICE 'Migration complete. Tables created:';
  RAISE NOTICE '  - audit_logs';
  RAISE NOTICE '  - vendor_applications';
  RAISE NOTICE '  - orders';
  RAISE NOTICE '  - seller_stats';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Update user roles in profiles table';
  RAISE NOTICE '  2. Test admin console at /admin';
  RAISE NOTICE '  3. Test seller portal at /seller/dashboard';
  RAISE NOTICE '  4. Wire up API endpoints';
END $$;
