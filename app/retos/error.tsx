"use client";

export default function ChallengesError({ retry }: { retry: () => void }) {
  return (
    <main id="contenido" className="page-frame py-12">
      <h1 className="font-display text-4xl font-black">No pudimos cargar los retos</h1>
      <p className="text-ink-muted mt-4">Intenta cargar la página de nuevo.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="action bg-vice text-night hover:shadow-glow-vice mt-6 cursor-pointer"
      >
        Volver a intentar
      </button>
    </main>
  );
}
