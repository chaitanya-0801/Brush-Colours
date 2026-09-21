git# Brush&Colours frontend

A React + Vite customer and admin application for Brush&Colours' birthday, wedding and workshop experience platform. This project does not use Next.js and connects to the Express API in the adjacent `Backend` folder.

## Included screens

- Cinematic responsive home page with a local hero video
- Birthday, wedding and workshop catalogue with search, city selection, category filtering and price sorting
- Experience detail pages
- Customer sign-up, sign-in, sign-out and private booking history
- City, guest, date, database-managed time slot, contact and venue selection
- Backend-enforced booking lead times with same-day booking blocked
- Database-backed bookings and a clearly labelled local test-payment flow
- Role-protected responsive admin dashboard for Garima
- Full database-backed event CRUD, photo uploads, dynamic slots, guest pricing, bookings, refunds and monthly revenue
- Customer cancellation and downloadable PDF receipts

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

Events are loaded entirely from MongoDB. Admin can create, edit, hide or archive them from `/admin`; customer screens no longer contain a hard-coded event catalogue. `src/data.js` contains only stable city/category presentation metadata. Global colours and typography live at the top of `src/styles.css`.

The current name, statistics, activities, contact address and testimonials are polished placeholders. Replace them with verified business information before launch.

## Before production

The backend owns events, prices, authentication, bookings, receipts and revenue calculations. Before launch, configure MongoDB, Cloudinary and Razorpay, add the verified Razorpay webhook, keep demo payments disabled, enable HTTPS, replace all development secrets and publish the cancellation/refund policy.

## Media

The pottery hero video is stored locally in `public/media/hero-pottery.mp4` and came from Coverr's royalty-free stock library. The activity photographs are loaded from Unsplash for the prototype.
