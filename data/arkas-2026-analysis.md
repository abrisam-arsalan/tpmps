# Analisis ARKAS 2026 — SMP Negeri 5 Tegal

**Sumber:** rka-unit-221-output.pdf — Lembar Kertas Kerja Unit Kerja, Pemkot Tegal TA 2026  
**Total Pagu:** Rp 628.280.000 (disahkan 18 Agustus 2026, Kepsek Sri Handayani Reksowati)  
**Tanggal Ekstrak:** 15 Okt 2026

## Ringkasan per Kategori (Kode Permendagri 77/SIPD)

| Kode | Kategori | Jumlah (Rp) | % |
|---|---|---:|---:|
| 5.1.02.01 | Barang Habis Pakai (ATK, cetak, kebersihan, olahraga, dll) | 259.494.750 | 41,3% |
| 5.1.02.02 | Jasa (honor, langganan, registrasi, sewa) | 120.837.150 | 19,2% |
| 5.1.02.03 | Pemeliharaan (gedung, AC, komputer, taman) | 125.440.000 | 20,0% |
| 5.1.02.04 | Perjalanan Dinas | 10.000.000 | 1,6% |
| 5.2.02.01 | Modal Pompa | 2.167.400 | 0,3% |
| 5.2.02.05 | Modal Alat Kantor/RT (CCTV, tenda, mebel, sound) | 23.718.700 | 3,8% |
| 5.2.02.10 | Modal Komputer (printer, scanner, router) | 18.979.000 | 3,0% |
| 5.2.05.01 | Modal Buku (umum/agama/IP praktis) | 67.643.000 | 10,8% |
| | **TOTAL** | **628.280.000** | **100%** |

> Catatan: Kode di atas adalah SIPD (Permendagri). Di aplikasi, mapping ke **kode ARKAS BOS Kemdikbud (5.1.02.xx)** akan disediakan di panel Referensi D-02.

## Temuan Utama untuk RKJM 2026-2030

1. **Mamin 75,8 jt (12,1% dari total, di dalam 5.1.02.01)** tersebar di 30+ kegiatan — pola kegiatan kesiswaan sangat kaya (MPLS, LDKS, Perkemahan 611 siswa, TEF, lomba OSN/O2SN/FLS3N/FTBI/MAPSI/POPDA, TKA, ANBK). Saat menyusun RKT, kegiatan-kegiatan ini jangan diketik ulang — generate dari bank kegiatan periode lalu.
2. **Pemeliharaan gedung 108,5 jt (9 paket @ 4-25 jt)** mendominasi — sinyal prioritas sarpras. Di RKJM 2026-2030, sasaran sarpras harus punya indikator SMART (mis. % ruang laik fungsi).
3. **Buku 67,6 jt (10,8%)** — investasi literasi cukup besar (195+100+208 eks). Kaitkan ke indikator Literasi Rapor Pendidikan sebagai bukti Benahi.
4. **Modal TIK hanya 3,0%** — gap potensial untuk indikator Digitalisasi/Iklim Inklusif di Rapor. Pertimbangkan sasaran peningkatan sarpras TIK di RKJM.
5. **Cetak soal 38,4 jt (128.106 lembar @ Rp 300)** + ATK kertas 75 rim — volume tinggi, perlu validasi efisiensi vs digitalisasi asesmen.

## Daftar Kegiatan Terdeteksi (untuk Bank Kegiatan RKT)

- Kesiswaan: LDKS, Perkemahan Besar, PILKETOS, MPLS, PPDB, Karnaval TEF, Jumbara PMR
- Lomba: OSN, O2SN, FLS3N, FTBI, MAPSI, POPDA, Futsal AFK/Allievo, KKR
- Akademik: TKA Kelas 9, ANBK, IHT 2 hari x 45 dus, MGMP, Coaching Clinic BOSP
- Sarpras: Pemeliharaan 9 gedung, taman 20m2, servis printer/AC/komputer
- P5 implisit: Dekorasi Stand Pameran 5 jt, Karnaval, Gaya Hidup Berkelanjutan

## Implikasi untuk Aplikasi (D-02)

- Panel Referensi BOS harus memuat **mapping SIPD ↔ ARKAS BOS** (mis. 5.1.02.01.01.00.24 ATK ↔ 5.1.02.01).
- Seed awal referensi: 197 baris rincian dari file ini — impor sebagai CSV referensi harga satuan (contoh: Kertas HVS Folio 70gr Rp 69.100/rim, Tinta Whiteboard Rp 18.200/botol).
- Validasi RKAS: total belanja harus = total pendapatan (BOS Reguler + BOSDA + Komite) — file ini belum memuat sisi pendapatan, perlu ditambahkan di form RKAS.

## File Terkait

- rkas-2026-reference.json — struktur machine-readable untuk seeding aplikasi
- Sumber PDF asli: 
ka-unit-221-output.pdf
