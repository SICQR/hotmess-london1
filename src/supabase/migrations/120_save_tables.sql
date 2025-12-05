-- ============================================================================
-- SAVE TABLES MIGRATION
-- Create missing save tables for tickets, listings, and releases
-- ============================================================================

-- Ticket Saves
CREATE TABLE IF NOT EXISTS ticket_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES ticket_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_ticket_saves_user ON ticket_saves(user_id);
CREATE INDEX idx_ticket_saves_listing ON ticket_saves(listing_id);

-- Market Listing Saves
CREATE TABLE IF NOT EXISTS market_listing_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES market_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_market_listing_saves_user ON market_listing_saves(user_id);
CREATE INDEX idx_market_listing_saves_listing ON market_listing_saves(listing_id);

-- Release Saves
CREATE TABLE IF NOT EXISTS release_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, release_id)
);

CREATE INDEX idx_release_saves_user ON release_saves(user_id);
CREATE INDEX idx_release_saves_release ON release_saves(release_id);

-- Enable RLS
ALTER TABLE ticket_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_listing_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_saves ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see/manage their own saves
CREATE POLICY "Users can view own ticket saves"
  ON ticket_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ticket saves"
  ON ticket_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ticket saves"
  ON ticket_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own listing saves"
  ON market_listing_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own listing saves"
  ON market_listing_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own listing saves"
  ON market_listing_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own release saves"
  ON release_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own release saves"
  ON release_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own release saves"
  ON release_saves FOR DELETE
  USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Save tables created: ticket_saves, market_listing_saves, release_saves';
END $$;
