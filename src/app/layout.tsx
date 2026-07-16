import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/auth-provider";
export const metadata: Metadata = {
  title: { default: "Turfzy Owner", template: "%s · Turfzy Owner" },
  description:
    "Operate your sports venues, bookings and settlements from one place.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-950 font-sans text-zinc-100">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" theme="dark" />
        </AuthProvider>
      </body>
    </html>
  );
}
