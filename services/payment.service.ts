import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  getPaymentSlipSignedUrl,
  getPaymentSlipSignedUrls,
  uploadPaymentSlip as uploadSlipToStorage,
} from "@/lib/supabase/storage";
import { getBookingById, updateBooking } from "@/repositories/booking.repository";
import {
  createPayment,
  getPaymentByBookingId,
  updatePayment,
} from "@/repositories/payment.repository";
import type { Payment } from "@/types/payment";

export class BookingNotFoundError extends Error {
  constructor() {
    super("Booking could not be found.");
    this.name = "BookingNotFoundError";
  }
}

// Step 5 (Payment Upload) — see PRD.md > 4. Booking System > Step 5.
// Guests are anonymous, so the storage upload and the payments-table write
// both use the service-role client (no anon RLS policy on either — see
// supabase/migrations/0001_enable_rls.sql and 0002_storage_payment_slips.sql).
export async function uploadPaymentSlip(bookingId: string, file: File): Promise<Payment> {
  const serviceClient = createServiceClient();

  const booking = await getBookingById(bookingId, serviceClient);
  if (!booking) {
    throw new BookingNotFoundError();
  }

  const slipPath = await uploadSlipToStorage(serviceClient, bookingId, file);
  const existingPayment = await getPaymentByBookingId(bookingId, serviceClient);

  if (existingPayment) {
    // Re-upload (e.g. after rejection) replaces the slip and resets review state.
    return updatePayment(
      existingPayment.id,
      {
        slip_image: slipPath,
        verified: false,
        verified_at: null,
        verified_by: null,
        remarks: null,
      },
      serviceClient,
    );
  }

  return createPayment(
    {
      booking_id: bookingId,
      amount: booking.totalPrice,
      slip_image: slipPath,
    },
    serviceClient,
  );
}

// Step 6 (Confirmation) — see PRD.md > 4. Booking System > Step 6 and
// UI_UX_SPEC.md > Payment Verification. Admin actions use the normal
// RLS-respecting client (is_admin() independently re-checks at the DB layer —
// defense in depth even if requireAdmin() had a bug).
export async function verifyPayment(paymentId: string, remarks?: string): Promise<Payment> {
  const admin = await requireAdmin();

  const payment = await updatePayment(paymentId, {
    verified: true,
    verified_at: new Date().toISOString(),
    verified_by: admin.id,
    remarks: remarks || null,
  });

  await updateBooking(payment.bookingId, {
    payment_status: "paid",
    booking_status: "confirmed",
  });

  return payment;
}

export async function rejectPayment(paymentId: string, remarks?: string): Promise<Payment> {
  const admin = await requireAdmin();

  const payment = await updatePayment(paymentId, {
    verified: false,
    verified_at: new Date().toISOString(),
    verified_by: admin.id,
    remarks: remarks || null,
  });

  await updateBooking(payment.bookingId, {
    payment_status: "rejected",
  });

  return payment;
}

// Generates a short-lived signed URL for the admin slip-preview UI —
// payment-slips is a private bucket (see lib/supabase/storage.ts).
export async function getSignedSlipUrl(slipPath: string): Promise<string> {
  await requireAdmin();
  const supabase = await createClient();
  return getPaymentSlipSignedUrl(supabase, slipPath);
}

// Batch variant for admin list views — one Storage call for every slip in
// the list instead of one round trip per row (see PROJECT_AUDIT.md).
export async function getSignedSlipUrls(slipPaths: string[]): Promise<Map<string, string>> {
  await requireAdmin();
  const supabase = await createClient();
  return getPaymentSlipSignedUrls(supabase, slipPaths);
}
