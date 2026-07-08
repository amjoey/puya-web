import { SectionTitle } from "@/components/common/SectionTitle";
import { FacilityIcon } from "@/components/villa/FacilityIcon";
import { FACILITIES } from "@/lib/constants/facilities";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// See PRD.md > Functional Requirements > 1. Home Page > Facilities Section.
export function FacilitiesSection() {
  return (
    <section className={cn(SECTION_SPACING, CONTAINER_PADDING, "bg-secondary")}>
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="สิ่งอำนวยความสะดวก"
          subtitle="ครบครันทุกความต้องการสำหรับการพักผ่อนริมทะเล"
        />
        <div className="grid grid-cols-2 gap-6 tablet:grid-cols-3 desktop:grid-cols-6">
          {FACILITIES.map((facility) => (
            <div
              key={facility}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FacilityIcon facility={facility} className="size-7" />
              </div>
              <span className="text-caption font-medium text-foreground">
                {facility}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
