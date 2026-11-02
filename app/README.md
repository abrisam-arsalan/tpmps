# TPMPS — SMP Negeri 5 Tegal

**Perencanaan Berbasis Data: Rapor → RKJM → RKT → RKAS → Kurikulum**

- **PRD:** `../PRD.md` — 27 requirements (A–H)
- **Data awal:** `src/data/rapor-2025.json` + `src/data/arkas-2026-reference.json` (Rp 628,28 jt)
- **Stack:** Next.js 16.4 + React 19 + TypeScript + Tailwind 4 + Dexie (IndexedDB) + SheetJS
- **Data:** 100% lokal di browser — tanpa server/DB eksternal. Bisa dipasang sebagai aplikasi (PWA) dan dibuka offline setelah kunjungan pertama.

## Jalankan di laptop

```bash
cd app
bun install

bun run dev -- --port 3001     # dev
bun run build                  # build produksi
bun run start -- --port 3002   # produksi
```

## Alur pakai

1. **Rapor** — lihat daftar indikator. Upload file Excel baru untuk mengganti data aktif (otomatis dipakai semua halaman).
2. **RKJM** — isi visi, misi, sasaran, program 2026–2030.
3. **RKT** — pilih maks 12 prioritas per tahun ajaran.
4. **Anggaran** — rinci belanja dari kegiatan yang butuh anggaran.
5. **Kurikulum** — isi 5 komponen + Bank CP, tautkan ke Rencana.
6. **Keterkaitan** — cek benang merah + kelengkapan.
7. Setiap dokumen: Siap Cetak → cetak → tanda tangan → upload scan → Tandai Sah → Arsipkan.
8. **Arsip** — Export Backup rutin; tombol Kembalikan untuk memulihkan (tanpa file scan — scan tetap di perangkat asal).

Aturan yang dikunci: RKT maks 12/tahun; hanya kegiatan butuh anggaran yang masuk Anggaran; status Sah butuh scan terupload.

## Halaman

| Route | Isi |
|---|---|
| `/` | Beranda — langkah selanjutnya, kelengkapan 5 dokumen, ringkasan Rapor |
| `/rapor` | Daftar indikator + impor file |
| `/rapor/analisis` | Prioritas untuk RKT |
| `/rkjm` | Visi, misi, sasaran, program, MONEV |
| `/rkt` | Rencana tahunan (maks 12) |
| `/rkas` | Anggaran |
| `/ksp` | Kurikulum (5 komponen + Bank CP) |
| `/matriks` | Keterkaitan + cek kelengkapan |
| `/rkjm/arsip` | Arsip per tahun + backup/restore |

## Pasang di server Ubuntu (kurikulum.smp5tegal.sch.id)

```bash
sudo apt update && sudo apt install -y git curl
curl -fsSL https://bun.sh/install | bash && source ~/.bashrc

git clone https://github.com/abrisam-arsalan/tpmps.git
cd tpmps/app && bun install && bun run build

# Service app (port 3002)
sudo nano /etc/systemd/system/tpmps.service
```

```ini
[Unit]
Description=TPMPS SMPN 5 Tegal
After=network.target
[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/tpmps/app
ExecStart=/home/ubuntu/.bun/bin/bun run start -- --port 3002 --hostname 0.0.0.0
Restart=always
[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now tpmps

# Cloudflare Tunnel
curl -L -o cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
cloudflared tunnel login
cloudflared tunnel create kurikulum
cloudflared tunnel route dns kurikulum kurikulum.smp5tegal.sch.id
```

`~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL-ID>
credentials-file: /home/ubuntu/.cloudflared/<TUNNEL-ID>.json
ingress:
  - hostname: kurikulum.smp5tegal.sch.id
    service: http://localhost:3002
  - service: http_status:404
```

```bash
cloudflared tunnel run kurikulum   # tes, lalu Ctrl+C
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

Update berikutnya: `git pull origin main` → `bun install` → `bun run build` → `sudo systemctl restart tpmps`.
