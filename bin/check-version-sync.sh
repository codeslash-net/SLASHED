#!/usr/bin/env bash
#
# check-version-sync.sh — verify CLAUDE.md and CONTRIBUTING.md "Current
# version" lines match the most recent released entry in CHANGELOG.md.
#
# CHANGELOG.md is the source of truth. The most recent `## [x.y.z.w]`
# heading (skipping `[unreleased]`) is what every other top-level doc
# must match. Drift here means the docs are aspirational while the
# released version is something else — catch it before tagging.
#
# Companion to bin/bump-version.sh, which writes the strings; this script
# verifies them. Style mirrors bin/build-bundle.sh.
#
# Usage: bin/check-version-sync.sh
#
# Exits 0 when CLAUDE.md, CONTRIBUTING.md, and CHANGELOG.md agree.
# Exits non-zero with a per-file mismatch report otherwise.
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Latest released version from CHANGELOG.md.
# Skips the `[unreleased]` heading via grep on the bracketed digit form.
CHANGELOG_VERSION="$(
  grep -oE '^## \[[0-9]+\.[0-9]+\.[0-9]+(\.[0-9]+)?\]' "$REPO_ROOT/CHANGELOG.md" \
    | head -1 \
    | sed -E 's/^## \[(.*)\]/\1/'
)"

if [[ -z "$CHANGELOG_VERSION" ]]; then
  echo "check-version-sync: no released version heading found in CHANGELOG.md" >&2
  exit 1
fi

# Pull the version out of a `Current version: X.Y.Z(.W)` line, tolerating
# optional `**` markdown emphasis around the number.
extract_doc_version() {
  local file="$1"
  grep -oE 'Current version:[[:space:]]*\*{0,2}[0-9]+\.[0-9]+\.[0-9]+(\.[0-9]+)?\*{0,2}' "$file" \
    | head -1 \
    | sed -E 's/.*Current version:[[:space:]]*\*{0,2}([0-9.]+)\*{0,2}/\1/'
}

CLAUDE_VERSION="$(extract_doc_version "$REPO_ROOT/CLAUDE.md")"
CONTRIB_VERSION="$(extract_doc_version "$REPO_ROOT/CONTRIBUTING.md")"

status=0
report_mismatch() {
  local file="$1"
  local got="$2"
  printf 'check-version-sync: %s says %s, expected %s (from CHANGELOG.md)\n' \
    "$file" "${got:-<missing>}" "$CHANGELOG_VERSION" >&2
  status=1
}

[[ "$CLAUDE_VERSION"  == "$CHANGELOG_VERSION" ]] || report_mismatch "CLAUDE.md"       "$CLAUDE_VERSION"
[[ "$CONTRIB_VERSION" == "$CHANGELOG_VERSION" ]] || report_mismatch "CONTRIBUTING.md" "$CONTRIB_VERSION"

if [[ "$status" -eq 0 ]]; then
  printf 'check-version-sync: ok (%s)\n' "$CHANGELOG_VERSION"
fi

exit "$status"
