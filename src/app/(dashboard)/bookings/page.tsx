"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ownerService } from "@/services/owner.service";
import type { Booking } from "@/types";
import { BookingTable } from "@/components/booking/booking-table";
import { Button } from "@/components/ui/button";
import { ErrorState, Skeleton } from "@/components/ui/states";
export default function Bookings() {
  const [items, setItems] = useState<Booking[]>([]),
    [q, setQ] = useState(""),
    [status, setStatus] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    ownerService
      .bookings()
      .then((r) => setItems((r.data || r || []) as Booking[]))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const result = useMemo(
    () =>
      items.filter((b) => {
        const text =
          `${b.userName || ""} ${b.userPhone || ""} ${b.id} ${b.turf?.name || ""}`.toLowerCase();
        return (
          text.includes(q.toLowerCase()) &&
          (!status ||
            (b.status || b.bookingStatus || "").toLowerCase() === status)
        );
      }),
    [items, q, status],
  );
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          BOOKING OPERATIONS
        </p>
        <h1 className="mt-2 text-3xl font-bold">Bookings</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Review, approve and manage every venue reservation.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3">
          <Search size={18} className="text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search customer, booking ID or venue"
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-400">
          <SlidersHorizontal size={17} />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-transparent py-3 outline-none"
          >
            <option value="">All statuses</option>
            <option value="pending_approval">Pending approval</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>
      {error && <ErrorState message={error} />}{" "}
      {loading ? (
        <Skeleton className="h-100" />
      ) : (
        <BookingTable bookings={result} />
      )}
    </div>
  );
}
