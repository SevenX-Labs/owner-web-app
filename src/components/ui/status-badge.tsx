import { cn } from "@/lib/utils";
import { statusLabel } from "@/utils/format";
export function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const style =
    s.includes("confirm") || s.includes("complete")
      ? "bg-emerald-500/15 text-emerald-300"
      : s.includes("cancel") || s.includes("reject")
        ? "bg-red-500/15 text-red-300"
        : "bg-amber-500/15 text-amber-300";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        style,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
