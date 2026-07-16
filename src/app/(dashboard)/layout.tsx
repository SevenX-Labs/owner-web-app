"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth-provider";
import { Skeleton } from "@/components/ui/states";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, user } = useAuth(),
    router = useRouter();
  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);
  if (!ready || !user)
    return (
      <div className="p-10">
        <Skeleton className="h-12 w-64" />
      </div>
    );
  return <DashboardShell>{children}</DashboardShell>;
}
