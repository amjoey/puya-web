"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cancelBooking } from "@/actions/booking.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BOOKING_STATUS_BADGE_VARIANT } from "@/lib/constants/bookingStatus";
import { formatTHB } from "@/lib/utils/currency";
import type { Booking } from "@/types/booking";

// See PRD.md > Admin Dashboard > Booking Management
// (View/Search/Filter Bookings, Cancel Booking).
export function BookingManagementTable({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.customerName.toLowerCase().includes(query.toLowerCase()) ||
          booking.phone.includes(query),
      ),
    [bookings, query],
  );

  function handleCancel(bookingId: string) {
    setPendingId(bookingId);
    startTransition(async () => {
      await cancelBooking(bookingId);
      router.refresh();
    });
  }

  return (
    <div>
      <Input
        placeholder="Search by guest name or phone"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="max-w-sm"
      />
      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-body">
          <thead className="bg-secondary text-caption text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Guest</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Dates</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => (
              <tr key={booking.id} className="border-t border-border">
                <td className="px-4 py-2">{booking.customerName}</td>
                <td className="px-4 py-2">{booking.phone}</td>
                <td className="px-4 py-2">
                  {booking.checkIn} – {booking.checkOut}
                </td>
                <td className="px-4 py-2">{formatTHB(booking.totalPrice)}</td>
                <td className="px-4 py-2">
                  <Badge variant={BOOKING_STATUS_BADGE_VARIANT[booking.bookingStatus]}>
                    {booking.bookingStatus}
                  </Badge>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/bookings/${booking.id}`}>View</Link>
                    </Button>
                    {booking.bookingStatus !== "cancelled" &&
                      booking.bookingStatus !== "completed" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending && pendingId === booking.id}
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-body text-muted-foreground">
            No bookings match your search.
          </p>
        )}
      </div>
    </div>
  );
}
