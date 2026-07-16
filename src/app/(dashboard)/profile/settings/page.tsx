"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Moon, Sun, ChevronLeft, ShieldAlert, UserCog, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ownerService } from "@/services/owner.service";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [manualApproval, setManualApproval] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [turfs, setTurfs] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check current theme
    setDarkTheme(document.documentElement.classList.contains("dark"));

    // Check turfs for approval type
    ownerService.turfs().then((r) => {
      const list = (r.data || r || []) as any[];
      setTurfs(list);
      const isManual = list.some((t) => t.bookingApprovalType === "MANUAL");
      setManualApproval(isManual);
    }).catch(() => {});
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkTheme(isDark);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const mode = manualApproval ? "MANUAL" : "INSTANT";
      
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
          {/* Edit Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-zinc-900/30 transition-colors">
            <div className="flex items-start sm:items-center gap-4">
              <span className="rounded-xl p-2.5 bg-zinc-800 text-lime-300 shrink-0 mt-1 sm:mt-0">
                <UserCog size={18} />
              </span>
              <div>
                <p className="font-semibold text-zinc-200">Owner Profile</p>
                <p className="text-sm text-zinc-500">Update your personal and contact details</p>
              </div>
            </div>
            <Link href="/profile" className="w-full sm:w-auto text-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-lg transition-colors shrink-0">
              Edit Profile
            </Link>
          </div>

          {/* Bank Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-zinc-900/30 transition-colors">
            <div className="flex items-start sm:items-center gap-4">
              <span className="rounded-xl p-2.5 bg-zinc-800 text-lime-300 shrink-0 mt-1 sm:mt-0">
                <Landmark size={18} />
              </span>
              <div>
                <p className="font-semibold text-zinc-200">Bank Details & Payouts</p>
                <p className="text-sm text-zinc-500">Manage your bank account for settlements</p>
              </div>
            </div>
            <Link href="/profile/payout" className="w-full sm:w-auto text-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-lg transition-colors shrink-0">
              Setup Bank
            </Link>
          </div>

          {/* Manual Approval Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-zinc-900/30 transition-colors">
            <div className="flex items-start sm:items-center gap-4">
              <span className={`rounded-xl p-2.5 shrink-0 mt-1 sm:mt-0 ${manualApproval ? "bg-lime-500/10 text-lime-400" : "bg-zinc-800 text-zinc-400"}`}>
                <ShieldAlert size={18} />
              </span>
              <div>
                <p className={`font-semibold ${manualApproval ? "text-lime-300" : "text-zinc-200"}`}>
                  Manual Booking Approval
                </p>
                <p className="text-sm text-zinc-500">
                  Review bookings before confirming
                </p>
              </div>
            </div>
            <button
              aria-pressed={manualApproval}
              onClick={() => setManualApproval(!manualApproval)}
              className={`h-7 w-12 shrink-0 rounded-full p-1 transition-colors self-start sm:self-auto ${manualApproval ? "bg-lime-400" : "bg-zinc-700"}`}
            >
              <span
                className={`block size-5 rounded-full bg-white transition-transform ${manualApproval ? "translate-x-5" : ""}`}
              />
            </button>
          </div>
          
          {/* Theme Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-zinc-900/30 transition-colors">
            <div className="flex items-start sm:items-center gap-4">
              <span className={`rounded-xl p-2.5 shrink-0 mt-1 sm:mt-0 ${darkTheme ? "bg-zinc-800 text-lime-300" : "bg-amber-500/10 text-amber-500"}`}>
                {darkTheme ? <Moon size={18} /> : <Sun size={18} />}
              </span>
              <div>
                <p className="font-semibold text-zinc-200">Appearance</p>
                <p className="text-sm text-zinc-500">Toggle dark / light dashboard theme</p>
              </div>
            </div>
            <button
              aria-pressed={darkTheme}
              onClick={toggleTheme}
              className={`h-7 w-12 shrink-0 rounded-full p-1 transition-colors self-start sm:self-auto ${darkTheme ? "bg-zinc-700" : "bg-amber-400"}`}
            >
              <span
                className={`block size-5 rounded-full bg-white transition-transform ${darkTheme ? "translate-x-5" : ""}`}
              />
            </button>
          </div>
        </Card>

        <Button onClick={saveChanges} disabled={saving} className="w-full sm:w-auto font-bold px-8 py-6 sm:py-4 shadow-lg shadow-lime-400/20">
          {saving ? "Saving changes..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
