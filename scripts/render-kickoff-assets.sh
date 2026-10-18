#!/usr/bin/env bash
# Renders the kickoff's images and FAQ PDF from assets/kickoff/src/ with headless Chrome.
# For maintainers of the template only: the rendered files are committed, so nobody running the kickoff needs Chrome.
# Usage: bash scripts/render-kickoff-assets.sh
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in "/c/Program Files/Google/Chrome/Application/chrome.exe" \
           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
           "$(command -v google-chrome || true)" "$(command -v chromium || true)"; do
    [ -n "$c" ] && [ -x "$c" ] && CHROME="$c" && break
  done
fi
[ -n "$CHROME" ] || { echo "Chrome not found; set CHROME=/path/to/chrome" >&2; exit 127; }

SRC="$(pwd)/assets/kickoff/src"
OUT_POSIX="$(pwd)/assets/kickoff"; OUT="$OUT_POSIX"; case "$OUT" in /c/*) OUT="C:${OUT#/c}";; esac
url() { local p="$SRC/$1"; case "$p" in /c/*) p="C:${p#/c}";; esac; echo "file:///$p"; }

shot() { # name width height
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size="$2,$3" --screenshot="$OUT/$1.png" "$(url "$1.html")" 2>/dev/null
  echo "rendered $OUT/$1.png"
}
shot welcome 1280 730
shot paths 1280 522
shot hierarchy 1280 605
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$OUT/bobi-stack-faq.pdf" "$(url faq.html)" 2>/dev/null
echo "rendered $OUT/bobi-stack-faq.pdf"
