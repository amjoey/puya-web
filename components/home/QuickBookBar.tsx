"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Search, X } from "lucide-react";

import {
  searchAvailability,
  type SearchAvailabilityResult,
} from "@/actions/booking.actions";
import { Button } from "@/components/ui/button";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// Real, DB-backed availability search — see PRD.md > 3. Availability. The
// bar posts a date range to the searchAvailability Server Action (which runs
// the service-role bookings check on the server) and renders per-villa
// results inline. This stays a client component + on-demand action, so the
// Home page remains statically prerendered / ISR.
export function QuickBookBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [result, setResult] = useState<SearchAvailabilityResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().slice(0, 10);
  const rangeValid = Boolean(checkIn && checkOut && checkOut > checkIn);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!rangeValid) return;
    startTransition(async () => {
      setResult(await searchAvailability({ checkIn, checkOut }));
    });
  }

  return (
    <div
      className={cn(
        "relative z-20 mx-auto -mt-10 w-full max-w-[1180px] tablet:-mt-11",
        CONTAINER_PADDING,
      )}
    >
      <form
        onSubmit={handleSearch}
        className="rounded-2xl border border-line bg-white p-4 shadow-soft tablet:p-5"
      >
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-[1fr_1fr_auto] tablet:items-end tablet:gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              เช็คอิน
            </span>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(event) => {
                setCheckIn(event.target.value);
                if (checkOut && event.target.value >= checkOut) setCheckOut("");
                setResult(null);
              }}
              className="w-full rounded-xl border border-line px-3.5 py-3 text-sm text-ink transition-colors focus:border-aqua focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              เช็คเอาท์
            </span>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(event) => {
                setCheckOut(event.target.value);
                setResult(null);
              }}
              className="w-full rounded-xl border border-line px-3.5 py-3 text-sm text-ink transition-colors focus:border-aqua focus:outline-none"
            />
          </label>

          <Button
            type="submit"
            size="lg"
            disabled={!rangeValid || isPending}
            className="tablet:h-[52px]"
          >
            <Search className="size-4" aria-hidden="true" />
            {isPending ? "กำลังค้นหา..." : "ค้นหาห้องว่าง"}
          </Button>
        </div>

        {result && (
          <div className="mt-4 border-t border-line pt-4" aria-live="polite">
            <SearchResults result={result} checkIn={checkIn} checkOut={checkOut} />
          </div>
        )}
      </form>
    </div>
  );
}

function SearchResults({
  result,
  checkIn,
  checkOut,
}: {
  result: SearchAvailabilityResult;
  checkIn: string;
  checkOut: string;
}) {
  if (!result.success) {
    return <p className="text-sm text-destructive">{result.error}</p>;
  }

  const availableCount = result.results.filter((villa) => villa.available).length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink-soft">
        {availableCount > 0
          ? `พบ ${availableCount} วิลล่าว่าง สำหรับ ${result.nights} คืน`
          : "ช่วงวันที่นี้ไม่มีวิลล่าว่าง ลองเปลี่ยนวันดูนะครับ"}
      </p>

      {result.results.map((villa) => (
        <div
          key={villa.villaId}
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3",
            villa.available ? "border-line" : "border-line bg-mist/40",
          )}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full",
                villa.available
                  ? "bg-success/15 text-success"
                  : "bg-ink-soft/10 text-ink-soft",
              )}
            >
              {villa.available ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                <X className="size-3.5" aria-hidden="true" />
              )}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{villa.name}</p>
              <p className="text-xs text-ink-soft">
                {villa.available
                  ? `เริ่ม ${villa.weekdayPrice.toLocaleString("th-TH")} บาท/คืน`
                  : "ไม่ว่างในช่วงนี้"}
              </p>
            </div>
          </div>

          {villa.available && (
            <Button asChild size="sm">
              <Link
                href={`/booking/${villa.slug}?checkIn=${checkIn}&checkOut=${checkOut}`}
              >
                จองเลย
              </Link>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
