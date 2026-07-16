"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ownerService } from "@/services/owner.service";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/auth-forms";
export function ProfileForm({ profile }: { profile?: any }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      ownerName: "",
      email: "",
      phone: "",
      bankHolderName: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
      upi: "",
    },
  });
  useEffect(() => {
    if (profile)
      reset({
        ownerName: profile.name || "",
        email: profile.email || "",
        phone: profile.contactNumber || "",
        bankHolderName: profile.payment?.bankHolderName || "",
        bankName: profile.payment?.bankName || "",
        accountNumber: profile.payment?.accountNumber || "",
        ifsc: profile.payment?.ifscCode || "",
        upi: profile.payment?.upiId || "",
      });
  }, [profile, reset]);
  const submit = async (v: any) => {
    try {
      await ownerService.updateProfile({
        name: v.ownerName,
        email: v.email,
        contactNumber: v.phone,
        bankHolderName: v.bankHolderName,
        bankName: v.bankName,
        accountNumber: v.accountNumber,
        ifscCode: v.ifsc,
        upiId: v.upi,
      });
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to update profile");
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4 md:grid-cols-2">
      <Field label="OWNER NAME">
        <input {...register("ownerName")} />
      </Field>
      <Field label="EMAIL">
        <input type="email" {...register("email")} />
      </Field>
      <Field label="MOBILE NUMBER">
        <input {...register("phone")} />
      </Field>
      <Field label="UPI ID">
        <input {...register("upi")} />
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
        <input {...register("ifsc")} />
      </Field>
      <div className="md:col-span-2">
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
