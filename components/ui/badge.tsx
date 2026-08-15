import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "muted",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "muted" | "primary" | "accent" | "warning" | "danger" }) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-teal-50 text-primary",
    accent: "bg-green-50 text-accent",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-destructive",
  };
  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
