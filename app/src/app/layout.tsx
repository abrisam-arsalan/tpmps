import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { SwRegister } from "@/components/SwRegister";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMP Negeri 5 Tegal — Manajemen PBD",
  description: "Aplikasi Manajemen Sekolah Terintegrasi — Rapor Pendidikan → RKJM 2026–2030 → RKT (maks 12) → RKAS → KSP. Offline-first, cetak manual, arsip tahunan.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "TPMPS", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#2b5cff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SwRegister />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
