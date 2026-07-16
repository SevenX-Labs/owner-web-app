"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Booking } from "@/types";
import { currency, dateLabel, timeLabel } from "@/utils/format";
import { EmptyState } from "@/components/ui/states";
export function BookingTable({ bookings }: { bookings: Booking[] }) {
  if (!bookings.length)
    return (
      <Card>
        <EmptyState
          title="No bookings found"
          description="Bookings that match your filters will appear here."
        />
      </Card>
    );
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Venue & slot</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-800/30"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold">{b.userName || "Customer"}</p>
                  <p className="text-xs text-zinc-500">
                    {b.userPhone || b.displayId || b.id.slice(0, 8)}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p>{b.turf?.name || b.turfName || "Turfzy venue"}</p>
                  <p className="text-xs text-zinc-500">
                    {b.sport || "Sport"} ·{" "}
                    {timeLabel(b.startTime || b.slot?.startTime)}
                  </p>
                </td>
                <td className="px-5 py-4 text-zinc-300">
                  {dateLabel(b.bookingDate || b.date)}
                </td>
                <td className="px-5 py-4 font-semibold">
                  {currency(b.amount || b.totalAmount)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={b.status || b.bookingStatus} />
                </td>
                <td className="px-5 py-4">
                  <Link
                    aria-label="View booking"
                    href={`/dashboard/bookings/${b.id}`}
                    className="inline-flex rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-lime-300"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
