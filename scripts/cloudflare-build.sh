#!/usr/bin/env bash
set -euo pipefail

# Cloudflare Pages Git Integration build command: bash scripts/cloudflare-build.sh
# Metadata-only build: no Pillow, no bulk source image downloads.
export POSEWEAR_REMOTE_ASSETS=1
python3 scripts/fetch-assets.py --meta-only
export POSEWEAR_SITE="${POSEWEAR_SITE:-${CF_PAGES_URL:-https://posewear.pages.dev}}"
python3 build.py

# Only user-triggered /api endpoints invoke Pages Functions; gallery images load from their original hosts.
cat > dist/_routes.json <<'EOF'
{"version":1,"include":["/api/*"],"exclude":[]}
EOF

echo "Cloudflare Pages build complete: $(find dist -type f | wc -l) static files."
