"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  ScanLine,
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
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
            path === href || path.startsWith(`${href}/`)
              ? "bg-lime-400 text-zinc-950"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
          )}
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </nav>
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      router.replace("/login");
    }
  };
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-900/80 bg-zinc-950 p-4 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link
          href="/dashboard"
          className="mb-9 flex items-center px-2"
        >
          <img src="/logo.png" alt="Turfzy" className="h-7 w-auto object-contain" />
          <span className="ml-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Owner
          </span>
        </Link>
        {nav}
        <div className="mt-auto space-y-2">
          <Link
            href="/profile/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800"
          >
            <Settings size={18} />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Sign out
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
      <main className="lg:pl-64 flex-1 bg-zinc-900/15 flex flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-900/50 bg-zinc-950/80 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-zinc-300 hover:bg-zinc-800 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="hidden text-sm text-zinc-500 sm:block">
            Welcome back,{" "}
            <span className="font-medium text-zinc-200">
              {user?.name || "Owner"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/scanner"
              className="hidden items-center gap-2 rounded-xl bg-lime-400 px-3 py-2 text-sm font-bold text-zinc-950 sm:flex"
            >
              <ScanLine size={16} />
              Check-in
            </Link>
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.toggle("dark");
                localStorage.setItem("theme", isDark ? "dark" : "light");
                setDarkTheme(isDark);
              }}
              className="rounded-xl p-2.5 text-zinc-300 hover:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {darkTheme ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative rounded-xl p-2.5 text-zinc-300 hover:bg-zinc-800"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-lime-400" />
            </Link>
            <Link
              href="/profile"
              aria-label="Profile"
              className="rounded-xl p-2.5 text-zinc-300 hover:bg-zinc-800"
            >
              <UserRound size={19} />
            </Link>
          </div>
        </header>
        <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
