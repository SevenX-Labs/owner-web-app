"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Clock,
  TrendingUp,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ownerService } from "@/services/owner.service";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { currency, timeLabel } from "@/utils/format";
import { ErrorState, Skeleton } from "@/components/ui/states";

export default function Analytics() {
  const [data, setData] = useState<any>(),
    [error, setError] = useState(""),
    [period, setPeriod] = useState("1w");

  useEffect(() => {
    ownerService
      .analytics()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (!data && !error) return <Skeleton className="h-100" />;

  const overall = data?.overall?.data || data?.overall || {},
    rows = data?.revenue?.data || data?.revenue || [];

  // Parse peak hour list and format top peak hour
  const peakHourList = data?.peak?.data || data?.peak || [];
  const rawPeakHour = peakHourList.length > 0 ? peakHourList[0].hour : "";
  const peakHour = rawPeakHour ? timeLabel(rawPeakHour) : "—";

  // Calculate dynamic occupancy rate since backend does not return it directly
  const occupancyRate = overall.totalBookings > 0
    ? (((overall.completedBookings || 0) / overall.totalBookings) * 100).toFixed(1) + "%"
    : "0.0%";

  // Generate chart data: ensure we always show a range of consecutive days ending on the latest date
  const chartData = useMemo(() => {
    const sortedRows = [...rows].sort((a, b) => a.date.localeCompare(b.date));
    
    // Find latest date in data (default to today if empty)
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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          PERFORMANCE INTELLIGENCE
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Analytics</h1>
      </div>

      {error && <ErrorState message={error} />}

      {/* Row 1 Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total revenue"
          value={currency(overall.totalRevenue || 0)}
          icon={TrendingUp}
          detail="All-time earnings"
        />
        <StatCard
          label="Total bookings"
          value={String(overall.totalBookings || 0)}
          icon={CalendarDays}
          detail="Across all slots"
        />
        <StatCard
          label="Occupancy rate"
          value={occupancyRate}
          icon={Activity}
          detail="Completed vs total capacity"
        />
      </div>

      {/* Revenue Trend Chart Card */}
      <Card className="p-6 border border-zinc-800 bg-zinc-900/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Revenue trend</h2>
            <p className="text-sm text-zinc-500">
              Daily revenue performance for the active period
            </p>
          </div>
          
          <div className="flex items-center gap-1 self-start rounded-xl bg-zinc-900/80 p-1 border border-zinc-800">
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
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Premium Chart Container with horizontal scroll wrapper */}
        <div className="mt-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <div className="relative flex h-72 flex-col justify-between min-w-[540px] md:min-w-full">
            {/* Background Grid Lines */}
            <div className="absolute inset-y-0 left-12 right-0 flex flex-col justify-between pointer-events-none pb-6">
              {[1, 2, 3, 4].map((x) => (
                <div key={x} className="w-full border-t border-zinc-800/40 border-dashed" />
              ))}
              <div className="w-full border-t border-zinc-800" />
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
                        <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-bold text-white shadow-xl whitespace-nowrap">
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
                            ? "bg-lime-450 bg-lime-400 group-hover:bg-lime-300 shadow-md shadow-lime-500/10"
                            : "bg-zinc-800/40 group-hover:bg-zinc-800"
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
                  const monthNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ];
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

      {/* Row 2 Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Peak booking hour"
          value={peakHour}
          icon={Clock}
          detail="Most active slot time"
        />
        <StatCard
          label="Cancellation rate"
          value={overall.cancellationRate || "0%"}
          icon={AlertTriangle}
          detail="Percentage of cancelled bookings"
        />
        <StatCard
          label="No-show rate"
          value={overall.noShowRate || "0%"}
          icon={UserX}
          detail="Customers who missed slots"
        />
      </div>
    </div>
  );
}
