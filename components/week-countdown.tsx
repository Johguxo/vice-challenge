"use client";

import { useEffect, useState } from "react";

// Cuenta atrás hasta el cambio de reto semanal: lunes 00:00 en la hora local de quien mira.
function nextMonday(now: Date) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return d;
}

function format(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(s / 86400);
  const hh = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return { short: `${days}d ${hh}:${mm}:${ss}`, label: `${days} días, ${Number(hh)} horas y ${Number(mm)} minutos` };
}

export function WeekCountdown() {
  // Se calcula solo en el cliente: el HTML prerenderado no puede saber la hora de quien visita.
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = nextMonday(new Date()).getTime();
    const tick = () => setLeft(end - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const value = left === null ? null : format(left);

  return (
    <p className="flex items-baseline gap-2 text-sm">
      <span className="text-ink-muted">Termina en</span>
      <time
        className="text-ink font-mono font-semibold tabular-nums"
        aria-label={value?.label}
        suppressHydrationWarning
      >
        {value?.short ?? "–d --:--:--"}
      </time>
    </p>
  );
}
