import { FacilityIcon } from "@/components/villa/FacilityIcon";
import { FACILITIES } from "@/lib/constants/facilities";

// See PRD.md > Functional Requirements > 2. Villa Detail Page > Features (Facilities).
export function VillaFacilities() {
  return (
    <div>
      <h2 className="text-h3 font-semibold text-foreground">สิ่งอำนวยความสะดวก</h2>
      <ul className="mt-4 grid grid-cols-2 gap-4 tablet:grid-cols-3">
        {FACILITIES.map((facility) => (
          <li
            key={facility}
            className="flex items-center gap-2 text-body text-foreground"
          >
            <FacilityIcon facility={facility} className="size-5 text-primary" />
            {facility}
          </li>
        ))}
      </ul>
    </div>
  );
}
