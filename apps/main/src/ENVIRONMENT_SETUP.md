# 🔐 ENVIRONMENT VARIABLES SETUP

## **Required Environment Variables**

### **1. Supabase Edge Functions (Backend)**

Add these in your Supabase Dashboard → Edge Functions → Secrets:

```bash
# ===== QR & BEACON SYSTEM =====
BEACON_SECRET="YOUR_256_BIT_SECRET_KEY_HERE"
APP_BASE_URL="https://hotmess.london"

# ===== SUPABASE (Auto-provided) =====
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_ANON_KEY="your-anon-key"

# ===== STRIPE (For payments) =====
STRIPE_SECRET_KEY="sk_live_xxx"  # or sk_test_xxx for testing
STRIPE_RESTRICTED_KEY="rk_live_xxx"
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_xxx"

# ===== TELEGRAM (Optional - for Telegram bot integration) =====
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_WEBHOOK_SECRET="your-webhook-secret"

# ===== MAKE.COM WEBHOOKS (Optional - for automation) =====
MAKE_WEBHOOK_USER_SIGNUP="https://hook.make.com/xxx"
MAKE_WEBHOOK_BEACON_SCAN="https://hook.make.com/xxx"
MAKE_WEBHOOK_TICKET_SALE="https://hook.make.com/xxx"
```

---

### **2. Frontend Environment Variables (.env.local)**

```bash
# ===== SUPABASE =====
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
VITE_SUPABASE_FUNCTIONS_URL="https://your-project.supabase.co/functions/v1/make-server-a670c824"

# ===== STRIPE (Frontend) =====
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_xxx"  # or pk_test_xxx

# ===== MAPBOX (For 3D globe) =====
VITE_MAPBOX_TOKEN="pk.xxx"

# ===== BASE URLS =====
VITE_APP_BASE_URL="https://hotmess.london"
VITE_API_BASE_URL="https://your-project.supabase.co/functions/v1/make-server-a670c824"
```

---

## **How to Generate Secrets**

### **Generate BEACON_SECRET (256-bit)**

**Option 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Tool**
Visit: https://www.random.org/strings/ and generate a 64-character hex string

**Copy the output** (should look like: `a1b2c3d4e5f6...`)

---

## **Setting Supabase Secrets**

### **Via Supabase Dashboard:**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Edge Functions** → **Secrets**
4. Click **"New Secret"**
5. Add each variable:
   - Name: `BEACON_SECRET`
   - Value: (paste your generated secret)
6. Click **"Save"**

### **Via Supabase CLI:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Set secrets
supabase secrets set BEACON_SECRET=your-secret-here
supabase secrets set APP_BASE_URL=https://hotmess.london

# List secrets (verify)
supabase secrets list
```

---

## **Testing Environment Variables**

### **1. Test Backend Secrets**

Create a test endpoint:

```typescript
// /supabase/functions/server/routes/test.ts
import { Hono } from 'npm:hono@4';

const app = new Hono();

app.get('/test/env', (c) => {
  const beaconSecret = Deno.env.get('BEACON_SECRET');
  const appBaseUrl = Deno.env.get('APP_BASE_URL');

  return c.json({
    beaconSecretSet: !!beaconSecret,
    beaconSecretLength: beaconSecret?.length || 0,
    appBaseUrl,
    timestamp: new Date().toISOString(),
  });
});

export default app;
```

Test URL:
```
https://your-project.supabase.co/functions/v1/make-server-a670c824/test/env
```

Expected response:
```json
{
  "beaconSecretSet": true,
  "beaconSecretLength": 64,
  "appBaseUrl": "https://hotmess.london",
  "timestamp": "2024-12-05T..."
}
```

### **2. Test Frontend Environment Variables**

In your React app:

```tsx
console.log('Frontend env check:', {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  functionsUrl: import.meta.env.VITE_SUPABASE_FUNCTIONS_URL,
  stripeKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
});
```

---

## **Security Best Practices**

### **✅ DO:**

- **Use different secrets for dev/staging/prod**
- **Rotate BEACON_SECRET every 90 days**
- **Never commit .env.local to git**
- **Use Supabase Secrets for backend variables**
- **Use VITE_ prefix for frontend env vars**
- **Validate secrets on server startup**

### **❌ DON'T:**

- **Never use BEACON_SECRET in frontend code**
- **Never expose SERVICE_ROLE_KEY to frontend**
- **Don't hardcode secrets in source code**
- **Don't share secrets via Slack/email**
- **Don't reuse the same secret across projects**

---

## **Secret Rotation Process**

### **Rotating BEACON_SECRET:**

1. **Generate new secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Add to Supabase:**
   ```bash
   supabase secrets set BEACON_SECRET_NEW=new-secret-here
   ```

3. **Update server code to check both secrets temporarily:**
   ```typescript
   const currentSecret = Deno.env.get('BEACON_SECRET');
   const newSecret = Deno.env.get('BEACON_SECRET_NEW');
   
   // Accept both during transition
   const valid = verifySignature(payload, sig, currentSecret) || 
                 verifySignature(payload, sig, newSecret);
   ```

4. **After 7 days** (grace period), replace old secret:
   ```bash
   supabase secrets set BEACON_SECRET=new-secret-here
   supabase secrets unset BEACON_SECRET_NEW
   ```

5. **Remove dual-check code**

---

## **Environment Variable Checklist**

### **Backend (Supabase Edge Functions):**

- [ ] `BEACON_SECRET` (64-char hex)
- [ ] `APP_BASE_URL` (https://hotmess.london)
- [ ] `SUPABASE_URL` (auto-provided)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (auto-provided)
- [ ] `SUPABASE_ANON_KEY` (auto-provided)
- [ ] `STRIPE_SECRET_KEY` (if using payments)
- [ ] `TELEGRAM_BOT_TOKEN` (if using Telegram)

### **Frontend (.env.local):**

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_SUPABASE_FUNCTIONS_URL`
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] `VITE_MAPBOX_TOKEN`

### **Git Ignore:**

- [ ] `.env.local` in `.gitignore`
- [ ] `.env` in `.gitignore`
- [ ] `.env.*.local` in `.gitignore`

---

## **Troubleshooting**

### **❌ "BEACON_SECRET is not defined"**

**Cause:** Secret not set in Supabase Edge Functions

**Fix:**
```bash
supabase secrets set BEACON_SECRET=your-secret-here
# Then redeploy functions
```

### **❌ "Invalid signature" on signed beacon scan**

**Cause:** BEACON_SECRET mismatch between QR generation and verification

**Fix:**
1. Verify same secret used in both places
2. Check for whitespace in secret value
3. Regenerate QR codes after secret rotation

### **❌ "CORS error" when calling QR endpoint**

**Cause:** CORS headers not set

**Fix:** Ensure routes have:
```typescript
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
}));
```

### **❌ Frontend can't reach Supabase Functions**

**Cause:** Incorrect `VITE_SUPABASE_FUNCTIONS_URL`

**Fix:**
```bash
# .env.local
VITE_SUPABASE_FUNCTIONS_URL="https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-a670c824"
```

---

## **Production Deployment Checklist**

### **Before Launch:**

- [ ] All secrets rotated from dev values
- [ ] BEACON_SECRET is production-grade (64-char)
- [ ] Stripe keys are LIVE (not test)
- [ ] APP_BASE_URL points to production domain
- [ ] All secrets verified via `/test/env` endpoint
- [ ] .env.local not committed to git
- [ ] Secrets documented in team password manager
- [ ] Backup of all secrets stored securely
- [ ] Rotation schedule set (90 days)

---

## **Quick Setup Script**

```bash
#!/bin/bash
# setup-env.sh - Quick environment setup

echo "🔐 HOTMESS Environment Setup"
echo ""

# Generate BEACON_SECRET
echo "Generating BEACON_SECRET..."
BEACON_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "BEACON_SECRET=$BEACON_SECRET"
echo ""

# Set in Supabase
echo "Setting Supabase secrets..."
supabase secrets set BEACON_SECRET=$BEACON_SECRET
supabase secrets set APP_BASE_URL=https://hotmess.london

# Create .env.local
echo "Creating .env.local..."
cat > .env.local << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1/make-server-a670c824
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_MAPBOX_TOKEN=pk.xxx
VITE_APP_BASE_URL=https://hotmess.london
EOF

echo "✅ Environment setup complete!"
echo ""
echo "⚠️  IMPORTANT: Update .env.local with your actual Supabase project details"
```

Make executable and run:
```bash
chmod +x setup-env.sh
./setup-env.sh
```

---

## **Monitoring & Alerts**

### **Set up monitoring for:**

- Secret rotation reminders (every 90 days)
- Failed signature verifications (possible attack)
- Missing environment variables (app health)
- Unauthorized QR generation attempts

### **Tools:**

- Supabase Dashboard → Logs
- Sentry/LogRocket for error tracking
- PagerDuty/Opsgenie for alerts
- Google Calendar for rotation reminders

---

✅ **ENVIRONMENT IS NOW SECURE AND READY FOR PRODUCTION!**
