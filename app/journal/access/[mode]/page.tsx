import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JournalAccessForm } from "@/components/journal/access-form";

export const metadata: Metadata = { title: "Acceso a GTA 6 Journal", robots: { index: false } };

export function generateStaticParams() {
  return [{ mode: "login" }, { mode: "register" }];
}

export default async function JournalAccessPage({ params }: PageProps<"/journal/access/[mode]">) {
  const { mode } = await params;
  if (mode !== "login" && mode !== "register") notFound();
  const registering = mode === "register";

  return (
    <main id="contenido" className="journal-landing journal-access-page flex-1">
      <section className="journal-access-paper">
        <Link href="/journal" className="journal-access-link">
          <ArrowLeft aria-hidden="true" className="size-5" /> Volver al diario
        </Link>
        <p className="text-paper-muted font-marker mt-4">GTA 6 Journal</p>
        <h1 className="font-display mt-2 text-4xl font-black tracking-tight">
          {registering ? "Crea tu cuenta" : "Inicia sesión"}
        </h1>
        <p className="text-paper-muted mt-3 leading-relaxed">Te enviaremos un código de acceso a tu correo.</p>
        <JournalAccessForm mode={mode} />
        <Link
          className="journal-access-link mt-3"
          href={registering ? "/journal/access/login" : "/journal/access/register"}
        >
          {registering ? "Ya tengo cuenta" : "Crear una cuenta"}
        </Link>
      </section>
    </main>
  );
}
