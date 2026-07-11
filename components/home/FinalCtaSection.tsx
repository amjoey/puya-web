import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// Closing CTA — see REDESIGN_PLAN.md > Phase 3 / mockup. Primary booking
// route unchanged (/booking/villa-1).
export function FinalCtaSection() {
  return (
    <section className={cn("bg-paper text-center", SECTION_SPACING)}>
      <div className={cn("mx-auto max-w-[1180px]", CONTAINER_PADDING)}>
        <h2 className="text-balance text-3xl font-medium text-ink tablet:text-4xl">
          พร้อมจองทริปหน้าหรือยัง?
        </h2>
        <p className="mt-3 text-ink-soft tablet:text-lg">
          เช็คห้องว่างและราคาได้เลย มัดจำแค่ 50%
        </p>
        <div className="mt-7 flex justify-center">
          <Button asChild size="lg">
            <Link href="/booking/villa-1">เช็คราคา / จองเลย</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
