#!/usr/bin/env bash
# ============================================================
# AUTONOMA-X ENGINE — Lazy & Smart Deploy
# ============================================================
# Usage:
#   chmod +x deploy.sh && ./deploy.sh
#
# What it does:
#   1. Verifies prerequisites (node, git)
#   2. Builds everything
#   3. Pushes to git remote (if configured)
#   4. Deploys to Railway (if CLI is available)
#      Falls back to manual deploy instructions
# ============================================================
set -euo pipefail

echo "🚀 AUTONOMA-X ENGINE DEPLOY"
echo "=============================="
echo ""

# 1. Check prerequisites
echo "📋 Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ node not found"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ git not found"; exit 1; }
echo "   ✅ Node $(node --version)"
echo "   ✅ Git $(git --version | cut -d' ' -f3)"

# 2. Verify .env is production-ready
echo ""
echo "📋 Verifying configuration..."
if grep -q "sk_live_" .env 2>/dev/null; then
  echo "   ✅ Stripe LIVE key detected"
else
  echo "   ⚠️  No Stripe LIVE key in .env — revenue collection will use simulation"
fi

if [ -f prisma/schema.prisma ]; then
  echo "   ✅ Prisma schema found"
fi

# 3. Build
echo ""
echo "🔨 Building..."
npm run build
echo "   ✅ Build complete"

# 4. Initialize git if needed
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "   Initializing git..."
  git init -b main
fi

# 5. Deploy via Railway (if available)
if command -v railway >/dev/null 2>&1; then
  echo ""
  echo "🚂 Deploying to Railway..."
  railway login --no-browser 2>/dev/null || railway login
  railway up --detach
  echo "   ✅ Deployed! Check Railway dashboard for URL."
else
  echo ""
  echo "🌐 Railway CLI not found."
  echo ""
  echo "   Quick deploy options:"
  echo "   ─────────────────────────────"
  echo "   1) Railway (easiest):"
  echo "       npm i -g @railway/cli && railway login && railway up"
  echo ""
  echo "   2) Render:"
  echo "       Push to GitHub, then connect at https://render.com"
  echo "       Set build command: npm run build"
  echo "       Set start command: npm run start"
  echo ""
  echo "   3) Docker (any platform):"
  echo "       docker build -t autonomax-engine . && docker run -p 3001:3001 autonomax-engine"
  echo ""
  echo "   After deploying, set these secrets where you deploy:"
  echo "   ─────────────────────────────"
  echo "   Required:"
  echo "     STRIPE_SECRET_KEY     (from .env2 STRIPE_LIVE_SECRET)"
  echo "     STRIPE_WEBHOOK_SECRET (from .env2)"
  echo "     DATABASE_URL          (= \"file:./prod.db\" for SQLite)"
  echo ""
  echo "   Optional (AI features):"
  echo "     OPENAI_API_KEY"
  echo ""
  echo "   ✅ All configs ready for manual deploy."
fi

echo ""
echo "✅ DONE"
