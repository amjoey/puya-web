import Link from "next/link";

import { CONTACT_INFO } from "@/lib/constants/contact";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

const FOOTER_LINKS = [
  { label: "วิลล่า", href: "/villas" },
  { label: "รีวิว", href: "/reviews" },
  { label: "โปรโมชั่น", href: "/promotions" },
  { label: "ค้นหาการจอง / ส่งสลิป", href: "/my-booking" },
  { label: "ติดต่อเรา", href: "/contact" },
] as const;

// See UI_UX_SPEC.md > Global > Footer (links, contact info, copyright, socials).
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className={cn(CONTAINER_PADDING, "py-10")}>
        <div className="flex flex-col gap-8 tablet:flex-row tablet:justify-between">
          <div>
            <p className="font-display text-xl font-semibold text-white">
              PUYA <span className="text-aqua">Beach Villa</span>
            </p>
            <p className="mt-2 max-w-xs text-body text-white/60">
              วิลล่าริมชายหาดส่วนตัวพร้อมสระว่ายน้ำ รับได้ถึง 15 คน
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body text-white/75 transition-colors hover:text-aqua"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 text-body text-white/60">
            <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-aqua">
              {CONTACT_INFO.phone}
            </a>
            <a
              href={CONTACT_INFO.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-aqua"
            >
              LINE: {CONTACT_INFO.lineId}
            </a>
            <a
              href={CONTACT_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-aqua"
            >
              Facebook
            </a>
            <p>{CONTACT_INFO.businessHours}</p>
          </div>
        </div>

        <p className="mt-8 text-caption text-white/45">
          © {new Date().getFullYear()} PUYA Beach Villa. สงวนลิขสิทธิ์
        </p>
      </div>
    </footer>
  );
}
