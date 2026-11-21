#!/usr/bin/env node
// Medición rápida de rendimiento en móvil simulado (CPU 4x más lenta, red 4G aprox).
// Uso: npm run build && npx next start -p 3100  →  node scripts/perf.mjs / /challenges --base http://localhost:3100
// Reporta LCP, CLS, TBT aproximado, peso transferido y JS. No sustituye a Lighthouse, pero detecta regresiones.
import { chromium } from "playwright";

const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base");
const base = baseIdx >= 0 ? args.splice(baseIdx, 2)[1] : "http://localhost:3100";
const routes = args.length ? args : ["/"];

const browser = await chromium.launch();
for (const route of routes) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });

  let bytes = 0;
  let jsBytes = 0;
  cdp.on("Network.loadingFinished", (e) => (bytes += e.encodedDataLength));
  const jsIds = new Set();
  cdp.on("Network.responseReceived", (e) => e.type === "Script" && jsIds.add(e.requestId));
  cdp.on("Network.loadingFinished", (e) => jsIds.has(e.requestId) && (jsBytes += e.encodedDataLength));

  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0, longTasks: 0 };
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__perf.lcp = e.startTime))).observe({
      type: "largest-contentful-paint",
      buffered: true,
    });
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => !e.hadRecentInput && (window.__perf.cls += e.value)),
    ).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => (window.__perf.longTasks += Math.max(0, e.duration - 50))),
    ).observe({ type: "longtask", buffered: true });
  });

  await page.goto(new URL(route, base).toString(), { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const p = await page.evaluate(() => window.__perf);
  const ok = (v, good) => (v <= good ? "✓" : "✗");
  console.log(
    `${route.padEnd(32)} LCP ${Math.round(p.lcp)}ms ${ok(p.lcp, 2500)} · CLS ${p.cls.toFixed(3)} ${ok(p.cls, 0.1)} · TBT~ ${Math.round(p.longTasks)}ms ${ok(p.longTasks, 200)} · total ${(bytes / 1024).toFixed(0)}KB · JS ${(jsBytes / 1024).toFixed(0)}KB`,
  );
  await ctx.close();
}
await browser.close();
