"use client";
import { useRef, useState } from "react";
import { Button, Kicker } from "./ui";

export function ScanUpload({
  label = "Scan pengesahan",
  currentName,
  currentDataUrl,
  onChange,
  onClear,
}: {
  label?: string;
  currentName?: string | null;
  currentDataUrl?: string | null;
  onChange: (name: string, dataUrl: string) => void;
  onClear?: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  async function handleFile(f: File | null) {
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { alert("Maksimal 8 MB."); return; }
    setBusy(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error("Gagal"));
        r.readAsDataURL(f);
      });
      onChange(f.name, dataUrl);
    } finally { setBusy(false); if (ref.current) ref.current.value = ""; }
  }
  const isPdf = currentName?.toLowerCase().endsWith(".pdf");
  return (
    <div className="card-paper p-4">
      <Kicker>{label}</Kicker>
      <p className="text-xs leading-4 text-zinc-500 mt-1">Setelah tanda tangan, upload scan di sini.</p>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <Button variant="secondary" size="sm" onClick={() => ref.current?.click()} disabled={busy}>{busy ? "Memproses" : currentName ? "Ganti file" : "Pilih file"}</Button>
        {currentName && <span className="text-xs font-mono bg-[#f2f0fb] border border-[#ece9f5] rounded-full px-2.5 py-1 text-zinc-600">{currentName}</span>}
        {currentName && onClear && <Button variant="ghost" size="sm" onClick={onClear}>Hapus</Button>}
      </div>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
      {currentDataUrl && (
        <div className="mt-3">
          {!isPdf && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentDataUrl} alt="Scan" className="max-h-48 rounded-2xl border border-[#ece9f5] bg-white" />
          )}
          {isPdf && <div className="text-xs text-zinc-500 rounded-xl border border-dashed border-[#ece9f5] bg-[#f8f7ff] px-3 py-2">PDF tersimpan — buka di tab baru untuk cetak ulang.</div>}
          <a href={currentDataUrl} target="_blank" rel="noreferrer" download={currentName ?? "scan"} className="inline-flex mt-2 h-8 px-3 items-center justify-center rounded-xl border border-[#ece9f5] bg-white text-xs font-medium">Buka file</a>
        </div>
      )}
    </div>
  );
}
