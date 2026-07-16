import { AlertCircle, Inbox } from "lucide-react";
export function EmptyState({
  title = "Nothing here yet",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="grid min-h-56 place-items-center p-8 text-center">
      <div>
        <Inbox className="mx-auto mb-3 text-zinc-600" size={36} />
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
    </div>
  );
}
export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
      <AlertCircle size={18} />
      {message}
    </div>
  );
}
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-zinc-800 ${className}`} />
  );
}
