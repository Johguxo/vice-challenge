import { ArrowDown, ArrowUpRight, BookOpen, MapPin } from "lucide-react";
import Link from "next/link";
import { Postcard } from "@/components/journal/postcard";

const discoveries = [
  {
    scene: "playa",
    title: "El último sol del muelle",
    author: "mar_de_fondo",
    note: "Paré un momento. Me quedé hasta que oscureció.",
  },
  {
    scene: "carretera",
    title: "Un desvío al amanecer",
    author: "luna_costera",
    note: "La mejor parte del viaje fue tomar el camino largo.",
  },
  {
    scene: "pantano",
    title: "Luces sobre el agua",
    author: "ruta_neon",
    note: "Volvería al pantano solo por ver ese reflejo.",
  },
] as const;

export default function Home() {
  return (
    <main id="contenido" className="chis-home">
      <section className="page-frame pt-8 pb-12 sm:pt-14 sm:pb-16" aria-labelledby="home-title">
        <div className="chis-book">
          <div className="chis-sheet chis-cover">
            <p className="text-paper-muted font-marker text-sm sm:text-base">Diario de aventuras</p>
            <h1 id="home-title" className="chis-title mt-5">
              Cada rincón de Leonida tiene una historia.
            </h1>
            <p className="chis-hand mt-4">Guarda la tuya.</p>
            <p className="text-paper-muted mt-5 max-w-[36ch] leading-relaxed">
              Un cuaderno para guardar las capturas, los lugares y las anécdotas de tus partidas en GTA VI.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/journal" className="action chis-primary">
                <BookOpen aria-hidden="true" className="size-5" /> Abrir mi diario
              </Link>
              <a href="#recuerdos" className="action chis-secondary">
                Explorar recuerdos <ArrowDown aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
          <div className="chis-sheet chis-illustration">
            <div className="chis-postmark">
              <MapPin aria-hidden="true" className="size-4" /> Leonida
            </div>
            <figure className="chis-hero-photo">
              <span className="chis-photo-tape" aria-hidden="true" />
              <Postcard scene="playa" seed="chis-cover" className="block aspect-[4/3] w-full" />
              <figcaption className="font-marker px-2 py-3 text-center text-lg">El último sol del muelle</figcaption>
            </figure>
            <p className="chis-margin-note font-marker text-sm">Anota dónde quieres volver.</p>
          </div>
        </div>
      </section>

      <section
        id="recuerdos"
        className="page-frame chis-discoveries scroll-mt-24 pb-14 sm:pb-20"
        aria-labelledby="discoveries-title"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="discoveries-title" className="font-display text-3xl leading-tight font-black sm:text-5xl">
              Descubrimientos destacados
            </h2>
            <p className="text-ink-muted mt-2">Postales ilustradas e historias de ejemplo.</p>
          </div>
          <Link href="/journal/stories" className="chis-dark-link">
            Explorar historias <ArrowUpRight aria-hidden="true" className="size-5" />
          </Link>
        </div>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {discoveries.map(({ scene, title, author, note }) => (
            <li key={scene}>
              <Link href={`/journal/${author}`} className="chis-discovery">
                <Postcard scene={scene} seed={author} className="block aspect-[16/10] w-full" />
                <div className="px-3 pt-4 pb-3">
                  <h3 className="font-marker text-xl">{title}</h3>
                  <p className="text-paper-muted mt-2 leading-relaxed">{note}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
