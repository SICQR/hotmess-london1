-- =========================================================
-- STOCK RESERVATION / RELEASE FOR MESSMARKET
-- =========================================================

-- 1) Add stock state flags on orders
ALTER TABLE public.market_orders
  ADD COLUMN IF NOT EXISTS stock_reserved boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS stock_released boolean NOT NULL DEFAULT false;

-- Optional safety check: can't have both true
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.market_orders'::regclass
      AND conname = 'market_orders_stock_flags_check'
  ) THEN
    ALTER TABLE public.market_orders
    ADD CONSTRAINT market_orders_stock_flags_check
    CHECK (NOT (stock_reserved = true AND stock_released = true));
  END IF;
END $$;

-- 2) Function: Reserve stock for an order (atomic)
--    - For each order item, decrement quantity_available by item.quantity
--    - Only if enough stock exists
--    - Marks order.stock_reserved = true
--    - Returns TRUE if reserved, FALSE if already reserved or cancelled
CREATE OR REPLACE FUNCTION public.market_reserve_stock(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  v_order public.market_orders%ROWTYPE;
  v_item RECORD;
BEGIN
  -- Lock the order row
  SELECT * INTO v_order
  FROM public.market_orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'order_not_found';
  END IF;

  IF v_order.status <> 'created'::public.order_status THEN
    -- We only reserve for fresh orders
    RETURN FALSE;
  END IF;

  IF v_order.stock_reserved THEN
    -- Already reserved; nothing to do
    RETURN FALSE;
  END IF;

  -- Loop over items and decrement stock with a safety condition
  FOR v_item IN
    SELECT oi.listing_id, oi.quantity
    FROM public.market_order_items oi
    WHERE oi.order_id = p_order_id
  LOOP
    UPDATE public.market_listings l
    SET quantity_available = quantity_available - v_item.quantity
    WHERE l.id = v_item.listing_id
      AND l.quantity_available >= v_item.quantity;

    IF NOT FOUND THEN
      -- If *any* item fails, revert everything
      RAISE EXCEPTION 'insufficient_stock_for_listing_%', v_item.listing_id;
    END IF;
  END LOOP;

  UPDATE public.market_orders
  SET stock_reserved = true,
      updated_at = now()
  WHERE id = p_order_id;

  RETURN TRUE;
EXCEPTION
  WHEN others THEN
    -- Any exception will roll back the entire function (transaction)
    RAISE;
END;
$$;

-- 3) Function: Release stock for an order (on failed / refunded / cancelled)
--    - Only runs if stock_reserved = true AND stock_released = false
--    - Adds quantities back to listings
--    - Marks stock_released = true to avoid double-credits
CREATE OR REPLACE FUNCTION public.market_release_stock(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  v_order public.market_orders%ROWTYPE;
  v_item RECORD;
BEGIN
  SELECT * INTO v_order
  FROM public.market_orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'order_not_found';
  END IF;

  IF NOT v_order.stock_reserved OR v_order.stock_released THEN
    -- Nothing to release
    RETURN FALSE;
  END IF;

  FOR v_item IN
    SELECT oi.listing_id, oi.quantity
    FROM public.market_order_items oi
    WHERE oi.order_id = p_order_id
  LOOP
    UPDATE public.market_listings l
    SET quantity_available = quantity_available + v_item.quantity
    WHERE l.id = v_item.listing_id;
    -- If listing missing, we silently ignore; or you can RAISE
  END LOOP;

  UPDATE public.market_orders
  SET stock_released = true,
      updated_at = now()
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$;

-- 4) Grant execute permissions
GRANT EXECUTE ON FUNCTION public.market_reserve_stock TO authenticated;
GRANT EXECUTE ON FUNCTION public.market_release_stock TO authenticated;
GRANT EXECUTE ON FUNCTION public.market_reserve_stock TO service_role;
GRANT EXECUTE ON FUNCTION public.market_release_stock TO service_role;
