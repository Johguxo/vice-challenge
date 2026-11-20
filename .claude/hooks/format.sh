#!/usr/bin/env bash
# PostToolUse (Edit|Write):
#  - si se editó una skill en .agents/skills → sincroniza a .claude/skills
#  - formatea con Prettier el archivo tocado, si Prettier está instalado
# Silencioso y nunca bloquea.
file=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -z "$file" ] && exit 0
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"

case "$file" in
  */.agents/skills/*) node "$root/scripts/sync-skills.mjs" >/dev/null 2>&1 || true ;;
esac

case "$file" in
  */.agents/skills/*|*/.claude/skills/*) exit 0 ;;   # no reformatear skills de terceros
  *.ts|*.tsx|*.js|*.mjs|*.jsx|*.css|*.json|*.md|*.sql) ;;
  *) exit 0 ;;
esac
prettier="$root/node_modules/.bin/prettier"
[ -x "$prettier" ] || exit 0
"$prettier" --write --log-level silent "$file" >/dev/null 2>&1 || true
exit 0
