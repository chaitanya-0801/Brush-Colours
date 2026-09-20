# Moments & Makers frontend

A standalone React + Vite frontend for Garima's birthday, wedding and workshop experience platform. This project does not use Next.js.

## Included screens

- Cinematic responsive home page with a local hero video
- Birthday, wedding and workshop catalogue with search, category filtering and price sorting
- Experience detail pages
- Tomorrow-onward, activity-specific booking date validation
- Guest and time selection
- Safe demo checkout and confirmation state
- Responsive admin dashboard for Garima
- Editable pricing saved in the browser for demonstration
- Booking calendar, payment states and upcoming-booking cards

## Start locally

```bash
npm install
npm run dev
```

The development server will print the local URL, normally `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Routes

- `/` — home
- `/experiences` — full catalogue
- `/experiences?category=birthday`
- `/experiences?category=wedding`
- `/experiences?category=workshop`
- `/experience/pottery-party` — representative detail and booking flow
- `/admin` — Garima's admin dashboard

## Content and branding

Activity copy, prices and image URLs live in `src/data.js`. Global colours and typography live at the top of `src/styles.css`.

The current name, statistics, activities, contact address and testimonials are polished placeholders. Replace them with verified business information before launch.

## Backend integrations still required for production

This repository is the frontend requested for the project. Before accepting real bookings, connect it to:

- a database and availability service;
- secure admin authentication;
- a server-side booking API;
- a payment gateway such as Razorpay;
- verified payment webhooks;
- email or WhatsApp confirmation services;
- real cancellation and refund policies.

Never trust prices from the browser. The final server must calculate totals, enforce booking lead times and lock limited-capacity slots.

## Media

The pottery hero video is stored locally in `public/media/hero-pottery.mp4` and came from Coverr's royalty-free stock library. The activity photographs are loaded from Unsplash for the prototype.
