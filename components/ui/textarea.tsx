import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-40 w-full rounded-xl border border-border bg-white p-4 text-sm leading-7 text-foreground placeholder:text-muted-foreground focus:border-primary/40",
        className,
      )}
      {...props}
    />
  );
}
