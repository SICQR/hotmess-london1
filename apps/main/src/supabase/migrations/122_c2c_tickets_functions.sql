-- ============================================================================
-- C2C TICKETS DATABASE FUNCTIONS
-- Functions for ticket reservation, purchase, and escrow
-- ============================================================================

-- Function: Reserve tickets from listing (when payment authorized)
CREATE OR REPLACE FUNCTION reserve_tickets(
  p_listing_id UUID,
  p_quantity INTEGER
) RETURNS VOID AS $$
BEGIN
  UPDATE ticket_listings
  SET 
    quantity_available = quantity_available - p_quantity,
    quantity_reserved = quantity_reserved + p_quantity
  WHERE id = p_listing_id
    AND quantity_available >= p_quantity;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Not enough tickets available';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Return tickets to listing (when payment refunded/cancelled)
CREATE OR REPLACE FUNCTION return_tickets(
  p_listing_id UUID,
  p_quantity INTEGER
) RETURNS VOID AS $$
BEGIN
  UPDATE ticket_listings
  SET 
    quantity_available = quantity_available + p_quantity,
    quantity_reserved = quantity_reserved - p_quantity
  WHERE id = p_listing_id;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Complete ticket transfer (when proof verified)
CREATE OR REPLACE FUNCTION complete_ticket_transfer(
  p_listing_id UUID,
  p_quantity INTEGER
) RETURNS VOID AS $$
BEGIN
  UPDATE ticket_listings
  SET 
    quantity_reserved = quantity_reserved - p_quantity,
    quantity_sold = quantity_sold + p_quantity
  WHERE id = p_listing_id;
    
  -- Mark listing as sold out if no more available
  UPDATE ticket_listings
  SET status = 'sold'
  WHERE id = p_listing_id
    AND quantity_available = 0
    AND quantity_reserved = 0;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add columns to ticket_listings if they don't exist
ALTER TABLE ticket_listings 
  ADD COLUMN IF NOT EXISTS quantity_reserved INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity_sold INTEGER DEFAULT 0;

-- Add status column to ticket_purchases if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ticket_purchases' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE ticket_purchases 
      ADD COLUMN status TEXT DEFAULT 'pending_payment';
  END IF;
END $$;

-- Add payment tracking columns to ticket_purchases
ALTER TABLE ticket_purchases
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS buyer_fee_pence INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seller_fee_pence INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seller_payout_pence INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS proof_url TEXT,
  ADD COLUMN IF NOT EXISTS proof_uploaded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_payment_intent 
  ON ticket_purchases(stripe_payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_ticket_purchases_status 
  ON ticket_purchases(status);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ C2C Tickets functions and schema updates complete';
END $$;
