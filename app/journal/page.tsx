import { ArrowDown, ArrowUpRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Postcard } from "@/components/journal/postcard";
import { SamplePages } from "@/components/journal/sample-pages";

export const metadata: Metadata = {
  title: "GTA Journal",
  description: "Cada rincón de Leonida tiene una historia. Guarda la tuya.",
  openGraph: {
    title: "GTA Journal",
    description: "Cada rincón de Leonida tiene una historia. Guarda la tuya.",
    siteName: "Team Chis",
    images: ["/journal/coastal-dusk.webp"],
  },
};

export default function JournalPage() {
  return (
    <main id="contenido" className="chis-home flex-1">
      <section className="journal-hero" aria-labelledby="journal-title">
        <Image
          src="/journal/coastal-dusk.webp"
          alt=""
          fill
          sizes="(max-width: 640px) 140vw, 100vw"
          loading="eager"
          fetchPriority="high"
          className="journal-hero-image"
        />
        <div className="page-frame journal-hero-content">
          <p className="journal-hero-kicker">Diario de aventuras en Leonida</p>
          <h1 id="journal-title" className="journal-hero-title">
            GTA <span>Journal</span>
          </h1>
          <p className="journal-hero-copy">Cada rincón de Leonida tiene una historia. Guarda la tuya.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#mi-diario" className="action journal-hero-primary">
              <BookOpen aria-hidden="true" className="size-5" /> Abrir mi diario
            </a>
            <Link href="/journal/stories" className="action journal-hero-secondary">
              Explorar historias <ArrowUpRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
          <a href="#mi-diario" aria-label="Bajar al cuaderno" className="journal-hero-scroll">
            <ArrowDown aria-hidden="true" className="size-5" />
          </a>
        </div>
      </section>

      <section id="mi-diario" className="page-frame scroll-mt-20 py-8 sm:py-12" aria-labelledby="sample-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="sample-title" className="font-display text-4xl font-black sm:text-5xl">
              Mi diario
            </h2>
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
      </section>
    </main>
  );
}
