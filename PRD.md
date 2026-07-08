# PRD – PUYA BEACH VILLA Booking Platform

## Project Information

### Project Name

PUYA BEACH VILLA

### Project Type

Beachfront Private Pool Villa Booking Platform

### Version

v1.0

### Objective

Develop a modern villa booking website that allows guests to:

* View villa information
* Check room availability
* Make online bookings
* Upload payment slips
* View promotions
* Read and submit reviews

The platform should also provide an administrative dashboard for managing bookings, payments, calendars, promotions, and reports.

---

# Business Overview

## Property Information

### Villa 1

* Capacity: 15 Guests
* Weekday Price (Sun-Thu): 6,900 THB
* Weekend Price (Fri-Sat): 7,900 THB

### Villa 2

* Capacity: 15 Guests
* Weekday Price (Sun-Thu): 6,900 THB
* Weekend Price (Fri-Sat): 7,900 THB

---

# Target Users

## Guest

Can:

* Browse villas
* View availability
* Make bookings
* Upload payment slips
* View promotions
* Submit reviews

## Administrator

Can:

* Manage bookings
* Verify payments
* Update calendar availability
* Manage reviews
* Manage promotions
* View revenue reports

---

# Design Requirements

## Design Style

Minimal Luxury Beach Villa

### Keywords

* Modern
* Minimal
* Luxury
* Beachfront
* Elegant
* Clean

### Color Palette

Primary

#0EA5E9

Secondary

#F8FAFC

Text

#0F172A

Background

#FFFFFF

### Typography

Preferred:

* Inter
* Geist
* Noto Sans Thai

---

# Functional Requirements

## 1. Home Page

### Sections

#### Hero Section

Display:

* Villa hero image/video
* Main headline
* Call-to-action button

Example:

PUYA BEACH VILLA

Private Beachfront Pool Villa

Up to 15 Guests

[Book Now]

[Check Availability]

---

#### Villa Overview

Display:

* Villa 1
* Villa 2

Each card includes:

* Cover Image
* Capacity
* Price
* View Details Button

---

#### Facilities Section

Display:

* Private Pool
* Karaoke
* BBQ Grill
* Beachfront Access
* Parking
* Free WiFi

---

#### Reviews Preview

Display:

* Average Rating
* Latest Reviews

---

#### Promotions Preview

Display Active Promotions

---

## 2. Villa Detail Page

### Features

Image Gallery

Villa Description

Facilities

Pricing Information

Availability Calendar

Reviews

Booking CTA

---

## 3. Availability Calendar

### Calendar Status

Available

Pending Payment

Booked

### Rules

Prevent double booking

Real-time update

Mobile friendly

Monthly view

---

## 4. Booking System

### Step 1

Select:

* Villa
* Check-in Date
* Check-out Date

---

### Step 2

Guest Information

Fields:

* Full Name
* Phone Number
* LINE ID
* Email
* Number of Guests

---

### Step 3

Price Calculation

Automatically calculate:

* Number of Nights
* Applicable Rate
* Total Amount

---

### Step 4

Booking Creation

Generate booking record

Status:

Pending Payment

---

### Step 5

Payment Upload

Guest uploads:

* Payment Slip

Supported:

* JPG
* PNG
* WEBP

---

### Step 6

Confirmation

Admin verifies payment

Status:

Confirmed

---

## 5. Reviews System

### Review Data

Guest Name

Rating (1-5)

Comment

Photos

Created Date

### Rules

Admin approval required

---

## 6. Promotions System

### Promotion Fields

Title

Description

Discount Type

Discount Value

Start Date

End Date

Status

### Types

Percentage Discount

Fixed Amount Discount

---

## 7. Contact Page

Display:

Phone Number

LINE Official Account

Google Map

Facebook Page

Business Hours

---

# Admin Dashboard

## Dashboard Overview

Display:

Total Bookings

Today's Revenue

Monthly Revenue

Occupancy Rate

Pending Payments

Recent Bookings

---

## Booking Management

Features:

View Bookings

Search Bookings

Edit Booking

Cancel Booking

Update Status

---

## Calendar Management

Block Dates

Unblock Dates

Manual Reservation Entry

---

## Payment Verification

View Slip

Approve Payment

Reject Payment

Add Notes

---

## Review Management

Approve Review

Reject Review

Delete Review

---

## Promotion Management

Create Promotion

Edit Promotion

Deactivate Promotion

Delete Promotion

---

## Reports

### Revenue Report

Daily

Monthly

Yearly

---

### Occupancy Report

Per Villa

Per Month

Per Year

---

# Database Schema

## villas

* id
* name
* slug
* description
* capacity
* weekday_price
* weekend_price
* cover_image
* active
* created_at

---

## bookings

* id
* villa_id
* customer_name
* phone
* line_id
* email
* guest_count
* check_in
* check_out
* total_price
* payment_status
* booking_status
* created_at

---

## payments

* id
* booking_id
* amount
* slip_image
* verified
* verified_by
* verified_at
* created_at

---

## reviews

* id
* villa_id
* customer_name
* rating
* comment
* image_url
* approved
* created_at

---

## promotions

* id
* title
* description
* discount_type
* discount_value
* start_date
* end_date
* active

---

## admins

* id
* email
* role
* created_at

---

# Integrations

## Version 1

Supabase

Supabase Auth

Supabase Storage

PromptPay QR

Google Maps

LINE Contact Button

---

## Version 2

Google Calendar Sync

LINE OA Notifications

Email Notifications

Facebook Pixel

Google Analytics

---

# Non-Functional Requirements

## Performance

Page Load < 3 Seconds

Lighthouse Score > 90

SEO Friendly

Responsive Design

Mobile First

---

## Security

HTTPS

Input Validation

SQL Injection Protection

Authentication

Role-Based Access Control

---

# Technology Stack

## Frontend

Next.js 15

TypeScript

Tailwind CSS

Shadcn UI

React Hook Form

Zod

---

## Backend

Supabase

PostgreSQL

Supabase Auth

Supabase Storage

---

## Deployment

Vercel

---

# Future Roadmap

## Phase 2

Google Calendar Integration

LINE OA Automation

Email Automation

Advanced Reporting

AI Chat Assistant

Dynamic Pricing

Coupon System

---

## Success Metrics

Monthly Bookings

Monthly Revenue

Occupancy Rate

Review Score

Conversion Rate

Average Booking Value

Return Guest Percentage
