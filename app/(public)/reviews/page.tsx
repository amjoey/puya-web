import type { Metadata } from "next";

import { ReviewCard } from "@/components/review/ReviewCard";
import { ReviewForm } from "@/components/review/ReviewForm";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { listApprovedReviews } from "@/repositories/review.repository";
import { getActiveVillas } from "@/repositories/villa.repository";

export const metadata: Metadata = {
  title: "รีวิวจากผู้เข้าพัก | PUYA Beach Villa",
  description:
    "อ่านรีวิวจากผู้เข้าพักที่วิลล่าริมชายหาดของ PUYA Beach Villa",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "รีวิวจากผู้เข้าพัก | PUYA Beach Villa",
    description:
      "อ่านรีวิวจากผู้เข้าพักที่วิลล่าริมชายหาดของ PUYA Beach Villa",
    images: ["/demo/hero.svg"],
    type: "website",
  },
};

// See PRD.md > 5. Reviews System. Both the list and the submission form
// are real guest-facing data now — approved reviews from the database,
// and a live villa list for the submission form's dropdown.
// ISR — prerender + hourly refresh (cookieless public reads, see
// lib/supabase/public.ts).
export const revalidate = 3600;

export default async function ReviewsPage() {
  const [{ data: reviews, error: reviewsError }, { data: villas, error: loadError }] =
    await Promise.all([
      safeFetch(() => listApprovedReviews(), []),
      safeFetch(() => getActiveVillas(), []),
    ]);

  return (
    <main className={cn(CONTAINER_PADDING, "py-8 tablet:py-12")}>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-h2 font-bold text-foreground">รีวิวจากผู้เข้าพัก</h1>
        <p className="mt-2 text-body text-muted-foreground">
          อ่านรีวิวจากผู้เข้าพักที่ PUYA Beach Villa
        </p>

        {reviewsError ? (
          <p className="mt-8 text-body text-destructive">
            ไม่สามารถโหลดรีวิวได้ กรุณาลองใหม่ภายหลัง
          </p>
        ) : reviews.length === 0 ? (
          <p className="mt-8 text-body text-muted-foreground">ยังไม่มีรีวิว</p>
        ) : (
          <div className="mt-8 flex flex-col gap-4 tablet:flex-row tablet:flex-wrap">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-h3 font-semibold text-foreground">แชร์ประสบการณ์ของคุณ</h2>
          <p className="mt-2 text-body text-muted-foreground">
            รีวิวที่ส่งมาจะถูกตรวจสอบโดยทีมงานก่อนเผยแพร่
          </p>
          <div className="mt-6 max-w-xl">
            {loadError || villas.length === 0 ? (
              <p className="text-body text-destructive">
                ไม่สามารถส่งรีวิวได้ชั่วคราว กรุณาลองใหม่ภายหลัง
              </p>
            ) : (
              <ReviewForm villas={villas} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
