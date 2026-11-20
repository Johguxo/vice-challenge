import { ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { formatTime, modes, verification, type Challenge } from "@/lib/challenges";

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const bestTime = challenge.ranking[0]?.timeMs;

  return (
    <Link
      href={`/retos/${challenge.slug}`}
      className="border-line bg-surface hover:bg-surface-2 group flex h-full min-w-0 flex-col gap-4 rounded-md border p-5 transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="bg-surface-2 text-ink-muted rounded-sm px-2 py-1 text-sm font-medium">
          {modes[challenge.mode]}
        </span>
        <ArrowUpRight aria-hidden="true" className="text-ink-muted group-hover:text-vice size-5 shrink-0" />
      </div>
      <div>
        <h3 className="font-display text-xl font-extrabold wrap-anywhere">{challenge.title}</h3>
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
                className={`w-1 rounded-sm ${level <= challenge.difficulty ? "bg-dusk" : "bg-line"}`}
                style={{ height: 4 + level * 2 }}
              />
            ))}
          </span>
          {challenge.difficulty}/5
        </span>
      </div>
      <div className="border-line flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t pt-3">
        <span className="font-mono text-xl font-semibold tabular-nums">
          {bestTime === undefined ? "Sin marca" : formatTime(bestTime)}
        </span>
        <span className="text-ink-muted text-sm">
          {challenge.ranking.length} {challenge.ranking.length === 1 ? "marca" : "marcas"}
        </span>
      </div>
    </Link>
  );
}
