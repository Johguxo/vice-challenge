# Sistema visual — Vice Challenges

> Atardecer de neón en una ciudad costera, cartel callejero pegado sobre papel, marcador amarillo encima.
> Energía de mundo abierto, **identidad propia**. Nunca la identidad oficial de GTA.

Referencia de ambiente: el póster del Team Chis (cielo rosa/violeta, paneles negros con borde rasgado, subrayados de marcador, etiquetas inclinadas, iconos rosa). Tomamos el **lenguaje** (paneles, marcador, stickers, sunset), no las imágenes.

## 1. Principios

1. **Mobile primero.** Se diseña a 390px y luego se expande. La mayoría llega desde TikTok/Instagram/Discord.
2. **El reto es el héroe.** Título del reto, reglas y el mejor tiempo dominan; la UI decorativa se apaga.
3. **Un gesto de firma por pantalla.** Panel rasgado, sticker inclinado o subrayado de marcador: elige uno protagonista por vista. Si todo es especial, nada lo es.
4. **Oscuro por defecto, solo oscuro.** La marca vive de noche. No hay modo claro.
5. **Números como en un marcador.** Tiempos, posiciones y conteos en mono tabular, grandes y legibles.
6. **Contenido real.** Nunca lorem ipsum. Usa retos verosímiles en español.

## 2. Tokens (Tailwind v4 — pegar en `app/globals.css`)

```css
@import "tailwindcss";

@theme {
  /* Superficies — noche violeta, nunca negro puro */
  --color-night: #0b0612; /* fondo de página */
  --color-surface: #150c21; /* tarjetas */
  --color-surface-2: #21132f; /* elevado / hover */
  --color-line: #3a2550; /* bordes y divisores */

  /* Texto */
  --color-ink: #fff4f8; /* principal */
  --color-ink-muted: #bba8cc; /* secundario (AA sobre night y surface) */
  --color-ink-faint: #8a7699; /* metadatos, nunca para texto largo */

  /* Marca */
  --color-vice: #ff2e93; /* rosa neón — acción primaria, foco, links */
  --color-vice-deep: #c3166c; /* hover/pressed de vice */
  --color-sunset: #ff8a3d; /* naranja — energía, rachas, "en vivo" */
  --color-marker: #ffe14d; /* amarillo marcador — subrayados, stickers, top 1 */
  --color-tide: #2ce6e0; /* turquesa — verificado, estados positivos secundarios */
  --color-dusk: #8b5cf6; /* violeta — dificultad, tags */
  --color-ocean: #5b7cff; /* azul del cielo alto — inicio de los degradados de marca */

  /* Estados */
  --color-ok: #3ee08f;
  --color-warn: #ffb020;
  --color-bad: #ff4d5e;

  /* Tipografía (cargar con next/font/google) */
  --font-display: "Archivo", sans-serif; /* ancho 112–125, peso 800–900 */
  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
  --font-marker: "Permanent Marker", cursive; /* SOLO acentos cortos */

  /* Radios: más cartel que app bancaria */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;

  /* Sombras de neón (usar con moderación) */
  --shadow-glow-vice: 0 0 0 1px #ff2e9355, 0 8px 32px -8px #ff2e9380;
  --shadow-glow-marker: 0 0 0 1px #ffe14d55, 0 8px 32px -8px #ffe14d70;
}

body {
  background: var(--color-night);
  color: var(--color-ink);
}
```

Degradado de atardecer (solo fondos de hero, OG images y tarjetas de resultado):

```css
--sunset: linear-gradient(180deg, #2a0f4a 0%, #6b1a6e 38%, #c3166c 68%, #ff8a3d 100%);
```

## 3. Tipografía

| Rol                            | Fuente                            | Tamaño móvil → desktop                        | Notas                                        |
| ------------------------------ | --------------------------------- | --------------------------------------------- | -------------------------------------------- |
| Display (hero, título de reto) | Archivo 900, `font-stretch: 125%` | 40 → 72px, `leading-[0.95]`, `tracking-tight` | Mayúsculas opcionales; máx 2 líneas          |
| H2 sección                     | Archivo 800, 112%                 | 24 → 32px                                     |                                              |
| H3 / título de tarjeta         | Archivo 800, 100%                 | 18 → 20px                                     |                                              |
| Cuerpo                         | Geist 400                         | 16px, `leading-relaxed`                       | Mínimo 16px en móvil                         |
| UI / labels                    | Geist 500                         | 14px                                          |                                              |
| Meta                           | Geist 400                         | 13px, `ink-faint`                             |                                              |
| Tiempos / posiciones           | Geist Mono 600, `tabular-nums`    | 20 → 32px en ranking                          | Formato `02:41.380`                          |
| Marcador                       | Permanent Marker                  | 18–28px                                       | ≤ 4 palabras. "¿Te atreves?", "Nuevo récord" |

## 4. Elementos de firma

- **Panel rasgado**: superficie `surface` con borde superior/inferior irregular (`clip-path` o máscara SVG). Para bloques de reglas y "¿Qué es esto?". Máximo uno por pantalla.
- **Subrayado de marcador**: trazo amarillo `marker` detrás de 1–3 palabras clave (SVG path con ligera curva, `mix-blend` no necesario). Nunca en párrafos.
- **Sticker**: etiqueta pequeña rotada −3° a 3°, fondo `marker` o `vice`, texto oscuro/claro, `font-marker` o display. Para "Semanal", "Top 1", "Nuevo".
- **Glow de neón**: `shadow-glow-vice` solo en el CTA principal y el foco. Nunca en tarjetas de lista.
- **Grano**: textura de ruido muy sutil (opacidad ≤ 4%) sobre el hero. Opcional.

## 5. Componentes clave

- **ChallengeCard**: modalidad (chip) · título (display 800) · 1 línea de objetivo · dificultad (1–5 barras, `dusk`) · nivel de verificación (icono + texto) · mejor tiempo (mono) · participantes. Toda la tarjeta clicable, `surface` → `surface-2` en hover, sin sombra.
- **Leaderboard**: posición grande en mono; top 1 con `marker`, top 2–3 con `ink`; fila del usuario actual resaltada con borde `vice`. Estado de verificación visible en cada fila.
- **SubmissionStatus**: `pending` (warn, reloj) · `approved` (ok, check) · `rejected` (bad, x + motivo siempre visible).
- **Botón primario**: fondo `vice`, texto `night`, peso 700, altura ≥ 44px, glow en hover/focus. Uno por vista.
- **Botón secundario**: borde `line`, texto `ink`, fondo transparente.
- **ResultCard (compartible)**: 1080×1350 y 1080×1920; fondo sunset, título del reto, tiempo enorme, posición, usuario, marca "Vice Challenges · fan project".

## 6. Movimiento

La web tiene que sentirse viva para que la gente la comparta, pero rápida en móvil. El CSS vive en la sección "Movimiento" de `app/globals.css`.

| Momento              | Qué pasa                                                                                        | Cómo                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Entrada del hero     | Titular por líneas → tarjeta semanal → el sol sale tras ella → sticker "estampado" con rebote   | `.hero-line` (`--i` = orden), `.hero-enter`, `.weekly-sun`, `.sticker-stamp` |
| Scroll del hero      | La escena baja más lento que el contenido (parallax)                                            | `animation-timeline: scroll()` en `.hero-scene` (mejora progresiva)          |
| Escena ambiental     | Estrellas, nubes, helicóptero, noria, ventanas, reflejo del sol, olas y palmeras en bucle suave | `components/hero-scene.tsx`, clases `.scene-*` + `.ambient`                  |
| Reto semanal         | Borde degradado que gira y halo que late                                                        | `.weekly-frame::before` (rotate), `.weekly-halo`                             |
| Tarjetas al aparecer | Suben y se asientan al entrar en pantalla                                                       | `.reveal` en el `<li>`, nunca en la tarjeta (chocaría con el hover)          |
| Tarjeta en hover     | Foco de luz que sigue al puntero, barra de acento completa, se eleva 4px; al pulsar se hunde    | `.challenge-card` + `data-glow` + `components/pointer-glow.tsx`              |
| Tarjeta → detalle    | El título vuela de la tarjeta al `<h1>`; reglas y ranking suben                                 | `<ViewTransition name=… share="text-morph">` + `transitionTypes` en `<Link>` |

Reglas:

- Solo `transform`/`translate`/`scale`/`opacity` (compositor). Nada de animar `width`, `top`, `box-shadow` en bucle.
- **Un momento orquestado por pantalla**; el resto, respuestas a acciones (hover, press, navegación).
- **Bucles solo ambientales y siempre pausables**: llevan `.ambient` y se detienen con el botón "Pausar animación" (`components/motion-toggle.tsx`, WCAG 2.2.2). Nada parpadea más de 3 veces por segundo.
- Una capa decorativa grande nunca se posiciona en `%` del alto de su contenedor: si el texto cambia de líneas al cargar la fuente, la capa se mueve y dispara el CLS. Ánclala en px.
- Movimiento espacial siempre dentro de `@media (prefers-reduced-motion: no-preference)`. Los cambios de color siguen activos. Nunca un reset global de duraciones.
- Animaciones de scroll solo con CSS nativo y `@supports ((animation-timeline: view()) and (animation-range: entry))`; sin soporte, se ve quieto y correcto. Sin polyfills.
- Acento por modalidad (`--accent`): contrarreloj `sunset`, imposible `vice`, comunitario `tide`.
- Presupuesto: LCP móvil < 2,5 s, CLS < 0,1, JS de la home ≤ 160 KB. Medir con `node scripts/perf.mjs` sobre un build de producción.
- Al añadir un `<ViewTransition>` nombrado: nombre único por página (`reto-titulo-<slug>`), `default="none"` + `share` explícito. Ver la skill `vercel-react-view-transitions`.

## 7. Voz y copy

- Tú, directo, con picante de calle pero sin groserías: "¿Te atreves?", "Sube tu prueba", "Aún nadie lo logra".
- Botones con verbo: "Aceptar reto", "Enviar intento", "Crear reto". Nunca "Enviar" a secas ni "Click aquí".
- Errores que dicen qué hacer: "Ese enlace no es de YouTube, Twitch, TikTok o Streamable."
- Estados vacíos con invitación: "Nadie ha completado este reto. Sé el primero."

## 8. Accesibilidad mínima

- Contraste AA: texto normal ≥ 4.5:1 sobre su fondo. `ink-faint` solo para meta ≥ 13px.
- Objetivos táctiles ≥ 44×44px. Foco visible siempre (anillo `vice` 2px + offset).
- Nada comunica solo con color: estados llevan icono + texto.
- Imágenes con `alt` útil; iconos decorativos con `aria-hidden`.

## 9. Anti-patrones (si aparecen, es un bug de diseño)

- El "look IA genérico": hero centrado + 3 tarjetas iguales con iconos + degradado violeta en todo + texto con degradado.
- Emojis como iconos de interfaz (usar `lucide-react`). El 🧀 solo en la firma del Team Chis.
- `rounded-2xl` + sombra suave en todo: aquí los radios son cortos y las superficies planas.
- Más de un acento fuerte compitiendo (rosa + amarillo + turquesa en el mismo bloque).
- Texto gris sobre degradado sin verificar contraste.
- Logo/tipografía/arte oficial de GTA o Rockstar, o personajes de los trailers.
- Lorem ipsum, "Usuario123", estadísticas inventadas.
- Scroll horizontal a 390px, palabras largas en español que desbordan ("Verificación", "participaciones") — usar `break-words`/`hyphens-auto`.

## 10. Hero: atardecer en la costa

Referencia de ambiente (las imágenes locales en `assets/references/`, ignoradas en git): portada y logo de GTA VI y stickers de fans.

**Tomamos el lenguaje, no la identidad:**

- Sí: degradado azul → violeta → rosa → naranja; lettering grueso con contorno oscuro y troquel blanco; stickers con borde blanco y sombra; palmeras, skyline, noria, helicóptero, lancha y atardecer; collage de paneles con marcos gruesos como idea de layout.
- No: logo de GTA/VI ni su silueta, tipografía Pricedown, logo de Rockstar, personajes, arte oficial, "Welcome to Leonida" ni capturas del juego.

**Piezas:**

- `components/hero-scene.tsx`: escena SVG propia (cielo, estrellas, nubes, helicóptero, skyline con ventanas, noria, agua con reflejo, palmeras). Altura fija para no reescalarse con el contenido.
- `.hero-shade`: oscurece el lado del texto y funde la escena con la página.
- `components/weekly-card.tsx`: protagonista del hero. Sol con franjas que se asoma por detrás (`.weekly-sun`), borde degradado que gira, halo, cuenta atrás hasta el lunes, récord a batir y podio.
- `components/site-shell.tsx`: wordmark SVG estilo sticker (`VICE` con degradado y contorno), pastilla con borde degradado y línea de marca bajo el header.

## 11. Páginas internas

Mismo lenguaje que la portada, con menos protagonismo:

- `components/page-banner.tsx`: la escena del hero en versión baja (`<HeroScene variant="banner" />`) como cabecera de `/challenges` y del detalle. Alto mínimo fijo y contenido alineado abajo.
- Tarjetas de reto: borde degradado del color de su modalidad (más intenso al pasar el ratón) y sticker troquelado pequeño (`.sticker-sm`).
- Filtros: pastillas con borde degradado (`.filter-pill`); la activa se rellena de `vice`.
- Detalle: "Récord a batir" reutiliza el borde que gira del reto semanal (`.weekly-frame` + `.weekly-halo`); el primer puesto del ranking lleva corona y franja amarilla (`.ranking-top`).
- El botón "Pausar animación" vive en el header (`components/motion-toggle.tsx`), porque hay escena animada en todas las páginas. En móvil es solo icono, con el texto como nombre accesible.

## 12. Diario (`/journal`): recortes de cuaderno

Retos es neón y paneles oscuros; el Diario es **papel sobre la noche**. Misma escena de fondo, otro material.

- Tokens: `paper` (#fff3df), `paper-ink`, `paper-muted`, `paper-line`. Texto sobre papel siempre en `paper-ink`.
- `.journal-card`: hoja rayada con margen rosa, girada con `--tilt` (±2° como máximo) y se endereza al pasar el puntero.
- `.tape`: cinta translúcida con bordes dentados, color por `data-tint`.
- `.polaroid` + `Postcard`: la "captura" es una ilustración SVG propia por escena (`playa`, `carretera`, `ciudad`, `pantano`, `cielo`). Nunca capturas del juego ni arte oficial en datos de ejemplo.
- `.stamp`: sello de goma doble para "Reto superado"; enlaza al reto. Es el puente entre apps.
- `.sticky-note`: nota adhesiva amarilla para la pregunta del día.
- `.avatar` con `data-tint`: inicial sobre el color del jugador.
- Fuente marker para lo escrito a mano (títulos de día, horas, pies de foto). El cuerpo sigue en sans para que se lea bien.

## 13. Portada CHIS Explorer

La portada y la muestra de `/journal` usan el cuaderno abierto `.chis-book`. Reutilizan los tokens de papel y las ilustraciones originales de `Postcard`. En pantallas estrechas las dos hojas se leen en orden vertical. Las postales destacadas enlazan a diarios de ejemplo y el mural vive en `/journal/stories`.
