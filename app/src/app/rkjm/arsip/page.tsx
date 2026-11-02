"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { db, fmtRp } from "@/lib/db";
import { Card, Badge, Button } from "@/components/ui";
import { PageHead } from "@/components/PageHead";
import type { RKJM, RKT, RKAS, KSP } from "@/lib/types";

type BackupPayload = {
  rkjmList?: RKJM[]; rktList?: RKT[]; rkasList?: RKAS[]; kspList?: KSP[];
  raporImports?: Array<{ id: string; tahun: number; fileName: string; importedAt: string; rawJson?: string }>;
};

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

  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function exportAllJson() {
    // Strip scan base64 agar file tetap ringan — scan bisa diunduh per dokumen
    const strip = <T extends Record<string, unknown>>(rows: T[]): T[] =>
      rows.map((r) => {
        const rest = { ...r };
        delete rest.scanDataUrl;
        return rest;
      });
    const payload = { rkjmList: strip(rkjmList as unknown as Record<string, unknown>[]), rktList: strip(rktList as unknown as Record<string, unknown>[]), rkasList: strip(rkasList as unknown as Record<string, unknown>[]), kspList: strip(kspList as unknown as Record<string, unknown>[]), raporImports, exportedAt: new Date().toISOString(), sekolah: "SMP Negeri 5 Tegal — NPSN 20329830", tanpaScan: true };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `Arsip-SMPN5-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  }

  async function handleRestore(f: File | null) {
    if (!f) return;
    setRestoreMsg(null);
    try {
      const payload = JSON.parse(await f.text()) as BackupPayload;
      const counts: string[] = [];
      if (payload.rkjmList?.length) { await db.rkjm.bulkPut(payload.rkjmList as unknown as RKJM[]); counts.push(`${payload.rkjmList.length} RKJM`); }
      if (payload.rktList?.length) { await db.rkt.bulkPut(payload.rktList as unknown as RKT[]); counts.push(`${payload.rktList.length} RKT`); }
      if (payload.rkasList?.length) { await db.rkas.bulkPut(payload.rkasList as unknown as RKAS[]); counts.push(`${payload.rkasList.length} RKAS`); }
      if (payload.kspList?.length) { await db.ksp.bulkPut(payload.kspList as unknown as KSP[]); counts.push(`${payload.kspList.length} KSP`); }
      const ri = payload.raporImports?.filter((r) => r.rawJson) ?? [];
      if (ri.length) { await db.raporImports.bulkPut(ri as unknown as { id: string; tahun: number; fileName: string; importedAt: string; rawJson: string }[]); counts.push(`${ri.length} impor Rapor`); }
      if (counts.length === 0) { setRestoreMsg("File tidak berisi data yang dikenali."); return; }
      setRestoreMsg(`Berhasil — ${counts.join(", ")} dikembalikan.`);
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setRestoreMsg("File tidak valid — pilih file backup .json.");
    } finally { if (fileRef.current) fileRef.current.value = ""; }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <PageHead title="Tersimpan per tahun" kicker="Arsip" desc="File tahun lalu tetap ada." />
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={exportAllJson}>Export Backup</Button>
          <Button size="sm" onClick={() => fileRef.current?.click()}>Kembalikan</Button>
        </div>
      </div>
      <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => handleRestore(e.target.files?.[0] ?? null)} />
      {restoreMsg && <div role="status" aria-live="polite" className={`rounded-xl border px-3 py-2 text-xs ${restoreMsg.startsWith("Berhasil") ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-amber-50 border-amber-100 text-amber-800"}`}>{restoreMsg}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-3">
          <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500">RKJM</h3>
          {rkjmList.length === 0 ? <div className="text-xs text-zinc-500 py-4 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada.</div> : rkjmList.map((r) => (
            <div key={r.id} className="mt-2 rounded-xl border border-[#ece9f5] bg-[#f8f7ff] p-2.5 flex justify-between gap-2">
              <div className="min-w-0"><div className="text-xs font-medium">RKJM {r.periode}</div><div className="text-xs text-zinc-500">{r.status} · {new Date(r.updatedAt).toLocaleDateString("id-ID")}</div>{r.scanName && <div className="text-xs text-emerald-700">Scan: {r.scanName}</div>}</div>
              <Badge>{r.status}</Badge>
            </div>
          ))}
          <Link href="/rkjm" className="mt-2 inline-flex min-h-[44px] px-4 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka RKJM</Link>
        </Card>
        <Card className="p-3">
          <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500">Rencana</h3>
          {rktList.length === 0 ? <div className="text-xs text-zinc-500 py-4 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada.</div> : [...rktList].sort((a, b) => a.tahun_ajaran.localeCompare(b.tahun_ajaran)).map((r) => (
            <div key={r.id} className="mt-2 rounded-xl border border-[#ece9f5] bg-white p-2.5">
              <div className="flex justify-between"><span className="text-xs font-medium">RKT {r.tahun_ajaran}</span><Badge tone={r.kegiatan.length > 12 ? "merah" : "netral"}>{r.kegiatan.length}/12</Badge></div>
              <div className="text-xs text-zinc-500">Butuh anggaran {r.kegiatan.filter((x) => x.biaya === "Ya").length} · {r.status}</div>
            </div>
          ))}
          <Link href="/rkt" className="mt-2 inline-flex min-h-[44px] px-4 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka RKT</Link>
        </Card>
        <Card className="p-3">
          <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500">Anggaran</h3>
          {rkasList.length === 0 ? <div className="text-xs text-zinc-500 py-4 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada.</div> : [...rkasList].sort((a, b) => a.tahun_ajaran.localeCompare(b.tahun_ajaran)).map((r) => (
            <div key={r.id} className="mt-2 rounded-xl border border-[#ece9f5] bg-white p-2.5">
              <div className="flex justify-between"><span className="text-xs font-medium">RKAS {r.tahun_ajaran}</span><Badge>{r.status}</Badge></div>
              <div className="text-xs text-zinc-500">{r.baris.length} item · {fmtRp(r.baris.reduce((a, b) => a + b.total, 0))}</div>
            </div>
          ))}
          <Link href="/rkas" className="mt-2 inline-flex min-h-[44px] px-4 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka Anggaran</Link>
        </Card>
        <Card className="p-3">
          <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500">Kurikulum</h3>
          {kspList.length === 0 ? <div className="text-xs text-zinc-500 py-4 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada.</div> : [...kspList].sort((a, b) => a.tahun_ajaran.localeCompare(b.tahun_ajaran)).map((r) => (
            <div key={r.id} className="mt-2 rounded-xl border border-[#ece9f5] bg-white p-2.5">
              <div className="flex justify-between"><span className="text-xs font-medium">KSP {r.tahun_ajaran}</span><Badge>{r.status}</Badge></div>
              <div className="text-xs text-zinc-500">{r.cp.length} CP · {r.rkt_kegiatan_ids.length} tautan</div>
            </div>
          ))}
          <Link href="/ksp" className="mt-2 inline-flex min-h-[44px] px-4 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka Kurikulum</Link>
        </Card>
      </div>

      <Card className="p-3">
        <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500">Rapor</h3>
        <p className="text-xs text-zinc-500 mt-1">Tersimpan offline.</p>
        <div className="mt-2 overflow-x-auto rounded-xl border border-[#ece9f5]">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f7ff] text-zinc-500"><tr><th scope="col" className="text-left px-3 py-1.5 font-semibold text-xs">File</th><th scope="col" className="text-left px-3 py-1.5 font-semibold text-xs">Tahun</th><th scope="col" className="text-left px-3 py-1.5 font-semibold text-xs">Waktu</th></tr></thead>
            <tbody>
              <tr className="border-t border-[#ece9f5] bg-amber-50/40"><td className="px-3 py-2 font-mono text-xs">rapor-2025.json (seed)</td><td className="px-3 py-2 text-xs">2025</td><td className="px-3 py-2 text-xs text-zinc-500">12 Mar 2026</td></tr>
              {raporImports.map((r) => <tr key={r.id} className="border-t border-[#ece9f5]"><td className="px-3 py-2 font-mono text-xs">{r.fileName}</td><td className="px-3 py-2 text-xs">{r.tahun}</td><td className="px-3 py-2 text-xs text-zinc-500">{new Date(r.importedAt).toLocaleString("id-ID")}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
