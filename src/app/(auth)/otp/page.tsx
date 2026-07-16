import Link from "next/link";
import { OtpForm } from "@/components/forms/auth-forms";
import { ArrowLeft } from "lucide-react";
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
      <OtpForm />
    </div>
  );
}
