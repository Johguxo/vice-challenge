---
name: db
description: Cambiar el esquema o los datos de Supabase en Vice Challenges — nueva tabla, columna, política RLS, función, bucket de Storage o seed. Crea la migración versionada, la aplica en local, regenera los tipos TypeScript y actualiza el seed.
argument-hint: "[cambio de esquema que necesitas]"
---

# /db — cambios en Supabase

Regla de oro: **el esquema solo cambia con archivos en `supabase/migrations/`**. Nunca edites el esquema desde el dashboard ni con SQL suelto contra remoto.

## 1. Entender el estado actual

- Lee las migraciones existentes (`ls supabase/migrations`) y `lib/supabase/database.types.ts`.
- Si el stack local no corre: `supabase start` (requiere Docker). Si no hay `supabase/`, `supabase init`.

- Carga la skill `supabase-postgres-best-practices` y lee las referencias que apliquen al cambio (como mínimo `security-rls-basics`, `security-rls-performance` y `schema-foreign-key-indexes` cuando hay tablas nuevas).

## 2. Escribir la migración

```bash
supabase migration new <verbo_objeto>   # ej: add_submissions, add_challenge_slug_index
```

En el SQL:

- Tablas en `public`, nombres en inglés plural snake_case. `id uuid primary key default gen_random_uuid()`, `created_at timestamptz not null default now()`.
- FKs con `on delete` explícito. Índices para cada FK y para cada columna por la que se ordene/filtre (ej. ranking: `(challenge_id, status, claimed_time_ms)`).
- Enums como `check` constraints o tipos enum de Postgres — consistentes con los existentes.
- Tiempos en `integer` milisegundos.
- **RLS en la misma migración**: `alter table ... enable row level security;` + políticas explícitas para `select`, `insert`, `update`, `delete` según aplique. Patrones:
  - Lectura pública de contenido publicado: `using (status = 'published')`.
  - Escribir lo propio: `with check (auth.uid() = user_id)`.
  - Moderación: helper `public.is_mod()` (`security definer`, `set search_path = ''`) que mira `profiles.role`.
  - Un usuario **no** puede cambiar `status` de su propio submission a `approved`: eso solo vía mod.
- Funciones `security definer` siempre con `set search_path = ''` y nombres calificados.
- Storage: bucket con `file_size_limit` y `allowed_mime_types` (`image/png`, `image/jpeg`, `image/webp`), políticas sobre `storage.objects` por carpeta `auth.uid()`.

## 3. Aplicar y verificar

```bash
supabase db reset                     # aplica todas las migraciones + seed en local
supabase gen types typescript --local > lib/supabase/database.types.ts
npx tsc --noEmit
```

Prueba la RLS de verdad, no de palabra: con `psql` local (`supabase status` da la URL) haz `set role authenticated; set request.jwt.claims = '{"sub":"<uuid>"}';` y verifica que un usuario no puede leer/escribir lo ajeno. Si existe el MCP de Supabase, `get_advisors` (security) sobre el proyecto remoto tras desplegar.

## 4. Seed

Mantén `supabase/seed.sql` con 8–12 retos verosímiles en español (distintas modalidades, dificultades y niveles de verificación), algunos perfiles y envíos en los tres estados, para que las pantallas siempre tengan contenido realista. Usa UUIDs fijos para que los enlaces de desarrollo sean estables. Son datos de ejemplo: nunca los presentes como reales ni los lleves a producción.

## 5. Remoto

Aplicar a producción **solo cuando el usuario lo pida**: `supabase db push` (con el proyecto enlazado vía `supabase link`). Antes, muestra qué migraciones se van a aplicar (`supabase migration list`). Migraciones destructivas (drop/rename de columnas con datos) requieren confirmación explícita.
