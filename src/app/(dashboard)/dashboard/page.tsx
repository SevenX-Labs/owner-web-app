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
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    ownerService
      .dashboard()
      .then((r) => setData(r.data ?? (r as unknown as DashboardData)))
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
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-lime-300">
            OPERATIONS OVERVIEW
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Good day, {data?.ownerName || "Owner"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            A real-time view of your venues, bookings and revenue.
          </p>
        </div>
        <Link
          href="/scanner"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-sm font-bold text-zinc-950"
        >
          <ScanLine size={17} />
          Scan QR check-in
        </Link>
      </div>
      {error && <ErrorState message={error} />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today’s revenue"
          value={currency(data?.todayRevenue)}
          icon={Wallet}
          detail="Live booking collections"
        />
        <StatCard
          label="All-time revenue"
          value={currency(data?.totalRevenue)}
          icon={CircleDollarSign}
          detail="Across all venues"
        />
        <StatCard
          label="Total bookings"
          value={String(data?.totalBookings || 0)}
          icon={CalendarDays}
          detail="All booking activity"
        />
        <StatCard
          label="Pending approval"
          value={String(data?.pendingApprovals || 0)}
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
          <p className="text-sm text-zinc-500">Revenue pulse</p>
          <p className="mt-2 text-3xl font-bold">
            {currency(data?.todayRevenue)}
          </p>
          <div className="mt-7 flex h-34 items-end gap-2">
            {[35, 60, 42, 75, 52, 92, 68, 80, 56, 95, 71, 83].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-lime-400/20"
                style={{ height: `${v}%` }}
              >
                <div className="h-1/2 rounded-t bg-lime-400" />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Today’s booking revenue by time block.
          </p>
        </Card>
      </div>
    </div>
  );
}
