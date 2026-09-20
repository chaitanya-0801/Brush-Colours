import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, ChevronDown, Minus, Plus, ShieldCheck, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatPrice, serviceCities } from '../data'
import { completePayment } from '../payments'

const PREBOOK_AMOUNT = 299

const toDateInput = (date) => {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().split('T')[0]
}

export default function BookingPanel({ activity }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isQuote = activity.price == null
  const earliestDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + Math.max(1, activity.minLeadDays))
    return toDateInput(date)
  }, [activity.minLeadDays])

  const [date, setDate] = useState(earliestDate)
  const [time, setTime] = useState('11:00 AM – 1:00 PM')
  const [guests, setGuests] = useState(6)
  const [city, setCity] = useState('Delhi')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [stage, setStage] = useState('details')
  const [booking, setBooking] = useState(null)
  const [paymentOrder, setPaymentOrder] = useState(null)
  const [form, setForm] = useState({ phone: '', address: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const beginBooking = () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`)
      return
    }
    setError('')
    setStage('details')
    setCheckoutOpen(true)
  }

  const submitBooking = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const result = await api.createBooking({ activityId: activity.id, eventDate: date, eventTime: time, guests, city, venueAddress: form.address, contactPhone: form.phone })
      setBooking(result.booking)
      const order = await api.createPaymentOrder(result.booking.id, 'deposit')
      setPaymentOrder(order)
      setStage('payment')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const payPrebooking = async () => {
    setSubmitting(true)
    setError('')
    try {
      const result = await completePayment(paymentOrder, booking.id, user)
      setBooking(result.booking)
      setStage('success')
    } catch (paymentError) {
      setError(paymentError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <aside className="booking-panel">
        <span className="booking-panel__label">{isQuote ? 'Custom experience' : 'Starting at'}</span>
        <div className="booking-panel__price"><strong>{formatPrice(activity.price)}</strong><span>{activity.priceUnit}</span></div>
        <label className="field-label"><span><CalendarDays /> Choose date</span><input type="date" min={earliestDate} value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label className="field-label"><span>Booking city</span><div className="select-wrap"><select value={city} onChange={(event) => setCity(event.target.value)}>{serviceCities.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown /></div></label>
        <label className="field-label"><span>Time slot</span><div className="select-wrap"><select value={time} onChange={(event) => setTime(event.target.value)}><option>11:00 AM – 1:00 PM</option><option>2:00 PM – 4:00 PM</option><option>5:00 PM – 7:00 PM</option></select><ChevronDown /></div></label>
        <div className="guest-picker"><span>Guests</span><div><button onClick={() => setGuests(Math.max(1, guests - 1))} aria-label="Remove guest"><Minus /></button><strong>{guests}</strong><button onClick={() => setGuests(guests + 1)} aria-label="Add guest"><Plus /></button></div></div>
        <div className="booking-rule">Bookings close {activity.minLeadDays === 1 ? 'one day' : `${activity.minLeadDays} days`} before the event. Same-day booking is unavailable.</div>
        <div className="booking-panel__total"><span>Pre-book today</span><strong>{formatPrice(PREBOOK_AMOUNT)}</strong></div>
        <div className="booking-panel__balance"><span>Remaining balance</span><b>{isQuote ? 'After final quote' : `${formatPrice(Math.max(activity.price - PREBOOK_AMOUNT, 0))} later`}</b></div>
        <button className="button button--coral button--wide" onClick={beginBooking}>{user ? `Pre-book for ${formatPrice(PREBOOK_AMOUNT)}` : 'Sign in to pre-book'}</button>
        <p className="booking-panel__secure"><ShieldCheck /> Pay the balance online later or directly to the owner</p>
      </aside>

      {checkoutOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setCheckoutOpen(false)}>
          <div className="checkout-modal" role="dialog" aria-modal="true" aria-label="Complete booking" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button>
            {stage === 'success' ? (
              <div className="checkout-success"><CheckCircle2 /><span className="kicker">Pre-booking confirmed</span><h2>Your date is reserved.</h2><p>We received <strong>{formatPrice(booking?.amountPaid || PREBOOK_AMOUNT)}</strong> for booking <strong>{booking?.id}</strong>. {booking?.balanceAmount == null ? 'Garima will confirm the final package price.' : `${formatPrice(booking.balanceAmount)} remains and can be paid online later or directly to the owner.`}</p><button className="button button--dark" onClick={() => navigate('/bookings')}>View my bookings</button></div>
            ) : stage === 'payment' ? (
              <div className="checkout-success payment-step"><ShieldCheck /><span className="kicker">Secure pre-booking</span><h2>Reserve it for {formatPrice(PREBOOK_AMOUNT)}</h2><p>Only the pre-booking amount is collected now. Your remaining balance can be paid from My Bookings later or directly to the owner at the event.</p>{error && <div className="form-error">{error}</div>}<button className="button button--coral button--wide" disabled={submitting} onClick={payPrebooking}>{submitting ? 'Processing…' : `Pay ${formatPrice((paymentOrder?.amount || PREBOOK_AMOUNT * 100) / 100)} & pre-book`}</button></div>
            ) : (
              <form onSubmit={submitBooking}>
                <span className="kicker">Confirm the details</span><h2>Pre-book this experience</h2>
                <div className="checkout-summary"><img src={activity.image} alt="" /><div><strong>{activity.title}</strong><span>{date} · {time}</span><span>{guests} guests · {city}</span></div><b>{formatPrice(activity.price)}</b></div>
                {error && <div className="form-error">{error}</div>}
                <div className="form-grid">
                  <label>Customer<input value={user.name} disabled /></label>
                  <label>Phone number<input required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Enter your WhatsApp number" /></label>
                  <label className="span-two">Email address<input value={user.email} disabled /></label>
                  <label className="span-two">Venue address<textarea required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder={`Complete venue address in ${city}`} /></label>
                </div>
                <div className="demo-payment-note"><ShieldCheck /> Pay only {formatPrice(PREBOOK_AMOUNT)} now. The remaining amount is kept as a separate balance.</div>
                <button className="button button--coral button--wide" type="submit" disabled={submitting}>{submitting ? 'Creating booking…' : `Continue · pre-book for ${formatPrice(PREBOOK_AMOUNT)}`}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
