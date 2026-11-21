import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Tarjeta para compartir (WhatsApp, Discord, X…): atardecer, sol con franjas y skyline, todo original.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const display = await readFile(join(process.cwd(), "assets/fonts/ArchivoBlack-Regular.ttf"));

const colors = {
  night: "#0b0612",
  ink: "#fff4f8",
  muted: "#f1d9ea",
  marker: "#ffe14d",
  vice: "#ff2e93",
  skyline: "#1a0a26",
};

// Alturas fijas para que todas las tarjetas compartan la misma ciudad.
const buildings = [70, 120, 92, 160, 110, 200, 135, 88, 175, 120, 150, 96, 210, 130, 105, 180, 90, 140, 115, 165];

type OgCard = {
  sticker: string;
  title: string;
  subtitle: string;
  stat?: { label: string; value: string };
  callout?: string;
};

export function renderOgCard({ sticker, title, subtitle, stat, callout }: OgCard) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundImage: "linear-gradient(180deg, #2a0f4a 0%, #6b1a6e 40%, #c3166c 72%, #ff8a3d 100%)",
        fontFamily: "Archivo Black",
        color: colors.ink,
      }}
    >
      {/* Sol con franjas */}
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: 90,
          width: 380,
          height: 380,
          borderRadius: 9999,
          backgroundImage: `linear-gradient(180deg, ${colors.marker} 0%, #ff8a3d 100%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        {[10, 14, 18, 24].map((h, i) => (
          <div key={i} style={{ height: h, marginBottom: 22 - i * 3, background: "#c3166c" }} />
        ))}
      </div>
      {/* Skyline */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", alignItems: "flex-end" }}>
        {buildings.map((h, i) => (
          <div key={i} style={{ flex: 1, height: h, background: colors.skyline }} />
        ))}
      </div>
      {/* Sombra para legibilidad del texto */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(90deg, rgba(11,6,18,0.92) 0%, rgba(11,6,18,0.55) 58%, rgba(11,6,18,0) 85%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: colors.marker,
              color: colors.night,
              fontSize: 28,
              padding: "6px 16px",
              transform: "rotate(-3deg)",
            }}
          >
            {sticker}
          </div>
          <div style={{ fontSize: title.length > 26 ? 64 : 82, lineHeight: 0.98, marginTop: 28, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.3, marginTop: 20, color: colors.muted }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          {stat ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 22, color: colors.muted }}>{stat.label}</div>
              <div style={{ fontSize: 64, color: colors.marker, letterSpacing: 1 }}>{stat.value}</div>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 40, color: colors.marker }}>{callout}</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", fontSize: 30 }}>
              VICE <span style={{ color: colors.vice, marginLeft: 10 }}>CHALLENGES</span>
            </div>
            <div style={{ fontSize: 16, color: colors.muted, marginTop: 4 }}>Proyecto de fans no oficial</div>
          </div>
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "Archivo Black", data: display, weight: 400, style: "normal" }] },
  );
}
