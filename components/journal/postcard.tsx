import type { Scene } from "@/lib/journal";

// Ilustraciones propias que hacen de "captura" en las entradas de ejemplo (nada de arte oficial).
// Deterministas por `seed` para que el servidor y el cliente pinten lo mismo.

function random(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const skies: Record<Scene, [string, string, string]> = {
  playa: ["#3b1a6e", "#ff4fb8", "#ff9a4a"],
  carretera: ["#2a1250", "#c23a8f", "#ffb15e"],
  ciudad: ["#0b0612", "#1f0f3d", "#4a1f6e"],
  pantano: ["#06141a", "#0f2e33", "#1f4a44"],
  cielo: ["#5b7cff", "#9a8cff", "#ffc2a8"],
};

export function Postcard({ scene, seed, className }: { scene: Scene; seed: string; className?: string }) {
  const r = random(seed);
  const id = `pc-${seed}`;
  const [top, mid, low] = skies[scene];

  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.6" stopColor={mid} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe14d" />
          <stop offset="1" stopColor="#ff4fb8" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-sky)`} />

      {scene === "playa" && (
        <>
          <circle cx="250" cy="190" r="62" fill={`url(#${id}-sun)`} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="180" y={198 + i * 13} width="140" height={3 + i} fill={mid} />
          ))}
          <rect y="215" width="400" height="85" fill="#2a1a5e" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={225 - i * 6}
              y={226 + i * 13}
              width={50 + i * 12}
              height="3"
              rx="1.5"
              fill="#ffb15e"
              opacity={0.8 - i * 0.13}
            />
          ))}
          <path
            d="M60 300 C 70 250, 78 200, 96 150"
            stroke="#14081f"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
          {[-70, -25, 20, 60, 105].map((a) => (
            <path
              key={a}
              d="M96 150 q 34 -16 66 6"
              stroke="#14081f"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              transform={`rotate(${a} 96 150)`}
            />
          ))}
        </>
      )}

      {scene === "carretera" && (
        <>
          <circle cx="200" cy="150" r="58" fill={`url(#${id}-sun)`} />
          <path d="M0 175 Q 90 120 170 165 T 400 150 V 300 H 0 Z" fill="#3a1450" />
          <path d="M0 200 Q 120 165 230 192 T 400 185 V 300 H 0 Z" fill="#22093a" />
          <path d="M170 192 L 230 192 L 380 300 L 20 300 Z" fill="#14081f" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={198 - i * 2} y={200 + i * 24} width={4 + i * 4} height={8 + i * 6} fill="#ffe14d" />
          ))}
          <path d="M20 300 L170 192" stroke="#ff4fb8" strokeWidth="2" />
          <path d="M380 300 L230 192" stroke="#ff4fb8" strokeWidth="2" />
        </>
      )}

      {scene === "ciudad" && (
        <>
          {Array.from({ length: 24 }, (_, i) => (
            <circle key={i} cx={r() * 400} cy={r() * 120} r={r() * 1.2 + 0.4} fill="#fff4f8" opacity={0.7} />
          ))}
          {Array.from({ length: 11 }, (_, i) => {
            const w = 30 + r() * 22;
            const h = 90 + r() * 140;
            const x = i * 37 - 8;
            return (
              <g key={i}>
                <rect x={x} y={300 - h} width={w} height={h} fill={i % 2 ? "#1a0b2e" : "#241040"} />
                {Array.from({ length: Math.floor(h / 18) }, (_, j) =>
                  r() > 0.55 ? (
                    <rect
                      key={j}
                      x={x + 6 + (j % 2) * 12}
                      y={300 - h + 10 + j * 16}
                      width="6"
                      height="5"
                      fill={r() > 0.5 ? "#ffe14d" : "#2ce6e0"}
                      opacity="0.85"
                    />
                  ) : null,
                )}
              </g>
            );
          })}
          <rect x="226" y="120" width="82" height="24" rx="5" fill="none" stroke="#ff2e93" strokeWidth="4" />
          <rect
            x="226"
            y="120"
            width="82"
            height="24"
            rx="5"
            fill="none"
            stroke="#ff2e93"
            strokeWidth="12"
            opacity="0.25"
          />
          <rect y="282" width="400" height="18" fill="#0b0612" />
        </>
      )}

      {scene === "pantano" && (
        <>
          <circle cx="300" cy="70" r="28" fill="#e8f4ef" />
          <circle cx="312" cy="62" r="26" fill={top} opacity="0.9" />
          <path d="M0 190 Q 100 160 200 185 T 400 175 V 300 H 0 Z" fill="#0a2226" />
          <rect y="215" width="400" height="85" fill="#081619" />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={240 + i * 10}
              y={240 + i * 16}
              width={90 - i * 20}
              height="2"
              fill="#e8f4ef"
              opacity={0.35 - i * 0.08}
            />
          ))}
          {Array.from({ length: 14 }, (_, i) => {
            const x = i < 7 ? 10 + i * 12 : 300 + (i - 7) * 13;
            const h = 50 + r() * 60;
            return (
              <path
                key={i}
                d={`M${x} 300 q ${r() * 10 - 5} ${-h / 2} ${r() * 16 - 8} ${-h}`}
                stroke="#04100f"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
          <circle cx="186" cy="246" r="4" fill="#ffe14d" />
          <circle cx="202" cy="246" r="4" fill="#ffe14d" />
          <path d="M176 252 q 18 -8 36 0" stroke="#0f2e33" strokeWidth="3" fill="none" />
        </>
      )}

      {scene === "cielo" && (
        <>
          {[
            [60, 210, 1.2],
            [270, 230, 1.5],
            [330, 110, 0.8],
          ].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff4f8" opacity="0.9">
              <ellipse cx="0" cy="0" rx="46" ry="14" />
              <ellipse cx="-14" cy="-10" rx="22" ry="16" />
              <ellipse cx="14" cy="-12" rx="18" ry="14" />
            </g>
          ))}
          <g transform="translate(80 60) rotate(-6)" fill="#14081f">
            <rect x="0" y="10" width="64" height="22" rx="11" />
            <rect x="56" y="16" width="44" height="6" rx="3" />
            <rect x="96" y="8" width="6" height="18" rx="3" />
            <rect x="-6" y="0" width="80" height="4" rx="2" />
            <rect x="30" y="2" width="4" height="10" />
            <rect x="10" y="34" width="44" height="3" />
          </g>
          <g
            transform="translate(210 150) rotate(25)"
            stroke="#14081f"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          >
            <circle cx="0" cy="-16" r="7" fill="#14081f" stroke="none" />
            <path d="M0 -8 V 14 M0 0 L -16 -14 M0 0 L 16 -16 M0 14 L -12 30 M0 14 L 14 28" />
          </g>
          <path
            d="M196 120 q -10 -20 4 -36 M216 116 q 4 -20 -6 -38"
            stroke="#fff4f8"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        </>
      )}
    </svg>
  );
}
