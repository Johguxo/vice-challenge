// Diario (/journal): tipos, datos de ejemplo y acceso. Cuando exista la tabla en Supabase,
// solo cambian estas funciones; las páginas no se enteran.

export type Scene = "playa" | "ciudad" | "pantano" | "carretera" | "cielo";
export type Tint = "vice" | "sunset" | "tide" | "marker" | "ocean";
export type ReactionKind = "fire" | "laugh" | "skull";

export type Player = {
  username: string;
  name: string;
  tagline: string;
  tint: Tint;
};

export type JournalEntry = {
  id: string;
  username: string;
  /** Fecha y hora locales de quien escribe: se muestran tal cual. */
  date: string;
  time: string;
  body: string;
  /** Ilustración propia que hace de captura mientras no hay subidas reales. */
  scene?: Scene;
  caption?: string;
  tags: string[];
  clip?: "TikTok" | "YouTube" | "Twitch" | "Streamable";
  milestone?: { challengeSlug: string; challengeTitle: string; timeMs?: number };
  reactions: Record<ReactionKind, number>;
  example: boolean;
};

const players: Player[] = [
  { username: "luna_costera", name: "Luna", tagline: "Cazadora de amaneceres y récords.", tint: "sunset" },
  { username: "pato_fuego", name: "Pato", tagline: "Si hay un botón, lo aprieto.", tint: "vice" },
  { username: "mar_de_fondo", name: "Mar", tagline: "Fotos, costa y cero prisa.", tint: "tide" },
  { username: "pedal_nocturno", name: "Pedal", tagline: "Todo se puede hacer en bici.", tint: "marker" },
  { username: "ruta_neon", name: "Neón", tagline: "Me pierdo a propósito.", tint: "ocean" },
];

// Ordenadas de la más reciente a la más antigua.
const entries: JournalEntry[] = [
  {
    id: "e8",
    username: "luna_costera",
    date: "2026-11-20",
    time: "06:05",
    body: "Lo saqué justo cuando salía el sol. Tercer intento de la noche y por fin sin chocar en el puente.",
    scene: "carretera",
    caption: "La recta final, con el sol de frente",
    tags: ["récord", "amanecer"],
    milestone: { challengeSlug: "carrera-al-amanecer", challengeTitle: "Carrera al amanecer", timeMs: 161380 },
    reactions: { fire: 48, laugh: 3, skull: 2 },
    example: true,
  },
  {
    id: "e7",
    username: "pato_fuego",
    date: "2026-11-20",
    time: "03:12",
    body: "Solo quería comprar algo en la gasolinera. Diez minutos después tenía cinco estrellas y un helicóptero encima. Todavía no sé qué pasó.",
    scene: "ciudad",
    tags: ["fail", "persecución"],
    clip: "TikTok",
    reactions: { fire: 31, laugh: 57, skull: 12 },
    example: true,
  },
  {
    id: "e6",
    username: "mar_de_fondo",
    date: "2026-11-20",
    time: "01:40",
    body: "Encontré un mirador en la costa y me quedé veinte minutos mirando cómo bajaba el sol. Cero misiones, cero prisa.",
    scene: "playa",
    caption: "Mi rincón favorito hasta ahora",
    tags: ["fotografía", "costa"],
    reactions: { fire: 22, laugh: 1, skull: 0 },
    example: true,
  },
  {
    id: "e5",
    username: "pedal_nocturno",
    date: "2026-11-19",
    time: "23:58",
    body: "Vuelta al canal en bici antes de medianoche. Las piernas del personaje no sienten nada; las mías, sí.",
    tags: ["bici"],
    milestone: { challengeSlug: "vuelta-al-canal", challengeTitle: "Vuelta al canal", timeMs: 198012 },
    reactions: { fire: 19, laugh: 8, skull: 0 },
    example: true,
  },
  {
    id: "e4",
    username: "ruta_neon",
    date: "2026-11-19",
    time: "22:30",
    body: "Crucé el pantano en lancha de noche. Algo se movió en el agua. Volví nadando y no pienso explicar por qué.",
    scene: "pantano",
    caption: "¿Ven los ojos? Yo sí",
    tags: ["miedo", "pantano"],
    reactions: { fire: 14, laugh: 26, skull: 9 },
    example: true,
  },
  {
    id: "e3",
    username: "pato_fuego",
    date: "2026-11-19",
    time: "21:15",
    body: "Salté del helicóptero sin paracaídas para ver qué pasaba. Pasó exactamente lo que tenía que pasar.",
    scene: "cielo",
    tags: ["fail", "física"],
    clip: "YouTube",
    reactions: { fire: 12, laugh: 64, skull: 38 },
    example: true,
  },
  {
    id: "e2",
    username: "luna_costera",
    date: "2026-11-19",
    time: "20:02",
    body: "Primer día. Me prometí no hacer locuras hasta terminar la primera misión. Duré once minutos.",
    tags: ["día1"],
    reactions: { fire: 9, laugh: 33, skull: 4 },
    example: true,
  },
  {
    id: "e1",
    username: "mar_de_fondo",
    date: "2026-11-19",
    time: "19:30",
    body: "Recorrí el centro a pie solo para ver los letreros de neón. De noche parece otra ciudad.",
    scene: "ciudad",
    caption: "Paseo sin rumbo",
    tags: ["paseo", "neón"],
    reactions: { fire: 17, laugh: 0, skull: 0 },
    example: true,
  },
];

export type DiaryDay = { day: number; date: string; entries: JournalEntry[] };

export async function listEntries(): Promise<JournalEntry[]> {
  return entries;
}

export async function listPlayers(): Promise<(Player & { entryCount: number })[]> {
  return players.map((player) => ({
    ...player,
    entryCount: entries.filter((entry) => entry.username === player.username).length,
  }));
}

export async function getPlayer(username: string): Promise<Player | undefined> {
  return players.find((player) => player.username === username);
}

/** Diario de un jugador agrupado por día de partida (Día 1 = su primera entrada). */
export async function getDiary(username: string) {
  const player = await getPlayer(username);
  if (!player) return undefined;
  const own = entries.filter((entry) => entry.username === username);
  const dates = [...new Set(own.map((entry) => entry.date))].sort();
  const days: DiaryDay[] = dates
    .map((date) => ({
      day: dayNumber(dates[0], date),
      date,
      entries: own.filter((entry) => entry.date === date),
    }))
    .reverse();
  return { player, days, entryCount: own.length, milestones: own.filter((entry) => entry.milestone).length };
}

export function dayNumber(firstDate: string, date: string) {
  return Math.round((Date.parse(date) - Date.parse(firstDate)) / 86_400_000) + 1;
}

const dateFormat = new Intl.DateTimeFormat("es", { day: "numeric", month: "short", timeZone: "UTC" });
export function formatDay(date: string) {
  return dateFormat.format(new Date(`${date}T00:00:00Z`)).replace(".", "");
}

/** Primera fecha con entradas de cada jugador, para mostrar "Día N" en el feed. */
export function firstDates(list: JournalEntry[]) {
  const first = new Map<string, string>();
  for (const entry of list) {
    const current = first.get(entry.username);
    if (!current || entry.date < current) first.set(entry.username, entry.date);
  }
  return first;
}
