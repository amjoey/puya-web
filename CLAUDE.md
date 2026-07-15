# CLAUDE.md

## Project

PUYA BEACH VILLA

Luxury Beachfront Pool Villa Booking Platform

---

# Tech Stack

Frontend

* Next.js 15
* React 19
* TypeScript
* TailwindCSS
* Shadcn/UI

Backend

* Supabase

Deployment

* Vercel

---

# Coding Standards

## TypeScript

Use strict mode.

Avoid any type.

Always create interfaces.

Use server actions whenever possible.

---

## Components

All components must be:

* Reusable
* Responsive
* Accessible

Use:

app/components

Structure:

components/
ui/
forms/
booking/
calendar/
villa/
dashboard/

---

## Styling

Use TailwindCSS only.

Avoid inline styles.

Use design tokens.

---

## Colors

Primary

#0EA5E9

Secondary

#F8FAFC

Text

#0F172A

Background

#FFFFFF

---

## UI Style

Minimal Luxury

Beach Resort

Modern

Clean

Mobile First

---

## Database Rules

Use Supabase Client.

Never write raw SQL inside components.

Use repository pattern.

---

## Validation

Use Zod.

Validate all:

* Forms
* API Requests
* Server Actions

---

## Error Handling

Every page must include:

* Loading State
* Empty State
* Error State

---

## Security

Validate all inputs.

Use server-side validation.

Prevent XSS.

Prevent SQL Injection.

Use Row Level Security.

---

## SEO

Generate metadata for every page.

Include:

* title
* description
* openGraph

Use JSON-LD.

---

## Performance

Image Optimization

Dynamic Imports

Server Components First

Target Lighthouse Score > 90

---

# Booking Rules

Prevent Double Booking.

Check overlapping dates before insert.

Booking Status:

pending
confirmed
cancelled
completed

Payment Status:

pending
paid
rejected

---

# File Structure

app/
components/
lib/
actions/
hooks/
types/
services/
supabase/
public/

---

# Business Rules

Villa 1

Weekday 6900 THB

Weekend 7900 THB

Villa 2

Weekday 6900 THB

Weekend 7900 THB

Maximum Guests

15

---

# Definition of Done

Feature is completed only if:

* Mobile Responsive
* Type Safe
* Tested
* Error Handling Added
* SEO Added
* Production Ready

# PUYA Marketing Team — Orchestration (Marketing Lead)

เมื่อโจให้ "หัวข้อการตลาด" มา ให้ session หลักทำหน้าที่ **Marketing Lead** และรันเป็นรอบ ("consultation loop") แทนการให้ agent ตอบแยกกันลอยๆ:

## Flow

1. **แตกโจทย์** — สรุปหัวข้อเป็นเป้าหมายเดียวที่วัดผลได้ (เกือบทุกครั้งควรผูกกับ *เพิ่ม direct booking / ลดพึ่ง OTA*)

2. **Round 1 — Research ก่อน** — เรียก `market-research` หาข้อมูล/insight ที่เกี่ยวข้องก่อน เพื่อให้รอบถัดไปตั้งอยู่บนของจริง ไม่ใช่การเดา

3. **Round 2 — Specialist ทำงานขนาน** — ส่ง insight จาก research ให้ `seo-content-strategist`, `brand-storybrand`, `social-ads-line`, `direct-booking-cro` ตามที่เกี่ยวข้องกับหัวข้อ (ไม่จำเป็นต้องเรียกครบทุกตัวทุกครั้ง — เลือกเฉพาะที่เกี่ยว)

4. **Round 3 — Cross-consult (หัวใจของทีม)** — เอา output ของ agent หนึ่งไปให้อีก agent วิจารณ์/เสริม เช่น:
   - keyword จาก SEO → ส่งให้ `brand-storybrand` ทอเข้า copy
   - messaging จาก brand → ส่งให้ `social-ads-line` ทำ caption/ad ให้ tone เดียวกัน
   - offer จาก `direct-booking-cro` → ส่งให้ SEO/brand เช็คว่าสื่อบนเว็บได้จริง
   ทำ 1–2 รอบพอ อย่าวนจน token บาน

5. **สังเคราะห์** — Lead รวมทุกอย่างเป็น **แผนเดียว** ที่ลงมือทำได้: ทำอะไร, บนหน้าไหน/ช่องไหน, ใคร(agent)รับผิดชอบ, ผลที่คาดหวัง ปิดท้ายด้วย next action ที่ชัด

## กติกาของ Lead
- ทุกข้อเสนอต้องตอบคำถาม "อันนี้ช่วยเพิ่มการจองตรงยังไง"
- ถ้า agent เห็นไม่ตรงกัน ให้ Lead ตัดสินโดยอิง insight จาก research ไม่ใช่เลือกอันที่เสียงดังกว่า
- ตอบกระชับ ภาษาไทยผสมอังกฤษ tone อบอุ่นแต่โปร ตาม preference ของโจ
- ไม่ต้องเรียก agent ครบทุกตัวถ้าหัวข้อแคบ — เลือกให้เหมาะ ประหยัด token