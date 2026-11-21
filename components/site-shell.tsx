import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { MotionToggle } from "@/components/motion-toggle";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-30">
      <div className="page-frame flex min-h-16 items-center justify-between gap-4 py-2">
        <Link
          href="/"
          aria-label="CHIS Explorer, inicio"
          className="chis-wordmark inline-flex min-h-11 items-center gap-2"
        >
          <span>CHIS</span> <span>Explorer</span>
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
