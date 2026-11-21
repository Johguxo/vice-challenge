// Altura fija (no depende del alto del hero): si el texto se recoloca al cargar las fuentes, la escena
// no se reescala ni provoca saltos de layout (CLS).
// Escena original de atardecer costero para el hero. Todo es SVG propio (sin arte oficial).
// Las animaciones viven en globals.css (sección "Escena del hero"): solo transform/opacity,
// todas marcadas con .ambient para que el botón de pausa las detenga.

const W = 1600;
const HORIZON = 700;
// El sol vive en la tarjeta semanal (.weekly-sun); aquí solo su reflejo, alineado con la tarjeta en desktop.
const SUN_X = 1180;

// Generador determinista: misma escena en servidor y cliente, sin Math.random.
function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

const rand = seeded(7);
const stars = Array.from({ length: 34 }, (_, i) => ({
  x: Math.round(rand() * W),
  y: Math.round(rand() * 300),
  r: rand() > 0.8 ? 2 : 1.2,
  delay: (i % 7) * 0.6,
}));

const farTowers = Array.from({ length: 26 }, (_, i) => {
  const w = 40 + Math.round(rand() * 50);
  return { x: i * 62 - 20, w, h: 90 + Math.round(rand() * 160) };
});

const nearTowers = Array.from({ length: 20 }, (_, i) => {
  const w = 54 + Math.round(rand() * 46);
  return { x: i * 82 - 30, w, h: 60 + Math.round(rand() * 230) };
});

const windows = nearTowers
  .flatMap((t, ti) =>
    Array.from({ length: 6 }, (_, k) => ({
      x: t.x + 10 + Math.round(rand() * (t.w - 22)),
      y: HORIZON - t.h + 14 + Math.round(rand() * (t.h - 30)),
      on: rand() > 0.45,
      twinkle: (ti + k) % 5 === 0,
      delay: ((ti * 3 + k) % 9) * 0.7,
    })),
  )
  .filter((w) => w.on);

function Palm({ x, height, flip = false, delay = 0 }: { x: number; height: number; flip?: boolean; delay?: number }) {
  const top = -height;
  const frond = "M0 0 C 55 -42, 120 -34, 180 34 C 118 -6, 55 -12, 0 0 Z";
  return (
    <g transform={`translate(${x} ${HORIZON + 200}) scale(${flip ? -1 : 1} 1)`}>
      <g className="scene-palm ambient" style={{ animationDelay: `${delay}s` }}>
        <path
          d={`M0 0 C 14 ${top * 0.35}, -16 ${top * 0.7}, 26 ${top}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={18}
          strokeLinecap="round"
        />
        <g transform={`translate(26 ${top})`} fill="currentColor">
          {[-28, 2, 30].map((a) => (
            <path key={`r${a}`} d={frond} transform={`rotate(${a})`} />
          ))}
          {[-28, 2, 30].map((a) => (
            <path key={`l${a}`} d={frond} transform={`scale(-1 1) rotate(${a})`} />
          ))}
          <path d={frond} transform="rotate(-72)" />
          <circle r={12} />
        </g>
      </g>
    </g>
  );
}

export function HeroScene() {
  return (
    <svg
      aria-hidden="true"
      className="hero-scene absolute inset-x-0 top-0 h-[1100px] w-full lg:h-[860px]"
      viewBox={`0 0 ${W} 900`}
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10143f" />
          <stop offset="0.32" stopColor="#3b2a8f" />
          <stop offset="0.55" stopColor="#9b2a8e" />
          <stop offset="0.7" stopColor="#ff4f8b" />
          <stop offset="0.78" stopColor="#ff9a4a" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1450" />
          <stop offset="1" stopColor="#0b0612" />
        </linearGradient>
      </defs>

      <rect width={W} height="900" fill="url(#sky)" />

      {stars.map((s, i) => (
        <circle
          key={i}
          className="scene-twinkle ambient"
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#fff4f8"
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}

      <g className="scene-clouds ambient" fill="#ff8cc6" opacity="0.32">
        <rect x="120" y="330" width="420" height="10" rx="5" />
        <rect x="260" y="352" width="260" height="7" rx="3.5" />
        <rect x="980" y="300" width="380" height="9" rx="4.5" />
        <rect x="1150" y="322" width="220" height="6" rx="3" />
      </g>

      <g className="scene-heli ambient" fill="#1a0b2e">
        <ellipse cx="0" cy="0" rx="26" ry="11" />
        <rect x="18" y="-4" width="44" height="5" rx="2.5" />
        <rect x="58" y="-12" width="5" height="14" rx="2" />
        <rect x="-34" y="-16" width="68" height="2.5" rx="1.25" />
        <rect x="-16" y="12" width="34" height="2.5" rx="1.25" />
        <circle className="scene-blink ambient" cx="-24" cy="2" r="2.5" fill="#ff4d5e" />
      </g>

      <g fill="#4b1d6e" opacity="0.85">
        {farTowers.map((t, i) => (
          <rect key={i} x={t.x} y={HORIZON - t.h} width={t.w} height={t.h} />
        ))}
      </g>

      {/* Noria del muelle */}
      <g transform={`translate(1390 ${HORIZON - 110})`} stroke="#1c0b30" fill="none">
        <g className="scene-wheel ambient">
          <circle r="92" strokeWidth="6" />
          <circle r="12" fill="#1c0b30" />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="0" y1="0" x2="0" y2="-92" strokeWidth="3" transform={`rotate(${i * 30})`} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <circle
              key={`c${i}`}
              cx="0"
              cy="-92"
              r="7"
              fill="#ffb35c"
              stroke="none"
              transform={`rotate(${i * 30 + 15})`}
            />
          ))}
        </g>
        <path d="M-60 110 L0 0 L60 110" strokeWidth="7" />
      </g>

      <g fill="#170a26">
        {nearTowers.map((t, i) => (
          <rect key={i} x={t.x} y={HORIZON - t.h} width={t.w} height={t.h} />
        ))}
      </g>
      <g fill="#ffb35c">
        {windows.map((w, i) => (
          <rect
            key={i}
            className={w.twinkle ? "scene-window ambient" : undefined}
            x={w.x}
            y={w.y}
            width="6"
            height="9"
            opacity="0.75"
            style={w.twinkle ? { animationDelay: `${w.delay}s` } : undefined}
          />
        ))}
      </g>

      <rect y={HORIZON} width={W} height={900 - HORIZON} fill="url(#water)" />
      {/* Reflejo del sol en el agua */}
      <g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={i}
            className="scene-shimmer ambient"
            x={SUN_X - (180 - i * 22)}
            y={HORIZON + 10 + i * 18}
            width={(180 - i * 22) * 2}
            height={5}
            rx="2.5"
            fill={i % 2 ? "#ff2e93" : "#ff8a3d"}
            opacity={0.7 - i * 0.07}
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </g>
      <g className="scene-waves ambient" stroke="#ff8cc6" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round">
        <line x1="80" y1="760" x2="300" y2="760" />
        <line x1="420" y1="800" x2="560" y2="800" />
        <line x1="1300" y1="780" x2="1500" y2="780" />
        <line x1="700" y1="850" x2="900" y2="850" />
      </g>

      <g color="#07040d">
        <Palm x={90} height={430} delay={0} />
        <Palm x={250} height={300} flip delay={1.2} />
        <Palm x={1560} height={470} flip delay={0.6} />
      </g>
    </svg>
  );
}
