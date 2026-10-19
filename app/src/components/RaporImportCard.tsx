"use client";
import { useRef, useState } from "react";
import { parseRaporFile, type ParsedRapor } from "@/lib/parseRapor";
import { db, uid, nowISO } from "@/lib/db";
import { Button, Card, Kicker } from "./ui";

export function RaporImportCard({ onImported }: { onImported?: (p: ParsedRapor) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleFile(f: File | null) {
    if (!f) return;
    setBusy(true); setMsg(null);
    try {
      const parsed = await parseRaporFile(f);
      await db.raporImports.put({ id: uid("rapor"), tahun: parsed.tahun, fileName: parsed.fileName, importedAt: nowISO(), rawJson: JSON.stringify(parsed) });
      setMsg(`Berhasil impor ${parsed.indikator.length} indikator dari ${parsed.fileName}`);
      onImported?.(parsed);
    } catch (e) { setMsg(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); if (inputRef.current) inputRef.current.value = ""; }
  }

  return (
    <Card className="p-4">
      <Kicker>Impor Rapor</Kicker>
      <div className="flex gap-3 justify-between items-center mt-1">
        <p className="text-[13px] leading-5 text-zinc-500">Data Rapor 2025 sudah tersedia.</p>
        <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>{busy ? "Memproses" : "Pilih file"}</Button>
      </div>
      <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
      {msg && <div className={`mt-2 rounded-xl border px-3 py-2 text-xs ${msg.startsWith("Berhasil") ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-amber-50 border-amber-100 text-amber-800"}`}>{msg}</div>}
    </Card>
  );
}
