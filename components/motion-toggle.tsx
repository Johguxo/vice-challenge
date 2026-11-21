"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

const KEY = "vc-motion";
const EVENT = "vc-motion-change";

// La fuente de verdad es <html data-motion>; React solo la lee. El CSS pausa todo lo marcado con .ambient.
function setMotion(paused: boolean) {
  document.documentElement.dataset.motion = paused ? "paused" : "running";
  try {
    localStorage.setItem(KEY, paused ? "paused" : "running");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}
const isPaused = () => document.documentElement.dataset.motion === "paused";
const isPausedOnServer = () => false;

// Botón de pausa para las animaciones en bucle (WCAG 2.2.2), recordado entre visitas.
export function MotionToggle() {
  const paused = useSyncExternalStore(subscribe, isPaused, isPausedOnServer);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "paused") setMotion(true);
    } catch {}
  }, []);

  return (
    <button
      type="button"
      onClick={() => setMotion(!paused)}
      className="motion-toggle border-line text-ink-muted hover:text-ink hover:bg-surface-2 inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold"
    >
      {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
      {/* Texto visible desde sm; en móvil queda como nombre accesible del botón de icono */}
      <span className="sr-only sm:not-sr-only">{paused ? "Reanudar animación" : "Pausar animación"}</span>
    </button>
  );
}
