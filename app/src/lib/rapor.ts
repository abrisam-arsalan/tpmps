import type { RaporDataset, IndikatorRapor } from "./types";
import seed from "@/data/rapor-2025.json";

export const raporSeed = seed as unknown as RaporDataset;

// ── Helpers untuk Sheet 2 ──
export function getIndikatorByKode(kode: string): IndikatorRapor | undefined {
  return raporSeed.indikator_lengkap.find(
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
