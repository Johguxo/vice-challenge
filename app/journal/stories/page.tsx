import { NotebookPen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, EntryCard } from "@/components/journal/entry-card";
import { PageBanner } from "@/components/page-banner";
import { dayNumber, firstDates, listEntries, listPlayers } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Historias de Leonida",
  description: "Lo que pasa en Vice se queda en tu diario: locuras, fails, paisajes y retos superados, día a día.",
};

export default async function JournalPage() {
  const [entries, players] = await Promise.all([listEntries(), listPlayers()]);
  const byUsername = new Map(players.map((player) => [player.username, player]));
  const first = firstDates(entries);

  return (
    <main id="contenido">
      <PageBanner>
        <p className="sticker bg-tide text-night font-marker self-start px-3 py-1 text-lg">Mural de ejemplo</p>
        <h1 className="journal-title font-marker text-marker mt-4 self-start text-[clamp(2.5rem,9vw,5rem)] leading-none">
          Historias de Leonida
        </h1>
        <p className="mt-3 max-w-[46ch] text-lg leading-relaxed">
          Un mural de ejemplo para recordar los desvíos, las sorpresas y esos momentos que vale la pena contar.
        </p>
      </PageBanner>

      <div className="page-frame grid grid-cols-1 gap-10 pt-8 pb-16 lg:grid-cols-[1fr_300px] lg:gap-12">
        <aside className="grid min-w-0 grid-cols-1 content-start gap-8 lg:sticky lg:top-24 lg:order-last lg:self-start">
          <section aria-labelledby="question-title" className="sticky-note p-5">
            <h2 id="question-title" className="font-display text-xs font-black tracking-widest uppercase">
              Pregunta del día
            </h2>
            <p className="font-marker mt-2 text-2xl leading-snug">¿Cuál fue tu peor fail de esta semana?</p>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
              <NotebookPen aria-hidden="true" className="size-4" /> Pronto podrás responder desde tu diario.
            </p>
          </section>

          <section aria-labelledby="diaries-title">
            <h2 id="diaries-title" className="font-display font-semiwide text-xl font-extrabold">
              Diarios
            </h2>
            <ul className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {players.map((player) => (
                <li key={player.username} className="shrink-0">
                  <Link
                    href={`/journal/${player.username}`}
                    className="diary-chip flex min-h-14 items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5"
                  >
                    <Avatar player={player} />
                    <span>
                      <span className="block text-sm font-bold">{player.name}</span>
                      <span className="text-ink-muted block text-xs">
                        {player.entryCount} {player.entryCount === 1 ? "entrada" : "entradas"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <section aria-labelledby="feed-title" className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="feed-title" className="font-display font-semiwide text-2xl font-extrabold sm:text-[32px]">
              Lo último
            </h2>
            {entries.some((entry) => entry.example) && <p className="text-ink-muted text-sm">Entradas de ejemplo.</p>}
          </div>
          {entries.length ? (
            <ol className="mt-4 gap-8 md:columns-2">
              {entries.map((entry, index) => (
                <li key={entry.id} className="reveal mb-4 break-inside-avoid pt-5">
                  <EntryCard
                    entry={entry}
                    index={index}
                    author={byUsername.get(entry.username)}
                    day={dayNumber(first.get(entry.username) ?? entry.date, entry.date)}
                  />
                </li>
              ))}
            </ol>
          ) : (
            <p className="bg-surface border-line text-ink-muted mt-6 rounded-md border p-5">
              Todavía no hay entradas. La primera locura la cuentas tú.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
