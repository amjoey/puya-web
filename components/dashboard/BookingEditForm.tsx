"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateBookingStatus } from "@/actions/booking.actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Booking, BookingStatus, PaymentStatus } from "@/types/booking";

const BOOKING_STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "rejected"];

// Admin Dashboard > Booking Management > Edit Booking / Update Status.
export function BookingEditForm({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(booking.bookingStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(booking.paymentStatus);
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateBookingStatus({
        bookingId: booking.id,
        bookingStatus,
        paymentStatus,
        notes,
      });
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <div>
          <Label>Booking Status</Label>
          <Select
            value={bookingStatus}
            onValueChange={(value) => setBookingStatus(value as BookingStatus)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Payment Status</Label>
          <Select
            value={paymentStatus}
            onValueChange={(value) => setPaymentStatus(value as PaymentStatus)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea
          className="mt-2"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>
      {error && <p className="text-body text-destructive">{error}</p>}
      <Button onClick={handleSave} disabled={isPending} className="self-start">
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
