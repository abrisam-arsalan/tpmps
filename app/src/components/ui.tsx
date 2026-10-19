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
  const sizes = { sm: "h-8 px-3 text-xs", md: "h-9 px-4 text-sm", lg: "h-10 px-5 text-sm" };
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

export function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 w-full rounded-full bg-[#ece9f5] overflow-hidden">
      <div className="h-full bg-[#2b5cff] transition-all duration-500" style={{ width: `${v}%` }} />
    </div>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[18px] font-semibold tracking-tight text-[#0f172a] leading-tight">{title}</h2>
        {subtitle && <p className="text-[13px] leading-5 text-zinc-500 mt-1.5 max-w-[72ch]">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-400">{children}</div>;
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="card-paper p-4">
      <div className="text-[11px] font-medium tracking-wide uppercase text-zinc-500">{label}</div>
      <div className="text-[22px] font-semibold tracking-tight mt-1 text-[#0f172a]">{value}</div>
      {hint && <div className="text-xs text-zinc-400 mt-0.5">{hint}</div>}
    </div>
  );
}

// Ikon kecil untuk nav — emoji minimal
export function NavIcon({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={`h-6 w-6 grid place-items-center rounded-lg text-xs ${active ? "bg-[#2b5cff] text-white" : "bg-[#f2f0fb] text-zinc-500"}`}>
      {children}
    </span>
  );
}
