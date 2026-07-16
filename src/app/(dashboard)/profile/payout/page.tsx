"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { ownerService } from "@/services/owner.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/forms/auth-forms";

export default function Payout() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      accountType: "SAVINGS",
      bankHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
    },
  });

  const submit = async (v: any) => {
    try {
      await ownerService.payout(v);
      toast.success("Payout settings saved");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Unable to save payout settings",
      );
    }
  };

  return (
    <div className="space-y-6 w-full">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
        title="Go back"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-lime-300">
            SETTLEMENTS
          </p>
          <h1 className="mt-1 text-3xl font-bold">Payout setup</h1>
        </div>
      <Card className="p-5">
        <form onSubmit={handleSubmit(submit)} className="grid gap-4">
          <Field label="ACCOUNT TYPE">
            <select {...register("accountType")}>
              <option>SAVINGS</option>
              <option>CURRENT</option>
            </select>
          </Field>
          <Field label="BANK HOLDER NAME">
            <input {...register("bankHolderName")} />
          </Field>
          <Field label="BANK NAME">
            <input {...register("bankName")} />
          </Field>
          <Field label="ACCOUNT NUMBER">
            <input {...register("accountNumber")} />
          </Field>
          <Field label="IFSC CODE">
            <input {...register("ifscCode")} />
          </Field>
          <Field label="UPI ID">
            <input {...register("upiId")} />
          </Field>
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save payout settings"}
          </Button>
        </form>
      </Card>
      </div>
    </div>
  );
}
