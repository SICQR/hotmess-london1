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

  function purchaseXpFromTotalPence(totalPence: number) {
    // 10 XP per £ => total_pence / 10
    return Math.max(0, Math.floor(Number(totalPence || 0) / 10));
  }

  async function broadcastPaymentSuccess(userId: string, xpEarned: number) {
    try {
      const channel = (admin as any).channel?.("os-notifications");
      if (!channel?.send) return;
      await channel.send({
        type: "broadcast",
        event: "payment_success",
        payload: {
          user_id: userId,
          xp_earned: xpEarned,
          new_level_check: true,
        },
      });
      try {
        await (admin as any).removeChannel?.(channel);
      } catch {
        // no-op
      }
    } catch (e: any) {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "realtime_broadcast_error",
        entity_type: "stripe",
        entity_id: event?.id || "unknown",
        meta: { message: String(e?.message || e) },
      });
    }
  }

  async function markOrderPaid(orderId: string, patch: Record<string, unknown>) {
    const attempt = await admin.from("market_orders").update(patch).eq("id", orderId);
    if (!attempt.error) return;

    const msg = String(attempt.error.message || "");
    if (msg.includes("Could not find the 'paid_at'") || msg.includes("paid_at") && msg.includes("schema cache")) {
      const { paid_at: _paidAt, ...rest } = patch as any;
      await admin.from("market_orders").update(rest).eq("id", orderId);
      return;
    }

    throw new Error(attempt.error.message);
  }

  async function awardPurchaseXp(params: {
    orderId: string;
    userId: string;
    totalPence: number;
    currency: string;
  }) {
    const xp = purchaseXpFromTotalPence(params.totalPence);
    if (xp <= 0) return;

    const existing = await admin
      .from("xp_ledger")
      .select("id")
      .eq("user_id", params.userId)
      .eq("kind", "purchase")
      .eq("ref_id", params.orderId)
      .limit(1)
      .maybeSingle();

    if (existing.data?.id) return;

    const ins = await admin.from("xp_ledger").insert({
      user_id: params.userId,
      kind: "purchase",
      amount: xp,
      ref_id: params.orderId,
      metadata: {
        currency: params.currency,
        total_pence: params.totalPence,
        stripe_event_id: event.id,
      },
    });

    if (ins.error) {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "xp_award_error",
        entity_type: "xp_ledger",
        entity_id: params.orderId,
        meta: { stripe_event_id: event.id, message: String(ins.error.message || ins.error) },
      });
    } else {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "xp_awarded_purchase",
        entity_type: "market_orders",
        entity_id: params.orderId,
        meta: { stripe_event_id: event.id, amount: xp },
      });
    }
  }

  async function awardXpBonusIdempotent(params: {
    userId: string;
    amount: number;
    dedupe: string;
    meta: Record<string, unknown>;
    legacy?: { kind: string; ref_id: string };
  }): Promise<{ awarded: boolean; amount: number }> {
    if (params.amount <= 0) return { awarded: false, amount: 0 };

    try {
      const existing = await admin
        .from("xp_ledger")
        .select("id")
        .eq("user_id", params.userId)
        .eq("reason", "bonus")
        .eq("meta->>dedupe", params.dedupe)
        .limit(1)
        .maybeSingle();
      if (existing.data?.id) return { awarded: false, amount: params.amount };

      const ins = await admin.from("xp_ledger").insert({
        user_id: params.userId,
        reason: "bonus",
        amount: params.amount,
        meta: {
          ...params.meta,
          dedupe: params.dedupe,
          stripe_event_id: event.id,
        },
      });

      if (!ins.error) return { awarded: true, amount: params.amount };

      const msg = String(ins.error.message || "");
      if (!msg.toLowerCase().includes("reason") && !msg.toLowerCase().includes("meta")) {
        await admin.from("audit_log").insert({
          actor_id: null,
          action: "xp_award_error",
          entity_type: "xp_ledger",
          entity_id: params.dedupe,
          meta: { stripe_event_id: event.id, message: String(ins.error.message || ins.error) },
        });
        return { awarded: false, amount: params.amount };
      }
    } catch {
      // ignore and try legacy
    }

    if (!params.legacy) return { awarded: false, amount: params.amount };

    const existingLegacy = await admin
      .from("xp_ledger")
      .select("id")
      .eq("user_id", params.userId)
      .eq("kind", params.legacy.kind)
      .eq("ref_id", params.legacy.ref_id)
      .limit(1)
      .maybeSingle();

    if (existingLegacy.data?.id) return { awarded: false, amount: params.amount };

    const insLegacy = await admin.from("xp_ledger").insert({
      user_id: params.userId,
      kind: params.legacy.kind,
      amount: params.amount,
      ref_id: params.legacy.ref_id,
      metadata: {
        ...params.meta,
        dedupe: params.dedupe,
        stripe_event_id: event.id,
      },
    });

    if (insLegacy.error) {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "xp_award_error",
        entity_type: "xp_ledger",
        entity_id: params.dedupe,
        meta: { stripe_event_id: event.id, message: String(insLegacy.error.message || insLegacy.error) },
      });
      return { awarded: false, amount: params.amount };
    }

    return { awarded: true, amount: params.amount };
  }

  async function awardPurchaseXp(params: { orderId: string; userId: string; totalPence: number; currency: string }) {
    const xp = purchaseXpFromTotalPence(params.totalPence);
    const res = await awardXpBonusIdempotent({
      userId: params.userId,
      amount: xp,
      dedupe: `order:${params.orderId}:purchase_xp`,
      meta: {
        kind: "purchase_xp",
        order_id: params.orderId,
        currency: params.currency,
        total_pence: params.totalPence,
      },
      legacy: { kind: "purchase", ref_id: params.orderId },
    });

    if (res.awarded) {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "xp_awarded_purchase",
        entity_type: "market_orders",
        entity_id: params.orderId,
        meta: { stripe_event_id: event.id, amount: res.amount },
      });
      await broadcastPaymentSuccess(params.userId, res.amount);
    }
  }

  async function handleDigitalTrackPurchase(metadata: Record<string, string> | null | undefined, fallbackUserId: string, orderId: string) {
    const productType = String(metadata?.product_type || "").trim();
    if (productType !== "digital_track") return;

    const trackId = String(metadata?.track_id || "").trim();
    if (!trackId) return;

    const userId = String(metadata?.user_id || fallbackUserId || "").trim();
    if (!userId) return;

    const trackTitle = String(metadata?.track_title || "").trim();
    const buyerUsername = String(metadata?.buyer_username || "").trim();

    const now = Date.now();
    const startsAt = new Date(now).toISOString();
    const expiresAt = new Date(now + 6 * 60 * 60 * 1000).toISOString();

    const lat = metadata?.user_lat ? Number(metadata.user_lat) : NaN;
    const lng = metadata?.user_lng ? Number(metadata.user_lng) : NaN;
    const city = (metadata?.city || metadata?.city_slug || "").trim() || null;

    const beaconDedupe = `order:${orderId}:track:${trackId}:listener_beacon`;
    try {
      const existing = await admin
        .from("beacons")
        .select("id")
        .eq("action_config->>dedupe", beaconDedupe)
        .limit(1)
        .maybeSingle();
      if (!existing.error && existing.data?.id) {
        // already spawned
      } else {
        const ins = await admin.from("beacons").insert({
          status: "live",
          type: "pulse",
          title: `NOW SPINNING: ${trackTitle || "TRACK"}`,
          starts_at: startsAt,
          expires_at: expiresAt,
          duration_preset_hours: 6,
          map_visibility: true,
          preview_mode: false,
          city,
          lat: Number.isFinite(lat) ? lat : null,
          lng: Number.isFinite(lng) ? lng : null,
          action_route: "/records",
          action_config: {
            product_type: "digital_track",
            track_id: trackId,
            track_title: trackTitle || null,
            buyer_username: buyerUsername || null,
            buyer_id: userId,
            is_user_spawned: true,
            dedupe: beaconDedupe,
            stripe_event_id: event.id,
            order_id: orderId,
            expires_at: expiresAt,
          },
          created_by: userId,
        });

        if (ins.error) {
          await admin.from("audit_log").insert({
            actor_id: null,
            action: "digital_track_beacon_spawn_error",
            entity_type: "beacons",
            entity_id: trackId,
            meta: { stripe_event_id: event.id, message: String(ins.error.message || ins.error) },
          });
        }
      }
    } catch (e: any) {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "digital_track_beacon_spawn_error",
        entity_type: "beacons",
        entity_id: trackId,
        meta: { stripe_event_id: event.id, message: String(e?.message || e) },
      });
    }

    const xpRes = await awardXpBonusIdempotent({
      userId,
      amount: 150,
      dedupe: `order:${orderId}:track:${trackId}:label_support_xp`,
      meta: {
        kind: "label_purchase",
        order_id: orderId,
        track_id: trackId,
        track_title: trackTitle || null,
      },
      legacy: { kind: "bonus", ref_id: trackId },
    });

    if (xpRes.awarded) {
      await broadcastPaymentSuccess(userId, xpRes.amount);
    }
  }

  async function activateBeaconFromMetadata(metadata: Record<string, string> | null | undefined) {
    const beaconId = (metadata?.beacon_id || metadata?.spawn_beacon_id || metadata?.globe_beacon_id || "").trim();
    if (!beaconId) return;

    const patch: Record<string, unknown> = {
      status: "active",
      starts_at: new Date().toISOString(),
    };

    const lat = metadata?.geo_lat ? Number(metadata.geo_lat) : NaN;
    const lng = metadata?.geo_lng ? Number(metadata.geo_lng) : NaN;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      patch.geo_lat = lat;
      patch.geo_lng = lng;
    }
    if (metadata?.city_slug) patch.city_slug = String(metadata.city_slug).slice(0, 100);

    const up = await admin.from("beacons").update(patch).eq("id", beaconId);
    if (up.error) {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "beacon_activate_error",
        entity_type: "beacons",
        entity_id: beaconId,
        meta: { stripe_event_id: event.id, message: String(up.error.message || up.error) },
      });
    } else {
      await admin.from("audit_log").insert({
        actor_id: null,
        action: "beacon_activated_from_purchase",
        entity_type: "beacons",
        entity_id: beaconId,
        meta: { stripe_event_id: event.id },
      });
    }
  }

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

        if (order.status === "created") {
          await markOrderPaid(orderId, {
            status: "paid",
            paid_at: new Date().toISOString(),
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent || null,
          });
        }

        const sellerOwner = (order as any).market_sellers?.owner_id as string | undefined;

        await awardPurchaseXp({
          orderId,
          userId: order.buyer_id,
          totalPence: Number(order.total_pence || 0),
          currency: String(order.currency || "GBP"),
        });

        await handleDigitalTrackPurchase(session?.metadata, order.buyer_id, orderId);

        await activateBeaconFromMetadata(session?.metadata);

        if (order.status === "created") {
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
