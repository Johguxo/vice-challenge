import { ArrowUpRight, Flame, Lightbulb, NotebookPen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HeroScene } from "@/components/hero-scene";
import { Postcard } from "@/components/journal/postcard";

export const metadata: Metadata = {
  description: "Elige entre Vice Challenges y el diario de aventuras de Team Chis.",
};

// El hub ofrece un acceso por app. Ver docs/IDEAS.md.
const apps = [
  {
    href: "/challenges",
    name: "Retos",
    brand: "Vice Challenges",
    description: "Crea retos, sube tu prueba y pelea el ranking.",
    status: "Viva",
    icon: Flame,
    mode: "speed",
    preview: "challenges",
  },
  {
    href: "/journal",
    name: "Diario",
    brand: "GTA Journal",
    description: "Abre tu cuaderno y explora recuerdos de Leonida.",
    status: "Nueva",
    icon: NotebookPen,
    mode: "community",
    preview: "journal",
  },
] as const;

export default function Hub() {
  return (
    <main id="contenido" className="hero relative isolate flex-1 overflow-hidden">
      <HeroScene />
      <div aria-hidden="true" className="hero-shade" />
      <div className="page-frame relative pt-12 pb-20 sm:pt-16 lg:pt-20">
        <p className="sticker bg-marker text-night font-marker inline-block px-3 py-1 text-lg">
          Team Chis 🧀 · interno
        </p>
        <h1 className="font-display font-wide mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-black tracking-tight">
          <span className="hero-line block" style={{ "--i": 0 } as React.CSSProperties}>
            ¿A qué app
          </span>
          <span className="hero-line block" style={{ "--i": 1 } as React.CSSProperties}>
            vamos hoy?
          </span>
        </h1>
        <p className="hero-line mt-5 max-w-[42ch] text-lg leading-relaxed" style={{ "--i": 2 } as React.CSSProperties}>
          Elige una app de Team Chis para tus aventuras en GTA VI.
        </p>

        <nav aria-label="Selector de apps">
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map(({ href, name, brand, description, status, icon: Icon, mode, preview }, i) => (
              <li key={href} className="hero-line" style={{ "--i": 3 + i } as React.CSSProperties}>
                <Link
                  href={href}
                  data-mode={mode}
                  className="challenge-card app-tile group flex h-full min-h-80 flex-col overflow-hidden rounded-[14px] p-6"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="app-icon grid size-14 place-items-center rounded-xl">
                      <Icon aria-hidden="true" className="text-night size-7" />
                    </span>
                    <span className="sticker-sm mode-sticker text-night px-2 py-0.5 text-sm font-bold" data-mode={mode}>
                      {status}
                    </span>
                  </span>
                  <span className="app-preview mt-6 flex-1" aria-hidden="true">
                    {preview === "challenges" ? (
                      <span className="flex h-full flex-col justify-center">
                        <span className="text-ink-muted text-xs font-semibold">Récord a batir</span>
                        <span className="text-marker font-mono text-4xl font-bold tabular-nums">02:41.380</span>
                      </span>
                    ) : (
                      <span className="flex h-full items-center">
                        <span className="polaroid block w-40 -rotate-3">
                          <Postcard scene="playa" seed="hub" className="block aspect-[4/3] w-full" />
                          <span className="font-marker text-paper-ink block py-1 text-center text-xs">día 1</span>
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="mt-6 flex items-end justify-between gap-4">
                    <span>
                      <span className="text-ink-muted block text-xs font-semibold tracking-wide uppercase">
                        {brand}
                      </span>
                      <span className="font-display font-wide block text-4xl font-black">{name}</span>
                      <span className="text-ink-muted mt-1 block leading-relaxed">{description}</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="card-arrow text-ink size-7 shrink-0" />
                  </span>
                </Link>
              </li>
            ))}
            <li className="hero-line" style={{ "--i": 5 } as React.CSSProperties}>
              <a
                href="https://github.com/Johguxo/vice-challenge/blob/main/docs/IDEAS.md"
                className="idea-tile flex h-full min-h-48 flex-col justify-end gap-2 rounded-[14px] p-6 md:min-h-80"
              >
                <Lightbulb aria-hidden="true" className="text-marker mb-auto size-8" />
                <span className="font-display font-wide text-3xl font-black">Tu próxima idea</span>
                <span className="text-ink-muted leading-relaxed">
                  Apúntala en <code className="font-mono text-sm">docs/IDEAS.md</code> y la armamos.
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  );
}
