import { TurfForm } from "@/components/forms/turf-form";
import { Card } from "@/components/ui/card";
export default function NewTurf() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          VENUE MANAGEMENT
        </p>
        <h1 className="mt-2 text-3xl font-bold">Create turf</h1>
      </div>
      <Card className="p-5">
        <TurfForm />
      </Card>
    </div>
  );
}
