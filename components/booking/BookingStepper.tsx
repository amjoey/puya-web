import { cn } from "@/lib/utils/cn";

const STEPS = ["วิลล่า", "วันที่", "ข้อมูลผู้เข้าพัก", "ราคา", "สรุป"] as const;

// See UI_UX_SPEC.md > Booking Page > Step Indicator.
export function BookingStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center justify-between gap-2">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;

        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-caption font-semibold",
                isActive && "bg-aqua text-white",
                isComplete && "bg-aqua-deep text-white",
                !isActive && !isComplete && "bg-mist text-ink-soft",
              )}
              aria-current={isActive ? "step" : undefined}
            >
              {stepNumber}
            </span>
            <span
              className={cn(
                "text-caption",
                isActive ? "font-medium text-ink" : "text-ink-soft",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
