"use client";
import { useEffect, useState } from "react";
import { db } from "./db";
import { raporSeed, datasetFromImport } from "./rapor";
import type { RaporDataset } from "./types";

export function useRapor() {
  const [dataset, setDataset] = useState<RaporDataset>(raporSeed);
  const [isImport, setIsImport] = useState(false);
  const [sumber, setSumber] = useState("Bawaan 2025");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await db.raporImports.orderBy("importedAt").reverse().toArray();
        if (!alive) return;
        const latest = all[0];
        if (latest) {
          const ds = datasetFromImport(latest.rawJson);
          if (ds) {
            setDataset(ds);
            setIsImport(true);
            setSumber(`${latest.fileName} · ${latest.tahun}`);
          }
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  return { dataset, isImport, sumber };
}

export function useRaporCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    db.raporImports.count().then((c) => { if (alive) setCount(c); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return count;
}
