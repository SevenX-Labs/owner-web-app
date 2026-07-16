"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ownerService } from "@/services/owner.service";
import type { Turf } from "@/types";
import { TurfForm } from "@/components/forms/turf-form";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/states";
export default function EditTurf() {
  const { id } = useParams<{ id: string }>(),
    [turf, setTurf] = useState<Turf | null>(null);
  useEffect(() => {
    ownerService
      .turfs()
      .then((r) => {
        const list = (r.data || r || []) as Turf[];
        setTurf(list.find((x) => x.id === id) || null);
      })
      .catch(() => setTurf(null));
  }, [id]);
  if (!turf) return <Skeleton className="h-100" />;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          VENUE MANAGEMENT
        </p>
        <h1 className="mt-2 text-3xl font-bold">Edit {turf.name}</h1>
      </div>
      <Card className="p-5">
        <TurfForm turf={turf} />
      </Card>
    </div>
  );
}
