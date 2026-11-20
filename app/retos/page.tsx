import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeCard } from "@/components/challenge-card";
import { modes, type Mode } from "@/lib/challenges";
import { listChallenges } from "@/lib/data";

export const metadata: Metadata = { title: "Explorar retos" };

const filters = [
  { label: "Todos", value: undefined },
  ...Object.entries(modes).map(([value, label]) => ({ label, value: value as Mode })),
];

export default async function ChallengesPage({ searchParams }: PageProps<"/retos">) {
  const { modalidad } = await searchParams;
  const mode = filters.find(({ value }) => value === modalidad)?.value;
  const challenges = await listChallenges(mode);

  return (
    <main id="contenido" className="page-frame py-12 lg:py-16">
      <h1 className="font-display font-wide text-[40px] leading-[0.95] font-black tracking-tight md:text-7xl">
        Explorar retos
      </h1>
      <p className="text-ink-muted mt-4 max-w-[55ch] leading-relaxed">
        Encuentra un recorrido contrarreloj, un reto de precisión o una propuesta de la comunidad.
      </p>
      <nav
        aria-label="Filtrar por modalidad"
        className="mt-7 grid max-w-sm grid-cols-2 gap-2 sm:flex sm:max-w-none sm:flex-wrap"
      >
        {filters.map(({ value, label }) => (
          <Link
            key={label}
            href={value ? `/retos?modalidad=${value}` : "/retos"}
            aria-current={mode === value ? "page" : undefined}
            className={`action border-line text-sm ${mode === value ? "bg-vice text-night" : "hover:bg-surface-2 text-ink"}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {challenges.some((challenge) => challenge.example) && (
        <p className="text-ink-muted mt-6 text-sm">Retos y marcas de ejemplo.</p>
      )}
      {challenges.length ? (
        <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Retos disponibles">
          {challenges.map((challenge) => (
            <li key={challenge.slug}>
              <ChallengeCard challenge={challenge} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-line bg-surface mt-6 rounded-md border p-5">
          <h2 className="font-display text-xl font-extrabold">Aún no hay retos en esta modalidad</h2>
          {mode && (
            <Link href="/retos" className="text-vice inline-flex min-h-11 items-center underline">
              Ver todos los retos
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
