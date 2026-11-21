import { ArrowLeft, BookOpen, CalendarDays, Stamp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Avatar, EntryCard } from "@/components/journal/entry-card";
import { PageBanner } from "@/components/page-banner";
import { formatDay, getDiary, listPlayers } from "@/lib/journal";

type Params = PageProps<"/journal/[username]">["params"];

export async function generateStaticParams() {
  const players = await listPlayers();
  return players.map(({ username }) => ({ username }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[username]">): Promise<Metadata> {
  const { username } = await params;
  const diary = await getDiary(username);
  if (!diary) return {};
  return { title: `Diario de ${diary.player.name}`, description: diary.player.tagline };
}

async function loadDiary(params: Params) {
  const { username } = await params;
  const diary = await getDiary(username);
  if (!diary) notFound();
  return diary;
}

export default function DiaryPage({ params }: PageProps<"/journal/[username]">) {
  return (
    <main id="contenido">
      <PageBanner>
        <Link
          href="/journal/stories"
          className="text-ink/85 hover:text-ink inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold"
        >
          <ArrowLeft aria-hidden="true" className="size-5" /> Volver a las historias
        </Link>
        <Suspense fallback={<div aria-hidden="true" className="bg-surface/70 mt-4 h-40 max-w-xl rounded-sm" />}>
          <DiaryHeader params={params} />
        </Suspense>
      </PageBanner>
      <Suspense fallback={<div aria-hidden="true" className="page-frame bg-surface my-10 h-96 max-w-3xl rounded-sm" />}>
        <DiaryTimeline params={params} />
      </Suspense>
    </main>
  );
}

async function DiaryHeader({ params }: { params: Params }) {
  const { player, days, entryCount, milestones } = await loadDiary(params);
  const stats = [
    { icon: BookOpen, label: `${entryCount} ${entryCount === 1 ? "entrada" : "entradas"}` },
    { icon: CalendarDays, label: `${days.length} ${days.length === 1 ? "día" : "días"} de partida` },
    { icon: Stamp, label: `${milestones} ${milestones === 1 ? "reto superado" : "retos superados"}` },
  ];
  return (
    <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end">
      <span className="avatar-ring self-start">
        <Avatar player={player} size="lg" />
      </span>
      <div className="min-w-0">
        <p className="text-ink/85 text-sm font-semibold">@{player.username}</p>
        <h1 className="font-display font-wide text-[40px] leading-[0.95] font-black tracking-tight md:text-6xl">
          Diario de <span className="font-marker text-marker font-normal tracking-normal">{player.name}</span>
        </h1>
        <p className="mt-3 text-lg">{player.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {stats.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="bg-night/60 border-line inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold backdrop-blur-sm"
            >
              <Icon aria-hidden="true" className="text-marker size-4" /> {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function DiaryTimeline({ params }: { params: Params }) {
  const { player, days } = await loadDiary(params);
  let index = 0;
  return (
    <div className="page-frame pt-10 pb-16">
      <ol className="timeline mx-auto max-w-3xl">
        {days.map(({ day, date, entries }) => (
          <li key={date} className="timeline-day">
            <h2 className="timeline-label font-marker text-2xl">
              Día {day} <span className="text-ink-muted text-base">· {formatDay(date)}</span>
            </h2>
            <ol className="mt-6 grid gap-12">
              {entries.map((entry) => (
                <li key={entry.id} className="timeline-entry reveal">
                  <EntryCard entry={entry} index={index++} day={day} />
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
      <p className="text-ink-muted mx-auto mt-12 max-w-3xl pl-10 text-sm">
        Aquí empieza el diario de {player.name}. Entradas de ejemplo.
      </p>
    </div>
  );
}
