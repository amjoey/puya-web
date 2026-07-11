"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { label: "หน้าแรก", href: "/" },
  { label: "วิลล่า", href: "/villas" },
  { label: "รีวิว", href: "/reviews" },
  { label: "โปรโมชั่น", href: "/promotions" },
  { label: "ติดต่อเรา", href: "/contact" },
] as const;

// See UI_UX_SPEC.md > Global > Navigation (logo, nav links, จองเลย CTA, mobile menu).
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-md">
      <div className={cn(CONTAINER_PADDING, "flex h-16 items-center justify-between")}>
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-wide text-ink"
        >
          PUYA <span className="text-aqua">BEACH VILLA</span>
        </Link>

        <nav className="hidden items-center gap-7 tablet:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-soft transition-colors hover:text-aqua"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button asChild className="hidden tablet:inline-flex">
          <Link href="/booking/villa-1">เช็คราคา &amp; จอง</Link>
        </Button>

        <button
          type="button"
          aria-label={isMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex size-11 items-center justify-center text-ink tablet:hidden"
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className={cn(CONTAINER_PADDING, "flex flex-col gap-1 border-t border-line pb-4 tablet:hidden")}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-2 py-3 text-sm text-ink hover:bg-mist"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-2 w-full">
            <Link href="/booking/villa-1" onClick={() => setIsMenuOpen(false)}>
              เช็คราคา &amp; จอง
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
