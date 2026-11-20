@AGENTS.md

## Solo para Claude Code

- Las skills viven en `.agents/skills/` (fuente única). `.claude/skills/` es una copia generada: **no la edites a mano**. El hook sincroniza solo al editar `.agents/skills/`.
- Agente `design-critic` (`.claude/agents/design-critic.md`): úsalo desde `/design-review` en pantallas nuevas o rediseños grandes.
- Hook PostToolUse (`.claude/hooks/format.sh`): Prettier sobre cada archivo editado + sync de skills.
