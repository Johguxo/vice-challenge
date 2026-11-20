import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ChallengeCard } from "@/components/challenge-card";
import { verification } from "@/lib/challenges";
import { getWeeklyChallenge, listChallenges } from "@/lib/data";

const steps = [
  { title: "Elige un reto", description: "Lee el objetivo y decide qué reglas quieres poner a prueba." },
  {
    title: "Juega y guarda tu intento",
    description: "Cumple las reglas y guarda la captura o el vídeo que pide el reto.",
  },
  {
    title: "Demuestra tu resultado",
    description: "Los intentos aprobados entran al ranking cuando el reto tiene clasificación.",
  },
];

export default async function Home() {
  const [weekly, challenges] = await Promise.all([getWeeklyChallenge(), listChallenges()]);
  const moreChallenges = challenges.filter((challenge) => challenge.slug !== weekly?.slug).slice(0, 3);

  return (
    <main id="contenido">
      <section className="bg-sunset relative isolate">
        <div aria-hidden="true" className="coastal-scene">
          <div className="coastal-sun" />
          <div className="coastal-skyline" />
          <div className="coastal-water" />
          <div className="coastal-shade" />
        </div>
        <div className="page-frame relative grid items-end gap-12 pt-16 pb-12 sm:pt-24 lg:min-h-[560px] lg:grid-cols-[1.45fr_1fr] lg:pb-20">
          <div>
            <h1 className="font-display font-wide text-[clamp(2.125rem,6.25vw,4.5rem)] leading-[0.95] font-black tracking-tight">
              Inventa el reto.
              <br />
              Rómpelo.
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed">
              Retos de GTA VI creados por la comunidad. Pon a prueba tu habilidad y demuestra tu mejor intento.
            </p>
            <Link href="/retos" className="action bg-vice text-night hover:shadow-glow-vice mt-7">
              Explorar retos <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
          {weekly && (
            <article className="bg-night/95 border-line relative max-w-md rounded-md border p-5 sm:p-6">
              <p className="bg-marker text-night font-marker absolute -top-4 left-5 -rotate-2 px-3 py-0.5 text-lg">
                Reto semanal
              </p>
              <h2 className="font-display font-semiwide mt-3 text-2xl font-extrabold sm:text-3xl">{weekly.title}</h2>
              <p className="text-ink-muted mt-2 leading-relaxed">{weekly.objective}</p>
              {weekly.example && <p className="text-ink-muted mt-3 text-sm">Reto de ejemplo</p>}
              <Link
                href={`/retos/${weekly.slug}`}
                className="text-ink hover:text-vice mt-1 inline-flex min-h-11 items-center gap-2 font-semibold"
              >
                Ver reto semanal <ArrowRight aria-hidden="true" className="size-5" />
              </Link>
            </article>
          )}
        </div>
      </section>

      <section className="page-frame py-12 lg:py-16" aria-labelledby="more-challenges">
        <h2 id="more-challenges" className="font-display font-semiwide text-2xl font-extrabold sm:text-[32px]">
          Más retos
        </h2>
        {moreChallenges.some((challenge) => challenge.example) && (
          <p className="text-ink-muted mt-2">Retos y marcas de ejemplo.</p>
        )}
        {moreChallenges.length > 0 ? (
          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moreChallenges.map((challenge) => (
              <li key={challenge.slug}>
                <ChallengeCard challenge={challenge} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-muted mt-3">Vuelve pronto para descubrir nuevos retos.</p>
        )}
      </section>

      <section className="border-line border-y">
        <div className="page-frame py-12 lg:py-16">
          <h2 className="font-display font-semiwide text-2xl font-extrabold sm:text-[32px]">Cómo funciona</h2>
          <ol className="mt-6 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="border-line grid grid-cols-[auto_1fr] gap-x-4 border-t pt-4">
                <span aria-hidden="true" className="text-vice font-mono text-xl font-semibold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold">{step.title}</h3>
                  <p className="text-ink-muted mt-2 leading-relaxed">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="page-frame grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16 lg:py-16">
        <section>
          <h2 className="font-display font-semiwide text-2xl font-extrabold sm:text-[32px]">Niveles de verificación</h2>
          <dl className="divide-line mt-5 divide-y">
            {Object.values(verification).map(({ label, description }) => (
              <div key={label} className="py-3">
                <dt className="font-bold">{label}</dt>
                <dd className="text-ink-muted mt-1 leading-relaxed">{description}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="bg-surface border-line self-start rounded-md border p-6">
          <h2 className="font-display font-semiwide text-2xl font-extrabold">Team Chis 🧀</h2>
          <p className="text-ink-muted mt-3 leading-relaxed">
            Somos el equipo detrás de Vice Challenges. Creamos este espacio para que los fans propongan sus propios
            retos y compartan cómo los superaron.
          </p>
        </section>
      </div>
    </main>
  );
}
