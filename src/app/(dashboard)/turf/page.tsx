"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Plus, ArrowUpRight } from "lucide-react";
import { ownerService } from "@/services/owner.service";
import type { Turf } from "@/types";
import { Card } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/states";
import { currency } from "@/utils/format";
export default function TurfPage() {
  const [turfs, setTurfs] = useState<Turf[] | null>(null);
  useEffect(() => {
    ownerService
      .turfs()
      .then((r) => setTurfs((r.data || r || []) as Turf[]))
      .catch(() => setTurfs([]));
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold tracking-widest text-lime-300">
            VENUE MANAGEMENT
          </p>
          <h1 className="mt-2 text-3xl font-bold">Your turfs</h1>
        </div>
        <Link
          href="/turf/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-zinc-950"
        >
          <Plus size={16} />
          Create turf
        </Link>
      </div>
      {!turfs ? (
        <Skeleton className="h-64" />
      ) : turfs.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {turfs.map((t) => {
            const coverImage = (t.entranceUrl || t.groundDayUrl || t.groundNightUrl || (Array.isArray(t.images) && t.images[0]) || "") as string;
            return (
              <Link href={`/turf/${t.id}/edit`} key={t.id}>
                <Card className="h-full overflow-hidden transition hover:border-lime-400/40">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={t.name}
                      className="h-28 w-full object-cover"
                    />
                  ) : (
                    <div className="h-28 bg-gradient-to-br from-lime-400/25 to-zinc-800" />
                  )}
                  <div className="p-5">
                    <div className="flex justify-between gap-3">
                      <h2 className="font-bold">{t.name}</h2>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-300">
                        {t.status || "Active"}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-1 text-sm text-zinc-500">
                      <MapPin size={14} />
                      {t.location || t.address || "Location unavailable"}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-zinc-800/50 pt-4">
                      <p className="font-semibold">
                        {currency(t.pricePerHour || (t.weekdayDayPrice as number) || 0)}{" "}
                        <span className="text-sm font-normal text-zinc-500">
                          / hour
                        </span>
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-lime-300">
                        View / Edit <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            title="No turfs yet"
            description="Create your first venue to start accepting bookings."
          />
        </Card>
      )}
    </div>
  );
}
