"use client";
import { useEffect, useState } from "react";
import { db, fmtRp } from "@/lib/db";
import { Badge, Button, Card, Kicker } from "@/components/ui";
import { buildTrace, healthCheck } from "@/lib/trace";
import { exportToExcel, openPrintWindow, docHtml, tableHtml } from "@/lib/export";
import type { RKJM, RKT, RKAS, KSP } from "@/lib/types";

const TA = ["2026/2027", "2027/2028", "2028/2029", "2029/2030"] as const;

export default function KeterkaitanPage() {
  const [tahun, setTahun] = useState<string>("2026/2027");
  const [rkjm, setRkjm] = useState<RKJM | null>(null);
  const [rkt, setRkt] = useState<RKT | null>(null);
  const [rkas, setRkas] = useState<RKAS | null>(null);
  const [ksp, setKsp] = useState<KSP | null>(null);
  const [allRkts, setAllRkts] = useState<RKT[]>([]);
  const [allKsps, setAllKsps] = useState<KSP[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [j, t, k, ar, ks] = await Promise.all([
          db.rkjm.where("periode").equals("2026-2030").first().catch(() => null),
          db.rkt.where("tahun_ajaran").equals(tahun).first().catch(() => null),
          db.rkas.where("tahun_ajaran").equals(tahun).first().catch(() => null),
          db.rkt.toArray().catch(() => []),
          db.ksp.toArray().catch(() => []),
        ]);
        const kk = await db.ksp.where("tahun_ajaran").equals(tahun).first().catch(() => null);
        if (!alive) return;
        setRkjm((j as unknown as RKJM) ?? null); setRkt((t as unknown as RKT) ?? null);
        setRkas((k as unknown as RKAS) ?? null); setKsp((kk as unknown as KSP) ?? null);
        setAllRkts(ar as unknown as RKT[]); setAllKsps(ks as unknown as KSP[]);
      } catch {}
    })();
    return () => { alive = false; };
  }, [tahun]);

  const rows = buildTrace(rkt, rkjm, rkas, ksp);
  const issues = healthCheck({ rkjm, rkts: allRkts, rkas, ksps: allKsps, rktAktif: rkt });

  async function doExport() {
    await exportToExcel([
      { name: "Keterkaitan", header: ["No", "Rapor", "Sasaran RKJM", "Rencana Tahunan", "Biaya", "Anggaran", "Kurikulum", "Status"], rows: rows.map((r) => [String(r.no), `${r.raporKode}`, r.rkjmSasaran ?? "—", (r.rktKegiatan ?? "").slice(0, 40), r.rktBiaya ?? "—", r.rkasTotal != null ? fmtRp(r.rkasTotal) : "—", r.kspTaut ? "Ya" : "Tidak", r.status]) },
      { name: "Cek Kelengkapan", header: ["Tingkat", "Catatan"], rows: issues.map((it) => [it.severity, it.message]) },
    ], `Keterkaitan-${tahun.replace("/", "-")}-SMPN5.xlsx`);
  }
  function doCetak() {
    openPrintWindow(docHtml({
      title: `Keterkaitan Dokumen dan Cek Kelengkapan — ${tahun}`, subtitle: `Rapor ke RKJM ke Rencana Tahunan ke Anggaran ke Kurikulum`,
      meta: [["Tahun", tahun], ["RKT", rkt ? `${rkt.kegiatan.length}/12 · ${rkt.status}` : "—"], ["RKAS", rkas ? `${rkas.baris.length} baris · ${fmtRp(rkas.baris.reduce((a, b) => a + b.total, 0))}` : "—"], ["KSP", ksp ? `${ksp.cp.length} CP · ${ksp.rkt_kegiatan_ids.length} taut` : "—"]],
      sections: [
        { heading: "Keterkaitan — Benang Merah Dokumen", html: tableHtml(["No", "Rapor", "Sasaran", "RKT", "Anggaran", "KSP", "Status"], rows.map((r) => [String(r.no), r.raporKode, r.rkjmSasaran ?? "—", (r.rktKegiatan ?? "").slice(0, 30), r.rkasTotal != null ? fmtRp(r.rkasTotal) : "—", r.kspTaut ? "Ya" : "Tidak", r.status])) },
        { heading: "Cek Kelengkapan", html: tableHtml(["Tingkat", "Catatan"], issues.map((it) => [it.severity.toUpperCase(), it.message])) },
      ],
    }), `Keterkaitan-${tahun}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <div>
          <Kicker>Keterkaitan</Kicker>
          <h2 className="text-[17px] font-semibold tracking-tight mt-1">Tahun {tahun}</h2>
        </div>
        <div className="flex gap-2">
          <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="h-9 rounded-xl border border-[#ece9f5] bg-white px-3 text-sm">
            {TA.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <Button variant="secondary" size="sm" onClick={doExport}>Export Excel</Button>
          <Button size="sm" onClick={doCetak}>Cetak</Button>
        </div>
      </div>

      {!rkt || rkt.kegiatan.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-zinc-600">Rencana {tahun} kosong — isi dulu.</p>
        </Card>
      ) : (
        <>
          <Card className="p-3 overflow-x-auto">
            <Kicker>Daftar keterkaitan</Kicker>
            <table className="w-full text-sm mt-2 border border-[#ece9f5] rounded-xl overflow-hidden">
              <thead className="bg-[#f8f7ff] text-zinc-600">
                <tr>
                  <th className="px-2 py-2 text-left font-semibold">No</th>
                  <th className="px-2 py-2 text-left font-semibold">Rapor</th>
                  <th className="px-2 py-2 text-left font-semibold">Sasaran</th>
                  <th className="px-2 py-2 text-left font-semibold">RKT</th>
                  <th className="px-2 py-2 text-left font-semibold">Anggaran</th>
                  <th className="px-2 py-2 font-semibold">KSP</th>
                  <th className="px-2 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.no} className={`border-t border-[#f0ebe0] ${r.status === "merah" ? "bg-red-50" : r.status === "warn" ? "bg-amber-50/50" : ""}`}>
                    <td className="px-2 py-2 font-mono text-xs">{r.no}</td>
                    <td className="px-2 py-2"><div className="font-mono text-xs font-medium">{r.raporKode}</div><div className="text-xs text-zinc-400">{r.skor2025 ?? "—"}</div></td>
                    <td className="px-2 py-2 text-xs">{r.rkjmSasaran ?? <span className="text-amber-600">—</span>}</td>
                    <td className="px-2 py-2 text-xs max-w-[180px] truncate">{r.rktKegiatan?.slice(0, 36)}</td>
                    <td className="px-2 py-2 text-xs">{r.rkasTotal != null ? <span className="font-medium tabular-nums">{fmtRp(r.rkasTotal)}</span> : <span className="text-zinc-400">—</span>}</td>
                    <td className="px-2 py-2 text-center">{r.kspTaut ? <Badge tone="hijau">Ya</Badge> : <Badge tone="netral">Tidak</Badge>}</td>
                    <td className="px-2 py-2"><Badge tone={r.status === "ok" ? "hijau" : r.status === "warn" ? "kuning" : "merah"}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-zinc-400 mt-2">Tanpa biaya tetap dihitung.</p>
          </Card>

          <Card className="p-3">
            <Kicker>Cek kelengkapan</Kicker>
            <div className="mt-2 space-y-1.5">
              {issues.map((it, i) => (
                <div key={i} className={`rounded-xl border px-3 py-2 flex gap-2 items-start ${it.severity === "merah" ? "bg-red-50 border-red-100" : it.severity === "kuning" ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}>
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${it.severity === "merah" ? "bg-red-500" : it.severity === "kuning" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <div className="flex-1 min-w-0"><div className={`text-xs leading-4 ${it.severity === "merah" ? "text-red-800" : it.severity === "kuning" ? "text-amber-800" : "text-emerald-800"}`}>{it.message}</div>{it.actionHref && <a href={it.actionHref} className="text-xs underline text-[#2b5cff]">Buka</a>}</div>
                  <Badge tone={it.severity === "merah" ? "merah" : it.severity === "kuning" ? "kuning" : "hijau"}>{it.severity}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
