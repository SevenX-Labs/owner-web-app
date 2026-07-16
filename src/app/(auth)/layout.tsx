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
    <main className="min-h-screen bg-[#f8fafc] grid grid-cols-1 lg:grid-cols-12 font-sans overflow-hidden">
      {/* Left Branding Column (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative overflow-hidden flex-col justify-between p-12 bg-[#022c22] border-r border-[#10b981]/10">
        {/* Subtle grid on sidebar */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {/* Ambient glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[#10b981]/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-[#059669]/10 blur-[120px] pointer-events-none" />

        {/* Sidebar Background Image */}
        <div 
          className="absolute inset-0 bg-[url('/login-sidebar.png')] bg-cover bg-center opacity-45 mix-blend-overlay z-0" 
          style={{ backgroundImage: `url('/login-sidebar.png')` }}
        />
        
        {/* Top bar logo */}
        <div className="relative z-10 flex items-center gap-2.5 bg-[#ffffff] rounded-2xl px-4 py-2.5 self-start shadow-md border border-[#ffffff]/10">
          <img src="/logo.png" alt="Turfzy Logo" className="h-5 w-auto object-contain" />
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#0f172a] border-l border-[#cbd5e1] pl-2.5">PARTNER</span>
        </div>

        {/* Bottom card content */}
        <div className="relative z-10 mt-auto bg-[#ffffff]/05 backdrop-blur-md rounded-2xl border border-[#ffffff]/10 p-8 shadow-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#10b981]/20 text-[#a7f3d0] border border-[#10b981]/25 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            Partner Portal
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight leading-snug text-[#ffffff]">
            Manage your sports venue like a business empire.
          </h2>
          <p className="mt-3 text-sm text-[#cbd5e1] leading-relaxed">
            Streamline your venue scheduling, monitor real-time revenue trends, and automate customer booking processes in one unified dashboard.
          </p>
          
          {/* Feature List */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#ffffff]/15">
            <div>
              <p className="text-[10px] font-bold text-[#a7f3d0] uppercase tracking-wider">Bookings</p>
              <p className="text-sm font-medium text-[#ffffff] mt-1">Real-time scheduling</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#a7f3d0] uppercase tracking-wider">Settlements</p>
              <p className="text-sm font-medium text-[#ffffff] mt-1">Automated payouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[#f8fafc]">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Ambient glow in right column */}
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#10b981]/05 blur-[120px] pointer-events-none" />

        {/* Main Card container */}
        <div className="w-full max-w-md bg-[#ffffff] rounded-[24px] border border-[#f1f5f9] shadow-[0_20px_50px_rgba(16,185,129,0.03)] shadow-[0_8px_30px_rgba(0,0,0,0.015)] p-8 sm:p-10 relative z-10">
          {/* Logo Header (Shows on all screens for form context) */}
          <div className="flex items-center justify-center mb-8">
            <img src="/logo.png" alt="Turfzy" className="h-9 w-auto object-contain" />
          </div>

          {/* Children Content (LoginForm or OtpForm) */}
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}




