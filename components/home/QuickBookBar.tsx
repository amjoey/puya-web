import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// Presentational quick-book bar — see REDESIGN_PLAN.md > Phase 3.1 / mockup.
// GUARDRAIL: no booking logic here. The whole bar (fields + button) links to
// /availability, where the real date/guest selection already lives. It floats
// over the hero's lower edge.
const FIELDS = [
  { label: "เช็คอิน", value: "เลือกวันที่" },
  { label: "เช็คเอาท์", value: "เลือกวันที่" },
] as const;

export function QuickBookBar() {
  return (
    <div
      className={cn(
        "relative z-20 mx-auto -mt-10 w-full max-w-[1180px] tablet:-mt-11",
        CONTAINER_PADDING,
      )}
    >
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft tablet:grid-cols-[1fr_1fr_auto] tablet:items-end tablet:gap-4 tablet:p-5">
        {FIELDS.map((field) => (
          <Link key={field.label} href="/availability" className="group block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {field.label}
            </span>
            <span className="flex items-center justify-between gap-2 rounded-xl border border-line px-3.5 py-3 text-sm text-ink transition-colors group-hover:border-aqua">
              {field.value}
              <ChevronDown className="size-4 text-ink-soft" aria-hidden="true" />
            </span>
          </Link>
        ))}
        <Button asChild size="lg" className="tablet:h-[52px]">
          <Link href="/availability">ค้นหาห้องว่าง</Link>
        </Button>
      </div>
    </div>
  );
}
