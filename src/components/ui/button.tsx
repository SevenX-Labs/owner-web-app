import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const styles = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-lime-400 text-zinc-950 hover:bg-lime-300",
        secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
        outline: "border border-zinc-700 text-zinc-200 hover:bg-zinc-800",
        danger: "bg-red-500 text-white hover:bg-red-400",
        ghost: "text-zinc-300 hover:bg-zinc-800",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);
export function Button({
  className,
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof styles>) {
  return <button className={cn(styles({ variant }), className)} {...props} />;
}
