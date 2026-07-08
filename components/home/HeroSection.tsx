import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// See UI_UX_SPEC.md > Home Page > Hero Section (100vh, background image,
// headline, subheadline, CTA buttons) and PRD.md > Functional Requirements
// > 1. Home Page > Hero Section.
export function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-foreground">
      {/* Demo hero background (SVG placeholder, no baked-in text — the
          real headline below is the only text layer) — plain <img>, not
          next/image, since next/image requires dangerouslyAllowSVG config
          that doesn't exist yet (no next.config.ts). Swap to next/image
          once real photography lands. */}
      <img
        src="/demo/hero-bg.svg"
        alt="PUYA Beach Villa beachfront private pool villa"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center",
          CONTAINER_PADDING,
        )}
      >
        <h1 className="text-4xl font-bold text-white tablet:text-h1">
          PUYA BEACH VILLA
        </h1>
        <p className="mt-4 text-lg text-white/90 tablet:text-h3 tablet:font-normal">
          วิลล่าริมชายหาดส่วนตัว — รับได้ถึง 15 คน
        </p>
        <div className="mt-8 flex flex-col gap-4 tablet:flex-row">
          <Button asChild size="lg">
            <Link href="/booking/villa-1">จองเลย</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/availability">ตรวจสอบวันว่าง</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
