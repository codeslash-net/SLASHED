#!/usr/bin/env bash
#
# setup-hooks.sh — install SLASHED git hooks into .git/hooks/.
#
# Run once after cloning:
#   bin/setup-hooks.sh
#
# What gets installed:
#   pre-commit  — blocks commits that edit CSS/JS source without also
#                 updating cheatsheet.html, keeping docs in sync with code.
#
# Idempotent: re-running overwrites the previously installed hooks.
# To uninstall: rm .git/hooks/pre-commit
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"

if [[ ! -d "$HOOKS_DIR" ]]; then
  echo "setup-hooks: .git/hooks directory not found — are you in the repo root?" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# pre-commit hook
# ---------------------------------------------------------------------------
PRE_COMMIT="$HOOKS_DIR/pre-commit"

cat > "$PRE_COMMIT" <<'HOOK'
#!/usr/bin/env bash
#
# pre-commit — SLASHED cheatsheet-sync guard.
# Installed by bin/setup-hooks.sh.
#
# When CSS or JS source files are staged, cheatsheet.html must also be staged.
# This keeps the reference documentation in sync with every surface change.
#
# To skip in exceptional cases (pure refactor with no surface change):
#   git commit --no-verify -m "..."
#

staged=$(git diff --cached --name-only 2>/dev/null)

# CSS/JS sources that carry documented surface (exclude the generated bundle).
css_js_staged=$(printf '%s\n' "$staged" \
  | grep -E '^(css/|js/)' \
  | grep -v 'slashed-full\.css' || true)

cheatsheet_staged=$(printf '%s\n' "$staged" \
  | grep -Fx 'cheatsheet.html' || true)

if [[ -n "$css_js_staged" && -z "$cheatsheet_staged" ]]; then
  echo ""
  echo "  pre-commit: CSS/JS changed — cheatsheet.html not staged"
  echo ""
  echo "  Staged source files:"
  printf '%s\n' "$css_js_staged" | sed 's/^/    /'
  echo ""
  echo "  If this change adds, removes, or renames a class, token, or JS API,"
  echo "  update cheatsheet.html and stage it before committing."
  echo ""
  echo "  Pure refactors with no documented-surface change:"
  echo "    git commit --no-verify -m \"...\""
  echo ""
  exit 1
fi

exit 0
HOOK

chmod +x "$PRE_COMMIT"
echo "setup-hooks: installed pre-commit hook at $PRE_COMMIT"
