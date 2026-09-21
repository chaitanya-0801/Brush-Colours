import { Mail, MapPin, Phone } from 'lucide-react'
import { Navigate, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { serviceCities } from '../data'

const lastUpdated = '21 September 2026'

const policies = {
  terms: {
    eyebrow: 'Website terms',
    title: 'Terms & conditions',
    intro: 'These terms explain how Brush&Colours enquiries, reservations and event bookings work.',
    sections: [
      ['Bookings and quotations', 'Prices shown on experience cards are base prices. The final scope and price may change with the venue, city, guest count, customisation and customer-approved additions. A booking is confirmed only after the required pre-booking payment is captured.'],
      ['Customer responsibilities', 'You must provide accurate contact, venue, date, guest and event information. You are responsible for arranging lawful venue access and informing us about relevant safety, allergy or accessibility requirements before the event.'],
      ['Changes and availability', 'Dates and time slots remain subject to availability until a reservation is confirmed. Any later change to the event scope, guest count or venue may require a revised quote that will be shown in your booking account.'],
      ['Payments', 'Online payments are securely processed by Razorpay. Brush&Colours does not collect or store your card, UPI PIN or internet-banking credentials.'],
      ['Event delivery', 'The service is delivered at the agreed venue, date and time. The exact inclusions shown in the confirmed booking form the event scope.'],
      ['Contact', 'For a booking or payment question, contact Brush&Colours at +91 63787 88998 or admin@brushandcolours.in.'],
    ],
  },
  privacy: {
    eyebrow: 'Your information',
    title: 'Privacy policy',
    intro: 'We collect only the information needed to manage your account, enquiry, booking and payment.',
    sections: [
      ['Information we collect', 'This can include your name, email address, phone number, event date, venue address, guest count, selected experience, messages, favourites and booking history.'],
      ['How we use it', 'We use your information to operate your account, respond to enquiries, plan and deliver events, collect payments, issue receipts, provide support, prevent misuse and meet legal or accounting duties.'],
      ['Payments', 'Razorpay processes online payments. We retain payment references, status and amounts for your receipt and our records, but we do not store your card number, UPI PIN or banking password.'],
      ['Sharing and retention', 'Information is shared only with service providers needed to operate the website and deliver the booking, or when required by law. We retain business records only as long as reasonably necessary for these purposes.'],
      ['Your choices', 'You may ask us to correct your account information or request deletion where legal and accounting obligations allow it. Contact admin@brushandcolours.in.'],
      ['Security', 'We use access controls, encrypted HTTPS connections and restricted production credentials. No online system can be guaranteed completely secure, so contact us promptly if you notice suspicious account activity.'],
    ],
  },
  refunds: {
    eyebrow: 'Cancellations and money',
    title: 'Cancellation & refund policy',
    intro: 'Please read this policy before paying the ₹299 pre-booking amount.',
    sections: [
      ['Pre-booking amount', 'The ₹299 pre-booking amount reserves the date and is non-refundable when the customer cancels. If the event is completed, the full ₹299 is deducted from the final balance—it is not an extra charge.'],
      ['Customer cancellation', 'You can request cancellation from your booking account. Any eligible amount paid above the ₹299 pre-booking amount will be reviewed and returned to the original online payment method, or by the agreed method for a cash payment.'],
      ['Refund timing', 'After an eligible refund is approved and initiated, allow 7–10 business days for it to appear. The final timing can depend on Razorpay, your bank or your payment method.'],
      ['Changes instead of cancellation', 'Contact us as early as possible if you need a different date, city, venue or guest count. Changes depend on availability and may change the final price.'],
      ['Brush&Colours cancellation', 'If Brush&Colours cannot deliver a confirmed event for reasons within our control, we will offer a suitable reschedule or return the amount collected for that booking.'],
      ['Help with a refund', 'Contact +91 63787 88998 or admin@brushandcolours.in and include your booking reference and payment reference.'],
    ],
  },
  delivery: {
    eyebrow: 'How services are fulfilled',
    title: 'Service delivery policy',
    intro: 'Brush&Colours provides in-person creative experiences and event services; no physical product is shipped by this website.',
    sections: [
      ['Confirmation', 'After a successful pre-booking payment, your reservation and receipt appear in your account. We may contact you to confirm venue access, timing, guest details and custom requirements.'],
      ['Where we deliver', `Services are currently offered at customer venues in ${serviceCities.join(', ')}. Availability depends on the selected experience and date.`],
      ['When we deliver', 'The event is delivered on the date and time shown in the confirmed booking. Please ensure that the venue is accessible early enough for any setup included in your plan.'],
      ['Digital records', 'Booking confirmations, payment status and downloadable receipts are provided through your account on this website.'],
    ],
  },
}

export default function LegalPage({ page }) {
  const params = useParams()
  const policy = policies[page || params.page]
  if (!policy) return <Navigate to="/" replace />

  return (
    <div className="legal-page">
      <Header />
      <main className="legal-main">
        <section className="shell legal-hero">
          <span className="kicker">{policy.eyebrow}</span>
          <h1>{policy.title}</h1>
          <p>{policy.intro}</p>
          <small>Last updated: {lastUpdated}</small>
        </section>
        <section className="shell legal-content">
          {policy.sections.map(([heading, body]) => (
            <article key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </article>
          ))}
          {page === 'delivery' && (
            <aside className="legal-contact-card">
              <h2>Service contact</h2>
              <p><Phone /> <a href="tel:+916378788998">+91 63787 88998</a></p>
              <p><Mail /> <a href="mailto:admin@brushandcolours.in">admin@brushandcolours.in</a></p>
              <p><MapPin /> {serviceCities.join(' · ')}</p>
            </aside>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
