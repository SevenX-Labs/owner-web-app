"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, Moon, Volume2, ChevronLeft, ShieldAlert, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ownerService } from "@/services/owner.service";
import type { Turf } from "@/types";

type SettingKey =
  | "manualApproval"
  | "newBooking"
  | "cancellation"
  | "payment"
  | "reminders"
  | "sound";

const rows: {
  key: SettingKey;
  title: string;
  sub: string;
  Icon: LucideIcon;
}[] = [
  {
    key: "manualApproval",
    title: "Manual Booking Approval",
    sub: "Review bookings before confirming (Disable for Instant Approval)",
    Icon: ShieldAlert,
  },
  {
    key: "newBooking",
    title: "New bookings",
    sub: "Receive approval alerts",
    Icon: Bell,
  },
  {
    key: "cancellation",
    title: "Cancellations",
    sub: "Know when reservations change",
    Icon: Bell,
  },
  {
    key: "payment",
    title: "Settlement updates",
    sub: "Confirmations for payouts",
    Icon: Bell,
  },
  {
    key: "reminders",
    title: "Booking reminders",
    sub: "Upcoming slot reminders",
    Icon: Bell,
  },
  {
    key: "sound",
    title: "Sound",
    sub: "Play notification sounds",
    Icon: Volume2,
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<SettingKey, boolean>>({
    manualApproval: false,
    newBooking: true,
    cancellation: true,
    payment: true,
    reminders: true,
    sound: true,
  });
  const [turfs, setTurfs] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ownerService.turfs().then((r) => {
      const list = (r.data || r || []) as any[];
      setTurfs(list);
      // Set to manual if any turf requires manual approval
      const isManual = list.some((t) => t.bookingApprovalType === "MANUAL");
      setSettings((s) => ({ ...s, manualApproval: isManual }));
    }).catch(() => {});
  }, []);
  
  const toggle = (key: SettingKey) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const saveChanges = async () => {
    setSaving(true);
    try {
      const mode = settings.manualApproval ? "MANUAL" : "INSTANT";
      
      // Filter out turfs that already match the target mode so we only update the necessary ones
      const turfsToUpdate = turfs.filter(
        (t) => (t.bookingApprovalType || "INSTANT") !== mode
      );

      if (turfsToUpdate.length > 0) {
        await Promise.all(
          turfsToUpdate.map((t) => 
            ownerService.updateTurf(t.id, { bookingApprovalType: mode })
          )
        );
      }
      
      toast.success("Settings saved successfully!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

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

      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-lime-300">
            APP CONFIGURATION
          </p>
          <h1 className="mt-1 text-3xl font-bold">Settings</h1>
        </div>
        <Card className="divide-y divide-zinc-800">
          {rows.map(({ key, title, sub, Icon }) => (
            <div key={key} className="flex items-center gap-4 p-5">
              <span className={`rounded-xl p-2.5 ${key === "manualApproval" ? (settings[key] ? "bg-lime-500/10 text-lime-400" : "bg-zinc-800 text-zinc-400") : "bg-zinc-800 text-lime-300"}`}>
                <Icon size={18} />
              </span>
              <div className="flex-1">
                <p className={`font-semibold ${key === "manualApproval" && settings[key] ? "text-lime-300" : "text-zinc-200"}`}>{title}</p>
                <p className="text-sm text-zinc-500">{sub}</p>
              </div>
              <button
                aria-pressed={settings[key]}
                onClick={() => toggle(key)}
                className={`h-7 w-12 rounded-full p-1 transition-colors ${settings[key] ? "bg-lime-400" : "bg-zinc-700"}`}
              >
                <span
                  className={`block size-5 rounded-full bg-white transition-transform ${settings[key] ? "translate-x-5" : ""}`}
                />
              </button>
            </div>
          ))}
        </Card>
        <Card className="flex items-center justify-between p-5">
          <div>
            <p className="font-semibold">Appearance</p>
            <p className="text-sm text-zinc-500">Dark dashboard theme</p>
          </div>
          <Moon className="text-lime-300" />
        </Card>
        <Button onClick={saveChanges} disabled={saving} className="w-full sm:w-auto font-bold px-8 shadow-lg shadow-lime-400/20">
          {saving ? "Saving changes..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
