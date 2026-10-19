// PRD v1.3 — Types untuk Sprint 1 (A,B,C) + Sprint 2 (D,E,G,H)

export type RaporMetadata = {
  satuan: string;
  npsn: string;
  tahun_rapor: number;
  sumber_file: string;
  diperbarui: string;
  sheet_utama?: string;
  catatan_kepsek?: string;
  aturan_rkt?: string;
};

export type IndikatorRapor = {
  kode: string;
  nama: string;
  deskripsi_indikator?: string;
  capaian_label: string | null;
  skor_2025: string | null;
  definisi_capaian?: string | null;
  definisi?: string | null;
  perubahan: string | null;
  skor_2024: string | null;
  peringkat_kab: string | null;
  peringkat_nas: string | null;
  sumber: string | null;
  tipe?: string;
};

export type RekomPrioritas = {
  no: number;
  identifikasi_kode: string;
  identifikasi_label: string | null;
  identifikasi_skor: string | null;
  akar_lv1_kode: string | null;
  akar_lv2_kode: string | null;
  akar_deskripsi: string | null;
  kegiatan_benahi: string | null;
  tautan_benahi: string | null;
  kegiatan_arkas: string | null;
};

export type RaporDataset = {
  metadata: RaporMetadata & Record<string, unknown>;
  indikator_level1: IndikatorRapor[];
  indikator_level2: IndikatorRapor[];
  indikator_lengkap: IndikatorRapor[];
  prioritas_pbd_2025: {
    jumlah_rekomendasi_prioritas: number;
    jumlah_rekomendasi_keseluruhan?: number;
    daftar: RekomPrioritas[];
    aturan_rkt_12?: string;
  };
  rekom_keseluruhan?: { jumlah: number; daftar: RekomPrioritas[]; catatan?: string };
  ringkasan_temuan?: {
    indikator_menonjol_positif?: string[];
    indikator_perlu_perhatian?: string[];
    rekomendasi_prioritas_bbpmp_12?: string[];
  };
};

// ── RKJM 2026-2030 ──
export type RKJMSasaran = {
  id: string;
  kode: string; // S-01
  judul: string;
  indikator_rapor_kode: string; // mis. A.2
  target: Record<string, string>; // { "2026/2027": "65", ... "2029/2030": "78" }
  penanggung_jawab: string;
  createdAt: string;
};

export type RKJMProgram = {
  id: string;
  nama: string;
  sasaran_ids: string[];
  strategi: string;
  tahapan: Record<string, string>; // tahun -> deskripsi tahap
};

export type DokStatus = "Draft" | "Siap Cetak" | "Menunggu Scan" | "Sah" | "Diarsipkan";

export type RKJM = {
  id: string;
  periode: string; // "2026-2030"
  visi: string;
  misi: string[];
  tujuan: string;
  sasaran: RKJMSasaran[];
  program: RKJMProgram[];
  bab6_monev: string;
  status: DokStatus;
  scanName?: string | null;
  scanDataUrl?: string | null; // base64 PDF/JPG
  createdAt: string;
  updatedAt: string;
};

// ── RKT (maks 12) ──
export type RKTKegiatan = {
  id: string;
  no: number; // 1..12
  identifikasi_kode: string; // A.2
  akar_kode: string | null; // A.2.4
  kegiatan_benahi: string;
  penjelasan: string;
  biaya: "Ya" | "Tidak";
  sasaran_rkjm_id: string | null;
};

export type RKT = {
  id: string;
  tahun_ajaran: string; // "2026/2027"
  rkjm_id: string;
  evaluasi_lalu: string;
  kegiatan: RKTKegiatan[]; // max 12
  status: DokStatus;
  scanName?: string | null;
  scanDataUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export const RKT_MAX = 12;

// ── RKAS (Sheet 4) — hanya dari RKT Biaya=Ya ──
export type RkasBaris = {
  id: string;
  rktKegiatanId: string; // FK ke RKTKegiatan
  kegiatan_benahi: string;
  penjelasan: string;
  kegiatan_arkas: string; // padanan BOS, mis. "Peningkatan kompetensi guru..."
  uraian_kegiatan: string; // barang/jasa, mis. "Honor Narasumber 2 hari"
  bulan: string; // "Juni" / "TW1" etc.
  jumlah: number;
  satuan: string; // "rim", "Orang/hari"
  harga_satuan: number;
  total: number; // jumlah * harga_satuan
};

export type RKAS = {
  id: string;
  tahun_ajaran: string; // sama dengan RKT
  rkt_id: string;
  pendapatan: { sumber: string; jumlah: number }[]; // BOS Reguler, BOSDA, Komite...
  baris: RkasBaris[];
  status: DokStatus;
  scanName?: string | null;
  scanDataUrl?: string | null;
  versi: string; // "Murni" | "Perubahan 1" etc.
  createdAt: string;
  updatedAt: string;
};

// ── KSP Fase D (5 Komponen) — PRD v1.3 E-01 s.d. E-03 + Permendikdasmen 13/2025 ──
export type KSPKomponen = {
  karakteristik: string; // Komponen 1
  visi: string; // warisan Master (read-only hint)
  misi: string[];
  pengorganisasian: string; // Komponen 3 — Fase D, JP, Koding & KA, kokurikuler, kepanduan
  rencana_pembelajaran: string; // Komponen 4 — deep learning, asesmen
  pendampingan: string; // Komponen 5
};

export type CPEntry = {
  id: string;
  mapel: string; // "Matematika", "Bahasa Indonesia", "PAI"...
  fase: "D";
  cp_teks: string;
  sumber: string; // "Kep BSKAP 046/2025" atau "Kep BKPDM 020/2026 (Agama)"
  tp: string[]; // Tujuan Pembelajaran per kelas 7/8/9
};

export type KSP = {
  id: string;
  tahun_ajaran: string;
  rkjm_id: string;
  rkt_id: string | null; // taut ke RKT tahun sama
  komponen: KSPKomponen;
  cp: CPEntry[]; // Bank CP Fase D
  rkt_kegiatan_ids: string[]; // taut kegiatan RKT (E-03)
  status: DokStatus;
  scanName?: string | null;
  scanDataUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

// ── ARKAS reference ──
export type ArkasKategori = { kode: string; nama: string; jumlah: number; pct: number; catatan?: string };
export type ArkasReference = {
  metadata: { satuan: string; tahun: number; total: number; kepala_sekolah?: string };
  ringkasan_kategori: ArkasKategori[];
  karakteristik?: string[];
  kegiatan_terdeteksi?: string[];
};

// ── Helpers untuk export/arsip ──
export const TAHUN_OPSI = ["2026/2027", "2027/2028", "2028/2029", "2029/2030"] as const;
export const STATUS_OPSI: DokStatus[] = ["Draft", "Siap Cetak", "Menunggu Scan", "Sah", "Diarsipkan"];
