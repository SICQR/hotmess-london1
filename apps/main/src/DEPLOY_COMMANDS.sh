#!/bin/bash

# 🔥 HOTMESS LONDON - Quick Deploy Commands
# Copy/paste these commands to deploy the platform

echo "🔥 HOTMESS LONDON - Deployment Commands"
echo "========================================"
echo ""

# ============================================
# STEP 1: PUSH TO GITHUB
# ============================================

echo "📤 STEP 1: Push to GitHub"
echo "------------------------"
echo ""
echo "# Initialize git (if needed)"
echo "git init"
echo "git branch -M main"
echo ""
echo "# Add remote"
echo "git remote add origin https://github.com/SICQR/HOTMESS-LONDON2.git"
echo ""
echo "# Stage and commit"
echo "git add ."
echo "git commit -m '🎉 Initial commit: HOTMESS LONDON platform'"
echo ""
echo "# Push to GitHub"
echo "git push -u origin main"
echo ""
echo "✅ Repository URL: https://github.com/SICQR/HOTMESS-LONDON2"
echo ""
echo ""

# ============================================
# STEP 2: DEPLOY EDGE FUNCTIONS
# ============================================

echo "🚀 STEP 2: Deploy Edge Functions"
echo "--------------------------------"
echo ""
echo "# Link to Supabase project"
echo "supabase link --project-ref klbmalzhmxnelyuabawk"
echo ""
echo "# Deploy marketplace checkout"
echo "supabase functions deploy market-checkout-create"
echo ""
echo "# Deploy webhook handler"
echo "supabase functions deploy stripe-webhook"
echo ""
echo "# Optional: Deploy other functions"
echo "supabase functions deploy market-seller-onboard"
echo "supabase functions deploy seller-payout-summary"
echo ""
echo "# Verify deployment"
echo "supabase functions list"
echo ""
echo ""

# ============================================
# STEP 3: SET SECRETS
# ============================================

echo "🔐 STEP 3: Set Environment Secrets"
echo "----------------------------------"
echo ""
echo "# Stripe secrets (REQUIRED)"
echo "supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE"
echo "supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE"
echo ""
echo "# Shopify secrets (optional)"
echo "supabase secrets set SHOPIFY_ADMIN_ACCESS_TOKEN=YOUR_TOKEN_HERE"
echo "supabase secrets set SHOPIFY_WEBHOOK_SECRET=YOUR_SECRET_HERE"
echo ""
echo "# Verify secrets"
echo "supabase secrets list"
echo ""
echo ""

# ============================================
# STEP 4: VIEW LOGS
# ============================================

echo "📊 STEP 4: Monitor Deployment"
echo "-----------------------------"
echo ""
echo "# Follow Edge Function logs"
echo "supabase functions logs market-checkout-create --follow"
echo ""
echo "# View webhook logs"
echo "supabase functions logs stripe-webhook --follow"
echo ""
echo "# Or view in dashboard:"
echo "# https://supabase.com/dashboard/project/klbmalzhmxnelyuabawk/functions"
echo ""
echo ""

# ============================================
# STEP 5: TEST CHECKOUT
# ============================================

echo "🧪 STEP 5: Test Checkout Flow"
echo "-----------------------------"
echo ""
echo "1. Navigate to: ?route=messmessMarketProduct&slug=test-listing"
echo "2. Click 'Buy Now'"
echo "3. Use test card: 4242 4242 4242 4242"
echo "4. Complete checkout"
echo "5. Verify order in database"
echo ""
echo "Expected: ✅ Redirect to Stripe checkout"
echo "Error before fix: ❌ FunctionsFetchError"
echo ""
echo ""

# ============================================
# TROUBLESHOOTING
# ============================================

echo "🔧 Troubleshooting Commands"
echo "--------------------------"
echo ""
echo "# Re-link project"
echo "supabase link --project-ref klbmalzhmxnelyuabawk"
echo ""
echo "# Re-deploy function"
echo "supabase functions deploy market-checkout-create --no-verify-jwt"
echo ""
echo "# Check function status"
echo "supabase functions list"
echo ""
echo "# View recent logs"
echo "supabase functions logs market-checkout-create --tail 50"
echo ""
echo "# Delete and re-deploy function"
echo "supabase functions delete market-checkout-create"
echo "supabase functions deploy market-checkout-create"
echo ""
echo ""

# ============================================
# USEFUL LINKS
# ============================================

echo "🔗 Useful Links"
echo "--------------"
echo ""
echo "Repository:       https://github.com/SICQR/HOTMESS-LONDON2"
echo "Supabase:         https://supabase.com/dashboard/project/klbmalzhmxnelyuabawk"
echo "Edge Functions:   https://supabase.com/dashboard/project/klbmalzhmxnelyuabawk/functions"
echo "Stripe Dashboard: https://dashboard.stripe.com/test/dashboard"
echo "Diagnostics:      ?route=diagnostics"
echo ""
echo ""

echo "✅ Copy and paste commands above to deploy!"
echo ""
