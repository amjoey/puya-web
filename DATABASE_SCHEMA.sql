-- ============================================
-- PUYA BEACH VILLA
-- Production Database Schema
-- PostgreSQL / Supabase
-- ============================================

create extension if not exists "uuid-ossp";

-- ============================================
-- VILLAS
-- ============================================

create table villas (
id uuid primary key default uuid_generate_v4(),
name varchar(100) not null,
slug varchar(100) unique not null,
description text,
capacity integer not null default 15,

```
weekday_price numeric(10,2) not null,
weekend_price numeric(10,2) not null,

cover_image text,
active boolean default true,

created_at timestamptz default now(),
updated_at timestamptz default now()
```

);

-- ============================================
-- BOOKINGS
-- ============================================

create table bookings (
id uuid primary key default uuid_generate_v4(),

```
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

payment_status varchar(50)
default 'pending',

booking_status varchar(50)
default 'pending',

notes text,

created_at timestamptz default now(),
updated_at timestamptz default now()
```

);

-- ============================================
-- PAYMENTS
-- ============================================

create table payments (
id uuid primary key default uuid_generate_v4(),

```
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
```

);

-- ============================================
-- REVIEWS
-- ============================================

create table reviews (
id uuid primary key default uuid_generate_v4(),

```
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
```

);

-- ============================================
-- PROMOTIONS
-- ============================================

create table promotions (
id uuid primary key default uuid_generate_v4(),

```
title varchar(255) not null,

description text,

discount_type varchar(50) not null,

discount_value numeric(10,2) not null,

start_date date,

end_date date,

active boolean default true,

created_at timestamptz default now()
```

);

-- ============================================
-- ADMINS
-- ============================================

create table admins (
id uuid primary key,

```
email varchar(255) unique not null,

role varchar(50)
default 'admin',

created_at timestamptz default now()
```

);

-- ============================================
-- VILLA IMAGES (Gallery)
-- ============================================

create table villa_images (
id uuid primary key default uuid_generate_v4(),

```
villa_id uuid not null
references villas(id)
on delete cascade,

storage_path text not null,

sort_order integer not null default 0,

created_at timestamptz default now()
```

);

-- ============================================
-- BLOCKED DATES
-- ============================================

create table blocked_dates (
id uuid primary key default uuid_generate_v4(),

```
villa_id uuid
references villas(id)
on delete cascade,

blocked_date date not null,

reason text,

created_at timestamptz default now()
```

);

-- ============================================
-- INDEXES
-- ============================================

create index idx_bookings_dates
on bookings(check_in, check_out);

create index idx_bookings_villa
on bookings(villa_id);

create index idx_reviews_villa
on reviews(villa_id);

create index idx_payments_booking
on payments(booking_id);

create index idx_villa_images_villa
on villa_images(villa_id, sort_order);

-- ============================================
-- SEED DATA
-- ============================================

insert into villas
(name, slug, capacity, weekday_price, weekend_price)
values
('Villa 1', 'villa-1', 15, 6900, 7900),
('Villa 2', 'villa-2', 15, 6900, 7900);
