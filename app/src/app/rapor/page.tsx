"use client";
import { useEffect, useMemo, useState } from "react";
import { flagForIndikator, peringkatBadge, perubahanBadge } from "@/lib/rapor";
import { useRapor } from "@/lib/useRapor";
import { PageHead } from "@/components/PageHead";
import { Badge, Card } from "@/components/ui";
import { RaporImportCard } from "@/components/RaporImportCard";
import Link from "next/link";

type Tab = "level1" | "level2" | "semua";

export default function RaporPage() {
  const [q, setQ] = useState("");
  const [qd, setQd] = useState("");
  const [tab, setTab] = useState<Tab>("level1");
  const [flagFilter, setFlagFilter] = useState<"semua" | "merah" | "kuning" | "hijau">("semua");
  const { dataset, isImport, sumber } = useRapor();

  useEffect(() => {
    const t = setTimeout(() => setQd(q), 200);
    return () => clearTimeout(t);
  }, [q]);

  const rows = useMemo(() => {
    const base = tab === "level1" ? dataset.indikator_level1 : tab === "level2" ? dataset.indikator_level2 : dataset.indikator_lengkap;
    let filtered = base;
    if (qd.trim()) {
      const s = qd.toLowerCase();
      filtered = filtered.filter((r) => `${r.kode} ${r.nama} ${r.skor_2025 ?? ""}`.toLowerCase().includes(s));
    }
    if (flagFilter !== "semua") filtered = filtered.filter((r) => flagForIndikator(r) === flagFilter);
    return filtered;
  }, [qd, tab, flagFilter, dataset]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <PageHead title="Daftar indikator" kicker="Rapor" desc={`Sumber: ${sumber}${isImport ? "" : " — upload file baru untuk mengganti"}`} />
        <Link href="/rapor/analisis" className="min-h-[44px] px-5 inline-flex items-center justify-center rounded-xl bg-[#2b5cff] text-white text-xs font-medium">Buka Analisis</Link>
      </div>

      <RaporImportCard />

      <Card className="p-3 sm:p-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-1 p-1 rounded-xl bg-[#f8f7ff] border border-[#ece9f5]" role="tablist" aria-label="Tingkat indikator">
            {([["level1", `Level 1 (${dataset.indikator_level1.length})`], ["level2", `Level 2 (${dataset.indikator_level2.length})`], ["semua", `Semua (${dataset.indikator_lengkap.length})`]] as const).map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-[44px] px-4 rounded-lg text-xs font-medium transition ${tab === k ? "bg-white shadow-sm border border-[#ece9f5] text-[#0f172a]" : "text-zinc-500 hover:text-zinc-700"}`}>{label}</button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter status">
            {(["semua", "merah", "kuning", "hijau"] as const).map((f) => (
              <button key={f} aria-pressed={flagFilter === f} onClick={() => setFlagFilter(f)} className={`min-h-[44px] px-4 rounded-full text-xs border font-medium transition ${flagFilter === f ? "bg-[#2b5cff] text-white border-[#2b5cff]" : "bg-white text-zinc-600 border-[#ece9f5] hover:bg-[#f8f7ff]"}`}>
                {f === "semua" ? "Semua" : f === "merah" ? "Perlu perhatian" : f === "kuning" ? "Waspada" : "Baik"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <label className="flex-1"><span className="sr-only">Cari indikator</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari indikator" aria-label="Cari indikator" className="w-full min-h-[44px] rounded-xl border border-[#ece9f5] bg-white px-3 text-sm placeholder:text-zinc-400" /></label>
          <span className="hidden sm:inline-flex items-center justify-center text-xs text-zinc-500 border border-[#ece9f5] rounded-full px-2.5 bg-[#f8f7ff]">{rows.length}</span>
        </div>

        <div className="mt-3 space-y-1.5 sm:hidden" role="list" aria-label="Indikator">
          {rows.map((r) => {
            const flag = flagForIndikator(r);
            const ubah = perubahanBadge(r.perubahan);
            return (
              <div key={`${r.kode}-${r.nama.slice(0, 12)}`} role="listitem" className={`rounded-xl border border-[#ece9f5] bg-white px-3 py-2.5 ${flag === "merah" ? "bg-red-50/60" : flag === "kuning" ? "bg-amber-50/50" : ""}`}>
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${flag === "merah" ? "bg-red-500" : flag === "kuning" ? "bg-amber-500" : flag === "hijau" ? "bg-emerald-500" : "bg-zinc-300"}`} aria-hidden="true" />
                  <span className="font-mono text-xs font-medium">{r.kode}</span>
                  <span className="ml-auto text-xs font-medium tabular-nums">{r.skor_2025 ?? "—"}</span>
                </div>
                <div className="text-[13px] font-medium leading-4 mt-1">{r.nama}</div>
                <div className="mt-1"><Badge tone={ubah.tone === "naik" ? "hijau" : ubah.tone === "turun" ? "merah" : "netral"}>{ubah.label}</Badge></div>
              </div>
            );
          })}
          {rows.length === 0 && <div className="text-xs text-zinc-500 py-6 text-center border border-dashed border-[#ece9f5] rounded-xl">Tidak ada hasil.</div>}
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-[#ece9f5] hidden sm:block">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f7ff] text-zinc-600">
              <tr>
                <th scope="col" className="text-left px-3 py-2 font-semibold whitespace-nowrap">Kode</th>
                <th scope="col" className="text-left px-3 py-2 font-semibold">Indikator</th>
                <th scope="col" className="text-right px-3 py-2 font-semibold">Skor</th>
                <th scope="col" className="text-left px-3 py-2 font-semibold">Perubahan</th>
                <th scope="col" className="text-left px-3 py-2 font-semibold">Peringkat Kab</th>
                <th scope="col" className="text-left px-3 py-2 font-semibold">Nasional</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const flag = flagForIndikator(r);
                const pKab = peringkatBadge(r.peringkat_kab);
                const pNas = peringkatBadge(r.peringkat_nas);
                const ubah = perubahanBadge(r.perubahan);
                return (
                  <tr key={`${r.kode}-${r.nama.slice(0, 12)}`} className={`border-t border-[#ece9f5] ${flag === "merah" ? "bg-red-50/50" : flag === "kuning" ? "bg-amber-50/40" : ""}`}>
                    <td className="px-3 py-2.5 font-mono text-xs whitespace-nowrap">
                      <span className="inline-flex items-center justify-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${flag === "merah" ? "bg-red-500" : flag === "kuning" ? "bg-amber-500" : flag === "hijau" ? "bg-emerald-500" : "bg-zinc-300"}`} aria-hidden="true" />
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
