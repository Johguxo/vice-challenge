---
name: ship
description: Llevar los cambios de Vice Challenges a Vercel — corre lint, typecheck y build, hace commit con mensaje claro y push a GitHub para que Vercel genere el deploy (preview en ramas, producción en main). Usar cuando digan "súbelo", "despliega", "ship", "haz commit".
disable-model-invocation: true
argument-hint: "[mensaje o contexto opcional]"
---

# /ship — checks, commit, push

## 1. Checks (todos deben pasar)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Si algo falla, arréglalo y vuelve a correr. No hagas commit con checks en rojo ni los saltes con `--no-verify`. Si el fallo no es tuyo y no es trivial, para y dilo.

## 2. Revisión rápida del diff

- `git status` + `git diff`: nada de `.env*`, `.shots/`, claves, `console.log` de depuración ni archivos accidentales.
- Si hubo migraciones nuevas, avisa: Vercel **no** las aplica; hay que correr `/db` → paso remoto cuando el equipo quiera.

## 3. Commit y push

- **Todo se trabaja en `main`.** Sin ramas ni PRs: el equipo hace commit y push directo a `main`, y Vercel despliega producción en cada push.
- Antes de commitear: `git pull --rebase origin main` (hay varias personas empujando a `main`). Si hay conflictos, resuélvelos conservando el trabajo de ambos y vuelve a correr los checks.
- Mensaje en español, imperativo y concreto: `Añade ranking por reto con tiempos verificados`.
- `git push origin main`. Si el push es rechazado por cambios nuevos, repite `pull --rebase` y push; nunca `--force`.

## 4. Después

- Con `gh` disponible: muestra el estado del deploy de Vercel en el commit (`gh api repos/{owner}/{repo}/commits/<sha>/status`).
- Si cambiaron variables de entorno, recuerda configurarlas en Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, y las de servidor).
- Informe de 2–3 líneas: rama, commit, URL de preview si existe.
