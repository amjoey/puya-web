import type { ReactNode } from "react";

import { Eyebrow } from "@/components/common/Eyebrow";
import { cn } from "@/lib/utils/cn";

// Centered section header (eyebrow + title + optional subtitle) for the Sea
// Minimal home sections. The *ClassName props let dark sections (e.g. the
// booking flow) override the default ink colors.
interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  eyebrowClassName,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("mx-auto mb-12 max-w-[620px] text-center", className)}>
      <Eyebrow align="center" className={cn("text-aqua-deep", eyebrowClassName)}>
        {eyebrow}
      </Eyebrow>
      <h2
        className={cn(
          "mt-3 text-balance text-3xl font-medium text-ink tablet:text-4xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-3 text-ink-soft tablet:text-lg", subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
