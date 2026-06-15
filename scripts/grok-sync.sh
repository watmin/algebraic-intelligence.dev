#!/usr/bin/env bash
#
# grok-sync.sh — one command: refresh Grok Imagine auth from your clipboard, then
# pull every NEW liked image + its prompt (incremental — already-fetched ones are
# skipped via the on-disk manifest checkpoint).
#
#   1. Chrome DevTools → Network → right-click the `media/post/list` request →
#      Copy → "Copy as cURL (bash)".   (now it's in your clipboard)
#   2. ./scripts/grok-sync.sh
#
# Flags / inputs:
#   --cred-only   refresh auth.json only, don't fetch
#   -             read the cURL from stdin (paste, then Ctrl-D) instead of clipboard
#   FILE          read the cURL from a file instead of the clipboard
#
# Clipboard is read via wl-paste (Wayland) / xclip / xsel / pbpaste — whichever
# your desktop has. Secrets stay in ~/grok-imagine/ (auth.json, chmod 600) and
# never enter the repo.

set -euo pipefail
cd "$(dirname "$0")/.."                          # repo root, so node paths resolve
ROOT="${GROK_DIR:-$HOME/grok-imagine}"
mkdir -p "$ROOT"

cred_only=0
src=""
for a in "$@"; do
  case "$a" in
    --cred-only) cred_only=1 ;;
    -)           src="-" ;;
    *)           src="$a" ;;
  esac
done

try_tool() {
  local out
  out="$("$@" 2>/dev/null)" || return 1
  [ -n "$out" ] || return 1
  printf '%s' "$out"
}

read_clipboard() {
  command -v wl-paste >/dev/null 2>&1 && try_tool wl-paste                      && return 0
  command -v xclip    >/dev/null 2>&1 && try_tool xclip -o -selection clipboard && return 0
  command -v xsel     >/dev/null 2>&1 && try_tool xsel -b                       && return 0
  command -v pbpaste  >/dev/null 2>&1 && try_tool pbpaste                       && return 0
  return 1
}

if [ "$src" = "-" ]; then
  curl_text="$(cat)"
elif [ -n "$src" ]; then
  curl_text="$(cat "$src")"
elif ! curl_text="$(read_clipboard)"; then
  cat >&2 <<'MSG'
Couldn't read the clipboard on this desktop (Wayland needs wl-clipboard).
  • sudo apt install wl-clipboard      # wl-paste (Wayland-native)
  • ./scripts/grok-sync.sh -           # paste the cURL on stdin, then Ctrl-D
  • ./scripts/grok-sync.sh FILE        # read the cURL from a file
MSG
  exit 1
fi

[ -n "${curl_text//[[:space:]]/}" ] || { echo "empty input — 'Copy as cURL' first?" >&2; exit 1; }
printf '%s' "$curl_text" | grep -q 'grok\.com' || echo "Heads up: input doesn't mention grok.com — wrong request copied?" >&2

umask 077
printf '%s' "$curl_text" > "$ROOT/curl.txt"
chmod 600 "$ROOT/curl.txt"
node scripts/grok-auth-from-curl.mjs "$ROOT/curl.txt"

if [ "$cred_only" = 1 ]; then
  echo
  echo "creds refreshed (--cred-only). Fetch later with:  node scripts/grok-fetch.mjs"
  exit 0
fi

echo
echo "── fetching liked images (incremental) ──"
node scripts/grok-fetch.mjs
