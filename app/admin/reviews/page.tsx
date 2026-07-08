import { AdminShell } from "@/components/dashboard/AdminShell";
import { ReviewModerationTable } from "@/components/dashboard/ReviewModerationTable";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { safeFetch } from "@/lib/utils/safeFetch";
import { cn } from "@/lib/utils/cn";
import { listAllReviews } from "@/repositories/review.repository";

export default async function AdminReviewsPage() {
  const { data: reviews, error: loadError } = await safeFetch(() => listAllReviews(), []);

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Reviews</h1>
        {loadError ? (
          <p className="mt-4 text-body text-destructive">
            Unable to load reviews. Make sure you are signed in as an admin.
          </p>
        ) : (
          <div className="mt-6">
            <ReviewModerationTable reviews={reviews} />
          </div>
        )}
      </main>
    </AdminShell>
  );
}
