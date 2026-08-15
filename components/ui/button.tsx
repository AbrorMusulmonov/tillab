import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#0d6b64]",
        secondary: "bg-foreground text-white hover:bg-[#2a2f2d]",
        outline: "border border-border bg-white hover:bg-muted/70",
        ghost: "hover:bg-muted",
        destructive: "bg-destructive text-white hover:bg-[#912018]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-[13px]",
        lg: "h-11 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
