import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_8px_20px_-10px_rgba(15,118,110,0.7)] hover:bg-[#0d6b64] hover:shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_12px_24px_-10px_rgba(15,118,110,0.8)]",
        secondary: "bg-foreground text-white hover:bg-[#1a2030]",
        outline:
          "border border-border/80 bg-white/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm hover:border-border hover:bg-white",
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

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
