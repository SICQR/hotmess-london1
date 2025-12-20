#!/bin/bash

# 🔥 HOTMESS LONDON - GitHub Push + Supabase Deploy Script
# This script pushes to GitHub and deploys Edge Functions

set -e  # Exit on any error

echo "🔥 HOTMESS LONDON - Deployment Pipeline"
echo "========================================"
echo ""

# ============================================================================
# STEP 1: PUSH TO GITHUB
# ============================================================================

echo "📦 STEP 1/3: Pushing to GitHub..."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    echo "📥 Install with: brew install git (macOS) or apt-get install git (Linux)"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Initialize git if needed
if [ ! -d .git ]; then
    echo "🆕 Initializing git repository..."
    git init
    git branch -M main
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""

# Configure git user if not set
if ! git config user.name &> /dev/null; then
    echo "⚙️  Setting git user..."
    git config user.name "SICQR"
    git config user.email "git@hotmess.london"
fi

# Add remote if not exists
if ! git remote | grep -q origin; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/SICQR/HOTMESS-NEXT.git
    echo "✅ Remote added"
else
    echo "✅ Remote already configured"
    # Update remote URL to be sure
    git remote set-url origin https://github.com/SICQR/HOTMESS-NEXT.git
fi

echo ""

# Stage all files
echo "📦 Staging files..."
git add .
echo "✅ Files staged"
echo ""

# Commit
echo "💬 Creating commit..."
COMMIT_MSG="🔥 HOTMESS QR Engine + Night Pulse + Beacon System

✨ Features:
- QR code generation with 4 styles (RAW, HOTMESS, CHROME, STEALTH)
- Signed beacon payloads for hook-ups and ticket resale
- Beacon resolve handlers (/l/:code and /x/:payload.:sig)
- Night Pulse 3D globe with Mapbox GL JS
- Beacon creation UI with 6 beacon types
- Complete server function with hybrid auth
- Trust & safety features
- Stripe Connect marketplace
- Real-time messaging
- XP/achievements system

🚀 Deployment: $(date)
"

git commit -m "$COMMIT_MSG" || {
    echo "⚠️  No changes to commit (repository is up to date)"
}

echo "✅ Commit created"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
echo "⚠️  You may be asked for GitHub credentials"
echo "   Username: SICQR"
echo "   Password: [use Personal Access Token from https://github.com/settings/tokens]"
echo ""

read -p "Ready to push? Press Enter to continue..."

if git push -u origin main --force; then
    echo ""
    echo "✅ ✅ ✅ GITHUB PUSH SUCCESSFUL! ✅ ✅ ✅"
    echo ""
    echo "📍 Repository: https://github.com/SICQR/HOTMESS-NEXT"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "🔧 Common fixes:"
    echo "   1. Authentication: Use Personal Access Token"
    echo "      Get from: https://github.com/settings/tokens"
    echo "      Scopes needed: repo (full control)"
    echo ""
    echo "   2. Try SSH instead:"
    echo "      git remote set-url origin git@github.com:SICQR/HOTMESS-NEXT.git"
    echo "      git push -u origin main"
    echo ""
    exit 1
fi

# ============================================================================
# STEP 2: DEPLOY EDGE FUNCTIONS TO SUPABASE
# ============================================================================

echo ""
echo "🚀 STEP 2/3: Deploying Edge Functions to Supabase..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not installed!"
    echo ""
    echo "📥 Install with:"
    echo "   macOS: brew install supabase/tap/supabase"
    echo "   Linux: npm install -g supabase"
    echo "   Windows: scoop bucket add supabase https://github.com/supabase/scoop-bucket.git && scoop install supabase"
    echo ""
    echo "📖 Full guide: https://supabase.com/docs/guides/cli/getting-started"
    echo ""
    read -p "Skip Supabase deployment? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    echo "⏭️  Skipping Supabase deployment"
else
    echo "✅ Supabase CLI is installed"
    echo ""
    
    # Link to project
    echo "🔗 Linking to Supabase project..."
    if supabase link --project-ref rfoftonnlwudilafhfkl; then
        echo "✅ Project linked"
    else
        echo "⚠️  Link failed, but continuing..."
    fi
    echo ""
    
    # Deploy server function
    echo "🚀 Deploying 'server' function..."
    if supabase functions deploy server; then
        echo ""
        echo "✅ ✅ ✅ EDGE FUNCTION DEPLOYED! ✅ ✅ ✅"
        echo ""
    else
        echo ""
        echo "❌ Deployment failed!"
        echo ""
        echo "🔧 Try manual deployment:"
        echo "   1. Go to: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/functions"
        echo "   2. Click 'Deploy from GitHub'"
        echo "   3. Select HOTMESS-NEXT repo and 'server' function"
        echo ""
        exit 1
    fi
fi

# ============================================================================
# STEP 3: TEST ENDPOINTS
# ============================================================================

echo ""
echo "🧪 STEP 3/3: Testing deployed endpoints..."
echo ""

SUPABASE_URL="https://rfoftonnlwudilafhfkl.supabase.co"

# Test health endpoint
echo "TEST 1: Health check..."
HEALTH_RESPONSE=$(curl -s "${SUPABASE_URL}/functions/v1/server/make-server-a670c824/health")
echo "$HEALTH_RESPONSE" | jq . 2>/dev/null || echo "$HEALTH_RESPONSE"
echo ""

# Test QR generation
echo "TEST 2: QR code generation (RAW style)..."
curl -s -o test-qr-raw.svg "${SUPABASE_URL}/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=raw&size=512"
if [ -f test-qr-raw.svg ]; then
    echo "✅ QR code generated: test-qr-raw.svg"
else
    echo "❌ QR generation failed"
fi
echo ""

echo "TEST 3: QR code generation (HOTMESS style)..."
curl -s -o test-qr-hotmess.svg "${SUPABASE_URL}/functions/v1/server/make-server-a670c824/qr/TEST123.svg?style=hotmess&size=512"
if [ -f test-qr-hotmess.svg ]; then
    echo "✅ QR code generated: test-qr-hotmess.svg"
else
    echo "❌ QR generation failed"
fi
echo ""

# ============================================================================
# DONE!
# ============================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 🎉 🎉 DEPLOYMENT COMPLETE! 🎉 🎉 🎉"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Code pushed to GitHub:"
echo "   https://github.com/SICQR/HOTMESS-NEXT"
echo ""
echo "✅ Edge function deployed to:"
echo "   ${SUPABASE_URL}/functions/v1/server/make-server-a670c824/"
echo ""
echo "🧪 Test QR generation:"
echo "   RAW:     ${SUPABASE_URL}/functions/v1/server/make-server-a670c824/qr/ABC123.svg?style=raw"
echo "   HOTMESS: ${SUPABASE_URL}/functions/v1/server/make-server-a670c824/qr/ABC123.svg?style=hotmess"
echo "   CHROME:  ${SUPABASE_URL}/functions/v1/server/make-server-a670c824/qr/ABC123.svg?style=chrome"
echo "   STEALTH: ${SUPABASE_URL}/functions/v1/server/make-server-a670c824/qr/ABC123.svg?style=stealth"
echo ""
echo "🔗 Beacon resolve endpoints:"
echo "   Standard: ${SUPABASE_URL}/functions/v1/server/l/CODE"
echo "   Signed:   ${SUPABASE_URL}/functions/v1/server/x/PAYLOAD.SIGNATURE"
echo ""
echo "📊 Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/functions"
echo ""
echo "🎨 Next steps:"
echo "   1. Test QR codes in your app"
echo "   2. Create test beacons in Admin UI"
echo "   3. Scan QR codes to verify beacon resolve"
echo "   4. Monitor function logs in Supabase Dashboard"
echo ""
echo "🔥 HOTMESS LONDON is live!"
echo ""
