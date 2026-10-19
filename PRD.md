# Product Requirements Document — Aplikasi Manajemen Sekolah Terintegrasi

*Confidential — SMP Negeri 5 Tegal. Dokumen Perencanaan Berbasis Data (PBD). Isi dan jadwal dapat berubah sesuai regulasi Kemendikdasmen terbaru. Tidak untuk komitmen eksternal.*

**Satuan Pendidikan:** SMP Negeri 5 Tegal — Jenjang SMP (Fase D)  
**Produk / Fitur:** Aplikasi Manajemen Dokumen Sekolah Terintegrasi (Rapor Pendidikan → RKJM → RKT → RKAS → KSP)  
**Author:** Kepala SMP Negeri 5 Tegal (Product Owner) · **Contact:** smpn5tegal@[domain] · **Tanggal:** 15 Oktober 2026 · **Versi:** 1.3  
**Status:** Draft PRD v1.3 — Update: Data Rapor 2025 Real (113 baris Sheet 2, 18 Lv1 + 74 Lv2, 12 Rekom Prioritas) + Aturan RKT Maksimal 12 Prioritas  
**Konteks Kurikulum:** Kurikulum Merdeka (Permendikbudristek No. 12/2024 jo. **Permendikdasmen No. 13/2025**, **Kep Kepala BSKAP No. 046/H/KR/2025** (berlaku 16 Juli 2025), **Kep BKPDM No. 020/2026 & 021/2026** (berlaku TA 2026/2027 — penyempurnaan CP Agama & Budi Pekerti), Panduan PBD 2025 — 6-sheet Excel, Panduan Pengembangan KSP 2024, Juknis BOS 2025/2026, Permendagri 77/2020)

---

## 1. Overview — Target Release v1.0

### Goal rilis ini (satu paragraf)
Membangun aplikasi lokal (dijalankan di perangkat sekolah / workspace ini) yang membantu **Kepala Sekolah SMP** memenuhi **seluruh dokumen administratif turunan Rapor Pendidikan secara terintegrasi dan sesuai alur resmi Kemendikdasmen**: diawali dari **analisis Rapor Pendidikan**, menurunkan **RKJM 4 tahun**, menurunkan **RKT tahunan**, menurunkan **RKAS berbasis kegiatan dengan rincian referensi ARKAS/BOS (tanpa integrasi tulis langsung)**, dan **KSP Kurikulum Merdeka** yang selaras — sehingga satu sumber data (Rapor Pendidikan) mengalir tanpa entri ulang, setiap dokumen mewarisi Visi/Misi/Sasaran/Kegiatan/IndiKator dari dokumen induk, dan output siap cetak sesuai struktur bab yang diminta juknis terbaru. Kepala Sekolah berperan sebagai **validator & penanda tangan**, bukan operator ketik.

### Market forces yang mendorong (evidence-based)
- **Wajib PBD:** Sejak 2023/2024, Kemendikbudristek mewajibkan perencanaan sekolah berbasis Rapor Pendidikan (Instruksi PBD: Identifikasi → Refleksi → Benahi). Temuan Disdik Kab. Tegal 2024: ~72% SMP masih copy-paste dokumen tahun lalu karena tidak ada tool yang menghubungkan Rapor → RKJM → RKT.
- **Rapor Pendidikan sebagai Single Source of Truth:** Indikator Literasi, Numerasi, Karakter, Iklim Keamanan/Kebinekaan, Kualitas Pembelajaran, dan Tata Kelola kini menjadi dasar akreditasi & rapor. PBD 2024 menegaskan prioritas RKJM/RKT harus lahir dari akar masalah Rapor, bukan asumsi.
- **Kurikulum Merdeka & KSP 2024:** Struktur KSP berubah total (Karakteristik Satuan Pendidikan, Visi-Misi-Tujuan, Pengorganisasian Pembelajaran Fase D, Rencana Pembelajaran & Asesmen, Pendampingan & Evaluasi). KSP yang tidak sinkron dengan RKJM/RKT jadi temuan pengawas.
- **Tekanan waktu Kepala Sekolah:** Kepala SMP rata-rata menangani 5–7 dokumen + ARKAS + Dapodik + e-Rapor dengan staf terbatas. Duplikasi entri Visi/Misi/Tujuan/Kegiatan 3–4 kali meningkatkan risiko inkonsistensi dan revisi berulang saat supervisi.
- **Audit BOS & Akuntabilitas:** Juknis BOS 2024/2025 menuntut RKAS yang dapat ditelusuri ke RKT/RKJM dan 8 SNP. Kesalahan pemetaan kode rekening BOS → temuan inspektorat.

### Driven primarily by
**Content-driven + Target-date-driven.** Konten harus tuntas sesuai template resmi Kemendikdasmen terbaru (format 6-sheet Excel Rapor 2025); target jendela: **siap pakai Semester Genap 2026/2027** (Januari 2027) untuk siklus **RKJM 2026–2030** dan RKT/RKAS/KSP 2026/2027. Rilis v1.0 membekukan struktur per regulasi 2025/2026, dengan mekanisme update template bila regulasi 2027 berubah.

### Related artifacts
- Panduan Perencanaan Berbasis Data (PBD) 2025 — **Excel 6-sheet**: 1 Panduan PBD, 2 Laporan Rapor, 2.1 Rekom Keseluruhan, 2.2 Rekom Prioritas, 3 Lembar Kerja RKT, 4 Lembar Kerja ARKAS (Ref: BBPMP Jateng Juni 2025, Rumah Pendidikan)
- Panduan Pengembangan Kurikulum Satuan Pendidikan (KSP) Jenjang SMP — Kurikulum Merdeka 2024
- Juknis BOS Reguler 2025/2026 & Referensi Kode Rekening ARKAS — mapping SIPD (Permendagri 77/2020) ↔ ARKAS
- **RKA Unit SMPN 5 Tegal TA 2026 — Rp 628.280.000** (Lembar Kertas Kerja Pemkot Tegal, disahkan 18 Agustus 2026) — file `rka-unit-221-output.pdf` + seed `data/arkas-2026-reference.json` + analisis `data/arkas-2026-analysis.md`
- **Rapor Pendidikan 2025 SMP Negeri 5 Tegal (20329830)** — `RAPOR-PBD-SMP-NEGERI-5-TEGAL-20329830-DATA-2025.xlsx` (diperbarui 12 Mar 2026): **Sheet 2 Laporan Rapor = 113 baris, 18 indikator Level 1 + 74 subindikator Level 2** (A.1 Literasi 91.11% Baik, A.2 Numerasi 84.44% Baik, D.4 Iklim Keamanan 76.38, E.7 Fasilitas 96.83, dst.); Sheet 2.1 Rekom Keseluruhan 46 baris; Sheet 2.2 Rekom Prioritas **12 baris** (A.2 Numerasi, A.3 Karakter, A.1 Literasi, D.8 Kebinekaan, D.1 Kualitas Pembelajaran, D.4 Iklim Keamanan). **Aturan Kepsek: RKT maksimal 12 prioritas/tahun.** Data tersimpan di `data/rapor-2025.json` + analisis `data/rapor-2025-analysis.md`.
- Permendikbudristek No. 63/2023, No. 12/2024 (Kurikulum), Permendikdasmen terbaru bila terbit
- Tidak ada template Dinas khusus — **mengacu template resmi Kemendikdasmen** (PBD 2025)

---

## 2. Personas

### Buyer persona — Kepala Sekolah SMP Negeri 5 Tegal (Decision Maker & Validator)
**Peran:** Penanggung jawab mutu, penandatangan RKJM/RKT/RKAS/KSP, pembina pengawas.  
**Motivasi:** Dokumen lolos monev Dinas tanpa revisi mayor; selaras Rapor Pendidikan → RKJM → RKT → RKAS → KSP; bisa menjelaskan benang merah saat akreditasi; hemat waktu.  
**Proses membeli/mengadopsi:** Validasi struktur bab ke pengawas, cek kesesuaian template Dinas, uji 1 siklus perencanaan, lalu adopsi sekolah.  
**Barrier:** Trauma aplikasi yang malah menambah kerja (entri berulang), takut salah tafsir regulasi, keterbatasan literasi digital staf, takut data BOS bocor.  
**Kebutuhan terdalam:** Satu dashboard tempat ia melihat *“Rapor kita merah di Literasi → jadi prioritas RKJM → kegiatan RKT → anggaran RKAS → program KSP-nya apa, sudah sejauh mana, siapa PIC, dan butuh TTE di mana”* — tanpa harus membuka 4 file Word terpisah.

### User persona 1 — Kepala Sekolah (Primary User, Validator)
**Tujuan:** Menyetujui arah kebijakan, menetapkan prioritas, memantau progres penyusunan, memberi TTE.  
**Perilaku:** Membuka aplikasi 2–3×/minggu di siklus perencanaan; lebih banyak me-review daripada mengetik; butuh ringkasan eksekutif & jejak perubahan.  
**Masalah inti:** Terpaksa mengetik/mengoreksi manual karena staf copy-paste; sulit melacak “angka di RKT ini asalnya dari indikator Rapor yang mana”.

### User persona 2 — Wakasek Kurikulum / Ketua TPS / Tim Pengembang Sekolah (Operator Dokumen)
**Tujuan:** Menyusun draf RKJM/RKT/KSP yang benar strukturnya dan berbasis data.  
**Perilaku:** Bekerja harian di musim perencanaan; mengumpulkan data Dapodik/Rapor, menulis analisis SWOT, merumuskan tujuan & kegiatan.  
**Masalah inti:** Template berubah tiap tahun, harus menjaga konsistensi Visi-Misi antar dokumen, P5 dan CP/TP/ATP Fase D sering tidak sinkron dengan RKT.

### User persona 3 — Bendahara BOS / Wakasek Sarpras (RKAS Detailer)
**Tujuan:** Merinci RKAS per komponen 8 SNP, per kode rekening BOS, per triwulan, dengan pagu yang akuntabel.  
**Perilaku:** Membuka referensi ARKAS/BOS (Excel/PDF) sambil menyusun RKAS; menghitung volume × harga satuan.  
**Masalah inti:** Harus memetakan kegiatan RKT ke kode BOS secara manual; risiko salah kode → ditolak verifikator; versi RKAS berceceran (RKAS_murni, RKAS_perubahan_1, dst).

### User persona 4 — Pengawas Pembina / Reviewer Dinas (Stakeholder Eksternal, Read-Only)
**Tujuan:** Memverifikasi kesesuaian dokumen dengan PBD & Juknis; memberi catatan perbaikan.  
**Perilaku:** Membaca PDF final, memberi paraf/catatan.  
**Kebutuhan:** Export PDF dengan kop, nomor, daftar isi, tanda tangan, dan matriks ketertelusuran (traceability) Rapor → RKJM → RKT → RKAS → KSP.

---

## 3. Market Problems (first-person, dengan evidence)

> Format Pragmatic: *"[Keluhan persona, first-person]" — evidence: [sumber]*

1. **“Saya harus mengetik ulang Visi, Misi, dan Tujuan yang sama di RKJM, RKT, RKAS, dan KSP — kalau ada revisi, saya harus ubah 4 file satu per satu dan pasti ada yang kelewat.”** — evidence: Audit dokumen 3 SMP Negeri di Kota Tegal 2024: inkonsistensi Visi/Misi antar dokumen 60–75% sampel; wawancara 12 Wakasek Kurikulum: 9/12 menyebut entri ulang sebagai sumber kesalahan terbesar.
2. **“Saya tidak yakin prioritas RKJM saya benar-benar menjawab akar masalah di Rapor Pendidikan — seringnya kami pilih kegiatan yang ‘biasa dilakukan’, bukan yang Rapor-nya merah.”** — evidence: Panduan PBD 2024 mensyaratkan Identifikasi-Refleksi-Benahi; studi Kemendikbudristek 2023: hanya 34% sekolah yang prioritas RKJM-nya tertaut eksplisit ke indikator Rapor terendah.
3. **“Menyusun RKJM 4 tahun itu berat — saya bingung membagi sasaran tahunan, indikator keberhasilan, dan anggaran indikatif yang realistis per tahun tanpa panduan.”** — evidence: 18/22 RKJM SMP sampel Disdik Kab. Tegal 2023 tidak memiliki indikator keberhasilan tahunan yang terukur (SMART).
4. **“Saat menyusun RKT, saya tidak punya rujukan otomatis dari RKJM — jadi RKT sering lepas dari RKJM dan jadi dokumen ‘baru’ tiap tahun.”** — evidence: Temuan pengawas 2024: 43% RKT tidak merujuk nomor sasaran RKJM.
5. **“Merinci RKAS itu paling melelahkan — saya harus buka file ARKAS/BOS terpisah, cari kode rekening yang sesuai, hitung volume × harga, lalu pastikan totalnya cocok dengan kegiatan RKT. Satu salah kode, verifikator menolak.”** — evidence: Rata-rata 2,3 revisi RKAS per siklus (data Bendahara SMPN 5 Tegal 2023/2024); Juknis BOS 2024 memiliki >150 kode komponen belanja.
6. **“KSP Kurikulum Merdeka strukturnya baru — saya takut salah bab, apalagi menyelaraskan CP/TP/ATP Fase D dan P5 dengan program di RKT. Selama ini KSP kami disusun terpisah.”** — evidence: Panduan KSP 2024 menambah Komponen Karakteristik Satuan Pendidikan & Pengorganisasian Pembelajaran (Intra-Kokurikuler P5-Ekstra); 67% KSP SMP 2023/2024 di Sample Jawa Tengah tidak memuat keterkaitan eksplisit dengan RKT.
7. **“Sebagai Kepala Sekolah, saya butuh satu layar untuk tahu: dokumen mana sudah jadi, siapa yang mengerjakan, bagian mana yang butuh TTE saya, dan jejak revisinya — bukan mengejar file Word di grup WA.”** — evidence: Waktu rata-rata Kepala SMP untuk kompilasi & koreksi 4 dokumen: 38–55 jam kerja per siklus (wawancara 8 Kepsek, 2024).
8. **“Saat akreditasi/pengawasan, pengawas bertanya: kegiatan RKAS ini menjawab indikator Rapor yang mana? Saya tidak bisa menjawab cepat karena jejaknya tidak tertulis.”** — evidence: Instrumen Akreditasi 2024 (IAP SMP) menagih ketertelusuran PBD; sekolah tanpa matriks traceability butuh 2–3 hari menyiapkan bukti.

---

## 4. Requirements (Grouped, Prioritized)

> Format: **[Persona] has [problem in use scenario] with [frequency]. Priority = Evidence (1–30) × Impact (1–5) = Priority.**

### GROUP A — Intake & Analisis Rapor Pendidikan (Single Source of Truth)
**Tujuan grup:** Menjadikan Rapor Pendidikan sebagai satu-satunya sumber kebenaran; impor sekali, pakai di semua dokumen.

1. **A-01 Impor Rapor Pendidikan 2025 (Excel 6-sheet, Sheet 2 = 113 baris) + Entri Manual Terpandu** — Kepala Sekolah/Wakasek has *“saya menerima Rapor Pendidikan sebagai Excel 6-sheet dari Rumah Pendidikan, tapi tidak ada tempat terstruktur untuk memindahkannya agar bisa dipakai RKJM/RKT”* with *setiap awal semester / tahun ajaran*. **Priority: 28 × 5 = 140.**
   - Acceptance: Upload **Excel 6-sheet PBD 2025** (`RAPOR-PBD-...-DATA-2025.xlsx`, diperbarui 12 Mar 2026). Parser otomatis:
     - **Sheet 2 Laporan Rapor (113 baris, 10 kolom)** sebagai **sumber utama** — No, Indikator, Capaian, Skor 2025, Definisi, Perubahan 2024→2025, Skor 2024, Peringkat Kab/Kota, Peringkat Nasional, Sumber Data. Total **18 indikator Level 1 + 74 subindikator Level 2 + proporsi detail**. Seed awal sudah tersedia di `data/rapor-2025.json`.
     - Sheet 2.1 Rekom Keseluruhan (46 baris) & Sheet 2.2 Rekom Prioritas (12 baris) sebagai bank prioritas.
     - Kolom Identifikasi/Akar Masalah/Benahi/Kegiatan ARKAS per indikator.
     - Validasi: skor 0–100/%, perubahan naik/turun/tidak tersedia, peringkat 1-20%/21-40%/dst. Fallback entri manual + impor PDF. Simpan file mentah + hasil parse + versi per tahun (2025, 2026...).
2. **A-02 Dashboard Analisis & Rekomendasi Prioritas (Identifikasi — Data Real 2025)** — Wakasek has *“saya butuh tahu indikator mana yang paling merah dan akar masalahnya”* with *tiap siklus PBD*. **Priority: 27 × 5 = 135.**
   - Acceptance: Visualisasi per indikator Level 1/2 dari data real 2025 (18 Lv1 + 74 Lv2): tren 2024→2025, peringkat Kab/Kota & Nasional, auto-flag. Contoh data awal: **A.2 Numerasi 84.44% (turun 4.45, peringkat bawah 81-100% kab)** & **A.2.4 Data & Ketidakpastian 59.61 (turun 6.54)** sebagai kandidat “Perlu Perbaikan Segera”; **E.3 Pemanfaatan TIK 50 (turun 38.15, peringkat bawah)**; sebaliknya **D.2 Refleksi guru 73.14 & D.3 Kepemimpinan 70.91 (peringkat atas 1-20%)** sebagai kekuatan. Saran akar masalah dari Sheet 2.2 (12 baris). Default tampilkan 12 Rekom Prioritas BBPMP; bank 46 Rekom Keseluruhan tersedia untuk observasi mandiri.
3. **A-03 SWOT / Analisis Konteks Terstruktur** — Wakasek has *“analisis SWOT kami naratif bebas, tidak tertaut ke data Rapor”* with *saat menyusun BAB II RKJM & Karakteristik KSP*. **Priority: 20 × 4 = 80.**
   - Acceptance: Form SWOT yang pre-fill kekuatan/kelemahan dari Rapor + data profil sekolah (jumlah rombel, guru, sarpras dari Dapodik manual); peluang/ancaman dari lingkungan; output narasi yang bisa diwariskan ke RKJM BAB II dan KSP Komponen 1.

### GROUP B — RKJM 4 Tahun (Perencanaan Jangka Menengah, PBD)
**Tujuan:** Menghasilkan RKJM yang bab-nya sesuai juknis terbaru dan setiap sasaran tertaut ke indikator Rapor.

4. **B-01 Generator RKJM Periode 2026–2030 Sesuai Struktur Resmi Kemendikdasmen** — Wakasek has *“saya takut salah struktur bab RKJM karena template berubah”* with *setiap 4 tahun + revisi tengah periode*. **Priority: 29 × 5 = 145.**
   - Periode: **RKJM 2026–2030** (4 tahun ajaran: 2026/2027, 2027/2028, 2028/2029, 2029/2030). Template mengacu **format resmi Kemendikdasmen 2025** (tidak ada template Dinas khusus — dikonfirmasi Kepala Sekolah).
   - Struktur baku (editable tapi terkunci default):
     - **BAB I** Pendahuluan (Rasional PBD, Dasar Hukum — Permendikbudristek 12/2024, Permendagri 77/2020, Juknis BOS — Tujuan, Ruang Lingkup 2026–2030)
     - **BAB II** Gambaran Umum & Analisis (Profil Sekolah, Kondisi Objektif, Analisis Rapor Pendidikan & SWOT)
     - **BAB III** Arah Kebijakan (Visi, Misi, Tujuan Jangka Menengah 2026–2030, Sasaran Strategis SMART & Indikator Keberhasilan)
     - **BAB IV** Program & Strategi (Prioritas Benahi dari Rapor, Strategi, Tahapan 4 Tahun)
     - **BAB V** Peta Jalan & Anggaran Indikatif 2026–2030 (matriks tahun × program × indikator × pagu indikatif — benchmark awal dari ARKAS 2026: Rp 628,28jt)
     - **BAB VI** Penutup & Mekanisme MONEV (Evaluasi tengah 2028 & akhir 2030, Penanggung Jawab, Risiko)
   - Acceptance: Setiap sasaran wajib memilih “Indikator Rapor Terkait” (dropdown dari Group A); sistem menolak simpan sasaran tanpa tautan Rapor (validasi PBD). Pagu indikatif Tahun 1 (2026/2027) pre-fill dari ARKAS 2026 sebagai acuan (`data/arkas-2026-reference.json`).
5. **B-02 Pewarisan Visi-Misi-Tujuan sebagai Master Data Sekolah** — Kepala Sekolah has *“Visi/Misi berubah, saya harus ubah 4 dokumen”* with *saat revisi Visi/Misi*. **Priority: 26 × 5 = 130.**
   - Acceptance: Visi/Misi/Tujuan disimpan sebagai **Master Data**; perubahan di RKJM otomatis menawarkan propagasi ke RKT/KSP (dengan konfirmasi & jejak versi). Riwayat versi + diff + alasan perubahan.
6. **B-03 Matriks Peta Jalan 2026–2030 (Gantt/Matrix)** — Kepala Sekolah has *“saya tidak bisa melihat 4 tahun sekaligus — mana program tahun 1, 2, 3, 4”* with *penyusunan & monev RKJM*. **Priority: 22 × 4 = 88.**
   - Acceptance: Tabel/matrix Tahun 1 (2026/27) – Tahun 4 (2029/30) × Program; seret-atur prioritas; pagu indikatif per tahun (baseline Tahun 1 = Rp 628,28jt dari ARKAS 2026); indikator keberhasilan tahunan (target angka, mis. Literasi 58→65→72→78).
7. **B-04 Validasi PBD Otomatis** — Wakasek has *“saya tidak tahu apakah RKJM saya sudah memenuhi kaidah PBD”* with *sebelum pengesahan*. **Priority: 24 × 4 = 96.**
   - Acceptance: Checklist otomatis: (a) setiap prioritas tertaut indikator Rapor merah/kuning, (b) setiap sasaran punya indikator SMART, (c) anggaran indikatif terisi, (d) penanggung jawab terisi. Status “Siap Disahkan” hanya jika 100% checklist hijau.

### GROUP C — RKT Tahunan (Turunan RKJM, Berbasis Evaluasi)
**Tujuan:** RKT bukan dokumen baru, melainkan turunan RKJM tahun berjalan + evaluasi tahun lalu.

8. **C-01 Buat RKT dari RKJM 2026–2030 (1-klik Turunan) + Evaluasi RKT Lalu — Maksimal 12 Prioritas** — Wakasek has *“saya menyusun RKT dari nol tiap tahun, lepas dari RKJM, dan tidak ada batasan jumlah jadi RKT kepanjangan”* with *tiap Juli/Agustus*. **Priority: 28 × 5 = 140.**
   - Acceptance: Tombol “Buat RKT 2026/2027 dari RKJM 2026–2030” (Tahun 1), “RKT 2027/2028” (Tahun 2), dst.; sistem menarik otomatis: Visi/Misi, Sasaran tahun terkait, Program prioritas tahun tersebut, Indikator. **Aturan Kepsek: maksimal 12 prioritas/tahun.** Saat menambah baris ke-13, sistem menolak dengan pesan: *“RKT maksimal 12 prioritas per tahun — sesuai arahan Kepala Sekolah. Hapus atau gabungkan prioritas sebelum menambah.”* Counter `7/12` tampil di header Lembar Kerja RKT. Form evaluasi RKT sebelumnya (capaian vs target, kendala) wajib diisi sebelum RKT baru bisa disahkan. Pola kegiatan kesiswaan dari ARKAS 2026 (30+ kegiatan) & benahi dari Sheet 2.2 tersedia sebagai **Bank Kegiatan** untuk dipilih, bukan diketik ulang.
9. **C-02 Struktur RKT Resmi + Rincian Kegiatan SMART (Maks. 12 Baris)** — Wakasek has *“kegiatan RKT kami masih umum (‘pelatihan guru’) tanpa volume, sasaran, dan indikator”* with *tiap penyusunan RKT*. **Priority: 25 × 5 = 125.**
   - Struktur (mengacu **Sheet 3 Lembar Kerja RKT** di Excel: No | Identifikasi | Akar Masalah | Kegiatan Benahi | Penjelasan Implementasi | Biaya Ya/Tidak):
     - BAB I Pendahuluan (Evaluasi RKT Lalu, Dasar Penyusunan — sumber: Sheet 2 data real)
     - BAB II Tujuan & Sasaran Tahunan (turunan RKJM + target tahun ini)
     - BAB III Program & Kegiatan Prioritas — **maksimal 12 baris** (per kegiatan: Identifikasi (kode Sheet 2, mis. A.2 Numerasi), Akar Masalah (A.2.4 Data & Ketidakpastian), Kegiatan Benahi (mis. “Tingkatkan kompetensi guru domain data & ketidakpastian”), Penjelasan Implementasi (rincian spesifik), Biaya Ya/Tidak)
     - BAB IV Penutup & Rencana Monev Tahunan
   - Acceptance: Setiap kegiatan wajib tautkan ke 1 sasaran RKJM + 1 indikator Rapor (kode Sheet 2); ≤12 baris (validasi hard stop); kolom Biaya menentukan apakah baris diteruskan ke Lembar Kerja ARKAS (Sheet 4). Indikator kegiatan harus terukur.
10. **C-03 Timeline & PIC (Gantt Sederhana)** — Kepala Sekolah has *“saya tidak tahu kegiatan mana molor dan siapa PIC-nya”* with *pemantauan triwulan*. **Priority: 18 × 4 = 72.**
    - Acceptance: Timeline Gantt per kegiatan (Q1–Q4), PIC (Wakasek/Bendahara/Guru), status (Belum-Mulai / Proses / Selesai), dan catatan monev.

### GROUP D — RKAS Berbasis Kegiatan (Refinement dengan Data ARKAS/BOS, Tanpa Integrasi Tulis)
**Tujuan:** RKAS lahir dari kegiatan RKT; data ARKAS/BOS dipakai sebagai **referensi memperkaya rincian**, bukan sinkronisasi dua arah.

11. **D-01 Generate Kerangka RKAS dari RKT (Hanya Baris “Biaya = Ya”)** — Bendahara has *“saya menyusun RKAS terpisah dari RKT, jadi sering tidak nyambung”* with *tiap penyusunan RKAS (murni & perubahan)*. **Priority: 29 × 5 = 145.**
    - Acceptance: Hanya baris RKT dengan **Biaya = Ya** (Sheet 3, kolom F) yang diteruskan ke **Sheet 4 Lembar Kerja ARKAS**: Kegiatan Benahi → Penjelasan Implementasi → Kegiatan ARKAS (padanan BOS, mis. “Peningkatan kompetensi guru...”) → Uraian Kegiatan ARKAS (barang/jasa) → Bulan Dianggarkan → Jumlah/Satuan/Harga/Total. Dari 12 prioritas RKT, yang butuh biaya mungkin hanya 8–10 baris — sisanya (“Tidak” butuh biaya) tidak masuk RKAS. Untuk RKT 2026/2027, referensi harga dari **ARKAS 2026** (total Rp 628,28jt, 197 baris) sebagai acuan.
12. **D-02 Rincian Anggaran dengan Referensi ARKAS 2026 (Read-Reference)** — Bendahara has *“saya harus buka file ARKAS/BOS terpisah untuk cari kode rekening yang benar”* with *tiap rincian belanja*. **Priority: 27 × 5 = 135.**
    - Acceptance:
      - Panel **Referensi ARKAS 2026** (read-only): tabel kode rekening dari **RKA SMPN 5 Tegal TA 2026** (197 baris, total Rp 628,28jt — `data/arkas-2026-reference.json`) dengan mapping **SIPD (Permendagri 77) ↔ ARKAS BOS Kemdikbud (5.1.02.xx)**. Pencarian kode/nama barang, harga satuan referensi (contoh: Kertas HVS Folio 70gr Rp 69.100/rim, Tinta Whiteboard Rp 18.200/botol, Cetak Soal Rp 300/lembar).
      - Saat merinci belanja, pengguna pilih kode referensi → otomatis isi nama komponen, satuan, dan harga referensi; tetap bisa edit harga satuan aktual.
      - Hitung otomatis: Volume × Harga Satuan × Frekuensi = Jumlah; rekap per kegiatan, per komponen 8 SNP, per triwulan, dan total.
      - **Tidak ada** koneksi tulis ke ARKAS; ekspor RKAS ke Excel berformat kompatibel ARKAS/SIPD (untuk diimpor manual ke ARKAS bila perlu) — dinyatakan jelas di UI.
13. **D-03 Struktur RKAS Resmi + Rekap Triwulan & Sumber Dana** — Bendahara has *“format RKAS kami sering ditolak karena rekap tidak sesuai Juknis”* with *tiap pengesahan RKAS*. **Priority: 26 × 5 = 130.**
    - Struktur: Pendapatan (BOS Reguler, BOSDA, Komite, dll) → Belanja per Kegiatan RKT → Rekap per 8 SNP → Rekap per Kode BOS (SIPD + ARKAS) → Jadwal Triwulan (TW1–TW4) → Pengesahan.
    - Acceptance: Validasi pagu (total belanja = total pendapatan — benchmark awal Rp 628,28jt dari ARKAS 2026), validasi triwulan (distribusi 100%), flag bila belanja modal > ambang BOS. File RKA 2026 tidak memuat sisi pendapatan — pendapatan diisi manual di form RKAS.
14. **D-04 Versi RKAS (Murni, Perubahan 1/2) + Diff** — Bendahara has *“file RKAS berceceran, saya bingung mana yang terbaru”* with *perubahan anggaran*. **Priority: 20 × 4 = 80.**
    - Acceptance: Versioning (Murni → Perubahan 1 → Perubahan 2); diff view (apa yang berubah, selisih pagu); jejak alasan perubahan.

### GROUP E — KSP Kurikulum Merdeka (Sinkron dengan RKJM/RKT)
**Tujuan:** KSP bukan dokumen terpisah — ia mewarisi konteks, Visi/Misi, dan program pembelajaran dari RKJM/RKT.

15. **E-01 Generator KSP Sesuai Panduan 2024 (5 Komponen)** — Wakasek Kurikulum has *“struktur KSP terbaru membingungkan, dan KSP kami tidak nyambung dengan RKT”* with *tiap penyusunan/revisi KSP*. **Priority: 28 × 5 = 140.**
    - Struktur baku 2024 (diperbarui **Permendikdasmen 13/2025** — *ringkasan Kemendikdasmen*: **Profil Pelajar Pancasila → Profil Lulusan (8 dimensi)**, mapel pilihan **Koding & Kecerdasan Artifisial (KA)** bertahap mulai 2025/2026 (SD kls 5–6, SMP kls 7), **pembelajaran mendalam (deep learning)**, **kokurikuler disederhanakan & terintegrasi proyek/tematik**, **ekstrakurikuler wajib berbasis kepanduan** — penyesuaian KSP di v1.2 mencerminkan ini):
      - **Komponen 1 — Karakteristik Satuan Pendidikan:** Analisis konteks (dari BAB II RKJM + SWOT + data profil), karakteristik peserta didik, pendidik, lingkungan.
      - **Komponen 2 — Visi, Misi, Tujuan:** Diwarisi dari Master Data (Group B-02) yang sudah diselaraskan ke **Profil Lulusan 2025**; edit terpusat, propagasi dengan konfirmasi.
      - **Komponen 3 — Pengorganisasian Pembelajaran:** Intrakurikuler (struktur Fase D SMP, alokasi JP, CP/TP/ATP; termasuk **Koding & KA kelas 7** bila dipilih sekolah), Kokurikuler **(P5 yang kini terintegrasi ke Profil Lulusan — istilah di dokumen 2025: Kokurikuler/Projek berbasis Profil Lulusan)**, Ekstrakurikuler (wajib kepanduan/Pramuka + pilihan). Matriks mapel vs JP vs Fase, dengan flag kokurikuler yang sudah disederhanakan.
      - **Komponen 4 — Rencana Pembelajaran:** Prinsip **pembelajaran mendalam**, berdiferensiasi, kontekstual, asesmen (formatif/sumatif), strategi, kalender akademik.
      - **Komponen 5 — Pendampingan, Evaluasi, Pengembangan Profesional:** Monev KSP, refleksi, tindak lanjut (taut ke evaluasi RKT).
    - Acceptance: Setiap program kokurikuler (P5/Profil Lulusan) & intrakurikuler wajib tautkan ke kegiatan RKT terkait (dropdown); validasi kelengkapan 5 komponen termasuk cek **kekosongan mapel wajib, kepanduan, dan Koding/KA (opsional)** sebelum “Siap Disahkan”.
16. **E-02 Bank CP/TP/ATP Fase D SMP (Referensi Kurikulum Merdeka — CP Terbaru 2025/2026)** — Guru Mapel has *“saya kesulitan menurunkan CP Fase D menjadi TP dan ATP yang runtut, apalagi CP-nya baru direvisi 2025/2026”* with *penyusunan intrakurikuler KSP*. **Priority: 24 × 4 = 96.**
    - Acceptance:
      - Bank CP Fase D per mapel merujuk hierarki regulasi terbaru (dipilih berdasar tahun ajaran KSP):
        - **Baseline:** Kep Kepala **BSKAP No. 008/H/KR/2022** jo. **032/H/KR/2024** tentang CP (Kurikulum Merdeka) — sumber CP Fase D SMP sebelum 2025.
        - **Berlaku 16 Juli 2025:** **Kep Kepala BSKAP No. 046/H/KR/2025** — Perubahan atas Kep 032/2024 tentang CP (PAUD–Dikdasmen). Berlaku mulai 16 Juli 2025 (info Kepsek). Di aplikasi: jadi **default untuk KSP TA 2025/2026**.
        - **Berlaku TA 2026/2027:** **Kep BKPDM No. 020/2026 & 021/2026** — Penyempurnaan CP. Klarifikasi resmi 29 Juni 2026: **hanya CP Pendidikan Agama & Budi Pekerti (semua agama) yang berubah**; CP mapel lain **tetap merujuk Kep 046/2025**. Di aplikasi: auto-apply patch 020/2026 hanya untuk mapel Agama/Budi Pekerti bila tahun ajaran ≥ 2026/2027.
        - Payung kurikulum: **Permendikdasmen No. 13/2025** (perubahan Permendikbudristek 12/2024) — menegaskan tidak ada ganti kurikulum; Kurikulum Merdeka & K13 tetap berlaku 2025/2026; menambahkan **Koding & KA** sebagai mapel pilihan.
      - Form bantu menurunkan CP → TP → ATP per kelas 7/8/9; ATP bisa dikaitkan ke kegiatan RKT/KSP.
      - **Fitur kepatuhan:** Banner “CP Agama/Budi Pekerti TA 2026/2027 telah diperbarui (Kep 020/2026) — periksa kembali TP/ATP Agama” muncul otomatis bila KSP tahun ≥ 2026/2027.
      - Sumber unduhan CP di UI tautkan ke `guru.kemendikdasmen.go.id/dokumen` & `kurikulum.kemendikdasmen.go.id` (bukan hard-code isi CP — isi CP di-update via impor).
17. **E-03 Sinkronisasi KSP ↔ RKT (Jejak Keterkaitan)** — Kepala Sekolah has *“saya tidak bisa membuktikan KSP kami mendukung program prioritas RKT”* with *akreditasi & supervisi*. **Priority: 22 × 4 = 88.**
    - Acceptance: Tabel sinkronisasi: Program KSP (P5, intrakurikuler) ↔ Kegiatan RKT ↔ Indikator Rapor; auto-generate narasi keterkaitan untuk BAB KSP.

### GROUP F — Orkestrasi & Kepatuhan Alur Kemendikbud (Workflow Engine)
**Tujuan:** Menjaga urutan yang benar: Rapor → RKJM → RKT → RKAS → KSP, dengan guardrail.

18. **F-01 Workflow Terpandu (Wizard) Sesuai Alur PBD** — Kepala Sekolah has *“saya takut urutan dokumen salah — ada yang menyusun RKAS dulu baru RKT”* with *tiap siklus*. **Priority: 26 × 5 = 130.**
    - Acceptance: Stepper visual: `Rapor (Selesai?) → RKJM (Sah?) → RKT (Sah?) → RKAS (Sah?) → KSP (Sah?)`. Tombol “Buat RKT” nonaktif bila RKJM belum sah; “Buat RKAS” nonaktif bila RKT belum sah. Pesan panduan eksplisit bila mencoba melompat.
19. **F-02 Validasi Silang Otomatis (Cross-Document Integrity)** — Pengawas has *“saya menemukan angka target di RKT tidak sama dengan di RKAS”* with *verifikasi*. **Priority: 23 × 4 = 92.**
    - Acceptance: Engine cek: (a) Visi/Misi konsisten, (b) setiap kegiatan RKAS punya induk RKT, (c) total anggaran RKAS = pagu RKT, (d) setiap kegiatan RKT tertaut indikator Rapor, (e) P5 di KSP tertaut kegiatan RKT. Laporan “Health Check” dengan status Merah/Kuning/Hijau.
20. **F-03 Jejak Perubahan & Alasan (Audit Trail)** — Kepala Sekolah has *“saya tidak tahu siapa mengubah angka anggaran dan kapan”* with *setiap revisi*. **Priority: 20 × 4 = 80.**
    - Acceptance: Log per dokumen: siapa, kapan, field apa, nilai lama→baru, alasan; diff view; rollback ke versi sebelumnya (dengan konfirmasi).

### GROUP G — Output Dokumen, TTE & Arsip Digital
21. **G-01 Export PDF/Word Sesuai Template Dinas (Kop, Nomor, Daftar Isi, TTD)** — Kepala Sekolah has *“hasil aplikasi harus langsung bisa dicetak dan ditandatangani, bukan file mentah”* with *tiap pengesahan*. **Priority: 28 × 5 = 140.**
    - Acceptance: Export per dokumen (RKJM/RKT/RKAS/KSP) ke PDF & DOCX dengan: Kop SMPN 5 Tegal, Nomor Dokumen, Tahun, Daftar Isi otomatis, penomoran bab, tabel & grafik, halaman pengesahan (Kepala Sekolah, Ketua Komite, Pengawas), dan QR verifikasi versi. Template editable (header/footer).
22. **G-02 Cetak & Tanda Tangan Manual + Arsip Digital (File Tetap Tersedia)** — Kepala Sekolah has *“semua dokumen nanti dicetak dan ditandatangani manual — tapi file tahun lalu harus tetap ada dan bisa dibuka”* with *tiap pengesahan & arsip tahunan*. **Priority: 20 × 4 = 80.**
    - Acceptance:
      - **Mode utama v1.2: Cetak Manual.** Export PDF/DOCX (G-01) → cetak → tanda tangan basah → **upload scan hasil tanda tangan** (PDF/JPG) sebagai **Lampiran Pengesahan** yang terikat ke versi dokumen (mis. RKJM 2026–2030 v1.0 + Scan Pengesahan). Status: `Draft → Siap Cetak → Menunggu Scan Pengesahan → Sah (scan terlampir) → Diarsipkan`.
      - **TTE opsional (non-wajib):** Upload tanda tangan scan untuk preview di PDF “Siap Cetak” (watermark “Belum Ditandatangani Basah” bila belum ada scan). Tidak ada ketergantungan TTE tersertifikasi PSrE di v1.2.
      - Paraf berjenjang tetap didukung sebagai checklist: Penyusun → Wakasek → Kepala Sekolah → Komite → Pengawas (read-only + komentar).
23. **G-03 Matriks Ketertelusuran (Traceability Matrix) Otomatis** — Kepala Sekolah has *“saya butuh satu tabel yang membuktikan benang merah Rapor → RKJM → RKT → RKAS → KSP”* with *akreditasi*. **Priority: 22 × 5 = 110.**
    - Acceptance: Tabel otomatis: Indikator Rapor (merah) → Sasaran RKJM → Kegiatan RKT → Uraian RKAS (kode BOS, pagu) → Program KSP; export sebagai lampiran PDF/Excel.
24. **G-04 Arsip Digital Tahunan & Pencarian (File Tahun Lalu Tetap Ada)** — Wakasek has *“tahun depan file tahun lalu harus tetap ada — saya butuh buka RKAS 2026 saat menyusun RKAS 2027”* with *tiap tahun ajaran baru & audit*. **Priority: 16 × 3 = 48.**
    - Acceptance:
      - **Arsip per tahun ajaran tidak pernah dihapus/overwrite:** RKJM 2026–2030, RKT 2026/2027, RKAS 2026/2027, KSP 2026/2027 tetap utuh saat RKT/RKAS/KSP 2027/2028 dibuat. Navigasi arsip: pilih Tahun Ajaran → Jenis Dokumen → Versi.
      - Setiap versi menyimpan: file export PDF/DOCX, scan pengesahan (G-02), matriks G-03, metadata (tanggal sah, penanda tangan).
      - Pencarian full-text lintas tahun; filter Tahun, Jenis, Status (Draft/Siap Cetak/Menunggu Scan/Sah/Diarsipkan); perbandingan tahun (mis. “Lihat RKT 2026/2027 vs 2027/2028”).
      - Backup `.zip` per tahun ajaran (H-03) mencakup arsip + scan — restore tidak menimpa tahun lain.

### GROUP H — Dashboard Kepala Sekolah & Tata Kelola
25. **H-01 Dashboard Eksekutif Kepala Sekolah** — Kepala Sekolah has *“saya ingin sekali lihat semua progres di satu layar”* with *harian/mingguan di musim perencanaan*. **Priority: 27 × 5 = 135.**
    - Acceptance: Kartu status 4 dokumen (progress %, status, PIC, tenggat), Health Check, Kalender Tenggat (RKJM 4 tahun, RKT Juli, RKAS Agustus, KSP Juli), Notifikasi “Butuh TTE Anda”, Ringkasan Rapor (indikator merah).
26. **H-02 Manajemen Pengguna & Peran (RBAC Sederhana)** — Kepala Sekolah has *“saya tidak ingin semua orang bisa mengubah anggaran”* with *pengaturan awal*. **Priority: 22 × 4 = 88.**
    - Acceptance: Peran: Kepala Sekolah (approve semua + TTE), Wakasek Kurikulum (RKJM/RKT/KSP), Bendahara (RKAS), Guru (kontribusi CP/TP/ATP), Pengawas (read-only + komentar). Hak akses per dokumen & per aksi.
27. **H-03 Mode Offline-First & Backup Lokal** — Bendahara has *“internet sekolah sering putus saat menyusun RKAS”* with *harian*. **Priority: 18 × 4 = 72.**
    - Acceptance: Aplikasi jalan 100% lokal/offline (data di perangkat/workspace ini); ekspor backup `.zip` (database + file); impor restore; tidak ada ketergantungan cloud wajib.

---

## 5. Use Scenarios (Day-in-the-Life)

### Skenario 1 — “Awal Tahun: Dari Rapor Merah ke RKJM 2026–2030 yang Sah” (Juli 2026)
**Aktor:** Kepala Sekolah + Wakasek Kurikulum. **Frekuensi:** Tiap 4 tahun (periode 2026–2030).  
Pagi ini Kepala Sekolah menerima Rapor Pendidikan 2025 (rilis 18 Maret 2025 via Rumah Pendidikan, format 6-sheet): Literasi “Perlu Perbaikan (58)”, Iklim Keamanan “Sedang (68)”. Tanpa aplikasi, Wakasek harus menyalin dari Sheet 2/2.1/2.2 ke Word, menebak prioritas, mengetik RKJM 80 halaman dari nol.  
**Dengan aplikasi:** Wakasek mengimpor Excel 6-sheet (A-01) → Dashboard (A-02) langsung menandai Literasi & Iklim merah + saran akar masalah dari Sheet 2.2 Rekom Prioritas → buka Wizard RKJM 2026–2030 (B-01, F-01), Visi/Misi terisi dari Master Data, SWOT pre-fill dari Rapor → merumuskan 4 sasaran SMART tertaut indikator Rapor → isi Peta Jalan 2026–2030 (B-03) dengan pagu indikatif Tahun 1 pre-fill Rp 628,28jt dari ARKAS 2026 → Health Check hijau → Export PDF “Siap Cetak” (G-01) → cetak & tanda tangan basah → upload scan pengesahan (G-02) → status Sah. Waktu 3 minggu → 4–5 hari + file arsip permanen (G-04).

### Skenario 2 — “Turunan RKT yang Tidak Lepas dari RKJM 2026–2030” (Juli 2027 — RKT Tahun 2)
**Aktor:** Wakasek Kurikulum. **Frekuensi:** Tahunan.  
Wakasek menyusun RKT 2027/2028 (Tahun 2 dari RKJM 2026–2030). Tanpa aplikasi, ia copy-paste sasaran Tahun 2 dari file RKJM.  
**Dengan aplikasi:** Klik “Buat RKT 2027/2028 dari RKJM 2026–2030” (C-01) → sistem menarik sasaran Tahun 2 + indikator → Wakasek isi evaluasi RKT 2026/2027 (wajib, data masih ada karena G-04 arsip permanen) → merinci 12 kegiatan prioritas (C-02) — sebagian dipilih dari Bank Kegiatan (pola ARKAS 2026: MPLS, LDKS, TEF, lomba) → masing-masing tertaut sasaran RKJM & indikator Rapor → Gantt Q1–Q4 & PIC (C-03) → Health Check (F-02) → Export PDF Siap Cetak → cetak & tanda tangan basah → upload scan → Sah. Guardrail F-01 mencegah RKT lepas dari RKJM.

### Skenario 3 — “Merinci RKAS 2026/2027 Tanpa Salah Kode — Pakai Data ARKAS 2026” (Agustus 2026)
**Aktor:** Bendahara BOS. **Frekuensi:** 1× murni + 1–2× perubahan per tahun.  
Bendahara biasanya buka RKA SIPD + RKT Word bersamaan, cari kode manual. Tahun ini ia punya **RKA 2026 Rp 628,28jt** sebagai referensi.  
**Dengan aplikasi:** Klik “Generate RKAS dari RKT 2026/2027” (D-01) → 12 kegiatan RKT jadi kerangka RKAS → untuk setiap uraian, cari di Panel Referensi ARKAS 2026 (D-02) “ATK” → pilih kode 5.1.02.01.01.0024 (atau mapping SIPD 5.1.02.01.01.00.24) → harga referensi terisi (mis. Kertas HVS Folio Rp 69.100/rim dari ARKAS 2026) → sesuaikan harga aktual → Volume×Harga×Frekuensi otomatis → rekap per 8 SNP & triwulan (D-03) → validasi pagu (benchmark Rp 628,28jt) hijau → Export Excel kompatibel ARKAS/SIPD + PDF Siap Cetak → cetak & tanda tangan basah → upload scan pengesahan (G-02) → Sah. File RKAS 2026 tetap ada saat susun RKAS 2027 (G-04). Saat Perubahan 1, buat versi baru (D-04) dengan diff.

### Skenario 4 — “KSP yang Lahir dari RKT, Bukan Dokumen Terpisah” (Juli 2027)
**Aktor:** Wakasek Kurikulum + Guru Mapel. **Frekuensi:** Tahunan (revisi).  
Wakasek menyusun KSP 2027/2028. Tanpa aplikasi, KSP diketik terpisah, P5 tidak tertaut RKT, CP/TP/ATP Fase D tidak runtut.  
**Dengan aplikasi:** Klik “Buat KSP 2027/2028” (E-01) → Karakteristik Sekolah & Visi/Misi terisi dari RKJM/RKT (E-03) → Wakasek menyusun Pengorganisasian Pembelajaran: struktur Fase D (termasuk **Koding & KA kelas 7** bila dipilih, sesuai Permendikdasmen 13/2025), 3 tema kokurikuler/Projek (Profil Lulusan — dulu P5) yang masing-masing ditautkan ke kegiatan RKT (mis. “Gaya Hidup Berkelanjutan” ↔ Kegiatan RKT “Penguatan Literasi Lingkungan”) → Guru Mapel mengisi TP/ATP dari Bank CP Fase D (E-02) — bila KSP Agama, sistem ingatkan patch **Kep BKPDM 020/2026** telah berlaku → Health Check pastikan 5 komponen + ekstrakurikuler kepanduan wajib terisi → Export PDF Siap Cetak → cetak & tanda tangan basah → upload scan → Sah + Lampiran Matriks Ketertelusuran (G-03) untuk akreditasi. File KSP 2026/2027 tetap ada (G-04).

---

## 6. Requirements Summary

| Req | Nama Requirement | Persona | Evidence (1–30) | Impact (1–5) | Priority | Grup | Urutan Grup |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- | ---: |
| B-01 | Generator RKJM 2026–2030 + Taut Rapor + Pagu ARKAS 2026 | Wakasek | 29 | 5 | **145** | B | 1 |
| D-01 | Generate Kerangka RKAS dari RKT (seed ARKAS 2026) | Bendahara | 29 | 5 | **145** | D | 1 |
| A-01 | Impor Rapor Pendidikan | Wakasek | 28 | 5 | **140** | A | 1 |
| C-01 | Buat RKT dari RKJM (1-klik) | Wakasek | 28 | 5 | **140** | C | 1 |
| E-01 | Generator KSP 5 Komponen 2024 | Wakasek | 28 | 5 | **140** | E | 1 |
| G-01 | Export PDF/DOCX Template Dinas | Kepsek | 28 | 5 | **140** | G | 1 |
| A-02 | Dashboard Analisis & Rekomendasi PBD | Wakasek | 27 | 5 | **135** | A | 2 |
| D-02 | Rincian RKAS + Referensi ARKAS 2026 (SIPD↔ARKAS mapping) | Bendahara | 27 | 5 | **135** | D | 2 |
| H-01 | Dashboard Eksekutif Kepsek | Kepsek | 27 | 5 | **135** | H | 1 |
| B-02 | Master Data Visi/Misi (Pewarisan) | Kepsek | 26 | 5 | **130** | B | 2 |
| D-03 | Struktur RKAS + Rekap TW & 8 SNP | Bendahara | 26 | 5 | **130** | D | 3 |
| F-01 | Workflow Wizard PBD (Guardrail) | Kepsek | 26 | 5 | **130** | F | 1 |
| C-02 | Struktur RKT + Kegiatan SMART | Wakasek | 25 | 5 | **125** | C | 2 |
| G-03 | Matriks Ketertelusuran Otomatis | Kepsek | 22 | 5 | **110** | G | 2 |
| B-04 | Validasi PBD Otomatis | Wakasek | 24 | 4 | **96** | B | 3 |
| E-02 | Bank CP/TP/ATP Fase D | Guru | 24 | 4 | **96** | E | 2 |
| F-02 | Validasi Silang Antar-Dokumen | Pengawas | 23 | 4 | **92** | F | 2 |
| B-03 | Peta Jalan 4 Tahun (Matrix) | Kepsek | 22 | 4 | **88** | B | 4 |
| E-03 | Sinkronisasi KSP ↔ RKT | Kepsek | 22 | 4 | **88** | E | 3 |
| H-02 | RBAC Sederhana | Kepsek | 22 | 4 | **88** | H | 2 |
| A-03 | SWOT Terstruktur | Wakasek | 20 | 4 | **80** | A | 3 |
| D-04 | Versi RKAS + Diff | Bendahara | 20 | 4 | **80** | D | 4 |
| F-03 | Audit Trail & Rollback | Kepsek | 20 | 4 | **80** | F | 3 |
| G-02 | Cetak Manual + Scan Pengesahan & Arsip | Kepsek | 20 | 4 | **80** | G | 3 |
| C-03 | Timeline & PIC Gantt | Kepsek | 18 | 4 | **72** | C | 3 |
| H-03 | Offline-First & Backup Lokal | Bendahara | 18 | 4 | **72** | H | 3 |
| G-04 | Arsip Tahunan (File Tahun Lalu Tetap Ada) | Wakasek | 16 | 3 | **48** | G | 4 |

> **Urutan implementasi yang disarankan (berdasar Priority & dependensi):** A-01 → A-02 → B-01/B-02 → F-01 → C-01/C-02 → D-01/D-02/D-03 → E-01 → G-01/G-03 → H-01 → F-02 → sisanya iteratif.

---

## 7. Out of Scope / Non-Goals (v1.0)

- **Integrasi tulis langsung ke ARKAS/BOS/SIPD** — v1.0 hanya **membaca referensi** ARKAS 2026 (seed `data/arkas-2026-reference.json` + mapping SIPD↔ARKAS); ekspor Excel kompatibel ARKAS/SIPD untuk impor manual. Tidak ada API write ke ARKAS/SIPD.
- **Sinkronisasi otomatis Dapodik / e-Rapor** — Data profil sekolah (rombel, GTK, sarpras) diisi manual/Excel impor di v1.0.
- **Manajemen BOS penatausahaan (SPJ, BKU, LPJ)** — Fokus v1.0 adalah **perencanaan** (RKAS), bukan penatausahaan/realisasi.
- **Multi-sekolah / Dinas dashboard** — v1.0 single-tenant untuk SMPN 5 Tegal; tidak ada agregasi tingkat Dinas.
- **AI generatif penulisan narasi otomatis penuh** — v1.0 hanya saran prioritas & pre-fill; narasi tetap ditulis/divalidasi manusia (kepatuhan regulasi).
- **Aplikasi mobile native** — v1.0 web/desktop lokal responsif; mobile hanya untuk view & TTE ringan bila sempat.
- **TTE tersertifikasi PSrE/BSSN** — v1.0 TTE sederhana (scan + cap waktu + hash versi); integrasi TTE tersertifikasi ditunda ke v2.0.

---

## 8. Success Metrics

| Kategori | Metrik | Kondisi Saat Ini (Baseline 2024/2025) | Target v1.0 (2027) | Cara Ukur |
| :--- | :--- | :--- | :--- | :--- |
| **Value** | Waktu penyusunan 4 dokumen (Rapor→RKJM→RKT→RKAS→KSP) | 38–55 jam kerja/orang/siklus | ≤ 15 jam (↓ ≥60%) | Time-tracking siklus perencanaan |
| **Value** | Revisi dokumen karena inkonsistensi/tidak sesuai template | 2–3 revisi mayor/siklus | 0–1 revisi minor | Jumlah versi sebelum “Sah” |
| **Quality** | % sasaran RKJM/RKT yang tertaut eksplisit ke indikator Rapor | ~34% (nasional) | 100% (validasi sistem) | Laporan Health Check |
| **Quality** | % KSP yang lolos validasi 5 Komponen 2024 tanpa revisi struktur | ~33% | 100% | Checklist E-01 |
| **Quality** | % RKAS yang lolos validasi kode BOS & pagu tanpa revisi verifikator | ~55% (1–2 revisi) | ≥90% lolos di submit pertama | Log verifikasi (benchmark pagu Rp 628,28jt ARKAS 2026) |
| **Progress** | Waktu Kepala Sekolah untuk review & TTE | 6–10 jam (mencari file & koreksi) | ≤ 2 jam (Dashboard H-01) | Log aktivitas Kepsek |
| **Progress** | Kesesuaian urutan PBD (Rapor→RKJM→RKT→RKAS→KSP) | 57% taat urutan | 100% (guardrail F-01) | Audit trail workflow |
| **Satisfaction** | Kepuasan Kepala Sekolah & Wakasek (CSAT) | Belum diukur | ≥ 4,5 / 5 | Survei setelah 1 siklus |
| **Satisfaction** | Kepercayaan Pengawas terhadap ketertelusuran (traceability) | Butuh 2–3 hari siapkan bukti | ≤ 15 menit (export G-03) | Uji simulasi akreditasi |

**Kriteria “Definition of Done” rilis v1.0:** 1 siklus penuh (Rapor 2025 → RKJM 2026–2030 → RKT 2026/2027 → RKAS 2026/2027 dengan pagu Rp 628,28jt sebagai benchmark → KSP 2026/2027) berhasil dieksekusi di SMPN 5 Tegal, diekspor PDF, ditandatangani, dan lolos simulasi monev Pengawas tanpa temuan struktur.

---

## 9. Dependencies & Risks

| # | Dependency / Risk | Dampak | Mitigasi |
| :--- | :--- | :--- | :--- |
| 1 | **Regulasi berubah** (Permendikdasmen baru, template KSP/RKJM/RKAS 2027) | Template v1.0 usang, dokumen ditolak | Arsitektur **template-driven**: struktur bab & field disimpan sebagai konfigurasi (JSON), bukan hard-code. Update template tanpa ubah kode. Sediakan “Mode Kompatibilitas” (pilih tahun regulasi: 2025 vs 2026/2027). |
| 2 | **Format Rapor Pendidikan 6-sheet berubah** | Parser impor gagal | Parser 6-sheet PBD 2025 (Sheet 1–4) toleran + fallback entri manual (A-01); simpan mapping kolom per versi Rapor; uji dengan sampel Rapor 2025 SMP. |
| 3 | **Referensi kode BOS/ARKAS/SIPD berubah tiap tahun** | Kode RKAS tidak valid | Panel Referensi BOS dapat diimpor ulang tiap tahun (Excel); seed awal 2026 dari `arkas-2026-reference.json` (197 baris, Rp 628,28jt); mapping SIPD↔ARKAS; warning “Kode tidak ada di referensi 2026 — periksa”. |
| 4 | **Literasi digital staf terbatas** | Adopsi lambat, salah isi | Wizard terpandu (F-01), placeholder & contoh isi per field, validasi inline dengan pesan bahasa Indonesia yang jelas, pelatihan 1 hari + video 10 menit per dokumen. |
| 5 | **Data sensitif anggaran (BOS) bocor** | Risiko hukum & kepercayaan | Aplikasi **offline-first** (H-03), data hanya di perangkat sekolah; tidak ada upload cloud wajib; backup terenkripsi; RBAC (H-02) batasi akses RKAS hanya Bendahara & Kepsek. |
| 6 | **Kepala Sekolah sering dinas luar** | TTE tertunda | TTE dapat dilakukan dari perangkat mana saja (web responsif) + notifikasi WA/Email “Menunggu TTE”; delegasi paraf sementara (Plh). |
| 7 | **Scope creep — ingin sekalian SPJ/BKU** | v1.0 molor | Tegakkan Out of Scope (§7); backlog SPJ untuk v2.0; tampilkan roadmap di Dashboard. |
| 8 | **Kinerja aplikasi di perangkat sekolah (spesifikasi rendah)** | Lambat, gagal export PDF | Target: jalan di laptop 4GB RAM, Chrome/Edge terbaru; export PDF di-render lokal (tanpa server); uji di 2 perangkat real SMPN 5 Tegal. |

---

## 10. Approvals

| Nama | Jabatan | Tanggal | Tanda Tangan |
| :--- | :--- | :--- | :--- |
|  | Kepala SMP Negeri 5 Tegal (Product Owner) |  |  |
|  | Wakasek Kurikulum / Ketua TPS |  |  |
|  | Bendahara BOS |  |  |
|  | Pengawas Pembina SMP |  |  |
|  | Tim Pengembang (Dev Lead) |  |  |

*Tanda tangan menandakan persetujuan terhadap ruang lingkup v1.0, prioritas, dan kriteria done di §8. Perubahan setelah ini dicatat di §11.*

---

## 11. Change Tracking

| Versi | Tanggal | Perubahan | Alasan |
| :--- | :--- | :--- | :--- |
| 1.0 | 15 Okt 2026 | Initial draft — PRD lengkap SMPN 5 Tegal, alur PBD terintegrasi, RKAS referensi ARKAS (read-only), KSP 2024 5 komponen | Kickoff sesuai arahan Kepala Sekolah |
| 1.1 | 15 Okt 2026 | Update periode RKJM 2026–2030, format Excel 6-sheet PBD 2025, seed data ARKAS 2026 Rp 628,28jt (197 baris, mapping SIPD↔ARKAS), analisis `data/arkas-2026-analysis.md` | Konfirmasi Kepsek: tidak ada template Dinas, RKJM 2026–2030, data ARKAS 2026 |
| 1.2 | 15 Okt 2026 | Q5: Cetak manual + scan pengesahan & arsip tahunan permanen (G-02/G-04). Q6: CP Fase D hierarki terbaru — Kep BSKAP 046/2025 (16 Jul 2025) + Kep BKPDM 020/2026 (hanya Agama/Budi Pekerti, TA 2026/2027) & Permendikdasmen 13/2025 (Koding & KA, Profil Lulusan, kokurikuler, kepanduan) | Konfirmasi Kepsek Q5 & Q6 — semua dokumen dicetak manual, file tahun lalu tetap ada; CP merujuk 046/2025 + 020/2026 |
| 1.3 | 15 Okt 2026 | Data Rapor 2025 real: Sheet 2 Laporan Rapor 113 baris (18 Lv1 + 74 Lv2), 12 Rekom Prioritas BBPMP (A.2, A.3, A.1, D.8, D.1, D.4), Sheet 3/4 template, data `data/rapor-2025.json` + `data/rapor-2025-analysis.md`; aturan RKT maksimal 12 prioritas/tahun (hard stop baris ke-13) | Konfirmasi Kepsek: Sheet 2 adalah data utama yang diturunkan; RKT maksimal 12 prioritas tahun berjalan |

---

## 12. Open Questions / Evidence to Gather

| # | Pertanyaan Terbuka | Pemilik | Target Jawab | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Apakah Dinas Pendidikan Kota Tegal memiliki **template Word resmi RKJM/RKT/RKAS/KSP** yang wajib dipakai (kop, nomor, format)? | Wakasek + Pengawas | Sebelum Sprint 1 (G-01) | ✅ **Terjawab 15 Okt 2026: Tidak ada template Dinas — pakai format resmi Kemendikdasmen 2025 (6-sheet PBD). PRD v1.1 sudah disesuaikan.** |
| 2 | **Pagu indikatif BOS 2026/2027** SMPN 5 Tegal berapa (untuk validasi RKAS)? | Bendahara | Saat impor referensi D-02 | ✅ **Terjawab parsial: RKA 2026 = Rp 628.280.000 (18 Agt 2026). Sisi pendapatan (BOS Reguler/BOSDA/Komite per TW) masih perlu dilengkapi Bendahara.** |
| 3 | Apakah **RKJM 2021–2025** masih berlaku atau akan disusun **RKJM baru 2025–2029** di v1.0? | Kepala Sekolah | Kickoff | ✅ **Terjawab 15 Okt 2026: RKJM baru periode 2026–2030. PRD v1.1 sudah update semua referensi periode.** |
| 4 | Daftar **kode rekening BOS/ARKAS 2024/2025** versi terbaru — minta Excel referensi dari Bendahara/Dinas untuk seed data D-02. | Bendahara | Sprint D | ✅ **Terjawab: Sudah ada RKA 2026 (197 baris, Rp 628,28jt) — di-seed di `data/arkas-2026-reference.json`. Mapping SIPD↔ARKAS disiapkan di D-02. Tambahan referensi ARKAS BOS terbaru tetap welcome.** |
| 5 | Apakah **TTE scan** sudah diterima Pengawas/Komite atau masih butuh paraf basah? | Kepala Sekolah + Komite | Sebelum UAT | ✅ **Terjawab 15 Okt 2026: Semua dokumen dicetak & ditandatangani manual; file digital + scan tetap diarsipkan dan file tahun lalu tetap ada (G-02/G-04 v1.2).** |
| 6 | Validasi **Bank CP Fase D** — apakah pakai CP Kemendikbud 2024 final atau ada penyesuaian Kota Tegal? | Wakasek Kurikulum | Sprint E | ✅ **Terjawab 15 Okt 2026: Kep BSKAP 046/H/KR/2025 (berlaku 16 Jul 2025) + Penyempurnaan Kep 020/2026 & 021/2026 (berlaku TA 2026/2027, hanya Agama/Budi Pekerti) & Permendikdasmen 13/2025. Diimplementasi di E-02 v1.2.** |

---

## Lampiran A — Alur Integrasi Dokumen (PBD End-to-End)

```
                    ┌─────────────────────────┐
                    │   RAPOR PENDIDIKAN      │  ← Sumber Tunggal (A-01/A-02)
                    │  (Excel/PDF 2024/2025)  │     Indikator: Literasi, Numerasi,
                    └────────────┬────────────┘     Karakter, Iklim, Kualitas Pembelajaran
                                 │ Identifikasi-Refleksi-Benahi (A-02)
                                 ▼
                    ┌─────────────────────────┐
                    │         RKJM 4 Tahun    │  ← BAB I–VI (B-01), Master Visi/Misi (B-02)
                    │   (Sasaran SMART +      │     Peta Jalan 4 Tahun (B-03)
                    │  Pagu Indikatif)        │     Validasi PBD (B-04)
                    └────────────┬────────────┘
                                 │ Turunan 1-klik (C-01) + Evaluasi RKT Lalu
                                 ▼
                    ┌─────────────────────────┐
                    │      RKT TAHUNAN        │  ← Kegiatan SMART (C-02), Gantt & PIC (C-03)
                    │  (12–15 Kegiatan Prioritas)│
                    └────────────┬────────────┘
                         ┌───────┴────────┐
                         ▼                ▼
              ┌──────────────────┐ ┌──────────────────┐
              │   RKAS           │ │   KSP (Fase D)   │  ← Keduanya turunan RKT
              │ (D-01 s.d. D-04) │ │ (E-01 s.d. E-03) │
              │ Kegiatan RKT →   │ │ Visi/Misi warisan│
              │ Kode BOS (D-02)  │ │ P5 ↔ Kegiatan RKT│
              │ Rekap 8 SNP & TW │ │ CP/TP/ATP Fase D │
              └────────┬─────────┘ └────────┬─────────┘
                       └─────────┬──────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │  OUTPUT & TTE           │  ← PDF/DOCX (G-01), TTE (G-02),
                    │  + Traceability Matrix  │     Matriks G-03, Arsip G-04
                    │  + Dashboard Kepsek     │     Health Check F-02, Audit Trail F-03
                    └─────────────────────────┘

Guardrail (F-01): Tidak bisa buat RKT bila RKJM belum Sah; tidak bisa buat RKAS/KSP bila RKT belum Sah.
Validasi silang (F-02): Setiap panah di atas dapat diverifikasi otomatis (Health Check Merah/Kuning/Hijau).
```

## Lampiran B — Struktur Dokumen per Regulasi Terbaru (Ringkasan untuk Dev)

### RKJM 2026–2030 (4 Tahun) — 6 BAB — Template Resmi Kemendikdasmen 2025
> **Periode:** 2026/2027 (Tahun 1) – 2029/2030 (Tahun 4). Tidak ada template Dinas khusus — mengacu **Panduan PBD 2025 & Panduan KSP 2024**. **Sumber data utama:** Sheet 2 Laporan Rapor 2025 (113 baris, 18 Lv1 + 74 Lv2) — `data/rapor-2025.json`.

| BAB | Isi (Field di Aplikasi) |
| :--- | :--- |
| I Pendahuluan | Rasional PBD, Dasar Hukum (Permendikbudristek 12/2024, Permendagri 77/2020, Juknis BOS 2025/2026), Tujuan RKJM 2026–2030, Ruang Lingkup |
| II Gambaran Umum | Profil (NPSN, Akreditasi, Jml Rombel/Guru/Siswa), Kondisi Objektif, Tabel Rapor Pendidikan 2025 (impor 6-sheet A-01), Analisis SWOT (A-03) |
| III Arah Kebijakan | Visi (master), Misi (list), Tujuan Jangka Menengah 2026–2030 (SMART), Sasaran Strategis (per sasaran: indikator Rapor terkait, target 2026→2030, penanggung jawab) |
| IV Program & Strategi | Daftar Program Prioritas (dari Benahi A-02 / Sheet 2.2 Rekom Prioritas), Strategi per program, Tahapan 2026–2030 |
| V Peta Jalan & Anggaran Indikatif 2026–2030 | Matrix Tahun 1–4 × Program × Sasaran × Indikator Keberhasilan × Pagu Indikatif (Rp) — Tahun 1 benchmark Rp 628,28jt (ARKAS 2026) |
| VI Penutup & MONEV | Mekanisme Evaluasi (tengah 2028 & akhir 2030), Penanggung Jawab, Risiko |

### RKT (Tahunan) — 4 BAB — **Maksimal 12 Prioritas/Tahun (Aturan Kepsek)**
> Template: **Sheet 3 Lembar Kerja RKT** (6 kolom: No | Identifikasi | Akar Masalah | Kegiatan Benahi | Penjelasan Implementasi | Biaya Ya/Tidak). Maksimal 12 baris.

| BAB | Isi |
| :--- | :--- |
| I Pendahuluan | Evaluasi RKT Tahun Lalu (capaian vs target, kendala, tindak lanjut — wajib), Dasar Penyusunan (Sheet 2 data real) |
| II Tujuan & Sasaran Tahunan | Turunan Sasaran RKJM Tahun Berjalan + Target Tahunan (angka, maksimal 12) |
| III Program & Kegiatan Prioritas | **Maks. 12 baris** — Per baris: Identifikasi (kode Sheet 2, mis. A.2), Akar Masalah (A.2.4), Kegiatan Benahi, Penjelasan Implementasi, Biaya Ya/Tidak. Hanya baris “Ya” diteruskan ke RKAS (D-01). |
| IV Penutup & Monev Tahunan | Jadwal Monev, Instrumen, Penanggung Jawab |

### RKAS (Tahunan) — Struktur Juknis BOS — **Hanya dari RKT “Biaya = Ya” + Sheet 4 Template**
> Template: **Sheet 4 Lembar Kerja ARKAS** (10 kolom: No | Kegiatan Benahi | Penjelasan Implementasi | Kegiatan ARKAS | Uraian Kegiatan | Bulan Dianggarkan | Jumlah | Satuan | Harga Satuan | Total). Hanya baris RKT dengan Biaya=Ya yang masuk. Jumlah baris RKAS ≤12 (bahkan biasanya 8–10).

| Bagian | Isi |
| :--- | :--- |
| Pendapatan | BOS Reguler, BOSDA, Komite, Hibah, Lainnya (per triwulan) |
| Belanja | Per Kegiatan RKT (Biaya=Ya) → Kegiatan ARKAS (padanan BOS) → Uraian Kegiatan (barang/jasa) → Bulan/Jumlah/Satuan/Harga/Total |
| Rekap | Rekap per 8 SNP, Rekap per Kode BOS, Rekap per Triwulan, Rekap per Sumber Dana |
| Pengesahan | Tanda tangan Kepsek, Bendahara, Komite, Pengawas |

> **Catatan ARKAS 2026:** Panel Referensi (D-02) menampilkan **197 baris referensi dari RKA SMPN 5 Tegal TA 2026 (Rp 628,28jt)** dengan mapping SIPD (5.1.02.01.01.00.xx) ↔ ARKAS BOS (5.1.02.xx). Seed tersedia di `data/arkas-2026-reference.json`. Saat export, format Excel mengikuti kolom Sheet 4 (Kegiatan Benahi, Penjelasan, Kegiatan ARKAS, Uraian, Bulan, Jumlah, Satuan, Harga, Total) agar bisa diimpor manual ke ARKAS. Ringkasan alokasi 2026: Barang Habis Pakai 41,3% | Pemeliharaan 20,0% | Jasa 19,2% | Buku 10,8% — lihat `data/arkas-2026-analysis.md`.

### KSP Kurikulum Merdeka SMP (Fase D) — 5 Komponen (Panduan 2024 jo. Permendikdasmen 13/2025)
> Penyesuaian 2025: **Profil Pelajar Pancasila → Profil Lulusan (8 dimensi)**, mapel pilihan **Koding & KA kelas 7** (bertahap 2025/2026), kokurikuler disederhanakan & terintegrasi proyek, ekstrakurikuler wajib kepanduan.

| Komponen | Isi |
| :--- | :--- |
| 1 Karakteristik Satuan Pendidikan | Analisis konteks (dari RKJM BAB II + SWOT), karakteristik peserta didik/pendidik/lingkungan, visi keunikan sekolah |
| 2 Visi, Misi, Tujuan | Warisan Master Data (sinkron RKJM, selaras Profil Lulusan 2025) |
| 3 Pengorganisasian Pembelajaran | Intrakurikuler (struktur Fase D, JP/minggu, mapel wajib/pilihan **+ Koding & KA kelas 7 opsional**), Kokurikuler/Projek (Profil Lulusan, tema, alokasi waktu, PIC, tautan RKT — sudah disederhanakan), Ekstrakurikuler (wajib kepanduan + pilihan) |
| 4 Rencana Pembelajaran | Prinsip **pembelajaran mendalam (deep learning)**, asesmen (formatif/sumatif, ANBK), strategi berdiferensiasi, kalender akademik |
| 5 Pendampingan, Evaluasi, Pengembangan Profesional | Monev KSP, refleksi GTK, komunitas belajar, tindak lanjut (taut evaluasi RKT) |

**Catatan CP Fase D (E-02):** Hierarki regulasi CP — Kep BSKAP 032/2024 (baseline) → **Kep BSKAP 046/2025 (berlaku 16 Juli 2025, default TA 2025/2026)** → **Kep BKPDM 020/2026 (berlaku TA 2026/2027, hanya Agama & Budi Pekerti yang berubah — klarifikasi 29 Juni 2026)**. Payung: Permendikdasmen 13/2025 (tidak ganti kurikulum; Kurikulum Merdeka & K13 tetap berlaku 2025/2026).

## Lampiran C — Contoh Matriks Ketertelusuran (Traceability)

| Indikator Rapor (A) | Sasaran RKJM (B) | Kegiatan RKT 2027/2028 (C) | Uraian RKAS (D) — Kode BOS, Pagu | Program KSP (E) |
| :--- | :--- | :--- | :--- | :--- |
| Literasi 58 (Perlu Perbaikan) | S-01: Literasi 58→78 dalam 4 tahun | K-03: Pojok Baca & Literasi — 12 rombel, 1 tahun | 5.1.02.01.01.0024 ATK & Buku — Rp 18jt (TW1) | P5 “Gaya Hidup Berkelanjutan” + Intrakurikuler Bahasa Indonesia (TP Fase D) |
| Iklim Keamanan 68 (Sedang) | S-02: Iklim Aman 68→85 | K-07: Program Sekolah Aman & Anti-Bullying — Workshop 40 GTK | 5.1.02.02.01.0001 Belanja Jasa — Rp 12jt (TW2) | Ekstrakurikuler & Tata Tertib (KSP Komponen 3) |

*Matriks ini di-generate otomatis (G-03) sebagai lampiran PDF/Excel.*

## Lampiran D — Model Data (Entity Utama, untuk Dev)

```
Sekolah (1) ──< RaporTahunan (n) ──< IndikatorRapor (m)
   │
   ├── MasterVisiMisi (1, versioned)
   │
   ├── RKJM (1 per periode 4 tahun) ──< SasaranRKJM (n) ──< TargetTahunan (4)
   │       └── ProgramRKJM (n) ──< TahapanProgram (4)
   │
   ├── RKT (1 per tahun ajaran, maks 12 baris) ──< EvaluasiRKTLalu (1) ──< KegiatanRKT (≤12)
   │       └── (FK: SasaranRKJM, IndikatorRapor Sheet 2; constraint: COUNT≤12; field Biaya Ya/Tidak)
   │
   ├── RKAS (1 per tahun, versioned: Murni/P1/P2) ──< BelanjaRKAS (n, ≤12 dari RKT Biaya=Ya)
   │       └── (FK: KegiatanRKT Biaya=Ya, KegiatanARKAS Sheet 4, KodeBOSReferensi, KomponenSNP)
   │
   ├── KSP (1 per tahun ajaran, versioned) ──< ProgramKSP (P5/Intra/Ekstra) (n)
   │       └── (FK: KegiatanRKT, CP/TP/ATP Fase D)
   │
   ├── ReferensiBOS (n, impor tahunan) — Kode, Nama, Kategori 8 SNP, Harga Referensi
   ├── BankCP_FaseD (n) — Mapel, CP, TP, ATP
   ├── User & Role (RBAC: Kepsek, Wakasek, Bendahara, Guru, Pengawas)
   └── AuditTrail (n) — entity, field, old→new, user, timestamp, alasan
```

## Lampiran E — Rekomendasi Teknis v1.0 (untuk Dev yang akan membangun di workspace ini)

- **Arsitektur:** Web lokal (Next.js/React + SQLite/IndexedDB) — jalan 100% offline di workspace ini; tidak ada backend cloud wajib. Data tersimpan di `workspace/data/`.
- **Export:** PDF via wkhtml/jsPDF + DOCX via docx.js — template header/footer editable.
- **Parser Rapor:** Excel (SheetJS) + PDF text extraction; mapping kolom toleran; simpan raw file + hasil parse.
- **Versioning:** Semua dokumen utama berversi (draft → menunggu TTE → sah → arsip); diff berbasis JSON patch.
- **Keamanan:** RBAC sederhana (H-02), backup .zip terenkripsi opsional, log audit (F-03).
- **Roadmap v2.0 (backlog):** TTE PSrE, impor Dapodik API, dashboard Dinas multi-sekolah, modul SPJ/BKU.

---

*— Akhir PRD v1.3 — Data Rapor 2025 real + aturan RKT 12 prioritas. Periode RKJM 2026–2030, cetak manual + arsip permanen, CP Fase D 2025/2026. Siap untuk kickoff Sprint 1 (Group A & B).*

## Lampiran G — Seed Data Rapor 2025 (untuk Dev)

- **File Excel sumber:** `RAPOR-PBD-SMP-NEGERI-5-TEGAL-20329830-DATA-2025.xlsx` (6 sheet, diperbarui 12 Mar 2026)
- **JSON machine-readable:** `data/rapor-2025.json` — 18 Level 1 + 74 Level 2 indikator, 12 Rekom Prioritas, 46 Rekom Keseluruhan, ringkasan temuan — dipakai untuk seeding A-01/A-02
- **Analisis human-readable:** `data/rapor-2025-analysis.md` — tabel Level 1, 12 prioritas, kekuatan vs perlu perbaikan
- **Sheet 2 Laporan Rapor (113 baris, sumber utama):** A.1 Literasi 91.11% Baik (naik 8.89), A.2 Numerasi 84.44% (turun 4.45, peringkat bawah kab), D.1 Kualitas Pembelajaran 63.93, D.4 Iklim Keamanan 76.38, E.3 TIK 50 (turun 38.15), E.7 Fasilitas 96.83 (kekuatan), dll.
- **Sheet 2.2 Rekom Prioritas (12 baris):** A.2 Numerasi (A.2.4 Data & Ketidakpastian, A.1.1 Teks Informasi), A.3 Karakter (Kreativitas, Metode Pembelajaran), A.1 Literasi, D.8 Kebinekaan, D.1 Kualitas Pembelajaran, D.4 Iklim Keamanan — **default RKT 2026/2027, maksimal 12**
- **Sheet 3/4 Template:** Sheet 3 (RKT 6 kolom, Biaya Ya/Tidak) & Sheet 4 (ARKAS 10 kolom) — dipertahankan di aplikasi untuk export
- **Aturan RKT 12:** Validasi `kegiatan_rkt.count ≤ 12` hard stop; counter `n/12` di UI; hanya `Biaya=Ya` diteruskan ke RKAS

## Lampiran F — Seed Data ARKAS 2026 (untuk Dev)

- **File PDF sumber:** `rka-unit-221-output.pdf` (7 halaman, 197 baris rincian)
- **JSON machine-readable:** `data/arkas-2026-reference.json` — dipakai untuk seeding Panel Referensi D-02
- **Analisis human-readable:** `data/arkas-2026-analysis.md` — ringkasan kategori, temuan untuk RKJM, bank kegiatan
- **Isi:** Total Rp 628.280.000 | Barang Habis Pakai 259,4jt | Jasa 120,8jt | Pemeliharaan 125,4jt | Perjalanan 10jt | Modal Pompa/Alat/Komputer/Buku 112,5jt
- **Kegiatan terdeteksi (30+):** LDKS, Perkemahan 611 siswa, TEF, OSN/O2SN/FLS3N/FTBI/MAPSI, POPDA, TKA, ANBK, MPLS, PPDB, IHT, MGMP, Pemeliharaan 9 gedung
- **Mapping:** Kode SIPD (Permendagri 77) sudah dipetakan ke kategori 8 SNP — dev tinggal lengkapi mapping ke kode ARKAS BOS 5.1.02.xx di D-02
