---
name: ui
description: Construir o rediseñar una pantalla o componente de Vice Challenges con el sistema visual del proyecto. Usar para cualquier trabajo de interfaz: páginas nuevas, componentes, layouts, estados vacíos, formularios, o "hazlo más bonito".
argument-hint: "[pantalla o componente a construir]"
---

# /ui — construir interfaz

Objetivo: que cada pantalla se vea diseñada a propósito, no generada. Mobile primero.

## 1. Antes de escribir código

1. Lee `docs/DESIGN.md` completo (tokens, firma, anti-patrones). No trabajes de memoria.
2. Mira qué existe: `components/`, `components/ui/`, `app/globals.css`. Reutiliza antes de crear.
3. **Pantalla nueva o rediseño grande:** carga la skill `frontend-design` para el proceso de plan → revisión contra lo genérico → construcción. Las decisiones de paleta y tipografía ya están tomadas en `docs/DESIGN.md`; úsala para composición, layout y copy, no para reinventar la marca.
4. **Patrón de plataforma** (dialog/modal, popover, formulario y validación, tabla, animación, carga de imágenes): carga `modern-web-guidance` y busca la forma moderna antes de escribirlo o de añadir una dependencia.
5. Decide en 3 líneas (para ti, no hace falta mostrarlas salvo que sea una pantalla nueva):
   - **Lo más importante de la pantalla** (una cosa). Debe ganar en tamaño/contraste.
   - **El gesto de firma** que usará (panel rasgado, sticker, marcador o glow) — solo uno protagonista.
   - **La acción primaria** (un solo botón `vice`).

## 2. Construcción

- Server Component por defecto; `"use client"` solo en la hoja que necesita interactividad.
- Estilos con clases Tailwind que referencian tokens (`bg-surface`, `text-ink-muted`, `font-display`). **Prohibido** hex sueltos o colores de la paleta por defecto de Tailwind (`bg-purple-500`, `text-gray-400`).
- Primitivas: shadcn/ui en `components/ui/`, re-estiladas con tokens. Si añades una (`npx shadcn@latest add <x>`), ajústala al sistema antes de usarla.
- Iconos: `lucide-react`, 20px en UI, `strokeWidth={2}`. Nada de emojis como iconos.
- Espaciado en escala de 4px. Padding lateral de página: 16px móvil, 24px tablet, contenedor máx 1200px en desktop.
- Datos de ejemplo verosímiles en español (retos con nombre real, tiempos como `02:41.380`, usernames creíbles). Si la tabla aún no existe, crea un fixture en `lib/fixtures.ts` en vez de inventar lorem.
- Cubre **todos** los estados: carga (skeleton con la forma real), vacío (con invitación a actuar), error (qué pasó + qué hacer), y el caso largo (título de 80 caracteres, 0 y 500 participantes).
- Accesibilidad: semántica correcta (`button` vs `a`), `label` en cada input, foco visible, objetivos ≥ 44px.

## 3. Verificar (obligatorio)

Ejecuta `/design-review` sobre la ruta que tocaste. No declares terminado sin haber visto las capturas.

## 4. Al cerrar

En 2–4 líneas: qué construiste, la ruta para verla, y cualquier decisión de diseño que el equipo debería conocer. Si añadiste un patrón reutilizable nuevo (token, componente de firma), agrégalo a `docs/DESIGN.md`.
