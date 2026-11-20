---
name: design-review
description: Revisión visual real de Vice Challenges — toma capturas móvil (390px) y desktop (1440px) con Playwright, las critica contra docs/DESIGN.md y arregla lo que encuentre, en hasta 3 rondas. Usar después de cualquier cambio de UI o cuando pidan "revisa cómo se ve".
argument-hint: "[rutas, ej: / /challenges/robo-5-estrellas]"
---

# /design-review — mirar, criticar, arreglar

Rutas: `$ARGUMENTS` (si está vacío, usa las rutas que cambiaste en esta sesión; si no sabes, `/`).

## 0. Preparación

1. ¿Está corriendo el dev server? `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` → si no es 200, lánzalo en background con `npm run dev` y espera a que responda.
2. Si Playwright no está instalado: `npm i -D playwright && npx playwright install chromium`.

## 1. Capturar

```bash
node scripts/shot.mjs <ruta1> <ruta2> ...
```

Genera `.shots/<ruta>--mobile.png` (390×844, página completa) y `.shots/<ruta>--desktop.png` (1440×900, página completa), y reporta errores de consola y scroll horizontal. **Abre cada PNG con Read** y míralo de verdad.

Para estados que requieren interacción (modal abierto, formulario con error, lista vacía), crea una ruta de muestra en `app/dev/<estado>/page.tsx` que renderice el componente en ese estado, o escribe un script Playwright puntual en el scratchpad que haga click y capture.

## 2. Criticar

Para pantallas nuevas o rediseños grandes, lanza el agente `design-critic` con las rutas de las capturas (ojos frescos, sin tu sesgo de autor). Si tu entorno no tiene ese subagente (p. ej. Codex), lee `.claude/agents/design-critic.md` y aplica tú ese rol y su formato de respuesta, juzgando las capturas como si no hubieras escrito el código. Para retoques pequeños, critica tú mismo.

Para la parte de código (accesibilidad, semántica, foco, formularios), complementa con la skill `web-design-guidelines` sobre los archivos tocados.

Recorre esta lista con cada captura y anota fallos concretos (qué elemento, qué pasa, cómo arreglarlo):

**Jerarquía** — ¿Lo más importante se ve primero en 1 segundo? ¿Hay un solo CTA primario? ¿El título del reto/tiempo domina?
**Firma** — ¿Hay un gesto de firma claro? ¿Hay más de uno compitiendo? ¿Parece Vice Challenges o una plantilla cualquiera?
**Anti-patrones** — Revisa la sección 9 de `docs/DESIGN.md` uno por uno.
**Ritmo** — Espaciado consistente (escala de 4), alineaciones a una misma rejilla, sin elementos huérfanos ni bloques apretados contra el borde.
**Tipografía** — Display solo en títulos, cuerpo ≥ 16px en móvil, tiempos en mono tabular, líneas de 45–75 caracteres en desktop.
**Color** — Solo tokens. Un acento fuerte por bloque. Contraste AA (calcula si dudas: texto sobre degradado es sospechoso).
**Móvil** — Nada desborda a 390px, botones ≥ 44px, el CTA alcanzable con el pulgar, palabras largas no rompen el layout.
**Estados** — ¿Se ven vacío, carga, error y el caso largo? Si no se pueden ver, dilo.
**Copy** — Español neutro, verbos en botones, sin lorem ni datos inventados tipo "10k jugadores".
**IP** — Ningún logo, tipografía o arte oficial de GTA/Rockstar.

## 3. Arreglar y repetir

- Ordena hallazgos por impacto visual. Arregla primero lo que más cambia la percepción (jerarquía, firma, anti-patrones) antes que los detalles de píxel.
- Re-captura y vuelve a mirar. **Máximo 3 rondas**; si algo sigue sin convencer tras 3, para y cuéntalo con la captura como referencia en vez de seguir girando.

## 4. Informe final (corto)

- Rutas revisadas y rutas absolutas de las capturas finales.
- Qué se arregló (1 línea por cambio relevante).
- Lo que queda pendiente o es una decisión del equipo.
- Errores de consola o scroll horizontal si los hubo.
