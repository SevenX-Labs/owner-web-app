"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  CircleDollarSign,
  Copy,
  CreditCard,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Phone number copied to clipboard");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
        {/* Back Link Skeleton */}
        <div className="h-4 w-32 rounded-lg bg-zinc-800/80" />
        
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-20 rounded-lg bg-zinc-800/80" />
              <div className="h-5 w-16 rounded-lg bg-zinc-800/80" />
            </div>
            <div className="h-10 w-64 rounded-xl bg-zinc-800/80" />
          </div>
          <div className="h-7 w-24 rounded-full bg-zinc-800/80" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-zinc-800/80" />
                <div className="h-4 w-28 rounded-lg bg-zinc-800/80" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-48 rounded-lg bg-zinc-800/80" />
                <div className="h-4 w-36 rounded-lg bg-zinc-800/80" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Card Skeleton */}
        <div className="h-28 w-full rounded-2xl bg-zinc-900/40 border border-zinc-800" />
      </div>
    );
  }

  if (!booking) return <ErrorState message="Booking not found" />;
  const s = booking.status || booking.bookingStatus || "";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back to Bookings Navigation */}
      <Link
        href="/bookings"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-lime-300 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to bookings
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-zinc-900 border border-zinc-850 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-zinc-400">
              #{booking.displayId || booking.id.slice(0, 8).toUpperCase()}
            </span>
            {booking.sport && (
              <span className="inline-flex items-center rounded-lg bg-lime-400/10 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-lime-400">
                {booking.sport}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {booking.turf?.name || booking.turfName || "Venue booking"}
          </h1>
        </div>
        <div className="flex items-center">
          <StatusBadge status={s} />
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Customer Card */}
        <Card className="p-6 border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <User size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Customer Details
            </p>
          </div>
          <h2 className="mt-4 text-xl font-bold text-white">
            {booking.userName || "Customer"}
          </h2>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <a
              href={booking.userPhone ? `tel:${booking.userPhone}` : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors border border-zinc-750",
                !booking.userPhone && "pointer-events-none opacity-50"
              )}
            >
              <Phone size={14} />
              {booking.userPhone || "No phone provided"}
            </a>
            {booking.userPhone && (
              <button
                onClick={() => copyToClipboard(booking.userPhone!)}
                className="inline-flex items-center justify-center rounded-xl bg-zinc-800/50 hover:bg-zinc-800 p-2 text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-750"
                title="Copy phone number"
              >
                <Copy size={14} />
              </button>
            )}
          </div>
        </Card>

        {/* Payment Card */}
        <Card className="p-6 border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <CircleDollarSign size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Payment Information
            </p>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-lime-400">
            {currency(booking.amount || booking.totalAmount)}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold",
                (booking.paymentStatus || "").toLowerCase() === "paid"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              )}
            >
              {booking.paymentStatus || "Pending"}
            </span>
            {booking.paymentMethod && (
              <span className="inline-flex items-center rounded-lg bg-zinc-800 border border-zinc-750 px-2 py-0.5 text-xs font-semibold text-zinc-400">
                <CreditCard size={12} className="mr-1 inline" />
                {booking.paymentMethod}
              </span>
            )}
          </div>
        </Card>

        {/* Slot Card */}
        <Card className="p-6 border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Calendar size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Booking Slot
            </p>
          </div>
          <p className="mt-4 text-lg font-bold text-white">
            {dateLabel(booking.bookingDate || booking.date)}
          </p>
          <p className="mt-2 text-sm text-zinc-400 font-semibold">
            {timeLabel(booking.startTime || booking.slot?.startTime)} –{" "}
            {timeLabel(booking.endTime || booking.slot?.endTime)}
          </p>
        </Card>

        {/* Venue Card */}
        <Card className="p-6 border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <MapPin size={20} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Venue Location
            </p>
          </div>
          <p className="mt-4 text-lg font-bold text-white">
            {booking.turf?.name || booking.turfName || "Turfzy venue"}
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            {booking.sport || "Sport booking"}
          </p>
        </Card>
      </div>

      {/* Booking Actions (Approve/Reject) */}
      {s.toLowerCase().includes("pending") && (
        <Card className="border border-lime-500/20 bg-lime-500/5 p-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Pending Approval</h3>
              <p className="text-sm text-zinc-400 mt-0.5">
                This booking requires your review. Please confirm the customer details and slot timing before accepting.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button
              onClick={() => action("approve")}
              disabled={busy}
              className="flex-1 shadow-md shadow-lime-500/10 py-3 rounded-xl font-bold"
            >
              <Check size={17} />
              Approve booking
            </Button>
            <Button
              onClick={() => action("reject")}
              disabled={busy}
              variant="danger"
              className="flex-1 py-3 rounded-xl font-bold"
            >
              <X size={17} />
              Reject booking
            </Button>
          </div>
        </Card>
      )}

      {/* Manual Check-in Section */}
      <Card className="p-6 border border-zinc-800 bg-zinc-900/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">Manual check-in override</h3>
            <p className="text-sm text-zinc-500">
              Use only when the QR scanner cannot complete a verified check-in.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1 max-w-lg w-full lg:justify-end">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-300 outline-none focus:border-lime-500/50 transition-colors"
            >
              <option value="">Select override reason</option>
              {[
                "Scanner Not Working",
                "Camera Issue",
                "Technical Issue",
                "Other",
              ].map((x) => (
                <option key={x} className="bg-zinc-950 text-zinc-300">
                  {x}
                </option>
              ))}
            </select>
            <Button
              onClick={checkin}
              disabled={busy || !reason}
              variant="outline"
              className={cn(
                "w-full sm:w-auto px-5 py-2.5 rounded-xl border-zinc-700 text-zinc-200 hover:bg-zinc-800 transition-all",
                reason ? "border-lime-500/30 text-lime-400 hover:bg-lime-500/10" : ""
              )}
            >
              Complete check-in
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

