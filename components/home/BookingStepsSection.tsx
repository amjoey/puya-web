import { SectionHeader } from "@/components/common/SectionHeader";
import { CONTAINER_PADDING, SECTION_SPACING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// "จองตรง 4 ขั้นตอน" — markets the real booking flow on a dark ground.
// See REDESIGN_PLAN.md > Phase 3 / mockup. Presentational only: it describes
// the flow (PromptPay / slip / LINE) but contains no booking logic.
const STEPS = [
  { num: "1", title: "เลือกวันเข้าพัก", desc: "เช็คห้องว่างและราคาได้ทันที" },
  { num: "2", title: "จ่ายมัดจำ 50%", desc: "สแกน PromptPay QR ชำระได้เลย" },
  { num: "3", title: "อัปโหลดสลิป", desc: "แนบสลิปเพื่อยืนยันการชำระ" },
  { num: "4", title: "ยืนยันทาง LINE", desc: "รับการยืนยันการจองทาง LINE OA" },
] as const;

const TRUST = [
  "PromptPay ปลอดภัย",
  "จองตรงกับเจ้าของ",
  "ยืนยันทาง LINE OA",
  "Muslim-friendly",
] as const;

export function BookingStepsSection() {
  return (
    <section id="booking" className={cn("bg-ink text-white", SECTION_SPACING)}>
      <div className={cn("mx-auto max-w-[1180px]", CONTAINER_PADDING)}>
        <SectionHeader
          eyebrow="จองง่าย ปลอดภัย"
          title="จองตรง 4 ขั้นตอน"
          subtitle="ไม่ผ่าน OTA · ราคาดีกว่า · คุยกับเจ้าของโดยตรง"
          eyebrowClassName="text-aqua-light"
          titleClassName="text-white"
          subtitleClassName="text-white/70"
        />

        <ol className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
          {STEPS.map((step) => (
            <li
              key={step.num}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <span className="font-display text-2xl font-semibold text-aqua">
                {step.num}
              </span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-white/70">{step.desc}</p>
            </li>
          ))}
        </ol>

        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {TRUST.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-white/85">
              <span className="size-2 rounded-full bg-aqua" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
