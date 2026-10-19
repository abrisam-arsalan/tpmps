// Parser untuk Excel 6-sheet PBD (Sheet 2 = 113 baris sumber utama)
// Dipakai di browser saat upload file Rapor; SheetJS (xlsx) via xlsx
// Format: A No, B Indikator, C Capaian, D Skor 2025, E Definisi, F Perubahan, G Skor 2024, H Peringkat Kab, I Peringkat Nas, J Sumber

export type ParsedRapor = {
  fileName: string;
  tahun: number;
  indikator: Array<{
    kode: string | null;
    nama: string;
    capaian_label: string | null;
    skor_2025: string | null;
    definisi: string | null;
    perubahan: string | null;
    skor_2024: string | null;
    peringkat_kab: string | null;
    peringkat_nas: string | null;
    sumber: string | null;
  }>;
  prioritas: Array<{
    no: string;
    identifikasi_kode: string | null;
    akar_lv2_kode: string | null;
    kegiatan_benahi: string | null;
  }>;
};

// Dinamis: load xlsx di client saja
export async function parseRaporFile(file: File): Promise<ParsedRapor> {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });

  const wanted = ["2. LAPORAN RAPOR", "2.1 REKOM. KESELURUHAN", "2.2 REKOM. PRIORITAS"];
  // fallback: cari sheet yang mengandung "LAPORAN RAPOR" atau "2."
  let sheetName = wb.SheetNames.find((n) => n.includes("LAPORAN RAPOR")) ?? wb.SheetNames[1];
  if (!sheetName) throw new Error("Sheet '2. LAPORAN RAPOR' tidak ditemukan.");

  const ws = wb.Sheets[sheetName];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, blankrows: false }) as unknown[][];

  // Header ada di baris index ~6 (0-based). Data mulai baris 7 (index 7) — No di col 0
  const indikator: ParsedRapor["indikator"] = [];
  for (let r = 7; r < rows.length; r++) {
    const row = rows[r] as (string | number | null)[];
    if (!row) continue;
    const no = row[0] != null ? String(row[0]).trim() : null;
    const b = row[1] != null ? String(row[1]).trim() : null;
    // skip kosong total
    if (!no && !b) continue;
    // proporsi rows: no kosong tapi b berisi Proporsi -> skip untuk level1 list, tapi tetap simpan jika mau
    // Kita simpan hanya yang punya No kode
    if (!no || no.toLowerCase() === "no") {
      // Jika proporsi, lewati (tidak masuk indikator utama)
      if (b && /Proporsi|Persentase/i.test(b)) continue;
      continue;
    }
    // b bisa mengandung "\n" -> ambil baris pertama sebagai nama
    const namaRaw = b ?? "";
    const nama = String(namaRaw).split("\n")[0].trim().slice(0, 160);
    if (/^Proporsi|^Persentase/i.test(nama)) continue;

    const capaian = row[2] != null ? String(row[2]).trim() : null;
    const skor = row[3] != null ? String(row[3]).trim() : null;
    const definisi = row[4] != null ? String(row[4]).trim().slice(0, 400) : null;
    const perubahan = row[5] != null ? String(row[5]).trim() : null;
    const skor2024 = row[6] != null ? String(row[6]).trim() : null;
    const peringkatKab = row[7] != null ? String(row[7]).trim() : null;
    const peringkatNas = row[8] != null ? String(row[8]).trim() : null;
    const sumber = row[9] != null ? String(row[9]).trim() : null;

    indikator.push({
      kode: no,
      nama,
      capaian_label: capaian,
      skor_2025: skor,
      definisi,
      perubahan,
      skor_2024: skor2024,
      peringkat_kab: peringkatKab,
      peringkat_nas: peringkatNas,
      sumber,
    });

    if (indikator.length >= 120) break; // safety
  }

  // Prioritas dari sheet 2.2 jika ada
  const prioritas: ParsedRapor["prioritas"] = [];
  const s22 = wb.SheetNames.find((n) => n.includes("REKOM. PRIORITAS") || n.includes("2.2"));
  if (s22) {
    const ws2 = wb.Sheets[s22];
    const r2: unknown[][] = XLSX.utils.sheet_to_json(ws2, { header: 1, defval: null }) as unknown[][];
    for (let r = 7; r < r2.length; r++) {
      const row = r2[r] as (string | null)[];
      if (!row) continue;
      const no = row[0] != null ? String(row[0]).trim() : null;
      if (!no || no.toLowerCase() === "no") continue;
      if (!/^\d+$/.test(no)) continue;
      prioritas.push({
        no,
        identifikasi_kode: row[1] != null ? String(row[1]).trim() : null,
        akar_lv2_kode: row[5] != null ? String(row[5]).trim() : null,
        kegiatan_benahi: row[7] != null ? String(row[7]).trim().slice(0, 300) : null,
      });
      if (prioritas.length >= 20) break;
    }
  }

  // Tahun: coba tebak dari nama file atau sheet title
  const tahunMatch = file.name.match(/20\d{2}/);
  const tahun = tahunMatch ? parseInt(tahunMatch[0], 10) : new Date().getFullYear();

  return { fileName: file.name, tahun, indikator, prioritas };
}
