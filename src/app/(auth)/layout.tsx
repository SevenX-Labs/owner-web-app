"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, user } = useAuth(),
    router = useRouter();
  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50/20 to-emerald-100/30 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card container */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-emerald-100/50 shadow-xl shadow-emerald-950/5 p-8 relative z-10">
        {/* Logo Header */}
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Turfzy" className="h-9 w-auto object-contain" />
        </div>

        {/* Children Content (LoginForm or OtpForm) */}
        <div>{children}</div>
      </div>
    </main>
  );
}


