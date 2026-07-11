import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

// Small section kicker — uppercase label preceded by a short aqua rule.
// Reused across the Sea Minimal home sections (REDESIGN_PLAN.md > Phase 3).
// Text color is inherited; pass className (e.g. text-aqua-deep, text-white).
interface EyebrowProps {
  children: ReactNode;
  className?: string;
  align?: "start" | "center";
}

export function Eyebrow({ children, className, align = "start" }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.18em] before:h-px before:w-6 before:bg-aqua before:content-['']",
        align === "center" && "justify-center",
        className,
      )}
    >
      {children}
    </span>
  );
}
