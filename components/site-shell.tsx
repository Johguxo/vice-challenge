import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="bg-night border-line border-b">
      <div className="page-frame flex min-h-16 items-center justify-between gap-5">
        <Link
          href="/"
          className="font-display inline-flex min-h-11 items-center gap-1.5 text-lg font-black tracking-tight sm:text-xl"
        >
          Vice <span className="text-vice">Challenges</span>
        </Link>
        <nav aria-label="Principal">
          <Link
            href="/retos"
            className="text-ink-muted hover:text-ink inline-flex min-h-11 items-center px-2 text-sm font-semibold"
          >
            Explorar retos
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
