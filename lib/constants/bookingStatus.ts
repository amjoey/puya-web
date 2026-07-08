import type { Booking } from "@/types/booking";

// Shared badge color mapping for booking status — used by every admin
// booking list/detail view (BookingTable, BookingManagementTable, etc.).
// Centralized so the status→color mapping can't drift between views.
export const BOOKING_STATUS_BADGE_VARIANT: Record<
  Booking["bookingStatus"],
  "success" | "warning" | "destructive" | "secondary"
> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "destructive",
  completed: "secondary",
};
