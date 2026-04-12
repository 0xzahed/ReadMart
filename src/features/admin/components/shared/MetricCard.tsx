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
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </div>
      <p className={`mt-2 text-3xl font-bold ${valueClassName}`}>{value}</p>
    </article>
  );
}
