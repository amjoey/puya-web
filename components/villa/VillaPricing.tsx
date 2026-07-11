import { formatTHB } from "@/lib/utils/currency";
import type { Villa } from "@/types/villa";

// See PRD.md > Functional Requirements > 2. Villa Detail Page > Features (Pricing Information).
export function VillaPricing({ villa }: { villa: Villa }) {
  return (
    <div>
      <h2 className="text-2xl font-medium text-ink">ราคา</h2>
      <dl className="mt-4 grid grid-cols-2 gap-4 tablet:max-w-sm">
        <div className="rounded-2xl border border-line bg-paper p-4">
          <dt className="text-caption text-ink-soft">วันธรรมดา (อา.–พฤ.)</dt>
          <dd className="mt-1 text-2xl font-semibold text-ink">
            {formatTHB(villa.weekdayPrice)}
          </dd>
          <dd className="text-caption text-ink-soft">ต่อคืน</dd>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4">
          <dt className="text-caption text-ink-soft">วันหยุด (ศ.–ส.)</dt>
          <dd className="mt-1 text-2xl font-semibold text-ink">
            {formatTHB(villa.weekendPrice)}
          </dd>
          <dd className="text-caption text-ink-soft">ต่อคืน</dd>
        </div>
      </dl>
    </div>
  );
}
