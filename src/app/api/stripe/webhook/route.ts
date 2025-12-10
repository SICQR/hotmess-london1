// app/api/stripe/webhook/route.ts
// Handle Stripe webhook events (grant entitlements on successful payment)

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia" as any
});

// Use service role for webhook (bypasses RLS)
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = String(session.metadata?.user_id || "");
    const productId = String(session.metadata?.product_id || "");
    const releaseId = String(session.metadata?.release_id || "");

    console.log("Checkout completed:", { userId, productId, releaseId });

    // Update order status
    await admin
      .from("record_orders")
      .update({
        status: "paid",
        stripe_customer_id: session.customer?.toString() ?? null,
      })
      .eq("stripe_checkout_session_id", session.id);

    // Grant entitlements
    if (userId && releaseId) {
      // Grant release access (HQ streaming)
      await admin.from("record_entitlements").upsert({
        user_id: userId,
        kind: "release_access",
        release_id: releaseId,
        product_id: productId || null,
        ends_at: null,
      });

      // Grant download pack
      await admin.from("record_entitlements").upsert({
        user_id: userId,
        kind: "download_pack",
        release_id: releaseId,
        product_id: productId || null,
        ends_at: null,
      });

      // Auto-save to library on purchase
      await admin
        .from("record_library")
        .upsert({ user_id: userId, release_id: releaseId });

      console.log("Entitlements granted:", { userId, releaseId });
    }
  }

  return NextResponse.json({ received: true });
}
