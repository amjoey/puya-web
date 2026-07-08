-- ============================================
-- PUYA BEACH VILLA — Consolidated Setup Script
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)
-- on a fresh project. Combines DATABASE_SCHEMA.sql (corrected — the source
-- file had stray markdown code-fence lines left over from how it was
-- originally authored, which are invalid SQL) with the two RLS/storage
-- migrations, in the order they must run.
-- ============================================

-- ============================================
-- SCHEMA (from DATABASE_SCHEMA.sql)
-- ============================================

create extension if not exists "uuid-ossp";

create table villas (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null,
  slug varchar(100) unique not null,
  description text,
  capacity integer not null default 15,

  weekday_price numeric(10,2) not null,
  weekend_price numeric(10,2) not null,

  cover_image text,
  active boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table bookings (
  id uuid primary key default uuid_generate_v4(),

  villa_id uuid not null
    references villas(id)
    on delete cascade,

  customer_name varchar(255) not null,
  phone varchar(50) not null,
  line_id varchar(100),
  email varchar(255),

  guest_count integer default 1,

  check_in date not null,
  check_out date not null,

  total_nights integer not null,
  total_price numeric(10,2) not null,

  payment_status varchar(50) default 'pending',
  booking_status varchar(50) default 'pending',

  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table payments (
  id uuid primary key default uuid_generate_v4(),

  booking_id uuid not null
    references bookings(id)
    on delete cascade,

  amount numeric(10,2) not null,

  slip_image text,

  verified boolean default false,
  verified_at timestamptz,
  verified_by uuid,

  remarks text,

  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default uuid_generate_v4(),

  villa_id uuid not null
    references villas(id)
    on delete cascade,

  customer_name varchar(255) not null,

  rating integer not null
    check (rating between 1 and 5),

  comment text,
  image_url text,

  approved boolean default false,

  created_at timestamptz default now()
);

create table promotions (
  id uuid primary key default uuid_generate_v4(),

  title varchar(255) not null,
  description text,

  discount_type varchar(50) not null,
  discount_value numeric(10,2) not null,

  start_date date,
  end_date date,

  active boolean default true,

  created_at timestamptz default now()
);

create table admins (
  id uuid primary key,

  email varchar(255) unique not null,
  role varchar(50) default 'admin',

  created_at timestamptz default now()
);

create table blocked_dates (
  id uuid primary key default uuid_generate_v4(),

  villa_id uuid
    references villas(id)
    on delete cascade,

  blocked_date date not null,
  reason text,

  created_at timestamptz default now()
);

create index idx_bookings_dates on bookings(check_in, check_out);
create index idx_bookings_villa on bookings(villa_id);
create index idx_reviews_villa on reviews(villa_id);
create index idx_payments_booking on payments(booking_id);

insert into villas
  (name, slug, capacity, weekday_price, weekend_price)
values
  ('Villa 1', 'villa-1', 15, 6900, 7900),
  ('Villa 2', 'villa-2', 15, 6900, 7900);

-- ============================================
-- RLS POLICIES (from supabase/migrations/0001_enable_rls.sql)
-- ============================================

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

alter table bookings enable row level security;

create policy "bookings_all_admin"
on bookings for all
to authenticated
using (is_admin())
with check (is_admin());

alter table payments enable row level security;

create policy "payments_all_admin"
on payments for all
to authenticated
using (is_admin())
with check (is_admin());

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

-- ============================================
-- STORAGE (from supabase/migrations/0002_storage_payment_slips.sql)
-- ============================================

insert into storage.buckets (id, name, public)
values ('payment-slips', 'payment-slips', false)
on conflict (id) do nothing;

create policy "payment_slips_select_admin"
on storage.objects for select
to authenticated
using (
  bucket_id = 'payment-slips'
  and is_admin()
);
