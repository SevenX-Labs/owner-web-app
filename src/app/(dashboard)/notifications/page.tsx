"use client";
import { useState } from "react";
import Link from "next/link";
import { BellRing, CheckCheck, Trash2 } from "lucide-react";
import type { NotificationItem } from "@/types";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
const initial: NotificationItem[] = [];
export default function Notifications() {
  const [items, setItems] = useState(initial);
  const enable = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    if (result === "granted")
      new Notification("Turfzy Owner", {
        body: "Browser notifications enabled.",
      });
  };
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <p className="text-xs font-bold tracking-widest text-lime-300">
            ACTIVITY CENTER
          </p>
          <h1 className="mt-2 text-3xl font-bold">Notifications</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={enable}
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-semibold"
          >
            Enable browser alerts
          </button>
          <button
            onClick={() => setItems([])}
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-semibold"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <Card>
        {items.length ? (
          items.map((x) => (
            <Link
              key={x.id}
              href={x.bookingId ? `/bookings/${x.bookingId}` : "/notifications"}
              className="flex gap-4 border-b border-zinc-800 p-5 last:border-0"
            >
              <span className="rounded-xl bg-lime-400/10 p-2 text-lime-300">
                <BellRing size={18} />
              </span>
              <div>
                <p className="font-semibold">{x.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{x.message}</p>
              </div>
            </Link>
          ))
        ) : (
          <EmptyState
            title="All caught up!"
            description="New booking and payment activity will appear here."
          />
        )}
      </Card>
      {items.length > 0 && (
        <button
          onClick={() =>
            setItems((i) => i.map((x) => ({ ...x, isRead: true })))
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-lime-300"
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      )}
    </div>
  );
}
