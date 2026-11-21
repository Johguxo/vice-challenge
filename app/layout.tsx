import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { PointerGlow } from "@/components/pointer-glow";
import { SiteFooter, SiteHeader } from "@/components/site-shell";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const marker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: "400",
});

// URL absoluta para las imágenes de compartir: dominio de producción en Vercel, o local en desarrollo.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "CHIS Explorer", template: "%s | CHIS Explorer" },
  openGraph: { siteName: "CHIS Explorer", locale: "es_419", type: "website" },
  twitter: { card: "summary_large_image" },
  description: "Cada rincón de Leonida tiene una historia. Guarda la tuya. Un diario de aventuras de Team Chis.",
};

export const viewport: Viewport = { themeColor: "#0b0612" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} ${marker.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="action bg-vice text-night sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-20"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <PointerGlow />
      </body>
    </html>
  );
}
