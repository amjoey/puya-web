export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "rejected";

export interface Booking {
  id: string;
  villaId: string;
  customerName: string;
  phone: string;
  lineId: string | null;
  email: string | null;
  guestCount: number;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
