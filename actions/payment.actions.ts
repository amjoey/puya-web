"use server";

import { UnauthorizedError } from "@/lib/auth/session";
import { toActionError } from "@/lib/utils/actionError";
import {
  paymentUploadSchema,
  paymentVerificationSchema,
} from "@/lib/validators/payment.schema";
import {
  BookingNotFoundError,
  rejectPayment as rejectPaymentService,
  uploadPaymentSlip as uploadSlipService,
  verifyPayment as verifyPaymentService,
} from "@/services/payment.service";
import type { Payment } from "@/types/payment";

export type UploadPaymentSlipResult =
  | { success: true; payment: Payment }
  | { success: false; error: string };

// Step 5 (Payment Upload) — see PRD.md > 4. Booking System > Step 5.
// Signature matches React's useActionState (prevState, formData) so the
// client component can bind it directly to a <form action={...}>.
export async function uploadPaymentSlip(
  _prevState: UploadPaymentSlipResult | null,
  formData: FormData,
): Promise<UploadPaymentSlipResult> {
  const parsed = paymentUploadSchema.safeParse({
    bookingId: formData.get("bookingId"),
    slip: formData.get("slip"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please upload a valid payment slip.",
    };
  }

  try {
    const payment = await uploadSlipService(parsed.data.bookingId, parsed.data.slip);
    return { success: true, payment };
  } catch (error) {
    return {
      success: false,
      error: toActionError(
        error,
        "Something went wrong while uploading your payment slip. Please try again.",
        [BookingNotFoundError],
      ),
    };
  }
}

export type VerifyPaymentResult =
  | { success: true; payment: Payment }
  | { success: false; error: string };

// Admin Dashboard > Payment Verification — see UI_UX_SPEC.md and
// PRD.md > 4. Booking System > Step 6.
export async function verifyPayment(input: {
  paymentId: string;
  remarks?: string;
}): Promise<VerifyPaymentResult> {
  const parsed = paymentVerificationSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  try {
    const payment = await verifyPaymentService(parsed.data.paymentId, parsed.data.remarks);
    return { success: true, payment };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to verify this payment. Please try again.", [
        UnauthorizedError,
      ]),
    };
  }
}

export async function rejectPayment(input: {
  paymentId: string;
  remarks?: string;
}): Promise<VerifyPaymentResult> {
  const parsed = paymentVerificationSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  try {
    const payment = await rejectPaymentService(parsed.data.paymentId, parsed.data.remarks);
    return { success: true, payment };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to reject this payment. Please try again.", [
        UnauthorizedError,
      ]),
    };
  }
}
