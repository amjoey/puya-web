import Link from "next/link";

import { AdminShell } from "@/components/dashboard/AdminShell";
import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { getActiveVillas } from "@/repositories/villa.repository";

// Admin Dashboard > Manage Villas — entry point for per-villa gallery
// management (app/admin/villas/[id]/page.tsx).
export default async function AdminVillasPage() {
  const { data: villas, error: loadError } = await safeFetch(() => getActiveVillas(), []);

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Manage Villas</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Add, remove, or reorder the photos shown on each villa&apos;s public detail page.
        </p>

        {loadError ? (
          <p className="mt-6 text-body text-destructive">
            Unable to load villas. Make sure you are signed in as an admin.
          </p>
        ) : villas.length === 0 ? (
          <p className="mt-6 text-body text-muted-foreground">No villas found.</p>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {villas.map((villa) => (
              <div
                key={villa.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="text-body font-semibold text-foreground">{villa.name}</p>
                  <p className="text-caption text-muted-foreground">/villas/{villa.slug}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/villas/${villa.id}`}>Manage Photos</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminShell>
  );
}
