"use client";
import { useState } from "react";
import { Button } from "./ui";
import type { DokStatus } from "@/lib/types";

const STATUS_STYLE: Record<DokStatus, string> = {
  Draft: "bg-white text-zinc-500 border-[#ece9f5]",
  "Siap Cetak": "bg-amber-50 text-amber-700 border-amber-200",
  "Menunggu Scan": "bg-sky-50 text-sky-700 border-sky-200",
  Sah: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Diarsipkan: "bg-zinc-900 text-white border-zinc-800",
};

export function StatusBadge({ status }: { status: DokStatus }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none ${STATUS_STYLE[status]}`}>{status}</span>
  );
}

export function DocActions({
  status,
  onSiapCetak,
  onSah,
  onArsipkan,
  onExportExcel,
  onCetak,
  disableSah,
  sahHint,
}: {
  status: DokStatus;
  onSiapCetak: () => void;
  onSah: () => void;
  onArsipkan?: () => void;
  onExportExcel: () => void;
  onCetak: () => void;
  disableSah?: boolean;
  sahHint?: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const canSah = (status === "Siap Cetak" || status === "Menunggu Scan") && !disableSah;
  return (
    <div className="card-paper overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 p-3">
        <StatusBadge status={status} />
        <div className="hidden sm:block h-5 w-px bg-[#ece9f5]" />
        <div className="flex flex-wrap gap-2">
          {status === "Draft" && <Button size="md" onClick={onSiapCetak}>Siap Cetak</Button>}
          {canSah && <Button size="md" onClick={onSah}>Tandai Sah</Button>}
          {status === "Sah" && onArsipkan && <Button variant="secondary" size="md" onClick={onArsipkan}>Arsipkan</Button>}
        </div>
        <div className="ml-auto flex gap-1.5">
          <Button variant="ghost" size="sm" onClick={onExportExcel}>Export Excel</Button>
          <Button variant="ghost" size="sm" onClick={onCetak}>Cetak</Button>
          <button onClick={() => setShowInfo((v) => !v)} className="h-7 w-7 grid place-items-center rounded-full border border-[#ece9f5] bg-[#f2f0fb] text-zinc-500 hover:text-zinc-700 text-xs" aria-label="Info">
            ?
          </button>
        </div>
      </div>
      {showInfo && (
        <div className="border-t border-[#ece9f5] bg-[#f8f7ff] px-3 py-2.5 text-xs leading-4 text-zinc-600">
          Urutan: Draft — Siap Cetak — <strong className="text-emerald-700">Sah</strong> — Arsip.
        </div>
      )}
      {disableSah && sahHint && <div className="border-t border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">{sahHint}</div>}
    </div>
  );
}
