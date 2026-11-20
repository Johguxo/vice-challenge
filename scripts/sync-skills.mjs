#!/usr/bin/env node
// Copia las skills de .agents/skills/ (fuente única, la que lee Codex) a .claude/skills/ (la que lee Claude Code).
// Copias, no symlinks: funciona igual en macOS, Linux y Windows al clonar.
// Uso: node scripts/sync-skills.mjs   (Claude lo corre solo vía hook al editar .agents/skills)
import { cp, readdir, rm, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "..");
const src = path.join(root, ".agents", "skills");
const dst = path.join(root, ".claude", "skills");

await mkdir(dst, { recursive: true });
const names = (await readdir(src, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);

for (const name of names) {
  const to = path.join(dst, name);
  await rm(to, { recursive: true, force: true });
  await cp(path.join(src, name), to, { recursive: true });
}

// Quitar de .claude/skills lo que ya no existe en .agents/skills
for (const d of await readdir(dst, { withFileTypes: true })) {
  if (d.isDirectory() && !names.includes(d.name)) await rm(path.join(dst, d.name), { recursive: true, force: true });
}

console.log(`skills sincronizadas → .claude/skills (${names.length}): ${names.join(", ")}`);
