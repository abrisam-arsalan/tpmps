// KSP helpers — CP bank & status
import type { CPEntry } from "./types";

// Seed CP Fase D (ringkas, merujuk regulasi — full text dihubungkan via tautan resmi)
export const CP_SEED: CPEntry[] = [
  {
    id: "cp-matematika-d",
    mapel: "Matematika",
    fase: "D",
    cp_teks: "Peserta didik mampu memahami bilangan rasional, aljabar, geometri, data & ketidakpastian; menalar dan memecahkan masalah kontekstual.",
    sumber: "Kep BSKAP 046/H/KR/2025 (berlaku 16 Jul 2025)",
    tp: ["Memahami bilangan rasional & operasi", "Memodelkan aljabar sederhana", "Membaca data & ketidakpastian"],
  },
  {
    id: "cp-bindo-d",
    mapel: "Bahasa Indonesia",
    fase: "D",
    cp_teks: "Mampu membaca teks informasi & sastra, mengakses-menemukan (L1), menginterpretasi (L2), mengevaluasi-merefleksi (L3).",
    sumber: "Kep BSKAP 046/H/KR/2025",
    tp: ["Membaca teks informasi", "Membaca teks sastra", "Menulis & mempresentasikan gagasan"],
  },
  {
    id: "cp-ipa-d",
    mapel: "IPA",
    fase: "D",
    cp_teks: "Memahami konsep sains, melakukan penyelidikan, dan mengaitkan sains dengan lingkungan.",
    sumber: "Kep BSKAP 046/H/KR/2025",
    tp: ["Klasifikasi & pengukuran", "Energi & sistem", "Lingkungan & keberlanjutan"],
  },
  {
    id: "cp-pai-d",
    mapel: "Pendidikan Agama Islam & Budi Pekerti",
    fase: "D",
    cp_teks: "CP PAI diperbarui 2026 — keseimbangan memahami & mengamalkan; penguatan membaca Al-Qur'an.",
    sumber: "Kep BKPDM 020/2026 (berlaku TA 2026/2027 — hanya Agama/Budi Pekerti)",
    tp: ["Memahami & mengamalkan ajaran", "Membaca Al-Qur'an", "Akhlak & budi pekerti"],
  },
];

export const KSP_TA_OPSI = ["2026/2027", "2027/2028", "2028/2029", "2029/2030"] as const;

export function cpBadgeSumber(sumber: string) {
  if (sumber.includes("020/2026")) return { label: "020/2026 · Agama", tone: "kuning" as const };
  return { label: "046/2025", tone: "hijau" as const };
}
