import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PendingPaymentsCard({ count }: { count: number }) {
  return (
    <Card>
      <CardHeader>
        <p className="text-caption text-muted-foreground">Pending Payments</p>
      </CardHeader>
      <CardContent>
        <p className="text-h2 font-bold text-foreground">{count}</p>
      </CardContent>
    </Card>
  );
}
