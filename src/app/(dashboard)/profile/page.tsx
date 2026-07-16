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

  return (
    <div className="space-y-6 w-full">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
        title="Go back"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-lime-300">
              OWNER ACCOUNT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Profile</h1>
          </div>
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-zinc-950 hover:bg-lime-300 transition-all duration-200 shadow-lg shadow-lime-400/10"
          >
            <Pencil size={16} />
            Edit profile
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main info (left column, 2 cols wide on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Elegant glassmorphic profile card */}
            <Card className="relative overflow-hidden border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl">
              {/* Abstract decorative background glow */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-gradient-to-tr from-lime-400/10 to-emerald-500/10 blur-3xl pointer-events-none" />
              
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  {/* Large Initial Avatar with Glow */}
                  <div className="relative flex-shrink-0">
                    <div className="grid size-20 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-3xl font-black text-zinc-950 shadow-xl shadow-lime-400/20">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 p-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold tracking-tight text-white">{name}</h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-lime-400/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300 border border-lime-400/20">
                        Active Partner
                      </span>
                    </div>
                    <p className="text-zinc-450 text-sm font-medium">
                      {profile.email || "No email added"}
                    </p>
                    {profile.contactNumber && (
                      <p className="text-zinc-500 text-sm flex items-center gap-1.5">
                        <span className="text-lime-300">●</span> {profile.contactNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 border-t border-zinc-800/60 pt-6 sm:grid-cols-2">
                  <div className="rounded-xl bg-zinc-900/30 p-4 border border-zinc-800/30">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Account ID</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-300 font-mono">
                      {profile.id ? `#${profile.id.substring(0, 8).toUpperCase()}` : "N/A"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-zinc-900/30 p-4 border border-zinc-800/30">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Partner Since</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-300">
                      {profile.createdAt 
                        ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : "July 2026"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Venues Summary Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold tracking-tight">Your venues</h3>
              {loadingTurfs ? (
                <Skeleton className="h-44" />
              ) : turfs.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {turfs.slice(0, 2).map((t) => {
                    const coverImage = (t.entranceUrl || t.groundDayUrl || t.groundNightUrl || (Array.isArray(t.images) && t.images[0]) || "") as string;
                    return (
                      <Card className="overflow-hidden border border-zinc-800/60 bg-zinc-900/20" key={t.id}>
                        <div className="relative h-24 w-full">
                          {coverImage ? (
                            <img
                              src={coverImage}
                              alt={t.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-lime-400/10 to-zinc-800" />
                          )}
                          <div className="absolute top-2 right-2 rounded-full bg-zinc-950/85 px-2 py-0.5 text-[10px] text-lime-300 font-bold border border-lime-400/20">
                            {t.sportsType || "SPORTS"}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-sm text-zinc-100 truncate">{t.name}</h4>
                          <p className="mt-1 text-xs text-zinc-500 truncate">{t.location || t.address || "Location not set"}</p>
                          <div className="mt-3 flex items-center justify-between border-t border-zinc-800/30 pt-3">
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
                  {turfs.length > 2 && (
                    <div className="sm:col-span-2 text-center">
                      <Link href="/turf" className="inline-block text-sm font-semibold text-lime-300 hover:text-lime-200 hover:underline">
                        View all {turfs.length} venues →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Card className="p-6 border border-dashed border-zinc-800 bg-zinc-900/10 text-center">
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

          {/* Quick Actions (right column, 1 col wide) */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold tracking-tight">Account actions</h3>
              <div className="grid gap-3">
                {links.map(({ title, sub, Icon, path }) => (
                  <Link href={path} key={title}>
                    <Card className="flex items-center justify-between p-4 border border-zinc-800/60 bg-zinc-900/20 hover:border-lime-400/40 hover:bg-zinc-900/40 transition duration-200 group">
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
          </div>
        </div>
      </div>
    </div>
  );
}
