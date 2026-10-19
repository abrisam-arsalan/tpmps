# SMP Negeri 5 Tegal — Aplikasi Manajemen Sekolah Terintegrasi

**PBD (Perencanaan Berbasis Data) — Rapor Pendidikan → RKJM → RKT → RKAS → KSP**

- **PRD:** `../PRD.md` (v1.3) — 27 requirements (A–H), 12 prioritas RKT, hierarki CP Fase D
- **Rapor seed:** `src/data/rapor-2025.json` (113 baris Sheet 2, 18 Lv1 + 74 Lv2, 12 Rekom BBPMP)
- **ARKAS 2026:** `src/data/arkas-2026-reference.json` (Rp 628,28 jt, 9 kategori, 30+ kegiatan) — mapping SIPD ↔ ARKAS BOS
- **Stack:** Next.js 16.4 (App Router, Cache Components, Turbopack) + React 19 + TypeScript + Tailwind 4 + Dexie (IndexedDB, offline-first) + SheetJS (xlsx)
- **Data:** 100% lokal (IndexedDB) — tidak butuh server/DB eksternal, file tahun lalu tetap ada (G-04), cetak manual + scan (G-02)

## Jalankan

```bash
cd "D:\Backup Download\Aplikasi\Manajemen Sekolah\app"

# Dev (hot reload) — http://localhost:3001 (sudah jalan)
bun run dev --port 3001

# Produksi — build + start
bun run build
bun run start -- --port 3002   # http://localhost:3002

# Lint
bun run lint
```

## Alur (satu-jalur)

`Rapor (Sheet 2, 113 baris)` → `RKJM 2026–2030 (6 BAB, Master Visi/Misi)` → `RKT ≤12/tahun (Sheet 3)` → `RKAS Sheet 4 (hanya Biaya=Ya)` → `KSP Fase D (5 Komponen, CP 046/2025 + 020/2026 Agama)` → `Cetak/PDF + scan + Arsip permanen` → `Matriks G-03 (jejak) + Health F-02`

Aturan yang dikunci:
- Sumber utama = Sheet 2 (113 baris, 18 Lv1 + 74 Lv2)
- RKT ≤12/tahun — hard stop baris ke-13
- Hanya Biaya=Ya (Sheet 3 kolom F) → RKAS (Sheet 4, 10 kolom)
- Cetak manual + scan pengesahan per dokumen (Draft → Siap Cetak → Menunggu Scan → Sah → Diarsipkan)
- CP Fase D: 046/2025 default (16 Jul 2025), 020/2026 hanya Agama/Budi Pekerti (TA 2026/27)

## Halaman

| Route | Isi |
|---|---|
| `/` | Dashboard Kepsek — 1 masalah utama (F-02), progres 5 dokumen, 1-jalur PBD |
| `/rapor` | Sheet 2 (113 baris) — filter Lv1/Lv2, flag merah/kuning/hijau, impor 6-sheet |
| `/rapor/analisis` | 12 Rekom BBPMP (Sheet 2.2) + highlight 3 klaster |
| `/rkjm` | 6 BAB — Visi/Misi Master, Sasaran SMART (taut kode Sheet 2), Program & Monev, Export Excel, Cetak, scan |
| `/rkt` | Sheet 3 — 1-klik dari 12 prioritas, maks 12, Evaluasi RKT Lalu, Export/Cetak, scan |
| `/rkas` | Sheet 4 (10 kolom) — dari RKT Biaya=Ya, ringkasan Belanja vs Pendapatan, Referensi ARKAS 2026, Export/Cetak, scan |
| `/ksp` | 5 Komponen (Permendikdasmen 13/2025: Profil Lulusan, Koding & KA, deep learning, kepanduan), Bank CP Fase D, taut RKT (E-03), Export/Cetak, scan |
| `/matriks` | G-03 Matriks Ketertelusuran (Rapor → RKJM → RKT → RKAS → KSP) + F-02 Health lengkap, Export/Cetak |
| `/rkjm/arsip` | G-04 Arsip tahunan permanen + Export Backup JSON (H-03) |

Semua dokumen: offline-first, Export Excel (Sheet 3/4 compat), Cetak/PDF (kop, tanda tangan), scan base64 di IndexedDB.

## Dokumen

- `D:\Backup Download\Aplikasi\Manajemen Sekolah\PRD.md` — Product Requirements Document (Pragmatic, evidence-based)
- `D:\Backup Download\Aplikasi\Manajemen Sekolah\data\rapor-2025.json` + `rapor-2025-analysis.md`
- `D:\Backup Download\Aplikasi\Manajemen Sekolah\data\arkas-2026-reference.json` + `arkas-2026-analysis.md`

## Deploy

- Build static (9 routes prerendered): `bun run build` → `.next/`
- Start produksi: `bun run start -- --port 3002` (atau `next start --port 3002`)
- Host yang didukung: Vercel (`vercel --prod`), atau Node 18+ di server sekolah (PM2: `pm2 start "bun run start -- --port 3002"`), atau `next export`-like via `bun run build` + reverse proxy.
- Tidak perlu env var / DB eksternal — IndexedDB di browser.

## Catatan

- Import Rapor 6-sheet: `src/lib/parseRapor.ts` (SheetJS, mapping kolom A–J Sheet 2, prioritas Sheet 2.2)
- Validasi & jejak: `src/lib/trace.ts` (G-03 + F-02), `src/lib/rapor.ts` (flag peringkat)
- Cetak: `src/lib/export.ts` (Excel via xlsx, PDF via print HTML + kop + tanda tangan)
