# ARCHITECTURE.md

# PUYA BEACH VILLA

System Architecture & Folder Structure

Version 1.0

---

# System Overview

PUYA BEACH VILLA is a modern villa booking platform designed for:

* Direct Booking
* Availability Management
* Payment Verification
* Promotion Management
* Review Management
* Revenue Reporting

Target Devices:

* Mobile
* Tablet
* Desktop

---

# High Level Architecture

Client Browser
│
├── Public Website
├── Booking System
├── Reviews
└── Admin Dashboard
│
▼

Next.js 15 Application
│
├── Server Components
├── Server Actions
├── Route Handlers
└── Middleware
│
▼

Supabase
│
├── PostgreSQL
├── Authentication
├── Storage
└── Realtime
│
▼

External Services
│
├── PromptPay QR
├── Google Maps
├── LINE OA
└── Google Calendar (V2)

---

# Application Layers

## Presentation Layer

Responsible for:

* UI Rendering
* User Interaction
* Forms
* Navigation

Technology:

* Next.js
* TailwindCSS
* Shadcn UI

---

## Business Layer

Responsible for:

* Booking Logic
* Pricing Logic
* Availability Logic
* Payment Validation

Location:

/services

---

## Data Layer

Responsible for:

* Database Operations
* Queries
* Repositories

Location:

/repositories

---

## Infrastructure Layer

Responsible for:

* Supabase
* Storage
* Authentication

Location:

/lib

---

# Folder Structure

app/
│
├── (public)
│ ├── page.tsx
│ ├── villas/
│ ├── booking/
│ ├── promotions/
│ ├── reviews/
│ └── contact/
│
├── admin/
│ ├── dashboard/
│ ├── bookings/
│ ├── payments/
│ ├── reviews/
│ └── promotions/
│
├── api/
│
└── layout.tsx

---

components/
│
├── ui/
│
├── common/
│ ├── Navbar.tsx
│ ├── Footer.tsx
│ └── SectionTitle.tsx
│
├── booking/
│ ├── BookingForm.tsx
│ ├── PriceCalculator.tsx
│ └── BookingSummary.tsx
│
├── calendar/
│ ├── AvailabilityCalendar.tsx
│ └── CalendarLegend.tsx
│
├── villa/
│ ├── VillaCard.tsx
│ ├── VillaGallery.tsx
│ └── VillaFacilities.tsx
│
├── review/
│ ├── ReviewCard.tsx
│ └── ReviewForm.tsx
│
└── dashboard/
│ ├── RevenueCard.tsx
│ ├── BookingTable.tsx
│ └── OccupancyChart.tsx

---

actions/

booking.actions.ts

payment.actions.ts

review.actions.ts

promotion.actions.ts

---

services/

booking.service.ts

payment.service.ts

review.service.ts

promotion.service.ts

pricing.service.ts

availability.service.ts

---

repositories/

booking.repository.ts

payment.repository.ts

review.repository.ts

promotion.repository.ts

villa.repository.ts

---

lib/

supabase/

auth/

utils/

constants/

validators/

---

types/

booking.ts

payment.ts

review.ts

promotion.ts

villa.ts

---

public/

images/

icons/

logos/

demo/

---

# Environment Variables

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

NEXT_PUBLIC_SITE_URL

GOOGLE_MAPS_API_KEY

LINE_OA_CHANNEL_ID

LINE_OA_ACCESS_TOKEN

---

# Security Architecture

Authentication

Supabase Auth

Authorization

Role-Based Access Control

Roles

* guest
* admin
* super_admin

---

# Availability Logic

Rule:

No overlapping booking allowed.

Validation:

check_in < existing_check_out

AND

check_out > existing_check_in

If true

Booking rejected

---

# Pricing Engine

Weekday

6900 THB

Weekend

7900 THB

Future Support:

* Seasonal Pricing
* Holiday Pricing
* Dynamic Pricing

---

# Scalability Plan

Current

2 Villas

Future

10+ Villas

No schema changes required.

---

# Monitoring

Vercel Analytics

Supabase Logs

Error Tracking

Sentry (Future)

---

# Deployment Architecture

GitHub

↓

Vercel

↓

Production

Automatic CI/CD Enabled
