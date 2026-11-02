"use client";
import Link from "next/link";
import { useRapor } from "@/lib/useRapor";
import { Card, Kicker } from "@/components/ui";
import { PageHead } from "@/components/PageHead";

export default function AnalisisPage() {
  const { dataset, sumber } = useRapor();
  const prio = dataset.prioritas_pbd_2025.daftar;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-start">
        <PageHead title="Pilih untuk RKT" kicker={`Analisis — ${prio.length} prioritas`} desc={`Sumber: ${sumber}`} />
        <Link href="/rkt" className="min-h-[44px] px-5 inline-flex items-center justify-center rounded-xl bg-[#2b5cff] text-white text-xs font-medium">Buka RKT</Link>
      </div>

      <Card className="p-3">
        <Kicker>{prio.length} prioritas — pilih untuk RKT</Kicker>
        <div className="mt-2 space-y-1.5 sm:hidden" role="list" aria-label="Prioritas">
          {prio.map((p) => (
            <div key={p.no} role="listitem" className="rounded-xl border border-[#ece9f5] bg-white px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-medium">#{p.no} {p.identifikasi_kode}</span>
                {p.akar_lv2_kode && <span className="ml-auto font-mono text-xs text-zinc-500">{p.akar_lv2_kode}</span>}
              </div>
              {p.kegiatan_benahi && <div className="text-xs text-zinc-600 mt-1 leading-4">{p.kegiatan_benahi.slice(0, 120)}</div>}
              {p.tautan_benahi && <a href={p.tautan_benahi} target="_blank" rel="noreferrer" className="text-xs font-medium text-[#2b5cff] underline mt-1 inline-block min-h-[44px]">Panduan</a>}
            </div>
          ))}
        </div>
        <div className="mt-2 overflow-x-auto rounded-xl border border-[#ece9f5] hidden sm:block">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f7ff] text-zinc-600">
              <tr>
                <th scope="col" className="text-left px-3 py-2 font-semibold">No</th>
                <th scope="col" className="text-left px-3 py-2 font-semibold">Prioritas</th>
                <th scope="col" className="text-left px-3 py-2 font-semibold">Akar</th>
                <th scope="col" className="text-left px-3 py-2 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {prio.map((p) => (
                <tr key={p.no} className="border-t border-[#ece9f5] align-top">
                  <td className="px-3 py-2.5 font-mono text-xs">{p.no}</td>
                  <td className="px-3 py-2.5"><div className="text-xs font-medium">{p.identifikasi_kode}</div></td>
                  <td className="px-3 py-2.5"><div className="text-xs font-medium">{p.akar_lv2_kode ?? "—"}</div><div className="text-xs text-zinc-500 leading-4 max-w-[260px]">{p.akar_deskripsi ?? "—"}</div></td>
                  <td className="px-3 py-2.5">{p.tautan_benahi ? <a href={p.tautan_benahi} target="_blank" rel="noreferrer" className="text-xs font-medium text-[#2b5cff] underline">Panduan</a> : <span className="text-xs text-zinc-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {prio.slice(0, 3).map((p) => (
          <Card key={p.no} className="p-3">
            <Kicker>Prioritas #{p.no}</Kicker>
            <div className="text-sm font-medium mt-1">{p.identifikasi_kode}{p.akar_lv2_kode ? ` · ${p.akar_lv2_kode}` : ""}</div>
            <div className="text-xs text-zinc-500 leading-4 mt-0.5">{p.kegiatan_benahi?.slice(0, 90) ?? p.akar_deskripsi?.slice(0, 90) ?? "—"}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
