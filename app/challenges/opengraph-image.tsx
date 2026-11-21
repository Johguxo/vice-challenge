import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Vice Challenges: retos de GTA VI creados por la comunidad";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    sticker: "¿Te atreves?",
    title: "Inventa el reto. Rómpelo.",
    subtitle: "Retos de GTA VI creados por la comunidad. Sube tu prueba y pelea el ranking.",
    callout: "Retos nuevos cada semana",
  });
}
