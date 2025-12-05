import { handleOptions } from "../_shared/cors.ts";
import { bad, json, readJson } from "../_shared/respond.ts";
import { getAdminClient, requireUser, appBaseUrl } from "../_shared/supabase.ts";
import { getStripe } from "../_shared/stripe.ts";

type Body = {
  return_url?: string;
  refresh_url?: string;
  display_name?: string;
};

Deno.serve(async (req) => {
  const pre = handleOptions(req);
  if (pre) return pre;

  if (req.method !== "POST") return bad("method_not_allowed", 405);

  try {
    const user = await requireUser(req);
    const admin = getAdminClient();
    const stripe = getStripe();

    const body = await readJson<Body>(req);
    const base = appBaseUrl();
    const return_url = (body.return_url && body.return_url.startsWith(base)) ? body.return_url : `${base}/seller/settings`;
    const refresh_url = (body.refresh_url && body.refresh_url.startsWith(base)) ? body.refresh_url : `${base}/seller/settings`;

    // Fetch or create seller row
    const { data: existingSeller } = await admin
      .from("market_sellers")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    let seller = existingSeller;

    if (!seller) {
      const display = (body.display_name || "").trim() || "Seller";
      const ins = await admin.from("market_sellers").insert({
        owner_id: user.id,
        display_name: display,
        status: "pending",
      }).select("*").single();
      if (ins.error) throw new Error(ins.error.message);
      seller = ins.data;
    }

    // Create Stripe Connect account if missing
    let stripeAccountId = seller.stripe_account_id as string | null;

    if (!stripeAccountId) {
      const acct = await stripe.accounts.create({
        type: "express",
        country: "GB",
        email: user.email ?? undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          market_seller_id: seller.id,
          owner_id: user.id,
        },
      });

      stripeAccountId = acct.id;

      const up = await admin.from("market_sellers").update({
        stripe_account_id: stripeAccountId,
        stripe_onboarding_complete: false,
      }).eq("id", seller.id);

      if (up.error) throw new Error(up.error.message);

      await admin.from("audit_log").insert({
        actor_id: user.id,
        action: "seller_stripe_account_created",
        entity_type: "market_sellers",
        entity_id: seller.id,
        meta: { stripe_account_id: stripeAccountId },
      });
    }

    // Generate onboarding link
    const link = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url,
      return_url,
      type: "account_onboarding",
    });

    return json({ ok: true, stripe_account_id: stripeAccountId, url: link.url });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const code = msg === "not_authenticated" ? 401 : 400;
    return bad(msg, code);
  }
});
