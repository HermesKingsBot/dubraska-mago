#!/bin/bash
# Deploy script for dubraska-mago to Vercel
set -a
source /opt/data/.env.vercel
set +a
cd /opt/data/projects/dubraska-mago
npx vercel deploy --yes --prod
