import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
export function StatCard({
  label,
  value,
  icon: Icon,
  detail,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  detail?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          {detail && <p className="mt-1 text-xs text-zinc-500">{detail}</p>}
        </div>
        <span className="rounded-xl bg-lime-400/10 p-2.5 text-lime-300">
          <Icon size={19} />
        </span>
      </div>
    </Card>
  );
}
