"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, Kicker } from "@/components/ui";
import { DocActions } from "@/components/DocActions";
import { ScanUpload } from "@/components/ScanUpload";
import { exportToExcel, openPrintWindow, docHtml, tableHtml } from "@/lib/export";
import { db, uid, nowISO } from "@/lib/db";
import { raporSeed } from "@/lib/rapor";
import type { RKJM, RKJMSasaran, RKJMProgram } from "@/lib/types";

const PERIODE = "2026-2030";
const DEFAULT_VISI = "SMP Negeri 5 Tegal yang Berprestasi, Berkarakter, dan Berwawasan Lingkungan";
const DEFAULT_MISI = [
  "Meningkatkan literasi dan numerasi",
  "Menguatkan karakter, kebinekaan, dan keamanan",
  "Mengoptimalkan TIK dan sumber daya",
];

function emptyRKJM(): RKJM {
  const now = nowISO();
  return { id: uid("rkjm"), periode: PERIODE, visi: DEFAULT_VISI, misi: [...DEFAULT_MISI], tujuan: "Capaian terbaik 2030.", sasaran: [], program: [], bab6_monev: "Evaluasi tengah 2028 dan akhir 2030.", status: "Draft", createdAt: now, updatedAt: now };
}

export default function RKJMPage() {
  const [rkjm, setRkjm] = useState<RKJM | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [sasaranForm, setSasaranForm] = useState<{ judul: string; indikator: string; target2030: string; pj: string }>({ judul: "", indikator: "A.2", target2030: "", pj: "Wakasek Kurikulum" });
  const [programForm, setProgramForm] = useState<{ nama: string; strategi: string }>({ nama: "", strategi: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const found = await db.rkjm.where("periode").equals(PERIODE).first(); if (!alive) return; if (found) setRkjm(found as unknown as RKJM); else setRkjm(emptyRKJM()); }
      catch { setRkjm(emptyRKJM()); } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  async function save(next: RKJM, msg = "Tersimpan.") {
    await db.rkjm.put({ ...next, updatedAt: nowISO() } as unknown as RKJM);
    setRkjm(next); setSaveMsg(msg); setTimeout(() => setSaveMsg(null), 2200);
  }

  if (loading || !rkjm) return <div className="py-12 text-center text-sm text-zinc-500">Memuat…</div>;
  const indikatorOpts = raporSeed.indikator_level1.map((x) => ({ kode: x.kode, nama: x.nama }));

  function addSasaran() {
    if (!rkjm || !sasaranForm.judul.trim()) return;
    const s: RKJMSasaran = { id: uid("sasaran"), kode: `S-${String(rkjm.sasaran.length + 1).padStart(2, "0")}`, judul: sasaranForm.judul.trim(), indikator_rapor_kode: sasaranForm.indikator, target: { "2029/2030": sasaranForm.target2030 || "-" }, penanggung_jawab: sasaranForm.pj, createdAt: nowISO() };
    const next: RKJM = { ...rkjm, sasaran: [...rkjm.sasaran, s] };
    save(next, "Sasaran ditambahkan."); setSasaranForm({ judul: "", indikator: "A.2", target2030: "", pj: "Wakasek Kurikulum" });
  }
  function removeSasaran(id: string) { if (!rkjm) return; const next: RKJM = { ...rkjm, sasaran: rkjm.sasaran.filter((x) => x.id !== id) }; save(next, "Dihapus."); }
  function addProgram() {
    if (!rkjm || !programForm.nama.trim()) return;
    const p: RKJMProgram = { id: uid("prog"), nama: programForm.nama.trim(), sasaran_ids: [], strategi: programForm.strategi.trim(), tahapan: {} };
    const next: RKJM = { ...rkjm, program: [...rkjm.program, p] };
    save(next, "Program ditambahkan."); setProgramForm({ nama: "", strategi: "" });
  }
  async function doExportExcel() {
    if (!rkjm) return;
    await exportToExcel([
      { name: "Visi Misi", header: ["Jenis", "Isi"], rows: [["Visi", rkjm.visi], ...rkjm.misi.map((m, i) => [`Misi ${i + 1}`, m]), ["Tujuan", rkjm.tujuan]] },
      { name: "Sasaran", header: ["Kode", "Judul", "Indikator", "Target 2030", "PJ"], rows: rkjm.sasaran.map((s) => [s.kode, s.judul, s.indikator_rapor_kode, s.target["2029/2030"] ?? "-", s.penanggung_jawab]) },
      { name: "Program", header: ["Program", "Strategi"], rows: rkjm.program.map((p) => [p.nama, p.strategi]) },
    ], `RKJM-${PERIODE}-SMPN5.xlsx`);
  }
  function doCetak() {
    if (!rkjm) return;
    openPrintWindow(docHtml({
      title: `RKJM ${PERIODE} — SMP Negeri 5 Tegal`, subtitle: `Status ${rkjm.status}`,
      meta: [["Periode", PERIODE], ["Visi", rkjm.visi], ["Sasaran", String(rkjm.sasaran.length)], ["Program", String(rkjm.program.length)], ["Status", rkjm.status]],
      sections: [
        { heading: "Sasaran", html: tableHtml(["Kode", "Sasaran", "Indikator", "Target 2030", "PJ"], rkjm.sasaran.map((s) => [s.kode, s.judul, s.indikator_rapor_kode, s.target["2029/2030"] ?? "-", s.penanggung_jawab])) },
        { heading: "Program dan Peta Jalan", html: tableHtml(["Program", "Strategi"], rkjm.program.map((p) => [p.nama, p.strategi])) },
        { heading: "Misi", html: `<ol style="font-size:13px">${rkjm.misi.map((m) => `<li>${m}</li>`).join("")}</ol>` },
        { heading: "MONEV", html: `<p style="font-size:13px;white-space:pre-wrap">${rkjm.bab6_monev}</p>` },
      ],
    }), `RKJM ${PERIODE}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <div>
          <Kicker>Rencana Jangka Menengah — RKJM</Kicker>
          <h2 className="text-[17px] font-semibold tracking-tight mt-1">Visi, Misi, dan Sasaran</h2>
        </div>
        <Link href="/rkt" className="h-8 px-4 inline-flex items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka RKT</Link>
      </div>

      {saveMsg && <div className="rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-2 text-xs">{saveMsg}</div>}
      <DocActions status={rkjm.status} onSiapCetak={() => save({ ...rkjm, status: "Siap Cetak" }, "Siap Cetak")} onSah={() => save({ ...rkjm, status: "Sah" }, "Sah — arsip permanen")} onArsipkan={() => save({ ...rkjm, status: "Diarsipkan" }, "Diarsipkan")} onExportExcel={doExportExcel} onCetak={doCetak} disableSah={!rkjm.scanDataUrl} sahHint={!rkjm.scanDataUrl ? "Upload scan dulu" : undefined} />

      <Card className="p-4 space-y-3">
        <div className="flex gap-2 items-center"><Badge tone="hijau">Periode {PERIODE}</Badge><Badge>{rkjm.status}</Badge></div>
        <div>
          <div className="text-xs font-medium text-zinc-700">Visi</div>
          <textarea value={rkjm.visi} onChange={(e) => setRkjm({ ...rkjm, visi: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-700">Misi — satu per baris</div>
          <textarea value={rkjm.misi.join("\n")} onChange={(e) => setRkjm({ ...rkjm, misi: e.target.value.split("\n") })} rows={3} className="mt-1 w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-700">Tujuan</div>
          <input value={rkjm.tujuan} onChange={(e) => setRkjm({ ...rkjm, tujuan: e.target.value })} className="mt-1 w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
        </div>
        <Button size="sm" onClick={() => save(rkjm)}>Simpan</Button>
      </Card>

      <Card className="p-4">
        <Kicker>Sasaran</Kicker>
        <div className="mt-2 grid gap-2 rounded-2xl border border-[#ece9f5] bg-[#f8f7ff] p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input value={sasaranForm.judul} onChange={(e) => setSasaranForm({ ...sasaranForm, judul: e.target.value })} placeholder="Judul sasaran" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
            <select value={sasaranForm.indikator} onChange={(e) => setSasaranForm({ ...sasaranForm, indikator: e.target.value })} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm">
              {indikatorOpts.map((o) => <option key={o.kode} value={o.kode}>{o.kode} — {o.nama.slice(0, 40)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input value={sasaranForm.target2030} onChange={(e) => setSasaranForm({ ...sasaranForm, target2030: e.target.value })} placeholder="Target 2030" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
            <input value={sasaranForm.pj} onChange={(e) => setSasaranForm({ ...sasaranForm, pj: e.target.value })} placeholder="Penanggung jawab" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
            <Button size="sm" onClick={addSasaran}>Tambah</Button>
          </div>
        </div>
        <div className="mt-2 space-y-1.5">
          {rkjm.sasaran.length === 0 && <div className="text-xs text-zinc-400 py-3 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada — tambah sasaran.</div>}
          {rkjm.sasaran.map((s) => (
            <div key={s.id} className="flex gap-2 items-center rounded-xl border border-[#ece9f5] bg-white px-3 py-2">
              <span className="font-mono text-xs font-medium">{s.kode}</span>
              <span className="text-xs flex-1 truncate">{s.judul} <Badge className="ml-1">{s.indikator_rapor_kode}</Badge></span>
              <span className="text-xs text-zinc-400 hidden sm:inline">{s.target["2029/2030"]} · {s.penanggung_jawab}</span>
              <Button variant="ghost" size="sm" onClick={() => removeSasaran(s.id)}>Hapus</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <Kicker>Program dan Peta Jalan</Kicker>
        <div className="mt-2 grid gap-2 rounded-2xl border border-[#ece9f5] bg-[#f8f7ff] p-3">
          <input value={programForm.nama} onChange={(e) => setProgramForm({ ...programForm, nama: e.target.value })} placeholder="Nama program" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <textarea value={programForm.strategi} onChange={(e) => setProgramForm({ ...programForm, strategi: e.target.value })} placeholder="Strategi — 1 kalimat" rows={2} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <Button size="sm" className="self-start" onClick={addProgram}>Tambah program</Button>
        </div>
        <div className="mt-2 space-y-1.5">
          {rkjm.program.length === 0 && <div className="text-xs text-zinc-400 py-2 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada program.</div>}
          {rkjm.program.map((p) => <div key={p.id} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2"><div className="text-xs font-medium">{p.nama}</div>{p.strategi && <div className="text-xs text-zinc-500 mt-0.5">{p.strategi}</div>}</div>)}
        </div>
        <div className="mt-3">
          <div className="text-xs font-medium text-zinc-700">MONEV</div>
          <textarea value={rkjm.bab6_monev} onChange={(e) => setRkjm({ ...rkjm, bab6_monev: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
        </div>
        <div className="mt-2 flex gap-2">
          <Button size="sm" onClick={() => save(rkjm)}>Simpan</Button>
          <Link href="/rkt" className="h-8 px-4 inline-flex items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka RKT</Link>
        </div>
      </Card>

      <ScanUpload label="Scan pengesahan RKJM" currentName={rkjm.scanName} currentDataUrl={rkjm.scanDataUrl} onChange={(n,d)=>save({...rkjm, scanName:n, scanDataUrl:d, status: rkjm.status==="Sah"?"Sah": rkjm.status==="Siap Cetak"?"Menunggu Scan": rkjm.status },"Scan tersimpan")} onClear={()=>save({...rkjm, scanName:null, scanDataUrl:null},"Scan dihapus")} />
    </div>
  );
}
