import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({
  size = 28,
  className,
  alt = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      priority={priority}
    />
  );
}

export function BrandLockup({
  className,
  size = 28,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} priority={priority} />
      <span className="text-[15px] font-semibold tracking-tight">TilLab</span>
    </span>
  );
}
