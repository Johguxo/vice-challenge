import { Flame } from "lucide-react";
import Link from "next/link";
import { MotionToggle } from "@/components/motion-toggle";

// Wordmark propio estilo sticker: relleno degradado azul→rosa→naranja, contorno oscuro y troquel blanco.
// Es SVG para que el contorno (paint-order) se vea igual en todos los navegadores.
function Wordmark() {
  const text = { fontFamily: "var(--font-display)", fontWeight: 900, fontStretch: "125%" } as const;
  return (
    <svg viewBox="0 0 178 62" className="wordmark h-11 w-auto overflow-visible sm:h-12" role="img">
      <title>Vice Challenges</title>
      <defs>
        <linearGradient id="wordmark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b7cff" />
          <stop offset="0.5" stopColor="#ff4fb8" />
          <stop offset="1" stopColor="#ff9a4a" />
        </linearGradient>
      </defs>
      <g transform="rotate(-4 89 31)">
        <text
          x="6"
          y="38"
          textLength="160"
          lengthAdjust="spacingAndGlyphs"
          fontSize="40"
          style={text}
          fill="#fff4f8"
          stroke="#fff4f8"
          strokeWidth="9"
          strokeLinejoin="round"
        >
          VICE
        </text>
        <text
          x="6"
          y="38"
          textLength="160"
          lengthAdjust="spacingAndGlyphs"
          fontSize="40"
          style={text}
          fill="url(#wordmark-fill)"
          stroke="#1a0a3a"
          strokeWidth="4"
          strokeLinejoin="round"
          paintOrder="stroke"
        >
          VICE
        </text>
        <text
          x="10"
          y="57"
          textLength="152"
          lengthAdjust="spacingAndGlyphs"
          fontSize="14"
          style={text}
          fill="#fff4f8"
          stroke="#1a0a3a"
          strokeWidth="3"
          paintOrder="stroke"
        >
          CHALLENGES
        </text>
      </g>
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-30">
      <div className="page-frame flex min-h-16 items-center justify-between gap-4 py-2">
        <Link href="/" aria-label="Vice Challenges, inicio" className="wordmark-link inline-flex min-h-11 items-center">
          <Wordmark />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-2">
          <MotionToggle />
          <Link
            href="/challenges"
            className="nav-pill text-ink inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold whitespace-nowrap"
          >
            <Flame aria-hidden="true" className="text-sunset size-4" />
            <span className="sm:hidden">Retos</span>
            <span className="hidden sm:inline">Explorar retos</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-line mt-auto border-t">
      <div className="page-frame flex flex-wrap justify-between gap-x-6 gap-y-2 py-6">
        <p className="text-ink-muted text-sm">
          Proyecto de fans no oficial. Sin afiliación con Rockstar Games ni Take-Two Interactive.
        </p>
        <p className="text-ink-muted text-sm">Hecho por el Team Chis 🧀</p>
      </div>
    </footer>
  );
}
