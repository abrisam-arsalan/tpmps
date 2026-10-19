// Dexie (IndexedDB) — offline-first, no server required
import Dexie, { Table } from "dexie";
import type { RKJM, RKT, RKAS, KSP } from "./types";

export type RaporImport = {
  id: string;
  tahun: number;
  fileName: string;
  importedAt: string;
  rawJson: string; // stringified RaporDataset (or imported xlsx parsed)
};

export class AppDB extends Dexie {
  raporImports!: Table<RaporImport, string>;
  rkjm!: Table<RKJM, string>;
  rkt!: Table<RKT, string>;
  rkas!: Table<RKAS, string>;
  ksp!: Table<KSP, string>;

  constructor() {
    super("manajemen-sekolah-db");
    this.version(1).stores({
      raporImports: "id, tahun",
      rkjm: "id, periode, status",
      rkt: "id, tahun_ajaran, rkjm_id, status",
    });
    this.version(2).stores({
      raporImports: "id, tahun",
      rkjm: "id, periode, status",
      rkt: "id, tahun_ajaran, rkjm_id, status",
      rkas: "id, tahun_ajaran, rkt_id, status",
      ksp: "id, tahun_ajaran, rkjm_id, status",
    });
  }
}

export const db = new AppDB();

// ── Helpers: id & timestamps ──
export function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
export function nowISO() {
  return new Date().toISOString();
}

export function fmtRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}
