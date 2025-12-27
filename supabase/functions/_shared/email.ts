// email.ts - Email service for order confirmations and notifications

import { SupabaseClient } from "jsr:@supabase/supabase-js@2";

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

function getOrderConfirmationEmailHTML(data: {
  order_id: string;
  buyer_email: string;
  buyer_name?: string;
  items: Array<{ title: string; quantity: number; unit_price_pence: number }>;
  subtotal_pence: number;
  shipping_pence: number;
  total_pence: number;
  shipping_address: any;
  seller_name: string;
  fulfilment_mode: string;
}): { subject: string; html: string; text: string } {
  const {
    order_id,
    buyer_email,
    buyer_name,
    items,
    subtotal_pence,
    shipping_pence,
    total_pence,
    shipping_address,
    seller_name,
    fulfilment_mode,
  } = data;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a;">
        <div style="color: #ffffff; font-size: 16px; margin-bottom: 4px;">${item.title}</div>
        <div style="color: #888888; font-size: 14px;">Qty: ${item.quantity} × ${formatPrice(item.unit_price_pence)}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; text-align: right; color: #ffffff;">
        ${formatPrice(item.unit_price_pence * item.quantity)}
      </td>
    </tr>
  `,
    )
    .join("");

  const appUrl = Deno.env.get("APP_URL") || "https://hotmess.london";

  const subject = `Order Confirmed #${order_id.slice(0, 8)} - HOTMESS LONDON`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #1a1a1a;">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 2px solid #ff0055;">
              <h1 style="margin: 0; color: #ff0055; font-size: 32px; font-weight: bold; letter-spacing: 2px;">HOTMESS LONDON</h1>
              <p style="margin: 8px 0 0; color: #ff0055; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">MessMarket</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 24px;">
                    <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Order Confirmed ✓</h2>
                    <p style="margin: 8px 0 0; color: #888888; font-size: 16px;">Thanks ${buyer_name || buyer_email}! Your order has been received.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px; background-color: #1a1a1a; border-left: 3px solid #ff0055; margin-bottom: 24px;">
                    <div style="color: #888888; font-size: 14px; margin-bottom: 4px;">Order Number</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: bold; font-family: monospace;">#${order_id.slice(0, 8).toUpperCase()}</div>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top: 32px;">
                    <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 18px; font-weight: bold;">Order Items</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">${itemsHtml}</table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #888888;">Subtotal</td>
                        <td style="padding: 8px 0; color: #ffffff; text-align: right;">${formatPrice(subtotal_pence)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #888888;">Shipping</td>
                        <td style="padding: 8px 0; color: #ffffff; text-align: right;">${formatPrice(shipping_pence)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0 8px; color: #ffffff; font-size: 18px; font-weight: bold; border-top: 2px solid #2a2a2a;">Total</td>
                        <td style="padding: 16px 0 8px; color: #ff0055; font-size: 18px; font-weight: bold; text-align: right; border-top: 2px solid #2a2a2a;">${formatPrice(total_pence)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top: 32px;">
                    <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 18px; font-weight: bold;">Shipping Address</h3>
                    <div style="padding: 20px; background-color: #1a1a1a; border-radius: 4px;">
                      <p style="margin: 0; color: #ffffff; line-height: 1.6;">
                        ${shipping_address.name || buyer_name || ""}<br>
                        ${shipping_address.line1 || ""}<br>
                        ${shipping_address.line2 ? shipping_address.line2 + "<br>" : ""}
                        ${shipping_address.city || ""}, ${shipping_address.postcode || shipping_address.postal_code || ""}<br>
                        ${shipping_address.country || "UK"}
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top: 32px;">
                    <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 18px; font-weight: bold;">Seller</h3>
                    <div style="padding: 20px; background-color: #1a1a1a; border-radius: 4px;">
                      <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: bold;">${seller_name}</p>
                      <p style="margin: 8px 0 0; color: #888888; font-size: 14px;">
                        ${fulfilment_mode === "white_label_partner" ? "Fulfilled by HOTMESS LONDON" : "Seller fulfilled"}
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding-top: 40px;">
                    <a href="${appUrl}/messmarket/orders/${order_id}" style="display: inline-block; padding: 16px 48px; background-color: #ff0055; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 4px; letter-spacing: 1px;">
                      VIEW ORDER
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid #1a1a1a; text-align: center;">
              <p style="margin: 0 0 16px; color: #888888; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@hotmess.london" style="color: #ff0055; text-decoration: none;">support@hotmess.london</a>
              </p>
              <p style="margin: 0; color: #666666; font-size: 12px;">© 2025 HOTMESS LONDON • MessMarket</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
HOTMESS LONDON - Order Confirmed

Thanks ${buyer_name || buyer_email}! Your order has been received.

Order Number: #${order_id.slice(0, 8).toUpperCase()}

Order Items:
${items
  .map(
    (item) =>
      `${item.title} - Qty: ${item.quantity} × ${formatPrice(item.unit_price_pence)} = ${formatPrice(item.unit_price_pence * item.quantity)}`,
  )
  .join("\n")}

Subtotal: ${formatPrice(subtotal_pence)}
Shipping: ${formatPrice(shipping_pence)}
Total: ${formatPrice(total_pence)}

View your order: ${appUrl}/messmarket/orders/${order_id}

`;

  return { subject, html, text };
}

async function sendEmail(to: string, subject: string, html: string, text: string) {
  const webhookUrl = Deno.env.get("EMAIL_WEBHOOK_URL");
  const apiKey = Deno.env.get("RESEND_API_KEY");

  // 1) Resend (preferred)
  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: Deno.env.get("EMAIL_FROM") || "HOTMESS LONDON <noreply@hotmess.london>",
        to,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`resend_failed_${res.status}_${errText}`);
    }

    return;
  }

  // 2) Webhook fallback
  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ to, subject, html, text }),
    });
    if (!res.ok) throw new Error(`email_webhook_failed_${res.status}`);
    return;
  }

  // 3) No-op in dev
  console.log("EMAIL_DISABLED", { to, subject });
}

export async function sendOrderConfirmationEmail(admin: SupabaseClient, orderId: string) {
  // Get order details
  const { data: order, error: orderErr } = await admin
    .from("market_orders")
    .select("id, buyer_id, subtotal_pence, shipping_pence, total_pence, currency, buyer_shipping, fulfilment_mode, market_sellers(id, display_name)")
    .eq("id", orderId)
    .single();

  if (orderErr || !order) throw new Error(`order_not_found_${orderErr?.message || ""}`);

  // Get buyer email
  const { data: buyer, error: buyerErr } = await admin
    .from("profiles")
    .select("email, display_name")
    .eq("id", order.buyer_id)
    .maybeSingle();

  const buyerEmail = (buyer as any)?.email;
  if (!buyerEmail) throw new Error(`buyer_email_missing_${buyerErr?.message || ""}`);

  // Get items
  const { data: items, error: itemsErr } = await admin
    .from("market_order_items")
    .select("title, quantity, unit_price_pence")
    .eq("order_id", orderId);

  if (itemsErr) throw new Error(`items_fetch_failed_${itemsErr.message}`);

  const sellerName = ((order as any).market_sellers?.display_name as string | undefined) || "Seller";

  const { subject, html, text } = getOrderConfirmationEmailHTML({
    order_id: order.id,
    buyer_email: buyerEmail,
    buyer_name: (buyer as any)?.display_name || undefined,
    items: (items as any) || [],
    subtotal_pence: Number(order.subtotal_pence || 0),
    shipping_pence: Number(order.shipping_pence || 0),
    total_pence: Number(order.total_pence || 0),
    shipping_address: (order as any).buyer_shipping || {},
    seller_name: sellerName,
    fulfilment_mode: String(order.fulfilment_mode || ""),
  });

  await sendEmail(buyerEmail, subject, html, text);
}
