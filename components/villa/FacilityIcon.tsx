import { Car, Flame, Mic2, Umbrella, Waves, Wifi, type LucideIcon } from "lucide-react";

// Shared icon mapping for facility labels in lib/constants/facilities.ts —
// used by both the Home page FacilitiesSection and the Villa Detail page
// VillaFacilities so the mapping isn't duplicated.
const FACILITY_ICONS: Record<string, LucideIcon> = {
  "สระว่ายน้ำส่วนตัว": Waves,
  "คาราโอเกะ": Mic2,
  "บาร์บีคิว": Flame,
  "ติดชายหาด": Umbrella,
  "ที่จอดรถ": Car,
  "WiFi ฟรี": Wifi,
};

export function FacilityIcon({
  facility,
  className,
}: {
  facility: string;
  className?: string;
}) {
  const Icon = FACILITY_ICONS[facility];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}
