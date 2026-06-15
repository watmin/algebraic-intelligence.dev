#!/usr/bin/env bash
#
# gallery-sync.sh — turn freshly-fetched Grok images into the live gallery:
#   organize (filter datamancy + group by prompt) → upload to R2 → rebuild manifest.
#
# The full loop for a new batch of liked images:
#   ./scripts/grok-sync.sh        # paste "Copy as cURL" → fetch only NEW likes
#   ./scripts/gallery-sync.sh     # organize → upload → manifest   (this script)
#   npm run build && git push     # deploy to Cloudflare
#
# Note: images whose prompt is brand-new (no existing Incantatio) are reported by
# grok-organize as unmatched — those need an intueri-named page scaffolded first.
# Re-runs are incremental: r2-upload only pushes new files.

set -euo pipefail
cd "$(dirname "$0")/.."

echo "── 1/3 organize (filter CORE, group by prompt) ──"
node scripts/grok-organize.mjs
echo
echo "── 2/3 upload to R2 (incremental) ──"
./scripts/r2-upload.sh
echo
echo "── 3/3 rebuild manifest ──"
node scripts/gallery-manifest.mjs
echo
echo "✓ gallery-sync complete. Next:  npm run build  then  git push  (deploys)."
