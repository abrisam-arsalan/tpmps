"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db, fmtRp } from "@/lib/db";
import { Card, Badge, Button, Kicker } from "@/components/ui";
import type { RKJM, RKT, RKAS, KSP } from "@/lib/types";

export default function ArsipPage() {
  const [rkjmList, setRkjmList] = useState<RKJM[]>([]);
  const [rktList, setRktList] = useState<RKT[]>([]);
  const [rkasList, setRkasList] = useState<RKAS[]>([]);
  const [kspList, setKspList] = useState<KSP[]>([]);
  const [raporImports, setRaporImports] = useState<Array<{ id: string; tahun: number; fileName: string; importedAt: string }>>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [a, b, c, d, e] = await Promise.all([
          db.rkjm.toArray().catch(() => []), db.rkt.toArray().catch(() => []), db.raporImports.toArray().catch(() => []), db.rkas.toArray().catch(() => []), db.ksp.toArray().catch(() => []),
        ]);
        if (!alive) return;
        setRkjmList(a as unknown as RKJM[]); setRktList(b as unknown as RKT[]);
        setRaporImports((c as unknown as Array<{ id: string; tahun: number; fileName: string; importedAt: string }>).map((x) => ({ id: x.id, tahun: x.tahun, fileName: x.fileName, importedAt: x.importedAt })));
        setRkasList(d as unknown as RKAS[]); setKspList(e as unknown as KSP[]);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  async function exportAllJson() {
    const payload = { rkjmList, rktList, rkasList, kspList, raporImports, exportedAt: new Date().toISOString(), sekolah: "SMP Negeri 5 Tegal — NPSN 20329830" };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `Arsip-SMPN5-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <div>
          <Kicker>Arsip</Kicker>
          <h2 className="text-[17px] font-semibold tracking-tight mt-1">Tersimpan per tahun</h2>
          <p className="text-[13px] leading-5 text-zinc-500 mt-1">File tahun lalu tetap ada.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={exportAllJson}>Export Backup</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-3">
          <Kicker>RKJM</Kicker>
          {rkjmList.length === 0 ? <div className="text-xs text-zinc-400 py-4 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada.</div> : rkjmList.map((r) => (
            <div key={r.id} className="mt-2 rounded-xl border border-[#ece9f5] bg-[#f8f7ff] p-2.5 flex justify-between gap-2">
              <div className="min-w-0"><div className="text-xs font-medium">RKJM {r.periode}</div><div className="text-xs text-zinc-500">{r.status} · {new Date(r.updatedAt).toLocaleDateString("id-ID")}</div>{r.scanName && <div className="text-xs text-emerald-700">Scan: {r.scanName}</div>}</div>
              <Badge>{r.status}</Badge>
            </div>
          ))}
          <Link href="/rkjm" className="mt-2 inline-flex h-7 px-3 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka RKJM</Link>
        </Card>
        <Card className="p-3">
          <Kicker>Rencana</Kicker>
          {rktList.length === 0 ? <div className="text-xs text-zinc-400 py-4 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada.</div> : [...rktList].sort((a, b) => a.tahun_ajaran.localeCompare(b.tahun_ajaran)).map((r) => (
            <div key={r.id} className="mt-2 rounded-xl border border-[#ece9f5] bg-white p-2.5">
              <div className="flex justify-between"><span className="text-xs font-medium">RKT {r.tahun_ajaran}</span><Badge tone={r.kegiatan.length > 12 ? "merah" : "netral"}>{r.kegiatan.length}/12</Badge></div>
              <div className="text-xs text-zinc-500">Butuh anggaran {r.kegiatan.filter((x) => x.biaya === "Ya").length} · {r.status}</div>
            </div>
          ))}
          <Link href="/rkt" className="mt-2 inline-flex h-7 px-3 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka RKT</Link>
        </Card>
        <Card className="p-3">
          <Kicker>Anggaran</Kicker>
          {rkasList.length === 0 ? <div className="text-xs text-zinc-400 py-4 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada.</div> : [...rkasList].sort((a, b) => a.tahun_ajaran.localeCompare(b.tahun_ajaran)).map((r) => (
            <div key={r.id} className="mt-2 rounded-xl border border-[#ece9f5] bg-white p-2.5">
              <div className="flex justify-between"><span className="text-xs font-medium">RKAS {r.tahun_ajaran}</span><Badge>{r.status}</Badge></div>
              <div className="text-xs text-zinc-500">{r.baris.length} item · {fmtRp(r.baris.reduce((a, b) => a + b.total, 0))}</div>
            </div>
          ))}
          <Link href="/rkas" className="mt-2 inline-flex h-7 px-3 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka Anggaran</Link>
        </Card>
        <Card className="p-3">
          <Kicker>Kurikulum</Kicker>
          {kspList.length === 0 ? <div className="text-xs text-zinc-400 py-4 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada.</div> : [...kspList].sort((a, b) => a.tahun_ajaran.localeCompare(b.tahun_ajaran)).map((r) => (
            <div key={r.id} className="mt-2 rounded-xl border border-[#ece9f5] bg-white p-2.5">
              <div className="flex justify-between"><span className="text-xs font-medium">KSP {r.tahun_ajaran}</span><Badge>{r.status}</Badge></div>
              <div className="text-xs text-zinc-500">{r.cp.length} CP · {r.rkt_kegiatan_ids.length} tautan</div>
            </div>
          ))}
          <Link href="/ksp" className="mt-2 inline-flex h-7 px-3 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka Kurikulum</Link>
        </Card>
      </div>

      <Card className="p-3">
        <Kicker>Rapor</Kicker>
        <p className="text-xs text-zinc-400 mt-1">Tersimpan offline.</p>
        <div className="mt-2 overflow-x-auto rounded-xl border border-[#ece9f5]">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f7ff] text-zinc-500"><tr><th className="text-left px-3 py-1.5 font-semibold text-xs">File</th><th className="text-left px-3 py-1.5 font-semibold text-xs">Tahun</th><th className="text-left px-3 py-1.5 font-semibold text-xs">Waktu</th></tr></thead>
            <tbody>
              <tr className="border-t border-[#f0ebe0] bg-amber-50/40"><td className="px-3 py-2 font-mono text-xs">rapor-2025.json (seed)</td><td className="px-3 py-2 text-xs">2025</td><td className="px-3 py-2 text-xs text-zinc-500">12 Mar 2026</td></tr>
              {raporImports.map((r) => <tr key={r.id} className="border-t border-[#f0ebe0]"><td className="px-3 py-2 font-mono text-xs">{r.fileName}</td><td className="px-3 py-2 text-xs">{r.tahun}</td><td className="px-3 py-2 text-xs text-zinc-500">{new Date(r.importedAt).toLocaleString("id-ID")}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
