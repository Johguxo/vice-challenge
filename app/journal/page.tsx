import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { Suspense } from "react";
import { JournalAccountLinks, JournalGuestLinks } from "@/components/journal/account-links";
import { HeroVideo } from "@/components/journal/hero-video";
import { Notebook } from "@/components/journal/notebook";

const handwriting = Caveat({ subsets: ["latin"], variable: "--font-notebook-hand" });

export const metadata: Metadata = {
  title: "GTA 6 Journal",
  description: "Cada rincón de Leonida tiene una historia. Guarda la tuya.",
  openGraph: {
    title: "GTA 6 Journal",
    description: "Cada rincón de Leonida tiene una historia. Guarda la tuya.",
    siteName: "Team Chis",
    images: ["/journal/coastal-dusk.webp"],
  },
};

export default function JournalPage() {
  return (
    <main id="contenido" className="journal-landing chis-home flex-1">
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
        <HeroVideo
          account={
            <Suspense fallback={<JournalGuestLinks />}>
              <JournalAccountLinks />
            </Suspense>
          }
        />
        <div className="page-frame journal-hero-content">
          <p className="journal-hero-kicker">Diario de aventuras en Leonida</p>
          <h1 id="journal-title" className="journal-hero-title">
            GTA 6 <span>Journal</span>
          </h1>
          <p className="journal-hero-copy">
            Tu diario de Leonida. Registra lo que haces en cada partida y guarda los lugares y momentos que quieras
            recordar.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#mi-diario" className="action journal-hero-primary">
              <BookOpen aria-hidden="true" className="size-5" /> Abrir mi diario
            </a>
            <Link href="/journal/stories" className="action journal-hero-secondary">
              Explorar historias <ArrowUpRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="mi-diario"
        className={`page-frame notebook-section scroll-mt-12 py-10 sm:py-16 ${handwriting.variable}`}
        aria-labelledby="notebook-title"
      >
        <Notebook />
      </section>
    </main>
  );
}
