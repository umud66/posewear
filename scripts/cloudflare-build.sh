#!/usr/bin/env bash
set -euo pipefail

# Cloudflare Pages Git Integration build command: bash scripts/cloudflare-build.sh
# Read source catalogs only. Never bulk-download or upload the original image files.
python3 scripts/fetch-assets.py --meta-only

# The original gallery pages are referenced on demand from their owners.
export POSEWEAR_REMOTE_ASSETS=1
export POSEWEAR_SITE="${POSEWEAR_SITE:-${CF_PAGES_URL:-https://posewear.pages.dev}}"
python3 build.py

echo "Cloudflare Pages build complete: $(find dist -type f | wc -l) static files."
