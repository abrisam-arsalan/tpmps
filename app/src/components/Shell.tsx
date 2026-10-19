"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Bottom nav — hanya 4 tab utama + FAB RKT di tengah
// Kiri: Beranda, Rapor | Kanan: KSP, Arsip — RKJM diakses via Beranda/Rapor
const NAV: Array<{ href: string; label: string; icon: string }> = [
  { href: "/", label: "Beranda", icon: "◈" },
  { href: "/rapor", label: "Rapor", icon: "▦" },
  { href: "/rkjm", label: "RKJM", icon: "⬢" },
  { href: "/rkt", label: "RKT", icon: "≡" },
  { href: "/rkas", label: "RKAS", icon: "₿" },
  { href: "/ksp", label: "KSP", icon: "⬣" },
  { href: "/matriks", label: "Keterkaitan", icon: "⬔" },
  { href: "/rkjm/arsip", label: "Arsip", icon: "▭" },
];

// 4 tab yang tampil di bottom bar (mobile) — RKJM/RKT/RKAS/KSP diakses via Beranda atau top nav?
// Untuk hindari sesak: bottom hanya 5 item — 2 kiri + FAB + 2 kanan (seperti template)
const BOTTOM_LEFT: typeof NAV = [
  { href: "/", label: "Beranda", icon: "◈" },
  { href: "/rapor", label: "Rapor", icon: "▦" },
];
const BOTTOM_RIGHT: typeof NAV = [
  { href: "/ksp", label: "KSP", icon: "⬣" },
  { href: "/rkjm/arsip", label: "Arsip", icon: "▭" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  return (
    <div className="min-h-screen bg-[#f2f0fb] text-[#0f172a]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[#ece9f5] bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 flex h-[56px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-[#2b5cff] text-white grid place-items-center font-bold text-xs shrink-0">S5</div>
            <div className="leading-tight min-w-0">
              <div className="font-semibold tracking-tight text-[14px] leading-none truncate">SMP Negeri 5 Tegal</div>
              <div className="text-[11px] text-zinc-400">NPSN 20329830</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <button className="lg:hidden h-8 w-8 grid place-items-center rounded-xl border border-[#ece9f5] bg-white text-zinc-500" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              ☰
            </button>
          </div>
        </div>
        {/* Desktop: semua 8 nav sebagai pill */}
        <div className="hidden lg:block border-t border-[#ece9f5] bg-white">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <nav className="flex gap-1.5 py-2 overflow-x-auto">
              {NAV.map((n) => {
                const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${active ? "bg-[#2b5cff] text-white" : "bg-[#f2f0fb] text-zinc-500 hover:bg-white hover:text-zinc-700 border border-transparent hover:border-[#ece9f5]"}`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-[#ece9f5] bg-white">
            <nav className="px-3 py-3 grid grid-cols-2 gap-1.5">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link key={n.href} href={n.href} className={`rounded-xl px-3 py-2.5 text-sm flex items-center gap-2 ${active ? "bg-[#2b5cff] text-white" : "bg-[#f2f0fb] text-zinc-700"}`}>
                    <span className="text-xs">{n.icon}</span>
                    <span className="font-medium">{n.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Konten — beri padding bawah di mobile agar tidak tertutup bottom nav */}
      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 py-5 sm:py-6 pb-24 lg:pb-6">{children}</main>

      {/* Bottom nav — mobile only, 4 ikon + FAB RKT di tengah */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#ece9f5] bg-white nav-bottom-shadow" aria-label="Navigasi bawah">
        <div className="mx-auto max-w-[1280px] px-1 flex items-center justify-around py-1">
          {BOTTOM_LEFT.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            return (
              <Link key={n.href} href={n.href} className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-xl min-w-[56px] ${active ? "text-[#2b5cff]" : "text-zinc-400"}`}>
                <span className="text-[16px] leading-none" aria-hidden>
                  {n.icon}
                </span>
                <span className={`text-[10px] leading-none ${active ? "font-semibold" : ""}`}>{n.label}</span>
              </Link>
            );
          })}
          {/* FAB tengah — RKT (aksi utama, seperti + Add) */}
          <Link href="/rkt" className="h-12 w-12 rounded-full bg-[#2b5cff] text-white grid place-items-center text-xl font-light shadow-lg -mt-4 border-4 border-[#f2f0fb]" aria-label="Buka RKT">
            +
          </Link>
          {BOTTOM_RIGHT.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            // Arsip href is /rkjm/arsip — treat as startsWith
            const isActive = n.href === "/rkjm/arsip" ? pathname.startsWith("/rkjm/arsip") : pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            return (
              <Link key={n.href} href={n.href} className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-xl min-w-[56px] ${isActive ? "text-[#2b5cff]" : "text-zinc-400"}`}>
                <span className="text-[16px] leading-none" aria-hidden>
                  {n.icon}
                </span>
                <span className={`text-[10px] leading-none ${isActive ? "font-semibold" : ""}`}>{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6 text-xs text-zinc-400 hidden lg:block">
        <div className="border-t border-[#ece9f5] pt-4 flex flex-wrap gap-3 justify-between">
          <span>SMP Negeri 5 Tegal · RKJM 2026–2030 · Rapor 2025 · ARKAS 2026 Rp 628,28jt</span>
          <span>Cetak manual + arsip permanen</span>
        </div>
      </footer>
    </div>
  );
}
