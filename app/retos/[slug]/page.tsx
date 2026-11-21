import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { challengeTitleTransition } from "@/components/challenge-card";
import { ShareChallenge } from "@/components/share-challenge";
import { formatTime, modes, verification } from "@/lib/challenges";
import { getChallenge, listChallenges } from "@/lib/data";

export async function generateStaticParams() {
  const challenges = await listChallenges();
  // Cache Components require at least one parameter even for an empty catalog.
  return challenges.length ? challenges.map(({ slug }) => ({ slug })) : [{ slug: "__empty__" }];
}

export async function generateMetadata({ params }: PageProps<"/retos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallenge(slug);
  if (!challenge) return {};
  return { title: challenge.title, description: challenge.objective };
}

// El armazón (volver) es estático; lo que depende del slug va en <Suspense> para que la navegación sea instantánea.
export default function ChallengePage({ params }: PageProps<"/retos/[slug]">) {
  return (
    <main id="contenido" className="page-frame py-8 lg:py-12">
      <Link
        href="/retos"
        transitionTypes={["nav-back"]}
        className="text-ink-muted hover:text-ink inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
      >
        <ArrowLeft aria-hidden="true" className="size-5" /> Volver a los retos
      </Link>
      <Suspense fallback={<ChallengeSkeleton />}>
        <ChallengeDetail params={params} />
      </Suspense>
    </main>
  );
}

function ChallengeSkeleton() {
  return (
    <div aria-hidden="true" className="mt-4">
      <div className="bg-surface h-4 w-56 rounded-sm" />
      <div className="bg-surface mt-4 h-20 max-w-xl rounded-sm md:h-32" />
      <div className="bg-surface mt-4 h-12 max-w-lg rounded-sm" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="bg-surface h-72 rounded-sm" />
        <div className="bg-surface h-72 rounded-md" />
      </div>
    </div>
  );
}

async function ChallengeDetail({ params }: { params: PageProps<"/retos/[slug]">["params"] }) {
  const { slug } = await params;
  const challenge = await getChallenge(slug);
  if (!challenge) notFound();

  const level = verification[challenge.verification];

  return (
    <>
      <header className="border-line mt-4 grid items-end gap-6 border-b pb-8 md:grid-cols-[1fr_15rem]">
        <div className="min-w-0">
          <p className="text-ink-muted text-sm font-semibold">
            {modes[challenge.mode]} · Dificultad {challenge.difficulty}/5
            {challenge.example && " · Reto de ejemplo"}
          </p>
          <ViewTransition name={challengeTitleTransition(challenge.slug)} share="text-morph" default="none">
            <h1 className="font-display font-wide mt-3 text-[40px] leading-[0.95] font-black tracking-tight wrap-anywhere md:text-7xl">
              {challenge.title}
            </h1>
          </ViewTransition>
          <p className="text-ink-muted mt-4 max-w-[55ch] text-lg leading-relaxed">{challenge.objective}</p>
        </div>
        <ShareChallenge title={challenge.title} />
      </header>
      <ViewTransition enter="slide-up" default="none">
        <div className="mt-8 grid items-start gap-8 pb-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <section className="rules-panel bg-surface px-5 py-7 sm:p-8">
            <h2 className="font-display font-semiwide text-2xl font-extrabold sm:text-[32px]">Reglas del reto</h2>
            <ol className="text-ink-muted mt-5 list-decimal space-y-3 pl-5 leading-relaxed">
              {challenge.rules.map((rule) => (
                <li key={rule} className="pl-1">
                  {rule}
                </li>
              ))}
            </ol>
            <div className="border-line mt-6 border-t pt-4">
              <h3 className="flex items-center gap-2 font-bold">
                <ShieldCheck aria-hidden="true" className="size-5" /> Nivel {level.label.toLowerCase()}
              </h3>
              <p className="text-ink-muted mt-2 leading-relaxed">{level.description}</p>
            </div>
          </section>
          <section className="min-w-0" aria-labelledby="ranking-title">
            <h2 id="ranking-title" className="font-display font-semiwide text-2xl font-extrabold sm:text-[32px]">
              Ranking
            </h2>
            {challenge.ranking.length > 0 ? (
              <>
                <p className="text-ink-muted mt-2">
                  {challenge.example ? "Marcas de ejemplo." : "Mejores marcas aprobadas."}
                </p>
                <div
                  className="border-line mt-4 max-h-96 overflow-auto rounded-md border"
                  role="region"
                  aria-labelledby="ranking-title"
                  tabIndex={0}
                >
                  <table className="w-full border-separate border-spacing-0 text-left">
                    <thead className="bg-surface-2 text-ink-muted sticky top-0 z-10 text-sm">
                      <tr>
                        <th scope="col" className="px-3 py-3">
                          Puesto
                        </th>
                        <th scope="col" className="px-2 py-3">
                          Jugador
                        </th>
                        <th scope="col" className="px-3 py-3 text-right">
                          Tiempo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-surface">
                      {challenge.ranking.map(({ username, timeMs }, index) => (
                        <tr key={username}>
                          <td
                            className={`border-line border-t px-3 py-3 font-mono text-lg font-semibold tabular-nums ${index === 0 ? "text-marker" : ""}`}
                          >
                            {index + 1}
                          </td>
                          <th
                            scope="row"
                            className="border-line border-t px-2 py-3 text-sm font-semibold wrap-anywhere"
                          >
                            {username}
                            <span className="text-ink-muted mt-1 flex items-center gap-1 text-xs font-normal">
                              <ShieldCheck aria-hidden="true" className="size-4" /> Aprobado
                            </span>
                          </th>
                          <td
                            className={`border-line border-t px-3 py-3 text-right font-mono text-lg font-semibold whitespace-nowrap tabular-nums sm:text-2xl ${index === 0 ? "text-marker" : ""}`}
                          >
                            {formatTime(timeMs)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="bg-surface border-line text-ink-muted mt-4 rounded-md border p-5">
                {challenge.verification === "community"
                  ? "Este reto comunitario se completa sin ranking."
                  : "Aún no hay marcas aprobadas para este reto."}
              </p>
            )}
          </section>
        </div>
      </ViewTransition>
    </>
  );
}
