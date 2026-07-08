import { AdminShell } from "@/components/dashboard/AdminShell";
import { BlockedDateManager } from "@/components/dashboard/BlockedDateManager";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { listAllBlockedDates } from "@/repositories/blockedDate.repository";
import { getActiveVillas } from "@/repositories/villa.repository";

// Admin Dashboard > Calendar Management (Block/Unblock Dates) — see PRD.md.
export default async function AdminCalendarPage() {
  const {
    data: [villas, blockedDates],
    error: loadError,
  } = await safeFetch(() => Promise.all([getActiveVillas(), listAllBlockedDates()]), [[], []]);

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Calendar Management</h1>
        {loadError ? (
          <p className="mt-4 text-body text-destructive">
            Unable to load calendar data. Make sure you are signed in as an admin.
          </p>
        ) : (
          <div className="mt-6">
            <BlockedDateManager villas={villas} blockedDates={blockedDates} />
          </div>
        )}
      </main>
    </AdminShell>
  );
}
