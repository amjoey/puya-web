import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// "Sea Minimal" home hero — see REDESIGN_PLAN.md > Phase 3.1 and the
// approved mockup (puya-redesign-sea-minimal.html). Bottom-left value hook,
// mixed-weight headline with an aqua-light accent, prominent aqua CTA.
// Real photography now lives in /public/images/home, so this uses
// next/image + priority (the SVG-placeholder blocker is gone). Booking
// route on the primary CTA is unchanged (/booking/villa-1).
export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] w-full items-end overflow-hidden bg-ink text-white">
      <Image
        src="/images/home/hero.jpg"
        alt="PUYA Beach Villa ยามพลบค่ำ — พูลวิลล่าติดทะเล โซนเทพา-สะกอม สงขลา"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Legibility gradients (ink-tinted): darker at the left and the base
          where the eyebrow, headline and CTAs sit. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent"
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-[1180px] pb-16 pt-24",
          CONTAINER_PADDING,
        )}
      >
        <div className="max-w-[620px]">
          <span className="mb-5 inline-flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.18em] before:h-px before:w-6 before:bg-aqua before:content-['']">
            หาดเทพา–สะกอม · สงขลา
          </span>
          <h1 className="mb-4 text-balance text-5xl font-normal leading-[1.1] tablet:text-6xl">
            พูลวิลล่า<b className="font-bold">ติดทะเล</b>
            <br />
            ส่วนตัว<em className="not-italic text-aqua-light">ทั้งหลัง</em>
          </h1>
          <p className="mb-7 max-w-[40ch] text-pretty text-base text-white/90 tablet:text-lg">
            สระส่วนตัว สไลเดอร์ วิวทะเลจากระเบียงชั้น 2 — พื้นที่สำหรับครอบครัว
            และกลุ่มใหญ่ จองตรงกับเจ้าของ
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/booking/villa-1">เช็คราคา / จองเลย</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/50 text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/villas">ดูรูปวิลล่า</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
