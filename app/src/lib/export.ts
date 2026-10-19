"use client";

// Export to Excel (Sheet 3/4 compatible) + Print-ready HTML for PDF
// Uses SheetJS (xlsx) already installed

export async function exportToExcel(
  sheets: Array<{ name: string; header: string[]; rows: (string | number | null)[][] }>,
  fileName: string
) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  for (const s of sheets) {
    const aoa = [s.header, ...s.rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    // auto width
    const colWidths = s.header.map((h, i) => {
      const maxLen = Math.max(h.length, ...s.rows.map((r) => String(r[i] ?? "").length));
      return { wch: Math.min(40, Math.max(12, maxLen + 2)) };
    });
    ws["!cols"] = colWidths;
    XLSX.utils.book_append_sheet(wb, ws, s.name.slice(0, 31));
  }
  XLSX.writeFile(wb, fileName);
}

export function openPrintWindow(html: string, title: string) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Pop-up diblokir — izinkan pop-up untuk mencetak.");
    return;
  }
  w.document.write(html);
  w.document.title = title;
  w.document.close();
  // Auto print
  w.focus();
  setTimeout(() => w.print(), 600);
}

export function docHtml(opts: {
  title: string;
  subtitle: string;
  kop?: string;
  meta: Array<[string, string]>;
  sections: Array<{ heading: string; html: string }>;
  footer?: string;
}) {
  const metaRows = opts.meta.map(([k, v]) => `<tr><td style="padding:4px 8px;color:#64748b;width:180px">${k}</td><td style="padding:4px 8px">${v}</td></tr>`).join("");
  const sectionsHtml = opts.sections.map((s) => `<h2 style="font-size:15px;margin:18px 0 8px;color:#0f2a44;border-bottom:1px solid #e2e8f0;padding-bottom:6px">${s.heading}</h2>${s.html}`).join("");
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${opts.title}</title>
<style>
  *{box-sizing:border-box} body{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;margin:0;color:#0f172a}
  .kop{border-bottom:3px double #0f2a44;padding:14px 0 10px;text-align:center}
  .kop h1{margin:0;font-size:18px;letter-spacing:.3px;color:#0f2a44}
  .kop p{margin:2px 0;color:#64748b;font-size:12px}
  .wrap{max-width:900px;margin:0 auto;padding:18px 20px}
  .badge{display:inline-block;border:1px solid #e2e8f0;background:#f8fafc;border-radius:999px;padding:2px 8px;font-size:11px;color:#475569;margin-right:6px}
  h1.title{font-size:20px;margin:14px 0 4px;color:#0f172a}
  table{border-collapse:collapse;width:100%;font-size:13px}
  th{ background:#f8fafc; text-align:left; padding:8px; border:1px solid #e2e8f0; font-weight:600 }
  td{ padding:7px 8px; border:1px solid #e2e8f0; vertical-align:top }
  .muted{color:#64748b;font-size:12px}
  .footer{margin-top:18px;border-top:1px solid #e2e8f0;padding-top:10px;color:#64748b;font-size:11px}
  @media print{ @page{ margin:16mm 14mm } .no-print{display:none} body{-webkit-print-color-adjust:exact; print-color-adjust:exact} }
  .sig{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:24px}
  .sig-box{border:1px solid #e2e8f0;border-radius:12px;padding:14px;min-height:110px}
</style></head><body>
<div class="wrap">
  <div class="kop">
    <h1>${opts.kop ?? "SMP NEGERI 5 TEGAL"}</h1>
    <p>NPSN 20329830 · Kec. Tegal Selatan, Kota Tegal · ${opts.subtitle}</p>
  </div>
  <h1 class="title">${opts.title}</h1>
  <p class="muted">${opts.subtitle}</p>
  <table style="margin-top:10px"><tbody>${metaRows}</tbody></table>
  ${sectionsHtml}
  <div class="sig">
    <div class="sig-box"><div style="font-size:12px;color:#64748b">Mengetahui,</div><div style="font-weight:600;margin-top:6px">Kepala SMP Negeri 5 Tegal</div><div style="margin-top:44px;font-size:12px">Sri Handayani Reksowati, S.Pd., M.Pd.<br/>NIP 197402262006042011</div></div>
    <div class="sig-box"><div style="font-size:12px;color:#64748b">Tegal, ……………………</div><div style="font-weight:600;margin-top:6px">Ketua Komite / Pengawas</div><div style="margin-top:44px;font-size:12px">_________________________</div></div>
  </div>
  <div class="footer">${opts.footer ?? "Dokumen ini dicetak dari Aplikasi Manajemen PBD SMPN 5 Tegal (offline-first). File tahun lalu tetap tersimpan (G-04) — cetak manual + arsip scan."}</div>
  <div class="no-print" style="margin-top:16px"><button onclick="window.print()" style="padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;background:#0f2a44;color:#fff;cursor:pointer">Cetak / Simpan PDF</button> <button onclick="window.close()" style="padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;background:#fff;cursor:pointer">Tutup</button></div>
</div>
</body></html>`;
}

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function tableHtml(headers: string[], rows: (string | number)[][]) {
  const th = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const tr = rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(String(c ?? ""))}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${th}</tr></thead><tbody>${tr || `<tr><td colspan="${headers.length}" style="text-align:center;color:#64748b">— Belum ada data —</td></tr>`}</tbody></table>`;
}
