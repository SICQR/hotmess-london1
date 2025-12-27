-- Add paid_at to market_orders for Stripe truth-engine updates

ALTER TABLE public.market_orders
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE INDEX IF NOT EXISTS ix_market_orders_paid_at ON public.market_orders(paid_at);
