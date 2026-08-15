import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({
  title,
  description,
  children,
  className,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div className={cn("mx-auto px-5 py-14 sm:px-6 sm:py-16", wide ? "max-w-6xl" : "max-w-5xl", className)}>
      <h1 className="text-[1.75rem] font-semibold tracking-tight sm:text-[2rem]">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-10">{children}</div>
    </div>
  );
}
