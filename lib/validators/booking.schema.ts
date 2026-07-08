import { z } from "zod";

import { DEFAULT_VILLA_CAPACITY } from "@/lib/constants/pricing";

// Permissive on purpose — allows digits, spaces, hyphens, parentheses, and
// a leading "+" so "+66 81 234 5678", "081-234-5678", "0812345678" all
// pass, while still rejecting clearly-invalid input (letters, symbols).
const PHONE_REGEX = /^[0-9+\-\s()]{8,20}$/;

// .date() requires zod ^3.23 — validates "YYYY-MM-DD" to match the
// Postgres `date` columns on bookings.check_in / check_out.
// guestCount's upper bound here is a generic sanity cap (no villa is bigger
// than DEFAULT_VILLA_CAPACITY) — the authoritative per-villa capacity check
// still happens in booking.service.ts against the actual villa row.
export const bookingFormSchema = z
  .object({
    villaId: z.string().uuid(),
    checkIn: z.string().date(),
    checkOut: z.string().date(),
    customerName: z.string().trim().min(1).max(255),
    phone: z.string().trim().regex(PHONE_REGEX, "Please enter a valid phone number"),
    lineId: z.string().trim().max(100).optional().or(z.literal("")),
    email: z.string().trim().email().optional().or(z.literal("")),
    guestCount: z.number().int().min(1).max(DEFAULT_VILLA_CAPACITY),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  });

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

// Admin Dashboard > Booking Management > Edit Booking / Update Status.
export const bookingStatusUpdateSchema = z.object({
  bookingId: z.string().uuid(),
  bookingStatus: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "rejected"]).optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type BookingStatusUpdateInput = z.infer<typeof bookingStatusUpdateSchema>;
