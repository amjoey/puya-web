import { cn } from "@/lib/utils/cn";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className }: SectionTitleProps) {
  return (
    <div className={cn("mb-8 text-center tablet:mb-12", className)}>
      <h2 className="text-h2 text-foreground">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-body text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
