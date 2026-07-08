import Link from "next/link";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatTHB } from "@/lib/utils/currency";
import type { Villa } from "@/types/villa";

interface VillaCardProps {
  villa: Villa;
  // First photo from the villa's live gallery (see
  // repositories/villaImage.repository.ts) — falls back to villa.coverImage
  // when the admin hasn't uploaded any gallery photos yet.
  imageUrl?: string | null;
}

// See UI_UX_SPEC.md > Home Page > Villas Section
// (Cover Image, Villa Name, Capacity, Price, Button).
export function VillaCard({ villa, imageUrl }: VillaCardProps) {
  const displayImage = imageUrl ?? villa.coverImage;

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-secondary">
        {displayImage && (
          // Plain <img>, not next/image — see HeroSection.tsx note.
          <img
            src={displayImage}
            alt={`${villa.name} cover photo`}
            className="size-full object-cover"
          />
        )}
      </div>
      <CardHeader className="px-6 pt-6">
        <h3 className="text-h3 font-semibold text-foreground">{villa.name}</h3>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <Badge variant="secondary" className="gap-1.5">
          <Users className="size-3.5" aria-hidden="true" />
          รับได้ถึง {villa.capacity} คน
        </Badge>
        <span className="text-body font-semibold text-foreground">
          เริ่มต้น {formatTHB(villa.weekdayPrice)}/คืน
        </span>
      </CardContent>
      <CardFooter className="pb-6">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/villas/${villa.slug}`}>ดูรายละเอียด</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
