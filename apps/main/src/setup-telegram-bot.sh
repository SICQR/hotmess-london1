#!/bin/bash

# ====================================================================
# HOTMESS LONDON - Telegram Bot Setup Script
# ====================================================================
# This script configures your Telegram bots with the correct tokens
# and sets up Supabase secrets for production deployment.
# ====================================================================

set -e  # Exit on error

echo "🔥 HOTMESS LONDON - Telegram Bot Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ====================================================================
# STEP 1: Update .env file in hotmess-bot-final
# ====================================================================

echo "📝 Step 1: Updating .env file in hotmess-bot-final..."
echo ""

BOT_DIR="$HOME/Downloads/hotmess-bot-final"

if [ ! -d "$BOT_DIR" ]; then
  echo -e "${RED}❌ Error: Directory $BOT_DIR not found${NC}"
  echo "Please ensure hotmess-bot-final is in ~/Downloads/"
  exit 1
fi

cd "$BOT_DIR"

# Create .env file
cat > .env << 'EOF'
# ==========================================
# HOTMESS LONDON TELEGRAM BOT CONFIGURATION
# ==========================================

# PRIMARY BOT (Production)
BOT_TOKEN=8222096804:AAFmU_P6V9CM03mbM0IfNIPnXqkyIkiJXeo
BOT_USERNAME=@HotmessNew_bot

# RADIO BOT (Specialized features)
HOTMESS_RADIO_BOT_TOKEN=8335681663:AAFBaVrK_mmWEfv0HOacge27IgJPvm0PRPY
HOTMESS_RADIO_BOT_TOKEN_v2=8335681663:AAFF3_usjFuaY0NkN76hp-ao25pEdjkxNUQ

# PLAYGROUND BOT (Testing)
HOTMESS_PLAYGROUND_BOT_TOKEN=8088078971:AAGLiBVcbFZM0Kk3HFhu1La_TRS26UtSDHA

# TELEGRAM CHANNEL
BOT_CHANNEL_URL=https://t.me/HOTMESSRADIOXXX/69

# ==========================================
# SUPABASE CONFIGURATION
# ==========================================
# TODO: Replace with your actual Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# ==========================================
# DATABASE CONFIGURATION
# ==========================================
# TODO: Replace with your MongoDB URI (if still using MongoDB)
MONGO_URI=mongodb://localhost:27017/hotmess

# ==========================================
# STRIPE CONFIGURATION
# ==========================================
# TODO: Replace with your Stripe keys
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_RESTRICTED_KEY=rk_test_your_restricted_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ==========================================
# GOOGLE SHEETS CONFIGURATION
# ==========================================
GOOGLE_SPREADSHEET_ID=1d7ii361Z7-cGpwv7w_Ewlun7_ljFZwrXyq6jWsiOO8U
GOOGLE_SHEET_NAME=HOTMESS QR Log

# ==========================================
# WEBHOOK BASE URL
# ==========================================
WEBHOOK_BASE_URL=http://localhost:5000

# ==========================================
# ADMIN CONFIGURATION
# ==========================================
ADMIN_ID=5976109452

# ==========================================
# MAKE.COM WEBHOOKS
# ==========================================
# TODO: Add your Make.com webhook URLs
MAKE_WEBHOOK_TELEGRAM_MESSAGE=
MAKE_WEBHOOK_CRISIS_DETECTED=
MAKE_WEBHOOK_AFFILIATE_COMMISSION=
EOF

echo -e "${GREEN}✅ .env file created/updated${NC}"
echo ""

# Add to .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
  echo ".env" >> .gitignore
  echo ".env.local" >> .gitignore
  echo "credentials.json" >> .gitignore
  echo "config/google-credentials.json" >> .gitignore
  echo -e "${GREEN}✅ Added .env to .gitignore${NC}"
else
  echo -e "${YELLOW}⚠️  .env already in .gitignore${NC}"
fi

echo ""

# ====================================================================
# STEP 2: Test bot token validity
# ====================================================================

echo "🧪 Step 2: Testing bot token validity..."
echo ""

MAIN_BOT_TOKEN="8222096804:AAFmU_P6V9CM03mbM0IfNIPnXqkyIkiJXeo"

RESPONSE=$(curl -s "https://api.telegram.org/bot${MAIN_BOT_TOKEN}/getMe")

if echo "$RESPONSE" | grep -q '"ok":true'; then
  BOT_USERNAME=$(echo "$RESPONSE" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
  BOT_NAME=$(echo "$RESPONSE" | grep -o '"first_name":"[^"]*"' | cut -d'"' -f4)
  
  echo -e "${GREEN}✅ Bot token is valid!${NC}"
  echo "   Bot Name: $BOT_NAME"
  echo "   Username: @$BOT_USERNAME"
else
  echo -e "${RED}❌ Bot token is invalid or API error${NC}"
  echo "   Response: $RESPONSE"
fi

echo ""

# ====================================================================
# STEP 3: Check webhook status
# ====================================================================

echo "📡 Step 3: Checking webhook status..."
echo ""

WEBHOOK_INFO=$(curl -s "https://api.telegram.org/bot${MAIN_BOT_TOKEN}/getWebhookInfo")

if echo "$WEBHOOK_INFO" | grep -q '"url":""'; then
  echo -e "${YELLOW}⚠️  No webhook configured (using polling)${NC}"
  echo "   This is OK for local development"
else
  WEBHOOK_URL=$(echo "$WEBHOOK_INFO" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
  echo -e "${GREEN}✅ Webhook configured${NC}"
  echo "   URL: $WEBHOOK_URL"
fi

echo ""

# ====================================================================
# STEP 4: Set up Supabase secrets (optional)
# ====================================================================

echo "🔐 Step 4: Set up Supabase secrets..."
echo ""

read -p "Do you want to set Supabase secrets now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Setting Supabase secrets..."
  
  # Check if supabase CLI is installed
  if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not installed${NC}"
    echo "   Install with: npm install -g supabase"
    echo "   Skipping Supabase secrets setup"
  else
    echo "Running: supabase secrets set ..."
    
    supabase secrets set BOT_TOKEN="8222096804:AAFmU_P6V9CM03mbM0IfNIPnXqkyIkiJXeo" || true
    supabase secrets set BOT_USERNAME="@HotmessNew_bot" || true
    supabase secrets set HOTMESS_RADIO_BOT_TOKEN="8335681663:AAFBaVrK_mmWEfv0HOacge27IgJPvm0PRPY" || true
    supabase secrets set HOTMESS_RADIO_BOT_TOKEN_v2="8335681663:AAFF3_usjFuaY0NkN76hp-ao25pEdjkxNUQ" || true
    supabase secrets set HOTMESS_PLAYGROUND_BOT_TOKEN="8088078971:AAGLiBVcbFZM0Kk3HFhu1La_TRS26UtSDHA" || true
    supabase secrets set BOT_CHANNEL_URL="https://t.me/HOTMESSRADIOXXX/69" || true
    
    echo -e "${GREEN}✅ Supabase secrets set${NC}"
  fi
else
  echo "Skipping Supabase secrets setup"
  echo "You can set them later with:"
  echo "  supabase secrets set BOT_TOKEN=8222096804:AAFmU_P6V9CM03mbM0IfNIPnXqkyIkiJXeo"
fi

echo ""

# ====================================================================
# STEP 5: Install dependencies
# ====================================================================

echo "📦 Step 5: Installing dependencies..."
echo ""

if [ -f "package.json" ]; then
  npm install
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo -e "${RED}❌ package.json not found${NC}"
fi

echo ""

# ====================================================================
# STEP 6: Summary and next steps
# ====================================================================

echo "======================================================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "======================================================================"
echo ""
echo "📝 Configuration Summary:"
echo "   • Main Bot: @HotmessNew_bot"
echo "   • Token: 8222096804:AAFmU_P6V9CM03mbM0IfNIPnXqkyIkiJXeo"
echo "   • .env file: $BOT_DIR/.env"
echo "   • Dependencies: Installed"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Update Supabase credentials in .env:"
echo "   cd $BOT_DIR"
echo "   nano .env"
echo "   # Replace SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "2. Start the bot locally:"
echo "   cd $BOT_DIR"
echo "   node index.js"
echo ""
echo "3. Test in Telegram:"
echo "   • Open Telegram"
echo "   • Search for @HotmessNew_bot"
echo "   • Send /start"
echo ""
echo "4. Set up webhook for production:"
echo "   curl -X POST \"https://api.telegram.org/bot8222096804:AAFmU_P6V9CM03mbM0IfNIPnXqkyIkiJXeo/setWebhook\" \\"
echo "     -d \"url=https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-a670c824/telegram/webhook\""
echo ""
echo "📚 Documentation:"
echo "   • Quick Start: /TELEGRAM_BOT_QUICKSTART.md"
echo "   • Full Guide: /TELEGRAM_BOT_INTEGRATION.md"
echo "   • Credentials: /TELEGRAM_BOT_CREDENTIALS.md"
echo ""
echo "======================================================================"
echo ""
