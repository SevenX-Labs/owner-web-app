"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Keyboard, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { ownerService } from "@/services/owner.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MANUAL_REASONS } from "@/constants";
export default function Scanner() {
  const video = useRef<HTMLVideoElement>(null),
    [manual, setManual] = useState(false),
    [id, setId] = useState(""),
    [reason, setReason] = useState(""),
    [stream, setStream] = useState<MediaStream | null>(null);
  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);
  const camera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(s);
      if (video.current) video.current.srcObject = s;
      toast.message("Camera ready. Scan QR code in view.");
    } catch {
      toast.error(
        "Camera permission is required. Use manual check-in instead.",
      );
      setManual(true);
    }
  };
  const manualCheck = async () => {
    if (!id || !reason)
      return toast.error("Enter booking ID and choose a reason");
    try {
      await ownerService.manualCheckIn(id, reason);
      toast.success("Manual check-in completed");
      setId("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Check-in failed");
    }
  };
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          ARRIVAL OPERATIONS
        </p>
        <h1 className="mt-2 text-3xl font-bold">QR check-in</h1>
      </div>
      <div className="flex gap-2">
        <Button
          variant={!manual ? "primary" : "outline"}
          onClick={() => setManual(false)}
        >
          <Camera size={16} />
          Camera scan
        </Button>
        <Button
          variant={manual ? "primary" : "outline"}
          onClick={() => setManual(true)}
        >
          <Keyboard size={16} />
          Manual override
        </Button>
      </div>
      {!manual ? (
        <Card className="overflow-hidden p-4">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-950">
            <video
              ref={video}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="size-42 rounded-2xl border-2 border-lime-400 shadow-[0_0_0_999px_rgba(0,0,0,.25)]" />
            </div>
          </div>
          <Button onClick={camera} className="mt-4 w-full">
            <ScanLine size={17} />
            Enable camera
          </Button>
          <p className="mt-3 text-center text-xs text-zinc-500">
            Browser QR decoding depends on the device camera. Use manual
            override if unavailable.
          </p>
        </Card>
      ) : (
        <Card className="space-y-4 p-5">
          <label className="grid gap-2 text-xs font-bold tracking-widest text-zinc-500">
            BOOKING ID
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm font-normal tracking-normal outline-none"
              placeholder="Paste booking UUID"
            />
          </label>
          <label className="grid gap-2 text-xs font-bold tracking-widest text-zinc-500">
            REASON
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm font-normal tracking-normal outline-none"
            >
              <option value="">Select reason</option>
              {MANUAL_REASONS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <Button onClick={manualCheck}>Confirm manual check-in</Button>
        </Card>
      )}
    </div>
  );
}
