import { AdminShell } from "@/components/dashboard/AdminShell";
import { PromotionForm } from "@/components/dashboard/PromotionForm";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

export default function AdminPromotionNewPage() {
  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">New Promotion</h1>
        <div className="mt-6 max-w-xl">
          <PromotionForm />
        </div>
      </main>
    </AdminShell>
  );
}
