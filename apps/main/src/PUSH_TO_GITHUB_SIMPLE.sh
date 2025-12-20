#!/bin/bash

# 🔥 HOTMESS LONDON - Simple GitHub Push
# Just pushes to GitHub (no Supabase CLI needed)

set -e

echo "🔥 HOTMESS LONDON - GitHub Push"
echo "================================"
echo ""

# Init git if needed
if [ ! -d .git ]; then
    git init
    git branch -M main
    git config user.name "SICQR"
    git config user.email "git@hotmess.london"
fi

# Add remote
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/SICQR/HOTMESS-NEXT.git

# Stage and commit
git add .
git commit -m "🔥 HOTMESS QR Engine + Night Pulse + Beacon System

✨ Complete QR beacon system with 4 styles
✨ Night Pulse 3D globe with Mapbox
✨ Signed payloads for hook-ups and resale
✨ Full server function with 122+ routes
✨ Trust & safety features
✨ Stripe Connect marketplace

Deployed: $(date)
" || echo "No changes to commit"

# Push
echo ""
echo "🚀 Pushing to GitHub..."
echo "   Repo: https://github.com/SICQR/HOTMESS-NEXT"
echo ""
echo "⚠️  Enter your GitHub credentials:"
echo "   Username: SICQR"
echo "   Password: [Personal Access Token]"
echo ""

git push -u origin main --force

echo ""
echo "✅ SUCCESS! View at: https://github.com/SICQR/HOTMESS-NEXT"
echo ""
echo "📥 Next: Deploy to Supabase"
echo "   1. Go to: https://supabase.com/dashboard/project/rfoftonnlwudilafhfkl/functions"
echo "   2. Click 'New Function' → 'Deploy from GitHub'"
echo "   3. Select HOTMESS-NEXT repo → server function"
echo ""
