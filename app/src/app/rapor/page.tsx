"use client";
import { useMemo, useState } from "react";
import { raporSeed, flagForIndikator, peringkatBadge, perubahanBadge } from "@/lib/rapor";
import { Badge, Card, Kicker } from "@/components/ui";
import { RaporImportCard } from "@/components/RaporImportCard";
import Link from "next/link";

type Tab = "level1" | "level2" | "semua";

export default function RaporPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("level1");
  const [flagFilter, setFlagFilter] = useState<"semua" | "merah" | "kuning" | "hijau">("semua");

  const rows = useMemo(() => {
    const base = tab === "level1" ? raporSeed.indikator_level1 : tab === "level2" ? raporSeed.indikator_level2 : raporSeed.indikator_lengkap;
    let filtered = base;
    if (q.trim()) {
      const s = q.toLowerCase();
      filtered = filtered.filter((r) => `${r.kode} ${r.nama} ${r.skor_2025 ?? ""}`.toLowerCase().includes(s));
    }
    if (flagFilter !== "semua") filtered = filtered.filter((r) => flagForIndikator(r) === flagFilter);
    return filtered;
  }, [q, tab, flagFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <div>
          <Kicker>Rapor</Kicker>
          <h2 className="text-[17px] font-semibold tracking-tight mt-1">Daftar indikator</h2>
        </div>
        <Link href="/rapor/analisis" className="h-8 px-4 inline-flex items-center justify-center rounded-xl bg-[#2b5cff] text-white text-xs font-medium">Buka Analisis</Link>
      </div>

      <RaporImportCard />

      <Card className="p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-1 p-1 rounded-xl bg-[#f8f7ff] border border-[#ece9f5]">
            {([["level1", `Level 1 (${raporSeed.indikator_level1.length})`], ["level2", `Level 2 (${raporSeed.indikator_level2.length})`], ["semua", `Semua (${raporSeed.indikator_lengkap.length})`]] as const).map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${tab === k ? "bg-white shadow-sm border border-[#ece9f5] text-[#0f172a]" : "text-zinc-500 hover:text-zinc-700"}`}>{label}</button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["semua", "merah", "kuning", "hijau"] as const).map((f) => (
              <button key={f} onClick={() => setFlagFilter(f)} className={`px-2.5 py-1 rounded-full text-xs border font-medium transition ${flagFilter === f ? "bg-[#2b5cff] text-white border-[#2b5cff]" : "bg-white text-zinc-600 border-[#ece9f5] hover:bg-[#f8f7ff]"}`}>
                {f === "semua" ? "Semua" : f === "merah" ? "Perlu perhatian" : f === "kuning" ? "Waspada" : "Baik"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari indikator" className="flex-1 h-9 rounded-xl border border-[#ece9f5] bg-white px-3 text-sm placeholder:text-zinc-400" />
          <span className="hidden sm:inline-flex items-center justify-center text-xs text-zinc-400 border border-[#ece9f5] rounded-full px-2.5 bg-[#f8f7ff]">{rows.length}</span>
        </div>

        <div className="mt-3 overflow-x-auto rounded-xl border border-[#ece9f5]">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f7ff] text-zinc-600">
              <tr>
                <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Kode</th>
                <th className="text-left px-3 py-2 font-semibold">Indikator</th>
                <th className="text-right px-3 py-2 font-semibold">Skor</th>
                <th className="text-left px-3 py-2 font-semibold">Perubahan</th>
                <th className="text-left px-3 py-2 font-semibold">Peringkat Kab</th>
                <th className="text-left px-3 py-2 font-semibold">Nasional</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const flag = flagForIndikator(r);
                const pKab = peringkatBadge(r.peringkat_kab);
                const pNas = peringkatBadge(r.peringkat_nas);
                const ubah = perubahanBadge(r.perubahan);
                return (
                  <tr key={`${r.kode}-${r.nama.slice(0, 12)}`} className={`border-t border-[#f0ebe0] ${flag === "merah" ? "bg-red-50/50" : flag === "kuning" ? "bg-amber-50/40" : ""}`}>
                    <td className="px-3 py-2.5 font-mono text-xs whitespace-nowrap">
                      <span className="inline-flex items-center justify-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${flag === "merah" ? "bg-red-500" : flag === "kuning" ? "bg-amber-500" : flag === "hijau" ? "bg-emerald-500" : "bg-zinc-300"}`} />
                        {r.kode}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 max-w-[300px]"><div className="text-[13px] font-medium leading-4">{r.nama}</div></td>
                    <td className="px-3 py-2.5 text-right font-medium tabular-nums text-xs">{r.skor_2025 ?? "—"}</td>
                    <td className="px-3 py-2.5"><Badge tone={ubah.tone === "naik" ? "hijau" : ubah.tone === "turun" ? "merah" : "netral"}>{ubah.label}</Badge></td>
                    <td className="px-3 py-2.5">{pKab ? <Badge tone={pKab.tone}>{pKab.label}</Badge> : <span className="text-zinc-300 text-xs">—</span>}</td>
                    <td className="px-3 py-2.5">{pNas ? <Badge tone={pNas.tone}>{pNas.label}</Badge> : <span className="text-zinc-300 text-xs">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
