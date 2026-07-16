"use client";
import { useEffect, useState } from "react";
import { Activity, CalendarDays, TrendingUp } from "lucide-react";
import { ownerService } from "@/services/owner.service";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { currency } from "@/utils/format";
import { ErrorState, Skeleton } from "@/components/ui/states";
export default function Analytics() {
  const [data, setData] = useState<any>(),
    [error, setError] = useState("");
  useEffect(() => {
    ownerService
      .analytics()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);
  if (!data && !error) return <Skeleton className="h-100" />;
  const overall = data?.overall?.data || data?.overall || {},
    rows = data?.revenue?.data || data?.revenue || [];
  const max = Math.max(
    1,
    ...(Array.isArray(rows)
      ? rows.map((x: any) => x.revenue || x.amount || 0)
      : [1]),
  );
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          PERFORMANCE INTELLIGENCE
        </p>
        <h1 className="mt-2 text-3xl font-bold">Analytics</h1>
      </div>
      {error && <ErrorState message={error} />}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total revenue"
          value={currency(overall.totalRevenue)}
          icon={TrendingUp}
        />
        <StatCard
          label="Total bookings"
          value={String(overall.totalBookings || 0)}
          icon={CalendarDays}
        />
        <StatCard
          label="Occupancy rate"
          value={overall.occupancyRate ? `${overall.occupancyRate}%` : "—"}
          icon={Activity}
        />
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Revenue trend</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Revenue performance by date
            </p>
          </div>
        </div>
        <div className="mt-8 flex h-64 items-end gap-2">
          {(Array.isArray(rows) ? rows : [])
            .slice(-14)
            .map((r: any, i: number) => (
              <div
                key={i}
                className="group flex flex-1 flex-col items-center gap-2"
              >
                <span className="invisible rounded bg-zinc-800 px-1 text-[10px] group-hover:visible">
                  {currency(r.revenue || r.amount)}
                </span>
                <div
                  style={{
                    height: `${Math.max(6, ((r.revenue || r.amount || 0) / max) * 100)}%`,
                  }}
                  className="w-full rounded-t-md bg-lime-400 transition group-hover:bg-lime-300"
                />
              </div>
            ))}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Peak booking hour",
            (data?.peak?.data || data?.peak || {}).peakHour ||
              overall.peakHour ||
              "—",
          ],
          ["Cancellation rate", overall.cancellationRate || "0%"],
          ["No-show rate", overall.noShowRate || "0%"],
        ].map(([l, v]) => (
          <Card key={String(l)} className="p-5">
            <p className="text-sm text-zinc-500">{l}</p>
            <p className="mt-2 text-2xl font-bold">{v}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
