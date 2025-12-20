function env(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`missing_env_${name}`);
  return v;
}

export async function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null) {
  if (!hmacHeader) return false;
  const secret = env("SHOPIFY_WEBHOOK_SECRET");

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sigBuf)));

  // Basic compare (good enough here; Shopify retries anyway)
  return sigB64 === hmacHeader;
}

export function getWrapKitSkuPrefix() {
  return Deno.env.get("WRAP_KIT_SKU_PREFIX") || "WRAPKIT_";
}
