// Placeholder: la home real se construye con /ui (hero + reto semanal + lista de retos).
export default function Home() {
  return (
    <main className="bg-sunset flex flex-1 flex-col justify-center px-4 py-24 md:px-6">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="bg-marker text-night font-marker inline-block -rotate-2 px-2 py-0.5 text-sm">
          Beta
        </p>
        <h1 className="font-display font-wide mt-4 text-[40px] leading-[0.95] font-black tracking-tight md:text-7xl">
          Inventa el reto.
          <br />
          Rómpelo. Demuéstralo.
        </h1>
        <p className="text-ink mt-6 max-w-xl text-base leading-relaxed">
          Retos de GTA VI hechos por la comunidad. Muy pronto.
        </p>
      </div>
      <footer className="text-ink-muted mx-auto mt-24 w-full max-w-[1200px] text-[13px]">
        Proyecto de fans no oficial. Sin afiliación con Rockstar Games ni
        Take-Two Interactive. Hecho por el Team Chis 🧀
      </footer>
    </main>
  );
}
