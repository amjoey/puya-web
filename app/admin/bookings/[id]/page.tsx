import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingEditForm } from "@/components/dashboard/BookingEditForm";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { formatTHB } from "@/lib/utils/currency";
import { isUuid } from "@/lib/utils/uuid";
import { getBookingById } from "@/repositories/booking.repository";
import { getVillaById } from "@/repositories/villa.repository";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface AdminBookingDetailPageProps {
  params: Promise<{ id: string }>;
}

// Admin Dashboard > Booking Management > Edit Booking — see PRD.md.
export default async function AdminBookingDetailPage({
  params,
}: AdminBookingDetailPageProps) {
  const { id } = await params;

  if (!isUuid(id)) {
    notFound();
  }

  const { data: booking, error: loadError } = await safeFetch(() => getBookingById(id), null);

  if (loadError) {
    return (
      <AdminShell>
        <main className={cn(CONTAINER_PADDING, "py-8")}>
          <p className="text-body text-destructive">
            Unable to load this booking. Make sure you are signed in as an admin.
          </p>
        </main>
      </AdminShell>
    );
  }

  if (!booking) {
    notFound();
  }

  const villa = await getVillaById(booking.villaId).catch(() => null);

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Booking Details</h1>

        <div className="mt-6 grid grid-cols-1 gap-6 desktop:grid-cols-2">
          <Card>
            <CardHeader>
              <p className="text-body font-semibold text-foreground">Guest Information</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-body text-muted-foreground">
              <p>
                <span className="text-foreground">Name:</span> {booking.customerName}
              </p>
              <p>
                <span className="text-foreground">Phone:</span> {booking.phone}
              </p>
              {booking.email && (
                <p>
                  <span className="text-foreground">Email:</span> {booking.email}
                </p>
              )}
              {booking.lineId && (
                <p>
                  <span className="text-foreground">LINE ID:</span> {booking.lineId}
                </p>
              )}
              <p>
                <span className="text-foreground">Guests:</span> {booking.guestCount}
              </p>
              <p>
                <span className="text-foreground">Villa:</span> {villa?.name ?? "Unknown villa"}
              </p>
              <p>
                <span className="text-foreground">Dates:</span> {booking.checkIn} –{" "}
                {booking.checkOut} ({booking.totalNights} nights)
              </p>
              <p>
                <span className="text-foreground">Total:</span> {formatTHB(booking.totalPrice)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-body font-semibold text-foreground">Update Status</p>
            </CardHeader>
            <CardContent>
              <BookingEditForm booking={booking} />
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminShell>
  );
}
