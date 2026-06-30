#!/usr/bin/env bash
set -e

usage() {
  echo "Usage: ./reset.sh [session]"
  echo ""
  echo "Sessions:"
  echo "  1  Code generation & editing (main branch, clean)"
  echo "  2  Debugging, testing & code review (demo/bugs branch)"
  echo "  3  Commands, skills, and hooks (main branch, no .claude/)"
  echo ""
  echo "No argument = full reset to main"
}

cd "$(dirname "$0")"

# Nuke any working changes and untracked files (except node_modules/docs)
git checkout -- . 2>/dev/null || true
git clean -fd --exclude=node_modules --exclude=docs 2>/dev/null || true

# Remove any .claude directory on main (session 3 builds it live)
rm -rf .claude/commands .claude/skills .claude/settings.json 2>/dev/null || true
rmdir .claude 2>/dev/null || true

# Remove test files that may have been created during demos
rm -rf tests/ 2>/dev/null || true

# Remove db/ directory that may have been created during refactoring demo
rm -rf db/ 2>/dev/null || true

# Fresh database
rm -f bookbuddy.db bookbuddy.db-shm bookbuddy.db-wal

case "${1:-}" in
  1)
    git checkout demo/code-gen 2>/dev/null
    node seed.js
    echo "Reset for Session 1 — Code generation & editing"
    echo "Run: npm start"
    ;;
  2)
    git checkout demo/bugs 2>/dev/null
    node seed.js
    echo "Reset for Session 2 — Debugging, testing & code review"
    echo "Run: npm start"
    echo "Bugs: rating >=5, swapped isbn/description, wrong ORDER BY"
    ;;
  3)
    git checkout main 2>/dev/null
    node seed.js
    echo "Reset for Session 3 — Commands, skills, and hooks"
    echo "Run: npm start"
    echo ".claude/ directory is clean — build it live"
    ;;
  ""|help|--help|-h)
    git checkout main 2>/dev/null
    node seed.js
    if [ "${1:-}" = "" ]; then
      echo "Full reset to main — clean state"
    else
      usage
    fi
    ;;
  *)
    echo "Unknown session: $1"
    usage
    exit 1
    ;;
esac
