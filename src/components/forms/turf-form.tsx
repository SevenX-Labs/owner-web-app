"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ownerService } from "@/services/owner.service";
import type { Turf } from "@/types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/auth-forms";

const AMENITIES_LIST = [
  { id: "floodLights", label: "Flood Lights" },
  { id: "parking", label: "Parking" },
  { id: "washroom", label: "Washroom" },
  { id: "changingRoom", label: "Changing Room" },
  { id: "drinkingWater", label: "Drinking Water" },
  { id: "seatingArea", label: "Seating Area" },
  { id: "cafeteria", label: "Cafeteria" },
] as const;

export function TurfForm({ turf }: { turf?: any }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: turf?.name || "",
      description: turf?.description || "",
      sportsType: turf?.sportsType || "FOOTBALL",
      turfSize: turf?.turfSize || "",
      address: turf?.address || "",
      city: turf?.city || "",
      pincode: turf?.pincode || "",
      lat: turf?.lat || 0,
      lng: turf?.lng || 0,
      openTime: turf?.openTime || "06:00",
      closeTime: turf?.closeTime || "23:00",
      minSlotDurationMins: turf?.minSlotDurationMins || 60,
      weekdayDayPrice: turf?.weekdayDayPrice || 0,
      weekdayNightPrice: turf?.weekdayNightPrice || 0,
      weekendDayPrice: turf?.weekendDayPrice || 0,
      weekendNightPrice: turf?.weekendNightPrice || 0,
      floodLights: turf?.floodLights || false,
      parking: turf?.parking || false,
      washroom: turf?.washroom || false,
      changingRoom: turf?.changingRoom || false,
      drinkingWater: turf?.drinkingWater || false,
      seatingArea: turf?.seatingArea || false,
      cafeteria: turf?.cafeteria || false,
      bookingApprovalType: turf?.bookingApprovalType || "INSTANT",
      paymentPreferences: turf?.paymentPreferences || ["FULL_ONLINE"],
    },
  });

  const paymentPrefs = watch("paymentPreferences");

  const [entranceImg, setEntranceImg] = useState<File | null>(null);
  const [dayTurfImg, setDayTurfImg] = useState<File | null>(null);
  const [nightTurfImg, setNightTurfImg] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const togglePaymentPref = (pref: string) => {
    if (paymentPrefs.includes(pref)) {
      setValue("paymentPreferences", paymentPrefs.filter((p) => p !== pref));
    } else {
      setValue("paymentPreferences", [...paymentPrefs, pref]);
    }
  };

  const submit = async (values: any) => {
    try {
      const payload = { ...values };
      const result = turf
        ? await ownerService.updateTurf(turf.id, payload)
        : await ownerService.createTurf(payload);
      
      const saved = (result.data || result) as any;

      if (entranceImg) await ownerService.uploadImage(saved.id, "entrance", entranceImg);
      if (dayTurfImg) await ownerService.uploadImage(saved.id, "dayTurf", dayTurfImg);
      if (nightTurfImg) await ownerService.uploadImage(saved.id, "nightTurf", nightTurfImg);
      if (video) await ownerService.uploadVideo(saved.id, video);

      toast.success(turf ? "Venue updated successfully" : "Venue created successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to save venue");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-6 md:grid-cols-2">
      {/* Basic Info */}
      <Field label="VENUE NAME">
        <input {...register("name", { required: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>
      <Field label="SPORTS TYPE">
        <select {...register("sportsType")} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl">
          <option value="FOOTBALL">Football</option>
          <option value="CRICKET">Cricket</option>
          <option value="BOTH">Football & Cricket</option>
        </select>
      </Field>

      <div className="md:col-span-2">
        <Field label="DESCRIPTION">
          <textarea rows={3} {...register("description")} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
        </Field>
      </div>

      {/* Location */}
      <div className="md:col-span-2">
        <Field label="ADDRESS">
          <input {...register("address", { required: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
        </Field>
      </div>
      <Field label="CITY">
        <input {...register("city", { required: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>
      <Field label="PINCODE">
        <input {...register("pincode", { required: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>
      
      {!turf && (
        <>
          <Field label="LATITUDE (For creation)">
            <input type="number" step="any" {...register("lat", { valueAsNumber: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
          </Field>
          <Field label="LONGITUDE (For creation)">
            <input type="number" step="any" {...register("lng", { valueAsNumber: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
          </Field>
        </>
      )}

      {/* Turf specific sizing */}
      <Field label="TURF SIZE (e.g. 60x40 ft)">
        <input {...register("turfSize", { required: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>
      <Field label="MIN SLOT DURATION (Mins)">
        <input type="number" {...register("minSlotDurationMins", { valueAsNumber: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>

      {/* Timings */}
      <Field label="OPENING TIME">
        <input type="time" {...register("openTime", { required: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>
      <Field label="CLOSING TIME">
        <input type="time" {...register("closeTime", { required: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>

      {/* Pricing */}
      <div className="md:col-span-2 mt-4">
        <p className="mb-2 text-sm font-bold tracking-widest text-lime-400">PRICING (Per Hour)</p>
      </div>
      <Field label="WEEKDAY DAY PRICE">
        <input type="number" {...register("weekdayDayPrice", { valueAsNumber: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>
      <Field label="WEEKDAY NIGHT PRICE">
        <input type="number" {...register("weekdayNightPrice", { valueAsNumber: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>
      <Field label="WEEKEND DAY PRICE">
        <input type="number" {...register("weekendDayPrice", { valueAsNumber: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>
      <Field label="WEEKEND NIGHT PRICE">
        <input type="number" {...register("weekendNightPrice", { valueAsNumber: true })} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl" />
      </Field>

      {/* Amenities (Booleans) */}
      <div className="md:col-span-2 mt-4">
        <p className="mb-2 text-xs font-bold tracking-widest text-zinc-500">AMENITIES</p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map(({ id, label }) => {
            const isChecked = watch(id as any);
            return (
              <button
                type="button"
                key={id}
                onClick={() => setValue(id as any, !isChecked)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${isChecked ? "bg-lime-400 text-zinc-950 font-bold" : "bg-zinc-800 text-zinc-400"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="md:col-span-2 mt-4">
        <p className="mb-2 text-xs font-bold tracking-widest text-zinc-500">BOOKING PREFERENCES</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="APPROVAL TYPE">
            <select {...register("bookingApprovalType")} className="w-full bg-zinc-950 px-3 py-2 border rounded-xl">
              <option value="INSTANT">Instant Approval</option>
              <option value="MANUAL">Manual Review</option>
            </select>
          </Field>
          <div>
            <span className="block mb-2 text-xs font-bold tracking-widest text-zinc-500 uppercase">Payment Modes</span>
            <div className="flex flex-wrap gap-2">
              {["FULL_ONLINE", "ADVANCE_PAYMENT", "FULL_CASH"].map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => togglePaymentPref(mode)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${paymentPrefs.includes(mode) ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" : "bg-zinc-800 text-zinc-400 border border-transparent"}`}
                >
                  {mode.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Uploads */}
      <div className="md:col-span-2 mt-4">
        <p className="mb-3 text-xs font-bold tracking-widest text-zinc-500 border-b border-zinc-800 pb-2">MEDIA UPLOADS (Optional when editing)</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="grid gap-2 text-xs font-bold text-zinc-400">
            ENTRANCE / PARKING IMAGE
            <input type="file" accept="image/*" onChange={(e) => setEntranceImg(e.target.files?.[0] || null)} className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-2 text-sm" />
          </label>
          <label className="grid gap-2 text-xs font-bold text-zinc-400">
            DAY TURF IMAGE
            <input type="file" accept="image/*" onChange={(e) => setDayTurfImg(e.target.files?.[0] || null)} className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-2 text-sm" />
          </label>
          <label className="grid gap-2 text-xs font-bold text-zinc-400">
            NIGHT TURF IMAGE
            <input type="file" accept="image/*" onChange={(e) => setNightTurfImg(e.target.files?.[0] || null)} className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-2 text-sm" />
          </label>
        </div>
        <div className="mt-4">
          <label className="grid gap-2 text-xs font-bold text-zinc-400">
            PROMO VIDEO (MP4, MOV)
            <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-2 text-sm" />
          </label>
        </div>
      </div>

      <div className="md:col-span-2 pt-4">
        <Button disabled={isSubmitting} className="w-full text-base py-3">
          {isSubmitting ? "Saving venue…" : turf ? "Update Venue Details" : "Create Venue"}
        </Button>
      </div>
    </form>
  );
}
