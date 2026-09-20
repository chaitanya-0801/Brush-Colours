import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, ChevronDown, Minus, Plus, ShieldCheck, X } from 'lucide-react'
import { formatPrice } from '../data'

const toDateInput = (date) => {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().split('T')[0]
}

export default function BookingPanel({ activity }) {
  const earliestDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + activity.minLeadDays)
    return toDateInput(date)
  }, [activity.minLeadDays])

  const [date, setDate] = useState(earliestDate)
  const [time, setTime] = useState('11:00 AM – 1:00 PM')
  const [guests, setGuests] = useState(6)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const submitBooking = (event) => {
    event.preventDefault()
    setConfirmed(true)
  }

  return (
    <>
      <aside className="booking-panel">
        <span className="booking-panel__label">Starting at</span>
        <div className="booking-panel__price">
          <strong>{formatPrice(activity.price)}</strong><span>{activity.priceUnit}</span>
        </div>

        <label className="field-label">
          <span><CalendarDays /> Choose date</span>
          <input type="date" min={earliestDate} value={date} onChange={(event) => setDate(event.target.value)} />
        </label>

        <label className="field-label">
          <span>Time slot</span>
          <div className="select-wrap">
            <select value={time} onChange={(event) => setTime(event.target.value)}>
              <option>11:00 AM – 1:00 PM</option>
              <option>2:00 PM – 4:00 PM</option>
              <option>5:00 PM – 7:00 PM</option>
            </select>
            <ChevronDown />
          </div>
        </label>

        <div className="guest-picker">
          <span>Guests</span>
          <div>
            <button onClick={() => setGuests(Math.max(1, guests - 1))} aria-label="Remove guest"><Minus /></button>
            <strong>{guests}</strong>
            <button onClick={() => setGuests(guests + 1)} aria-label="Add guest"><Plus /></button>
          </div>
        </div>

        <div className="booking-rule">
          Bookings close {activity.minLeadDays === 1 ? 'one day' : `${activity.minLeadDays} days`} before the event.
        </div>

        <div className="booking-panel__total"><span>Total</span><strong>{formatPrice(activity.price)}</strong></div>
        <button className="button button--coral button--wide" onClick={() => { setCheckoutOpen(true); setConfirmed(false) }}>
          Pay & confirm
        </button>
        <p className="booking-panel__secure"><ShieldCheck /> Secure checkout · No card details stored here</p>
      </aside>

      {checkoutOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setCheckoutOpen(false)}>
          <div className="checkout-modal" role="dialog" aria-modal="true" aria-label="Complete booking" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button>
            {confirmed ? (
              <div className="checkout-success">
                <CheckCircle2 />
                <span className="kicker">Booking request received</span>
                <h2>You’re all set.</h2>
                <p>Your demo booking for <strong>{activity.title}</strong> has been created. A production version would now verify payment and send the confirmation.</p>
                <button className="button button--dark" onClick={() => setCheckoutOpen(false)}>Done</button>
              </div>
            ) : (
              <form onSubmit={submitBooking}>
                <span className="kicker">One last step</span>
                <h2>Complete your booking</h2>
                <div className="checkout-summary">
                  <img src={activity.image} alt="" />
                  <div><strong>{activity.title}</strong><span>{date} · {time}</span><span>{guests} guests · {activity.location}</span></div>
                  <b>{formatPrice(activity.price)}</b>
                </div>
                <div className="form-grid">
                  <label>Full name<input required placeholder="Your full name" /></label>
                  <label>Phone number<input required type="tel" placeholder="+91 98765 43210" /></label>
                  <label className="span-two">Email address<input required type="email" placeholder="you@example.com" /></label>
                  <label className="span-two">Venue address<textarea required placeholder="Where should the facilitator arrive?" /></label>
                </div>
                <div className="demo-payment-note"><ShieldCheck /> Demo checkout: no real payment will be charged.</div>
                <button className="button button--coral button--wide" type="submit">Continue to payment · {formatPrice(activity.price)}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
