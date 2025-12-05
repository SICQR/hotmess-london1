import { bad, json } from "../_shared/respond.ts";
import { getAdminClient } from "../_shared/supabase.ts";
import { verifyShopifyWebhook, getWrapKitSkuPrefix } from "../_shared/shopify.ts";

function headerAny(req: Request, names: string[]) {
  for (const n of names) {
    const v = req.headers.get(n);
    if (v) return v;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return bad("method_not_allowed", 405);

  const admin = getAdminClient();

  const rawBody = await req.text();
  const hmac = headerAny(req, ["X-Shopify-Hmac-Sha256", "x-shopify-hmac-sha256"]);
  const ok = await verifyShopifyWebhook(rawBody, hmac);

  if (!ok) return bad("invalid_shopify_signature", 401);

  const topic =
    headerAny(req, ["X-Shopify-Topic", "x-shopify-topic", "X-Shopify-Webhook-Topic", "x-shopify-webhook-topic"]) ||
    "unknown";

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return bad("invalid_json", 400);
  }

  try {
    if (topic.startsWith("orders/")) {
      const orderId = String(payload?.id || "");
      if (!orderId) return json({ ok: true });

      const email = (payload?.email || payload?.customer?.email || "").toLowerCase().trim();
      let user_id: string | null = null;

      if (email) {
        const { data } = await admin.auth.admin.getUserByEmail(email);
        user_id = data?.user?.id || null;
      }

      // Upsert shopify order
      await admin.from("shopify_orders").upsert({
        shopify_order_id: orderId,
        user_id,
        order_number: String(payload?.order_number ?? ""),
        status: String(payload?.financial_status ?? payload?.fulfillment_status ?? "unknown"),
        currency: String(payload?.currency ?? "GBP"),
        total_price: String(payload?.total_price ?? ""),
        raw: payload,
      }, { onConflict: "shopify_order_id" });

      // If paid, check for Wrap Kit lines and credit kit inventory to the seller
      if (topic === "orders/paid") {
        const prefix = getWrapKitSkuPrefix();
        const lineItems = Array.isArray(payload?.line_items) ? payload.line_items : [];
        const kitLines = lineItems
          .map((li: any) => ({ sku: String(li?.sku || ""), qty: Number(li?.quantity || 0) }))
          .filter((x) => x.sku && x.qty > 0 && x.sku.startsWith(prefix));

        if (user_id && kitLines.length) {
          const { data: seller } = await admin
            .from("market_sellers")
            .select("id, owner_id")
            .eq("owner_id", user_id)
            .maybeSingle();

          if (seller) {
            for (const k of kitLines) {
              const { data: inv } = await admin
                .from("seller_kit_inventory")
                .select("id, units_available")
                .eq("seller_id", seller.id)
                .eq("kit_sku", k.sku)
                .maybeSingle();

              if (!inv) {
                await admin.from("seller_kit_inventory").insert({
                  seller_id: seller.id,
                  kit_sku: k.sku,
                  units_available: k.qty,
                  last_shopify_order_id: orderId,
                });
              } else {
                await admin.from("seller_kit_inventory").update({
                  units_available: Number(inv.units_available || 0) + k.qty,
                  last_shopify_order_id: orderId,
                  updated_at: new Date().toISOString(),
                }).eq("id", inv.id);
              }
            }

            await admin.from("audit_log").insert({
              actor_id: null,
              action: "wrap_kit_credited",
              entity_type: "market_sellers",
              entity_id: seller.id,
              meta: { shopify_order_id: orderId, kits: kitLines },
            });
          }
        }
      }

      return json({ ok: true });
    }

    if (topic === "fulfillments/create") {
      const orderId = String(payload?.order_id || "");
      await admin.from("shopify_fulfillments").insert({
        shopify_order_id: orderId,
        tracking_number: String(payload?.tracking_number ?? ""),
        tracking_url: String(payload?.tracking_url ?? ""),
        raw: payload,
      });
      return json({ ok: true });
    }

    // Unhandled topics acknowledged
    return json({ ok: true, topic });
  } catch (e: any) {
    await admin.from("audit_log").insert({
      actor_id: null,
      action: "shopify_webhook_error",
      entity_type: "shopify",
      entity_id: String(payload?.id || payload?.order_id || "unknown"),
      meta: { topic, message: String(e?.message || e) },
    });

    // Return 200 to avoid repeat storms; Shopify retries anyway
    return json({ ok: false, error: String(e?.message || e), topic }, 200);
  }
});
