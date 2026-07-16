"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, Landmark, WalletCards } from "lucide-react";
import { ownerService } from "@/services/owner.service";
import { currency, dateLabel } from "@/utils/format";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ErrorState, Skeleton, EmptyState } from "@/components/ui/states";
export default function Earnings() {
  const [data, setData] = useState<any>(),
    [error, setError] = useState("");
  useEffect(() => {
    ownerService
      .settlements()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);
  if (!data && !error) return <Skeleton className="h-100" />;
  const summary = data?.summary?.data || data?.summary || {},
    history = data?.history?.data || data?.history || [];
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold tracking-widest text-lime-300">
            FINANCIAL OPERATIONS
          </p>
          <h1 className="mt-2 text-3xl font-bold">Settlements</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Track revenue, payouts and bank settlement history.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/earnings/export"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold"
          >
            <Download size={16} />
            Export
          </Link>
          <Link
            href="/profile/payout"
            className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-zinc-950"
          >
            <Landmark size={16} />
            Payout setup
          </Link>
        </div>
      </div>
      {error && <ErrorState message={error} />}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="All-time revenue"
          value={currency(summary.totalRevenue)}
          icon={WalletCards}
        />
        <StatCard
          label="Total settled"
          value={currency(summary.totalSettled)}
          icon={Landmark}
        />
        <StatCard
          label="Pending settlement"
          value={currency(summary.pendingSettlement)}
          icon={WalletCards}
        />
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-zinc-500">
              PAYOUT METHOD
            </p>
            <p className="mt-2 font-semibold">
              {summary.bankName || "No payout method configured"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {summary.accountNumber
                ? `Account ending ${String(summary.accountNumber).slice(-4)}`
                : "Set up bank details to receive settlements."}
            </p>
          </div>
          <Link
            href="/profile/payout"
            className="text-sm font-semibold text-lime-300"
          >
            Edit
          </Link>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-zinc-800 p-5">
          <h2 className="font-bold">Settlement history</h2>
        </div>
        {Array.isArray(history) && history.length ? (
          <div className="divide-y divide-zinc-800">
            {history.map((x: any, i: number) => (
              <div
                key={x.id || i}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-semibold">
                    {x.reference || x.transactionId || "Settlement"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {dateLabel(x.date || x.createdAt)}
                  </p>
                </div>
                <p className="font-bold text-emerald-300">
                  {currency(x.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No settlements found" />
        )}
      </Card>
    </div>
  );
}
