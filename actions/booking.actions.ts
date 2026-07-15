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
import { getActiveVillas } from "@/repositories/villa.repository";
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

const availabilitySearchSchema = z
  .object({
    checkIn: z.string().date(),
    checkOut: z.string().date(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  });

export interface VillaAvailability {
  villaId: string;
  slug: string;
  name: string;
  weekdayPrice: number;
  weekendPrice: number;
  coverImage: string | null;
  available: boolean;
}

export type SearchAvailabilityResult =
  | {
      success: true;
      checkIn: string;
      checkOut: string;
      nights: number;
      results: VillaAvailability[];
    }
  | { success: false; error: string };

// Home page "ค้นหาห้องว่าง" — checks a date range against every active villa
// in parallel. Reuses isRangeAvailable (bookings-overlap + blocked-dates),
// which relies on the service-role client, so this MUST stay a Server Action
// and never run in the browser. Like checkDateAvailability this is UX-facing,
// not the security boundary — createBooking() re-checks before insert.
export async function searchAvailability(input: {
  checkIn: string;
  checkOut: string;
}): Promise<SearchAvailabilityResult> {
  const parsed = availabilitySearchSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "กรุณาเลือกช่วงวันที่ให้ถูกต้อง" };
  }

  const { checkIn, checkOut } = parsed.data;
  const today = new Date().toISOString().slice(0, 10);
  if (checkIn < today) {
    return { success: false, error: "วันเช็คอินต้องเป็นวันนี้หรือหลังจากนี้" };
  }

  try {
    const villas = await getActiveVillas();
    const results = await Promise.all(
      villas.map(async (villa) => ({
        villaId: villa.id,
        slug: villa.slug,
        name: villa.name,
        weekdayPrice: villa.weekdayPrice,
        weekendPrice: villa.weekendPrice,
        coverImage: villa.coverImage,
        available: await isRangeAvailable(villa.id, checkIn, checkOut),
      })),
    );

    const nights = Math.round(
      (Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000,
    );

    return { success: true, checkIn, checkOut, nights, results };
  } catch {
    return {
      success: false,
      error: "ไม่สามารถตรวจสอบวันว่างได้ กรุณาลองใหม่อีกครั้ง",
    };
  }
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
