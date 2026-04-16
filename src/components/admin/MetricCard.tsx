import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  iconClassName = "text-indigo-600",
  valueClassName = "text-gray-900",
}: MetricCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/65 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white/90 to-slate-100/80" />
      <div className="absolute right-0 top-0 h-28 w-28 -translate-y-8 translate-x-8 rounded-full bg-slate-200/35 blur-2xl transition-transform duration-300 group-hover:scale-110" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`mt-3 text-3xl font-bold tracking-tight ${valueClassName}`}>{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm">
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
      </div>
      <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-slate-900 via-slate-700 to-slate-400" />
      </div>
    </article>
  );
}
