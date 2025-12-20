#!/bin/bash

# HOTMESS-FIGMA Deployment Package Creator
# This script creates a zip file with all necessary files for deployment

echo "🚀 Creating HOTMESS Deployment Package..."

# Create timestamp for filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_NAME="HOTMESS_DEPLOY_${TIMESTAMP}.zip"

# Create temporary directory for clean packaging
TEMP_DIR="./hotmess_deploy_temp"
mkdir -p "$TEMP_DIR"

echo "📦 Copying essential files..."

# Copy Supabase functions and migrations
cp -r ./supabase "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No supabase folder found"

# Copy app files
cp -r ./app "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No app folder found"

# Copy components
cp -r ./components "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No components folder found"

# Copy pages
cp -r ./pages "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No pages folder found"

# Copy lib/utils
cp -r ./lib "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No lib folder found"
cp -r ./utils "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No utils folder found"

# Copy config files
cp -r ./styles "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No styles folder found"
cp ./tailwind.config.js "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No tailwind.config.js found"
cp ./package.json "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No package.json found"
cp ./App.tsx "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No App.tsx found"

# Copy documentation
cp ./*.md "$TEMP_DIR/" 2>/dev/null || echo "⚠️  No markdown files found"

# Create deployment instructions
cat > "$TEMP_DIR/DEPLOY_INSTRUCTIONS.txt" << 'EOF'
🚀 HOTMESS DEPLOYMENT INSTRUCTIONS

1. EXTRACT THIS ZIP
   - Extract to: ~/Desktop/HOTMESS_DEPLOY

2. OPEN TERMINAL AND NAVIGATE
   cd ~/Desktop/HOTMESS_DEPLOY

3. LINK TO SUPABASE
   supabase link --project-ref klbmalzhmxnelyuabawk

4. DEPLOY EDGE FUNCTIONS
   supabase functions deploy market-checkout-create
   supabase functions deploy stripe-webhook

5. SET ENVIRONMENT VARIABLES
   supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_KEY
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET

6. GET STRIPE KEYS
   - Secret Key: https://dashboard.stripe.com/test/apikeys
   - Webhook Secret: https://dashboard.stripe.com/test/webhooks

7. CREATE STRIPE WEBHOOK
   - URL: https://klbmalzhmxnelyuabawk.supabase.co/functions/v1/stripe-webhook
   - Events: checkout.session.completed, payment_intent.succeeded, etc.

8. TEST CHECKOUT
   - Open app and test buying a product
   - Check logs: supabase functions logs market-checkout-create

✅ Done! Your checkout should now work!
EOF

echo "🗜️  Creating zip file..."

# Create the zip file
cd "$TEMP_DIR" && zip -r "../$ZIP_NAME" . -x "*.DS_Store" "node_modules/*" ".git/*" && cd ..

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo "✅ Deployment package created: $ZIP_NAME"
echo ""
echo "📍 Location: $(pwd)/$ZIP_NAME"
echo ""
echo "📥 To use this:"
echo "   1. Download: $ZIP_NAME"
echo "   2. Extract on your Mac"
echo "   3. Follow DEPLOY_INSTRUCTIONS.txt inside"
echo ""
echo "🎉 Ready to deploy!"
