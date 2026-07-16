"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
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
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-xs font-extrabold tracking-wider text-zinc-500 uppercase">
          Mobile Number
        </label>
        <div className="flex rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:bg-white">
          <span className="py-3.5 font-semibold text-zinc-500">+91</span>
          <input
            autoFocus
            inputMode="numeric"
            maxLength={10}
            className="w-full bg-transparent px-3 py-3.5 text-zinc-900 placeholder-zinc-400 outline-none font-medium"
            placeholder="Enter your mobile number"
            {...register("phone")}
          />
        </div>
      </div>
      {errors.phone && (
        <p className="text-xs font-medium text-red-600">{errors.phone.message}</p>
      )}
      <Button 
        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3.5 rounded-xl font-bold shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.99] transition duration-200" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending code…" : "Get verification code"}
      </Button>
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
      <p className="text-sm text-zinc-500 leading-relaxed">
        We sent a 6-digit verification code to{" "}
        <strong className="text-zinc-800 font-bold">+91 {phone}</strong>.
      </p>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoFocus
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-center text-3xl font-black tracking-[0.5em] text-zinc-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 placeholder-zinc-300"
        placeholder="000000"
      />
      <Button 
        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3.5 rounded-xl font-bold shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.99] transition duration-200" 
        onClick={verify} 
        disabled={busy}
      >
        {busy ? "Verifying…" : "Verify & enter"}
      </Button>
      <button
        onClick={resend}
        disabled={seconds > 0}
        className="w-full text-sm font-bold text-emerald-600 hover:text-emerald-700 disabled:text-zinc-400 transition"
      >
        {seconds
          ? `Resend in 0:${String(seconds).padStart(2, "0")}`
          : "Resend OTP"}
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
    <label className="grid gap-2 text-xs font-bold tracking-widest text-zinc-500">
      {label}
      <span className="[&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-zinc-700 [&>input]:bg-zinc-900 [&>input]:px-4 [&>input]:py-3 [&>input]:text-sm [&>input]:font-normal [&>input]:tracking-normal [&>input]:text-zinc-100 [&>input]:outline-none [&>textarea]:w-full [&>textarea]:rounded-xl [&>textarea]:border [&>textarea]:border-zinc-700 [&>textarea]:bg-zinc-900 [&>textarea]:px-4 [&>textarea]:py-3 [&>textarea]:text-sm [&>textarea]:font-normal [&>textarea]:tracking-normal [&>textarea]:text-zinc-100 [&>textarea]:outline-none">
        {children}
      </span>
      {error && (
        <span className="text-xs normal-case tracking-normal text-red-300">
          {error}
        </span>
      )}
    </label>
  );
}
