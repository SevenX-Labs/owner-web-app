import Link from "next/link";
import { OtpForm } from "@/components/forms/auth-forms";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";

export default function Otp() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10b981] hover:text-[#059669] transition duration-200">
          <ArrowLeft size={14} />
          Change mobile number
        </Link>
        <h1 className="mt-4 text-[22px] font-bold tracking-tight text-[#0f172a]">
          Check your phone
        </h1>
      </div>
      <Suspense fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-4 bg-[#f1f5f9] rounded w-3/4 animate-pulse"></div>
          <div className="h-12 bg-[#f8fafc] rounded-xl animate-pulse"></div>
          <div className="h-10 bg-[#f1f5f9] rounded-xl animate-pulse"></div>
        </div>
      }>
        <OtpForm />
      </Suspense>
    </div>
  );
}

