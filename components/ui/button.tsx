import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

// "Sea Minimal" button styles — all colors/radius/shadow come from the
// design tokens in globals.css (REDESIGN_PLAN.md > Phase 2). Props interface
// and variant/size keys are unchanged; only the presentation is restyled.
//   default   = Primary CTA (aqua, soft shadow — e.g. "จองเลย")
//   secondary = quieter fill on light surfaces
//   outline   = hairline button on light backgrounds
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-aqua text-white shadow-aqua hover:bg-aqua-deep hover:-translate-y-0.5 active:translate-y-0 active:bg-aqua-deep",
        secondary:
          "bg-mist text-ink hover:bg-line active:bg-line",
        outline:
          "border border-line bg-transparent text-ink hover:border-aqua hover:text-aqua active:border-aqua",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/90",
        ghost: "text-ink hover:bg-mist active:bg-mist",
        link: "text-aqua underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 has-[>svg]:px-5", // 48px
        sm: "h-10 px-4",
        lg: "h-14 px-8",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
