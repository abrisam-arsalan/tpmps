"use client";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Kicker } from "@/components/ui";
import { DocActions } from "@/components/DocActions";
import { ScanUpload } from "@/components/ScanUpload";
import { exportToExcel, openPrintWindow, docHtml, tableHtml } from "@/lib/export";
import { db, uid, nowISO } from "@/lib/db";
import { raporSeed } from "@/lib/rapor";
import type { RKJM, RKT, RKTKegiatan } from "@/lib/types";
import { RKT_MAX } from "@/lib/types";
import Link from "next/link";

const TAHUN_OPSI = ["2026/2027", "2027/2028", "2028/2029", "2029/2030"];

export default function RKTPage() {
  const [rkjm, setRkjm] = useState<RKJM | null>(null);
  const [tahun, setTahun] = useState<string>("2026/2027");
  const [rkt, setRkt] = useState<RKT | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState<{ identifikasi: string; akar: string; benahi: string; penjelasan: string; biaya: "Ya" | "Tidak"; sasaran: string }>({
    identifikasi: "A.2", akar: "A.2.4", benahi: "", penjelasan: "", biaya: "Ya", sasaran: "",
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const found = await db.rkjm.where("periode").equals("2026-2030").first();
        if (!alive) return;
        if (found) { setRkjm(found as unknown as RKJM); setForm((f) => ({ ...f, sasaran: (found as unknown as RKJM).sasaran[0]?.id ?? "" })); }
      } catch {}
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true; if (!rkjm) return;
    (async () => {
      try {
        const existing = await db.rkt.where("tahun_ajaran").equals(tahun).first();
        if (!alive) return;
        if (existing) setRkt(existing as unknown as RKT);
        else {
          const fresh: RKT = { id: uid("rkt"), tahun_ajaran: tahun, rkjm_id: rkjm.id, evaluasi_lalu: "", kegiatan: [], status: "Draft", createdAt: nowISO(), updatedAt: nowISO() };
          setRkt(fresh);
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, [rkjm, tahun]);

  const prioritasDefault = useMemo(() => raporSeed.prioritas_pbd_2025.daftar, []);
  const indikatorOpts = useMemo(() => raporSeed.indikator_level1.map((x) => ({ kode: x.kode, nama: x.nama })), []);

  async function persist(next: RKT, m = "Tersimpan.") {
    await db.rkt.put({ ...next, updatedAt: nowISO() } as unknown as RKT);
    setRkt(next); setMsg(m); setTimeout(() => setMsg(null), 2200);
  }
  function addKegiatan() {
    if (!rkt) return;
    if (rkt.kegiatan.length >= RKT_MAX) { setMsg(`Maksimal ${RKT_MAX} per tahun`); setTimeout(() => setMsg(null), 3000); return; }
    if (!form.benahi.trim()) { setMsg("Isi Kegiatan dulu."); setTimeout(() => setMsg(null), 2200); return; }
    const k: RKTKegiatan = { id: uid("keg"), no: rkt.kegiatan.length + 1, identifikasi_kode: form.identifikasi, akar_kode: form.akar || null, kegiatan_benahi: form.benahi.trim(), penjelasan: form.penjelasan.trim(), biaya: form.biaya, sasaran_rkjm_id: form.sasaran || null };
    persist({ ...rkt, kegiatan: [...rkt.kegiatan, k] }, `Prioritas #${k.no} ditambahkan`);
    setForm((f) => ({ ...f, benahi: "", penjelasan: "" }));
  }
  function removeKegiatan(id: string) {
    if (!rkt) return;
    const next = rkt.kegiatan.filter((x) => x.id !== id).map((x, i) => ({ ...x, no: i + 1 }));
    persist({ ...rkt, kegiatan: next }, "Dihapus");
  }
  function fillFromPrioritas(no: number) {
    const p = prioritasDefault.find((x) => x.no === no); if (!p) return;
    setForm({ identifikasi: p.identifikasi_kode, akar: p.akar_lv2_kode ?? p.akar_lv1_kode ?? "", benahi: p.kegiatan_benahi ? p.kegiatan_benahi.slice(0, 130) : "", penjelasan: p.kegiatan_arkas ? p.kegiatan_arkas.slice(0, 180) : "", biaya: "Ya", sasaran: form.sasaran });
  }
  async function doExportExcel() {
    if (!rkt) return;
    await exportToExcel([{ name: "RKT", header: ["No", "Kode", "Akar", "Kegiatan", "Penjelasan", "Biaya"], rows: rkt.kegiatan.map((k) => [String(k.no), k.identifikasi_kode, k.akar_kode ?? "", k.kegiatan_benahi, k.penjelasan, k.biaya]) }], `RKT-${tahun.replace("/", "-")}-SMPN5.xlsx`);
  }
  function doCetak() {
    if (!rkt || !rkjm) return;
    openPrintWindow(docHtml({
      title: `RKT ${tahun} — SMP Negeri 5 Tegal`, subtitle: `Status ${rkt.status}`,
      meta: [["Tahun", tahun], ["Prioritas", `${rkt.kegiatan.length}/12`], ["Butuh Anggaran", String(rkt.kegiatan.filter((x) => x.biaya === "Ya").length)], ["Status", rkt.status]],
      sections: [{ heading: "Evaluasi Tahun Lalu", html: `<p style="font-size:13px;white-space:pre-wrap">${(rkt.evaluasi_lalu || "—").replace(/</g, "&lt;")}</p>` }, { heading: "Daftar Prioritas", html: tableHtml(["No", "Kode", "Akar", "Kegiatan", "Biaya"], rkt.kegiatan.map((k) => [String(k.no), k.identifikasi_kode, k.akar_kode ?? "—", k.kegiatan_benahi, k.biaya])) }],
    }), `RKT ${tahun}`);
  }

  if (loading) return <div className="py-12 text-center text-sm text-zinc-500">Memuat…</div>;
  if (!rkjm) {
    return (
      <div className="space-y-4">
        <Kicker>Rencana Tahunan</Kicker>
        <h2 className="text-[17px] font-semibold">Buat RKJM dulu</h2>
        <Card className="p-6 text-center"><p className="text-sm text-zinc-600">RKJM belum ada</p><Link href="/rkjm" className="mt-4 inline-flex h-9 px-4 items-center justify-center rounded-xl bg-[#2b5cff] text-white text-sm">Buka RKJM</Link></Card>
      </div>
    );
  }
  if (!rkt) return <div className="py-12 text-center text-sm text-zinc-500">Memuat…</div>;

  const biayaYa = rkt.kegiatan.filter((x) => x.biaya === "Ya").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <div>
          <Kicker>Rencana Tahunan</Kicker>
          <h2 className="text-[17px] font-semibold tracking-tight mt-1">Tahun {tahun} — {rkt.kegiatan.length}/{RKT_MAX}</h2>
        </div>
        <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="h-9 rounded-xl border border-[#ece9f5] bg-white px-3 text-sm">
          {TAHUN_OPSI.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {msg && <div className={`rounded-xl border px-3 py-2 text-sm ${msg.includes("Maksimal") ? "bg-amber-50 border-amber-100 text-amber-800" : "bg-emerald-50 border-emerald-100 text-emerald-800"}`}>{msg}</div>}
      <DocActions status={rkt.status} onSiapCetak={() => persist({ ...rkt, status: "Siap Cetak" }, "Siap Cetak")} onSah={() => persist({ ...rkt, status: "Sah" }, "Sah — arsip permanen")} onArsipkan={() => persist({ ...rkt, status: "Diarsipkan" }, "Diarsipkan")} onExportExcel={doExportExcel} onCetak={doCetak} disableSah={!rkt.scanDataUrl} sahHint={!rkt.scanDataUrl ? "Upload scan dulu" : undefined} />

      <div className="flex flex-wrap gap-2 items-center text-sm rounded-2xl border border-[#ece9f5] bg-white p-3">
        <Badge tone={rkt.kegiatan.length >= RKT_MAX ? "merah" : rkt.kegiatan.length >= 10 ? "kuning" : "hijau"}>{rkt.kegiatan.length}/{RKT_MAX}</Badge>
        <span className="text-zinc-600">Butuh anggaran <strong className="text-zinc-900">{biayaYa}</strong> · Tanpa biaya: {rkt.kegiatan.length - biayaYa}</span>
        <span className="ml-auto text-xs text-zinc-400">{rkjm.sasaran.length} sasaran RKJM</span>
      </div>

      <Card className="p-4 space-y-3">
        <Kicker>Evaluasi tahun lalu</Kicker>
        <textarea value={rkt.evaluasi_lalu} onChange={(e) => setRkt({ ...rkt, evaluasi_lalu: e.target.value })} rows={2} placeholder="Capaian tahun lalu, kendala, tindak lanjut" className="w-full rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
        <Button size="sm" onClick={() => persist(rkt, "Evaluasi tersimpan")}>Simpan evaluasi</Button>
      </Card>

      <Card className="p-4">
        <Kicker>Tambah prioritas</Kicker>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-xs text-zinc-400 self-center mr-1">1-klik dari 12 prioritas:</span>
          {prioritasDefault.map((p) => (
            <button key={p.no} onClick={() => fillFromPrioritas(p.no)} className="rounded-full border border-[#ece9f5] bg-white px-2.5 py-1 text-xs hover:bg-[#f8f7ff]">#{p.no} {p.identifikasi_kode}</button>
          ))}
        </div>
        <div className="mt-3 grid gap-2.5 rounded-2xl border border-[#ece9f5] bg-[#f8f7ff] p-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select value={form.identifikasi} onChange={(e) => setForm({ ...form, identifikasi: e.target.value })} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm">
              {useMemo(() => raporSeed.indikator_level1.map((x) => ({ kode: x.kode, nama: x.nama })), []).map((o) => <option key={o.kode} value={o.kode}>{o.kode} — {o.nama.slice(0, 36)}</option>)}
            </select>
            <input value={form.akar} onChange={(e) => setForm({ ...form, akar: e.target.value })} placeholder="Akar" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
            <select value={form.sasaran} onChange={(e) => setForm({ ...form, sasaran: e.target.value })} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm">
              <option value="">Taut sasaran RKJM</option>
              {rkjm.sasaran.map((s) => <option key={s.id} value={s.id}>{s.kode}: {s.judul.slice(0, 40)}</option>)}
            </select>
          </div>
          <input value={form.benahi} onChange={(e) => setForm({ ...form, benahi: e.target.value })} placeholder="Kegiatan — 1 kalimat" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <textarea value={form.penjelasan} onChange={(e) => setForm({ ...form, penjelasan: e.target.value })} placeholder="Penjelasan — rincian singkat" rows={2} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <div className="flex gap-2 items-center flex-wrap">
            <select value={form.biaya} onChange={(e) => setForm({ ...form, biaya: e.target.value as "Ya" | "Tidak" })} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm">
              <option value="Ya">Butuh anggaran</option>
              <option value="Tidak">Tanpa biaya</option>
            </select>
            <Button onClick={addKegiatan} disabled={rkt.kegiatan.length >= RKT_MAX}>Tambah</Button>
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-4">
        <Kicker>Daftar prioritas — {tahun}</Kicker>
        <div className="mt-2 overflow-x-auto rounded-xl border border-[#ece9f5]">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f7ff] text-zinc-600">
              <tr><th className="text-left px-2 py-2 font-semibold">No</th><th className="text-left px-2 py-2 font-semibold">Kode</th><th className="text-left px-2 py-2 font-semibold">Akar</th><th className="text-left px-2 py-2 font-semibold">Kegiatan</th><th className="text-left px-2 py-2 font-semibold">Biaya</th><th className="px-2 py-2"></th></tr>
            </thead>
            <tbody>
              {rkt.kegiatan.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-sm text-zinc-400">Belum ada — klik #1 sampai #12 di atas</td></tr>}
              {rkt.kegiatan.map((k) => (
                <tr key={k.id} className="border-t border-[#f0ebe0]">
                  <td className="px-2 py-2 font-mono text-xs">{k.no}</td>
                  <td className="px-2 py-2 font-mono text-xs">{k.identifikasi_kode}</td>
                  <td className="px-2 py-2 font-mono text-xs">{k.akar_kode ?? "—"}</td>
                  <td className="px-2 py-2 text-xs max-w-[260px] leading-4">{k.kegiatan_benahi}</td>
                  <td className="px-2 py-2"><Badge tone={k.biaya === "Ya" ? "hijau" : "netral"}>{k.biaya === "Ya" ? "Ya" : "Tidak"}</Badge></td>
                  <td className="px-2 py-2"><Button variant="ghost" size="sm" onClick={() => removeKegiatan(k.id)}>Hapus</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => persist(rkt, "Tersimpan")}>Simpan</Button>
          <Link href="/rkas" className="h-8 px-4 inline-flex items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka Anggaran</Link>
          <Link href="/ksp" className="h-8 px-4 inline-flex items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka Kurikulum</Link>
        </div>
      </Card>
      <ScanUpload label="Scan pengesahan" currentName={rkt.scanName} currentDataUrl={rkt.scanDataUrl} onChange={(n,d)=>persist({...rkt, scanName:n, scanDataUrl:d, status: rkt.status==="Sah"?"Sah": rkt.status==="Siap Cetak"?"Menunggu Scan": rkt.status },"Scan tersimpan")} onClear={()=>persist({...rkt, scanName:null, scanDataUrl:null},"Scan dihapus")} />
    </div>
  );
}
