import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { MotionToggle } from "@/components/motion-toggle";

// Wordmark ViceApp estilo sticker: relleno degradado azul→rosa→naranja, contorno oscuro y troquel blanco.
// Es SVG para que el contorno (paint-order) se vea igual en todos los navegadores.
function Wordmark() {
  const text = { fontFamily: "var(--font-display)", fontWeight: 900, fontStretch: "125%" } as const;
  return (
    <svg viewBox="0 0 178 62" className="wordmark h-10 w-auto overflow-visible sm:h-12" role="img">
      <title>ViceApp</title>
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
          x="89"
          y="58"
          textAnchor="middle"
          letterSpacing="10"
          fontSize="15"
          style={text}
          fill="#fff4f8"
          stroke="#1a0a3a"
          strokeWidth="3"
          paintOrder="stroke"
        >
          APP
        </text>
      </g>
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-30">
      <div className="page-frame flex min-h-16 items-center justify-between gap-4 py-2">
        <Link href="/" aria-label="ViceApp, elegir app" className="wordmark-link inline-flex min-h-11 items-center">
          <Wordmark />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-2">
          <MotionToggle />
          <AppNav />
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
