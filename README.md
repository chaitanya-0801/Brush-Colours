# Brush&Colours frontend

A React + Vite customer and admin application for Brush&Colours' birthday, wedding and workshop experience platform. This project does not use Next.js and connects to the Express API in the adjacent `Backend` folder.

## Included screens

- Cinematic responsive home page with a local hero video
- Birthday, wedding and workshop catalogue with search, city selection, category filtering and price sorting
- Experience detail pages
- Customer sign-up, sign-in, sign-out and private booking history
- City, guest, date, time, contact and venue selection
- Backend-enforced booking lead times with same-day booking blocked
- Database-backed bookings and a clearly labelled local test-payment flow
- Role-protected responsive admin dashboard for Garima
- Database-backed activity pricing, bookings, payment states and monthly revenue

## Start locally

Start the API first from `../Backend`, then start this frontend:

```bash
cd ../Backend
npm install
npm run dev

cd ../Frontend
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
- `/login` and `/signup` — customer and administrator authentication
- `/bookings` — signed-in customer's bookings
- `/admin` — role-protected Garima admin dashboard

## Content and branding

Activity copy and image URLs live in `src/data.js`; live prices come from the backend database. Global colours and typography live at the top of `src/styles.css`.

The current name, statistics, activities, contact address and testimonials are polished placeholders. Replace them with verified business information before launch.

## Before production

The included backend already owns prices, authentication, bookings and revenue calculations. Local payments are intentionally marked as tests and charge no money. Before launch, complete payment-provider onboarding, add the provider's customer checkout with explicit data-sharing consent, configure verified webhooks, enable HTTPS, replace all development secrets and publish cancellation/refund policies.

## Media

The pottery hero video is stored locally in `public/media/hero-pottery.mp4` and came from Coverr's royalty-free stock library. The activity photographs are loaded from Unsplash for the prototype.
