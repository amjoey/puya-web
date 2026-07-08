"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deletePromotion, togglePromotionActive } from "@/actions/promotion.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Promotion } from "@/types/promotion";

function formatDiscount(promotion: Promotion): string {
  return promotion.discountType === "percentage"
    ? `${promotion.discountValue}% OFF`
    : `฿${promotion.discountValue.toLocaleString()} OFF`;
}

// See PRD.md > Admin Dashboard > Promotion Management (Create/Edit/Deactivate/Delete).
export function PromotionTable({ promotions }: { promotions: Promotion[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle(promotion: Promotion) {
    startTransition(async () => {
      await togglePromotionActive(promotion.id, !promotion.active);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePromotion(id);
      router.refresh();
    });
  }

  if (promotions.length === 0) {
    return <p className="text-body text-muted-foreground">No promotions yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {promotions.map((promotion) => (
        <div
          key={promotion.id}
          className="flex flex-col gap-3 rounded-lg border border-border p-4 tablet:flex-row tablet:items-center tablet:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="text-body font-semibold text-foreground">{promotion.title}</p>
              <Badge variant="success">{formatDiscount(promotion)}</Badge>
              <Badge variant={promotion.active ? "secondary" : "outline"}>
                {promotion.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {promotion.description && (
              <p className="mt-1 text-caption text-muted-foreground">{promotion.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/promotions/${promotion.id}`}>Edit</Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => handleToggle(promotion)}
            >
              {promotion.active ? "Deactivate" : "Activate"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => handleDelete(promotion.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
