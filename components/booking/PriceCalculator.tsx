import { calculatePrice } from "@/services/pricing.service";
import { formatTHB } from "@/lib/utils/currency";

interface PriceCalculatorProps {
  checkIn: string;
  checkOut: string;
  weekdayPrice: number;
  weekendPrice: number;
}

// Step 4 — see PRD.md > 4. Booking System > Step 3 (คำนวณราคา).
export function PriceCalculator({
  checkIn,
  checkOut,
  weekdayPrice,
  weekendPrice,
}: PriceCalculatorProps) {
  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return (
      <div>
        <h2 className="text-h3 font-semibold text-foreground">คำนวณราคา</h2>
        <p className="mt-3 text-body text-muted-foreground">
          กรุณาเลือกวันเช็คอินและเช็คเอาท์เพื่อดูราคา
        </p>
      </div>
    );
  }

  const breakdown = calculatePrice(checkIn, checkOut, weekdayPrice, weekendPrice);

  return (
    <div>
      <h2 className="text-h3 font-semibold text-foreground">คำนวณราคา</h2>
      <dl className="mt-4 flex flex-col gap-2 text-body">
        {breakdown.weekdayNights > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {breakdown.weekdayNights} คืนวันธรรมดา × {formatTHB(breakdown.weekdayRate)}
            </dt>
            <dd className="text-foreground">
              {formatTHB(breakdown.weekdayNights * breakdown.weekdayRate)}
            </dd>
          </div>
        )}
        {breakdown.weekendNights > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {breakdown.weekendNights} คืนวันหยุด × {formatTHB(breakdown.weekendRate)}
            </dt>
            <dd className="text-foreground">
              {formatTHB(breakdown.weekendNights * breakdown.weekendRate)}
            </dd>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-border pt-2 text-h3 font-semibold">
          <dt className="text-foreground">รวม ({breakdown.totalNights} คืน)</dt>
          <dd className="text-foreground">{formatTHB(breakdown.totalPrice)}</dd>
        </div>
      </dl>
    </div>
  );
}
