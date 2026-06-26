#!/bin/bash
# Deploy script with pre-deploy testing
# Usage: bash scripts/deploy.sh [staging|prod]

set -e

ENV=${1:-prod}
echo "🚀 Starting deployment to $ENV..."

echo "📋 Running tests..."
npx vitest run --reporter=verbose
echo "✅ All tests passed!"

echo "🔨 Verifying build..."
npx next build
echo "✅ Build successful!"

echo "📦 Deploying to Vercel ($ENV)..."
if [ "$ENV" = "prod" ]; then
  npx vercel --prod --yes
else
  npx vercel --yes
fi

echo "✅ Deployment to $ENV complete!"
