# PUYA BEACH VILLA — UI Redesign Plan

> **สำหรับใช้กับ Claude Code ใน VS Code**
> เป้าหมาย: reskin เว็บ booking (Next.js 14) ที่มีอยู่ ให้สวย + conversion ดีขึ้น โดย **ไม่แตะ business logic**
> Stack: Next.js 14 · Tailwind · Supabase · Vercel

---

## ⛔ GUARDRAILS — อ่านก่อนเริ่มทุกครั้ง

Claude Code ต้องปฏิบัติตามนี้ตลอด redesign:

1. **ห้ามแตะ logic การจอง** — PromptPay QR generation, deposit 50% calc, slip upload, LINE OA confirmation, API routes, Supabase queries **ห้ามแก้เด็ดขาด** เราแก้แค่ `className`, layout, และ presentational markup เท่านั้น
2. **ห้ามแตะ state และ validation** ในหน้า booking flow — แก้ได้แค่หน้าตา ไม่แตะ `useState`, form validation, submit handler
3. **แก้ทีละเฟส** — ทำเฟสปัจจุบันให้จบและ commit ก่อนขึ้นเฟสถัดไป ห้ามข้าม
4. **ทุก style ต้องดึงจาก design tokens** — ห้าม hardcode สี/ขนาดใน component (เช่น ห้าม `text-[#3b82f6]` ตรงๆ ให้ใช้ token ที่ตั้งไว้)
5. **หลังแก้ทุกเฟส ต้องรัน `npm run build` ให้ผ่าน** ก่อน commit

---

## Phase 0 — Setup (5 นาที)

**Goal:** กันเว็บ production พัง

```bash
git checkout -b redesign
git status   # เช็คว่า clean ก่อนเริ่ม
```

**Done เมื่อ:** อยู่บน branch `redesign` แล้ว, main ไม่ถูกแตะ

---

## Phase 1 — Design Tokens (หัวใจของงาน)

**Goal:** วางระบบสี/ฟอนต์/ระยะ เป็น single source of truth ก่อนแตะ component ใดๆ

### Design Direction — "Sea Minimal" (ล็อกแล้ว ✅)
ดึงจากตัววิลล่าจริง: **ขาวสะอาด มินิมอล + เทอร์ควอยซ์จากสไลเดอร์/สระเป็น signature + วิวทะเลจริง + แต้มอำพันจากไฟ festoon ยามพลบค่ำ** โปร่ง หายใจได้ ตรงกับความสว่างของห้องจริง

**Palette (hex สุดท้าย):**
| Token | Hex | ใช้ตรงไหน |
|---|---|---|
| `white` | `#FFFFFF` | พื้นหลักของหน้า |
| `paper` | `#F6F8F8` | พื้น section สลับ (airy off-white) |
| `mist` | `#EBEFEF` | พื้นอ่อน/แถบคั่น |
| `aqua` | `#16B5AD` | **สี accent หลัก** — ปุ่ม CTA, ไอคอน, ตัวเลข |
| `aqua-deep` | `#0E948D` | hover ของ CTA |
| `aqua-soft` | `#DCF1EF` | พื้นไอคอน/แท็กแบบ tint |
| `amber` | `#E3A24B` | แต้มอุ่นเล็กน้อย (festoon/พลบค่ำ) ใช้น้อยๆ |
| `sky` | `#7FB4CE` | สีทะเล/ฟ้ารอง (subtle) |
| `ink` | `#26343A` | ตัวหนังสือหลัก (soft charcoal ไม่ใช่ดำสนิท) |
| `muted` | `#69797F` | ตัวหนังสือรอง |
| `line` | `#E3E9E9` | เส้น hairline / border |

**Typography:** `Anuphan` (display — เบา โปร่ง สำหรับหัวข้อ) + `IBM Plex Sans Thai` (body — อ่านง่าย รองรับไทยเต็ม) โหลดผ่าน `next/font/google`
**Feel:** `--radius: 16px`, shadow ฟุ้งบาง `0 20px 50px -26px rgba(38,52,58,.28)`, spacing โปร่ง

### ไฟล์ tokens พร้อมใช้

**`tailwind.config.ts`** — เพิ่มใน `theme.extend`:
```ts
extend: {
  colors: {
    white: "#FFFFFF", paper: "#F6F8F8", mist: "#EBEFEF",
    aqua: { DEFAULT: "#16B5AD", deep: "#0E948D", soft: "#DCF1EF" },
    amber: "#E3A24B", sky: "#7FB4CE",
    ink: "#26343A", muted: "#69797F", line: "#E3E9E9",
  },
  fontFamily: {
    display: ["var(--font-display)", "sans-serif"],
    body: ["var(--font-body)", "sans-serif"],
  },
  borderRadius: { xl: "16px", "2xl": "20px" },
  boxShadow: { soft: "0 20px 50px -26px rgba(38,52,58,.28)" },
}
```

**`app/layout.tsx`** — โหลดฟอนต์ผ่าน next/font:
```ts
import { Anuphan, IBM_Plex_Sans_Thai } from "next/font/google";
const display = Anuphan({ subsets: ["thai","latin"], weight: ["300","400","500","600","700"], variable: "--font-display" });
const body = IBM_Plex_Sans_Thai({ subsets: ["thai","latin"], weight: ["300","400","500","600"], variable: "--font-body" });
// <html lang="th" className={`${display.variable} ${body.variable}`}> ... <body className="font-body text-ink bg-white">
```

**`app/globals.css`** — CSS variables สำรอง (เผื่อใช้นอก Tailwind):
```css
:root{
  --aqua:#16B5AD; --aqua-deep:#0E948D; --aqua-soft:#DCF1EF;
  --ink:#26343A; --muted:#69797F; --line:#E3E9E9;
  --paper:#F6F8F8; --radius:16px;
  --shadow:0 20px 50px -26px rgba(38,52,58,.28);
}
h1,h2,h3{font-family:var(--font-display);letter-spacing:-.01em;line-height:1.15}
```

### Prompt สำหรับ paste ใน Claude Code

```
อ่าน tailwind.config.ts, app/layout.tsx, app/globals.css ของโปรเจกต์นี้ก่อน

ตั้ง design tokens ธีม "Sea Minimal" ตามสเปกนี้เป๊ะ (อย่าเปลี่ยนค่า):
- colors: white #FFFFFF, paper #F6F8F8, mist #EBEFEF,
  aqua #16B5AD (deep #0E948D, soft #DCF1EF), amber #E3A24B, sky #7FB4CE,
  ink #26343A, muted #69797F, line #E3E9E9
  → ใส่ใน tailwind.config theme.extend.colors ตามโครงที่ผมให้
- fonts: Anuphan (display) + IBM Plex Sans Thai (body) ผ่าน next/font/google
  ตั้ง variable --font-display / --font-body แล้ว map เป็น font-display / font-body
  subsets ต้องมี "thai" ด้วย
- borderRadius xl=16px, boxShadow soft ตามที่กำหนด
- ตั้ง body เป็น font-body text-ink bg-white, หัวข้อ h1-h3 ใช้ font-display

ยังไม่ต้องแก้ component ใดๆ ในเฟสนี้ ทำแค่ tokens
เสร็จแล้วรัน npm run build ให้ผ่าน
```

**Done เมื่อ:** tokens ครบใน config, build ผ่าน, ยังไม่มี component ไหนถูกแก้
→ `git commit -m "design tokens"`

---

## Phase 2 — Primitives (bottom-up)

**Goal:** reskin component พื้นฐานที่ใช้ซ้ำทั้งเว็บ พอตัวนี้สวย หน้าอื่นจะพลอยดีขึ้นครึ่งทาง

ลำดับ: **Button → Card → Input/Field → Badge → Section container**

### Prompt สำหรับ paste ใน Claude Code

```
ตอนนี้ design tokens พร้อมแล้ว ให้ reskin UI primitives ทีละตัวตามลำดับนี้:
Button, Card, Input, Badge

กติกา:
- ใช้เฉพาะ design tokens ที่ตั้งไว้ ห้าม hardcode สี/ขนาด
- Button ต้องมี variant: primary (CTA เด่น), secondary, outline + hover/active state
- ทุกตัวต้องมี rounded + shadow ตาม token
- ห้ามเปลี่ยน props interface หรือ behavior เดิม แก้แค่ style
- ถ้าโปรเจกต์ยังไม่มี primitive แยก ให้สร้างใน components/ui/ แล้วค่อยใช้แทน

ทำทีละตัว หยุดให้ผมรีวิวหลังทำ Button เสร็จก่อน
```

**Done เมื่อ:** primitives ใหม่ใช้งานได้, build ผ่าน
→ `git commit -m "reskin primitives"`

---

## Phase 3 — Pages (ไล่ตามผลต่อ booking)

ทำ **ทีละหน้า** ตามลำดับผลต่อยอดจอง อย่าทำพร้อมกัน

### 3.1 Hero / หน้าแรก ⭐ สำคัญสุด
ต้องสื่อจุดขายใน 3 วินาทีแรก:
- **Value hook:** "รวม 2 วิลล่า — 6 ห้องนอน · 2 สระ · จัดกลุ่มใหญ่ได้" (จุดต่างที่คู่แข่งไม่มี)
- **CTA เด่น:** ปุ่ม "เช็คราคา / จองเลย" ต้องสะดุดตาที่สุดบนหน้า
- รูป hero (สระ/ทะเล/rooftop) โหลดเร็ว ใช้ `next/image` + priority

```
Reskin หน้า Home โดยใช้ primitives + tokens ที่ทำไว้
- Hero section: พาดหัวสื่อจุดขาย "รวม 2 วิลล่า 6 ห้องนอน 2 สระ จัดกลุ่มใหญ่ได้"
  + ปุ่ม CTA "เช็คราคา/จองเลย" เป็น primary button เด่นชัด
- ใช้ next/image priority กับรูป hero
- ห้ามแตะ link/route หรือ data fetching เดิม แก้แค่ layout + style
รัน build ให้ผ่านหลังทำเสร็จ
```

### 3.2 หน้ารายละเอียดวิลล่า
- แสดง amenities ให้สแกนง่าย (สระ · water slide · rooftop sea view · karaoke · kitchen)
- Gallery รูปสวย โหลดไว
- ปุ่มจองย้ำอีกจุด (sticky/bottom บนมือถือยิ่งดี)

### 3.3 Booking Flow ⚠️ ระวังสุด
**แก้แค่หน้าตา — logic ห้ามแตะ**
- ทำ step ให้ดูโปร่ง สะอาด ลด friction ทางสายตา
- ตรง PromptPay QR + slip upload ทำให้ดู trustworthy (ชัด, มี trust signal)
- **ห้ามแตะ:** state, validation, QR gen, upload handler, submit

```
Reskin เฉพาะ "หน้าตา" ของ booking flow ให้เข้าธีมใหม่
CRITICAL: ห้ามแตะ useState, validation, PromptPay QR logic, slip upload handler,
submit function, หรือ API call ใดๆ — แก้ได้แค่ className และ JSX layout เท่านั้น
ถ้าไม่แน่ใจว่าโค้ดส่วนไหนคือ logic ให้ถามผมก่อนแก้
```

**Done แต่ละหน้า:** build ผ่าน + เทสจองจริง 1 รอบว่ายังทำงานปกติ → commit แยกต่อหน้า

---

## Phase 4 — Polish & Merge

1. เช็ค responsive บนมือถือทุกหน้า (ลูกค้าจองจากมือถือเป็นหลัก)
2. เช็ค loading speed รูปภาพ (`next/image`, lazy load)
3. เทส booking flow end-to-end อีกรอบ: เลือกวัน → deposit → QR → upload slip → LINE
4. Merge:
```bash
npm run build          # ต้องผ่าน
git checkout main
git merge redesign
git push
```

---

## ✅ Checklist สุดท้ายก่อน push

- [ ] Booking logic ทำงานเหมือนเดิมทุกอย่าง (จองจริงทดสอบผ่าน)
- [ ] ไม่มี hardcoded สี/ขนาด — ทุกอย่างมาจาก tokens
- [ ] มือถือสวยและใช้ง่าย
- [ ] รูป hero โหลดเร็ว
- [ ] CTA "จอง" เด่นทุกหน้าที่ควรมี
- [ ] `npm run build` ผ่าน
