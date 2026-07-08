import { AdminShell } from "@/components/dashboard/AdminShell";
import { BookingTable } from "@/components/dashboard/BookingTable";
import { OccupancyCard } from "@/components/dashboard/OccupancyCard";
import { PendingPaymentsCard } from "@/components/dashboard/PendingPaymentsCard";
import { RevenueCard } from "@/components/dashboard/RevenueCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { listAllBookings } from "@/repositories/booking.repository";
import { listPendingPayments } from "@/repositories/payment.repository";

function isSameMonth(dateStr: string, reference: Date): boolean {
  const date = new Date(dateStr);
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
}

// Admin Dashboard Overview — see PRD.md > Admin Dashboard > Dashboard Overview.
// KPIs are computed in-memory from the booking list rather than via SQL
// aggregation for now; fine at this data volume, worth moving server-side
// (a reports view/RPC) if booking counts grow large.
export default async function AdminDashboardPage() {
  const {
    data: [bookings, pendingPayments],
    error: loadError,
  } = await safeFetch(() => Promise.all([listAllBookings(), listPendingPayments()]), [[], []]);

  if (loadError) {
    return (
      <AdminShell>
        <main className={cn(CONTAINER_PADDING, "py-8")}>
          <p className="text-body text-destructive">
            Unable to load dashboard data. Make sure you are signed in as an admin.
          </p>
        </main>
      </AdminShell>
    );
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const confirmedBookings = bookings.filter((booking) => booking.bookingStatus === "confirmed");

  const todayRevenue = confirmedBookings
    .filter((booking) => booking.checkIn <= today && booking.checkOut > today)
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  const monthlyRevenue = confirmedBookings
    .filter((booking) => isSameMonth(booking.checkIn, now))
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  const occupiedNights = confirmedBookings.reduce((sum, booking) => sum + booking.totalNights, 0);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const occupancyRate = Math.min(100, Math.round((occupiedNights / daysInMonth) * 100));

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Dashboard</h1>
        <div className="mt-6 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
          <Card>
            <CardHeader>
              <p className="text-caption text-muted-foreground">Total Bookings</p>
            </CardHeader>
            <CardContent>
              <p className="text-h2 font-bold text-foreground">{bookings.length}</p>
            </CardContent>
          </Card>
          <RevenueCard label="Today's Revenue" amount={todayRevenue} />
          <RevenueCard label="Monthly Revenue" amount={monthlyRevenue} />
          <OccupancyCard rate={occupancyRate} />
          <PendingPaymentsCard count={pendingPayments.length} />
        </div>
        <div className="mt-8">
          <h2 className="text-h3 font-semibold text-foreground">Recent Bookings</h2>
          <div className="mt-4">
            <BookingTable bookings={recentBookings} />
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
