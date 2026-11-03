import * as React from "react";

/* ── Template finance clean — kartu putih, lavender, tombol biru ── */

export function Badge({
  tone = "netral",
  children,
  className = "",
}: {
  tone?: "merah" | "kuning" | "hijau" | "netral" | "naik" | "turun" | "slate" | "biru";
  children: React.ReactNode;
  className?: string;
}) {
  const map: Record<string, string> = {
    merah: "bg-red-50 text-red-700 border-red-100",
    kuning: "bg-amber-50 text-amber-700 border-amber-100",
    hijau: "bg-emerald-50 text-emerald-700 border-emerald-100",
    biru: "bg-[#eef2ff] text-[#2b5cff] border-[#e0e7ff]",
    netral: "bg-white text-zinc-600 border-[#ece9f5]",
    slate: "bg-slate-50 text-slate-600 border-slate-200",
    naik: "bg-emerald-50 text-emerald-700 border-emerald-100",
    turun: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={`inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-none tracking-wide ${map[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card-paper ${className}`}>{children}</div>;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md" | "lg"; children?: React.ReactNode }) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-xl font-medium leading-none tracking-tight transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none text-center";
  const sizes = { sm: "min-h-[44px] px-4 text-xs", md: "min-h-[44px] px-5 text-sm", lg: "min-h-[48px] px-6 text-sm" };
  const variants = {
    primary: "bg-[#2b5cff] text-white hover:bg-[#1d4ed8] shadow-sm focus-visible:ring-[#2b5cff]",
    secondary: "bg-white border border-[#ece9f5] text-[#0f172a] hover:bg-[#f8f7ff]",
    ghost: "bg-transparent text-zinc-500 hover:bg-[#f8f7ff] hover:text-zinc-700",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      <span className="inline-flex items-center justify-center leading-none">{children}</span>
    </button>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Kelengkapan"} className="h-1.5 w-full rounded-full bg-[#ece9f5] overflow-hidden">
      <div className="h-full bg-[#2b5cff] transition-all duration-500" style={{ width: `${v}%` }} />
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-[#ece9f5]/70 ${className}`} />;
}

export function LoadingBlock({ label = "Memuat…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="space-y-3 py-6">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}


export function Kicker({ children }: { children: React.ReactNode }) {
  return <span className="block text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500">{children}</span>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500">{children}</h3>;
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="card-paper p-4">
      <div className="text-[11px] font-medium tracking-wide uppercase text-zinc-500">{label}</div>
      <div className="text-[22px] font-semibold tracking-tight mt-1 text-[#0f172a]">{value}</div>
      {hint && <div className="text-xs text-zinc-500 mt-0.5">{hint}</div>}
    </div>
  );
}

// Ikon SVG satu gaya — garis 1.8px, sudut bulat
const ICON_PATHS: Record<string, React.ReactNode> = {
  home: (<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h5v-6h4v6h5V9.5" /></>),
  chart: (<><path d="M4 20h16" /><path d="M7 20v-5M12 20V7M17 20v-8" /></>),
  layers: (<><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>),
  list: (<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></>),
  banknote: (<><rect x="3" y="7" width="18" height="10" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6.5 10.5h.01M17.5 13.5h.01" /></>),
  book: (<><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></>),
  link: (<><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></>),
  archive: (<><rect x="3" y="4" width="18" height="5" rx="1" /><path d="M5 9v11h14V9" /><path d="M10 13h4" /></>),
};

export function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      {ICON_PATHS[name] ?? ICON_PATHS.chart}
    </svg>
  );
}
