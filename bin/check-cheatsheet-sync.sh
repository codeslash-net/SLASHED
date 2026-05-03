#!/usr/bin/env bash
#
# check-cheatsheet-sync.sh — verify every .class and --token documented in
# cheatsheet.html maps to a real selector or custom-property declaration in
# css/*.css source files.
#
# Implements the "Cheatsheet content audit (CI grep)" check from SPEC.md.
#
# Usage: bin/check-cheatsheet-sync.sh
#
# Exits 0 when every documented item has a source match.
# Exits 1 with a report of missing items.
#
# Notes:
#   - Skips slashed-full.css (generated bundle — not an authority).
#   - Checks .class names against selector occurrences in css/*.css.
#   - Checks --token names against property declarations (token-name:) in css/*.css.
#   - Entries with "proposed" tags are NOT excluded — if it's in the cheatsheet,
#     it must be in the source.
#   - JS API entries (slashedUI.*) are not checked — JS is not grep-friendly.
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHEATSHEET="$REPO_ROOT/cheatsheet.html"
CSS_SOURCES=("$REPO_ROOT"/css/*.css)

# Remove the generated bundle from the source list.
filtered_sources=()
for f in "${CSS_SOURCES[@]}"; do
  [[ "$(basename "$f")" == "slashed-full.css" ]] && continue
  filtered_sources+=("$f")
done

if [[ ! -f "$CHEATSHEET" ]]; then
  echo "check-cheatsheet-sync: cheatsheet.html not found at $CHEATSHEET" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Extract raw text from every <span class="name"> element.
# Strategy: grab the full line, strip all inner HTML tags, leaving plain text.
# Multi-name entries like ".foo / .bar" or ".foo--x / --foo--y" are handled by
# the class/token extraction below (both sides of "/" are extracted).
# ---------------------------------------------------------------------------
name_text=$(
  grep -o '<span class="name">[^<]*\(<[^>]*>[^<]*</[^>]*>\)*[^<]*</span>' "$CHEATSHEET" \
  | sed 's/<[^>]*>//g' \
  | sed 's/&amp;/\&/g; s/&lt;/</g; s/&gt;/>/g'
)

# ---------------------------------------------------------------------------
# Extract .class-name tokens (starts with dot, then lowercase or digit or -/_).
#
# Exclusions:
#   - Lines containing "slashedUI." — these are JS API entries; camelCase method
#     names produce false matches (e.g. ".open" from "slashedUI.openModal").
#   - Names ending in "-" — wildcard-prefix notation (e.g. ".gap-x-*").
#   - Single-word responsive / variant prefixes that are only meaningful as
#     compound selectors (sm|md|lg|xl|print|dark|motion-safe|motion-reduce).
# ---------------------------------------------------------------------------
classes=$(
  printf '%s\n' "$name_text" \
  | grep -v 'slashedUI\.' \
  | sed 's/[0-9][0-9]*\/[0-9][0-9]*/FRAC/g' \
  | grep -oE '\.[a-z][a-z0-9_-]+' \
  | grep -v -- '-$' \
  | grep -vE '^\.(sm|md|lg|xl|print|dark|motion-safe|motion-reduce)$' \
  | sort -u
)

# ---------------------------------------------------------------------------
# Extract --token-name tokens.
# Only process lines that are about tokens (start with -- or contain a token
# as the primary subject). Exclude lines that start with a CSS class (.)
# to avoid treating BEM modifiers (e.g. .cs-btn--icon → "--icon") as tokens.
# ---------------------------------------------------------------------------
tokens=$(
  printf '%s\n' "$name_text" \
  | grep -v '^[[:space:]]*\.' \
  | grep -oE -e '--[a-z][a-z0-9_-]+' \
  | sort -u
)

# ---------------------------------------------------------------------------
# Check each class against CSS source files.
# A class is "found" if any source file contains it as a selector fragment.
# We look for `.classname` surrounded by { , > + ~ space : [ or end-of-selector.
# ---------------------------------------------------------------------------
missing_classes=()
while IFS= read -r cls; do
  # Escape dots for grep
  pattern=$(printf '%s' "$cls" | sed 's/\./\\./g; s/-/\\-/g')
  if ! grep -qE "(^|[[:space:],>+~])${pattern}([[:space:],:#{.[>+~]|$)" \
       "${filtered_sources[@]}" 2>/dev/null; then
    missing_classes+=("$cls")
  fi
done <<< "$classes"

# ---------------------------------------------------------------------------
# Check each --token against CSS source files.
# A token is "found" if any source file contains "token-name:" (declaration).
# ---------------------------------------------------------------------------
missing_tokens=()
while IFS= read -r tok; do
  # Strip the leading --
  prop="${tok#--}"
  pattern="--${prop}[[:space:]]*:"
  if ! grep -qE -e "$pattern" "${filtered_sources[@]}" 2>/dev/null; then
    missing_tokens+=("$tok")
  fi
done <<< "$tokens"

# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------
status=0

if [[ ${#missing_classes[@]} -gt 0 ]]; then
  printf 'check-cheatsheet-sync: %d class(es) documented but not found in css/*.css:\n' \
    "${#missing_classes[@]}" >&2
  for c in "${missing_classes[@]}"; do
    printf '  %s\n' "$c" >&2
  done
  status=1
fi

if [[ ${#missing_tokens[@]} -gt 0 ]]; then
  printf 'check-cheatsheet-sync: %d token(s) documented but not found in css/*.css:\n' \
    "${#missing_tokens[@]}" >&2
  for t in "${missing_tokens[@]}"; do
    printf '  %s\n' "$t" >&2
  done
  status=1
fi

if [[ "$status" -eq 0 ]]; then
  n_classes=$(printf '%s\n' "$classes" | grep -c . || true)
  n_tokens=$(printf '%s\n' "$tokens" | grep -c . || true)
  printf 'check-cheatsheet-sync: ok (%d classes, %d tokens checked)\n' \
    "$n_classes" "$n_tokens"
fi

exit "$status"
