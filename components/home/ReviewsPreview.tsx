import Link from "next/link";

import { SectionTitle } from "@/components/common/SectionTitle";
import { RatingStars } from "@/components/review/RatingStars";
import { ReviewCard } from "@/components/review/ReviewCard";
import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { demoReviews } from "@/lib/demo/homeContent";
import { cn } from "@/lib/utils/cn";

// See PRD.md > Functional Requirements > 1. Home Page > Reviews Preview
// (Average Rating, Latest Reviews).
export function ReviewsPreview() {
  const averageRating =
    demoReviews.reduce((sum, review) => sum + review.rating, 0) /
    demoReviews.length;

  return (
    <section className={cn(SECTION_SPACING, CONTAINER_PADDING)}>
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="รีวิวจากผู้เข้าพัก" />
        <div className="mb-8 flex flex-col items-center gap-2 tablet:mb-12">
          <span className="text-h2 text-foreground">
            {averageRating.toFixed(1)} / 5
          </span>
          <RatingStars rating={averageRating} />
          <span className="text-caption text-muted-foreground">
            จาก {demoReviews.length} รีวิว
          </span>
        </div>
        <div className="flex flex-col gap-6 tablet:flex-row tablet:flex-wrap tablet:justify-center">
          {demoReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/reviews">ดูรีวิวทั้งหมด</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
