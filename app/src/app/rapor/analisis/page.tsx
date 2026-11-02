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
        <div className="mt-2 overflow-x-auto rounded-xl border border-[#ece9f5]">
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
        <Card className="p-3"><Kicker>Numerasi</Kicker><div className="text-sm font-medium mt-1">A.2.4 Data dan Ketidakpastian</div><div className="text-xs text-zinc-500">59,61 · turun 6,54</div></Card>
        <Card className="p-3"><Kicker>Kebinekaan dan Keamanan</Kicker><div className="text-sm font-medium mt-1">D.8 · D.4 · D.10</div><div className="text-xs text-zinc-500">Toleransi, kekerasan seksual, disabilitas</div></Card>
        <Card className="p-3"><Kicker>Karakter</Kicker><div className="text-sm font-medium mt-1">A.3 · D.1</div><div className="text-xs text-zinc-500">Kreativitas, metode, inovasi</div></Card>
      </div>
    </div>
  );
}
