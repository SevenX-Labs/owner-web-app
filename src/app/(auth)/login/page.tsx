import { LoginForm } from "@/components/forms/auth-forms";
export default function Login() {
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">
          Manage your empire
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Enter your mobile number to sign in to your dashboard
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
