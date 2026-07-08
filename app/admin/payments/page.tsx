import { AdminShell } from "@/components/dashboard/AdminShell";
import { PaymentVerificationPanel } from "@/components/dashboard/PaymentVerificationPanel";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { listBookingsByIds } from "@/repositories/booking.repository";
import { listPendingPayments } from "@/repositories/payment.repository";
import { listVillasByIds } from "@/repositories/villa.repository";
import { getSignedSlipUrls } from "@/services/payment.service";

// Admin Dashboard > Payment Verification — see UI_UX_SPEC.md and
// PRD.md > 4. Booking System > Step 6. Reads via the normal RLS-respecting
// client (is_admin() policy gates access — see
// supabase/migrations/0001_enable_rls.sql), not the service-role client,
// so this only works once an authenticated admin session exists.
export default async function AdminPaymentsPage() {
  const { data: pendingPayments, error: loadError } = await safeFetch(
    () => listPendingPayments(),
    [],
  );

  if (loadError) {
    return (
      <AdminShell>
        <main className={cn(CONTAINER_PADDING, "py-12")}>
          <p className="text-body text-destructive">
            Unable to load pending payments. Make sure you are signed in as an admin.
          </p>
        </main>
      </AdminShell>
    );
  }

  // Batch-fetch every booking/villa/signed-URL up front (1 call each) rather
  // than per row — avoids the N+1 pattern of awaiting a booking, then a
  // villa, then a signed URL inside a per-payment loop (see PROJECT_AUDIT.md).
  const bookingIds = [...new Set(pendingPayments.map((payment) => payment.bookingId))];
  const slipPaths = pendingPayments
    .map((payment) => payment.slipImage)
    .filter((path): path is string => Boolean(path));

  // Falls back to empty bookings/URLs on failure; rows fall back to "Unknown
  // guest/villa" + no slip preview rather than failing the whole page.
  const {
    data: [bookings, slipUrlsByPath],
  } = await safeFetch(
    () => Promise.all([listBookingsByIds(bookingIds), getSignedSlipUrls(slipPaths)]),
    [[], new Map<string, string>()],
  );

  const villaIds = [...new Set(bookings.map((booking) => booking.villaId))];
  const { data: villas } = await safeFetch(() => listVillasByIds(villaIds), []);

  const bookingsById = new Map(bookings.map((booking) => [booking.id, booking]));
  const villasById = new Map(villas.map((villa) => [villa.id, villa]));

  const rows = pendingPayments.map((payment) => {
    const booking = bookingsById.get(payment.bookingId) ?? null;
    const villa = booking ? villasById.get(booking.villaId) ?? null : null;
    const slipUrl = payment.slipImage ? slipUrlsByPath.get(payment.slipImage) ?? null : null;

    return { payment, booking, villa, slipUrl };
  });

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Payment Verification</h1>
        {rows.length === 0 ? (
          <p className="mt-4 text-body text-muted-foreground">
            No payments are awaiting verification.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {rows.map(({ payment, booking, villa, slipUrl }) => (
              <PaymentVerificationPanel
                key={payment.id}
                payment={payment}
                booking={booking}
                villa={villa}
                slipUrl={slipUrl}
              />
            ))}
          </div>
        )}
      </main>
    </AdminShell>
  );
}
