import { AdminShell } from "@/components/dashboard/AdminShell";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { formatTHB } from "@/lib/utils/currency";
import { listAllBookings } from "@/repositories/booking.repository";
import { getActiveVillas } from "@/repositories/villa.repository";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Reports — see PRD.md > Admin Dashboard > Reports (Revenue: Daily/Monthly/
// Yearly; Occupancy: Per Villa/Month/Year). Shown as tables (no charting
// library installed yet). Daily revenue drill-down and per-villa-per-month
// occupancy are left as a follow-up; this covers monthly revenue + yearly
// per-villa occupancy.
export default async function AdminReportsPage() {
  const {
    data: [bookings, villas],
    error: loadError,
  } = await safeFetch(() => Promise.all([listAllBookings(), getActiveVillas()]), [[], []]);

  if (loadError) {
    return (
      <AdminShell>
        <main className={cn(CONTAINER_PADDING, "py-8")}>
          <p className="text-body text-destructive">
            Unable to load reports. Make sure you are signed in as an admin.
          </p>
        </main>
      </AdminShell>
    );
  }

  const year = new Date().getFullYear();
  const confirmed = bookings.filter((booking) => booking.bookingStatus === "confirmed");

  const monthlyRevenue = MONTH_LABELS.map((label, index) => {
    const total = confirmed
      .filter((booking) => {
        const date = new Date(booking.checkIn);
        return date.getFullYear() === year && date.getMonth() === index;
      })
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    return { label, total };
  });

  const yearlyRevenue = monthlyRevenue.reduce((sum, month) => sum + month.total, 0);
  const daysInYear = isLeapYear(year) ? 366 : 365;

  const villaOccupancy = villas.map((villa) => {
    const nights = confirmed
      .filter(
        (booking) =>
          booking.villaId === villa.id && new Date(booking.checkIn).getFullYear() === year,
      )
      .reduce((sum, booking) => sum + booking.totalNights, 0);
    return { villa, nights, rate: Math.round((nights / daysInYear) * 100) };
  });

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Reports</h1>

        <section className="mt-8">
          <h2 className="text-h3 font-semibold text-foreground">Revenue — {year}</h2>
          <p className="mt-1 text-caption text-muted-foreground">
            Yearly total: {formatTHB(yearlyRevenue)} (confirmed bookings only)
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-body">
              <thead className="bg-secondary text-caption text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Month</th>
                  <th className="px-4 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRevenue.map((month) => (
                  <tr key={month.label} className="border-t border-border">
                    <td className="px-4 py-2">{month.label}</td>
                    <td className="px-4 py-2">{formatTHB(month.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-h3 font-semibold text-foreground">Occupancy by Villa — {year}</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-body">
              <thead className="bg-secondary text-caption text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Villa</th>
                  <th className="px-4 py-2">Booked Nights</th>
                  <th className="px-4 py-2">Occupancy Rate</th>
                </tr>
              </thead>
              <tbody>
                {villaOccupancy.map(({ villa, nights, rate }) => (
                  <tr key={villa.id} className="border-t border-border">
                    <td className="px-4 py-2">{villa.name}</td>
                    <td className="px-4 py-2">{nights}</td>
                    <td className="px-4 py-2">{rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}
