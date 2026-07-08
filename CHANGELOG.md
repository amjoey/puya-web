# CHANGELOG.md

Architecture review and refactor pass. **No business logic changed** — every edit below is either a structural extraction (same behavior, less duplication) or an additive validation/robustness improvement. Existing return shapes, error messages, redirects, and RLS/authorization boundaries are unchanged.

## Refactored — Duplicated Code

- **`lib/constants/bookingStatus.ts` (new)** — extracted the booking-status → badge-color mapping that was hand-copied identically in `BookingTable.tsx` and `BookingManagementTable.tsx`. Both now import `BOOKING_STATUS_BADGE_VARIANT`; a third admin view added later can't silently drift from the other two.

- **`lib/utils/actionError.ts` (new)** — extracted the `catch (error) { if (error instanceof X) return error.message; return fallback; }` shape that was repeated, with identical structure, in **15 places** across all 5 Server Action files (`booking`, `payment`, `review`, `promotion`, `blockedDate`). Replaced with `toActionError(error, fallbackMessage, knownErrorTypes)`. Same messages, same behavior — internal error details still never reach the client (any error not in the known-types list still collapses to the generic fallback).

- **`lib/utils/validation.ts` (new)** — extracted the "validate with Zod, return `{ success: false, error: 'Please check the highlighted fields.', fieldErrors }`" block repeated in 4 places (`createBooking`, `submitReview`, `createPromotion`, `updatePromotion`). Replaced with `parseFormInput(schema, input)`.

- **`lib/utils/safeFetch.ts` (new)** — extracted the `let data = fallback; let loadError = false; try { data = await fetch() } catch { loadError = true }` pattern repeated in **14 page/component files** (every admin page, the public booking flow, the availability calendar). Replaced with `safeFetch(fetcher, fallback)`. Grouped fetches (e.g. `Promise.all([...])` calls that need all-or-nothing error handling) pass the whole batch as one `fetcher` so a partial failure still behaves exactly as before — one fetch failing fails the whole group, not just that one value.

## Refactored — Missing Validations

- **`lib/utils/uuid.ts` (new)** — dynamic route segments that are actually database primary keys (`bookingId`, booking `id`, promotion `id`) were passed straight into a `.eq("id", value)` query with no format check. A malformed value (e.g. `/booking/not-a-uuid/payment`) previously reached the database and failed there, surfacing as a generic "unable to load" message. Added `isUuid()` and a pre-check that calls `notFound()` immediately for non-UUID values on:
  - `app/(public)/booking/[bookingId]/payment/page.tsx`
  - `app/(public)/booking/[bookingId]/confirmation/page.tsx`
  - `app/admin/bookings/[id]/page.tsx`
  - `app/admin/promotions/[id]/page.tsx`

  This is a precision/robustness fix (fail fast with the correct 404, skip a guaranteed-fail DB round trip) — it does not change what's reachable or who can access what.

- **`lib/validators/booking.schema.ts`** — `phone` previously accepted *any* 8–50 character string (e.g. `"aaaaaaaa"` would pass). Added a permissive regex (`/^[0-9+\-\s()]{8,20}$/`) that still accepts every real-world format already in use elsewhere in the app (`"+66 81 234 5678"`, `"081-234-5678"`, `"0812345678"`) while rejecting clearly-invalid input.

## Reviewed — No Changes Needed

A full pass was made over RLS policies, every Server Action's admin-authorization coverage, Supabase client usage (service-role vs. cookie-based), XSS surface (`dangerouslySetInnerHTML` usages), and SQL-injection surface. No new security issues were found beyond what was already fixed in the previous audit (`PROJECT_AUDIT.md`):

- Every mutating Server Action still calls `requireAdmin()` (or, for guest flows, validates via Zod) before touching the database — confirmed unchanged by the `toActionError` extraction, since the extraction only touched the *catch* block, never the authorization check itself.
- `repositories/blockedDate.repository.ts`'s `.or("villa_id.eq.X,villa_id.is.null")` filter was flagged by automated tooling as unusual syntax — confirmed this is the standard, safe Supabase/PostgREST way to express that condition, not a vulnerability. Left as-is.
- No raw SQL, no service-role key reachable from client code, no unsanitized user input reaching `dangerouslySetInnerHTML` (both occurrences — Home page and Villa Detail page JSON-LD — remain fully static).

**Noted but intentionally not addressed** (would require new infrastructure, not a refactor): there is no rate limiting on guest-facing write endpoints (booking creation, review submission). Both are already validated and constrained (availability checks, Zod schemas, RLS), but a determined actor could still submit many requests in a short window. Mitigating this needs request-level infrastructure (e.g. Supabase Edge Functions, a WAF rule, or an API gateway) that doesn't exist yet in this project — out of scope for a code-only refactor pass.

## Performance

No new performance issues were found beyond the N+1 query fix already shipped in the previous pass (`PROJECT_AUDIT.md`). The `safeFetch` extraction above is a maintainability change, not a performance one — it preserves the exact same number of database round trips as before, including the batched `Promise.all` calls that were already written to avoid N+1 patterns.

## Files Touched

**New files:**
`lib/constants/bookingStatus.ts`, `lib/utils/actionError.ts`, `lib/utils/validation.ts`, `lib/utils/safeFetch.ts`, `lib/utils/uuid.ts`

**Modified (refactor only, no behavior change):**
`components/dashboard/BookingTable.tsx`, `components/dashboard/BookingManagementTable.tsx`, `actions/booking.actions.ts`, `actions/payment.actions.ts`, `actions/review.actions.ts`, `actions/promotion.actions.ts`, `actions/blockedDate.actions.ts`, `app/admin/dashboard/page.tsx`, `app/admin/bookings/page.tsx`, `app/admin/bookings/[id]/page.tsx`, `app/admin/payments/page.tsx`, `app/admin/reviews/page.tsx`, `app/admin/promotions/page.tsx`, `app/admin/promotions/[id]/page.tsx`, `app/admin/reports/page.tsx`, `app/admin/calendar/page.tsx`, `app/(public)/booking/[villaSlug]/page.tsx`, `app/(public)/booking/[bookingId]/payment/page.tsx`, `app/(public)/booking/[bookingId]/confirmation/page.tsx`, `app/(public)/reviews/page.tsx`, `components/calendar/AvailabilityCalendar.tsx`

**Modified (additive validation):**
`lib/validators/booking.schema.ts`
