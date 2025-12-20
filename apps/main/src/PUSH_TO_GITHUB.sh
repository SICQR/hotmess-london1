#!/bin/bash

# 🚀 HOTMESS LONDON - GitHub Push Script
# This script helps you push your project to GitHub

echo "🔥 HOTMESS LONDON - GitHub Setup"
echo "================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    echo "📥 Install with: brew install git"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if we're in a git repository
if [ -d .git ]; then
    echo "⚠️  This directory is already a git repository"
    echo ""
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "🆕 Initializing new git repository..."
    git init
    git branch -M main
    echo "✅ Repository initialized"
    echo ""
fi

# Ask for GitHub repository URL
echo "📋 Your GitHub repository:"
echo "   Repository name: HOTMESS-LONDON2"
echo ""

read -p "Enter your GitHub repository URL (e.g., https://github.com/username/HOTMESS-LONDON2.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "🔗 Repository URL: $REPO_URL"
echo ""

# Check if remote already exists
if git remote | grep -q origin; then
    echo "⚠️  Remote 'origin' already exists. Updating..."
    git remote set-url origin "$REPO_URL"
else
    echo "🔗 Adding remote 'origin'..."
    git remote add origin "$REPO_URL"
fi

echo "✅ Remote configured"
echo ""

# Stage all files
echo "📦 Staging all files..."
git add .
echo "✅ Files staged"
echo ""

# Create commit
echo "💬 Creating commit..."
git commit -m "🎉 Initial commit: HOTMESS LONDON platform

Features:
- Stripe Connect marketplace with atomic stock reservation
- P2P ticketing system with QR beacons  
- Trust & safety (blocking, reporting, moderation)
- Records label platform with SoundCloud
- Admin dashboard with seller management
- White-Label fulfillment mode
- Edge Functions for checkout and webhooks
- Complete database migrations
- Dark neon UI with care-first principles"

echo "✅ Commit created"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
echo "⚠️  You may be asked for GitHub credentials"
echo "   If using Personal Access Token:"
echo "   - Username: your GitHub username"
echo "   - Password: paste your token (get from https://github.com/settings/tokens)"
echo ""

read -p "Ready to push? Press Enter to continue..."

if git push -u origin main; then
    echo ""
    echo "✅ ✅ ✅ SUCCESS! ✅ ✅ ✅"
    echo ""
    echo "🎉 Your HOTMESS project is now on GitHub!"
    echo ""
    echo "📍 Repository: $REPO_URL"
    echo ""
    echo "🔗 View on GitHub:"
    echo "   ${REPO_URL%.git}"
    echo ""
    echo "📥 Clone it anywhere with:"
    echo "   git clone $REPO_URL"
    echo ""
    echo "🚀 Deploy Edge Functions:"
    echo "   cd HOTMESS-LONDON2"
    echo "   supabase link --project-ref klbmalzhmxnelyuabawk"
    echo "   supabase functions deploy market-checkout-create"
    echo "   supabase functions deploy stripe-webhook"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "🔧 Common fixes:"
    echo "   1. Authentication: Use Personal Access Token"
    echo "      Get from: https://github.com/settings/tokens"
    echo ""
    echo "   2. Repository doesn't exist:"
    echo "      Create at: https://github.com/new"
    echo ""
    echo "   3. Try SSH instead:"
    echo "      git remote set-url origin git@github.com:username/HOTMESS-LONDON2.git"
    echo ""
    echo "📖 Full guide: See /GIT_SETUP_INSTRUCTIONS.md"
    exit 1
fi
