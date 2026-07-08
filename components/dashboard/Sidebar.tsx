"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarCheck,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Tag,
  Wallet,
} from "lucide-react";

import { logoutAdmin } from "@/actions/admin.actions";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Payments", href: "/admin/payments", icon: Wallet },
  { label: "Villas", href: "/admin/villas", icon: ImageIcon },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Promotions", href: "/admin/promotions", icon: Tag },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

// See UI_UX_SPEC.md > Admin Dashboard > Sidebar Navigation.
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-secondary p-4">
      <span className="px-2 text-body font-semibold text-foreground">PUYA Admin</span>
      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-body transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-background",
              )}
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAdmin}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-body text-foreground hover:bg-background"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign Out
        </button>
      </form>
    </aside>
  );
}
