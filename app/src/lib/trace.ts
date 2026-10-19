import type { RKJM, RKT, RKAS, KSP } from "./types";
import { getIndikatorByKode } from "./rapor";

export type TraceRow = {
  no: number;
  raporKode: string;
  raporNama: string;
  capaianLabel: string | null;
  skor2025: string | null;
  rkjmSasaran: string | null;
  rkjmJudul: string | null;
  rktNo: string | null;
  rktKegiatan: string | null;
  rktBiaya: string | null;
  rkasUraian: string | null;
  rkasTotal: number | null;
  kspTaut: boolean;
  status: "ok" | "warn" | "merah";
  hint: string;
};

export function buildTrace(rkt: RKT | null, rkjm: RKJM | null, rkas: RKAS | null, ksp: KSP | null): TraceRow[] {
  if (!rkt || rkt.kegiatan.length === 0) return [];
  return rkt.kegiatan.map((k, i) => {
    const rapor = getIndikatorByKode(k.identifikasi_kode);
    const sas = rkjm?.sasaran.find((s) => s.id === k.sasaran_rkjm_id);
    const barisRkas = rkas?.baris.filter((b) => b.rktKegiatanId === k.id) ?? [];
    const totalRkas = barisRkas.length ? barisRkas.reduce((a, b) => a + b.total, 0) : null;
    const kspTaut = !!ksp && ksp.rkt_kegiatan_ids.includes(k.id);
    let status: TraceRow["status"] = "ok";
    let hint = "Lengkap.";
    if (!sas) { status = "warn"; hint = "Belum taut ke RKJM."; }
    else if (k.biaya === "Ya" && barisRkas.length === 0) { status = "warn"; hint = "Belum ada anggaran."; }
    else if (k.biaya === "Ya" && !kspTaut && !!ksp) { status = "warn"; hint = "Belum taut ke Kurikulum."; }
    if (!rapor) { status = "merah"; hint = `Kode ${k.identifikasi_kode} tidak ditemukan.`; }
    return {
      no: i + 1, raporKode: k.identifikasi_kode, raporNama: rapor?.nama ?? k.identifikasi_kode,
      capaianLabel: rapor?.capaian_label ?? null, skor2025: rapor?.skor_2025 ?? null,
      rkjmSasaran: sas?.kode ?? null, rkjmJudul: sas?.judul ?? null, rktNo: String(k.no),
      rktKegiatan: k.kegiatan_benahi, rktBiaya: k.biaya,
      rkasUraian: barisRkas.length ? barisRkas.map((b) => b.uraian_kegiatan).join(" | ").slice(0, 120) : null,
      rkasTotal: totalRkas, kspTaut, status, hint,
    };
  });
}

export type HealthIssue = { severity: "merah" | "kuning" | "hijau"; message: string; actionHref?: string };

export function healthCheck(opts: { rkjm: RKJM | null; rkts: RKT[]; rkas: RKAS | null; ksps: KSP[]; rktAktif: RKT | null }): HealthIssue[] {
  const issues: HealthIssue[] = [];
  const { rkjm, rkts, rkas, ksps, rktAktif } = opts;

  if (!rkjm) {
    issues.push({ severity: "merah", message: "RKJM belum dibuat — buat RKJM dulu sebelum RKT.", actionHref: "/rkjm" });
  } else {
    if (rkjm.sasaran.length === 0) issues.push({ severity: "kuning", message: "RKJM belum ada sasaran — tambah sasaran dulu.", actionHref: "/rkjm" });
    if (rkjm.program.length === 0) issues.push({ severity: "kuning", message: "RKJM belum ada program — tambah program.", actionHref: "/rkjm" });
  }

  if (rkts.length === 0) {
    issues.push({ severity: "kuning", message: "RKT belum ada — buat RKT tahun ini.", actionHref: "/rkt" });
  } else {
    for (const r of rkts) {
      if (r.kegiatan.length === 0) issues.push({ severity: "kuning", message: `RKT ${r.tahun_ajaran} kosong — isi prioritas.`, actionHref: "/rkt" });
      if (r.kegiatan.length > 12) issues.push({ severity: "merah", message: `RKT ${r.tahun_ajaran} melebihi 12 — kurangi.`, actionHref: "/rkt" });
      const tanpaSasaran = r.kegiatan.filter((k) => !k.sasaran_rkjm_id);
      if (tanpaSasaran.length) issues.push({ severity: "kuning", message: `RKT ${r.tahun_ajaran}: ${tanpaSasaran.length} kegiatan belum taut ke RKJM.`, actionHref: "/rkt" });
    }
  }

  if (rktAktif) {
    const biayaYa = rktAktif.kegiatan.filter((k) => k.biaya === "Ya").length;
    if (biayaYa > 0) {
      if (!rkas) issues.push({ severity: "kuning", message: `Ada ${biayaYa} kegiatan butuh anggaran — lengkapi RKAS.`, actionHref: "/rkas" });
      else {
        const tercakup = new Set(rkas.baris.map((b) => b.rktKegiatanId));
        const belum = rktAktif.kegiatan.filter((k) => k.biaya === "Ya" && !tercakup.has(k.id));
        if (belum.length) issues.push({ severity: "kuning", message: `RKAS: ${belum.length} kegiatan belum ada anggaran.`, actionHref: "/rkas" });
        const totalBelanja = rkas.baris.reduce((a, b) => a + b.total, 0);
        const totalPdpt = rkas.pendapatan.reduce((a, b) => a + b.jumlah, 0);
        if (totalBelanja > 0 && totalBelanja !== totalPdpt) {
          issues.push({
            severity: totalBelanja > totalPdpt ? "merah" : "kuning",
            message: `Anggaran: belanja ${totalBelanja.toLocaleString("id-ID")} vs pendapatan ${totalPdpt.toLocaleString("id-ID")} — belum seimbang.`,
            actionHref: "/rkas",
          });
        }
      }
    }
  }

  const ksp2026 = ksps.find((k) => k.tahun_ajaran === "2026/2027") ?? ksps[0];
  if (ksp2026) {
    if (!ksp2026.komponen.karakteristik?.trim()) issues.push({ severity: "kuning", message: "Kurikulum: karakteristik masih kosong.", actionHref: "/ksp" });
    if (!ksp2026.komponen.pengorganisasian?.trim()) issues.push({ severity: "kuning", message: "Kurikulum: pengorganisasian masih kosong.", actionHref: "/ksp" });
    if (rktAktif && ksp2026.rkt_kegiatan_ids.length === 0) issues.push({ severity: "kuning", message: "Kurikulum belum taut ke RKT.", actionHref: "/ksp" });
  } else {
    issues.push({ severity: "kuning", message: "Kurikulum belum dibuat.", actionHref: "/ksp" });
  }

  if (issues.length === 0) issues.push({ severity: "hijau", message: "Semua lengkap — siap cetak dan arsip." });
  return issues;
}
