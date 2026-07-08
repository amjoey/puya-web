"use server";

import { UnauthorizedError } from "@/lib/auth/session";
import { toActionError } from "@/lib/utils/actionError";
import { parseFormInput } from "@/lib/utils/validation";
import { reviewFormSchema, type ReviewFormInput } from "@/lib/validators/review.schema";
import {
  approveReview as approveReviewService,
  deleteReview as deleteReviewService,
  rejectReview as rejectReviewService,
  submitReview as submitReviewService,
} from "@/services/review.service";

export type SubmitReviewResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

// Guest-facing review submission — see PRD.md > 5. Reviews System.
export async function submitReview(input: ReviewFormInput): Promise<SubmitReviewResult> {
  const parsed = parseFormInput(reviewFormSchema, input);
  if (!parsed.success) {
    return parsed;
  }

  try {
    await submitReviewService(parsed.data);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to submit your review right now. Please try again."),
    };
  }
}

export type ReviewActionResult = { success: true } | { success: false; error: string };

// Admin Dashboard > Review Management — see PRD.md.
export async function approveReview(reviewId: string): Promise<ReviewActionResult> {
  try {
    await approveReviewService(reviewId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to approve this review.", [UnauthorizedError]),
    };
  }
}

export async function rejectReview(reviewId: string): Promise<ReviewActionResult> {
  try {
    await rejectReviewService(reviewId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to reject this review.", [UnauthorizedError]),
    };
  }
}

export async function deleteReview(reviewId: string): Promise<ReviewActionResult> {
  try {
    await deleteReviewService(reviewId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to delete this review.", [UnauthorizedError]),
    };
  }
}
