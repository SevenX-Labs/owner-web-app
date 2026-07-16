import Link from "next/link";
import { OtpForm } from "@/components/forms/auth-forms";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";

export default function Otp() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition">
          <ArrowLeft size={14} />
          Change mobile number
        </Link>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-zinc-900">
          Check your phone
        </h1>
      </div>
      <Suspense fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
          <div className="h-12 bg-zinc-100 rounded-xl"></div>
          <div className="h-10 bg-zinc-200 rounded-xl"></div>
        </div>
      }>
        <OtpForm />
      </Suspense>
    </div>
  );
}
