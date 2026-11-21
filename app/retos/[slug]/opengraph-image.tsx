import { formatTime, modes } from "@/lib/challenges";
import { getChallenge } from "@/lib/data";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Reto de Vice Challenges";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const challenge = await getChallenge(slug);

  if (!challenge) {
    return renderOgCard({
      sticker: "Reto",
      title: "Vice Challenges",
      subtitle: "Retos de GTA VI creados por la comunidad.",
      callout: "¿Te atreves?",
    });
  }

  const record = challenge.ranking[0];
  return renderOgCard({
    sticker: `Reto ${modes[challenge.mode].toLowerCase()}`,
    title: challenge.title,
    subtitle: challenge.objective,
    stat: record ? { label: `Récord de ${record.username}`, value: formatTime(record.timeMs) } : undefined,
    callout: record ? undefined : "¿Serás el primero?",
  });
}
