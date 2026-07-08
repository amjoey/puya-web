import Link from "next/link";

import { SectionTitle } from "@/components/common/SectionTitle";
import { PromotionCard } from "@/components/promotion/PromotionCard";
import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { demoPromotions } from "@/lib/demo/homeContent";
import { cn } from "@/lib/utils/cn";

// See PRD.md > Functional Requirements > 1. Home Page > Promotions Preview
// (Display Active Promotions).
export function PromotionsPreview() {
  const activePromotions = demoPromotions.filter((promotion) => promotion.active);

  if (activePromotions.length === 0) {
    return null;
  }

  return (
    <section className={cn(SECTION_SPACING, CONTAINER_PADDING, "bg-secondary")}>
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="โปรโมชั่นปัจจุบัน" />
        <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
          {activePromotions.map((promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/promotions">ดูโปรโมชั่นทั้งหมด</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
