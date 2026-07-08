import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_BADGE_VARIANT } from "@/lib/constants/bookingStatus";
import { formatTHB } from "@/lib/utils/currency";
import type { Booking } from "@/types/booking";

// See PRD.md > Admin Dashboard > Booking Management (View/Search/Filter).
export function BookingTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return <p className="text-body text-muted-foreground">No bookings yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-body">
        <thead className="bg-secondary text-caption text-muted-foreground">
          <tr>
            <th className="px-4 py-2">Guest</th>
            <th className="px-4 py-2">Dates</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t border-border">
              <td className="px-4 py-2">{booking.customerName}</td>
              <td className="px-4 py-2">
                {booking.checkIn} – {booking.checkOut}
              </td>
              <td className="px-4 py-2">{formatTHB(booking.totalPrice)}</td>
              <td className="px-4 py-2">
                <Badge variant={BOOKING_STATUS_BADGE_VARIANT[booking.bookingStatus]}>
                  {booking.bookingStatus}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
