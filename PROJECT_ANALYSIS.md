# PROJECT_ANALYSIS.md — PUYA Beach Villa

Synthesis of `PRD.md`, `DATABASE_SCHEMA.sql`, `CLAUDE.md`, `TASKS.md`, `ARCHITECTURE.md`, and `UI_UX_SPEC.md`, produced before any implementation begins.

---

## 1. Business Requirements

**Product.** PUYA Beach Villa is a direct-booking website (v1.0) for two identical luxury beachfront private-pool villas, plus an admin dashboard to manage bookings, payments, reviews, and promotions without relying on third-party OTA platforms.

**Audiences.**
- **Guests** — tourists/groups looking for beachfront villa stays.
- **Admins** — property managers handling bookings, payment verification, and reporting.

**Core guest flow.**
Home → Villa Detail (gallery, facilities, pricing, availability calendar, reviews) → 6-step booking:
1. Select villa + check-in/check-out dates
2. Enter guest info (name, phone, LINE ID, email, guest count)
3. Auto price calculation (nights × weekday/weekend rate)
4. Booking created with status `pending` ("Pending Payment")
5. Upload PromptPay payment slip (JPG/PNG/WEBP)
6. Admin verifies slip → booking becomes `confirmed`

**Supporting guest-facing features.**
- Availability calendar: monthly, color-coded (green/available, yellow/pending, red/booked), real-time, prevents double booking.
- Reviews: guest name, 1–5 rating, comment, photo; admin approval required before public display.
- Promotions: title, description, discount type (percentage/fixed), date range, active flag; global (not per-villa), shown on home + detail pages.
- Contact page: phone, LINE OA, Google Map embed, Facebook link, business hours.

**Admin features.**
- Dashboard KPIs: total bookings, today's revenue, monthly revenue, occupancy rate, pending payments, recent bookings.
- Booking management: view/search/filter/edit/cancel/update status.
- Calendar management: block/unblock dates, manual reservation entry.
- Payment verification: view slip, approve/reject, add notes.
- Review moderation: approve/reject/delete.
- Promotion CRUD.
- Reports: revenue (daily/monthly/yearly), occupancy (per villa/month/year).

**Property facts.** Villa 1 and Villa 2, both capacity 15, weekday (Sun–Thu) 6,900 THB/night, weekend (Fri–Sat) 7,900 THB/night.

**Non-functional requirements.** Page load < 3s, Lighthouse > 90, SEO-friendly, mobile-first responsive, HTTPS, input validation, SQL-injection protection, auth + RBAC.

**v1 integrations.** Supabase (Auth, Storage), PromptPay QR, Google Maps, LINE contact button.

**Explicitly out of scope for v1 (Roadmap v2).** Google Calendar sync, LINE OA push notifications, email notifications, Facebook Pixel, Google Analytics, coupon system, dynamic/seasonal pricing, AI chat assistant.

**Success metrics / Launch KPIs.** 70% occupancy, 300,000 THB/month revenue, 4.8+ average review rating, 3%+ conversion rate.

---

## 2. Technical Architecture

**Stack.**
- Frontend: Next.js 15, React 19, TypeScript (strict mode, no `any`, interfaces required), TailwindCSS, Shadcn/UI, React Hook Form, Zod.
- Backend: Supabase (PostgreSQL, Auth, Storage, Row Level Security).
- Hosting/CI-CD: Vercel, auto-deploy from GitHub.

**System flow.**
```
Browser (public site + booking + admin dashboard)
   → Next.js 15 (Server Components, Server Actions, Route Handlers, Middleware)
   → Supabase (Postgres, Auth, Storage, Realtime)
   → External services (PromptPay QR, Google Maps, LINE OA, [v2] Google Calendar)
```

**Layered design.**
| Layer | Responsibility | Location |
|---|---|---|
| Presentation | UI, forms, navigation | `/components` |
| Business | Booking logic, pricing, availability, payment validation | `/services` (`booking`, `payment`, `review`, `promotion`, `pricing`, `availability`) |
| Data | DB queries via repository pattern | `/repositories` (`booking`, `payment`, `review`, `promotion`, `villa`) |
| Infrastructure | Supabase client, auth, storage, constants, validators | `/lib` |

**Folder structure** (per `ARCHITECTURE.md`/`CLAUDE.md`): `app/(public)/...`, `app/admin/...`, `app/api/`, `components/{ui,common,booking,calendar,villa,review,dashboard}`, `actions/`, `services/`, `repositories/`, `lib/`, `types/`, `public/`.

**Key business rules enforced at the architecture level.**
- Double-booking prevention: reject if `check_in < existing_check_out AND check_out > existing_check_in`.
- `booking_status`: `pending | confirmed | cancelled | completed`.
- `payment_status`: `pending | paid | rejected`.
- Pricing: flat weekday/weekend rate today; service layer (`pricing.service.ts`) is the seam for seasonal/holiday rates later.

**Auth & RBAC.** Supabase Auth covers **admin and super_admin only** in v1. Guests remain anonymous/stateless — identified solely by the contact fields stored directly on the `bookings` row (name, phone, LINE ID, email). No guest account, login, or session is required to book, upload a payment slip, or submit a review. The "guest" role mentioned in RBAC docs is informal (i.e., "not an admin"), not a real Supabase Auth role in v1.

**Environment variables.** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `GOOGLE_MAPS_API_KEY`, `LINE_OA_CHANNEL_ID`, `LINE_OA_ACCESS_TOKEN`.

**Scalability.** Schema is designed to grow from 2 villas to 10+ without structural changes (everything keys off `villa_id`).

**Monitoring.** Vercel Analytics + Supabase logs in v1; Sentry deferred.

---

## 3. Database Summary

PostgreSQL via Supabase, `uuid-ossp` extension, 7 tables, UUID primary keys throughout.

| Table | Purpose | Key columns | FKs | Indexes |
|---|---|---|---|---|
| `villas` | Property catalog | `slug` (unique), `capacity`, `weekday_price`, `weekend_price`, `active` | — | — |
| `bookings` | Guest reservations | `customer_name`, `phone`, `line_id`, `email`, `check_in`/`check_out` (date), `total_nights`, `total_price`, `payment_status`, `booking_status` | `villa_id → villas` (cascade) | `(check_in, check_out)`, `villa_id` |
| `payments` | Slip upload + verification | `amount`, `slip_image`, `verified`, `verified_at`, `verified_by`, `remarks` | `booking_id → bookings` (cascade) | `booking_id` |
| `reviews` | Guest ratings | `rating` (CHECK 1–5), `comment`, `image_url`, `approved` | `villa_id → villas` (cascade) | `villa_id` |
| `promotions` | Discounts | `discount_type`, `discount_value`, `start_date`/`end_date`, `active` | — (global, no villa link) | — |
| `admins` | Staff accounts | `email` (unique), `role` | id = Supabase Auth user id (no default) | — |
| `blocked_dates` | Manual calendar blocks | `blocked_date`, `reason` | `villa_id → villas` (cascade, nullable) | — |

Seed data: Villa 1 and Villa 2, both `capacity=15`, `weekday_price=6900`, `weekend_price=7900`.

**Identified gaps and proposed fixes** (to apply to `DATABASE_SCHEMA.sql` in a follow-up task — not changed by this analysis):

| Gap | Proposed fix |
|---|---|
| `payments.verified_by` has no FK to `admins` | Add `verified_by uuid references admins(id) on delete set null` |
| `reviews` has no link to a real stay, so review authenticity can't be verified | Add nullable `booking_id uuid references bookings(id) on delete set null` — nullable because submission isn't gated on login, but allows linking when the booking is known (e.g. a post-stay review link) |
| `bookings.payment_status` and `payments.verified` can drift out of sync — no defined source of truth | Treat `payments.verified` as source of truth; the payment-verification service action keeps `bookings.payment_status` in sync (`'paid'` when `verified=true`, `'rejected'` on admin rejection). Enforced in the service layer, not a DB trigger, in v1 |
| No admin audit trail on review moderation | Add `approved_by uuid references admins(id)`, `approved_at timestamptz` to `reviews` |
| `blocked_dates.villa_id` nullable with undocumented meaning | Document explicitly: `NULL` = global block affecting all villas (e.g. owner closure); non-null = villa-specific block |
| No constraint stopping `guest_count` from exceeding villa `capacity` | Enforce in Zod schema + service layer at booking-creation time (a DB CHECK can't reference another table's column directly) |
| Check-out/turnover semantics undocumented | Adopt standard hotel convention: `check_out` is the departure date and is not itself occupied — a new booking may start `check_in` on that same date |

No contradictions were found between the database schema and the other five documents — design tokens, pricing, and capacity figures match everywhere they're stated.

---

## 4. UI/UX Summary

**Design language.** Minimal Luxury Beachfront / Modern Tropical: large photography, soft shadows, rounded corners, generous whitespace. Mobile-first, breakpoints at 375px / 768px / 1440px.

**Design tokens.**
- Colors: Primary `#0EA5E9`, Primary Hover `#0284C7`, Background `#FFFFFF`, Surface `#F8FAFC`, Text `#0F172A`, Border `#E2E8F0`, Success `#22C55E`, Warning `#FACC15`, Danger `#EF4444`.
- Typography: H1 48px Bold, H2 36px SemiBold, H3 24px Medium, Body 16px Regular, Caption 14px Regular. Fonts: Inter, Geist, Noto Sans Thai.
- Buttons: 48px height, 12px radius; primary = "Book Now", secondary = outline "View Details".

**Page specs.**
- **Home**: full-viewport hero with CTAs; 2-col (desktop)/1-col (mobile) villa cards; 6-icon facilities grid; horizontal review cards; promotion cards.
- **Villa Detail**: hero + thumbnail gallery (swipe on mobile); facilities/description/pricing; monthly availability calendar (green/yellow/red); sticky booking CTA on mobile.
- **Booking**: 5-step indicator (villa → dates → guest info → payment → confirmation) with a persistent price-summary card.
- **Payment**: PromptPay QR + slip upload + submit.
- **Reviews / Promotions / Contact**: list/grid views; contact page embeds Google Map plus phone/LINE/Facebook links and hours.

**Admin dashboard.** Sidebar nav (Dashboard, Bookings, Payments, Reviews, Promotions, Reports, Settings); KPI cards; searchable/filterable booking table with CSV export; payment slip preview with approve/reject + notes; revenue/occupancy charts.

**UX patterns.** Inline form validation, loading/empty/error states on every page, skeleton loaders, toast notifications, confirmation dialogs. Framer Motion for subtle 200–300ms transitions only. Accessibility: AA contrast, ARIA labels, keyboard navigation, 44px minimum tap targets. Conversion goal: booking reachable in ≤3 clicks, targeting 3%+ conversion.

---

## 5. Development Phases

From `TASKS.md`, 12 sequential phases plus a deferred v2 bucket:

1. **Project Setup** — Next.js 15, TypeScript, Tailwind, Shadcn, ESLint/Prettier, Supabase config.
2. **Database** — schema, tables, RLS policies, seed data. *(Blocks all of 3–9.)*
3. **Public Website** — home sections, villa listing/detail/gallery, availability calendar.
4. **Booking System** — form, guest info, pricing, creation, validation, double-booking prevention.
5. **Payment** — PromptPay QR, slip upload, payment record, verification. *(Coupled to Phase 4.)*
6. **Reviews** — form, rating component, moderation, listing.
7. **Promotions** — listing, detail, admin CRUD.
8. **Admin Dashboard** — KPI cards, booking/payment/review/promotion management.
9. **Reports** — daily/monthly/annual revenue, occupancy rate.
10. **SEO** — metadata, Open Graph, sitemap, robots.txt, JSON-LD.
11. **Production hardening** — error monitoring, analytics, performance audit, security audit. *(Gates Phase 12 with Phase 10.)*
12. **Launch** — deploy to Vercel, domain, SSL, production testing, go-live.

**Future (v2, deferred):** Google Calendar sync, LINE OA notifications, email notifications, Facebook Pixel, Google Analytics, coupon system, dynamic pricing, AI chat assistant.

**Phase-12 exit criteria = Launch KPIs:** 70% occupancy, 300,000 THB/month revenue, 4.8+ review rating, 3%+ conversion rate.

---

## 6. Risks and Assumptions

**Assumption locked in for this analysis:** guests are anonymous/stateless in v1 — no accounts, no login gate on booking, slip upload, or review submission. This shapes the architecture's auth boundary (Supabase Auth = admins only) and the schema decision to keep guest contact fields directly on `bookings` rather than a separate `customers` table.

**Open risks / gaps to resolve before or during implementation:**

| Risk | Phase affected | Notes |
|---|---|---|
| Pricing formula for stays spanning both weekday and weekend nights isn't spelled out numerically | Phase 4 | Need a worked example (e.g., nights priced per calendar night by day-of-week, summed) before building `pricing.service.ts` |
| Cancellation/refund policy undefined (soft vs. hard delete, refund trigger, who can cancel) | Phase 8 | No `cancelled_at`/`cancellation_reason` columns exist yet |
| RLS policies are a checklist item in `TASKS.md` but no actual policy SQL exists | Phase 2 | Must be written before any client-side Supabase queries go live, or data is unprotected |
| Storage bucket setup (names, public/private rules) for slip images, review photos, villa images undefined | Phase 1–2 | Payment slips should likely be private/admin-only; villa images public |
| Pagination defaults for admin tables/review lists unspecified | Phase 8 | Minor; pick a sane default (e.g. 20/page) during implementation |
| Lighthouse ">90" target doesn't specify which categories or device profile | Phase 11 | Clarify mobile vs. desktop, and which of Performance/Accessibility/Best Practices/SEO count |
| Schema gaps listed in Section 3 (FK on `verified_by`, review-booking link, payment_status sync, audit fields, blocked_dates semantics, guest_count constraint, turnover convention) | Phase 2 | Fixes proposed above; apply as a schema migration before Phase 3 begins |

**Cross-document consistency check:** no contradictions were found between `PRD.md`, `ARCHITECTURE.md`, `CLAUDE.md`, `DATABASE_SCHEMA.sql`, `UI_UX_SPEC.md`, and `TASKS.md` — pricing figures, capacity, and design tokens match across every file. The items above are gaps/omissions to fill in, not conflicts to reconcile.
