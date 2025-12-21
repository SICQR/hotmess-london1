# 🔑 Get Your Stripe Publishable Key (2 minutes)

**You need**: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx`

Let's get the real key and configure it!

---

## Step 1: Get Your Publishable Key from Stripe

### A. Login to Stripe Dashboard

Go to: **https://dashboard.stripe.com**

### B. Navigate to API Keys

1. Click **Developers** (top right corner)
2. Click **API keys** in the left sidebar

### C. Find Your Publishable Key

You'll see two types of keys:

**Publishable key** (Safe to expose - use this one!)
```
pk_test_51RrKkrRffzKIfelw...
```
✅ This one goes in your frontend environment variable

**Secret key** (Never expose - already have as restricted key!)
```
sk_test_51RrKkrRffzKIfelw...
```
❌ Don't use this one - you already have rk_live_...

### D. Copy the Publishable Key

Click **Reveal test key** button, then copy the entire key starting with `pk_test_`

---

## Step 2: Add to Your Environment

### Option A: Figma Make Environment

1. In Figma Make, go to **Settings** or **Environment Variables**
2. Add new variable:
   - **Name**: `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Value**: `pk_test_51RrKkrRffzKIfelw...` (your actual key)

### Option B: .env File

Create or edit `.env` file at project root:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RrKkrRffzKIfelw...
```

**Important**: If using .env file, restart your dev server!

---

## Step 3: Verify Configuration

### Quick Test in Browser Console

Open your app and run this in browser console:

```javascript
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
// Should output: pk_test_51RrKkr...
```

If it shows `undefined`, the environment variable isn't loaded yet. Restart your dev server.

---

## Step 4: Test Purchase Flow

### A. Navigate to Purchase Page

**If your ID `955b675f-e135-41af-8d90-ee69da127800` is an event**:
```
/tickets/purchase?event=955b675f-e135-41af-8d90-ee69da127800&tier=ga
```

**Or use the demo club**:
```
1. Go to: /club/default
2. Click on any event
3. Click "Buy Ticket"
```

### B. Payment Form Should Load

You should see:
- ✅ Event details on the left
- ✅ Stripe payment form on the right
- ✅ Card number field
- ✅ Expiry and CVC fields

If the form **doesn't load**:
- Check browser console for errors
- Verify environment variable is set
- Check if Stripe packages are installed

### C. Enter Test Card

```
Card Number: 4242 4242 4242 4242
Expiry:      12/34 (any future date)
CVC:         123 (any 3 digits)
ZIP Code:    12345 (any 5 digits)
```

### D. Submit Payment

Click **"Pay £20.00"** (or whatever the ticket price is)

### E. Success!

You should:
- ✅ See "Processing..." message
- ✅ Get redirected to `/my-tickets`
- ✅ See your new ticket with QR code

---

## Step 5: Verify in Database

Run this in **Supabase SQL Editor**:

```sql
-- Check the ticket was created
SELECT 
  id,
  qr_code,
  tier,
  price / 100.0 as price_gbp,
  status,
  purchased_at
FROM club_tickets
ORDER BY purchased_at DESC
LIMIT 1;

-- Check event stats updated
SELECT 
  name,
  tickets_sold,
  revenue / 100.0 as revenue_gbp
FROM club_events
WHERE id = '955b675f-e135-41af-8d90-ee69da127800';
```

---

## Step 6: Check Stripe Dashboard

Go to: **https://dashboard.stripe.com/test/payments**

You should see:
- ✅ New payment for the ticket amount
- ✅ Status: Succeeded
- ✅ Customer email
- ✅ Metadata with event_id and ticket_id

---

## 🎉 Success Checklist

After configuration, verify:

- [ ] Environment variable is set: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Dev server restarted (if using .env)
- [ ] Purchase page loads at `/tickets/purchase?event=...&tier=ga`
- [ ] Stripe payment form appears
- [ ] Test card `4242...` processes successfully
- [ ] Redirects to My Tickets page
- [ ] Ticket appears in database
- [ ] QR code is generated
- [ ] Event stats updated (tickets_sold, revenue)
- [ ] Payment appears in Stripe Dashboard

---

## 🚨 Troubleshooting

### Error: "Cannot read property 'confirmPayment'"

**Fix**: Stripe not loading. Check:
```javascript
// In browser console
console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

If `undefined`, restart dev server.

### Error: "Invalid publishable key"

**Fix**: Key must start with `pk_test_` or `pk_live_`

Check you copied the **Publishable key**, not the Secret key.

### Payment form doesn't appear

**Fix**: Check browser console for errors. Likely issues:
1. Stripe packages not installed
2. Environment variable not set
3. Event doesn't have prices set

### Error: "Venue payment setup incomplete"

**Fix**: The venue (club) needs Stripe Connect configured.

Run this to check:
```sql
SELECT stripe_account_id, onboarding_complete 
FROM clubs 
WHERE id = (
  SELECT club_id FROM club_events 
  WHERE id = '955b675f-e135-41af-8d90-ee69da127800'
);
```

If `stripe_account_id` is NULL, create Connect account:
```bash
curl -X POST \
  https://<project-id>.supabase.co/functions/v1/make-server-a670c824/stripe/connect/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -d '{
    "club_id": "club-id-here",
    "club_name": "Test Club",
    "owner_email": "owner@example.com"
  }'
```

---

## 📋 Quick Reference

### Your Keys

```bash
# Frontend (SAFE to expose)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RrKkr...

# Backend (SECURE - already configured ✅)
STRIPE_RESTRICTED_KEY=rk_live_51RrKkr...
```

### Test Cards

```
Success:        4242 4242 4242 4242
Declined:       4000 0000 0000 0002
3D Secure:      4000 0025 0000 3155
Insufficient:   4000 0000 0000 9995
```

### URLs

```
Stripe Dashboard:  https://dashboard.stripe.com
API Keys:          https://dashboard.stripe.com/apikeys
Payments:          https://dashboard.stripe.com/test/payments
Test Cards:        https://stripe.com/docs/testing
```

---

## 🎯 Next After This Works

Once you've successfully tested one purchase:

### 1. Test Different Scenarios

- [ ] Test GA tier ticket
- [ ] Test VIP tier ticket
- [ ] Test declined card (`4000 0000 0000 0002`)
- [ ] Test 3D Secure card (`4000 0025 0000 3155`)
- [ ] Test without login (should prompt to login)

### 2. Add More UI Integration

- [ ] Add "Buy Ticket" buttons to event listings
- [ ] Add ticket purchase CTA to event detail pages
- [ ] Show "Sold Out" when capacity reached
- [ ] Display remaining capacity

### 3. Enhance Features

- [ ] Add email notifications (Resend/SendGrid)
- [ ] Generate QR code images (qrcode.js)
- [ ] Add receipt generation
- [ ] Build My Tickets page
- [ ] Implement refund UI

### 4. Production Prep

- [ ] Switch to live keys (`pk_live_...` and `rk_live_...`)
- [ ] Complete Stripe account verification
- [ ] Configure production webhooks
- [ ] Test with small real purchases
- [ ] Set up monitoring and alerts

---

## 💡 Pro Tips

### Development

1. **Use Test Mode First**
   - All your current keys should be `_test_`
   - Switch to `_live_` only when ready for production

2. **Monitor Stripe Logs**
   - Dashboard → Developers → Logs
   - Shows all API requests and errors

3. **Test All Card Scenarios**
   - Success, decline, 3D Secure, etc.
   - Ensures your error handling works

4. **Use Stripe CLI** (optional)
   ```bash
   stripe listen --forward-to localhost:54321/functions/v1/make-server-a670c824/stripe/webhook
   ```

### Production

1. **Complete Verification First**
   - Stripe will ask for business details
   - Required before processing live payments

2. **Test Small Amounts**
   - Use real cards with £1-5 transactions first
   - Verify everything works before big sales

3. **Monitor Disputes**
   - Keep dispute rate < 0.75%
   - Respond quickly to chargebacks

4. **Set Up Alerts**
   - Failed payments
   - High refund rates
   - Unusual activity

---

## ✅ You're Ready When...

1. ✅ You've copied your real publishable key from Stripe
2. ✅ You've added it to environment as `VITE_STRIPE_PUBLISHABLE_KEY`
3. ✅ You've restarted your dev server
4. ✅ Payment form loads on purchase page
5. ✅ Test card `4242...` completes successfully
6. ✅ Ticket appears in database
7. ✅ Payment appears in Stripe Dashboard

**Then you're LIVE!** 🚀

---

## 🆘 Still Stuck?

### Check These Files

- `/STRIPE_READY.md` - Quick start guide
- `/TEST_STRIPE_WITH_ID.md` - Test with your specific ID
- `/NEXT_STEPS_STRIPE.md` - Detailed setup
- `/SUMMARY_AND_NEXT_ACTIONS.md` - Complete overview

### Verify Your Setup

Run `/VERIFY_ID.sql` to check your ID:
```sql
-- Is it a club, event, or ticket?
```

---

**Once you have your real key**, just:
1. Replace `xxxxxxxxxxxxxxxxxxxxx` with actual key
2. Restart dev server
3. Test purchase
4. Done! 🎉

**Need the real key?** Go to: https://dashboard.stripe.com/apikeys (2 min)
