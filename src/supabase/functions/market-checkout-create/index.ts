import { handleOptions } from "../_shared/cors.ts";
import { bad, json, readJson } from "../_shared/respond.ts";
import { getAdminClient, requireUser, appBaseUrl } from "../_shared/supabase.ts";
import { getStripe } from "../_shared/stripe.ts";

type Body = {
  listing_id: string;
  quantity: number;
  buyer_shipping: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    region?: string;
    postcode?: string;
    country?: string;
    phone?: string;
  };
  notes?: string;
  success_url?: string;
  cancel_url?: string;
};

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.floor(n)));
}

Deno.serve(async (req) => {
  const pre = handleOptions(req);
  if (pre) return pre;

  if (req.method !== "POST") return bad("method_not_allowed", 405);

  try {
    const user = await requireUser(req);
    const admin = getAdminClient();
    const stripe = getStripe();

    const body = await readJson<Body>(req);
    const listing_id = String(body.listing_id || "").trim();
    const quantity = clampInt(Number(body.quantity || 0), 1, 10);
    if (!listing_id) return bad("missing_listing_id");

    const { data: listing, error } = await admin
      .from("market_listings")
      .select(`
        id, status, fulfilment_mode, title, description, price_pence, currency, quantity_available, seller_id,
        market_sellers!inner(id, owner_id, status, stripe_account_id, stripe_onboarding_complete, white_label_enabled, display_name)
      `)
      .eq("id", listing_id)
      .single();

    if (error || !listing) return bad("listing_not_found", 404);
    if (listing.status !== "active") return bad("listing_not_active", 409);

    const seller = (listing as any).market_sellers;
    if (!seller || seller.status !== "approved") return bad("seller_not_available", 409);
    if (!seller.stripe_account_id || !seller.stripe_onboarding_complete) return bad("seller_payments_not_ready", 409);

    if ((listing.quantity_available ?? 0) < quantity) return bad("insufficient_stock", 409);

    const fulfilment_mode = listing.fulfilment_mode as string;
    const rate = fulfilment_mode === "white_label_partner" ? 0.20 : 0.12;

    const unit = Number(listing.price_pence);
    const subtotal = unit * quantity;
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;
    const platform_fee = Math.round(total * rate);

    // 1) Create order
    const orderIns = await admin.from("market_orders").insert({
      buyer_id: user.id,
      seller_id: listing.seller_id,
      status: "created",
      fulfilment_mode,
      subtotal_pence: subtotal,
      shipping_pence: shipping,
      tax_pence: tax,
      total_pence: total,
      currency: listing.currency || "GBP",
      platform_fee_pence: platform_fee,
      payment_provider: "stripe",
      buyer_shipping: body.buyer_shipping || {},
      notes: (body.notes || "").slice(0, 1000) || null,
    }).select("id").single();

    if (orderIns.error) throw new Error(orderIns.error.message);
    const orderId = orderIns.data.id as string;

    // 2) Create order items
    const itemIns = await admin.from("market_order_items").insert({
      order_id: orderId,
      listing_id: listing.id,
      title: listing.title,
      unit_price_pence: unit,
      quantity,
      total_price_pence: subtotal,
    });

    if (itemIns.error) throw new Error(itemIns.error.message);

    // 3) Reserve stock atomically via RPC
    const { data: reserved, error: reserveError } = await admin.rpc("market_reserve_stock", {
      p_order_id: orderId,
    });

    if (reserveError || !reserved) {
      // Mark as cancelled and bail; do not send buyer to Stripe
      await admin.from("market_orders").update({
        status: "cancelled",
      }).eq("id", orderId);

      await admin.from("audit_log").insert({
        actor_id: user.id,
        action: "stock_reservation_failed",
        entity_type: "market_orders",
        entity_id: orderId,
        meta: { listing_id: listing.id, quantity, error: String(reserveError?.message || "insufficient_stock") },
      });

      return bad("stock_reservation_failed", 409);
    }

    // 4) Create Stripe checkout session
    const base = appBaseUrl();
    const success_url =
      body.success_url && body.success_url.startsWith(base)
        ? body.success_url
        : `${base}?route=messmarketOrder&orderId=${orderId}`;
    const cancel_url =
      body.cancel_url && body.cancel_url.startsWith(base)
        ? body.cancel_url
        : `${base}?route=messmessMarketProduct&slug=${listing.id}`;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        locale: "en-GB",
        success_url: `${success_url}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url,
        line_items: [
          {
            quantity,
            price_data: {
              currency: (listing.currency || "GBP").toLowerCase(),
              unit_amount: unit,
              product_data: {
                name: listing.title,
                description:
                  fulfilment_mode === "white_label_partner"
                    ? "White-Label by HOTMESS • Fulfilled by partner"
                    : `Sold by ${seller.display_name}`,
              },
            },
          },
        ],
        payment_intent_data: {
          application_fee_amount: platform_fee,
          transfer_data: { destination: seller.stripe_account_id },
          metadata: {
            order_id: orderId,
            listing_id: listing.id,
            seller_id: listing.seller_id,
            buyer_id: user.id,
            fulfilment_mode,
          },
        },
        metadata: {
          order_id: orderId,
          listing_id: listing.id,
        },
        customer_email: user.email ?? undefined,
      },
      { expand: ["payment_intent"] },
    );

    const up = await admin.from("market_orders").update({
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: (session.payment_intent as any)?.id || null,
    }).eq("id", orderId);

    if (up.error) throw new Error(up.error.message);

    await admin.from("audit_log").insert({
      actor_id: user.id,
      action: "market_checkout_created",
      entity_type: "market_orders",
      entity_id: orderId,
      meta: { listing_id: listing.id, quantity, platform_fee, fulfilment_mode, stock_reserved: true },
    });

    return json({ ok: true, order_id: orderId, checkout_url: session.url });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const code = msg === "not_authenticated" ? 401 : 400;
    return bad(msg, code);
  }
});
