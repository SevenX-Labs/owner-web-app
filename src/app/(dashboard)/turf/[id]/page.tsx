"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Clock,
  CircleDollarSign,
  ChevronLeft,
  Edit2,
  Tv,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ownerService } from "@/services/owner.service";
import type { Turf } from "@/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/states";
import { currency } from "@/utils/format";

const AMENITY_LABELS: Record<string, string> = {
  floodLights: "Flood Lights",
  parking: "Parking Space",
  washroom: "Washrooms",
  changingRoom: "Changing Room",
  drinkingWater: "Drinking Water",
  seatingArea: "Seating Area",
  cafeteria: "Cafeteria / Pantry",
};

export default function TurfDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [turf, setTurf] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerService
      .turfs()
      .then((r) => {
        const list = (r.data || r || []) as any[];
        const found = list.find((x) => x.id === id);
        setTurf(found || null);
      })
      .catch(() => setTurf(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Skeleton className="h-100" />;

  if (!turf) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-xl font-bold text-zinc-300">Venue not found</h2>
        <button
          onClick={() => router.push("/turf")}
          className="mt-4 rounded-xl bg-lime-400 px-4 py-2 text-sm font-bold text-zinc-950"
        >
          Back to venues
        </button>
      </div>
    );
  }

  const images = [
    { label: "Ground Day", url: turf.groundDayUrl },
    { label: "Ground Night", url: turf.groundNightUrl },
    { label: "Entrance / Parking", url: turf.entranceUrl },
  ].filter((img) => img.url);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/turf")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold tracking-widest text-lime-300 uppercase">
                Venue View Mode
              </p>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-2xs font-semibold text-emerald-300 uppercase">
                {turf.status || "Active"}
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-bold text-zinc-100">
              {turf.name}
            </h1>
          </div>
        </div>

        <Link
          href={`/turf/${turf.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-lime-300 transition"
        >
          <Edit2 size={16} />
          Edit Venue details
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Core Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                Description
              </h3>
              <p className="mt-2 text-zinc-300 leading-relaxed text-sm">
                {turf.description || "No description provided."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t border-zinc-800/80 pt-6">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Sports Type
                </h3>
                <span className="mt-2 inline-block rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-sm font-semibold text-lime-300">
                  {turf.sportsType === "BOTH"
                    ? "Football & Cricket ⚽🏏"
                    : turf.sportsType === "CRICKET"
                      ? "Cricket 🏏"
                      : "Football ⚽"}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Turf Dimension / Size
                </h3>
                <p className="mt-2 text-zinc-100 text-sm font-semibold">
                  {turf.turfSize || "Not specified"}
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-800/80 pt-6">
              <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase mb-3">
                Venue Location
              </h3>
              <div className="flex gap-2.5 items-start text-zinc-300 text-sm">
                <MapPin size={16} className="text-lime-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-100">{turf.address}</p>
                  <p className="text-zinc-400 text-xs mt-1">
                    {turf.city} · {turf.pincode}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing & Hours Card */}
          <Card className="p-6 space-y-6">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Clock size={18} className="text-lime-400" />
              Hours & Slots Info
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl">
                <p className="text-2xs font-bold tracking-wider text-zinc-500 uppercase">
                  Open Time
                </p>
                <p className="mt-1 text-lg font-bold text-zinc-100">
                  {turf.openTime || "06:00"}
                </p>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl">
                <p className="text-2xs font-bold tracking-wider text-zinc-500 uppercase">
                  Close Time
                </p>
                <p className="mt-1 text-lg font-bold text-zinc-100">
                  {turf.closeTime || "23:00"}
                </p>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl">
                <p className="text-2xs font-bold tracking-wider text-zinc-500 uppercase">
                  Min Slot Duration
                </p>
                <p className="mt-1 text-lg font-bold text-zinc-100">
                  {turf.minSlotDurationMins || 60} mins
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-800/80 pt-6 space-y-4">
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <CircleDollarSign size={18} className="text-lime-400" />
                Hourly Pricing Setup
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-1.5">
                    Weekdays
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Day rate:</span>
                    <span className="font-semibold text-zinc-200">
                      {currency(turf.weekdayDayPrice || 0)}/hr
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Night rate:</span>
                    <span className="font-semibold text-zinc-200">
                      {currency(turf.weekdayNightPrice || 0)}/hr
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 border-b border-zinc-800 pb-1.5">
                    Weekends
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Day rate:</span>
                    <span className="font-semibold text-zinc-200">
                      {currency(turf.weekendDayPrice || 0)}/hr
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Night rate:</span>
                    <span className="font-semibold text-zinc-200">
                      {currency(turf.weekendNightPrice || 0)}/hr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Amenities, Prefs, Media */}
        <div className="space-y-6">
          {/* Amenities Card */}
          <Card className="p-6">
            <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase mb-4">
              Amenities Offered
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(AMENITY_LABELS).map((key) => {
                const available = !!turf[key];
                return (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      available
                        ? "bg-lime-400/10 border border-lime-400/20 text-lime-300"
                        : "bg-zinc-900/60 border border-zinc-800/80 text-zinc-600 line-through"
                    }`}
                  >
                    {available ? (
                      <CheckCircle2 size={13} className="text-lime-400" />
                    ) : (
                      <XCircle size={13} className="text-zinc-700" />
                    )}
                    {AMENITY_LABELS[key]}
                  </span>
                );
              })}
            </div>
          </Card>

          {/* Booking Preferences */}
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                Booking Approval Mode
              </h3>
              <p className="mt-2 text-zinc-100 font-semibold text-sm">
                {turf.bookingApprovalType === "MANUAL"
                  ? "Requires Manual Approval 📋"
                  : "Instant Confirmation ⚡"}
              </p>
            </div>

            <div className="border-t border-zinc-800/80 pt-5">
              <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase mb-3">
                Accepted Payment Methods
              </h3>
              <ul className="space-y-2">
                {[
                  { id: "FULL_ONLINE", label: "Full Online Payment" },
                  { id: "ADVANCE_PAYMENT", label: "Partial Advance Payment" },
                  { id: "FULL_CASH", label: "Cash / Pay at Venue" },
                ].map((pm) => {
                  const accepted = (turf.paymentPreferences || []).includes(
                    pm.id
                  );
                  return (
                    <li
                      key={pm.id}
                      className={`flex items-center gap-2 text-xs ${
                        accepted ? "text-zinc-200 font-medium" : "text-zinc-600 line-through"
                      }`}
                    >
                      <CheckCircle2
                        size={14}
                        className={accepted ? "text-lime-400" : "text-zinc-800"}
                      />
                      {pm.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>

          {/* Media & Video */}
          {images.length > 0 && (
            <Card className="p-6 space-y-4">
              <h3 className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                Uploaded Media
              </h3>
              <div className="grid gap-2">
                {images.map((img) => (
                  <div
                    key={img.label}
                    className="group relative h-28 overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800"
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-2.5">
                      <p className="text-2xs font-bold text-zinc-100">
                        {img.label}
                      </p>
                    </div>
                  </div>
                ))}

                {turf.videoUrl && (
                  <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Tv size={14} className="text-lime-400" />
                      Promo video uploaded
                    </span>
                    <a
                      href={turf.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lime-300 font-bold hover:underline"
                    >
                      Play Video
                    </a>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
