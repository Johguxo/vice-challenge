export default function LoadingChallenges() {
  return (
    <main id="contenido" className="page-frame py-12">
      <p role="status" className="text-ink-muted">
        Cargando retos…
      </p>
      <div aria-hidden="true" className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-surface border-line h-60 rounded-md border" />
        ))}
      </div>
    </main>
  );
}
