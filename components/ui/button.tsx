"use client";

import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonVariantProps } from "@/lib/button-variants";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps;

export { buttonVariants };

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
