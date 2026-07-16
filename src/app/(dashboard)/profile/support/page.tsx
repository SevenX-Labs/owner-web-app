"use client";
import { useState } from "react";
import { toast } from "sonner";
import { SUPPORT_CATEGORIES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
export default function Support() {
  const [category, setCategory] = useState(SUPPORT_CATEGORIES[0]),
    [subject, setSubject] = useState(""),
    [description, setDescription] = useState("");
  const submit = () => {
    if (!subject.trim() || !description.trim())
      return toast.error("Fill in all required fields");
    toast.success(
      "Support request created. We’ll contact you within 2–4 hours.",
    );
    setSubject("");
    setDescription("");
  };
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          CUSTOMER CARE
        </p>
        <h1 className="mt-2 text-3xl font-bold">Help center</h1>
      </div>
      <Card className="p-5">
        <p className="font-bold">24/7 Support Desk</p>
        <p className="mt-1 text-sm text-zinc-500">
          Dedicated assistance for arena owners.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {SUPPORT_CATEGORIES.map((x) => (
            <button
              key={x}
              onClick={() => setCategory(x)}
              className={`rounded-full px-3 py-2 text-sm font-semibold ${category === x ? "bg-lime-400 text-zinc-950" : "bg-zinc-800 text-zinc-400"}`}
            >
              {x}
            </button>
          ))}
        </div>
        <label className="mt-6 grid gap-2 text-xs font-bold tracking-widest text-zinc-500">
          SUBJECT
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm font-normal tracking-normal outline-none"
          />
        </label>
        <label className="mt-4 grid gap-2 text-xs font-bold tracking-widest text-zinc-500">
          DESCRIPTION
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm font-normal tracking-normal outline-none"
          />
        </label>
        <Button onClick={submit} className="mt-5">
          Submit request
        </Button>
      </Card>
    </div>
  );
}
