import { requireAdmin } from "@/lib/auth/session";
import type { ReviewFormInput } from "@/lib/validators/review.schema";
import {
  createReview,
  deleteReview as deleteReviewRow,
  updateReview,
} from "@/repositories/review.repository";
import type { Review } from "@/types/review";

// Guest-facing review submission — see PRD.md > 5. Reviews System.
// Always forced to `approved: false` server-side regardless of caller
// input; RLS independently enforces the same constraint on anon inserts
// (see supabase/migrations/0001_enable_rls.sql) — defense in depth.
export async function submitReview(input: ReviewFormInput): Promise<Review> {
  return createReview({
    villa_id: input.villaId,
    customer_name: input.customerName,
    rating: input.rating,
    comment: input.comment || null,
    image_url: input.imageUrl || null,
    approved: false,
  });
}

// Admin Dashboard > Review Management — see PRD.md > 5. Reviews System (Rules: Admin approval required).
export async function approveReview(reviewId: string): Promise<Review> {
  await requireAdmin();
  return updateReview(reviewId, { approved: true });
}

export async function rejectReview(reviewId: string): Promise<Review> {
  await requireAdmin();
  return updateReview(reviewId, { approved: false });
}

export async function deleteReview(reviewId: string): Promise<void> {
  await requireAdmin();
  await deleteReviewRow(reviewId);
}
