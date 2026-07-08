import { AdminShell } from "@/components/dashboard/AdminShell";
import { BookingManagementTable } from "@/components/dashboard/BookingManagementTable";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { listAllBookings } from "@/repositories/booking.repository";

export default async function AdminBookingsPage() {
  const { data: bookings, error: loadError } = await safeFetch(() => listAllBookings(), []);

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Bookings</h1>
        {loadError ? (
          <p className="mt-4 text-body text-destructive">
            Unable to load bookings. Make sure you are signed in as an admin.
          </p>
        ) : (
          <div className="mt-6">
            <BookingManagementTable bookings={bookings} />
          </div>
        )}
      </main>
    </AdminShell>
  );
}
