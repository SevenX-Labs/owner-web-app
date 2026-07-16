"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sun,
  Moon,
  UserRound,
  Volleyball,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/bookings", label: "Bookings", icon: BookOpenCheck },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/earnings", label: "Settlements", icon: CircleDollarSign },
  { href: "/turf", label: "Venues", icon: Volleyball },
];
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(),
    router = useRouter(),
    { user, logout } = useAuth(),
    [open, setOpen] = useState(false),
    [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkTheme(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkTheme(false);
    }
  }, []);
  const nav = (
    <nav className="space-y-1">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={cn(
            "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
            path === href || path.startsWith(`${href}/`)
              ? "bg-lime-400 text-zinc-950 shadow-lg shadow-lime-400/15"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
          )}
        >
          <Icon
            size={18}
            className={cn(
              "shrink-0 transition",
              path === href || path.startsWith(`${href}/`)
                ? "text-zinc-950"
                : "text-zinc-500 group-hover:text-zinc-200",
            )}
          />
          <span className="flex-1">{label}</span>
        </Link>
      ))}
    </nav>
  );

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      router.replace("/login");
    }
  };
  return (
    <div className="flex min-h-dvh flex-col overflow-hidden bg-zinc-950">
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Sign out</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Are you sure you want to sign out of your account?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 transition shadow-md shadow-red-500/20"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-dvh w-72 flex-col overflow-y-auto border-r border-white/5 bg-zinc-950/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between rounded-3xl border border-white/5 bg-white/[0.03] px-3 py-3">
          <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <img src="/logo.png" alt="Turfzy" className="h-7 w-auto object-contain" />
            <span className="text-sm font-semibold tracking-wide text-zinc-100">Owner</span>
          </Link>
          <button 
            onClick={() => setOpen(false)} 
            className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="mb-4 px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Navigation
          </p>
        </div>
        {nav}
        <div className="mt-auto space-y-3 pt-6">
          <Link
            href="/profile/settings"
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3 text-sm font-medium text-zinc-300 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
          >
            <Settings size={18} className="text-zinc-500" />
            <span className="flex-1">Settings</span>
          </Link>
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-3 text-sm font-semibold text-red-200 shadow-sm shadow-red-500/5 transition hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-100 hover:shadow-red-500/10"
          >
            <LogOut size={18} className="text-red-300" />
            <span className="flex-1 text-left">Sign out</span>
          </button>
        </div>
      </aside>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}
      <main className="flex flex-1 flex-col bg-zinc-900/15 lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl p-2 text-zinc-300 transition hover:bg-white/5 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="hidden min-w-0 sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Dashboard
            </p>
            <p className="truncate text-sm text-zinc-300">
              Welcome back,{" "}
              <span className="font-semibold text-zinc-100">
                {user?.name || (user as any)?.ownerProfile?.name || "Owner"}
              </span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] p-1">
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.toggle("dark");
                localStorage.setItem("theme", isDark ? "dark" : "light");
                setDarkTheme(isDark);
              }}
              className="rounded-xl p-2.5 text-zinc-300 transition hover:bg-white/5 hover:text-white"
              aria-label="Toggle theme"
            >
              {darkTheme ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative rounded-xl p-2.5 text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-lime-400 shadow-[0_0_0_4px_rgba(34,197,94,0.15)]" />
            </Link>
            <Link
              href="/profile"
              aria-label="Profile"
              className="rounded-xl p-2.5 text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <UserRound size={19} />
            </Link>
          </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
