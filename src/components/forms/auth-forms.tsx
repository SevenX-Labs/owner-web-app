"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/auth-provider";

const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export function LoginForm() {
  const router = useRouter(),
    {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof phoneSchema>>({
      resolver: zodResolver(phoneSchema),
    });

  const submit = async ({ phone }: z.infer<typeof phoneSchema>) => {
    try {
      await authService.login(phone);
      router.push(`/otp?phone=${phone}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to send OTP");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-[11px] font-bold tracking-wider text-[#64748b] uppercase">
          Mobile Number
        </label>
        <div className="flex items-center rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3.5 transition duration-200 focus-within:border-[#10b981] focus-within:ring-4 focus-within:ring-[#10b981]/10 focus-within:bg-[#ffffff]">
          <div className="flex items-center gap-2 pr-2.5 border-r border-[#e2e8f0]">
            {/* Minimal Indian Flag representation */}
            <div className="flex flex-col w-4 h-3 overflow-hidden rounded-[2px] shadow-sm shrink-0">
              <div className="h-1 bg-[#FF9933]"></div>
              <div className="h-1 bg-[#FFFFFF] flex items-center justify-center">
                <div className="w-[3px] h-[3px] rounded-full bg-[#000080]"></div>
              </div>
              <div className="h-1 bg-[#128807]"></div>
            </div>
            <span className="text-sm font-semibold text-[#475569]">+91</span>
          </div>
          <input
            autoFocus
            inputMode="numeric"
            maxLength={10}
            className="w-full bg-transparent pl-3 py-3 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none font-medium"
            placeholder="Enter mobile number"
            {...register("phone")}
          />
        </div>
      </div>
      {errors.phone && (
        <p className="text-xs font-semibold text-[#ef4444] mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {errors.phone.message}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#10b981] hover:bg-[#059669] text-[#ffffff] py-3.5 rounded-xl font-bold shadow-md shadow-[#10b981]/15 hover:shadow-[#10b981]/25 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending code…
          </>
        ) : (
          "Get verification code"
        )}
      </button>
    </form>
  );
}

export function OtpForm() {
  const params = useSearchParams(),
    router = useRouter(),
    { setSession } = useAuth(),
    phone = params.get("phone") || "";
  const [otp, setOtp] = useState(""),
    [busy, setBusy] = useState(false),
    [seconds, setSeconds] = useState(0);

  const verify = async () => {
    if (otp.length !== 6)
      return toast.error("Enter the 6-digit verification code");
    setBusy(true);
    try {
      const data = await authService.verifyOtp(phone, otp);
      if (data.accessToken) {
        setSession(data.accessToken, {
          ...(data.auth || data.user || {}),
          phone,
          accessToken: data.accessToken,
        });
        router.replace("/dashboard");
      } else toast.error(data.message || "Verification failed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    try {
      await authService.resendOtp(phone);
      setSeconds(60);
      const id = setInterval(
        () =>
          setSeconds((x) => {
            if (x <= 1) {
              clearInterval(id);
              return 0;
            }
            return x - 1;
          }),
        1000,
      );
      toast.success("A new OTP has been sent");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to resend OTP");
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[#64748b] leading-relaxed">
        We sent a 6-digit verification code to{" "}
        <strong className="text-[#0f172a] font-semibold">+91 {phone}</strong>.
      </p>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoFocus
        maxLength={6}
        className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] text-[#0f172a] outline-none transition duration-200 focus:border-[#10b981] focus:bg-[#ffffff] focus:ring-4 focus:ring-[#10b981]/10 placeholder-[#cbd5e1] font-mono"
        placeholder="••••••"
      />
      <button
        onClick={verify}
        disabled={busy}
        className="w-full bg-[#10b981] hover:bg-[#059669] text-[#ffffff] py-3.5 rounded-xl font-bold shadow-md shadow-[#10b981]/15 hover:shadow-[#10b981]/25 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        {busy ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Verifying…
          </>
        ) : (
          "Verify & enter"
        )}
      </button>
      <button
        onClick={resend}
        disabled={seconds > 0}
        className="w-full text-xs font-bold text-[#10b981] hover:text-[#059669] disabled:text-[#94a3b8] transition duration-200 cursor-pointer"
      >
        {seconds
          ? `Resend OTP in ${seconds}s`
          : "Didn't receive code? Resend OTP"}
      </button>
    </div>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-xs font-bold tracking-widest text-[#64748b]">
      {label}
      <span className="[&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-[#e2e8f0] [&>input]:bg-[#f8fafc] [&>input]:px-4 [&>input]:py-3 [&>input]:text-sm [&>input]:font-normal [&>input]:tracking-normal [&>input]:text-[#0f172a] [&>input]:outline-none [&>textarea]:w-full [&>textarea]:rounded-xl [&>textarea]:border [&>textarea]:border-[#e2e8f0] [&>textarea]:bg-[#f8fafc] [&>textarea]:px-4 [&>textarea]:py-3 [&>textarea]:text-sm [&>textarea]:font-normal [&>textarea]:tracking-normal [&>textarea]:text-[#0f172a] [&>textarea]:outline-none">
        {children}
      </span>
      {error && (
        <span className="text-xs normal-case tracking-normal text-[#ef4444]">
          {error}
        </span>
      )}
    </label>
  );
}

