import type { RaporDataset, IndikatorRapor } from "./types";
import type { ParsedRapor } from "./parseRapor";
import seed from "@/data/rapor-2025.json";

export const raporSeed = seed as unknown as RaporDataset;

// ── Dataset aktif: hasil impor (ParsedRapor) dikonversi ke bentuk RaporDataset ──
export function parsedToDataset(p: ParsedRapor): RaporDataset {
  const lengkap: IndikatorRapor[] = p.indikator.map((r, i) => ({
    kode: r.kode ?? `IMP-${i + 1}`,
    nama: r.nama,
    capaian_label: r.capaian_label,
    skor_2025: r.skor_2025,
    definisi: r.definisi,
    perubahan: r.perubahan,
    skor_2024: r.skor_2024,
    peringkat_kab: r.peringkat_kab,
    peringkat_nas: r.peringkat_nas,
    sumber: r.sumber,
    tipe: "impor",
  }));
  const isLv1 = (k: string) => k.split(".").length <= 2;
  let level1 = lengkap.filter((x) => isLv1(x.kode));
  const level2 = lengkap.filter((x) => !isLv1(x.kode));
  if (level1.length === 0) level1 = lengkap;
  const daftar = p.prioritas.map((r, i) => ({
    no: parseInt(r.no, 10) || i + 1,
    identifikasi_kode: r.identifikasi_kode ?? "",
    identifikasi_label: null,
    identifikasi_skor: null,
    akar_lv1_kode: null,
    akar_lv2_kode: r.akar_lv2_kode,
    akar_deskripsi: null,
    kegiatan_benahi: r.kegiatan_benahi,
    tautan_benahi: null,
    kegiatan_arkas: null,
  }));
  return {
    metadata: {
      satuan: "SMP Negeri 5 Tegal",
      npsn: "20329830",
      tahun_rapor: p.tahun,
      sumber_file: p.fileName,
      diperbarui: new Date().toISOString().slice(0, 10),
    },
    indikator_level1: level1,
    indikator_level2: level2,
    indikator_lengkap: lengkap,
    prioritas_pbd_2025: { jumlah_rekomendasi_prioritas: daftar.length, daftar },
  };
}

export function datasetFromImport(rawJson: string): RaporDataset | null {
  try {
    const o = JSON.parse(rawJson) as Record<string, unknown>;
    if (!o || typeof o !== "object") return null;
    if (Array.isArray(o["indikator_level1"]) && (o as unknown as RaporDataset).prioritas_pbd_2025) {
      return o as unknown as RaporDataset;
    }
    if (Array.isArray(o["indikator"])) return parsedToDataset(o as unknown as ParsedRapor);
    return null;
  } catch {
    return null;
  }
}

// ── Helpers untuk Sheet 2 ──
export function getIndikatorByKode(kode: string, ds?: RaporDataset): IndikatorRapor | undefined {
  return (ds ?? raporSeed).indikator_lengkap.find(
    (x) => x.kode === kode
  );
}

export function flagForIndikator(it: IndikatorRapor): "merah" | "kuning" | "hijau" | "netral" {
  // Heuristic berdasarkan peringkat kab & skor + capaian_label
  const kab = (it.peringkat_kab || "").toLowerCase();
  const skor = it.skor_2025 || "";
  // peringkat bawah 81-100% = merah kuat
  if (kab.includes("bawah (81-100%)") || kab.includes("bawah (81")) return "merah";
  if (kab.includes("menengah bawah")) return "kuning";
  // skor numerik rendah untuk A-level tertentu
  if (it.kode?.startsWith("E.2") || it.kode?.startsWith("E.3")) {
    // E.2 36.04, E.3 50 etc. already low
    const n = parseFloat(String(skor).replace(",",".").replace("%",""));
    if (!isNaN(n) && n < 45) return "merah";
    if (!isNaN(n) && n < 60) return "kuning";
  }
  if (kab.includes("atas (1-20%)") || kab.includes("peringkat atas")) return "hijau";
  return "netral";
}

export function peringkatBadge(peringkat: string | null) {
  if (!peringkat) return null;
  const s = peringkat.toLowerCase();
  if (s.includes("81-100") || s.includes("bawah (81")) return { label: peringkat, tone: "merah" as const };
  if (s.includes("61-80") || s.includes("menengah bawah")) return { label: peringkat, tone: "kuning" as const };
  if (s.includes("1-20") || s.includes("peringkat atas")) return { label: peringkat, tone: "hijau" as const };
  if (s.includes("41-60") || s.includes("menengah (41")) return { label: peringkat, tone: "netral" as const };
  return { label: peringkat, tone: "netral" as const };
}

export function perubahanBadge(perubahan: string | null) {
  if (!perubahan) return { label: "-", tone: "netral" as const };
  const s = perubahan.toLowerCase();
  if (s.includes("naik")) return { label: perubahan, tone: "naik" as const };
  if (s.includes("turun")) return { label: perubahan, tone: "turun" as const };
  return { label: perubahan, tone: "netral" as const };
}
