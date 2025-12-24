#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${RED}🔐 HOTMESS LONDON - SECURE CREDENTIAL ROTATION${NC}"
echo -e "${RED}================================================${NC}"
echo ""
echo -e "${YELLOW}⚠️  WARNING: This will update ALL production credentials${NC}"
echo -e "${YELLOW}⚠️  Make sure you have rotated keys in their respective dashboards first!${NC}"
echo ""
read -p "Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo -e "${BLUE}📋 Step 1: Remove old Vercel environment variables${NC}"
echo "---------------------------------------------------"

vercel env rm VITE_SUPABASE_URL production --yes 2>/dev/null || echo "  (already removed)"
vercel env rm VITE_SUPABASE_ANON_KEY production --yes 2>/dev/null || echo "  (already removed)"
vercel env rm VITE_STRIPE_PUBLISHABLE_KEY production --yes 2>/dev/null || echo "  (already removed)"
vercel env rm STRIPE_SECRET_KEY production --yes 2>/dev/null || echo "  (already removed)"
vercel env rm VITE_SHOPIFY_STOREFRONT_TOKEN production --yes 2>/dev/null || echo "  (already removed)"

echo -e "${GREEN}✓ Old variables removed${NC}"
echo ""

echo -e "${BLUE}📋 Step 2: Add NEW Supabase URL${NC}"
echo "--------------------------------"
echo "Get from: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/settings/api"
echo ""
echo -n "Enter NEW Supabase URL: "
read -s SUPABASE_URL
echo ""
echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL production
echo -e "${GREEN}✓ Supabase URL added${NC}"
echo ""

echo -e "${BLUE}📋 Step 3: Add NEW Supabase Anon Key${NC}"
echo "-------------------------------------"
echo "Get from: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/settings/api"
echo "Look for 'anon' / 'public' key"
echo ""
echo -n "Enter NEW Supabase Anon Key: "
read -s SUPABASE_ANON_KEY
echo ""
echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY production
echo -e "${GREEN}✓ Supabase Anon Key added${NC}"
echo ""

echo -e "${BLUE}📋 Step 4: Add NEW Stripe Publishable Key${NC}"
echo "------------------------------------------"
echo "Get from: https://dashboard.stripe.com/apikeys"
echo "Look for 'Publishable key' (starts with pk_live_)"
echo ""
echo -n "Enter NEW Stripe Publishable Key: "
read -s STRIPE_PK
echo ""
echo "$STRIPE_PK" | vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
echo -e "${GREEN}✓ Stripe Publishable Key added${NC}"
echo ""

echo -e "${BLUE}📋 Step 5: Add NEW Stripe Secret Key${NC}"
echo "-------------------------------------"
echo "Get from: https://dashboard.stripe.com/apikeys"
echo "Look for 'Secret key' (starts with sk_live_)"
echo "⚠️  NEVER paste this in terminal - it will be hidden"
echo ""
echo -n "Enter NEW Stripe Secret Key: "
read -s STRIPE_SK
echo ""
echo "$STRIPE_SK" | vercel env add STRIPE_SECRET_KEY production
echo -e "${GREEN}✓ Stripe Secret Key added${NC}"
echo ""

echo -e "${BLUE}📋 Step 6: Add NEW Shopify Storefront Token${NC}"
echo "--------------------------------------------"
echo "Get from: https://1e0297-a4.myshopify.com/admin/apps/private"
echo ""
echo -n "Enter NEW Shopify Storefront Token: "
read -s SHOPIFY_TOKEN
echo ""
echo "$SHOPIFY_TOKEN" | vercel env add VITE_SHOPIFY_STOREFRONT_TOKEN production
echo -e "${GREEN}✓ Shopify Token added${NC}"
echo ""

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ ALL CREDENTIALS ROTATED SUCCESSFULLY${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "  1. Update Supabase Edge Functions if needed:"
echo "     https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/settings/functions"
echo ""
echo "  2. Update local .env file with new credentials"
echo ""
echo "  3. Test production deployment:"
echo "     https://hotmess-london1.vercel.app"
echo ""
echo "  4. Clear terminal history:"
echo "     history -c"
echo ""
echo -e "${GREEN}🔐 Credentials securely updated!${NC}"
