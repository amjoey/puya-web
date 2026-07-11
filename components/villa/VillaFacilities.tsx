import { FacilityIcon } from "@/components/villa/FacilityIcon";
import { FACILITIES } from "@/lib/constants/facilities";

// See PRD.md > Functional Requirements > 2. Villa Detail Page > Features (Facilities).
export function VillaFacilities() {
  return (
    <div>
      <h2 className="text-2xl font-medium text-ink">สิ่งอำนวยความสะดวก</h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
        {FACILITIES.map((facility) => (
          <li
            key={facility}
            className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-body text-ink"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-aqua-soft">
              <FacilityIcon facility={facility} className="size-5 text-aqua-deep" />
            </span>
            {facility}
          </li>
        ))}
      </ul>
    </div>
  );
}
