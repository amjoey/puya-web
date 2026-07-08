import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatTHB } from "@/lib/utils/currency";

// See PRD.md > Admin Dashboard > Dashboard Overview (Today's/Monthly Revenue).
export function RevenueCard({ label, amount }: { label: string; amount: number }) {
  return (
    <Card>
      <CardHeader>
        <p className="text-caption text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent>
        <p className="text-h2 font-bold text-foreground">{formatTHB(amount)}</p>
      </CardContent>
    </Card>
  );
}
