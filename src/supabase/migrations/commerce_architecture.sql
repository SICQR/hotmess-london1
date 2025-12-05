-- =========================================================
-- COMMERCE ARCHITECTURE (Shopify + Marketplace + White-Label)
-- =========================================================

-- ---------- ENUMS ----------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seller_status') THEN
    CREATE TYPE public.seller_status AS ENUM ('pending','approved','rejected','suspended');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fulfilment_mode') THEN
    CREATE TYPE public.fulfilment_mode AS ENUM ('seller_fulfilled','white_label_partner');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
    CREATE TYPE public.listing_status AS ENUM ('draft','active','paused','removed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM ('created','paid','accepted','cancelled','shipped','delivered','refunded','disputed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dispute_status') THEN
    CREATE TYPE public.dispute_status AS ENUM ('open','needs_seller','needs_buyer','under_review','resolved','refunded');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notif_channel') THEN
    CREATE TYPE public.notif_channel AS ENUM ('inapp','email');
  END IF;
END $$;

-- ---------- MARKETPLACE: SELLERS ----------
CREATE TABLE IF NOT EXISTS public.market_sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.seller_status NOT NULL DEFAULT 'pending',
  display_name text NOT NULL,
  support_blurb text,
  fulfilment_regions text[] NOT NULL DEFAULT ARRAY['UK'],
  response_sla_hours int NOT NULL DEFAULT 12,
  ship_sla_days int NOT NULL DEFAULT 3,
  stripe_account_id text,
  stripe_onboarding_complete boolean NOT NULL DEFAULT false,
  white_label_enabled boolean NOT NULL DEFAULT false,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_market_sellers_owner_id ON public.market_sellers(owner_id);
CREATE INDEX IF NOT EXISTS ix_market_sellers_status ON public.market_sellers(status);

-- ---------- MARKETPLACE: LISTINGS ----------
CREATE TABLE IF NOT EXISTS public.market_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.market_sellers(id) ON DELETE CASCADE,
  status public.listing_status NOT NULL DEFAULT 'draft',
  fulfilment_mode public.fulfilment_mode NOT NULL DEFAULT 'seller_fulfilled',

  slug text UNIQUE,  -- For URL routing (e.g., /messmarket/product/neon-harness)
  title text NOT NULL,
  description text NOT NULL,
  price_pence int NOT NULL CHECK (price_pence >= 0),
  currency text NOT NULL DEFAULT 'GBP',

  quantity_available int NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
  sku text,

  category text NOT NULL DEFAULT 'general',
  tags text[] NOT NULL DEFAULT '{}'::text[],

  public_brand_name text,
  public_support_name text,

  shipping_policy text,
  returns_policy text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_market_listings_status ON public.market_listings(status);
CREATE INDEX IF NOT EXISTS ix_market_listings_seller ON public.market_listings(seller_id);
CREATE UNIQUE INDEX IF NOT EXISTS ux_market_listings_slug ON public.market_listings(slug) WHERE slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.market_listing_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.market_listings(id) ON DELETE CASCADE,
  sort int NOT NULL DEFAULT 0,
  storage_path text NOT NULL,
  alt text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_listing_media_listing ON public.market_listing_media(listing_id);

-- ---------- MARKETPLACE: ORDERS ----------
CREATE TABLE IF NOT EXISTS public.market_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.market_sellers(id) ON DELETE RESTRICT,

  status public.order_status NOT NULL DEFAULT 'created',
  fulfilment_mode public.fulfilment_mode NOT NULL,

  subtotal_pence int NOT NULL DEFAULT 0 CHECK (subtotal_pence >= 0),
  shipping_pence int NOT NULL DEFAULT 0 CHECK (shipping_pence >= 0),
  tax_pence int NOT NULL DEFAULT 0 CHECK (tax_pence >= 0),
  total_pence int NOT NULL DEFAULT 0 CHECK (total_pence >= 0),
  currency text NOT NULL DEFAULT 'GBP',

  platform_fee_pence int NOT NULL DEFAULT 0,
  payment_provider text NOT NULL DEFAULT 'stripe',
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,

  buyer_shipping jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,

  accepted_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_market_orders_buyer ON public.market_orders(buyer_id);
CREATE INDEX IF NOT EXISTS ix_market_orders_seller ON public.market_orders(seller_id);
CREATE INDEX IF NOT EXISTS ix_market_orders_status ON public.market_orders(status);

CREATE TABLE IF NOT EXISTS public.market_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.market_orders(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.market_listings(id) ON DELETE RESTRICT,
  title text NOT NULL,
  unit_price_pence int NOT NULL CHECK (unit_price_pence >= 0),
  quantity int NOT NULL CHECK (quantity > 0),
  total_price_pence int NOT NULL CHECK (total_price_pence >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_order_items_order ON public.market_order_items(order_id);

CREATE TABLE IF NOT EXISTS public.market_shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.market_orders(id) ON DELETE CASCADE,
  carrier text,
  tracking_number text,
  tracking_url text,
  shipped_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_shipments_order ON public.market_shipments(order_id);

-- ---------- DISPUTES ----------
CREATE TABLE IF NOT EXISTS public.market_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.market_orders(id) ON DELETE CASCADE,
  opened_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.dispute_status NOT NULL DEFAULT 'open',
  reason text NOT NULL,
  details text,
  evidence_paths text[] NOT NULL DEFAULT '{}'::text[],
  admin_notes text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_disputes_order ON public.market_disputes(order_id);
CREATE INDEX IF NOT EXISTS ix_disputes_status ON public.market_disputes(status);

-- ---------- WHITE-LABEL KITS ----------
CREATE TABLE IF NOT EXISTS public.seller_kit_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.market_sellers(id) ON DELETE CASCADE,
  kit_sku text NOT NULL,
  units_available int NOT NULL DEFAULT 0 CHECK (units_available >= 0),
  last_shopify_order_id text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (seller_id, kit_sku)
);

-- ---------- SHOPIFY SYNC TABLES ----------
CREATE TABLE IF NOT EXISTS public.shopify_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  shopify_order_id text NOT NULL UNIQUE,
  order_number text,
  status text,
  currency text,
  total_price text,
  raw jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shopify_fulfillments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_order_id text NOT NULL,
  tracking_number text,
  tracking_url text,
  raw jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_shopify_orders_user ON public.shopify_orders(user_id);

-- ---------- NOTIFICATIONS ----------
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel public.notif_channel NOT NULL DEFAULT 'inapp',
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  href text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_notifications_user ON public.notifications(user_id, is_read);

-- ---------- AUDIT LOG ----------
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_audit_created_at ON public.audit_log(created_at);

-- ---------- UPDATED_AT triggers ----------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='touch_market_sellers') THEN
    CREATE TRIGGER touch_market_sellers BEFORE UPDATE ON public.market_sellers
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='touch_market_listings') THEN
    CREATE TRIGGER touch_market_listings BEFORE UPDATE ON public.market_listings
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='touch_market_orders') THEN
    CREATE TRIGGER touch_market_orders BEFORE UPDATE ON public.market_orders
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='touch_market_disputes') THEN
    CREATE TRIGGER touch_market_disputes BEFORE UPDATE ON public.market_disputes
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='touch_shopify_orders') THEN
    CREATE TRIGGER touch_shopify_orders BEFORE UPDATE ON public.shopify_orders
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
  END IF;
END $$;

-- ---------- RLS ----------
ALTER TABLE public.market_sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_kit_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopify_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopify_fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Helper: admin role check (uses existing profiles table with user_id column)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  );
$$;

-- Sellers: owner can see/edit their seller profile; admin sees all
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_sellers' AND policyname='seller_select_own') THEN
    CREATE POLICY seller_select_own ON public.market_sellers
    FOR SELECT USING (owner_id = auth.uid() OR public.is_admin());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_sellers' AND policyname='seller_insert_own') THEN
    CREATE POLICY seller_insert_own ON public.market_sellers
    FOR INSERT WITH CHECK (owner_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_sellers' AND policyname='seller_update_own') THEN
    CREATE POLICY seller_update_own ON public.market_sellers
    FOR UPDATE USING (owner_id = auth.uid() OR public.is_admin())
    WITH CHECK (owner_id = auth.uid() OR public.is_admin());
  END IF;
END $$;

-- Listings: public can read active listings; seller can manage own; admin can manage all
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_listings' AND policyname='listing_select_public') THEN
    CREATE POLICY listing_select_public ON public.market_listings
    FOR SELECT USING (status='active' OR public.is_admin() OR EXISTS (
      SELECT 1 FROM public.market_sellers s
      WHERE s.id = seller_id AND s.owner_id = auth.uid()
    ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_listings' AND policyname='listing_insert_seller') THEN
    CREATE POLICY listing_insert_seller ON public.market_listings
    FOR INSERT WITH CHECK (EXISTS (
      SELECT 1 FROM public.market_sellers s
      WHERE s.id = seller_id AND s.owner_id = auth.uid() AND s.status='approved'
    ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_listings' AND policyname='listing_update_seller') THEN
    CREATE POLICY listing_update_seller ON public.market_listings
    FOR UPDATE USING (public.is_admin() OR EXISTS (
      SELECT 1 FROM public.market_sellers s
      WHERE s.id = seller_id AND s.owner_id = auth.uid()
    ))
    WITH CHECK (public.is_admin() OR EXISTS (
      SELECT 1 FROM public.market_sellers s
      WHERE s.id = seller_id AND s.owner_id = auth.uid()
    ));
  END IF;
END $$;

-- Listing media: follow listing ownership or admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_listing_media' AND policyname='media_select_follow_listing') THEN
    CREATE POLICY media_select_follow_listing ON public.market_listing_media
    FOR SELECT USING (public.is_admin() OR EXISTS (
      SELECT 1 FROM public.market_listings l
      JOIN public.market_sellers s ON s.id = l.seller_id
      WHERE l.id = listing_id AND (l.status='active' OR s.owner_id = auth.uid())
    ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_listing_media' AND policyname='media_write_seller') THEN
    CREATE POLICY media_write_seller ON public.market_listing_media
    FOR ALL USING (public.is_admin() OR EXISTS (
      SELECT 1 FROM public.market_listings l
      JOIN public.market_sellers s ON s.id = l.seller_id
      WHERE l.id = listing_id AND s.owner_id = auth.uid()
    ))
    WITH CHECK (public.is_admin() OR EXISTS (
      SELECT 1 FROM public.market_listings l
      JOIN public.market_sellers s ON s.id = l.seller_id
      WHERE l.id = listing_id AND s.owner_id = auth.uid()
    ));
  END IF;
END $$;

-- Orders: buyer sees own; seller sees own; admin sees all
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_orders' AND policyname='orders_select_party') THEN
    CREATE POLICY orders_select_party ON public.market_orders
    FOR SELECT USING (
      public.is_admin()
      OR buyer_id = auth.uid()
      OR EXISTS (SELECT 1 FROM public.market_sellers s WHERE s.id = seller_id AND s.owner_id = auth.uid())
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_orders' AND policyname='orders_update_party') THEN
    CREATE POLICY orders_update_party ON public.market_orders
    FOR UPDATE USING (
      public.is_admin()
      OR EXISTS (SELECT 1 FROM public.market_sellers s WHERE s.id = seller_id AND s.owner_id = auth.uid())
      OR buyer_id = auth.uid()
    )
    WITH CHECK (
      public.is_admin()
      OR EXISTS (SELECT 1 FROM public.market_sellers s WHERE s.id = seller_id AND s.owner_id = auth.uid())
      OR buyer_id = auth.uid()
    );
  END IF;
END $$;

-- Order items / shipments: follow order visibility
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_order_items' AND policyname='order_items_select_party') THEN
    CREATE POLICY order_items_select_party ON public.market_order_items
    FOR SELECT USING (EXISTS (
      SELECT 1 FROM public.market_orders o
      WHERE o.id = order_id AND (
        public.is_admin()
        OR o.buyer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.market_sellers s WHERE s.id = o.seller_id AND s.owner_id = auth.uid())
      )
    ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_shipments' AND policyname='shipments_select_party') THEN
    CREATE POLICY shipments_select_party ON public.market_shipments
    FOR SELECT USING (EXISTS (
      SELECT 1 FROM public.market_orders o
      WHERE o.id = order_id AND (
        public.is_admin()
        OR o.buyer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.market_sellers s WHERE s.id = o.seller_id AND s.owner_id = auth.uid())
      )
    ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_shipments' AND policyname='shipments_insert_seller') THEN
    CREATE POLICY shipments_insert_seller ON public.market_shipments
    FOR INSERT WITH CHECK (EXISTS (
      SELECT 1 FROM public.market_orders o
      JOIN public.market_sellers s ON s.id = o.seller_id
      WHERE o.id = order_id AND (s.owner_id = auth.uid() OR public.is_admin())
    ));
  END IF;
END $$;

-- Disputes: parties + admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_disputes' AND policyname='disputes_select_party') THEN
    CREATE POLICY disputes_select_party ON public.market_disputes
    FOR SELECT USING (
      public.is_admin()
      OR opened_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.market_orders o
        JOIN public.market_sellers s ON s.id = o.seller_id
        WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR s.owner_id = auth.uid())
      )
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='market_disputes' AND policyname='disputes_insert_party') THEN
    CREATE POLICY disputes_insert_party ON public.market_disputes
    FOR INSERT WITH CHECK (
      opened_by = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.market_orders o
        WHERE o.id = order_id AND (o.buyer_id = auth.uid()
          OR EXISTS (SELECT 1 FROM public.market_sellers s WHERE s.id = o.seller_id AND s.owner_id = auth.uid()))
      )
    );
  END IF;
END $$;

-- Shopify orders: user can see their own; admin can see all
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='shopify_orders' AND policyname='shopify_select_own') THEN
    CREATE POLICY shopify_select_own ON public.shopify_orders
    FOR SELECT USING (public.is_admin() OR user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='shopify_fulfillments' AND policyname='shopify_fulfillments_admin_only') THEN
    CREATE POLICY shopify_fulfillments_admin_only ON public.shopify_fulfillments
    FOR SELECT USING (public.is_admin());
  END IF;
END $$;

-- Notifications: user only
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='notif_select_own') THEN
    CREATE POLICY notif_select_own ON public.notifications
    FOR SELECT USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='notifications' AND policyname='notif_update_own') THEN
    CREATE POLICY notif_update_own ON public.notifications
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Audit log: admin only
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='audit_log' AND policyname='audit_admin_only') THEN
    CREATE POLICY audit_admin_only ON public.audit_log
    FOR SELECT USING (public.is_admin());
  END IF;
END $$;
