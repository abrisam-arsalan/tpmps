"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Kicker } from "./ui";

export function PageHead({ title, kicker, desc }: { title: string; kicker: string; desc?: string }) {
  const pathname = usePathname();
  useEffect(() => {
    document.getElementById("konten")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return (
    <div>
      <h1 className="sr-only">{title}</h1>
      <Kicker>{kicker}</Kicker>
      <h2 className="text-[17px] font-semibold tracking-tight mt-1" aria-hidden="true">{title}</h2>
      {desc && <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>}
    </div>
  );
}
