"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, Moon, Volume2, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
type SettingKey =
  "newBooking" | "cancellation" | "payment" | "reminders" | "sound";
const rows: {
  key: SettingKey;
  title: string;
  sub: string;
  Icon: LucideIcon;
}[] = [
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
  const [settings, setSettings] = useState<Record<SettingKey, boolean>>({
    newBooking: true,
    cancellation: true,
    payment: true,
    reminders: true,
    sound: true,
  });
  const toggle = (key: SettingKey) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          APP CONFIGURATION
        </p>
        <h1 className="mt-2 text-3xl font-bold">Settings</h1>
      </div>
      <Card className="divide-y divide-zinc-800">
        {rows.map(({ key, title, sub, Icon }) => (
          <div key={key} className="flex items-center gap-4 p-5">
            <span className="rounded-xl bg-zinc-800 p-2 text-lime-300">
              <Icon size={18} />
            </span>
            <div className="flex-1">
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-zinc-500">{sub}</p>
            </div>
            <button
              aria-pressed={settings[key]}
              onClick={() => toggle(key)}
              className={`h-7 w-12 rounded-full p-1 transition ${settings[key] ? "bg-lime-400" : "bg-zinc-700"}`}
            >
              <span
                className={`block size-5 rounded-full bg-white transition ${settings[key] ? "translate-x-5" : ""}`}
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
      <Button onClick={() => toast.success("Settings saved")}>
        Save changes
      </Button>
    </div>
  );
}
