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
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M21 12c0-1.66-4-3-9-3s-9 1.34-9 3 4 3 9 3 9-1.34 9-3z" />
              <path d="M3 12v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-emerald-950">
            Turfzy <span className="text-emerald-600 font-semibold">Owner</span>
          </span>
        </div>

        {/* Children Content (LoginForm or OtpForm) */}
        <div>{children}</div>
      </div>
    </main>
  );
}


