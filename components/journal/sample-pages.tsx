"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";

export function SamplePages({ pages }: { pages: ReactNode[] }) {
  const [index, setIndex] = useState(0);

  return (
    <>
      <div key={index} className="chis-book chis-page-turn">
        {pages[index]}
      </div>
      <div className="mt-5 flex items-center justify-between gap-2 sm:justify-center sm:gap-8">
        <button
          type="button"
          onClick={() => setIndex((current) => current - 1)}
          disabled={index === 0}
          className="chis-dark-link disabled:cursor-default disabled:opacity-50"
        >
          <ChevronLeft aria-hidden="true" className="size-5" /> Anterior
        </button>
        <p role="status" className="text-ink-muted text-center text-sm">
          Página {index + 1} de {pages.length}
        </p>
        <button
          type="button"
          onClick={() => setIndex((current) => current + 1)}
          disabled={index === pages.length - 1}
          className="chis-dark-link disabled:cursor-default disabled:opacity-50"
        >
          Siguiente <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </>
  );
}
