"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AMENITIES, SPORT_OPTIONS } from "@/constants";
import { ownerService } from "@/services/owner.service";
import type { Turf } from "@/types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/auth-forms";
export function TurfForm({ turf }: { turf?: Turf }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: turf?.name || "",
      address: turf?.address || turf?.location || "",
      city: turf?.city || "",
      pincode: turf?.pincode || "",
      sportsType: turf?.sport || "Football",
      pricePerHour: turf?.pricePerHour || 0,
      openTime: turf?.openTime || "06:00",
      closeTime: turf?.closeTime || "22:00",
      description: turf?.description || "",
    },
  });
  const initialAmenities = Array.isArray(turf?.amenities)
    ? turf.amenities.filter((item): item is string => typeof item === "string")
    : [];
  const [amenities, setAmenities] = useState<string[]>(initialAmenities);
  const [images, setImages] = useState<File[]>([]),
    [video, setVideo] = useState<File | null>(null);
  const submit = async (values: any) => {
    try {
      const payload = { ...values, amenities };
      const result = turf
        ? await ownerService.updateTurf(turf.id, payload)
        : await ownerService.createTurf(payload);
      const saved = (result.data || result) as Turf;
      for (let i = 0; i < images.length; i++)
        await ownerService.uploadImage(saved.id, `image${i + 1}`, images[i]);
      if (video) await ownerService.uploadVideo(saved.id, video);
      toast.success(turf ? "Venue updated" : "Venue created");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to save venue");
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4 md:grid-cols-2">
      <Field label="VENUE NAME">
        <input {...register("name", { required: true })} />
      </Field>
      <Field label="SPORT">
        <select {...register("sportsType")}>
          {SPORT_OPTIONS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field label="ADDRESS">
          <input {...register("address", { required: true })} />
        </Field>
      </div>
      <Field label="CITY">
        <input {...register("city")} />
      </Field>
      <Field label="PINCODE">
        <input {...register("pincode")} />
      </Field>
      <Field label="PRICE PER HOUR">
        <input
          type="number"
          {...register("pricePerHour", { valueAsNumber: true })}
        />
      </Field>
      <Field label="OPEN TIME">
        <input type="time" {...register("openTime")} />
      </Field>
      <Field label="CLOSE TIME">
        <input type="time" {...register("closeTime")} />
      </Field>
      <div className="md:col-span-2">
        <Field label="DESCRIPTION">
          <textarea rows={4} {...register("description")} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <p className="mb-2 text-xs font-bold tracking-widest text-zinc-500">
          AMENITIES
        </p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((x) => (
            <button
              type="button"
              key={x}
              onClick={() =>
                setAmenities((a) =>
                  a.includes(x) ? a.filter((i) => i !== x) : [...a, x],
                )
              }
              className={`rounded-full px-3 py-2 text-sm ${amenities.includes(x) ? "bg-lime-400 text-zinc-950" : "bg-zinc-800 text-zinc-400"}`}
            >
              {x}
            </button>
          ))}
        </div>
      </div>
      <label className="grid gap-2 text-xs font-bold tracking-widest text-zinc-500">
        UPLOAD IMAGES
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files || []))}
          className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-3 text-sm font-normal tracking-normal"
        />
      </label>
      <label className="grid gap-2 text-xs font-bold tracking-widest text-zinc-500">
        UPLOAD VIDEO
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-3 text-sm font-normal tracking-normal"
        />
      </label>
      <div className="md:col-span-2">
        <Button disabled={isSubmitting}>
          {isSubmitting
            ? "Saving venue…"
            : turf
              ? "Save venue"
              : "Create venue"}
        </Button>
      </div>
    </form>
  );
}
