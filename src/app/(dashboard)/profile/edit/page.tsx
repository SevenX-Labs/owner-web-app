"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ownerService } from "@/services/owner.service";
import { ProfileForm } from "@/components/forms/profile-form";
import { Card } from "@/components/ui/card";

export default function EditProfile() {
  const [profile, setProfile] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    ownerService
      .profile()
      .then((r) => setProfile(r.data || r))
      .catch(() => setProfile({}));
  }, []);

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

      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-lime-300">
            ACCOUNT DETAILS
          </p>
          <h1 className="mt-1 text-3xl font-bold">Edit profile</h1>
        </div>
        <Card className="p-5">
          <ProfileForm profile={profile} />
        </Card>
      </div>
    </div>
  );
}
