#!/usr/bin/env bash
# rename-project.sh — Rename this template from "ad-stack" to your project name.
# Run once after cloning: bash scripts/rename-project.sh

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}${BOLD}ℹ${RESET}  $*"; }
success() { echo -e "${GREEN}${BOLD}✔${RESET}  $*"; }
warn()    { echo -e "${YELLOW}${BOLD}⚠${RESET}  $*"; }
error()   { echo -e "${RED}${BOLD}✘${RESET}  $*" >&2; }
step()    { echo -e "\n${BOLD}$*${RESET}"; }

# ── Guards ────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ ! -f "$ROOT_DIR/package.json" ]]; then
  error "Run this script from the project root or via: bash scripts/rename-project.sh"
  exit 1
fi

CURRENT_NAME="ad-stack"

# Check the template hasn't already been renamed
if ! grep -q "\"$CURRENT_NAME\"" "$ROOT_DIR/package.json" 2>/dev/null; then
  warn "It looks like the project has already been renamed."
  warn "This script expects the template name \"$CURRENT_NAME\" to still be present."
  read -rp "  Continue anyway? [y/N] " FORCE
  [[ "${FORCE,,}" == "y" ]] || { info "Aborted."; exit 0; }
fi

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║        ad-stack  →  your project         ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${RESET}"
echo ""
info "This script renames every occurrence of \"${CURRENT_NAME}\" across the"
info "monorepo (package names, imports, config files) and re-installs"
info "dependencies with Bun so you're ready to start coding immediately."
echo ""

# ── Prompt ────────────────────────────────────────────────────────────────────
while true; do
  read -rp "  Enter your project name (lowercase, letters, numbers, hyphens): " NEW_NAME

  # Strip whitespace
  NEW_NAME="${NEW_NAME// /-}"
  NEW_NAME="${NEW_NAME,,}"

  if [[ -z "$NEW_NAME" ]]; then
    error "Project name cannot be empty. Try again."
    continue
  fi

  if [[ ! "$NEW_NAME" =~ ^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$ ]]; then
    error "\"$NEW_NAME\" is not a valid name."
    error "Use only lowercase letters, numbers, and hyphens (no leading/trailing hyphens)."
    continue
  fi

  if [[ "$NEW_NAME" == "$CURRENT_NAME" ]]; then
    error "New name is the same as the current name (\"$CURRENT_NAME\"). Pick a different name."
    continue
  fi

  break
done

echo ""
echo -e "  ${BOLD}Template name :${RESET} ${CYAN}$CURRENT_NAME${RESET}"
echo -e "  ${BOLD}New name      :${RESET} ${GREEN}$NEW_NAME${RESET}"
echo ""
read -rp "  Looks good? Proceed? [Y/n] " CONFIRM
[[ "${CONFIRM,,}" == "n" ]] && { info "Aborted."; exit 0; }

# ── File discovery ────────────────────────────────────────────────────────────
step "  [1/3] Finding files that reference \"$CURRENT_NAME\"..."

EXCLUDE_DIRS=(
  node_modules .git .turbo dist .next .cache build
)

EXCLUDE_ARGS=()
for d in "${EXCLUDE_DIRS[@]}"; do
  EXCLUDE_ARGS+=("--exclude-dir=$d")
done

FILES=$(grep -rl "$CURRENT_NAME" \
  "${EXCLUDE_ARGS[@]}" \
  --exclude="bun.lock" \
  --exclude="*.png" --exclude="*.jpg" --exclude="*.jpeg" --exclude="*.ico" \
  --exclude="*.woff" --exclude="*.woff2" --exclude="*.ttf" \
  "$ROOT_DIR" 2>/dev/null) || true

if [[ -z "$FILES" ]]; then
  warn "No files containing \"$CURRENT_NAME\" were found. Nothing to rename."
  exit 0
fi

FILE_COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
info "Found $FILE_COUNT file(s) to update."

# ── Replacement ───────────────────────────────────────────────────────────────
step "  [2/3] Replacing \"$CURRENT_NAME\" → \"$NEW_NAME\"..."

UPDATED=0
FAILED=0

while IFS= read -r file; do
  # Skip binary files
  if file "$file" | grep -qE "binary|executable|image|font"; then
    continue
  fi

  if perl -pi -e "s/\Q$CURRENT_NAME\E/$NEW_NAME/g" "$file" 2>/dev/null; then
    UPDATED=$((UPDATED + 1))
  else
    warn "  Could not update: $file"
    FAILED=$((FAILED + 1))
  fi
done <<< "$FILES"

success "Updated $UPDATED file(s)${FAILED:+" ($FAILED skipped — check warnings above)"}."

# ── Re-install dependencies ───────────────────────────────────────────────────
step "  [3/3] Re-installing dependencies with Bun..."

if ! command -v bun &>/dev/null; then
  warn "Bun is not installed or not in PATH."
  warn "Run \"bun install\" manually once Bun is available."
else
  # Remove stale lockfile so Bun resolves fresh package names
  rm -f "$ROOT_DIR/bun.lock"

  cd "$ROOT_DIR"
  bun install

  success "Dependencies installed."
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}${BOLD}║  All done! Your project is now \"$NEW_NAME\".$(printf '%*s' $((26 - ${#NEW_NAME})) '')║${RESET}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════╝${RESET}"
echo ""
info "Next steps:"
echo "    1. Copy .env.example files and fill in your secrets"
echo "    2. Run ${BOLD}bun dev${RESET} to start all services"
echo ""
