import { formatTHB } from "@/lib/utils/currency";
import type { Villa } from "@/types/villa";

// See PRD.md > Functional Requirements > 2. Villa Detail Page > Features (Pricing Information).
export function VillaPricing({ villa }: { villa: Villa }) {
  return (
    <div>
      <h2 className="text-h3 font-semibold text-foreground">ราคา</h2>
      <dl className="mt-4 grid grid-cols-2 gap-4 tablet:max-w-sm">
        <div className="rounded-lg border border-border bg-secondary p-4">
          <dt className="text-caption text-muted-foreground">วันธรรมดา (อา.–พฤ.)</dt>
          <dd className="mt-1 text-h3 font-semibold text-foreground">
            {formatTHB(villa.weekdayPrice)}
          </dd>
          <dd className="text-caption text-muted-foreground">ต่อคืน</dd>
        </div>
        <div className="rounded-lg border border-border bg-secondary p-4">
          <dt className="text-caption text-muted-foreground">วันหยุด (ศ.–ส.)</dt>
          <dd className="mt-1 text-h3 font-semibold text-foreground">
            {formatTHB(villa.weekendPrice)}
          </dd>
          <dd className="text-caption text-muted-foreground">ต่อคืน</dd>
        </div>
      </dl>
    </div>
  );
}
