import { createServiceClient } from "@/lib/supabase/service";
import { findOverlappingBookings } from "@/repositories/booking.repository";
import { listBlockedDatesByVilla } from "@/repositories/blockedDate.repository";

export type DayAvailabilityStatus = "available" | "pending" | "booked";

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// checkOut is the departure date and is not itself occupied (turnover day) —
// see PROJECT_ANALYSIS.md > Risks and Assumptions.
function isDateWithinStay(date: string, checkIn: string, checkOut: string): boolean {
  return date >= checkIn && date < checkOut;
}

// Day-by-day status for a given month — see PRD.md > 3. Availability Calendar
// (Available / Pending Payment / Booked) and UI_UX_SPEC.md > Availability Calendar.
export async function getMonthlyAvailability(
  villaId: string,
  year: number,
  month: number, // 0-indexed, matches JS Date
): Promise<Record<string, DayAvailabilityStatus>> {
  const monthStart = toISODate(new Date(year, month, 1));
  const monthEndExclusive = toISODate(new Date(year, month + 1, 1));

  const [bookings, blockedDates] = await Promise.all([
    findOverlappingBookings(villaId, monthStart, monthEndExclusive, createServiceClient()),
    listBlockedDatesByVilla(villaId),
  ]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const statuses: Record<string, DayAvailabilityStatus> = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const date = toISODate(new Date(year, month, day));

    const isBlocked = blockedDates.some((blocked) => blocked.blockedDate === date);
    const isConfirmed = bookings.some(
      (booking) =>
        booking.bookingStatus === "confirmed" &&
        isDateWithinStay(date, booking.checkIn, booking.checkOut),
    );
    const isPending = bookings.some(
      (booking) =>
        booking.bookingStatus === "pending" &&
        isDateWithinStay(date, booking.checkIn, booking.checkOut),
    );

    statuses[date] = isBlocked || isConfirmed ? "booked" : isPending ? "pending" : "available";
  }

  return statuses;
}

// Enforces the no-overlap rule before a booking is created — see
// ARCHITECTURE.md > Availability Logic and CLAUDE.md > Booking Rules
// ("Prevent Double Booking. Check overlapping dates before insert.").
// Call this from the booking Server Action before inserting a new booking.
export async function isRangeAvailable(
  villaId: string,
  checkIn: string,
  checkOut: string,
): Promise<boolean> {
  const [overlappingBookings, blockedDates] = await Promise.all([
    findOverlappingBookings(villaId, checkIn, checkOut, createServiceClient()),
    listBlockedDatesByVilla(villaId),
  ]);

  if (overlappingBookings.length > 0) {
    return false;
  }

  return !blockedDates.some((blocked) =>
    isDateWithinStay(blocked.blockedDate, checkIn, checkOut),
  );
}
