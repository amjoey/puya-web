import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/review/RatingStars";
import type { Review } from "@/types/review";

// Horizontal review card — see UI_UX_SPEC.md > Home Page > Reviews Section.
export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="w-full tablet:w-80 tablet:shrink-0">
      <CardContent className="flex flex-col gap-4">
        <RatingStars rating={review.rating} />
        <p className="text-body text-foreground">&ldquo;{review.comment}&rdquo;</p>
        <div className="flex items-center gap-3">
          {review.imageUrl && (
            // Demo avatar (SVG placeholder) — plain <img>, see HeroSection.tsx note.
            <img
              src={review.imageUrl}
              alt={`${review.customerName}'s avatar`}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          )}
          <span className="text-caption font-medium text-foreground">
            {review.customerName}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
