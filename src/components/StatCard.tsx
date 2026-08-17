import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  tone = "brand",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: "brand" | "gold" | "navy";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    gold: "bg-gold-400/15 text-gold-500",
    navy: "bg-navy-900/5 text-navy-900",
  }[tone];

  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClasses}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="font-display text-2xl font-extrabold text-navy-900">{value}</p>
        <p className="text-xs font-medium text-ink-500">{label}</p>
      </div>
    </div>
  );
}
