-- ============================================================================
-- HOTMESS OS - RLS Policies (Canonical Architecture 2025-12-17)
-- ============================================================================
-- Migration 002: Row Level Security Policies
-- Compliance: Role-based access control with privacy-first principles
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================
-- Note: These functions use SECURITY DEFINER to allow RLS policies to check
-- user roles. They are safe because:
-- 1. They only read from profiles table (no mutations)
-- 2. They check against auth.uid() (current authenticated user)
-- 3. The profiles table itself has RLS policies preventing unauthorized updates
-- 4. Functions are STABLE (read-only, deterministic for same inputs)

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_admin IS 'Check if current user has admin role. SECURITY DEFINER allows use in RLS policies.';

-- Check if user is moderator or admin
CREATE OR REPLACE FUNCTION is_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_moderator IS 'Check if current user has moderator or admin role. SECURITY DEFINER allows use in RLS policies.';

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Public can view basic profile info
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
TO anon, authenticated
USING (true);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Users can insert own profile
CREATE POLICY "Users can create own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- BEACONS POLICIES
-- ============================================================================

-- Public can view live beacons only
CREATE POLICY "Public can view live beacons"
ON beacons FOR SELECT
TO anon, authenticated
USING (status = 'live' AND (end_at IS NULL OR end_at > now()));

-- Users can create beacons (subject to host_type checks in app logic)
CREATE POLICY "Authenticated users can create beacons"
ON beacons FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- Users can update own draft beacons
CREATE POLICY "Users can update own draft beacons"
ON beacons FOR UPDATE
TO authenticated
USING (auth.uid() = creator_id AND status = 'draft');

-- Admin can view all beacons
CREATE POLICY "Admin can view all beacons"
ON beacons FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can update any beacon
CREATE POLICY "Admin can update any beacon"
ON beacons FOR UPDATE
TO authenticated
USING (is_admin());

-- Admin can delete beacons
CREATE POLICY "Admin can delete beacons"
ON beacons FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- QR TOKENS POLICIES (Admin-only)
-- ============================================================================

CREATE POLICY "Only admin can view QR tokens"
ON qr_tokens FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admin can create QR tokens"
ON qr_tokens FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update QR tokens"
ON qr_tokens FOR UPDATE
TO authenticated
USING (is_admin());

-- ============================================================================
-- BEACON SCANS POLICIES (Admin-only for privacy)
-- ============================================================================

CREATE POLICY "Only admin can view beacon scans"
ON beacon_scans FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Service can insert scans"
ON beacon_scans FOR INSERT
TO authenticated
WITH CHECK (true); -- Validated by application logic

-- ============================================================================
-- EVIDENCE EVENTS POLICIES (Admin-only)
-- ============================================================================

CREATE POLICY "Only admin can view evidence events"
ON evidence_events FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "System can create evidence events"
ON evidence_events FOR INSERT
TO authenticated
WITH CHECK (true); -- Validated by application logic

-- ============================================================================
-- BEACON POSTS POLICIES
-- ============================================================================

-- Public can view visible posts on live beacons
CREATE POLICY "Public can view visible posts on live beacons"
ON beacon_posts FOR SELECT
TO anon, authenticated
USING (
  status = 'visible' 
  AND EXISTS (
    SELECT 1 FROM beacons 
    WHERE beacons.id = beacon_posts.beacon_id 
    AND beacons.status = 'live'
  )
);

-- Users can create posts
CREATE POLICY "Users can create posts"
ON beacon_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_profile_id);

-- Users can update own posts
CREATE POLICY "Users can update own posts"
ON beacon_posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_profile_id);

-- Admin can view all posts
CREATE POLICY "Admin can view all posts"
ON beacon_posts FOR SELECT
TO authenticated
USING (is_admin());

-- Admin/moderator can update any post
CREATE POLICY "Moderators can update any post"
ON beacon_posts FOR UPDATE
TO authenticated
USING (is_moderator());

-- ============================================================================
-- TICKET LISTINGS POLICIES
-- ============================================================================

-- Public can view live listings
CREATE POLICY "Public can view live listings"
ON ticket_listings FOR SELECT
TO anon, authenticated
USING (status = 'live');

-- Users can view own listings regardless of status
CREATE POLICY "Users can view own listings"
ON ticket_listings FOR SELECT
TO authenticated
USING (auth.uid() = seller_profile_id);

-- Users can create own listings
CREATE POLICY "Users can create own listings"
ON ticket_listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seller_profile_id);

-- Users can update own draft listings
CREATE POLICY "Users can update own draft listings"
ON ticket_listings FOR UPDATE
TO authenticated
USING (auth.uid() = seller_profile_id AND status = 'draft');

-- Admin can view all listings
CREATE POLICY "Admin can view all listings"
ON ticket_listings FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can update any listing
CREATE POLICY "Admin can update any listing"
ON ticket_listings FOR UPDATE
TO authenticated
USING (is_admin());

-- ============================================================================
-- MODERATION REPORTS POLICIES
-- ============================================================================

-- Users can create reports
CREATE POLICY "Users can create reports"
ON moderation_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_profile_id);

-- Users can view own reports
CREATE POLICY "Users can view own reports"
ON moderation_reports FOR SELECT
TO authenticated
USING (auth.uid() = reporter_profile_id);

-- Moderators can view all reports
CREATE POLICY "Moderators can view all reports"
ON moderation_reports FOR SELECT
TO authenticated
USING (is_moderator());

-- Moderators can update reports
CREATE POLICY "Moderators can update reports"
ON moderation_reports FOR UPDATE
TO authenticated
USING (is_moderator());

-- ============================================================================
-- MODERATION ACTIONS POLICIES (Admin-only)
-- ============================================================================

CREATE POLICY "Only admin can view moderation actions"
ON moderation_actions FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admin can create moderation actions"
ON moderation_actions FOR INSERT
TO authenticated
WITH CHECK (is_admin() AND auth.uid() = actor_admin_id);

-- ============================================================================
-- AUDIT LOG POLICIES (Admin-only)
-- ============================================================================

CREATE POLICY "Only admin can view audit log"
ON audit_log FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "System can insert audit log entries"
ON audit_log FOR INSERT
TO authenticated
WITH CHECK (true); -- Application logic handles this

-- ============================================================================
-- DSAR REQUESTS POLICIES
-- ============================================================================

-- Users can create own DSAR requests
CREATE POLICY "Users can create own DSAR requests"
ON dsar_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view own DSAR requests
CREATE POLICY "Users can view own DSAR requests"
ON dsar_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admin can view all DSAR requests
CREATE POLICY "Admin can view all DSAR requests"
ON dsar_requests FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can update DSAR requests
CREATE POLICY "Admin can update DSAR requests"
ON dsar_requests FOR UPDATE
TO authenticated
USING (is_admin());

-- ============================================================================
-- PRODUCTS POLICIES
-- ============================================================================

-- Public can view live products
CREATE POLICY "Public can view live products"
ON products FOR SELECT
TO anon, authenticated
USING (status = 'live');

-- Admin can view all products
CREATE POLICY "Admin can view all products"
ON products FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can manage products
CREATE POLICY "Admin can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admin can update products"
ON products FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admin can delete products"
ON products FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- DROPS POLICIES
-- ============================================================================

-- Public can view live and scheduled drops
CREATE POLICY "Public can view active drops"
ON drops FOR SELECT
TO anon, authenticated
USING (status IN ('scheduled', 'live'));

-- Admin can view all drops
CREATE POLICY "Admin can view all drops"
ON drops FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can manage drops
CREATE POLICY "Admin can insert drops"
ON drops FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admin can update drops"
ON drops FOR UPDATE
TO authenticated
USING (is_admin());

-- ============================================================================
-- ORDERS POLICIES
-- ============================================================================

-- Users can view own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create own orders
CREATE POLICY "Users can create own orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admin can view all orders
CREATE POLICY "Admin can view all orders"
ON orders FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can update orders
CREATE POLICY "Admin can update orders"
ON orders FOR UPDATE
TO authenticated
USING (is_admin());

-- ============================================================================
-- ORDER ITEMS POLICIES
-- ============================================================================

-- Users can view items for their own orders
CREATE POLICY "Users can view own order items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- System can insert order items
CREATE POLICY "System can insert order items"
ON order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Admin can view all order items
CREATE POLICY "Admin can view all order items"
ON order_items FOR SELECT
TO authenticated
USING (is_admin());

-- ============================================================================
-- MARKET SELLERS POLICIES
-- ============================================================================

-- Public can view approved sellers
CREATE POLICY "Public can view approved sellers"
ON market_sellers FOR SELECT
TO anon, authenticated
USING (verification_status = 'approved');

-- Users can view own seller account
CREATE POLICY "Users can view own seller account"
ON market_sellers FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

-- Users can create own seller account
CREATE POLICY "Users can create own seller account"
ON market_sellers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Sellers can update own account
CREATE POLICY "Sellers can update own account"
ON market_sellers FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);

-- Admin can view all sellers
CREATE POLICY "Admin can view all sellers"
ON market_sellers FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can update any seller
CREATE POLICY "Admin can update any seller"
ON market_sellers FOR UPDATE
TO authenticated
USING (is_admin());

-- ============================================================================
-- MARKET LISTINGS POLICIES
-- ============================================================================

-- Public can view live market listings
CREATE POLICY "Public can view live market listings"
ON market_listings FOR SELECT
TO anon, authenticated
USING (status = 'live');

-- Sellers can view own listings
CREATE POLICY "Sellers can view own listings"
ON market_listings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM market_sellers 
    WHERE market_sellers.id = market_listings.seller_id 
    AND market_sellers.owner_id = auth.uid()
  )
);

-- Sellers can manage own listings
CREATE POLICY "Sellers can create listings"
ON market_listings FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM market_sellers 
    WHERE market_sellers.id = market_listings.seller_id 
    AND market_sellers.owner_id = auth.uid()
  )
);

CREATE POLICY "Sellers can update own listings"
ON market_listings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM market_sellers 
    WHERE market_sellers.id = market_listings.seller_id 
    AND market_sellers.owner_id = auth.uid()
  )
);

-- Admin can view all market listings
CREATE POLICY "Admin can view all market listings"
ON market_listings FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can update any market listing
CREATE POLICY "Admin can update any market listing"
ON market_listings FOR UPDATE
TO authenticated
USING (is_admin());

-- ============================================================================
-- XP EVENTS POLICIES
-- ============================================================================

-- Users can view own XP events
CREATE POLICY "Users can view own XP events"
ON xp_events FOR SELECT
TO authenticated
USING (auth.uid() = actor_id);

-- System can create XP events (application logic validates)
CREATE POLICY "System can create XP events"
ON xp_events FOR INSERT
TO authenticated
WITH CHECK (true);

-- Admin can view all XP events
CREATE POLICY "Admin can view all XP events"
ON xp_events FOR SELECT
TO authenticated
USING (is_admin());

-- ============================================================================
-- RADIO SHOWS POLICIES
-- ============================================================================

-- Public can view live radio shows
CREATE POLICY "Public can view live radio shows"
ON radio_shows FOR SELECT
TO anon, authenticated
USING (status = 'live');

-- Admin can manage radio shows
CREATE POLICY "Admin can view all radio shows"
ON radio_shows FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admin can insert radio shows"
ON radio_shows FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admin can update radio shows"
ON radio_shows FOR UPDATE
TO authenticated
USING (is_admin());

-- ============================================================================
-- SCHEDULE BLOCKS POLICIES
-- ============================================================================

-- Public can view schedule blocks for live shows
CREATE POLICY "Public can view schedule blocks"
ON schedule_blocks FOR SELECT
TO anon, authenticated
USING (
  status = 'live' 
  AND EXISTS (
    SELECT 1 FROM radio_shows 
    WHERE radio_shows.id = schedule_blocks.show_id 
    AND radio_shows.status = 'live'
  )
);

-- Admin can manage schedule blocks
CREATE POLICY "Admin can view all schedule blocks"
ON schedule_blocks FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admin can insert schedule blocks"
ON schedule_blocks FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admin can update schedule blocks"
ON schedule_blocks FOR UPDATE
TO authenticated
USING (is_admin());

-- ============================================================================
-- NOW PLAYING OVERRIDES POLICIES
-- ============================================================================

-- Public can view active now playing
CREATE POLICY "Public can view active now playing"
ON now_playing_overrides FOR SELECT
TO anon, authenticated
USING (expires_at > now());

-- Admin can manage now playing
CREATE POLICY "Admin can insert now playing"
ON now_playing_overrides FOR INSERT
TO authenticated
WITH CHECK (is_admin() AND auth.uid() = set_by);

CREATE POLICY "Admin can view all now playing"
ON now_playing_overrides FOR SELECT
TO authenticated
USING (is_admin());

-- ============================================================================
-- RECORDS RELEASES POLICIES
-- ============================================================================

-- Public can view live releases
CREATE POLICY "Public can view live releases"
ON records_releases FOR SELECT
TO anon, authenticated
USING (status = 'live');

-- Admin can manage releases
CREATE POLICY "Admin can view all releases"
ON records_releases FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admin can insert releases"
ON records_releases FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admin can update releases"
ON records_releases FOR UPDATE
TO authenticated
USING (is_admin());
