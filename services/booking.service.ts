import { createServiceClient } from "@/lib/supabase/service";
import type { BookingFormInput } from "@/lib/validators/booking.schema";
import { createBooking as insertBooking } from "@/repositories/booking.repository";
import { getVillaById } from "@/repositories/villa.repository";
import { isRangeAvailable } from "@/services/availability.service";
import { calculatePrice } from "@/services/pricing.service";
import type { Booking } from "@/types/booking";

export class VillaNotFoundError extends Error {
  constructor() {
    super("Selected villa could not be found.");
    this.name = "VillaNotFoundError";
  }
}

export class BookingUnavailableError extends Error {
  constructor() {
    super("Selected dates are no longer available for this villa.");
    this.name = "BookingUnavailableError";
  }
}

export class GuestCountExceedsCapacityError extends Error {
  constructor(capacity: number) {
    super(`This villa accommodates up to ${capacity} guests.`);
    this.name = "GuestCountExceedsCapacityError";
  }
}

// Orchestrates booking creation (PRD.md > 4. Booking System > Step 4):
//  1. Re-validates availability server-side — defends against race
//     conditions / stale client state (ARCHITECTURE.md > Availability Logic).
//  2. Enforces guest count against villa capacity (PROJECT_ANALYSIS.md > Risks).
//  3. Recalculates price server-side — never trust a client-submitted total.
//  4. Inserts via the service-role client, since guests are anonymous and
//     `bookings` has no anon RLS insert policy
//     (see supabase/migrations/0001_enable_rls.sql).
export async function createBooking(input: BookingFormInput): Promise<Booking> {
  const villa = await getVillaById(input.villaId);
  if (!villa) {
    throw new VillaNotFoundError();
  }

  if (input.guestCount > villa.capacity) {
    throw new GuestCountExceedsCapacityError(villa.capacity);
  }

  const available = await isRangeAvailable(input.villaId, input.checkIn, input.checkOut);
  if (!available) {
    throw new BookingUnavailableError();
  }

  const { totalNights, totalPrice } = calculatePrice(
    input.checkIn,
    input.checkOut,
    villa.weekdayPrice,
    villa.weekendPrice,
  );

  return insertBooking(
    {
      villa_id: input.villaId,
      customer_name: input.customerName,
      phone: input.phone,
      line_id: input.lineId || null,
      email: input.email || null,
      guest_count: input.guestCount,
      check_in: input.checkIn,
      check_out: input.checkOut,
      total_nights: totalNights,
      total_price: totalPrice,
      booking_status: "pending",
      payment_status: "pending",
    },
    createServiceClient(),
  );
}
