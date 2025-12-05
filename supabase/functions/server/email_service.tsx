/**
 * HOTMESS Email Service - Resend Integration
 * Sends branded transactional emails
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const FROM_EMAIL = from || Deno.env.get('HOTMESS_FROM_EMAIL') || 'HOTMESS <notifications@hotmess.london>';
  
  if (!RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not set - email not sent to:', to);
    return { success: false, error: 'No API key configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Email send failed:', data);
      return { success: false, error: data.message };
    }

    console.log('✅ Email sent to', to, '- ID:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Email templates with HOTMESS branding
 */
export const EMAIL_TEMPLATES = {
  /**
   * Welcome email after signup
   */
  welcome: (name: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { background: #000; color: #fff; padding: 40px 20px; }
        .logo { color: #ff1694; font-size: 48px; text-transform: uppercase; font-weight: 900; letter-spacing: -2px; margin-bottom: 20px; }
        .content { font-size: 18px; line-height: 1.6; }
        .button { display: inline-block; background: #ff1694; color: #fff; padding: 15px 40px; text-decoration: none; margin-top: 30px; text-transform: uppercase; font-weight: 900; letter-spacing: 1px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">HOTMESS LONDON</div>
        <div class="content">
          <p style="font-size: 24px; font-weight: 700;">Welcome, ${name}.</p>
          <p>You're in. Your nightlife OS is ready.</p>
          <p>HOTMESS LONDON is a men-only queer nightlife platform combining care-first principles with kink aesthetics. Scan beacons, discover events, connect with the scene.</p>
          <a href="https://hotmess.london" class="button">Open Platform</a>
        </div>
        <div class="footer">
          <p>HOTMESS LONDON - Built for the bold.</p>
          <p>This is a transactional email. You're receiving this because you signed up.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * Order confirmation email
   */
  purchaseConfirmation: (orderDetails: { id: string; total: string; items: string }): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { background: #000; color: #fff; padding: 40px 20px; }
        .logo { color: #ff1694; font-size: 36px; text-transform: uppercase; font-weight: 900; margin-bottom: 20px; }
        .content { font-size: 16px; line-height: 1.6; }
        .order-box { background: #111; border: 2px solid #ff1694; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: #ff1694; color: #fff; padding: 15px 40px; text-decoration: none; margin-top: 20px; text-transform: uppercase; font-weight: 900; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">ORDER CONFIRMED</div>
        <div class="content">
          <p>Your order is confirmed. We'll email you when it ships.</p>
          <div class="order-box">
            <p style="margin: 0;"><strong>Order #${orderDetails.id}</strong></p>
            <p style="margin: 10px 0 0 0;">Total: £${orderDetails.total}</p>
            <p style="margin: 10px 0 0 0; color: #999;">${orderDetails.items}</p>
          </div>
          <a href="https://hotmess.london/orders" class="button">View Order</a>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * Beacon match notification
   */
  beaconMatch: (matchName: string, beaconName: string, beaconLocation: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { background: #000; color: #fff; padding: 40px 20px; }
        .logo { color: #ff1694; font-size: 36px; text-transform: uppercase; font-weight: 900; margin-bottom: 20px; }
        .content { font-size: 18px; line-height: 1.6; }
        .match-box { background: #111; border: 2px solid #ff1694; padding: 20px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: #ff1694; color: #fff; padding: 15px 40px; text-decoration: none; margin-top: 20px; text-transform: uppercase; font-weight: 900; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">NEW CONNECTION</div>
        <div class="content">
          <p style="font-size: 20px; font-weight: 700;">${matchName} was also at ${beaconName}</p>
          <div class="match-box">
            <p style="margin: 0; font-size: 16px; color: #999;">📍 ${beaconLocation}</p>
            <p style="margin: 10px 0 0 0;">You both scanned the beacon. Start a chat.</p>
          </div>
          <a href="https://hotmess.london/beacon-matches" class="button">View Matches</a>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * Event ticket purchase confirmation
   */
  ticketPurchase: (eventName: string, ticketDetails: string, qrCode?: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { background: #000; color: #fff; padding: 40px 20px; }
        .logo { color: #ff1694; font-size: 36px; text-transform: uppercase; font-weight: 900; margin-bottom: 20px; }
        .content { font-size: 16px; line-height: 1.6; }
        .ticket-box { background: #111; border: 2px solid #ff1694; padding: 30px; margin: 20px 0; text-align: center; }
        .qr { max-width: 200px; margin: 20px auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">TICKET CONFIRMED</div>
        <div class="content">
          <p style="font-size: 22px; font-weight: 700;">${eventName}</p>
          <div class="ticket-box">
            ${qrCode ? `<img src="${qrCode}" alt="QR Code" class="qr" />` : ''}
            <p style="margin: 20px 0 0 0;">${ticketDetails}</p>
            <p style="margin: 20px 0 0 0; color: #999; font-size: 14px;">Show this QR code at the door</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * Vendor approval notification
   */
  vendorApproved: (vendorName: string, stripeOnboardingUrl: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { background: #000; color: #fff; padding: 40px 20px; }
        .logo { color: #ff1694; font-size: 36px; text-transform: uppercase; font-weight: 900; margin-bottom: 20px; }
        .content { font-size: 16px; line-height: 1.6; }
        .button { display: inline-block; background: #ff1694; color: #fff; padding: 15px 40px; text-decoration: none; margin-top: 20px; text-transform: uppercase; font-weight: 900; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">VENDOR APPROVED</div>
        <div class="content">
          <p style="font-size: 20px; font-weight: 700;">Welcome to the marketplace, ${vendorName}.</p>
          <p>Your vendor application has been approved. Complete your Stripe setup to start selling.</p>
          <a href="${stripeOnboardingUrl}" class="button">Complete Setup</a>
          <p style="margin-top: 30px; color: #999; font-size: 14px;">This link expires in 7 days.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  /**
   * Product shipped notification
   */
  productShipped: (trackingNumber: string, carrier: string): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { background: #000; color: #fff; padding: 40px 20px; }
        .logo { color: #ff1694; font-size: 36px; text-transform: uppercase; font-weight: 900; margin-bottom: 20px; }
        .content { font-size: 16px; line-height: 1.6; }
        .tracking-box { background: #111; border: 2px solid #ff1694; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: #ff1694; color: #fff; padding: 15px 40px; text-decoration: none; margin-top: 20px; text-transform: uppercase; font-weight: 900; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">SHIPPED</div>
        <div class="content">
          <p>Your order is on the way.</p>
          <div class="tracking-box">
            <p style="margin: 0;"><strong>Carrier:</strong> ${carrier}</p>
            <p style="margin: 10px 0 0 0;"><strong>Tracking:</strong> ${trackingNumber}</p>
          </div>
          <a href="https://hotmess.london/orders" class="button">Track Order</a>
        </div>
      </div>
    </body>
    </html>
  `,
};

/**
 * Helper: Send welcome email
 */
export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to HOTMESS LONDON',
    html: EMAIL_TEMPLATES.welcome(name),
  });
}

/**
 * Helper: Send purchase confirmation
 */
export async function sendPurchaseEmail(email: string, orderDetails: { id: string; total: string; items: string }) {
  return sendEmail({
    to: email,
    subject: `Order #${orderDetails.id} Confirmed`,
    html: EMAIL_TEMPLATES.purchaseConfirmation(orderDetails),
  });
}

/**
 * Helper: Send beacon match notification
 */
export async function sendBeaconMatchEmail(email: string, matchName: string, beaconName: string, beaconLocation: string) {
  return sendEmail({
    to: email,
    subject: `New connection at ${beaconName}`,
    html: EMAIL_TEMPLATES.beaconMatch(matchName, beaconName, beaconLocation),
  });
}

/**
 * Helper: Send ticket purchase confirmation
 */
export async function sendTicketEmail(email: string, eventName: string, ticketDetails: string, qrCode?: string) {
  return sendEmail({
    to: email,
    subject: `Ticket confirmed: ${eventName}`,
    html: EMAIL_TEMPLATES.ticketPurchase(eventName, ticketDetails, qrCode),
  });
}

/**
 * Helper: Send vendor approval
 */
export async function sendVendorApprovalEmail(email: string, vendorName: string, stripeUrl: string) {
  return sendEmail({
    to: email,
    subject: 'Your vendor application is approved',
    html: EMAIL_TEMPLATES.vendorApproved(vendorName, stripeUrl),
  });
}

/**
 * Helper: Send shipping notification
 */
export async function sendShippingEmail(email: string, trackingNumber: string, carrier: string) {
  return sendEmail({
    to: email,
    subject: 'Your order has shipped',
    html: EMAIL_TEMPLATES.productShipped(trackingNumber, carrier),
  });
}
