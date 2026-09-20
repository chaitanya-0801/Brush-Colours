import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, ChevronDown, Minus, Plus, ShieldCheck, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { formatPrice, serviceCities } from '../data'

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
      if (isQuote) {
        setStage('success')
      } else {
        const order = await api.createPaymentOrder(result.booking.id)
        if (order.provider !== 'development') throw new Error('The live payment account is ready on the server but its customer checkout has not been activated.')
        setPaymentOrder(order)
        setStage('payment')
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const completeDevelopmentPayment = async () => {
    setSubmitting(true)
    setError('')
    try {
      await api.verifyPayment({ bookingId: booking.id, orderId: paymentOrder.orderId })
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
        <div className="booking-panel__total"><span>{isQuote ? 'Pricing' : 'Total'}</span><strong>{formatPrice(activity.price)}</strong></div>
        <button className="button button--coral button--wide" onClick={beginBooking}>{user ? (isQuote ? 'Request booking & quote' : 'Book & pay securely') : 'Sign in to book'}</button>
        <p className="booking-panel__secure"><ShieldCheck /> {isQuote ? 'Garima will confirm availability and pricing' : 'Secure server-verified checkout'}</p>
      </aside>

      {checkoutOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setCheckoutOpen(false)}>
          <div className="checkout-modal" role="dialog" aria-modal="true" aria-label="Complete booking" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button>
            {stage === 'success' ? (
              <div className="checkout-success"><CheckCircle2 /><span className="kicker">{isQuote ? 'Quote request received' : 'Payment confirmed'}</span><h2>{isQuote ? 'Garima will contact you.' : 'Your booking is confirmed.'}</h2><p>Booking <strong>{booking?.id}</strong> for <strong>{activity.title}</strong> in {city} is now visible in your account and the admin dashboard.</p><button className="button button--dark" onClick={() => navigate('/bookings')}>View my bookings</button></div>
            ) : stage === 'payment' ? (
              <div className="checkout-success payment-step"><ShieldCheck /><span className="kicker">Local test payment</span><h2>Complete your test payment</h2><p>This development checkout records a successful payment without charging real money. Live collection remains disabled until a payment provider is approved and activated.</p>{error && <div className="form-error">{error}</div>}<button className="button button--coral button--wide" disabled={submitting} onClick={completeDevelopmentPayment}>{submitting ? 'Verifying…' : `Complete test payment · ${formatPrice(activity.price)}`}</button></div>
            ) : (
              <form onSubmit={submitBooking}>
                <span className="kicker">Confirm the details</span><h2>{isQuote ? 'Request this experience' : 'Complete your booking'}</h2>
                <div className="checkout-summary"><img src={activity.image} alt="" /><div><strong>{activity.title}</strong><span>{date} · {time}</span><span>{guests} guests · {city}</span></div><b>{formatPrice(activity.price)}</b></div>
                {error && <div className="form-error">{error}</div>}
                <div className="form-grid">
                  <label>Customer<input value={user.name} disabled /></label>
                  <label>Phone number<input required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Enter your WhatsApp number" /></label>
                  <label className="span-two">Email address<input value={user.email} disabled /></label>
                  <label className="span-two">Venue address<textarea required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder={`Complete venue address in ${city}`} /></label>
                </div>
                <div className="demo-payment-note"><ShieldCheck /> {isQuote ? 'No payment is taken until Garima confirms the quote.' : 'Your price is saved with the booking before payment.'}</div>
                <button className="button button--coral button--wide" type="submit" disabled={submitting}>{submitting ? 'Creating booking…' : isQuote ? 'Send booking request' : `Continue to payment · ${formatPrice(activity.price)}`}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
