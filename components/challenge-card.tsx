import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import { formatTime, modes, verification, type Challenge } from "@/lib/challenges";

// Nombre compartido con el <h1> del detalle: el título "vuela" de la tarjeta a la página del reto.
export const challengeTitleTransition = (slug: string) => `reto-titulo-${slug}`;

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const bestTime = challenge.ranking[0]?.timeMs;
  const marks = challenge.ranking.length;

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      transitionTypes={["nav-forward"]}
      data-glow
      data-mode={challenge.mode}
      className="challenge-card group block h-full min-w-0 overflow-hidden rounded-md"
    >
      <article className="flex h-full flex-col gap-4 p-5">
        <span aria-hidden="true" className="card-accent absolute inset-x-0 top-0 h-1 bg-(--accent)" />
        <header className="flex items-start justify-between gap-3">
          <p className="sticker-sm text-night bg-(--accent) px-2 py-0.5 text-sm font-bold">{modes[challenge.mode]}</p>
          <ArrowUpRight
            aria-hidden="true"
            className="card-arrow text-ink-muted size-5 shrink-0 group-hover:text-(--accent)"
          />
        </header>
        <div>
          <ViewTransition name={challengeTitleTransition(challenge.slug)} share="text-morph" default="none">
            <h3 className="font-display font-semiwide text-2xl leading-tight font-extrabold wrap-anywhere">
              {challenge.title}
            </h3>
          </ViewTransition>
          <p className="text-ink-muted mt-2 leading-relaxed">{challenge.objective}</p>
        </div>
        <div className="text-ink-muted mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="size-5" />
            {verification[challenge.verification].label}
          </span>
          <span className="flex items-center gap-2" aria-label={`Dificultad ${challenge.difficulty} de 5`}>
            <span aria-hidden="true" className="inline-flex items-end gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={`w-1 rounded-sm ${level <= challenge.difficulty ? "bg-(--accent)" : "bg-line"}`}
                  style={{ height: 4 + level * 2 }}
                />
              ))}
            </span>
            {challenge.difficulty}/5
          </span>
        </div>
        <footer className="border-line flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-t pt-3">
          {bestTime === undefined ? (
            <p className="font-marker text-xl text-(--accent)">¿Serás el primero?</p>
          ) : (
            <p>
              <span className="text-ink-muted block text-xs font-semibold">Récord</span>
              <span className="font-mono text-2xl font-semibold tabular-nums">{formatTime(bestTime)}</span>
            </p>
          )}
          <p className="text-ink-muted text-sm">
            {marks} {marks === 1 ? "marca" : "marcas"}
          </p>
        </footer>
      </article>
    </Link>
  );
}
