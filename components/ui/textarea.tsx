import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-40 w-full rounded-xl border border-border/80 bg-white p-4 text-sm leading-7 text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)] placeholder:text-muted-foreground focus:border-primary/35",
        className,
      )}
      {...props}
    />
  );
}
