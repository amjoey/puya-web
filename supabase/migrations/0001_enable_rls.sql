-- ============================================
-- PUYA BEACH VILLA — Row Level Security Policies
-- Applies on top of DATABASE_SCHEMA.sql
-- ============================================
--
-- Access model (see PROJECT_ANALYSIS.md, Architecture > Auth & RBAC):
--   - Guests are anonymous in v1: no Supabase Auth session, no "guest" role.
--     Higher-risk guest writes (create booking, create payment record) have
--     NO anon policy here on purpose — they go through Server Actions using
--     the service-role client (lib/supabase/service.ts), which bypasses RLS.
--     The Server Action's Zod validation + availability check is the trust
--     boundary for those writes, not RLS.
--   - Lower-risk guest writes (submitting a review, which stays hidden until
--     an admin approves it) are allowed directly from the anon role.
--   - Admins authenticate via Supabase Auth; is_admin()/is_super_admin()
--     below check the admins table by auth.uid().

-- ----------------------------------------------------------
-- Helpers (security definer: bypass RLS for their own lookup,
-- which also avoids recursive policy evaluation on `admins`)
-- ----------------------------------------------------------
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admins where id = auth.uid()
  );
$$;

create or replace function is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admins where id = auth.uid() and role = 'super_admin'
  );
$$;

-- ----------------------------------------------------------
-- villas — public catalog data
-- ----------------------------------------------------------
alter table villas enable row level security;

create policy "villas_select_active_public"
on villas for select
to anon, authenticated
using (active = true);

create policy "villas_all_admin"
on villas for all
to authenticated
using (is_admin())
with check (is_admin());

-- ----------------------------------------------------------
-- bookings — contains guest PII; no direct public access.
-- Guest booking creation runs server-side via the service-role client
-- (see actions/booking.actions.ts, services/availability.service.ts).
-- ----------------------------------------------------------
alter table bookings enable row level security;

create policy "bookings_all_admin"
on bookings for all
to authenticated
using (is_admin())
with check (is_admin());

-- ----------------------------------------------------------
-- payments — slip images + verification state; admin-only access.
-- Payment record creation runs server-side via the service-role client
-- (see actions/payment.actions.ts).
-- ----------------------------------------------------------
alter table payments enable row level security;

create policy "payments_all_admin"
on payments for all
to authenticated
using (is_admin())
with check (is_admin());

-- ----------------------------------------------------------
-- reviews — public can read approved reviews and submit new ones
-- ----------------------------------------------------------
alter table reviews enable row level security;

create policy "reviews_select_approved_public"
on reviews for select
to anon, authenticated
using (approved = true);

create policy "reviews_insert_public"
on reviews for insert
to anon, authenticated
with check (approved = false);

create policy "reviews_select_all_admin"
on reviews for select
to authenticated
using (is_admin());

create policy "reviews_update_admin"
on reviews for update
to authenticated
using (is_admin())
with check (is_admin());

create policy "reviews_delete_admin"
on reviews for delete
to authenticated
using (is_admin());

-- ----------------------------------------------------------
-- promotions — public can read active promotions
-- ----------------------------------------------------------
alter table promotions enable row level security;

create policy "promotions_select_active_public"
on promotions for select
to anon, authenticated
using (active = true);

create policy "promotions_all_admin"
on promotions for all
to authenticated
using (is_admin())
with check (is_admin());

-- ----------------------------------------------------------
-- admins — no public access; admins can read their own row,
-- only super_admin can manage the admins table
-- ----------------------------------------------------------
alter table admins enable row level security;

create policy "admins_select_self"
on admins for select
to authenticated
using (id = auth.uid());

create policy "admins_manage_super_admin"
on admins for all
to authenticated
using (is_super_admin())
with check (is_super_admin());

-- ----------------------------------------------------------
-- blocked_dates — public needs to see blocks to render availability
-- ----------------------------------------------------------
alter table blocked_dates enable row level security;

create policy "blocked_dates_select_public"
on blocked_dates for select
to anon, authenticated
using (true);

create policy "blocked_dates_all_admin"
on blocked_dates for all
to authenticated
using (is_admin())
with check (is_admin());
