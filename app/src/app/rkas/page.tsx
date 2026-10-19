"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { db, uid, nowISO, fmtRp } from "@/lib/db";
import { Button, Card, Kicker } from "@/components/ui";
import { DocActions } from "@/components/DocActions";
import { ScanUpload } from "@/components/ScanUpload";
import { exportToExcel, openPrintWindow, docHtml, tableHtml } from "@/lib/export";
import type { RKAS, RkasBaris, RKT } from "@/lib/types";
import arkasRef from "@/data/arkas-2026-reference.json";

const TAHUN = ["2026/2027", "2027/2028", "2028/2029", "2029/2030"] as const;

export default function RKASPage() {
  const [tahun, setTahun] = useState<string>("2026/2027");
  const [rkt, setRkt] = useState<RKT | null>(null);
  const [rkas, setRkas] = useState<RKAS | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ rktId: "", kegiatanArkas: "", uraian: "", bulan: "Juni", jumlah: "1", satuan: "paket", harga: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const t = await db.rkt.where("tahun_ajaran").equals(tahun).first();
        const k = await db.rkas.where("tahun_ajaran").equals(tahun).first();
        if (!alive) return;
        setRkt((t as unknown as RKT) ?? null);
        if (k) setRkas(k as unknown as RKAS);
        else if (t) setRkas({ id: uid("rkas"), tahun_ajaran: tahun, rkt_id: (t as unknown as RKT).id, pendapatan: [{ sumber: "BOS Reguler", jumlah: 628280000 }], baris: [], status: "Draft", versi: "Murni", createdAt: nowISO(), updatedAt: nowISO() } as RKAS);
        else setRkas(null);
      } catch {}
    })();
    return () => { alive = false; };
  }, [tahun]);

  const biayaYa = useMemo(() => rkt?.kegiatan.filter((x) => x.biaya === "Ya") ?? [], [rkt]);
  const totalBelanja = useMemo(() => rkas?.baris.reduce((a, b) => a + b.total, 0) ?? 0, [rkas]);
  const totalPdpt = useMemo(() => rkas?.pendapatan.reduce((a, b) => a + b.jumlah, 0) ?? 0, [rkas]);

  useEffect(() => {
    if (rkt && biayaYa.length > 0 && !form.rktId) setForm((f) => ({ ...f, rktId: biayaYa[0].id, kegiatanArkas: biayaYa[0].kegiatan_benahi.slice(0, 50) }));
  }, [rkt, biayaYa, form.rktId]);

  async function persist(next: RKAS, m = "Tersimpan.") {
    await db.rkas.put({ ...next, updatedAt: nowISO() } as unknown as RKAS);
    setRkas(next); setMsg(m); setTimeout(() => setMsg(null), 2200);
  }
  function addBaris() {
    if (!rkas) return;
    const jml = parseInt(form.jumlah, 10) || 0; const harga = parseInt(form.harga.replace(/\./g, ""), 10) || 0;
    if (!form.uraian.trim() || jml <= 0 || harga <= 0) { setMsg("Lengkapi uraian, jumlah, harga."); setTimeout(() => setMsg(null), 2200); return; }
    const rk = biayaYa.find((x) => x.id === form.rktId);
    const b: RkasBaris = { id: uid("rkasbaris"), rktKegiatanId: form.rktId, kegiatan_benahi: rk?.kegiatan_benahi ?? "", penjelasan: rk?.penjelasan ?? "", kegiatan_arkas: form.kegiatanArkas.trim() || rk?.kegiatan_benahi.slice(0, 50) || "", uraian_kegiatan: form.uraian.trim(), bulan: form.bulan, jumlah: jml, satuan: form.satuan, harga_satuan: harga, total: jml * harga };
    persist({ ...rkas, baris: [...rkas.baris, b] }, `Ditambahkan — ${fmtRp(b.total)}`);
    setForm((f) => ({ ...f, uraian: "", jumlah: "1", harga: "" }));
  }
  function removeBaris(id: string) { if (!rkas) return; persist({ ...rkas, baris: rkas.baris.filter((x) => x.id !== id) }, "Dihapus."); }
  async function doExportExcel() {
    if (!rkas || !rkt) return;
    await exportToExcel([
      { name: "RKAS", header: ["No", "Kegiatan Benahi", "Penjelasan", "Kegiatan ARKAS", "Uraian", "Bulan", "Jumlah", "Satuan", "Harga", "Total"], rows: rkas.baris.map((b, i) => [String(i + 1), b.kegiatan_benahi, b.penjelasan, b.kegiatan_arkas, b.uraian_kegiatan, b.bulan, b.jumlah, b.satuan, b.harga_satuan, b.total]) },
      { name: "Pendapatan", header: ["Sumber", "Jumlah"], rows: rkas.pendapatan.map((p) => [p.sumber, p.jumlah]) },
    ], `RKAS-${tahun.replace("/", "-")}-SMPN5.xlsx`);
  }
  function doCetak() {
    if (!rkas || !rkt) return;
    openPrintWindow(docHtml({
      title: `RKAS ${tahun} — SMP Negeri 5 Tegal`, subtitle: `${rkas.versi} · ${rkas.status}`,
      meta: [["Tahun", tahun], ["RKT", `${rkt.kegiatan.length}/12`], ["Belanja", fmtRp(totalBelanja)], ["Pendapatan", fmtRp(totalPdpt)], ["Selisih", fmtRp(totalPdpt - totalBelanja)]],
      sections: [
        { heading: "RKAS", html: tableHtml(["No", "Kegiatan ARKAS", "Uraian", "Bulan", "Jumlah", "Satuan", "Harga", "Total"], rkas.baris.map((b, i) => [String(i + 1), b.kegiatan_arkas, b.uraian_kegiatan, b.bulan, String(b.jumlah), b.satuan, fmtRp(b.harga_satuan), fmtRp(b.total)])) },
        { heading: "Pendapatan", html: tableHtml(["Sumber", "Jumlah"], rkas.pendapatan.map((p) => [p.sumber, fmtRp(p.jumlah)])) },
      ],
    }), `RKAS ${tahun}`);
  }

  if (!rkt) {
    return (
      <div className="space-y-3">
        <Kicker>Anggaran</Kicker>
        <h2 className="text-[17px] font-semibold">Buat Rencana Tahunan dulu</h2>
        <Card className="p-6 text-center"><p className="text-sm text-zinc-600">Belum ada Rencana Tahunan {tahun}.</p><Link href="/rkt" className="mt-3 inline-flex h-9 px-4 items-center justify-center rounded-xl bg-[#2b5cff] text-white text-sm font-medium">Buka Rencana Tahunan</Link></Card>
      </div>
    );
  }
  if (!rkas) return <div className="py-10 text-center text-sm text-zinc-500">Memuat RKAS…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <div>
          <Kicker>Anggaran</Kicker>
          <h2 className="text-[17px] font-semibold tracking-tight mt-1">Tahun {tahun}</h2>
        </div>
        <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="h-9 rounded-xl border border-[#ece9f5] bg-white px-3 text-sm">
          {TAHUN.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {msg && <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-xs">{msg}</div>}
      <DocActions status={rkas.status} onSiapCetak={() => persist({ ...rkas, status: "Siap Cetak" }, "Siap Cetak")} onSah={() => persist({ ...rkas, status: "Sah" }, "Sah — arsip permanen")} onArsipkan={() => persist({ ...rkas, status: "Diarsipkan" }, "Diarsipkan")} onExportExcel={doExportExcel} onCetak={doCetak} disableSah={!rkas.scanDataUrl} sahHint={!rkas.scanDataUrl ? "Upload scan dulu" : undefined} />

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center"><div className="text-xs text-zinc-400">Belanja</div><div className="font-semibold text-sm mt-0.5">{fmtRp(totalBelanja)}</div></Card>
        <Card className="p-3 text-center"><div className="text-xs text-zinc-400">Pendapatan</div><div className="font-semibold text-sm mt-0.5">{fmtRp(totalPdpt)}</div></Card>
        <Card className={`p-3 text-center border ${totalPdpt - totalBelanja === 0 ? "bg-emerald-50 border-emerald-200" : totalPdpt - totalBelanja > 0 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
          <div className="text-xs text-zinc-500">Selisih</div><div className="font-semibold text-sm mt-0.5">{fmtRp(totalPdpt - totalBelanja)}</div>
        </Card>
      </div>

      <Card className="p-3">
        <Kicker>Pendapatan</Kicker>
        <div className="mt-2 space-y-1.5">
          {rkas.pendapatan.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input value={p.sumber} onChange={(e) => { const v = [...rkas.pendapatan]; v[i] = { ...v[i], sumber: e.target.value }; persist({ ...rkas, pendapatan: v }, ""); }} className="flex-1 rounded-xl border border-[#ece9f5] bg-white px-2.5 py-1.5 text-sm" placeholder="Sumber" />
              <input value={String(p.jumlah)} onChange={(e) => { const n = parseInt(e.target.value.replace(/\./g, ""), 10) || 0; const v = [...rkas.pendapatan]; v[i] = { ...v[i], jumlah: n }; setRkas({ ...rkas, pendapatan: v }); }} onBlur={() => persist(rkas)} className="w-28 rounded-xl border border-[#ece9f5] bg-white px-2.5 py-1.5 text-sm text-right" placeholder="Rp" />
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => persist({ ...rkas, pendapatan: [...rkas.pendapatan, { sumber: "BOSDA", jumlah: 0 }] })}>Tambah sumber</Button>
        </div>
      </Card>

      <Card className="p-3">
        <Kicker>Tambah belanja</Kicker>
        <div className="mt-2 grid gap-2 rounded-2xl border border-[#ece9f5] bg-[#fbfaf7] p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select value={form.rktId} onChange={(e) => { const rk = biayaYa.find((x) => x.id === e.target.value); setForm({ ...form, rktId: e.target.value, kegiatanArkas: rk ? rk.kegiatan_benahi.slice(0, 50) : form.kegiatanArkas }); }} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm">
              {biayaYa.map((k) => <option key={k.id} value={k.id}>#{k.no} {k.identifikasi_kode} — {k.kegiatan_benahi.slice(0, 32)}</option>)}
              {biayaYa.length === 0 && <option value="">Tidak ada yang butuh anggaran</option>}
            </select>
            <input value={form.kegiatanArkas} onChange={(e) => setForm({ ...form, kegiatanArkas: e.target.value })} placeholder="Kegiatan ARKAS" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          </div>
          <input value={form.uraian} onChange={(e) => setForm({ ...form, uraian: e.target.value })} placeholder="Uraian — barang/jasa" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <select value={form.bulan} onChange={(e) => setForm({ ...form, bulan: e.target.value })} className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm">
              {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember", "TW1", "TW2", "TW3", "TW4"].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} placeholder="Jumlah" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
            <input value={form.satuan} onChange={(e) => setForm({ ...form, satuan: e.target.value })} placeholder="Satuan" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
            <input value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} placeholder="Harga Rp" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2 text-sm" />
            <Button size="sm" onClick={addBaris} disabled={biayaYa.length === 0}>Tambah</Button>
          </div>
        </div>
      </Card>

      <Card className="p-3 overflow-x-auto">
        <Kicker>Daftar belanja</Kicker>
        <table className="w-full text-sm mt-2 border border-[#ece9f5] rounded-xl overflow-hidden">
          <thead className="bg-[#fbfaf7] text-zinc-600">
            <tr><th className="px-2 py-2 text-left font-semibold">No</th><th className="px-2 py-2 text-left font-semibold">Kegiatan</th><th className="px-2 py-2 text-left font-semibold">Uraian</th><th className="px-2 py-2 font-semibold">Bulan</th><th className="px-2 py-2 text-right font-semibold">Total</th><th></th></tr>
          </thead>
          <tbody>
            {rkas.baris.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-sm text-zinc-400">Belum ada baris</td></tr>}
            {rkas.baris.map((b, i) => (
              <tr key={b.id} className="border-t border-[#f0ebe0]">
                <td className="px-2 py-2 text-xs font-mono">{i + 1}</td>
                <td className="px-2 py-2 text-xs max-w-[160px] truncate">{b.kegiatan_arkas}</td>
                <td className="px-2 py-2 text-xs max-w-[180px]">{b.uraian_kegiatan}</td>
                <td className="px-2 py-2 text-xs text-center">{b.bulan}</td>
                <td className="px-2 py-2 text-right tabular-nums text-xs font-medium">{fmtRp(b.total)}</td>
                <td className="px-2 py-2"><Button variant="ghost" size="sm" onClick={() => removeBaris(b.id)}>Hapus</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 text-right text-sm font-semibold">Grand Total: {fmtRp(totalBelanja)}</div>
      </Card>

      <details className="card-paper rounded-2xl p-3">
        <summary className="cursor-pointer list-none flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Acuan ARKAS 2026</span>
          <span className="text-xs text-zinc-400">Lihat</span>
        </summary>
        <div className="mt-2 grid grid-cols-2 lg:grid-cols-3 gap-2">
          {(arkasRef as unknown as { ringkasan_kategori: Array<{ kode: string; nama: string; jumlah: number; pct: number }> }).ringkasan_kategori.map((k) => (
            <div key={k.kode} className="rounded-xl border border-[#ece9f5] bg-[#fbfaf7] p-2.5">
              <div className="font-mono text-xs font-medium">{k.kode}</div>
              <div className="text-xs text-zinc-500 leading-3">{k.nama}</div>
              <div className="text-xs font-semibold mt-1">{fmtRp(k.jumlah)} · {k.pct}%</div>
            </div>
          ))}
        </div>
      </details>

      <ScanUpload label="Scan pengesahan RKAS" currentName={rkas.scanName} currentDataUrl={rkas.scanDataUrl} onChange={(n, d) => persist({ ...rkas, scanName: n, scanDataUrl: d, status: rkas.status === "Sah" ? "Sah" : rkas.status === "Siap Cetak" ? "Menunggu Scan" : rkas.status }, "Scan tersimpan")} onClear={() => persist({ ...rkas, scanName: null, scanDataUrl: null }, "Scan dihapus")} />
    </div>
  );
}
