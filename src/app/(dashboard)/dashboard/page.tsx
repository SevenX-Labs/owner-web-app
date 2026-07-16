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
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null),
    [analyticsData, setAnalyticsData] = useState<any>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [period, setPeriod] = useState("1w");
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      ownerService.dashboard(),
      ownerService.analytics()
    ])
      .then(([dRes, aRes]) => {
        setData(dRes.data ?? dRes);
        setAnalyticsData(aRes);
      })
      .catch((e) => setError(e.message || "Could not load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const rows = analyticsData?.revenue?.data || analyticsData?.revenue || [];

  const chartData = useMemo(() => {
    const sortedRows = [...rows].sort((a, b) => a.date.localeCompare(b.date));
    
    const anchorDate = sortedRows.length > 0
      ? new Date(sortedRows[sortedRows.length - 1].date)
      : new Date();

    let daysToInclude = 7;
    let groupBy: "day" | "week" | "month" = "day";

    if (period === "1w") {
      daysToInclude = 7;
      groupBy = "day";
    } else if (period === "1m") {
      daysToInclude = 30;
      groupBy = "day";
    } else if (period === "3m") {
      daysToInclude = 90;
      groupBy = "week";
    } else if (period === "6m") {
      daysToInclude = 180;
      groupBy = "month";
    } else if (period === "all") {
      daysToInclude = 365;
      groupBy = "month";
    }

    const latestDateParts = sortedRows.length > 0 
      ? sortedRows[sortedRows.length - 1].date.split("-")
      : [String(anchorDate.getFullYear()), String(anchorDate.getMonth() + 1), String(anchorDate.getDate())];
    
    const latestYear = parseInt(latestDateParts[0], 10);
    const latestMonth = parseInt(latestDateParts[1], 10) - 1;
    const latestDay = parseInt(latestDateParts[2], 10);

    const rowMap = new Map(
      sortedRows.map((r) => [r.date, r.revenue || r.amount || 0]),
    );

    const dailyPoints = [];
    for (let i = daysToInclude - 1; i >= 0; i--) {
      const d = new Date(latestYear, latestMonth, latestDay - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      dailyPoints.push({
        date: dateStr,
        revenue: rowMap.get(dateStr) || 0,
      });
    }

    if (groupBy === "day") {
      return dailyPoints;
    } else if (groupBy === "week") {
      const weeks = [];
      for (let i = 0; i < dailyPoints.length; i += 7) {
        const chunk = dailyPoints.slice(i, i + 7);
        const totalRevenue = chunk.reduce((sum, p) => sum + p.revenue, 0);
        weeks.push({
          date: chunk[0].date,
          revenue: totalRevenue,
        });
      }
      return weeks;
    } else {
      const monthsMap = new Map<string, number>();
      dailyPoints.forEach((p) => {
        const yearMonth = p.date.substring(0, 7); // "YYYY-MM"
        monthsMap.set(yearMonth, (monthsMap.get(yearMonth) || 0) + p.revenue);
      });
      return Array.from(monthsMap.entries())
        .map(([yearMonth, revenue]) => ({
          date: `${yearMonth}-01`,
          revenue,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }
  }, [rows, period]);

  const max = Math.max(
    100,
    ...(chartData.map((x: any) => x.revenue || x.amount || 0)),
  );

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
      {/* Interactive Revenue Trend Chart */}
      <Card className="p-6 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/20 w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Revenue trend</h2>
            <p className="text-sm text-zinc-500">
              Daily revenue performance for the active period
            </p>
          </div>
          
          <div className="flex items-center gap-1 self-start rounded-xl bg-zinc-100 dark:bg-zinc-900/80 p-1 border border-zinc-200 dark:border-zinc-800">
            {[
              { label: "1W", value: "1w" },
              { label: "1M", value: "1m" },
              { label: "3M", value: "3m" },
              { label: "6M", value: "6m" },
              { label: "All", value: "all" },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setPeriod(t.value)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all",
                  period === t.value
                    ? "bg-zinc-900 text-white dark:bg-zinc-950 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 pb-2">
          <div className="relative flex h-72 flex-col justify-between w-full min-w-0">
            {/* Background Grid Lines */}
            <div className="absolute inset-y-0 left-12 right-0 flex flex-col justify-between pointer-events-none pb-6">
              {[1, 2, 3, 4].map((x) => (
                <div key={x} className="w-full border-t border-zinc-200 dark:border-zinc-800/40 border-dashed" />
              ))}
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>

            {/* Y Axis + Bars Area */}
            <div className="flex h-60 w-full items-stretch">
              {/* Y Axis Labels */}
              <div className="flex w-12 flex-col justify-between text-[10px] font-medium text-zinc-500 pr-2 select-none">
                <span>{currency(max)}</span>
                <span>{currency(max * 0.75)}</span>
                <span>{currency(max * 0.5)}</span>
                <span>{currency(max * 0.25)}</span>
                <span>{currency(0)}</span>
              </div>

              {/* Bars Area */}
              <div className="flex flex-1 items-end justify-around px-1">
                {chartData.map((r: any, i: number) => {
                  const amount = r.revenue || r.amount || 0;
                  const heightPercent = max > 0 ? (amount / max) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="group relative flex flex-1 max-w-[28px] sm:max-w-[40px] flex-col items-center justify-end h-full"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 z-10 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-[11px] font-bold text-zinc-900 dark:text-white shadow-xl whitespace-nowrap">
                          {currency(amount)}
                        </div>
                      </div>

                      {/* Bar */}
                      <div
                        style={{
                          height: `${Math.max(4, heightPercent)}%`,
                        }}
                        className={cn(
                          "w-full rounded-t-md transition-all duration-300",
                          amount > 0
                            ? "bg-lime-400 hover:bg-lime-500 dark:bg-lime-400 dark:hover:bg-lime-300 shadow-md shadow-lime-500/10"
                            : "bg-zinc-100 dark:bg-zinc-800/40 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800"
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X Axis Labels */}
            <div className="flex w-full pl-12 text-[10px] font-semibold text-zinc-500 select-none">
              <div className="flex flex-1 justify-around px-1">
                {chartData.map((r: any, i: number) => {
                  const dateParts = r.date.split("-");
                  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const monthLabel = monthNames[parseInt(dateParts[1], 10) - 1];
                  const formattedDate = period === "6m" || period === "all"
                    ? monthLabel
                    : `${monthLabel} ${parseInt(dateParts[2], 10)}`;
                  return (
                    <span key={i} className="flex-1 text-center truncate">
                      {formattedDate}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="min-w-0 overflow-hidden w-full pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent bookings</h2>
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-lime-500 hover:text-lime-600 dark:text-lime-300"
          >
            View all <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <BookingTable bookings={(data?.recentBookings || []) as Booking[]} />
        </div>
      </div>
    </div>
  );
}
