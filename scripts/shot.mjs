#!/usr/bin/env node
// Capturas para revisión visual: node scripts/shot.mjs / /challenges/foo [--base http://localhost:3000]
// Salida: .shots/<ruta>--mobile.png y --desktop.png (página completa) + reporte de consola y overflow.
import { mkdir } from "node:fs/promises";
import path from "node:path";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Falta Playwright: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base");
const base = baseIdx >= 0 ? args.splice(baseIdx, 2)[1] : "http://localhost:3000";
const routes = args.length ? args : ["/"];

const viewports = [
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1 },
];

const outDir = path.resolve(".shots");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
let failed = false;

for (const route of routes) {
  const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/[^a-z0-9-]+/gi, "_");
  for (const vp of viewports) {
    const { name, ...opts } = vp;
    const ctx = await browser.newContext({
      viewport: { width: opts.width, height: opts.height },
      deviceScaleFactor: opts.deviceScaleFactor,
      isMobile: opts.isMobile ?? false,
      hasTouch: opts.hasTouch ?? false,
      colorScheme: "dark",
      locale: "es-419",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    const url = new URL(route, base).toString();
    let status = 0;
    try {
      const res = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      status = res?.status() ?? 0;
      await page.evaluate(() => document.fonts?.ready);
      await page.waitForTimeout(300);
    } catch (e) {
      errors.push(`navegación: ${e.message}`);
    }

    const overflow = await page
      .evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      .catch(() => 0);

    const file = path.join(outDir, `${slug}--${name}.png`);
    await page.screenshot({ path: file, fullPage: true }).catch((e) => errors.push(`captura: ${e.message}`));

    const flags = [];
    if (status && status >= 400) flags.push(`HTTP ${status}`);
    if (overflow > 0) flags.push(`scroll horizontal +${overflow}px`);
    if (errors.length) flags.push(`${errors.length} error(es) de consola`);
    if (flags.length) failed = true;

    console.log(`${flags.length ? "✗" : "✓"} ${route} [${name}] → ${file}${flags.length ? "  — " + flags.join(", ") : ""}`);
    for (const err of errors.slice(0, 5)) console.log(`    · ${err.slice(0, 200)}`);
    await ctx.close();
  }
}

await browser.close();
process.exit(failed ? 2 : 0);
