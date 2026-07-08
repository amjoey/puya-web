# PROJECT_AUDIT.md

Audit of the PUYA Beach Villa implementation against `PRD.md`, `CLAUDE.md`, `TASKS.md`, `ARCHITECTURE.md`, and `UI_UX_SPEC.md`.

Method: four parallel research passes (security, missing features, bugs/code quality, performance) followed by direct verification of every flagged file. Findings below are marked **Fixed** (changed in this pass), **Deferred** (documented gap, not fixed — with reason), or **No issue** (flagged by research but verified clean on inspection).

Every item created in this pass follows the same standing project convention: real, production-shaped code against the actual repository → service → action → component layers — not yet runnable, since Phase 1 (`package.json`/install) and Phase 2 (live Supabase project) are still pending.

---

## 1. Missing Features

| # | Gap | Status | Notes |
|---|---|---|---|
| 1 | `/villas` listing page was an empty stub | **Fixed** | Built using `VillaCard` + demo data, same pattern as the Home page's Villas section. |
| 2 | `/promotions` listing page was an empty stub | **Fixed** | Built using `PromotionCard` + demo data. |
| 3 | `/reviews` listing page was an empty stub | **Fixed** | Built using `ReviewCard` + demo data for display, plus a real submission form (see #5). |
| 4 | `/contact` page, `ContactInfo`, `MapEmbed` were empty stubs | **Fixed** | `ContactInfo` renders phone/LINE/Facebook/hours/address from `lib/constants/contact.ts`; `MapEmbed` uses a no-API-key Google Maps iframe embed (`GOOGLE_MAPS_API_KEY` is unset, so the API-key-based embed is deferred). |
| 5 | Guest review submission (`ReviewForm`, `submitReview` action) was entirely stubbed | **Fixed** | `services/review.service.ts` gained `submitReview()` (forces `approved: false` server-side, defense in depth alongside the RLS check-constraint); `actions/review.actions.ts` wired with Zod validation; `ReviewForm` built with `react-hook-form` + an interactive star picker. **Sub-gap deferred**: photo upload — `reviewFormSchema.imageUrl` accepts a URL but there's no review-photo Storage bucket or upload UI yet (no spec doc defines the bucket policy, and it's a non-trivial addition); guests can submit rating + comment only for now. |
| 6 | `Navbar` and `Footer` were empty stubs — the entire public site had **no navigation at all** | **Fixed** | Built both and wired into `app/(public)/layout.tsx`. This was the highest-impact gap found: every public page was previously unreachable except by typing a URL directly. |
| 7 | `/booking/[bookingId]/confirmation` was an empty stub | **Fixed** | Built using the same capability-token read pattern as the payment page (service-role client, booking UUID as the access token). Shows booking summary + a "Complete Payment" CTA if unpaid. |
| 8 | Admin booking detail/edit page (`/admin/bookings/[id]`) was an empty stub, and also had a Next.js 15 bug (see §2) | **Fixed** | Built guest/booking detail view + a status-update form (`BookingEditForm`), wired to a newly-implemented `updateBookingStatus` action. Linked from the bookings list ("View"). |
| 9 | `updateBookingStatus` Server Action was a no-op stub with zero call sites | **Fixed** | Implemented: Zod-validated, `requireAdmin()`-gated, updates `booking_status`/`payment_status`/`notes`. |
| 10 | Admin calendar management (`/admin/calendar`) — block/unblock dates — was an empty stub, despite the repository layer (`blockedDate.repository.ts`) already existing and the availability engine already consulting it | **Fixed** | Built `services/blockedDate.service.ts`, `actions/blockedDate.actions.ts`, `BlockedDateManager` component, and the page. Verified `services/availability.service.ts` already factors blocked dates into both `getMonthlyAvailability` and `isRangeAvailable`, so this wasn't cosmetic — the public calendar/booking flow immediately respects whatever admins block. |
| 11 | Admin settings (`/admin/settings`) was an empty stub | **Fixed (minimal)** | Built a minimal profile view (current admin's email/role) since no spec doc defines a broader settings scope. Admin invite/role management is **deferred** — not specified anywhere and would need its own design. |
| 12 | Dead component stubs: `BookingForm.tsx`, `MobileBookingBar.tsx`, `OccupancyChart.tsx` | **Fixed (removed)** | Verified zero real imports of each (confirmed via exact import-path grep, not substring match). `BookingForm` was superseded by `BookingWizard`'s step components; `MobileBookingBar` by the inline sticky CTA on the villa detail page; `OccupancyChart` by the reports page's table view. Deleted rather than left as permanent dead code. |

**Already-known infrastructure gaps** (intentional, not re-litigated here): no `package.json`/installed dependencies (Phase 1), no live Supabase project/seeded data (Phase 2), guests are intentionally anonymous (no guest auth), PromptPay QR is an intentional placeholder, reports use tables instead of charts (no charting library installed).

---

## 2. Bugs

| # | Bug | Severity | Status |
|---|---|---|---|
| 1 | `app/admin/bookings/[id]/page.tsx` typed `params` synchronously (`{ id: string }`) instead of `Promise<{ id: string }>` — a Next.js 15 breaking pattern (this was also true of the booking confirmation page, already fixed during the SEO pass last turn) | High | **Fixed** — rebuilt the page with `Promise<{ id: string }>` + `await params`. |
| 2 | `lib/validators/promotion.schema.ts`'s date refine allowed a half-set range (e.g. `startDate` set, `endDate` empty) to pass validation silently | Medium | **Fixed** — added a refine requiring both dates set or both empty. |
| 3 | `repositories/promotion.repository.ts` blind-cast `row.discount_type as DiscountType` with no runtime check — a corrupted/unexpected DB value would silently mistype rather than fail loudly | Medium | **Fixed** — added `toDiscountType()`, which throws on an unrecognized value instead of casting blindly. |
| 4 | `bookingFormSchema.guestCount` had no upper bound at the schema layer (only checked later against the specific villa's capacity in `booking.service.ts`) | Low | **Fixed** — added `.max(DEFAULT_VILLA_CAPACITY)` as a sanity cap; the authoritative per-villa check in the service layer is unchanged and still the real enforcement point. |
| 5 | `actions/review.actions.ts`'s `submitReview()` was a no-op stub — calling it from a UI would silently do nothing | High (functional) | **Fixed** — see Missing Features #5. |

**No issue found** (flagged by initial research, verified clean): `useActionState` signatures across the codebase; client/server component boundaries (`"use client"` placement); repository pattern adherence (no component bypasses repositories/services to call Supabase directly); camelCase/snake_case boundary integrity between domain types and DB rows.

---

## 3. Security Issues

A dedicated research pass covered RLS policies, service-role client usage, admin-authorization coverage on every mutating Server Action, input validation, XSS, secrets handling, SQL injection, file-upload validation, and middleware route matching.

**No critical or high-severity issues found.** Specifically verified:

- Every admin-only Server Action (`verifyPayment`, `rejectPayment`, `approveReview`, `rejectReview`, `deleteReview`, `createPromotion`, `updatePromotion`, `deletePromotion`, `togglePromotionActive`, `cancelBooking`, and the two new ones added this pass — `updateBookingStatus`, `createBlockedDate`/`deleteBlockedDate`) calls `requireAdmin()` server-side before mutating, independent of any UI-level gating.
- RLS policies in `supabase/migrations/0001_enable_rls.sql` correctly restrict `bookings`/`payments`/`admins` to admin-only access, with deliberate, narrow anon exceptions (active villas/promotions, approved reviews, all blocked dates for calendar display, and anon review *insert* forced to `approved: false` by RLS).
- `SUPABASE_SERVICE_ROLE_KEY` is only referenced in `lib/supabase/service.ts`, which is server-only and never imported by a `"use client"` file.
- The only `dangerouslySetInnerHTML` usages are fully static JSON-LD (Home page, Villa Detail page) — no user/DB-derived content is injected unsanitized.
- All repositories use the Supabase query builder exclusively — no raw SQL string interpolation anywhere.
- Payment slip uploads validate MIME type and file size server-side (`lib/validators/payment.schema.ts`), not just via the client-side `accept` attribute.
- The root `middleware.ts` matcher (`/admin/:path*`) covers every nested admin route, and `lib/supabase/middleware.ts` checks both "has a session" and "is a row in `admins`" before allowing access.

**Minor note (no fix needed):** the guest booking/payment/confirmation pages rely on an unguessable booking UUID as a de facto capability token (since guests have no auth session). This is a deliberate, documented trade-off from earlier in the project, not a new finding — flagged here only for completeness.

---

## 4. Performance Issues

| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | `app/admin/payments/page.tsx` fetched each payment's booking, then villa, then signed slip URL **sequentially inside a per-row loop** — for N pending payments this was roughly `1 + 2N` to `1 + 3N` round trips | High | **Fixed** — added `listBookingsByIds()` and `listVillasByIds()` (batch lookups via `.in("id", ids)`) to the booking/villa repositories, and `getPaymentSlipSignedUrls()` (batch, via Supabase Storage's `createSignedUrls`) to `lib/supabase/storage.ts` + `services/payment.service.ts`. The page now does exactly 3 queries total regardless of row count, then joins in memory via `Map` lookups. |
| 2 | `components/dashboard/BookingManagementTable.tsx` recomputed its filtered list on every render with no memoization — re-filters the full booking list on every keystroke | Low | **Fixed** — wrapped in `useMemo([bookings, query])`. |
| 3 | `components/dashboard/PaymentVerificationPanel.tsx` used a raw `<img>` for the (real, remote) payment-slip signed URL — skips Next's lazy loading/optimization | Medium | **Fixed** — added `next.config.ts` with a `remotePatterns` entry derived from `NEXT_PUBLIC_SUPABASE_URL`, and switched to `next/image`. |
| 4 | `app/admin/dashboard/page.tsx` and `app/admin/reports/page.tsx` compute KPIs/reports by fetching **all** bookings via `listAllBookings()` (no pagination) and reducing in JS | Medium | **Deferred** — confirmed there's no `.limit()` clause, so this is correct (not silently truncating) at current and near-term data volumes for a 2-villa property, but won't scale past a few thousand bookings. Already flagged with an inline comment from the turn it was built; moving to a server-side aggregate (SQL `GROUP BY` or an RPC) is the right fix once booking volume actually grows — premature to build now. |
| 5 | `components/villa/VillaGallery.tsx`, `VillaCard.tsx`, `ReviewCard.tsx`, `HeroSection.tsx` all use raw `<img>` for demo SVG placeholder content | Low | **Deferred** — all four are consistently demo/placeholder SVGs (not real photography yet). Converting to `next/image` for these specifically would require enabling `dangerouslyAllowSVG` (a real security trade-off for marginal benefit on throwaway vector placeholders) or gains nothing since SVGs aren't raster-optimized anyway. Fixing only some of these four and not others would itself be an inconsistency; correct fix is to convert all four together once real photography assets replace the placeholders. |
| 6 | Villa detail page's `generateStaticParams` exists, but `AvailabilityCalendar` (a Server Component child) reads live Supabase data per request, forcing the whole page dynamic despite the static-generation setup | Low | **Deferred** — harmless today (no live Supabase project exists yet to make this observable), but worth an ISR/ ` Suspense`-boundary refactor once real traffic exists. Documented here so it isn't forgotten. |

**No issue found:** font loading (`display: "swap"` already correctly set on both `next/font/google` fonts); `"use client"` boundary placement (all interactive components justified by actual hooks/handlers; no Server-Component-eligible component was needlessly marked client).

---

## 5. Code Quality Issues

| # | Issue | Status |
|---|---|---|
| 1 | `discount_type` cast without validation (see Bugs #3) | **Fixed** |
| 2 | Promotion date refine logic gap (see Bugs #2) | **Fixed** |
| 3 | Orphaned `updateBookingStatus`/`submitReview` stubs with zero call sites | **Fixed** — both implemented and wired to real UI. |
| 4 | Dead component files with zero imports (`BookingForm.tsx`, `MobileBookingBar.tsx`, `OccupancyChart.tsx`) | **Fixed** — removed. |
| 5 | Stale code comment in `app/admin/reports/page.tsx` referencing `OccupancyChart.tsx` after its removal | **Fixed** — comment updated. |
| 6 | `repositories/blockedDate.repository.ts` uses PostgREST `.or("villa_id.eq.X,villa_id.is.null")` filter syntax | **No issue** — this is the standard, safe way to express that OR condition via the Supabase query builder; not raw SQL, not a vulnerability, just slightly less common syntax than chained `.eq()`/`.is()`. Left as-is. |

**No issue found** (verified clean): zero `any` usage anywhere in the codebase; every `page.tsx`/`layout.tsx` under `app/` correctly types and awaits `params`/`searchParams` as `Promise<...>` (Next.js 15 convention) — the one exception found (admin booking detail page) is fixed above; no component reaches past the repository/service/action layers to call Supabase directly; domain types (camelCase) and DB row types (snake_case) stay correctly separated at the repository boundary.

---

## Summary

| Category | Found | Fixed | Deferred (documented) |
|---|---|---|---|
| Missing features | 12 | 12 (1 partial — review photo upload) | 0 |
| Bugs | 5 | 5 | 0 |
| Security | 0 | — | — |
| Performance | 6 | 3 | 3 |
| Code quality | 6 | 5 | 0 (1 was a non-issue) |

Every deferral above has an explicit reason (premature optimization, inherent trade-off, or a real scope decision pending a spec that doesn't exist yet) rather than being silently dropped.
