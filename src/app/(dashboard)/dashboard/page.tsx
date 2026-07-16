"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  ScanLine,
  Wallet,
} from "lucide-react";
import { ownerService } from "@/services/owner.service";
import type { Booking, DashboardData } from "@/types";
import { currency } from "@/utils/format";
import { StatCard } from "@/components/dashboard/stat-card";
import { BookingTable } from "@/components/booking/booking-table";
import { Card } from "@/components/ui/card";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    ownerService
      .dashboard()
      .then((r) => setData(r.data ?? r))
      .catch((e) => setError(e.message || "Could not load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-56" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((x) => (
            <Skeleton key={x} className="h-32" />
          ))}
        </div>
      </div>
    );

  const summary = data?.summary || {};
  const revenue = summary.revenue || {};
  const counts = summary.counts || {};

  const todayRevenue = revenue.today ?? 0;
  const totalRevenue = revenue.overall ?? 0;
  const totalBookings = counts.total ?? 0;
  const pendingApprovals = counts.pending ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-lime-300">
          OPERATIONS OVERVIEW
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Good day, {user?.name || data?.ownerName || "Owner"}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          A real-time view of your venues, bookings and revenue.
        </p>
      </div>
      {error && <ErrorState message={error} />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today’s revenue"
          value={currency(todayRevenue)}
          icon={Wallet}
          detail="Live booking collections"
        />
        <StatCard
          label="All-time revenue"
          value={currency(totalRevenue)}
          icon={CircleDollarSign}
          detail="Across all venues"
        />
        <StatCard
          label="Total bookings"
          value={String(totalBookings)}
          icon={CalendarDays}
          detail="All booking activity"
        />
        <StatCard
          label="Pending approval"
          value={String(pendingApprovals)}
          icon={Clock3}
          detail="Requires your attention"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent bookings</h2>
            <Link
              href="/bookings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-lime-300"
            >
              View all <ArrowUpRight size={15} />
            </Link>
          </div>
          <BookingTable bookings={(data?.recentBookings || []) as Booking[]} />
        </div>
        <Card className="p-5">
          <p className="text-sm text-zinc-500 font-semibold uppercase tracking-wider">Weekly Revenue Trend</p>
          <p className="mt-2 text-3xl font-black text-white">
            {currency(totalRevenue)}
          </p>
          <div className="mt-7 flex h-36 items-end gap-3 border-b border-zinc-800/80 pb-2">
            {(() => {
              const chartData = data?.trends?.revenueChart || [];
              const maxVal = Math.max(...chartData.map((c: any) => c.value), 0) || 1;
              return chartData.map((item: any, i: number) => {
                const pct = maxVal > 0 ? (item.value / maxVal) * 75 + 25 : 25; // 25% minimum height for empty bars
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
                    <div
                      className="w-full rounded-t bg-lime-400/10 hover:bg-lime-400/20 relative cursor-pointer transition-colors duration-200"
                      style={{ height: `${pct}%` }}
                    >
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-t bg-lime-400 transition-all duration-200 group-hover:bg-lime-300"
                        style={{ height: `${item.value > 0 ? 100 : 0}%` }}
                      />
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-zinc-950 text-zinc-100 text-[10px] font-bold py-1.5 px-2.5 rounded-lg border border-zinc-800 pointer-events-none z-30 shadow-xl whitespace-nowrap">
                        {currency(item.value)}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase truncate">{item.label}</span>
                  </div>
                );
              });
            })()}
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Total booking collections over the last 7 days.
          </p>
        </Card>
      </div>
    </div>
  );
}
