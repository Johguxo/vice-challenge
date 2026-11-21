import Link from "next/link";

export default function DiaryNotFound() {
  return (
    <main id="contenido" className="page-frame py-12">
      <h1 className="font-display text-4xl font-black">Este diario no existe</h1>
      <p className="text-ink-muted mt-4">Puede que el usuario haya cambiado de nombre. Mira lo último de la comunidad.</p>
      <Link href="/journal" className="action bg-vice text-night mt-6">
        Ir al Diario
      </Link>
    </main>
  );
}
