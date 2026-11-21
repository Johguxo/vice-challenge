<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Vice Challenges

Plataforma web de fans (Team Chis 🧀) para crear, aceptar y completar desafíos de GTA VI, con evidencia, revisión y rankings. Proyecto **no oficial**, sin afiliación con Rockstar Games ni Take-Two.

- Producto completo: `docs/PRODUCT.md` (fuente de verdad del alcance; léelo antes de proponer funciones nuevas).
- Sistema visual: `docs/DESIGN.md` (léelo SIEMPRE antes de tocar UI).
- Apps e ideas: `docs/IDEAS.md` (la plataforma, de nombre provisional **ViceApp**, es un conjunto de apps: Retos en `/challenges`, Diario en `/journal`…; ahí se apuntan las ideas nuevas y las reglas de rutas).

## Cómo trabajamos

- **Prueba y error.** Sin tickets, sin specs largas, sin planes de 10 pasos. Construye algo pequeño, míralo funcionando, ajusta.
- Cada cambio de UI termina **viéndolo en el navegador**: corre `/design-review` (capturas móvil + desktop, crítica, arreglos). Si no lo viste, no está terminado.
- **Todo en `main`**, sin ramas ni PRs. `git pull --rebase` antes de empezar y antes de cada push; nunca `--force`. Repo: https://github.com/Johguxo/vice-challenge
- Cambios chicos y frecuentes. Si una idea es grande, haz primero la versión más simple que se pueda ver.
- Pregunta solo cuando la decisión sea realmente del equipo (nombre, reglas de verificación, qué entra al MVP). Lo demás: decide, dilo en una línea y sigue.
- Idioma: código, nombres de tablas y variables en **inglés**; todo texto visible al usuario en **español neutro**.

## Stack

| Capa                | Elección                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| App                 | Next.js (App Router) + TypeScript estricto + React Server Components                                                                 |
| Estilos             | Tailwind CSS v4 (tokens en `@theme` dentro de `app/globals.css`) + shadcn/ui como primitivas, **re-estilizadas** con nuestros tokens |
| Datos/Auth/Archivos | Supabase (Postgres + Auth + Storage), cliente vía `@supabase/ssr`                                                                    |
| Deploy              | Vercel (deploy automático desde GitHub; preview por rama)                                                                            |
| Gestor de paquetes  | npm                                                                                                                                  |

Sin backend separado: lecturas en Server Components, escrituras con Server Actions. Route Handlers solo si algo externo necesita una URL (webhooks, OG images).

## Comandos

```bash
npm run dev            # http://localhost:3000
npm run build          # build de producción (debe pasar antes de push)
npm run lint
npx tsc --noEmit       # typecheck
node scripts/shot.mjs / /challenges   # capturas en .shots/ (móvil 390 + desktop 1440)
npm run build && npx next start -p 3100 & node scripts/perf.mjs / /challenges   # LCP/CLS/JS en móvil lento simulado
supabase start         # Postgres/Auth/Storage local (Docker)
supabase migration new <nombre>
supabase db reset      # recrea local con migraciones + seed.sql
supabase gen types typescript --local > lib/supabase/database.types.ts
```

## Estructura (objetivo)

```
app/                    # rutas (App Router)
  page.tsx              # portada (futuro hub de apps)
  challenges/           # app de retos: lista, [slug] compartible
  journal/              # app Diario (idea, ver docs/IDEAS.md)
  u/[username]/         # perfil público
components/ui/          # primitivas shadcn re-estilizadas
components/             # componentes de producto (ChallengeCard, Leaderboard, ...)
lib/supabase/           # clients server/browser + database.types.ts generado
supabase/migrations/    # SQL versionado — única forma de cambiar el esquema
supabase/seed.sql       # retos de ejemplo realistas para desarrollo
scripts/shot.mjs        # capturas Playwright para revisión visual
docs/                   # PRODUCT.md, DESIGN.md, IDEAS.md
```

## Modelo de datos (MVP)

`profiles` (1:1 con `auth.users`: username, display_name, avatar_url, role `user|mod|admin`) · `challenges` (creator_id, slug, title, description, rules, mode, difficulty, verification_level, status) · `submissions` (challenge_id, user_id, evidence_url, claimed_time_ms, notes, status `pending|approved|rejected`) · `reviews` (submission_id, reviewer_id, decision, reason) · `reports` (target_type, target_id, reason, status).

Tiempos siempre en **milisegundos enteros** (`claimed_time_ms`), formateados solo en UI.

## Reglas no negociables

1. **RLS activado en todas las tablas**, con políticas explícitas. Nunca uses la service role key en código que llegue al cliente.
2. Valida toda entrada en el servidor (zod) aunque el formulario ya valide.
3. Evidencia en el MVP: **enlaces externos** (YouTube, Twitch, TikTok, Streamable) + capturas en Supabase Storage con límite de tamaño y tipo. Nada de subir vídeo propio todavía.
4. Nada de dinero: sin apuestas, pozos, premios canjeables. Solo insignias/puntos sin valor.
5. **Propiedad intelectual:** nunca uses el logo de GTA, la tipografía Pricedown, arte oficial, capturas de trailers, ni personajes de Rockstar en la UI o en assets. La energía "Vice/sunset/neón" sí; la identidad oficial no. Footer con aviso "Proyecto de fans no oficial".
6. No inventes estadísticas ("10k jugadores", "95% de éxito"). En seeds y mocks usa datos verosímiles y marcados como ejemplo.
7. Secretos solo en `.env.local` (no se commitea) y en variables de Vercel.

## Soporte de navegadores

La mayoría llega desde navegadores in-app (TikTok, Instagram, Discord) en móvil. Usa funciones **Baseline Widely available** sin fallback; **Newly available** solo con detección de soporte y degradación elegante. Sin polyfills pesados.

## Skills

Viven en `.agents/skills/` (Codex las lee ahí). Para Claude Code se copian a `.claude/skills/` con `node scripts/sync-skills.mjs`. **Edita siempre en `.agents/skills/`.**

**Propias** (flujo del proyecto):

| Skill           | Cuándo                                                       |
| --------------- | ------------------------------------------------------------ |
| `ui`            | Construir o rediseñar cualquier pantalla/componente          |
| `design-review` | Después de todo cambio de UI: capturas + crítica + arreglos  |
| `db`            | Cualquier cambio de esquema, RLS, Storage o seed en Supabase |
| `ship`          | Checks + commit + push → deploy en Vercel                    |

**De terceros** (guías de apoyo, fijadas en `skills-lock.json`):

| Skill                              | Cuándo                                                                                        | Origen                           |
| ---------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------- |
| `frontend-design`                  | Dirección estética al planear una pantalla nueva                                              | anthropics/skills                |
| `web-design-guidelines`            | Auditar código de UI (accesibilidad, UX, semántica)                                           | vercel-labs/agent-skills         |
| `modern-web-guidance`              | Antes de implementar patrones HTML/CSS/JS de cliente (dialogs, forms, popovers, animaciones…) | GoogleChrome/modern-web-guidance |
| `supabase-postgres-best-practices` | Antes de escribir SQL, migraciones, índices o RLS                                             | supabase/agent-skills            |
| `codebase-design`                  | Al diseñar o reestructurar módulos (`lib/`, data access)                                      | mattpocock/skills                |
| `vercel-react-view-transitions`    | Transiciones entre páginas y elementos compartidos con `<ViewTransition>`                     | vercel-labs/agent-skills         |

**Prioridad cuando chocan:** `docs/DESIGN.md` y este archivo mandan sobre las skills genéricas. Ejemplo: `frontend-design` desaconseja la mono para datos y los fondos casi negros como defaults genéricos; aquí son decisiones explícitas de marca (tiempos en mono tabular, fondo `night` violeta). Si una skill de terceros contradice algo de la marca, gana la marca; si contradice algo técnico y tiene razón, propón actualizar `DESIGN.md`.

Actualizar terceros: `npx skills update -p` y luego `node scripts/sync-skills.mjs`. Añadir una nueva: `npx skills add <repo> --skill <nombre> -a claude-code -a codex --copy -y`.

## Para quien clona el repo

Las skills ya vienen en el repo; no hay que instalar nada para tenerlas.

- **Claude Code:** abre la carpeta y listo (`CLAUDE.md` importa este archivo; skills en `.claude/skills/`, agente `design-critic`, hook de formato).
- **Codex:** lee este `AGENTS.md` y las skills de `.agents/skills/`. `modern-web-guidance` ejecuta `npx -y modern-web-guidance@latest …`, así que necesita red: aprueba ese comando cuando lo pida.
