"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, Kicker, LoadingBlock } from "@/components/ui";
import { DocActions } from "@/components/DocActions";
import { ScanUpload } from "@/components/ScanUpload";
import { exportToExcel, openPrintWindow, docHtml, tableHtml } from "@/lib/export";
import { db, uid, nowISO } from "@/lib/db";
import { useRapor } from "@/lib/useRapor";
import { PageHead } from "@/components/PageHead";
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

  const { dataset } = useRapor();

  if (loading || !rkjm) return <LoadingBlock label="Memuat RKJM…" />;
  const indikatorOpts = dataset.indikator_level1.map((x) => ({ kode: x.kode, nama: x.nama }));

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
        <PageHead title="Visi, Misi, dan Sasaran" kicker="Rencana Jangka Menengah — RKJM" />
        <Link href="/rkt" className="min-h-[44px] px-5 inline-flex items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka RKT</Link>
      </div>

      {saveMsg && <div role="status" aria-live="polite" className="rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-2 text-xs">{saveMsg}</div>}
      <DocActions status={rkjm.status} onSiapCetak={() => save({ ...rkjm, status: "Siap Cetak" }, "Siap Cetak — isi terkunci.")} onSah={() => save({ ...rkjm, status: "Sah" }, "Sah — arsip permanen")} onArsipkan={() => save({ ...rkjm, status: "Diarsipkan" }, "Diarsipkan")} onBatalkan={() => { if (!confirm("Batalkan Siap Cetak? Isi bisa diubah lagi.")) return; save({ ...rkjm, status: "Draft" }, "Kembali ke Draft — isi bisa diubah."); }} onExportExcel={doExportExcel} onCetak={doCetak} disableSah={!rkjm.scanDataUrl} sahHint={!rkjm.scanDataUrl ? "Upload scan dulu" : undefined} />

      {rkjm.status !== "Draft" && (
        <div role="note" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-4 text-amber-800">Terkunci — isi tidak bisa diubah. Klik <strong>Batalkan</strong> untuk mengubah lagi.</div>
      )}

      <Card className="p-4 space-y-3">
        <div className="flex gap-2 items-center"><Badge tone="hijau">Periode {PERIODE}</Badge><Badge>{rkjm.status}</Badge></div>
        <label className="block">
          <span className="text-xs font-medium text-zinc-700">Visi</span>
          <textarea value={rkjm.visi} onChange={(e) => setRkjm({ ...rkjm, visi: e.target.value })} rows={2} disabled={rkjm.status !== "Draft"} className="mt-1 w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm disabled:bg-[#f8f7ff] disabled:text-zinc-500" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-700">Misi — satu per baris</span>
          <textarea value={rkjm.misi.join("\n")} onChange={(e) => setRkjm({ ...rkjm, misi: e.target.value.split("\n") })} rows={3} disabled={rkjm.status !== "Draft"} className="mt-1 w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm disabled:bg-[#f8f7ff] disabled:text-zinc-500" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-zinc-700">Tujuan</span>
          <input value={rkjm.tujuan} onChange={(e) => setRkjm({ ...rkjm, tujuan: e.target.value })} disabled={rkjm.status !== "Draft"} className="mt-1 w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm disabled:bg-[#f8f7ff] disabled:text-zinc-500" />
        </label>
        {rkjm.status === "Draft" && <Button size="sm" onClick={() => save(rkjm)}>Simpan</Button>}
      </Card>

      <Card className="p-4">
        <Kicker>Sasaran · {rkjm.sasaran.length}</Kicker>
        {rkjm.status === "Draft" && (
        <details className="mt-2 rounded-2xl border border-[#ece9f5] bg-[#f8f7ff]">
          <summary className="min-h-[44px] flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-600 cursor-pointer list-none">Tambah sasaran<span aria-hidden="true" className="text-zinc-400">+</span></summary>
          <div className="grid gap-2 p-3 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="block"><span className="sr-only">Judul sasaran</span><input value={sasaranForm.judul} onChange={(e) => setSasaranForm({ ...sasaranForm, judul: e.target.value })} placeholder="Judul sasaran" aria-label="Judul sasaran" className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" /></label>
            <label className="block"><span className="sr-only">Indikator Rapor</span><select value={sasaranForm.indikator} onChange={(e) => setSasaranForm({ ...sasaranForm, indikator: e.target.value })} aria-label="Indikator Rapor" className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm">
              {indikatorOpts.map((o) => <option key={o.kode} value={o.kode}>{o.kode} — {o.nama.slice(0, 40)}</option>)}
            </select></label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="block"><span className="sr-only">Target 2030</span><input value={sasaranForm.target2030} onChange={(e) => setSasaranForm({ ...sasaranForm, target2030: e.target.value })} placeholder="Target 2030" aria-label="Target 2030" className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" /></label>
            <label className="block"><span className="sr-only">Penanggung jawab</span><input value={sasaranForm.pj} onChange={(e) => setSasaranForm({ ...sasaranForm, pj: e.target.value })} placeholder="Penanggung jawab" aria-label="Penanggung jawab" className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" /></label>
            <Button size="sm" onClick={addSasaran}>Tambah</Button>
          </div>
          </div>
        </details>
        )}
        <div className="mt-2 space-y-1.5">
          {rkjm.sasaran.length === 0 && <div className="text-xs text-zinc-500 py-3 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada — tambah sasaran.</div>}
          {rkjm.sasaran.map((s) => (
            <div key={s.id} className="flex gap-2 items-center rounded-xl border border-[#ece9f5] bg-white px-3 py-2">
              <span className="font-mono text-xs font-medium">{s.kode}</span>
              <span className="text-xs flex-1 truncate">{s.judul} <Badge className="ml-1">{s.indikator_rapor_kode}</Badge></span>
              <span className="text-xs text-zinc-500 hidden sm:inline">{s.target["2029/2030"]} · {s.penanggung_jawab}</span>
              {rkjm.status === "Draft" && <Button variant="ghost" size="sm" onClick={() => { if (!confirm(`Hapus sasaran "${s.judul.slice(0, 40)}"?`)) return; removeSasaran(s.id); }}>Hapus</Button>}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <Kicker>Program dan Peta Jalan · {rkjm.program.length}</Kicker>
        {rkjm.status === "Draft" && (
        <details className="mt-2 rounded-2xl border border-[#ece9f5] bg-[#f8f7ff]">
          <summary className="min-h-[44px] flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-600 cursor-pointer list-none">Tambah program<span aria-hidden="true" className="text-zinc-400">+</span></summary>
          <div className="grid gap-2 p-3 pt-0">
          <label className="block"><span className="sr-only">Nama program</span><input value={programForm.nama} onChange={(e) => setProgramForm({ ...programForm, nama: e.target.value })} placeholder="Nama program" aria-label="Nama program" className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" /></label>
          <label className="block"><span className="sr-only">Strategi</span><textarea value={programForm.strategi} onChange={(e) => setProgramForm({ ...programForm, strategi: e.target.value })} placeholder="Strategi — 1 kalimat" aria-label="Strategi" rows={2} className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" /></label>
          <Button size="sm" className="self-start" onClick={addProgram}>Tambah program</Button>
          </div>
        </details>
        )}
        <div className="mt-2 space-y-1.5">
          {rkjm.program.length === 0 && <div className="text-xs text-zinc-500 py-2 text-center border border-dashed border-[#ece9f5] rounded-xl">Belum ada program.</div>}
          {rkjm.program.map((p) => <div key={p.id} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 flex gap-2 items-center"><div className="flex-1 min-w-0"><div className="text-xs font-medium">{p.nama}</div>{p.strategi && <div className="text-xs text-zinc-500 mt-0.5">{p.strategi}</div>}</div>{rkjm.status === "Draft" && <Button variant="ghost" size="sm" onClick={() => { if (!confirm(`Hapus program "${p.nama.slice(0, 40)}"?`)) return; save({ ...rkjm, program: rkjm.program.filter((x) => x.id !== p.id) }, "Dihapus."); }}>Hapus</Button>}</div>)}
        </div>
        <label className="block mt-3">
          <span className="text-xs font-medium text-zinc-700">MONEV</span>
          <textarea value={rkjm.bab6_monev} onChange={(e) => setRkjm({ ...rkjm, bab6_monev: e.target.value })} rows={2} disabled={rkjm.status !== "Draft"} className="mt-1 w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm disabled:bg-[#f8f7ff] disabled:text-zinc-500" />
        </label>
        <div className="mt-2 flex gap-2">
          {rkjm.status === "Draft" && <Button size="sm" onClick={() => save(rkjm)}>Simpan</Button>}
          <Link href="/rkt" className="min-h-[44px] px-5 inline-flex items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka RKT</Link>
        </div>
      </Card>

      {rkjm.status === "Draft" && <ScanUpload label="Scan pengesahan RKJM" currentName={rkjm.scanName} currentDataUrl={rkjm.scanDataUrl} onChange={(n,d)=>save({...rkjm, scanName:n, scanDataUrl:d, status: rkjm.status==="Sah"?"Sah": rkjm.status==="Siap Cetak"?"Menunggu Scan": rkjm.status },"Scan tersimpan")} onClear={()=>save({...rkjm, scanName:null, scanDataUrl:null},"Scan dihapus")} />}
    </div>
  );
}
