import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Promotion } from "@/types/promotion";

function formatDiscount(promotion: Promotion): string {
  return promotion.discountType === "percentage"
    ? `${promotion.discountValue}% OFF`
    : `฿${promotion.discountValue.toLocaleString()} OFF`;
}

// See UI_UX_SPEC.md > Home Page > Promotions Section (Badge, Discount, Description, CTA).
export function PromotionCard({ promotion }: { promotion: Promotion }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <h3 className="text-h3 font-semibold text-foreground">{promotion.title}</h3>
        <Badge variant="success">{formatDiscount(promotion)}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-body text-muted-foreground">{promotion.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <Link href="/promotions">ดูรายละเอียด</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
