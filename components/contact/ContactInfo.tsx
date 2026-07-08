import { Clock, Facebook, MapPin, MessageCircle, Phone } from "lucide-react";

import { CONTACT_INFO } from "@/lib/constants/contact";

// See PRD.md > Contact Page (phone, LINE, Facebook, hours, address).
export function ContactInfo() {
  return (
    <div className="flex flex-col gap-4">
      <a
        href={`tel:${CONTACT_INFO.phone}`}
        className="flex items-center gap-3 text-body text-foreground hover:text-primary"
      >
        <Phone className="size-5 text-primary" aria-hidden="true" />
        {CONTACT_INFO.phone}
      </a>
      <a
        href={CONTACT_INFO.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-body text-foreground hover:text-primary"
      >
        <MessageCircle className="size-5 text-primary" aria-hidden="true" />
        LINE: {CONTACT_INFO.lineId}
      </a>
      <a
        href={CONTACT_INFO.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-body text-foreground hover:text-primary"
      >
        <Facebook className="size-5 text-primary" aria-hidden="true" />
        Facebook
      </a>
      <div className="flex items-center gap-3 text-body text-foreground">
        <Clock className="size-5 text-primary" aria-hidden="true" />
        {CONTACT_INFO.businessHours}
      </div>
      <div className="flex items-center gap-3 text-body text-foreground">
        <MapPin className="size-5 text-primary" aria-hidden="true" />
        {CONTACT_INFO.address}
      </div>
    </div>
  );
}
