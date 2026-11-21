import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Postcard } from "@/components/journal/postcard";
import { SamplePages } from "@/components/journal/sample-pages";

export const metadata: Metadata = {
  title: "Mi diario",
  description: "Una muestra del cuaderno de aventuras de CHIS Explorer.",
};

export default function JournalPage() {
  return (
    <main id="contenido" className="chis-home flex-1">
      <div className="page-frame py-8 sm:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="font-display text-4xl font-black sm:text-5xl">Mi diario</h1>
            <p className="text-ink-muted mt-2">
              Cuaderno de muestra. Las cuentas y el guardado llegarán con el diario privado.
            </p>
          </div>
          <Link href="/journal/stories" className="chis-dark-link">
            Explorar historias <ArrowUpRight aria-hidden="true" className="size-5" />
          </Link>
        </div>
        <SamplePages
          pages={[
            <div key="first-note" className="chis-spread-content">
              <article className="chis-sheet chis-writing">
                <p className="text-paper-muted font-marker text-sm">Primera salida</p>
                <h2 className="chis-title mt-4">El camino largo</h2>
                <p className="mt-5 max-w-[44ch] leading-relaxed">
                  Salí antes del amanecer con la idea de llegar al muelle. Tomé un desvío y encontré una curva desde la
                  que se veía toda la costa. La próxima vez traigo una foto.
                </p>
                <p className="chis-hand mt-6">Volver con calma.</p>
              </article>
              <div className="chis-sheet chis-illustration">
                <figure className="chis-hero-photo">
                  <span className="chis-photo-tape" aria-hidden="true" />
                  <Postcard scene="carretera" seed="first-note" className="block aspect-[4/3] w-full" />
                  <figcaption className="font-marker px-2 py-3 text-center text-lg">
                    Antes de que salga el sol
                  </figcaption>
                </figure>
              </div>
            </div>,
            <div key="blank-note" className="chis-spread-content">
              <article className="chis-sheet chis-writing">
                <p className="text-paper-muted font-marker text-sm">Página sin escribir</p>
                <h2 className="chis-title mt-4">Tu próxima historia</h2>
                <p className="mt-5 max-w-[44ch] leading-relaxed">
                  ¿Qué encontraste en el camino? Una frase, una foto o el nombre de un lugar bastan para empezar una
                  entrada.
                </p>
              </article>
              <div className="chis-sheet chis-illustration chis-blank-page" aria-hidden="true" />
            </div>,
          ]}
        />
      </div>
    </main>
  );
}
