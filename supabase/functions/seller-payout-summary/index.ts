import { handleOptions } from "../_shared/cors.ts";
import { bad, json } from "../_shared/respond.ts";
import { getAdminClient, requireUser } from "../_shared/supabase.ts";
import { getStripe } from "../_shared/stripe.ts";

Deno.serve(async (req) => {
  const pre = handleOptions(req);
  if (pre) return pre;

  if (req.method !== "POST") return bad("method_not_allowed", 405);

  try {
    const user = await requireUser(req);
    const admin = getAdminClient();
    const stripe = getStripe();

    // Find seller by owner_id
    const { data: seller, error } = await admin
      .from("market_sellers")
      .select("id, owner_id, status, stripe_account_id, stripe_onboarding_complete")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error || !seller) {
      return bad("no_seller_profile", 404);
    }

    if (!seller.stripe_account_id) {
      return json({
        ok: true,
        onboarding: false,
        reason: "no_stripe_account",
      });
    }

    if (!seller.stripe_onboarding_complete) {
      return json({
        ok: true,
        onboarding: false,
        reason: "onboarding_incomplete",
      });
    }

    const acctId = seller.stripe_account_id as string;

    // Fetch balance and recent payouts from Stripe
    const [balance, payouts] = await Promise.all([
      stripe.balance.retrieve({ stripeAccount: acctId }),
      stripe.payouts.list({ limit: 10 }, { stripeAccount: acctId }),
    ]);

    const available = (balance.available || []).map((b: any) => ({
      amount: b.amount,
      currency: b.currency,
    }));

    const pending = (balance.pending || []).map((b: any) => ({
      amount: b.amount,
      currency: b.currency,
    }));

    const payoutList = (payouts.data || []).map((p: any) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      arrival_date: p.arrival_date ? new Date(p.arrival_date * 1000).toISOString() : null,
      created: p.created ? new Date(p.created * 1000).toISOString() : null,
      description: p.description || null,
    }));

    return json({
      ok: true,
      onboarding: true,
      seller_id: seller.id,
      stripe_account_id: acctId,
      balance: { available, pending },
      payouts: payoutList,
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const code = msg === "not_authenticated" ? 401 : 400;
    return bad(msg, code);
  }
});
