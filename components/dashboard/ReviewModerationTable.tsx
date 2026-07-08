"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { approveReview, deleteReview, rejectReview, type ReviewActionResult } from "@/actions/review.actions";
import { RatingStars } from "@/components/review/RatingStars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/review";

// See PRD.md > Admin Dashboard > Review Management (Approve/Reject/Delete).
export function ReviewModerationTable({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function run(reviewId: string, action: (id: string) => Promise<ReviewActionResult>) {
    setPendingId(reviewId);
    startTransition(async () => {
      await action(reviewId);
      router.refresh();
    });
  }

  if (reviews.length === 0) {
    return <p className="text-body text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body font-semibold text-foreground">{review.customerName}</p>
              <RatingStars rating={review.rating} />
            </div>
            <Badge variant={review.approved ? "success" : "warning"}>
              {review.approved ? "Approved" : "Pending"}
            </Badge>
          </div>
          {review.comment && (
            <p className="mt-2 text-body text-muted-foreground">{review.comment}</p>
          )}
          <div className="mt-4 flex gap-2">
            {!review.approved && (
              <Button
                size="sm"
                disabled={isPending && pendingId === review.id}
                onClick={() => run(review.id, approveReview)}
              >
                Approve
              </Button>
            )}
            {review.approved && (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending && pendingId === review.id}
                onClick={() => run(review.id, rejectReview)}
              >
                Unapprove
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending && pendingId === review.id}
              onClick={() => run(review.id, deleteReview)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
