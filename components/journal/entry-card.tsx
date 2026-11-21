import { Play, Stamp } from "lucide-react";
import Link from "next/link";
import { formatTime } from "@/lib/challenges";
import type { JournalEntry, Player, Tint } from "@/lib/journal";
import { Postcard } from "./postcard";
import { Reactions } from "./reactions";

const tilts = [-1.6, 1.2, -0.7, 1.8, -1.2, 0.6, 1.4, -1.9];
const tapes: Tint[] = ["marker", "vice", "tide", "sunset", "ocean"];

export function Avatar({ player, size = "sm" }: { player: Pick<Player, "name" | "tint">; size?: "sm" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      data-tint={player.tint}
      className={`avatar font-display inline-grid shrink-0 place-items-center rounded-full font-black ${
        size === "lg" ? "size-20 text-4xl" : "size-9 text-base"
      }`}
    >
      {player.name[0]}
    </span>
  );
}

// Entrada de diario como recorte de cuaderno: papel rayado, cinta, polaroid y sello si superó un reto.
export function EntryCard({
  entry,
  index,
  author,
  day,
}: {
  entry: JournalEntry;
  index: number;
  /** En el feed se muestra quién la escribió; en el diario de una persona no hace falta. */
  author?: Player;
  day: number;
}) {
  return (
    <article
      className="journal-card px-5 pt-7 pb-4"
      style={{ "--tilt": `${tilts[index % tilts.length]}deg` } as React.CSSProperties}
    >
      <span aria-hidden="true" className="tape" data-tint={tapes[index % tapes.length]} />

      <header className="flex items-center justify-between gap-3">
        {author ? (
          <Link
            href={`/journal/${author.username}`}
            className="group/author flex min-h-11 min-w-0 items-center gap-2.5"
          >
            <Avatar player={author} />
            <span className="min-w-0">
              <span className="block truncate font-bold group-hover/author:underline">{author.name}</span>
              <span className="text-paper-muted block truncate text-xs">@{author.username}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        <p className="font-marker text-paper-muted shrink-0 text-right text-sm leading-tight">
          {author ? (
            <>
              Día {day}
              <span className="block text-xs">{entry.time}</span>
            </>
          ) : (
            entry.time
          )}
        </p>
      </header>

      {entry.scene && (
        <figure
          className="polaroid mx-auto mt-4 max-w-[340px]"
          style={{ "--photo-tilt": `${-tilts[index % tilts.length] * 0.8}deg` } as React.CSSProperties}
        >
          <Postcard scene={entry.scene} seed={entry.id} className="aspect-[4/3] w-full" />
          <figcaption className="font-marker text-paper-ink min-h-9 px-1 py-2 text-center text-sm">
            {entry.caption ?? " "}
          </figcaption>
        </figure>
      )}

      <p className="mt-4 text-[17px] leading-7">{entry.body}</p>

      {entry.milestone && (
        <Link
          href={`/challenges/${entry.milestone.challengeSlug}`}
          className="stamp mt-5 inline-flex min-h-11 items-center gap-3 px-3 py-2"
        >
          <Stamp aria-hidden="true" className="size-6 shrink-0" />
          <span className="leading-tight">
            <span className="font-display block text-xs font-black tracking-widest uppercase">Reto superado</span>
            <span className="block font-bold">{entry.milestone.challengeTitle}</span>
            {entry.milestone.timeMs !== undefined && (
              <span className="font-mono text-sm font-semibold tabular-nums">{formatTime(entry.milestone.timeMs)}</span>
            )}
          </span>
        </Link>
      )}

      {(entry.tags.length > 0 || entry.clip) && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Etiquetas">
          {entry.clip && (
            <li className="bg-paper-ink text-paper inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
              <Play aria-hidden="true" className="size-3.5 fill-current" /> Clip en {entry.clip}
            </li>
          )}
          {entry.tags.map((tag) => (
            <li key={tag} className="tag rounded-full px-2.5 py-1 text-xs font-bold">
              #{tag}
            </li>
          ))}
        </ul>
      )}

      <footer className="border-paper-line mt-4 border-t border-dashed pt-2">
        <Reactions counts={entry.reactions} />
      </footer>
    </article>
  );
}
