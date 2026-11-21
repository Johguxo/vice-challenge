import { ArrowLeft, Crown, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { challengeTitleTransition } from "@/components/challenge-card";
import { PageBanner } from "@/components/page-banner";
import { ShareChallenge } from "@/components/share-challenge";
import { formatTime, modes, verification, type Challenge } from "@/lib/challenges";
import { getChallenge, listChallenges } from "@/lib/data";

type Params = PageProps<"/challenges/[slug]">["params"];

export async function generateStaticParams() {
  const challenges = await listChallenges();
  // Cache Components require at least one parameter even for an empty catalog.
  return challenges.length ? challenges.map(({ slug }) => ({ slug })) : [{ slug: "__empty__" }];
}

export async function generateMetadata({ params }: PageProps<"/challenges/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallenge(slug);
  if (!challenge) return {};
  return { title: challenge.title, description: challenge.objective };
}

async function loadChallenge(params: Params) {
  const { slug } = await params;
  const challenge = await getChallenge(slug);
  if (!challenge) notFound();
  return challenge;
}

// Armazón estático (escena + volver); lo que depende del slug va en <Suspense> para navegar al instante.
// Los esqueletos ocupan lo mismo que el contenido para no provocar saltos de layout.
export default function ChallengePage({ params }: PageProps<"/challenges/[slug]">) {
  return (
    <main id="contenido">
      <PageBanner>
        <Link
          href="/challenges"
          transitionTypes={["nav-back"]}
          className="text-ink/85 hover:text-ink inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold"
        >
          <ArrowLeft aria-hidden="true" className="size-5" /> Volver a los retos
        </Link>
        <Suspense fallback={<HeaderSkeleton />}>
          <ChallengeHeader params={params} />
        </Suspense>
      </PageBanner>
      <Suspense fallback={<BodySkeleton />}>
        <ChallengeBody params={params} />
      </Suspense>
    </main>
  );
}

function HeaderSkeleton() {
  return (
    <div aria-hidden="true" className="mt-4">
      <div className="bg-surface/70 h-7 w-40 rounded-sm" />
      <div className="bg-surface/70 mt-5 h-20 max-w-xl rounded-sm md:h-32" />
      <div className="bg-surface/70 mt-4 h-12 max-w-lg rounded-sm" />
    </div>
  );
}

function BodySkeleton() {
  return (
    <div aria-hidden="true" className="page-frame grid gap-8 py-10 lg:grid-cols-[1.1fr_1fr]">
      <div className="bg-surface h-80 rounded-sm" />
      <div className="bg-surface h-80 rounded-md" />
    </div>
  );
}

async function ChallengeHeader({ params }: { params: Params }) {
  const challenge = await loadChallenge(params);
  return (
    <div className="mt-4 grid items-end gap-6 md:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <p data-mode={challenge.mode} className="mode-sticker sticker-sm text-night px-2 py-0.5 text-sm font-bold">
            {modes[challenge.mode]}
          </p>
          <p className="text-ink/85 text-sm font-semibold">
            Dificultad {challenge.difficulty}/5{challenge.example && " · Reto de ejemplo"}
          </p>
        </div>
        <ViewTransition name={challengeTitleTransition(challenge.slug)} share="text-morph" default="none">
          <h1 className="font-display font-wide mt-4 text-[40px] leading-[0.95] font-black tracking-tight wrap-anywhere md:text-7xl">
            {challenge.title}
          </h1>
        </ViewTransition>
        <p className="mt-4 max-w-[55ch] text-lg leading-relaxed">{challenge.objective}</p>
      </div>
      <ShareChallenge title={challenge.title} />
    </div>
  );
}

function RecordCard({ challenge }: { challenge: Challenge }) {
  const record = challenge.ranking[0];
  return (
    <div className="relative">
      <div aria-hidden="true" className="weekly-halo ambient" />
      <div className="weekly-frame">
        <div className="bg-night relative rounded-[12px] p-5 sm:p-6">
          <p className="text-ink-muted text-xs font-semibold">Récord a batir</p>
          {record ? (
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-marker font-mono text-4xl font-bold tabular-nums sm:text-5xl">
                {formatTime(record.timeMs)}
              </span>
              <span className="text-ink-muted flex items-center gap-1 text-sm">
                <Crown aria-hidden="true" className="text-marker size-4" /> {record.username}
              </span>
            </p>
          ) : (
            <>
              <p className="font-marker text-marker text-3xl">¿Serás el primero?</p>
              <p className="text-ink-muted mt-1 text-sm">Nadie tiene una marca aprobada en este reto todavía.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

async function ChallengeBody({ params }: { params: Params }) {
  const challenge = await loadChallenge(params);
  const level = verification[challenge.verification];

  return (
    <ViewTransition enter="slide-up" default="none">
      <div className="page-frame grid items-start gap-8 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
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

        <section className="grid min-w-0 gap-6" aria-labelledby="ranking-title">
          <RecordCard challenge={challenge} />
          <div>
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
                        <tr key={username} className={index === 0 ? "ranking-top" : undefined}>
                          <td className="border-line border-t px-3 py-3 font-mono text-lg font-semibold tabular-nums">
                            {index === 0 ? (
                              <span className="text-marker inline-flex items-center gap-1">
                                <Crown aria-hidden="true" className="size-4" />1
                              </span>
                            ) : (
                              index + 1
                            )}
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
          </div>
        </section>
      </div>
    </ViewTransition>
  );
}
