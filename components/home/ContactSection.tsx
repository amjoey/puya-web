import Link from "next/link";
import { Clock, Facebook, MessageCircle, Phone } from "lucide-react";

import { SectionTitle } from "@/components/common/SectionTitle";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/lib/constants/contact";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// Condensed contact strip for the Home page; the full map + details live on
// the dedicated /contact page (PRD.md > Functional Requirements > 7. Contact Page).
export function ContactSection() {
  return (
    <section className={cn(SECTION_SPACING, CONTAINER_PADDING)}>
      <div className="mx-auto max-w-3xl text-center">
        <SectionTitle
          title="ติดต่อเรา"
          subtitle="มีคำถามเกี่ยวกับการเข้าพัก? ติดต่อเราได้เลย"
        />
        <div className="flex flex-col items-center justify-center gap-4 tablet:flex-row tablet:gap-8">
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className="flex items-center gap-2 text-body text-foreground hover:text-primary"
          >
            <Phone className="size-5" aria-hidden="true" />
            {CONTACT_INFO.phone}
          </a>
          <a
            href={CONTACT_INFO.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-body text-foreground hover:text-primary"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            {CONTACT_INFO.lineId}
          </a>
          <a
            href={CONTACT_INFO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-body text-foreground hover:text-primary"
          >
            <Facebook className="size-5" aria-hidden="true" />
            Facebook
          </a>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-caption text-muted-foreground">
          <Clock className="size-4" aria-hidden="true" />
          {CONTACT_INFO.businessHours}
        </p>
        <Button asChild className="mt-8">
          <Link href="/contact">ดูแผนที่และข้อมูลเพิ่มเติม</Link>
        </Button>
      </div>
    </section>
  );
}
