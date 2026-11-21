import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Notebook } from "@/components/journal/notebook";
import { blankPage } from "@/components/journal/notebook-storage";
import { getNotebookAccount, readPrivateNotebook } from "@/lib/supabase/notebook";

const handwriting = Caveat({ subsets: ["latin"], variable: "--font-notebook-hand" });

export const metadata: Metadata = {
  title: "GTA 6 Journal",
  description: "Escribe y guarda tus recuerdos en tu libreta de GTA 6 Journal.",
  robots: { index: false },
};

async function PrivateNotebook() {
  await connection();
  const account = await getNotebookAccount(false);
  if (!account) {
    return (
      <section className="journal-access-paper mx-auto mt-10">
        <h1 className="font-display text-3xl font-black">Tu libreta privada</h1>
        <p className="text-paper-muted mt-3 leading-relaxed">
          Inicia sesión para abrir tu libreta en este dispositivo.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/journal/access/login" className="action journal-access-submit">
            Iniciar sesión
          </Link>
          <Link href="/journal/access/register" className="journal-access-link px-2">
            Registrarse
          </Link>
        </div>
      </section>
    );
  }

  const stored = await readPrivateNotebook(account);
  if (!stored.ok) {
    return (
      <section className="journal-access-paper mx-auto mt-10">
        <h1 className="font-display text-3xl font-black">No pudimos abrir tu libreta</h1>
        <p className="text-paper-muted mt-3 leading-relaxed">
          Vuelve a cargar la página para intentar conectar con el guardado.
        </p>
        <Link href="/journal" className="journal-access-link mt-4">
          <ArrowLeft aria-hidden="true" size={18} /> Volver a GTA 6 Journal
        </Link>
      </section>
    );
  }

  return (
    <Notebook
      key={account.owner}
      owner={account.owner}
      initial={
        stored.snapshot ?? {
          pages: [blankPage()],
          pageIndex: 0,
          importedLocal: false,
        }
      }
      revision={stored.revision}
    />
  );
}

export default function JournalWritePage() {
  return (
    <main id="contenido" className={`journal-landing notebook-workspace chis-home flex-1 ${handwriting.variable}`}>
      <Suspense
        fallback={
          <p role="status" className="text-ink-muted p-5">
            Abriendo tu libreta…
          </p>
        }
      >
        <PrivateNotebook />
      </Suspense>
    </main>
  );
}
