"use client";

import { useEffect } from "react";

// Un solo listener para toda la página: actualiza --mx/--my en el elemento [data-glow] bajo el puntero.
// Solo con ratón/trackpad (no en táctil) y como mejora decorativa: sin JS las tarjetas se ven igual.
export function PointerGlow() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;

    function onMove(event: PointerEvent) {
      const card = (event.target as Element | null)?.closest<HTMLElement>("[data-glow]");
      if (!card) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
