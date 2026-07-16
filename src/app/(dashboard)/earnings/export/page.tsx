"use client";
import { toast } from "sonner";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const formats = [
  {
    name: "Spreadsheet (CSV)",
    description: "Best for detailed data analysis.",
    Icon: FileSpreadsheet,
    format: "csv" as const,
  },
  {
    name: "Document (PDF)",
    description: "Best for sharing and accounting.",
    Icon: FileText,
    format: "pdf" as const,
  },
];
export default function Export() {
  const exportData = (format: "csv" | "pdf") =>
    toast.success(`${format.toUpperCase()} export requested`);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-bold tracking-widest text-lime-300">
          FINANCIAL TOOLS
        </p>
        <h1 className="mt-2 text-3xl font-bold">Export earnings</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Download your settlement data in the format that suits your workflow.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {formats.map(({ name, description, Icon, format }) => (
          <Card key={format} className="p-5">
            <Icon className="text-lime-300" />
            <h2 className="mt-5 font-bold">{name}</h2>
            <p className="mt-2 text-sm text-zinc-500">{description}</p>
            <Button onClick={() => exportData(format)} className="mt-6 w-full">
              <Download size={16} />
              Export
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
