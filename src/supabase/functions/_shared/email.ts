// email.ts - Email service for order confirmations and notifications

import { SupabaseClient } from "jsr:@supabase/supabase-js@2";

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

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
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 2px solid #ff0055;">
              <h1 style="margin: 0; color: #ff0055; font-size: 32px; font-weight: bold; letter-spacing: 2px;">
                HOTMESS LONDON
              </h1>
              <p style="margin: 8px 0 0; color: #ff0055; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
                MessMarket
              </p>
            </td>
          </tr>

          <!-- Order Confirmed -->
          <tr>
            <td style="padding: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 24px;">
                    <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                      Order Confirmed ✓
                    </h2>
                    <p style="margin: 8px 0 0; color: #888888; font-size: 16px;">
                      Thanks ${buyer_name || buyer_email}! Your order has been received.
                    </p>
                  </td>
                </tr>

                <!-- Order Number -->
                <tr>
                  <td style="padding: 20px; background-color: #1a1a1a; border-left: 3px solid #ff0055; margin-bottom: 24px;">
                    <div style="color: #888888; font-size: 14px; margin-bottom: 4px;">Order Number</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: bold; font-family: monospace;">
                      #${order_id.slice(0, 8).toUpperCase()}
                    </div>
                  </td>
                </tr>

                <!-- Items -->
                <tr>
                  <td style="padding-top: 32px;">
                    <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 18px; font-weight: bold;">
                      Order Items
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${itemsHtml}
                    </table>
                  </td>
                </tr>

                <!-- Totals -->
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
                        <td style="padding: 16px 0 8px; color: #ffffff; font-size: 18px; font-weight: bold; border-top: 2px solid #2a2a2a;">
                          Total
                        </td>
                        <td style="padding: 16px 0 8px; color: #ff0055; font-size: 18px; font-weight: bold; text-align: right; border-top: 2px solid #2a2a2a;">
                          ${formatPrice(total_pence)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Shipping -->
                <tr>
                  <td style="padding-top: 32px;">
                    <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 18px; font-weight: bold;">
                      Shipping Address
                    </h3>
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

                <!-- Seller Info -->
                <tr>
                  <td style="padding-top: 32px;">
                    <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 18px; font-weight: bold;">
                      Seller
                    </h3>
                    <div style="padding: 20px; background-color: #1a1a1a; border-radius: 4px;">
                      <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: bold;">
                        ${seller_name}
                      </p>
                      <p style="margin: 8px 0 0; color: #888888; font-size: 14px;">
                        ${fulfilment_mode === "white_label_partner" ? "Fulfilled by HOTMESS LONDON" : "Seller fulfilled"}
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- What's Next -->
                <tr>
                  <td style="padding-top: 32px;">
                    <h3 style="margin: 0 0 16px; color: #ffffff; font-size: 18px; font-weight: bold;">
                      What's Next?
                    </h3>
                    <div style="padding: 20px; background-color: #1a1a1a; border-radius: 4px;">
                      <p style="margin: 0; color: #888888; font-size: 14px; line-height: 1.6;">
                        1. The seller will confirm your order<br>
                        2. You'll receive tracking info once shipped<br>
                        3. Track your order status in your account
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-top: 40px;">
                    <a href="${appUrl}/messmarket/orders/${order_id}" 
                       style="display: inline-block; padding: 16px 48px; background-color: #ff0055; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 4px; letter-spacing: 1px;">
                      VIEW ORDER
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid #1a1a1a; text-align: center;">
              <p style="margin: 0 0 16px; color: #888888; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@hotmess.london" style="color: #ff0055; text-decoration: none;">support@hotmess.london</a>
              </p>
              <p style="margin: 0; color: #666666; font-size: 12px;">
                © 2025 HOTMESS LONDON • MessMarket<br>
                Masculine nightlife OS for queer men 18+
              </p>
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
${items.map((item) => `${item.title} - Qty: ${item.quantity} × ${formatPrice(item.unit_price_pence)} = ${formatPrice(item.unit_price_pence * item.quantity)}`).join("\n")}

Subtotal: ${formatPrice(subtotal_pence)}
Shipping: ${formatPrice(shipping_pence)}
Total: ${formatPrice(total_pence)}

Shipping Address:
${shipping_address.name || buyer_name || ""}
${shipping_address.line1 || ""}
${shipping_address.line2 || ""}
${shipping_address.city || ""}, ${shipping_address.postcode || shipping_address.postal_code || ""}
${shipping_address.country || "UK"}

Seller: ${seller_name}
Fulfilment: ${fulfilment_mode === "white_label_partner" ? "Fulfilled by HOTMESS LONDON" : "Seller fulfilled"}

What's Next?
1. The seller will confirm your order
2. You'll receive tracking info once shipped
3. Track your order status in your account

View your order: ${appUrl}/messmarket/orders/${order_id}

Questions? Contact us at support@hotmess.london

© 2025 HOTMESS LONDON • MessMarket
  `.trim();

  return { subject, html, text };
}

// ============================================================================
// SEND EMAIL FUNCTION
// ============================================================================

export async function sendOrderConfirmationEmail(admin: SupabaseClient, orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("📧 Sending order confirmation email for:", orderId);

    // Get order with all details
    const { data: order, error: orderError } = await admin
      .from("market_orders")
      .select(
        `
        *,
        market_sellers!inner(id, display_name),
        market_order_items(title, quantity, unit_price_pence)
      `,
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("Failed to fetch order:", orderError);
      return { success: false, error: "Order not found" };
    }

    // Get buyer info
    const { data: { user: buyer }, error: buyerError } = await admin.auth.admin.getUserById(order.buyer_id);

    if (buyerError || !buyer?.email) {
      console.error("Failed to fetch buyer:", buyerError);
      return { success: false, error: "Buyer not found" };
    }

    const seller = (order as any).market_sellers;
    const items = (order as any).market_order_items || [];

    // Generate email HTML
    const email = getOrderConfirmationEmailHTML({
      order_id: order.id,
      buyer_email: buyer.email,
      buyer_name: buyer.user_metadata?.name,
      items,
      subtotal_pence: order.subtotal_pence,
      shipping_pence: order.shipping_pence,
      total_pence: order.total_pence,
      shipping_address: order.buyer_shipping || {},
      seller_name: seller?.display_name || "Unknown Seller",
      fulfilment_mode: order.fulfilment_mode || "seller_fulfilled",
    });

    console.log("📧 Email generated:", {
      to: buyer.email,
      subject: email.subject,
    });

    // Store in notifications table (email will be sent via Supabase Auth or external provider)
    await admin.from("notifications").insert({
      user_id: order.buyer_id,
      channel: "email",
      type: "order_confirmation",
      title: email.subject,
      body: email.text,
      href: `/messmarket/orders/${orderId}`,
    });

    // Log email sent
    await admin.from("audit_log").insert({
      actor_id: null,
      action: "email_sent",
      entity_type: "market_orders",
      entity_id: orderId,
      meta: {
        to: buyer.email,
        subject: email.subject,
        type: "order_confirmation",
      },
    });

    // TODO: For production, integrate with email provider (Resend, SendGrid, etc.)
    // Example with Resend:
    // const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    // if (RESEND_API_KEY) {
    //   await fetch("https://api.resend.com/emails", {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${RESEND_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       from: "HOTMESS LONDON <orders@hotmess.london>",
    //       to: [buyer.email],
    //       subject: email.subject,
    //       html: email.html,
    //     }),
    //   });
    // }

    return { success: true };
  } catch (err: any) {
    console.error("Email send error:", err);
    return { success: false, error: err.message };
  }
}
