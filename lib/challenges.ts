export const modes = {
  speed: "Contrarreloj",
  impossible: "Imposible",
  community: "Comunitario",
} as const;

export const verification = {
  community: { label: "Comunitario", description: "Una captura y una explicación de cómo completaste el reto." },
  verified: { label: "Verificado", description: "Vídeo continuo del intento para revisar las reglas y el resultado." },
  featured: { label: "Destacado", description: "Reglas estrictas y revisión reforzada para competiciones y récords." },
} as const;

export type Mode = keyof typeof modes;

export type Challenge = {
  slug: string;
  title: string;
  objective: string;
  mode: Mode;
  difficulty: 1 | 2 | 3 | 4 | 5;
  verification: keyof typeof verification;
  weekly?: boolean;
  example: boolean;
  rules: string[];
  ranking: { username: string; timeMs: number }[];
};

export function formatTime(timeMs: number) {
  const minutes = Math.floor(timeMs / 60_000);
  const seconds = Math.floor(timeMs / 1_000) % 60;
  const milliseconds = timeMs % 1_000;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
}
