// app/api/stripe/checkout/route.ts
// Create Stripe Checkout session for digital/studio pack purchase

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: "2024-11-20.acacia" as any
});

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });
    }

    const { productId } = await req.json();

    // Fetch product details
    const { data: product, error: prodError } = await supabase
      .from("record_products")
      .select("id, stripe_price_id, release_id")
      .eq("id", String(productId))
      .maybeSingle();

    if (prodError || !product) {
      return NextResponse.json({ ok: false, error: "product_missing" }, { status: 404 });
    }

    const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/records/library?success=1`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/records`;

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      customer_email: userData.user.email ?? undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userData.user.id,
        product_id: product.id,
        release_id: product.release_id,
      },
    });

    // Log order
    await supabase.from("record_orders").insert({
      user_id: userData.user.id,
      stripe_checkout_session_id: session.id,
      status: "pending",
      amount_total_cents: session.amount_total ?? 0,
      currency: (session.currency ?? "gbp").toUpperCase(),
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ ok: false, error: "checkout_failed" }, { status: 500 });
  }
}
