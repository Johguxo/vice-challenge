import type { Metadata } from "next";
import Link from "next/link";
import { ChallengeCard } from "@/components/challenge-card";
import { PageBanner } from "@/components/page-banner";
import { modes, type Mode } from "@/lib/challenges";
import { listChallenges } from "@/lib/data";

export const metadata: Metadata = { title: "Explorar retos" };

const filters = [
  { label: "Todos", value: undefined },
  ...Object.entries(modes).map(([value, label]) => ({ label, value: value as Mode })),
];

export default async function ChallengesPage({ searchParams }: PageProps<"/challenges/explorar">) {
  const { modalidad } = await searchParams;
  const mode = filters.find(({ value }) => value === modalidad)?.value;
  const challenges = await listChallenges(mode);

  return (
    <main id="contenido">
      <PageBanner>
        <p className="sticker bg-marker text-night font-marker self-start px-3 py-1 text-lg">¿Te atreves?</p>
        <h1 className="font-display font-wide mt-5 text-[40px] leading-[0.95] font-black tracking-tight md:text-7xl">
          Explorar retos
        </h1>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed">
          Recorridos contrarreloj, retos de precisión y propuestas de la comunidad.
        </p>
      </PageBanner>

      <div className="page-frame pt-8 pb-12 lg:pb-16">
        <nav aria-label="Filtrar por modalidad" className="flex flex-wrap gap-2">
          {filters.map(({ value, label }) => (
            <Link
              key={label}
              href={value ? `/challenges/explorar?modalidad=${value}` : "/challenges/explorar"}
              aria-current={mode === value ? "page" : undefined}
              data-mode={value}
              className="filter-pill inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold"
            >
              {label}
            </Link>
          ))}
        </nav>
        {challenges.some((challenge) => challenge.example) && (
          <p className="text-ink-muted mt-6 text-sm">Retos y marcas de ejemplo.</p>
        )}
        {challenges.length ? (
          <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Retos disponibles">
            {challenges.map((challenge) => (
              <li key={challenge.slug} className="reveal">
                <ChallengeCard challenge={challenge} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="border-line bg-surface mt-6 rounded-md border p-5">
            <h2 className="font-display text-xl font-extrabold">Aún no hay retos en esta modalidad</h2>
            <p className="font-marker text-marker mt-2 text-xl">¿Propones el primero?</p>
            {mode && (
              <Link href="/challenges/explorar" className="text-vice inline-flex min-h-11 items-center underline">
                Ver todos los retos
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
