"use client";

import { useState } from "react";
import type { ReactionKind } from "@/lib/journal";

const kinds: { kind: ReactionKind; emoji: string; label: string }[] = [
  { kind: "fire", emoji: "🔥", label: "Épico" },
  { kind: "laugh", emoji: "😂", label: "Me partí" },
  { kind: "skull", emoji: "💀", label: "Descansa en paz" },
];

// Prototipo: la reacción se marca en pantalla pero todavía no se guarda (falta Supabase).
export function Reactions({ counts }: { counts: Record<ReactionKind, number> }) {
  const [picked, setPicked] = useState<ReactionKind | null>(null);

  return (
    <div className="flex gap-1.5" role="group" aria-label="Reacciones">
      {kinds.map(({ kind, emoji, label }) => {
        const active = picked === kind;
        return (
          <button
            key={kind}
            type="button"
            aria-pressed={active}
            onClick={() => setPicked(active ? null : kind)}
            className="reaction inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full px-2.5 text-sm font-semibold tabular-nums"
          >
            <span aria-hidden="true" className="reaction-emoji text-base">
              {emoji}
            </span>
            {counts[kind] + (active ? 1 : 0)}
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
