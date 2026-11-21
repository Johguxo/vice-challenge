import Link from "next/link";

export default function ChallengeNotFound() {
  return (
    <main id="contenido" className="page-frame py-12">
      <h1 className="font-display text-4xl font-black">Reto no encontrado</h1>
      <p className="text-ink-muted mt-4">
        El enlace puede haber cambiado. Explora el catálogo para encontrar otro reto.
      </p>
      <Link href="/challenges/explorar" className="action bg-vice text-night mt-6">
        Explorar retos
      </Link>
    </main>
  );
}
