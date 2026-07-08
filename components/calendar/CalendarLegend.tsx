// See UI_UX_SPEC.md > Villa Detail Page > Availability Calendar (Color Indicators).
const LEGEND_ITEMS = [
  { label: "ว่าง", colorClass: "bg-success" },
  { label: "รอชำระเงิน", colorClass: "bg-warning" },
  { label: "จองแล้ว", colorClass: "bg-destructive" },
] as const;

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-caption text-muted-foreground">
      {LEGEND_ITEMS.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span
            className={`size-2.5 rounded-full ${item.colorClass}`}
            aria-hidden="true"
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
