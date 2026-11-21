import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import Link from "next/link";
import { Notebook } from "@/components/journal/notebook";

const handwriting = Caveat({ subsets: ["latin"], variable: "--font-notebook-hand" });

export const metadata: Metadata = {
  title: "Mi diario",
  description: "Escribe y guarda tus recuerdos en tu libreta de GTA 6 Journal.",
  robots: { index: false },
};

export default function JournalWritePage() {
  return (
    <main id="contenido" className={`journal-landing notebook-workspace chis-home flex-1 ${handwriting.variable}`}>
      <Link href="/journal" className="chis-dark-link mb-2">
        <ArrowLeft aria-hidden="true" size={18} /> Volver a GTA 6 Journal
      </Link>
      <Notebook />
    </main>
  );
}
