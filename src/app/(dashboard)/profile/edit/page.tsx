"use client";
import { useEffect, useState } from "react";
import { ownerService } from "@/services/owner.service";
import { ProfileForm } from "@/components/forms/profile-form";
import { Card } from "@/components/ui/card";
export default function EditProfile() {
  const [profile, setProfile] = useState<any>();
  useEffect(() => {
    ownerService
      .profile()
      .then((r) => setProfile(r.data || r))
      .catch(() => setProfile({}));
  }, []);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          ACCOUNT DETAILS
        </p>
        <h1 className="mt-2 text-3xl font-bold">Edit profile</h1>
      </div>
      <Card className="p-5">
        <ProfileForm profile={profile} />
      </Card>
    </div>
  );
}
