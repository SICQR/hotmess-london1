import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";

function env(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`missing_env_${name}`);
  return v;
}

export function getStripe() {
  return new Stripe(env("STRIPE_SECRET_KEY"), {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export function getStripeWebhookSecret() {
  return env("STRIPE_WEBHOOK_SECRET");
}
