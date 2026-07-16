"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleDollarSign, Headphones, Pencil, Settings, ChevronLeft } from "lucide-react";
import { ownerService } from "@/services/owner.service";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/states";

const links = [
  {
    title: "Payout setup",
    sub: "Configure bank and UPI",
    Icon: CircleDollarSign,
    path: "/profile/payout",
  },
  {
    title: "Settings",
    sub: "Notifications and appearance",
    Icon: Settings,
    path: "/profile/settings",
  },
  {
    title: "Help center",
    sub: "Get owner support",
    Icon: Headphones,
    path: "/profile/support",
  },
];

export default function Profile() {
  const [profile, setProfile] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    ownerService
      .profile()
      .then((r) => setProfile(r.data || r))
      .catch(() => setProfile({}));
  }, []);

  if (!profile) return <Skeleton className="h-100" />;
  const name = profile.name || "Owner";

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

      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-lime-300">
              OWNER ACCOUNT
            </p>
            <h1 className="mt-1 text-3xl font-bold">Profile</h1>
          </div>
          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-zinc-950"
          >
            <Pencil size={16} />
            Edit profile
          </Link>
        </div>
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-2xl bg-lime-400 text-2xl font-black text-zinc-950">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {profile.email || profile.contactNumber || "Verified Owner"}
            </p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map(({ title, sub, Icon, path }) => (
          <Link href={path} key={title}>
            <Card className="h-full p-5 transition hover:border-lime-400/40">
              <Icon className="text-lime-300" />
              <h3 className="mt-5 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{sub}</p>
            </Card>
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
}
