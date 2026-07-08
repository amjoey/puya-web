"use server";

import { z } from "zod";

import { requireAdmin, UnauthorizedError } from "@/lib/auth/session";
import { toActionError } from "@/lib/utils/actionError";
import { parseFormInput } from "@/lib/utils/validation";
import {
  bookingFormSchema,
  bookingStatusUpdateSchema,
  type BookingFormInput,
  type BookingStatusUpdateInput,
} from "@/lib/validators/booking.schema";
import { updateBooking as updateBookingRow } from "@/repositories/booking.repository";
import { isRangeAvailable } from "@/services/availability.service";
import {
  createBooking as createGuestBooking,
  BookingUnavailableError,
  GuestCountExceedsCapacityError,
  VillaNotFoundError,
} from "@/services/booking.service";
import type { Booking } from "@/types/booking";

export type CreateBookingResult =
  | { success: true; booking: Booking }
  | { success: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

// Step 4 (Booking Creation) — see PRD.md > 4. Booking System.
// Re-validates with Zod server-side (never trust client validation alone);
// availability/capacity/price are re-checked inside booking.service.ts.
export async function createBooking(input: BookingFormInput): Promise<CreateBookingResult> {
  const parsed = parseFormInput(bookingFormSchema, input);
  if (!parsed.success) {
    return parsed;
  }

  try {
    const booking = await createGuestBooking(parsed.data);
    return { success: true, booking };
  } catch (error) {
    return {
      success: false,
      error: toActionError(
        error,
        "Something went wrong while creating your booking. Please try again.",
        [BookingUnavailableError, VillaNotFoundError, GuestCountExceedsCapacityError],
      ),
    };
  }
}

const availabilityCheckSchema = z
  .object({
    villaId: z.string().uuid(),
    checkIn: z.string().date(),
    checkOut: z.string().date(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  });

export type CheckAvailabilityResult = { available: boolean; error?: string };

// Early UX feedback for Step 2 (Select Dates) — NOT the security boundary;
// createBooking() above re-checks authoritatively before insert, since this
// client-facing check can go stale between check and submit.
export async function checkDateAvailability(input: {
  villaId: string;
  checkIn: string;
  checkOut: string;
}): Promise<CheckAvailabilityResult> {
  const parsed = availabilityCheckSchema.safeParse(input);

  if (!parsed.success) {
    return { available: false, error: "Please select a valid date range." };
  }

  const available = await isRangeAvailable(
    parsed.data.villaId,
    parsed.data.checkIn,
    parsed.data.checkOut,
  );

  return {
    available,
    error: available ? undefined : "Selected dates are not available for this villa.",
  };
}

export type UpdateBookingStatusResult =
  | { success: true; booking: Booking }
  | { success: false; error: string };

// Admin Dashboard > Booking Management > Edit Booking / Update Status — see PRD.md.
export async function updateBookingStatus(
  input: BookingStatusUpdateInput,
): Promise<UpdateBookingStatusResult> {
  const parsed = bookingStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the highlighted fields." };
  }

  try {
    await requireAdmin();
    const booking = await updateBookingRow(parsed.data.bookingId, {
      ...(parsed.data.bookingStatus && { booking_status: parsed.data.bookingStatus }),
      ...(parsed.data.paymentStatus && { payment_status: parsed.data.paymentStatus }),
      ...(parsed.data.notes !== undefined && { notes: parsed.data.notes || null }),
    });
    return { success: true, booking };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to update this booking.", [UnauthorizedError]),
    };
  }
}

export type CancelBookingResult = { success: true } | { success: false; error: string };

// Admin Dashboard > Booking Management > Cancel Booking — see PRD.md.
export async function cancelBooking(bookingId: string): Promise<CancelBookingResult> {
  try {
    await requireAdmin();
    await updateBookingRow(bookingId, { booking_status: "cancelled" });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to cancel this booking.", [UnauthorizedError]),
    };
  }
}
