import { HeroScene } from "@/components/hero-scene";

// Cabecera de páginas internas con la misma escena del hero, más baja.
// Alto mínimo fijo: el contenido se alinea abajo y la escena no se reescala (sin CLS).
export function PageBanner({ children }: { children: React.ReactNode }) {
  return (
    <section className="page-banner relative isolate overflow-hidden">
      <HeroScene variant="banner" />
      <div aria-hidden="true" className="banner-shade" />
      <div className="page-frame relative flex min-h-[inherit] flex-col justify-end pt-6 pb-8 sm:pb-10">{children}</div>
    </section>
  );
}
