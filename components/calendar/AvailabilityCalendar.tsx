import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { getMonthlyAvailability, type DayAvailabilityStatus } from "@/services/availability.service";
import { cn } from "@/lib/utils/cn";
import { safeFetch } from "@/lib/utils/safeFetch";

interface AvailabilityCalendarProps {
  villaId: string;
  villaName: string;
  year: number;
  month: number; // 0-indexed, matches JS Date
  // Path the prev/next month links navigate to, e.g. "/villas/villa-1" on
  // the villa detail page or "/availability" on the combined overview page.
  basePath: string;
}

const STATUS_CLASSES: Record<DayAvailabilityStatus, string> = {
  available: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  booked: "bg-destructive/15 text-destructive",
};

const WEEKDAY_LABELS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function toMonthParam(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// Live, Supabase-backed monthly availability — see PRD.md > 3. Availability
// Calendar (Monthly view, real-time update) and UI_UX_SPEC.md > Villa Detail
// Page > Availability Calendar (Green/Available, Yellow/Pending, Red/Booked).
export async function AvailabilityCalendar({
  villaId,
  villaName,
  year,
  month,
  basePath,
}: AvailabilityCalendarProps) {
  const { data: statuses, error: loadError } = await safeFetch(
    () => getMonthlyAvailability(villaId, year, month),
    {} as Record<string, DayAvailabilityStatus>,
  );

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month, 1).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  const prevMonthParam = toMonthParam(new Date(year, month - 1, 1));
  const nextMonthParam = toMonthParam(new Date(year, month + 1, 1));

  const cells: Array<{ day: number; date: string } | null> = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return { day, date };
    }),
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-semibold text-foreground">ปฏิทินวันว่าง</h2>
        <div className="flex items-center gap-2">
          <Link
            href={`${basePath}?month=${prevMonthParam}`}
            aria-label="เดือนก่อนหน้า"
            className="flex size-8 items-center justify-center rounded-md border border-border text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Link>
          <span className="text-caption text-muted-foreground">{monthLabel}</span>
          <Link
            href={`${basePath}?month=${nextMonthParam}`}
            aria-label="เดือนถัดไป"
            className="flex size-8 items-center justify-center rounded-md border border-border text-foreground hover:bg-secondary"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {loadError ? (
        <p className="mt-4 text-body text-destructive">
          ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่ภายหลัง
        </p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-caption font-medium text-muted-foreground"
              >
                {label}
              </div>
            ))}
            {cells.map((cell, index) => {
              if (cell === null) {
                return <div key={`empty-${index}`} />;
              }

              const status = statuses[cell.date] ?? "available";
              const isOccupied = status === "booked" || status === "pending";

              return (
                <div
                  key={cell.date}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md text-caption font-medium",
                    STATUS_CLASSES[status],
                  )}
                >
                  <span>{cell.day}</span>
                  {isOccupied && (
                    <span className="truncate px-0.5 text-[10px] font-normal leading-none">
                      {villaName}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <CalendarLegend />
          </div>
        </>
      )}
    </div>
  );
}
