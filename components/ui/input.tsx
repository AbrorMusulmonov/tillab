import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-border/80 bg-white px-3 text-sm text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)] placeholder:text-muted-foreground focus:border-primary/35",
        className,
      )}
      {...props}
    />
  );
}
