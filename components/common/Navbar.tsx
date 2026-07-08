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
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className={cn(CONTAINER_PADDING, "flex h-16 items-center justify-between")}>
        <Link href="/" className="text-h3 font-bold text-foreground">
          PUYA Beach Villa
        </Link>

        <nav className="hidden items-center gap-6 tablet:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button asChild className="hidden tablet:inline-flex">
          <Link href="/booking/villa-1">จองเลย</Link>
        </Button>

        <button
          type="button"
          aria-label={isMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex size-11 items-center justify-center tablet:hidden"
        >
          {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className={cn(CONTAINER_PADDING, "flex flex-col gap-1 border-t border-border pb-4 tablet:hidden")}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-md px-2 py-3 text-body text-foreground hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-2 w-full">
            <Link href="/booking/villa-1" onClick={() => setIsMenuOpen(false)}>
              จองเลย
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
