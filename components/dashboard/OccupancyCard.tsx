import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function OccupancyCard({ rate }: { rate: number }) {
  return (
    <Card>
      <CardHeader>
        <p className="text-caption text-muted-foreground">Occupancy Rate</p>
      </CardHeader>
      <CardContent>
        <p className="text-h2 font-bold text-foreground">{rate}%</p>
      </CardContent>
    </Card>
  );
}
