import { ImageResponse } from "next/og";

export const alt = "Team Chis. Elige entre Retos y Diario.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#24123a", padding: 56 }}>
      <div style={{ display: "flex", flex: 1, borderRadius: 16, background: "#fff3df", color: "#24123a", padding: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", width: 590, justifyContent: "center" }}>
          <div style={{ fontSize: 26, color: "#6a5479", marginBottom: 20 }}>Team Chis</div>
          <div style={{ fontSize: 59, fontWeight: 800, lineHeight: 1.05 }}>¿A qué app vamos hoy?</div>
          <div style={{ fontSize: 33, color: "#a41660", marginTop: 18 }}>Vice Challenges y GTA 6 Journal</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 348,
            alignSelf: "center",
            transform: "rotate(-6deg)",
            background: "#fffaf0",
            padding: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              height: 270,
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(#50316b, #e6819c 64%, #eeae83)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 70,
                left: 117,
                width: 114,
                height: 114,
                borderRadius: 80,
                background: "#ffe0a5",
              }}
            />
            <div
              style={{ position: "absolute", inset: "182px 0 0", background: "linear-gradient(#398081, #24123a)" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", fontSize: 21, paddingTop: 12 }}>Retos y Diario</div>
        </div>
      </div>
    </div>,
    size,
  );
}
