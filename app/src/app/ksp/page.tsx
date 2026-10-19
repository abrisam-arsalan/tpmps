"use client";
import { useEffect, useState } from "react";
import { db, uid, nowISO } from "@/lib/db";
import { Badge, Button, Card, Kicker } from "@/components/ui";
import { DocActions } from "@/components/DocActions";
import { ScanUpload } from "@/components/ScanUpload";
import { exportToExcel, openPrintWindow, docHtml, tableHtml } from "@/lib/export";
import { CP_SEED, cpBadgeSumber } from "@/lib/ksp";
import type { KSP, KSPKomponen, RKJM, RKT } from "@/lib/types";
import Link from "next/link";

const TA = ["2026/2027", "2027/2028", "2028/2029", "2029/2030"] as const;
function emptyKomponen(rkjm: RKJM | null): KSPKomponen {
  return {
    karakteristik: rkjm ? `Konteks RKJM ${rkjm.periode} — Visi: ${rkjm.visi.slice(0, 70)}…` : "",
    visi: rkjm?.visi ?? "", misi: rkjm?.misi ?? [],
    pengorganisasian: "Fase D: JP per minggu · Koding dan KA kelas 7 · Kokurikuler dan Projek · Kepanduan wajib",
    rencana_pembelajaran: "Pembelajaran mendalam — asesmen formatif dan sumatif, ANBK.",
    pendampingan: "Monev KSP — refleksi GTK, komunitas belajar, tindak lanjut evaluasi RKT.",
  };
}

export default function KSPPage() {
  const [tahun, setTahun] = useState<string>("2026/2027");
  const [rkjm, setRkjm] = useState<RKJM | null>(null);
  const [rkt, setRkt] = useState<RKT | null>(null);
  const [ksp, setKsp] = useState<KSP | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [cpForm, setCpForm] = useState({ mapel: "Matematika", cp: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const j = await db.rkjm.where("periode").equals("2026-2030").first();
        const t = await db.rkt.where("tahun_ajaran").equals(tahun).first();
        const k = await db.ksp.where("tahun_ajaran").equals(tahun).first();
        if (!alive) return;
        if (j) setRkjm(j as unknown as RKJM);
        setRkt((t as unknown as RKT) ?? null);
        if (k) setKsp(k as unknown as KSP);
        else if (j) setKsp({ id: uid("ksp"), tahun_ajaran: tahun, rkjm_id: (j as unknown as RKJM).id, rkt_id: (t as unknown as RKT)?.id ?? null, komponen: emptyKomponen(j as unknown as RKJM), cp: [...CP_SEED], rkt_kegiatan_ids: [], status: "Draft", createdAt: nowISO(), updatedAt: nowISO() } as KSP);
      } catch {}
    })();
    return () => { alive = false; };
  }, [tahun]);

  async function persist(next: KSP, m = "Tersimpan.") {
    const upd = { ...next, updatedAt: nowISO(), rkt_id: rkt?.id ?? next.rkt_id } as KSP;
    await db.ksp.put(upd); setKsp(upd); setMsg(m); setTimeout(() => setMsg(null), 2200);
  }
  const showBanner = tahun >= "2026/2027";
  async function doExportExcel() {
    if (!ksp) return;
    await exportToExcel([
      { name: "KSP", header: ["Komponen", "Isi"], rows: [["1 Karakteristik", ksp.komponen.karakteristik], ["2 Visi dan Misi", `${ksp.komponen.visi}\n${ksp.komponen.misi.join("\n")}`], ["3 Pengorganisasian", ksp.komponen.pengorganisasian], ["4 Rencana", ksp.komponen.rencana_pembelajaran], ["5 Pendampingan", ksp.komponen.pendampingan]] },
      { name: "CP Fase D", header: ["Mapel", "CP", "Sumber"], rows: ksp.cp.map((c) => [c.mapel, c.cp_teks, c.sumber]) },
    ], `KSP-${tahun.replace("/", "-")}-SMPN5.xlsx`);
  }
  function doCetak() {
    if (!ksp) return;
    openPrintWindow(docHtml({
      title: `KSP ${tahun} — SMP Negeri 5 Tegal (Fase D)`, subtitle: `5 Komponen · Status ${ksp.status}`,
      meta: [["Tahun", tahun], ["RKT", rkt ? `${rkt.kegiatan.length}/12` : "—"], ["CP", String(ksp.cp.length)], ["Taut RKT", ksp.rkt_kegiatan_ids.length ? String(ksp.rkt_kegiatan_ids.length) : "—"]],
      sections: [
        { heading: "1 — Karakteristik", html: `<p style="font-size:13px">${ksp.komponen.karakteristik || "—"}</p>` },
        { heading: "2 — Visi dan Misi", html: `<p style="font-size:13px"><b>${ksp.komponen.visi}</b></p><ul style="font-size:13px">${ksp.komponen.misi.map((m) => `<li>${m}</li>`).join("")}</ul>` },
        { heading: "3 — Pengorganisasian (Fase D, Koding dan KA, Kepanduan)", html: `<p style="font-size:13px;white-space:pre-wrap">${ksp.komponen.pengorganisasian}</p>` },
        { heading: "4 — Rencana Pembelajaran", html: `<p style="font-size:13px;white-space:pre-wrap">${ksp.komponen.rencana_pembelajaran}</p>` },
        { heading: "5 — Pendampingan", html: `<p style="font-size:13px;white-space:pre-wrap">${ksp.komponen.pendampingan}</p>` },
        { heading: "Bank CP Fase D", html: tableHtml(["Mapel", "CP", "Sumber"], ksp.cp.map((c) => [c.mapel, c.cp_teks.slice(0, 100), c.sumber])) },
      ],
    }), `KSP ${tahun}`);
  }
  if (!ksp) return <div className="py-10 text-center text-sm text-zinc-500">Memuat KSP…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <div>
          <Kicker>Kurikulum</Kicker>
          <h2 className="text-[17px] font-semibold tracking-tight mt-1">Tahun {tahun}</h2>
        </div>
        <div className="flex gap-2">
          <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="h-9 rounded-xl border border-[#ece9f5] bg-white px-3 text-sm">
            {TA.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={() => setShowInfo((v) => !v)} className="h-9 w-9 grid place-items-center rounded-full border border-[#ece9f5] bg-white text-xs" aria-label="Info">?</button>
        </div>
      </div>
      {showInfo && <div className="rounded-xl border border-[#ece9f5] bg-[#f8f7ff] px-3 py-2.5 text-xs leading-4 text-zinc-600">Visi dan Misi mengikuti RKJM. Koding kelas 7 opsional, Kepanduan wajib.</div>}
      {showBanner && !showInfo && <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">CP Agama diperbarui — cek Bank CP di bawah.</div>}
      {msg && <div className="rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-2 text-xs">{msg}</div>}
      <DocActions status={ksp.status} onSiapCetak={() => persist({ ...ksp, status: "Siap Cetak" }, "Siap Cetak")} onSah={() => persist({ ...ksp, status: "Sah" }, "Sah — arsip permanen")} onArsipkan={() => persist({ ...ksp, status: "Diarsipkan" }, "Diarsipkan")} onExportExcel={doExportExcel} onCetak={doCetak} disableSah={!ksp.scanDataUrl} sahHint={!ksp.scanDataUrl ? "Upload scan dulu" : undefined} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="p-3 space-y-2">
          <Kicker>1 — Karakteristik</Kicker>
          <textarea value={ksp.komponen.karakteristik} onChange={(e) => setKsp({ ...ksp, komponen: { ...ksp.komponen, karakteristik: e.target.value } })} rows={3} className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <Kicker>2 — Visi dan Misi</Kicker>
          <input value={ksp.komponen.visi} onChange={(e) => setKsp({ ...ksp, komponen: { ...ksp.komponen, visi: e.target.value } })} className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" placeholder="Visi" />
          <textarea value={ksp.komponen.misi.join("\n")} onChange={(e) => setKsp({ ...ksp, komponen: { ...ksp.komponen, misi: e.target.value.split("\n") } })} rows={3} className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" placeholder="Misi per baris" />
          <Button variant="secondary" size="sm" onClick={() => persist(ksp)}>Simpan</Button>
        </Card>
        <Card className="p-3 space-y-2">
          <Kicker>3 — Pengorganisasian</Kicker>
          <textarea value={ksp.komponen.pengorganisasian} onChange={(e) => setKsp({ ...ksp, komponen: { ...ksp.komponen, pengorganisasian: e.target.value } })} rows={4} className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <Kicker>4 — Rencana Pembelajaran</Kicker>
          <textarea value={ksp.komponen.rencana_pembelajaran} onChange={(e) => setKsp({ ...ksp, komponen: { ...ksp.komponen, rencana_pembelajaran: e.target.value } })} rows={2} className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <Kicker>5 — Pendampingan</Kicker>
          <textarea value={ksp.komponen.pendampingan} onChange={(e) => setKsp({ ...ksp, komponen: { ...ksp.komponen, pendampingan: e.target.value } })} rows={2} className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <Button variant="secondary" size="sm" onClick={() => persist(ksp)}>Simpan</Button>
        </Card>
      </div>

      <Card className="p-3">
        <Kicker>Taut ke Rencana</Kicker>
        {!rkt || rkt.kegiatan.length === 0 ? (
          <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">Rencana {tahun} kosong — <Link href="/rkt" className="underline">buat dulu</Link></div>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rkt.kegiatan.map((k) => {
              const on = ksp.rkt_kegiatan_ids.includes(k.id);
              return <button key={k.id} onClick={() => { const ids = on ? ksp.rkt_kegiatan_ids.filter((x) => x !== k.id) : [...ksp.rkt_kegiatan_ids, k.id]; persist({ ...ksp, rkt_kegiatan_ids: ids }, on ? "Dilepas" : "Ditautkan"); }} className={`rounded-full border px-3 py-1 text-xs ${on ? "bg-[#2b5cff] text-white border-[#2b5cff]" : "bg-white border-[#ece9f5] hover:bg-[#f8f7ff]"}`}>#{k.no} {k.identifikasi_kode}</button>;
            })}
          </div>
        )}
      </Card>

      <Card className="p-3">
        <Kicker>Bank CP</Kicker>
        <div className="mt-2 space-y-1.5">
          {ksp.cp.map((c) => {
            const b = cpBadgeSumber(c.sumber);
            return (
              <div key={c.id} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 flex gap-2 items-center">
                <span className="text-xs font-medium">{c.mapel}</span>
                <Badge tone={b.tone}>{b.label}</Badge>
                <span className="text-xs text-zinc-400 hidden sm:inline truncate flex-1">{c.cp_teks.slice(0, 70)}</span>
                <Button variant="ghost" size="sm" onClick={() => { if (!confirm(`Hapus ${c.mapel}?`)) return; persist({ ...ksp, cp: ksp.cp.filter((x) => x.id !== c.id) }, "Dihapus"); }}>Hapus</Button>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={cpForm.mapel} onChange={(e) => setCpForm({ ...cpForm, mapel: e.target.value })} placeholder="Mapel" className="flex-1 rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <input value={cpForm.cp} onChange={(e) => setCpForm({ ...cpForm, cp: e.target.value })} placeholder="Isi CP" className="flex-1 rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <Button size="sm" onClick={() => { if (!cpForm.mapel.trim() || !cpForm.cp.trim()) return; persist({ ...ksp, cp: [...ksp.cp, { id: uid("cp"), mapel: cpForm.mapel.trim(), fase: "D", cp_teks: cpForm.cp.trim(), sumber: showBanner && /agama|budi/i.test(cpForm.mapel) ? "Kep BKPDM 020/2026 (TA 2026/2027 — Agama)" : "Kep BSKAP 046/H/KR/2025", tp: [] }] }, "Ditambahkan"); setCpForm({ mapel: "", cp: "" }); }}>Tambah</Button>
        </div>
      </Card>

      <ScanUpload label="Scan pengesahan Kurikulum" currentName={ksp.scanName} currentDataUrl={ksp.scanDataUrl} onChange={(n, d) => persist({ ...ksp, scanName: n, scanDataUrl: d, status: ksp.status === "Sah" ? "Sah" : ksp.status === "Siap Cetak" ? "Menunggu Scan" : ksp.status }, "Scan tersimpan")} onClear={() => persist({ ...ksp, scanName: null, scanDataUrl: null }, "Scan dihapus")} />
    </div>
  );
}
