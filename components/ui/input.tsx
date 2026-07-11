import * as React from "react";

import { cn } from "@/lib/utils/cn";

// 48px height — matches the Button control height in UI_UX_SPEC.md > Buttons.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-xl border border-line bg-white px-4 py-2 text-base text-ink shadow-xs outline-none transition-colors placeholder:text-ink-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-aqua focus-visible:ring-2 focus-visible:ring-aqua/40",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
