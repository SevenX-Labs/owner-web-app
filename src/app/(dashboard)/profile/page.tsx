"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleDollarSign,
  Headphones,
  Pencil,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  MapPin,
  Volleyball,
} from "lucide-react";
import { ownerService } from "@/services/owner.service";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/states";
import { currency } from "@/utils/format";

const links = [
  {
    title: "Payout setup",
    sub: "Configure bank and UPI",
    Icon: CircleDollarSign,
    path: "/profile/payout",
  },
  {
    title: "Settings",
    sub: "Notifications and appearance",
    Icon: Settings,
    path: "/profile/settings",
  },
  {
    title: "Help center",
    sub: "Get owner support",
    Icon: Headphones,
    path: "/profile/support",
  },
];

export default function Profile() {
  const [profile, setProfile] = useState<any>();
  const [turfs, setTurfs] = useState<any[]>([]);
  const [loadingTurfs, setLoadingTurfs] = useState(true);
  const router = useRouter();

  useEffect(() => {
    ownerService
      .profile()
      .then((r) => setProfile(r.data || r))
      .catch(() => setProfile({}));

    ownerService
      .turfs()
      .then((r) => setTurfs((r.data || r || []) as any[]))
      .catch(() => setTurfs([]))
      .finally(() => setLoadingTurfs(false));
  }, []);

  if (!profile) return <Skeleton className="h-100" />;
  const name = profile.name || "Owner";

  // Calculate dynamic metrics
  const totalVenues = turfs.length;
  const avgRating = turfs.length
    ? (turfs.reduce((acc, t) => acc + (t.averageRating || 0), 0) / turfs.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 w-full px-2 sm:px-4 md:px-0">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
        title="Go back"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header / Page Title */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-lime-300">
              OWNER ACCOUNT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Profile</h1>
          </div>
          <Link
            href="/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-lime-300 transition-all duration-200 shadow-lg shadow-lime-400/10 active:scale-95 w-full sm:w-auto"
          >
            <Pencil size={16} />
            Edit profile
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Main Info Column (Left) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Elegant Premium Cover Profile Card */}
            <Card className="relative overflow-hidden border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl">
              
              {/* Cover Banner Background */}
              <div className="h-32 bg-gradient-to-r from-emerald-950 via-zinc-900 to-lime-950 relative border-b border-zinc-800/40">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lime-400/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 right-4 flex items-center gap-1.5 rounded-full bg-zinc-950/65 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                  <ShieldCheck size={13} />
                  Verified Partner
                </div>
              </div>

              {/* Profile Details Content */}
              <div className="px-6 pb-6 pt-0">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-6">
                  {/* Large Initial Avatar with border offset */}
                  <div className="relative z-10">
                    <div className="grid size-20 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-3xl font-black text-zinc-950 shadow-xl shadow-lime-400/30 border-4 border-zinc-950">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 p-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </span>
                  </div>

                  <div className="space-y-1 pb-1">
                    <h2 className="text-2xl font-bold tracking-tight text-white">{name}</h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-lime-300" />
                        {profile.email || "No email added"}
                      </span>
                      {profile.contactNumber && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-lime-350" />
                          {profile.contactNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-zinc-800/60 pt-6">
                  <div className="rounded-xl bg-zinc-900/40 p-4 border border-zinc-800/40 text-center sm:text-left">
                    <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                      <Volleyball size={12} className="text-lime-300" />
                      Venues Owned
                    </p>
                    <p className="mt-1 text-2xl font-black text-white">{totalVenues}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-900/40 p-4 border border-zinc-800/40 text-center sm:text-left">
                    <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                      <Star size={12} className="text-lime-350 fill-lime-300/10" />
                      Avg Rating
                    </p>
                    <p className="mt-1 text-2xl font-black text-white">{avgRating} <span className="text-sm font-medium text-zinc-500">★</span></p>
                  </div>
                  <div className="rounded-xl bg-zinc-900/40 p-4 border border-zinc-800/40 text-center sm:text-left col-span-2 sm:col-span-1">
                    <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                      <Calendar size={12} className="text-lime-300" />
                      Partner Since
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-zinc-300">
                      {profile.createdAt 
                        ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : "July 2026"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Venues Summary Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight text-white">Your Venues</h3>
                {turfs.length > 2 && (
                  <Link href="/turf" className="text-xs font-bold text-lime-300 hover:text-lime-200 transition">
                    View all {turfs.length} →
                  </Link>
                )}
              </div>
              
              {loadingTurfs ? (
                <Skeleton className="h-44" />
              ) : turfs.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {turfs.slice(0, 2).map((t) => {
                    const coverImage = (t.entranceUrl || t.groundDayUrl || t.groundNightUrl || (Array.isArray(t.images) && t.images[0]) || "") as string;
                    return (
                      <Card className="overflow-hidden border border-zinc-800/60 bg-zinc-900/20 hover:border-zinc-700/60 hover:scale-[1.01] transition-all duration-300 group" key={t.id}>
                        <div className="relative h-28 w-full overflow-hidden">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={t.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-lime-400/10 to-zinc-800" />
                          )}
                          <div className="absolute top-2.5 right-2.5 rounded-full bg-zinc-950/85 px-2 py-0.5 text-[10px] text-lime-300 font-bold border border-lime-400/20 backdrop-blur-sm">
                            {t.sportsType || "SPORTS"}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-sm text-zinc-100 truncate group-hover:text-white transition">{t.name}</h4>
                          <p className="mt-1 text-xs text-zinc-500 truncate flex items-center gap-1">
                            <MapPin size={11} className="text-zinc-650" />
                            {t.location || t.address || "Location not set"}
                          </p>
                          <div className="mt-3 flex items-center justify-between border-t border-zinc-850 pt-3">
                            <span className="text-xs font-bold text-zinc-300">
                              {currency(t.pricePerHour || (t.weekdayDayPrice as number) || 0)}/hr
                            </span>
                            <Link
                              href={`/turf/${t.id}`}
                              className="text-xs font-bold text-lime-300 hover:text-lime-200 transition"
                            >
                              Manage →
                            </Link>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 border border-dashed border-zinc-800 bg-zinc-900/10 text-center">
                  <p className="text-sm text-zinc-500">No active venues connected to this profile.</p>
                  <Link
                    href="/turf/new"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-lime-300 hover:text-lime-200"
                  >
                    Add a venue →
                  </Link>
                </Card>
              )}
            </div>
          </div>

          {/* Quick Actions & Security Column (Right) */}
          <div className="space-y-6">
            
            {/* Quick Actions List */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold tracking-tight text-white">Account Actions</h3>
              <div className="grid gap-3">
                {links.map(({ title, sub, Icon, path }) => (
                  <Link href={path} key={title}>
                    <Card className="flex items-center justify-between p-4 border border-zinc-800/60 bg-zinc-900/20 hover:border-lime-400/40 hover:bg-zinc-900/40 transition-all duration-300 group hover:scale-[1.01] active:scale-[0.99]">
                      <div className="flex items-center gap-3">
                        <span className="rounded-lg bg-zinc-900/60 p-2.5 text-lime-300 border border-zinc-850 group-hover:border-lime-400/20 transition-all duration-200">
                          <Icon size={18} />
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-zinc-200 group-hover:text-white transition">{title}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-500 group-hover:text-lime-300 transition-transform group-hover:translate-x-1 duration-200" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Platform Badges / Verification Status info */}
            <Card className="p-5 border border-zinc-800/60 bg-zinc-900/20 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Security & Compliance</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-emerald-500/10 p-1 text-emerald-400">
                    <CheckCircle2 size={14} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-300">Identity Verified</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Government KYC status verified.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="rounded-full bg-emerald-500/10 p-1 text-emerald-400">
                    <CheckCircle2 size={14} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-300">Settlements Active</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Direct bank deposit route initialized.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Partner Support info note */}
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-950/40 p-4 text-center">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Need urgent platform help? Contact Turfzy Partner Hotline at <span className="font-bold text-lime-300">support@turfzy.com</span>.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
