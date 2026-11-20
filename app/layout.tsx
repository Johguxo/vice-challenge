import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: { default: "Vice Challenges", template: "%s | Vice Challenges" },
  description:
    "Retos de GTA VI creados por la comunidad: crea uno, juega, sube tu prueba y pelea el ranking. Proyecto de fans no oficial.",
};

export const viewport: Viewport = { themeColor: "#0b0612" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} ${marker.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
