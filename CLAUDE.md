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
