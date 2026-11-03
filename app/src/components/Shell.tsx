"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./ui";

// Bottom nav — hanya 4 tab utama + FAB RKT di tengah
// Kiri: Beranda, Rapor | Kanan: KSP, Arsip — RKJM diakses via Beranda/Rapor
const NAV: Array<{ href: string; label: string; icon: string }> = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/rapor", label: "Rapor", icon: "chart" },
  { href: "/rkjm", label: "RKJM", icon: "layers" },
  { href: "/rkt", label: "RKT", icon: "list" },
  { href: "/rkas", label: "RKAS", icon: "banknote" },
  { href: "/ksp", label: "KSP", icon: "book" },
  { href: "/matriks", label: "Keterkaitan", icon: "link" },
  { href: "/rkjm/arsip", label: "Arsip", icon: "archive" },
];

// 4 tab yang tampil di bottom bar (mobile) — RKJM/RKT/RKAS/KSP diakses via Beranda atau top nav?
// Untuk hindari sesak: bottom hanya 5 item — 2 kiri + FAB + 2 kanan (seperti template)
const BOTTOM_LEFT: typeof NAV = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/rapor", label: "Rapor", icon: "chart" },
];
const BOTTOM_RIGHT: typeof NAV = [
  { href: "/ksp", label: "KSP", icon: "book" },
  { href: "/rkjm/arsip", label: "Arsip", icon: "archive" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#f2f0fb] text-[#0f172a]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[#ece9f5] bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 flex h-[56px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-[#2b5cff] text-white grid place-items-center font-bold text-xs shrink-0">S5</div>
            <div className="leading-tight min-w-0">
              <div className="font-semibold tracking-tight text-[14px] leading-none truncate">SMP Negeri 5 Tegal</div>
              <div className="text-[11px] text-zinc-500">NPSN 20329830</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <button className="lg:hidden min-h-[44px] min-w-[44px] grid place-items-center rounded-xl border border-[#ece9f5] bg-white text-zinc-500" onClick={() => setOpen((v) => !v)} aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
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
            <nav className="px-3 py-3 grid grid-cols-2 gap-1.5" aria-label="Menu navigasi">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={`rounded-xl px-3 min-h-[44px] text-sm flex items-center gap-2 ${active ? "bg-[#2b5cff] text-white" : "bg-[#f2f0fb] text-zinc-700"}`}>
                    <Icon name={n.icon} className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{n.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Konten — beri padding bawah di mobile agar tidak tertutup bottom nav */}
      <a href="#konten" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-xl focus:bg-[#2b5cff] focus:px-4 focus:py-2 focus:text-sm focus:text-white">Lewati ke konten</a>
      <main id="konten" tabIndex={-1} className="mx-auto max-w-[1280px] px-4 sm:px-6 py-5 sm:py-6 pb-24 lg:pb-6">{children}</main>

      {/* Bottom nav — mobile only, 4 ikon + FAB RKT di tengah */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#ece9f5] bg-white nav-bottom-shadow" aria-label="Navigasi bawah">
        <div className="mx-auto max-w-[1280px] px-1 flex items-center justify-around py-1">
          {BOTTOM_LEFT.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            return (
              <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-xl min-w-[64px] min-h-[56px] ${active ? "text-[#2b5cff]" : "text-zinc-500"}`}>
                <Icon name={n.icon} className="h-5 w-5" />
                <span className={`text-[10px] leading-none ${active ? "font-semibold" : ""}`}>{n.label}</span>
              </Link>
            );
          })}
          {/* FAB tengah — RKT (aksi utama) */}
          <Link href="/rkt" className="flex flex-col items-center justify-center gap-0 rounded-full bg-[#2b5cff] text-white shadow-lg -mt-4 border-4 border-[#f2f0fb] h-14 w-14" aria-label="Buka RKT">
            <span className="text-lg font-light leading-none" aria-hidden="true">+</span>
            <span className="text-[9px] font-semibold leading-none">RKT</span>
          </Link>
          {BOTTOM_RIGHT.map((n) => {
            // Arsip href is /rkjm/arsip — treat as startsWith
            const isActive = n.href === "/rkjm/arsip" ? pathname.startsWith("/rkjm/arsip") : pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            return (
              <Link key={n.href} href={n.href} aria-current={isActive ? "page" : undefined} className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-xl min-w-[64px] min-h-[56px] ${isActive ? "text-[#2b5cff]" : "text-zinc-500"}`}>
                <Icon name={n.icon} className="h-5 w-5" />
                <span className={`text-[10px] leading-none ${isActive ? "font-semibold" : ""}`}>{n.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
