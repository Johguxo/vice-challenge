import { ArrowRight, Crown } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import { challengeTitleTransition } from "@/components/challenge-card";
import { WeekCountdown } from "@/components/week-countdown";
import { formatTime, type Challenge } from "@/lib/challenges";

// Tarjeta protagonista del hero: borde degradado que gira + halo que late (ambos pausables, .ambient).
export function WeeklyCard({ challenge }: { challenge: Challenge }) {
  const [record, ...rest] = challenge.ranking;

  return (
    <div className="hero-enter relative isolate max-w-md">
      <div aria-hidden="true" className="weekly-sun" />
      <div aria-hidden="true" className="weekly-halo ambient" />
      <p className="sticker sticker-stamp bg-marker text-night font-marker absolute -top-5 left-5 z-10 px-3 py-1 text-lg">
        Reto semanal
      </p>
      <div className="weekly-frame">
        <article className="bg-night relative rounded-[12px] p-5 sm:p-6">
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <WeekCountdown />
            {challenge.example && <p className="text-ink-muted text-xs">Reto de ejemplo</p>}
          </div>
          <ViewTransition name={challengeTitleTransition(challenge.slug)} share="text-morph" default="none">
            <h2 className="font-display font-semiwide mt-3 text-[28px] leading-[1.05] font-black sm:text-[34px]">
              {challenge.title}
            </h2>
          </ViewTransition>
          <p className="text-ink-muted mt-2 leading-relaxed">{challenge.objective}</p>

          {record ? (
            <div className="border-line mt-5 border-t pt-4">
              <p className="text-ink-muted text-xs font-semibold">Récord a batir</p>
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-marker font-mono text-4xl font-bold tabular-nums sm:text-[44px]">
                  {formatTime(record.timeMs)}
                </span>
                <span className="text-ink-muted flex items-center gap-1 text-sm">
                  <Crown aria-hidden="true" className="text-marker size-4" /> {record.username}
                </span>
              </p>
              {rest.length > 0 && (
                <ol start={2} className="text-ink-muted mt-3 space-y-1 text-sm">
                  {rest.slice(0, 2).map((entry, i) => (
                    <li key={entry.username} className="flex justify-between gap-3">
                      <span>
                        <span className="text-ink font-mono">{i + 2}.</span> {entry.username}
                      </span>
                      <span className="font-mono tabular-nums">{formatTime(entry.timeMs)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ) : (
            <p className="font-marker text-marker border-line mt-5 border-t pt-4 text-2xl">¿Serás el primero?</p>
          )}

          <Link
            href={`/challenges/${challenge.slug}`}
            transitionTypes={["nav-forward"]}
            className="action bg-vice text-night shadow-glow-vice hover:bg-ink mt-5 w-full text-base active:scale-[0.98]"
          >
            Aceptar el reto <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
        </article>
      </div>
    </div>
  );
}
