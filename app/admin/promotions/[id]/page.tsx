import { notFound } from "next/navigation";

import { AdminShell } from "@/components/dashboard/AdminShell";
import { PromotionForm } from "@/components/dashboard/PromotionForm";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { isUuid } from "@/lib/utils/uuid";
import { getPromotionById } from "@/repositories/promotion.repository";

interface AdminPromotionEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPromotionEditPage({
  params,
}: AdminPromotionEditPageProps) {
  const { id } = await params;

  if (!isUuid(id)) {
    notFound();
  }

  const { data: promotion, error: loadError } = await safeFetch(
    () => getPromotionById(id),
    null,
  );

  if (loadError) {
    return (
      <AdminShell>
        <main className={cn(CONTAINER_PADDING, "py-8")}>
          <p className="text-body text-destructive">
            Unable to load this promotion. Make sure you are signed in as an admin.
          </p>
        </main>
      </AdminShell>
    );
  }

  if (!promotion) {
    notFound();
  }

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Edit Promotion</h1>
        <div className="mt-6 max-w-xl">
          <PromotionForm promotion={promotion} />
        </div>
      </main>
    </AdminShell>
  );
}
