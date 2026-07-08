import type { Metadata } from "next";

import { PromotionCard } from "@/components/promotion/PromotionCard";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { demoPromotions } from "@/lib/demo/homeContent";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "โปรโมชั่นและข้อเสนอพิเศษ | PUYA Beach Villa",
  description:
    "โปรโมชั่นและข้อเสนอพิเศษสำหรับการเข้าพักที่วิลล่าริมชายหาดส่วนตัวของ PUYA Beach Villa",
  alternates: { canonical: "/promotions" },
  openGraph: {
    title: "โปรโมชั่นและข้อเสนอพิเศษ | PUYA Beach Villa",
    description:
      "โปรโมชั่นและข้อเสนอพิเศษสำหรับการเข้าพักที่ PUYA Beach Villa",
    images: ["/demo/hero.svg"],
    type: "website",
  },
};

// See PRD.md > Functional Requirements > Promotions System.
export default function PromotionsPage() {
  return (
    <main className={cn(CONTAINER_PADDING, "py-8 tablet:py-12")}>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-h2 font-bold text-foreground">โปรโมชั่นและข้อเสนอพิเศษ</h1>
        <p className="mt-2 text-body text-muted-foreground">
          ประหยัดค่าที่พักริมทะเลด้วยโปรโมชั่นของเรา
        </p>
        {demoPromotions.length === 0 ? (
          <p className="mt-8 text-body text-muted-foreground">
            ยังไม่มีโปรโมชั่นในขณะนี้ โปรดกลับมาดูใหม่ภายหลัง
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 tablet:grid-cols-2">
            {demoPromotions.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
