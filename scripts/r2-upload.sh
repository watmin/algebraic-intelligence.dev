#!/usr/bin/env bash
#
# r2-upload.sh — sync the staged gallery images to the R2 bucket.
#
# Uploads ~/grok-imagine/by-prompt/<slug>/<id>.jpg  →  s3://<bucket>/<slug>/<id>.jpg
# (which serves at  $R2_PUBLIC_BASE/<slug>/<id>.jpg). Incremental via --size-only,
# so re-running after a new grok-sync batch only pushes the new files.
#
# Creds come from ~/grok-imagine/r2.env (never the repo). Usage:
#   ./scripts/r2-upload.sh            # sync ~/grok-imagine/by-prompt
#   ./scripts/r2-upload.sh <dir>      # sync a specific dir

set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="${GROK_DIR:-$HOME/grok-imagine}"
# shellcheck disable=SC1090
. "$ROOT/r2.env"

export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION=auto
# Recent aws-cli sends checksum headers R2 rejects; make them conditional.
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required

EP="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
SRC="${1:-$ROOT/by-prompt}"

echo "syncing $SRC  →  s3://$R2_BUCKET/  (R2 @ $EP)"
# Images are content-addressed (<slug>/<uuid>.jpg) — the bytes at a URL never
# change — so they're safe to cache forever (browser + Cloudflare edge).
aws s3 sync "$SRC" "s3://$R2_BUCKET/" \
  --endpoint-url "$EP" \
  --exclude "*_prompt.txt" \
  --cache-control "public, max-age=31536000, immutable" \
  --size-only \
  --no-progress
echo "done — images live under $R2_PUBLIC_BASE/<slug>/"
