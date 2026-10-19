"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { raporSeed } from "@/lib/rapor";
import { Badge, Card, Kicker, Progress, Stat } from "@/components/ui";
import { RaporImportCard } from "@/components/RaporImportCard";
import { db } from "@/lib/db";
import { healthCheck } from "@/lib/trace";
import type { RKJM, RKT, RKAS, KSP } from "@/lib/types";

export default function Home() {
  const [rkjm, setRkjm] = useState<RKJM | null>(null);
  const [rkt, setRkt] = useState<RKT | null>(null);
  const [rkas, setRkas] = useState<RKAS | null>(null);
  const [ksp, setKsp] = useState<KSP | null>(null);
  const [rkts, setRkts] = useState<RKT[]>([]);
  const [ksps, setKsps] = useState<KSP[]>([]);
  const [raporCount, setRaporCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const c = await db.raporImports.count();
        const rj = await db.rkjm.orderBy("updatedAt").reverse().first();
        const rk = await db.rkt.orderBy("updatedAt").reverse().first();
        const rs = await db.rkas.orderBy("updatedAt").reverse().first().catch(() => null);
        const ks = await db.ksp.orderBy("updatedAt").reverse().first().catch(() => null);
        const allRkts = await db.rkt.toArray().catch(() => []);
        const allKsps = await db.ksp.toArray().catch(() => []);
        if (!alive) return;
        setRaporCount(c);
        if (rj) setRkjm(rj as unknown as RKJM);
        if (rk) setRkt(rk as unknown as RKT);
        if (rs) setRkas(rs as unknown as RKAS);
        if (ks) setKsp(ks as unknown as KSP);
        setRkts(allRkts as unknown as RKT[]);
        setKsps(allKsps as unknown as KSP[]);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  const stats = useMemo(() => {
    const l1 = raporSeed.indikator_level1.length;
    const l2 = raporSeed.indikator_level2.length;
    const prio = raporSeed.prioritas_pbd_2025.daftar.length;
    return { l1, l2, prio };
  }, []);
  const issues = useMemo(() => healthCheck({ rkjm, rkts, rkas, ksps, rktAktif: rkt }), [rkjm, rkts, rkas, ksps, rkt]);
  const primaryIssue = issues.find((x) => x.severity === "merah") ?? issues[0];
  const health = useMemo(() => {
    const hasRapor = true;
    const hasRKJM = !!rkjm && rkjm.sasaran.length > 0;
    const hasRKT = !!rkt && rkt.kegiatan.length > 0 && rkt.kegiatan.length <= 12;
    const hasRKAS = !!rkas && rkas.baris.length > 0;
    const hasKSP = !!ksp && !!ksp.komponen.karakteristik?.trim();
    const items = [
      { label: "Rapor", ok: hasRapor },
      { label: "RKJM", ok: hasRKJM },
      { label: "RKT", ok: hasRKT },
      { label: "RKAS", ok: hasRKAS },
      { label: "KSP", ok: hasKSP },
    ];
    const done = items.filter((x) => x.ok).length;
    return { items, done, total: items.length, pct: Math.round((done / items.length) * 100) };
  }, [rkjm, rkt, rkas, ksp]);

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] bg-[#2b5cff] text-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium tracking-widest uppercase text-white/70">SMP Negeri 5 Tegal</div>
            <h1 className="text-xl font-semibold tracking-tight leading-tight mt-1 text-white">Ikuti alur — satu langkah, satu dokumen.</h1>
          </div>
          <Link href="/matriks" className="h-9 px-5 inline-flex items-center justify-center rounded-full bg-white text-[#2b5cff] text-sm font-semibold shadow-sm">
            Cek Keterkaitan
          </Link>
        </div>
        <div className="mt-5 rounded-2xl bg-white/10 border border-white/15 p-3">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "Rapor", href: "/rapor", done: true },
              { label: "RKJM", href: "/rkjm", done: !!rkjm?.sasaran.length },
              { label: "RKT", href: "/rkt", done: !!rkt?.kegiatan.length },
              { label: "RKAS", href: "/rkas", done: !!rkas?.baris.length },
              { label: "KSP", href: "/ksp", done: !!ksp?.komponen.karakteristik?.trim() },
              { label: "Arsip", href: "/rkjm/arsip", done: false },
            ].map((s, i, arr) => (
              <span key={s.label} className="inline-flex items-center gap-2">
                <Link href={s.href} className={`h-7 px-3.5 inline-flex items-center justify-center rounded-full text-xs font-medium transition ${s.done ? "bg-white text-[#2b5cff] shadow-sm" : "bg-white/10 text-white border border-white/20 hover:bg-white/20"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${s.done ? "bg-emerald-500" : "bg-white/40"}`} />
                  {s.label}
                </Link>
                {i < arr.length - 1 && <span className="text-white/30 text-xs select-none">—</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Indikator" value={stats.l1} hint={`+ ${stats.l2} sub`} />
        <Stat label="Prioritas" value={`${stats.prio}/12`} hint="Tahun ini" />
        <Stat label="Impor" value={raporCount ?? "—"} hint="Offline" />
        <div className="card-paper p-4">
          <div className="text-[11px] font-medium tracking-wide uppercase text-zinc-500">Kelengkapan</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-semibold tracking-tight">{health.done}/{health.total}</span>
            <span className="text-xs text-zinc-400">{health.pct}%</span>
          </div>
          <Progress value={health.pct} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="p-4 lg:col-span-3">
          <Kicker>Langkah selanjutnya</Kicker>
          <div className={`mt-3 rounded-2xl border px-4 py-3.5 flex gap-3 ${primaryIssue?.severity === "merah" ? "bg-red-50 border-red-100" : primaryIssue?.severity === "kuning" ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}>
            <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${primaryIssue?.severity === "merah" ? "bg-red-500" : primaryIssue?.severity === "kuning" ? "bg-amber-500" : "bg-emerald-500"}`} />
            <div className="min-w-0 flex-1">
              <div className={`text-sm font-medium leading-5 ${primaryIssue?.severity === "merah" ? "text-red-800" : primaryIssue?.severity === "kuning" ? "text-amber-800" : "text-emerald-800"}`}>{primaryIssue?.message ?? "Siap cetak dan arsip."}</div>
              {primaryIssue?.actionHref && <Link href={primaryIssue.actionHref} className="text-xs font-medium underline text-[#2b5cff] mt-1 inline-block">Buka</Link>}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {health.items.map((it) => (
              <span key={it.label} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${it.ok ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-white border-[#ece9f5] text-zinc-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${it.ok ? "bg-emerald-500" : "bg-zinc-300"}`} />
                {it.label}
              </span>
            ))}
          </div>
          <Link href="/matriks" className="mt-3 inline-flex h-7 px-3 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">
            Lihat validasi lengkap
          </Link>
        </Card>
        <div className="lg:col-span-2 space-y-3">
          <RaporImportCard />
          <div className="card-paper p-4">
            <div className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Alur</div>
            <p className="text-[13px] leading-5 text-zinc-600 mt-1.5">Rapor → RKJM → RKT → RKAS → Kurikulum.</p>
            <p className="text-xs text-zinc-400 mt-1">Cetak manual, arsip tetap ada.</p>
          </div>
        </div>
      </div>

      <Card className="p-4 sm:p-5">
        <Kicker>Rapor — ringkas untuk RKJM</Kicker>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3.5">
            <div className="text-xs font-semibold text-emerald-900">Kekuatan</div>
            <ul className="text-[13px] leading-5 text-emerald-800 mt-1.5 space-y-1 list-disc pl-4">
              <li>Literasi <strong>91,11%</strong> — skor 76,69</li>
              <li>D.2 Refleksi 73,14 · D.3 Kepemimpinan 70,91</li>
              <li>E.7 Fasilitas 96,83</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3.5">
            <div className="text-xs font-semibold text-amber-900">Perlu perbaikan</div>
            <ul className="text-[13px] leading-5 text-amber-800 mt-1.5 space-y-1 list-disc pl-4">
              <li>A.2 Numerasi 84,44% · Data 59,61</li>
              <li>E.3 TIK 50</li>
              <li>D.10 Inklusivitas 59,6</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/rapor/analisis" className="h-8 px-3.5 inline-flex items-center justify-center rounded-xl bg-[#2b5cff] text-white text-xs font-medium">Buka Analisis</Link>
          <Link href="/rkjm" className="h-8 px-3.5 inline-flex items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka RKJM</Link>
          <Link href="/matriks" className="h-8 px-3.5 inline-flex items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Cek Keterkaitan</Link>
        </div>
      </Card>
    </div>
  );
}
