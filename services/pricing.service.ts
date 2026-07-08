import { WEEKDAY_PRICE, WEEKEND_PRICE } from "@/lib/constants/pricing";

export interface PriceBreakdown {
  totalNights: number;
  weekdayNights: number;
  weekendNights: number;
  weekdayRate: number;
  weekendRate: number;
  totalPrice: number;
}

// Fri/Sat nights are weekend-priced — see CLAUDE.md > Business Rules.
const WEEKEND_DAYS = new Set([5, 6]);

function isWeekendNight(date: Date): boolean {
  return WEEKEND_DAYS.has(date.getDay());
}

// See PRD.md > 4. Booking System > Step 3 (Price Calculation) and
// PROJECT_ANALYSIS.md > Risks (mixed weekday/weekend pricing worked example):
// each night is priced individually by the day-of-week it starts on
// (e.g. the night of Friday is weekend-priced even if checkout is Sunday),
// then summed. Pure date math — safe to import from client components too.
export function calculatePrice(
  checkIn: string,
  checkOut: string,
  weekdayPrice: number = WEEKDAY_PRICE,
  weekendPrice: number = WEEKEND_PRICE,
): PriceBreakdown {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);

  let weekdayNights = 0;
  let weekendNights = 0;

  for (
    let date = start;
    date < end;
    date = new Date(date.getTime() + 86_400_000)
  ) {
    if (isWeekendNight(date)) {
      weekendNights += 1;
    } else {
      weekdayNights += 1;
    }
  }

  return {
    totalNights: weekdayNights + weekendNights,
    weekdayNights,
    weekendNights,
    weekdayRate: weekdayPrice,
    weekendRate: weekendPrice,
    totalPrice: weekdayNights * weekdayPrice + weekendNights * weekendPrice,
  };
}
