import Link from "next/link";

import { AdminShell } from "@/components/dashboard/AdminShell";
import { PromotionTable } from "@/components/dashboard/PromotionTable";
import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { listAllPromotions } from "@/repositories/promotion.repository";

export default async function AdminPromotionsPage() {
  const { data: promotions, error: loadError } = await safeFetch(() => listAllPromotions(), []);

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <div className="flex items-center justify-between">
          <h1 className="text-h2 font-bold text-foreground">Promotions</h1>
          <Button asChild>
            <Link href="/admin/promotions/new">New Promotion</Link>
          </Button>
        </div>
        {loadError ? (
          <p className="mt-4 text-body text-destructive">
            Unable to load promotions. Make sure you are signed in as an admin.
          </p>
        ) : (
          <div className="mt-6">
            <PromotionTable promotions={promotions} />
          </div>
        )}
      </main>
    </AdminShell>
  );
}
