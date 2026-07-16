import { LoginForm } from "@/components/forms/auth-forms";
export default function Login() {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-[#0f172a]">
          Manage your empire
        </h1>
        <p className="mt-2 text-sm text-[#64748b]">
          Enter your mobile number to sign in to your dashboard
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

