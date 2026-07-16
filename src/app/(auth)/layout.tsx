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
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans relative overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      {/* Main Card container */}
      <div className="w-full max-w-md bg-[#ffffff] rounded-[24px] border border-[#f1f5f9] shadow-[0_20px_50px_rgba(16,185,129,0.04)] shadow-[0_8px_30px_rgba(0,0,0,0.015)] p-8 sm:p-10 relative z-10">
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



