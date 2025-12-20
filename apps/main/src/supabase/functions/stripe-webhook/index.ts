import { bad, json } from "../_shared/respond.ts";
import { getAdminClient } from "../_shared/supabase.ts";
import { getStripe, getStripeWebhookSecret } from "../_shared/stripe.ts";
import { sendOrderConfirmationEmail } from "../_shared/email.ts";

Deno.serve(async (req) => {
  if (req.method !== "POST") return bad("method_not_allowed", 405);

  const admin = getAdminClient();
  const stripe = getStripe();

  const sig = req.headers.get("stripe-signature");
  if (!sig) return bad("missing_stripe_signature", 400);

  const rawBody = await req.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, getStripeWebhookSecret());
  } catch (e: any) {
    return bad(`invalid_signature_${e?.message || "stripe"}`, 400);
  }

  const insertNotif = async (user_id: string, type: string, title: string, body: string, href?: string) => {
    await admin.from("notifications").insert({ user_id, channel: "inapp", type, title, body, href: href || null });
  };

  // Helper: release stock safely via RPC
  async function releaseStock(orderId: string) {
    const { data, error } = await admin.rpc("market_release_stock", { p_order_id: orderId });
    if (error) {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "stock_release_error",
        entity_type: "market_orders",
        entity_id: orderId,
        meta: { stripe_event_id: event.id, message: String(error.message || error) },
      });
    } else if (data) {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "stock_released",
        entity_type: "market_orders",
        entity_id: orderId,
        meta: { stripe_event_id: event.id },
      });
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session?.metadata?.order_id;
        if (!orderId) break;

        const { data: order } = await admin
          .from("market_orders")
          .select("id,buyer_id,seller_id,status,total_pence,currency,fulfilment_mode,market_sellers(owner_id)")
          .eq("id", orderId)
          .maybeSingle();

        if (!order) break;

        // Idempotent-ish: only move created -> paid
        if (order.status === "created") {
          await admin.from("market_orders").update({
            status: "paid",
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent || null,
          }).eq("id", orderId);

          const sellerOwner = (order as any).market_sellers?.owner_id as string | undefined;

          await insertNotif(order.buyer_id, "order_paid", "Order confirmed", "Payment received. You can message support/seller in-app.", `/messmarket/orders/${orderId}`);
          if (sellerOwner) {
            await insertNotif(sellerOwner, "order_paid", "New order paid", "A buyer has paid. Accept + ship within your SLA.", `/seller/orders`);
          }

          // Send order confirmation email
          try {
            console.log("📧 Sending order confirmation email for:", orderId);
            await sendOrderConfirmationEmail(admin, orderId);
          } catch (emailErr: any) {
            console.error("Email send failed (non-critical):", emailErr);
            // Don't fail webhook if email fails
          }

          await admin.from("audit_log").insert({
            actor_id: null,
            action: "order_paid",
            entity_type: "market_orders",
            entity_id: orderId,
            meta: { stripe_event_id: event.id, session_id: session.id },
          });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object;
        const orderId = pi?.metadata?.order_id;
        if (!orderId) break;

        const { data: order } = await admin.from("market_orders").select("id,status").eq("id", orderId).maybeSingle();
        if (!order) break;

        if (order.status === "created") {
          await admin.from("market_orders").update({
            status: "paid",
            stripe_payment_intent_id: pi.id,
          }).eq("id", orderId);

          await admin.from("audit_log").insert({
            actor_id: null,
            action: "order_paid_via_pi",
            entity_type: "market_orders",
            entity_id: orderId,
            meta: { stripe_event_id: event.id, payment_intent: pi.id },
          });
        }
        break;
      }

      case "payment_intent.canceled":
      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        const orderId = pi?.metadata?.order_id;
        if (!orderId) break;

        // Mark order cancelled if it never got paid, and release stock
        const { data: order } = await admin
          .from("market_orders")
          .select("id,status")
          .eq("id", orderId)
          .maybeSingle();

        if (order && (order.status === "created" || order.status === "paid")) {
          await admin.from("market_orders")
            .update({ status: "cancelled" })
            .eq("id", orderId);
        }

        await releaseStock(orderId);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session?.metadata?.order_id;
        if (!orderId) break;

        const { data: order } = await admin
          .from("market_orders")
          .select("id,status")
          .eq("id", orderId)
          .maybeSingle();

        if (order && order.status === "created") {
          await admin.from("market_orders").update({ status: "cancelled" }).eq("id", orderId);
          await releaseStock(orderId);
        }
        break;
      }

      case "charge.refunded": {
        const ch = event.data.object;
        const orderId = ch?.metadata?.order_id;
        if (!orderId) break;

        await admin.from("market_orders").update({ status: "refunded" }).eq("id", orderId);
        await releaseStock(orderId);

        await admin.from("audit_log").insert({
          actor_id: null,
          action: "order_refunded",
          entity_type: "market_orders",
          entity_id: orderId,
          meta: { stripe_event_id: event.id, charge: ch.id },
        });
        break;
      }

      case "account.updated": {
        const acct = event.data.object;
        const stripeAccountId = acct.id as string;

        const onboardingComplete = !!(acct.details_submitted && acct.charges_enabled && acct.payouts_enabled);

        await admin
          .from("market_sellers")
          .update({ stripe_onboarding_complete: onboardingComplete })
          .eq("stripe_account_id", stripeAccountId);

        await admin.from("audit_log").insert({
          actor_id: null,
          action: "seller_stripe_account_updated",
          entity_type: "market_sellers",
          entity_id: stripeAccountId,
          meta: { onboardingComplete, stripe_event_id: event.id },
        });
        break;
      }

      default:
        // no-op
        break;
    }

    return json({ ok: true });
  } catch (e: any) {
    // Always 200-ish is safer for webhook retries, but we'll return 200 with error for visibility.
    await admin.from("audit_log").insert({
      actor_id: null,
      action: "stripe_webhook_error",
      entity_type: "stripe",
      entity_id: event?.id || "unknown",
      meta: { message: String(e?.message || e), type: event?.type },
    });

    return json({ ok: false, error: String(e?.message || e) }, 200);
  }
});
