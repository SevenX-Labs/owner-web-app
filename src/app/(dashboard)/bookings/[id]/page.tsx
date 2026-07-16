"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, CircleDollarSign, MapPin, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { ownerService } from "@/services/owner.service";
import type { Booking } from "@/types";
import { currency, dateLabel, timeLabel } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ErrorState, Skeleton } from "@/components/ui/states";
export default function BookingDetail() {
  const { id } = useParams<{ id: string }>(),
    router = useRouter(),
    [booking, setBooking] = useState<Booking | null>(null),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [reason, setReason] = useState("");
  useEffect(() => {
    ownerService
      .booking(id)
      .then((r) => setBooking((r.data || r) as Booking))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  const action = async (type: "approve" | "reject") => {
    setBusy(true);
    try {
      const r =
        type === "approve"
          ? await ownerService.approve(id)
          : await ownerService.reject(id);
      setBooking((r.data || r) as Booking);
      toast.success(
        type === "approve" ? "Booking approved" : "Booking rejected",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to update booking");
    } finally {
      setBusy(false);
    }
  };
  const checkin = async () => {
    if (!reason) return toast.error("Choose a manual override reason");
    setBusy(true);
    try {
      await ownerService.manualCheckIn(id, reason);
      toast.success("Manual check-in completed");
      router.push("/bookings");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Check-in failed");
    } finally {
      setBusy(false);
    }
  };
  if (loading) return <Skeleton className="h-100" />;
  if (!booking) return <ErrorState message="Booking not found" />;
  const s = booking.status || booking.bookingStatus || "";
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/bookings" className="text-sm font-semibold text-lime-300">
        ← Back to bookings
      </Link>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-xs font-bold tracking-widest text-zinc-500">
            BOOKING {booking.displayId || booking.id.slice(0, 8).toUpperCase()}
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            {booking.turf?.name || booking.turfName || "Venue booking"}
          </h1>
        </div>
        <StatusBadge status={s} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs font-bold tracking-widest text-zinc-500">
            CUSTOMER
          </p>
          <h2 className="mt-4 text-xl font-bold">
            {booking.userName || "Customer"}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
            <Phone size={15} />
            {booking.userPhone || "No phone provided"}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold tracking-widest text-zinc-500">
            PAYMENT
          </p>
          <p className="mt-4 text-2xl font-bold">
            {currency(booking.amount || booking.totalAmount)}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
            <CircleDollarSign size={15} />
            {booking.paymentStatus || "Pending"} ·{" "}
            {booking.paymentMethod || "—"}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold tracking-widest text-zinc-500">
            SLOT
          </p>
          <p className="mt-4 text-lg font-bold">
            {dateLabel(booking.bookingDate || booking.date)}
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            {timeLabel(booking.startTime || booking.slot?.startTime)} –{" "}
            {timeLabel(booking.endTime || booking.slot?.endTime)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold tracking-widest text-zinc-500">
            VENUE
          </p>
          <p className="mt-4 flex items-center gap-2 text-lg font-bold">
            <MapPin size={18} className="text-lime-300" />
            {booking.turf?.name || booking.turfName || "Turfzy venue"}
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            {booking.sport || "Sport booking"}
          </p>
        </Card>
      </div>
      {s.toLowerCase().includes("pending") && (
        <Card className="flex flex-col gap-3 p-5 sm:flex-row">
          <Button
            onClick={() => action("approve")}
            disabled={busy}
            className="flex-1"
          >
            <Check size={17} />
            Approve booking
          </Button>
          <Button
            onClick={() => action("reject")}
            disabled={busy}
            variant="danger"
            className="flex-1"
          >
            <X size={17} />
            Reject booking
          </Button>
        </Card>
      )}
      <Card className="p-5">
        <h2 className="font-bold">Manual check-in</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Use only when the QR scanner cannot complete a verified check-in.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm outline-none"
          >
            <option value="">Select override reason</option>
            {[
              "Scanner Not Working",
              "Camera Issue",
              "Technical Issue",
              "Other",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <Button
            onClick={checkin}
            disabled={busy || !reason}
            variant="outline"
          >
            Complete check-in
          </Button>
        </div>
      </Card>
    </div>
  );
}
