import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, ChevronDown, Download, Minus, Plus, ShieldCheck, X } from 'lucide-react'
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
  const slots = activity.timeSlots || []
  const cities = activity.locations?.length ? activity.locations : serviceCities
  const guestPricing = activity.guestPricing || {}
  const earliestDate = useMemo(() => {
    const value = new Date()
    value.setDate(value.getDate() + Math.max(1, Number(activity.minLeadDays || 1)))
    return toDateInput(value)
  }, [activity.minLeadDays])

  const [date, setDate] = useState(earliestDate)
  const [timeSlotId, setTimeSlotId] = useState(slots[0]?.id || '')
  const [guests, setGuests] = useState(Math.max(1, Number(guestPricing.includedGuests || 1)))
  const [city, setCity] = useState(cities[0] || 'Delhi')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [stage, setStage] = useState('details')
  const [booking, setBooking] = useState(null)
  const [paymentOrder, setPaymentOrder] = useState(null)
  const [form, setForm] = useState({ phone: '', address: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setDate(earliestDate)
    setTimeSlotId(slots[0]?.id || '')
    setGuests(Math.max(1, Number(guestPricing.includedGuests || 1)))
    setCity(cities[0] || 'Delhi')
  }, [activity.id, earliestDate])

  const selectedSlot = slots.find((slot) => slot.id === timeSlotId)
  const extraGuests = guestPricing.enabled ? Math.max(0, guests - Number(guestPricing.includedGuests || 1)) : 0
  const guestAdjustment = isQuote ? 0 : Math.round(activity.price * Number(guestPricing.percentPerExtraGuest || 0) * extraGuests / 100)
  const estimatedTotal = isQuote ? null : activity.price + guestAdjustment

  const beginBooking = () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`)
      return
    }
    if (user.role === 'admin') {
      setError('Admin accounts cannot book events. Sign in with a customer account to test a booking.')
      return
    }
    if (!timeSlotId) {
      setError('This activity has no available time slots. Please contact the owner.')
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
      const result = await api.createBooking({ activityId: activity.id, eventDate: date, timeSlotId, guests, city, venueAddress: form.address, contactPhone: form.phone })
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
        <label className="field-label"><span>Booking city</span><div className="select-wrap"><select value={city} onChange={(event) => setCity(event.target.value)}>{cities.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown /></div></label>
        <label className="field-label"><span>Time slot</span><div className="select-wrap"><select value={timeSlotId} disabled={!slots.length} onChange={(event) => setTimeSlotId(event.target.value)}>{slots.length ? slots.map((slot) => <option key={slot.id} value={slot.id}>{slot.label}</option>) : <option value="">No slots available</option>}</select><ChevronDown /></div></label>
        <div className="guest-picker"><span>Guests</span><div><button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} aria-label="Remove guest"><Minus /></button><strong>{guests}</strong><button type="button" onClick={() => setGuests(Math.min(Number(guestPricing.maxGuests || 1000), guests + 1))} aria-label="Add guest"><Plus /></button></div></div>
        {guestPricing.enabled && <div className="booking-rule">Includes {guestPricing.includedGuests} guests. Each additional guest adds {guestPricing.percentPerExtraGuest}% of the base price.</div>}
        <div className="booking-rule">Bookings close {activity.minLeadDays === 1 ? 'one day' : `${activity.minLeadDays} days`} before the event. Same-day booking is unavailable.</div>
        <div className="booking-panel__total"><span>Estimated total</span><strong>{formatPrice(estimatedTotal)}</strong></div>
        <div className="booking-panel__balance"><span>Pre-book today</span><b>{formatPrice(PREBOOK_AMOUNT)}</b></div>
        <div className="booking-policy"><ShieldCheck /><span><b>{formatPrice(PREBOOK_AMOUNT)} is non-refundable if you cancel.</b> If the event is completed, it is deducted from your final balance.</span></div>
        {error && <div className="form-error">{error}</div>}
        <button className="button button--coral button--wide" disabled={!slots.length || user?.role === 'admin'} onClick={beginBooking}>{user?.role === 'admin' ? 'Admin accounts cannot book' : user ? `Pre-book for ${formatPrice(PREBOOK_AMOUNT)}` : 'Sign in to pre-book'}</button>
        <p className="booking-panel__secure"><ShieldCheck /> Pay the balance online later or directly to the owner</p>
      </aside>

      {checkoutOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setCheckoutOpen(false)}>
          <div className="checkout-modal" role="dialog" aria-modal="true" aria-label="Complete booking" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button>
            {stage === 'success' ? (
              <div className="checkout-success"><CheckCircle2 /><span className="kicker">Pre-booking confirmed</span><h2>Your date is reserved.</h2><p>We received <strong>{formatPrice(booking?.amountPaid || PREBOOK_AMOUNT)}</strong> for booking <strong>{booking?.id}</strong>. {booking?.balanceAmount == null ? 'Garima will confirm the final package price.' : `${formatPrice(booking.balanceAmount)} remains and can be paid online later or directly to the owner.`}</p><div className="checkout-actions"><button className="button button--outline" onClick={() => api.downloadReceipt(booking.id)}><Download /> Receipt</button><button className="button button--dark" onClick={() => navigate('/bookings')}>View bookings</button></div></div>
            ) : stage === 'payment' ? (
              <div className="checkout-success payment-step"><ShieldCheck /><span className="kicker">Secure pre-booking</span><h2>Reserve it for {formatPrice(PREBOOK_AMOUNT)}</h2><p>This amount is <strong>not refundable if you cancel</strong>. When your event is completed, the full {formatPrice(PREBOOK_AMOUNT)} is credited toward your balance.</p>{error && <div className="form-error">{error}</div>}<button className="button button--coral button--wide" disabled={submitting} onClick={payPrebooking}>{submitting ? 'Processing…' : `Pay ${formatPrice((paymentOrder?.amount || PREBOOK_AMOUNT * 100) / 100)} & pre-book`}</button></div>
            ) : (
              <form onSubmit={submitBooking}>
                <span className="kicker">Confirm the details</span><h2>Pre-book this experience</h2>
                <div className="checkout-summary"><img src={activity.image} alt="" /><div><strong>{activity.title}</strong><span>{date} · {selectedSlot?.label}</span><span>{guests} guests · {city}</span></div><b>{formatPrice(estimatedTotal)}</b></div>
                {error && <div className="form-error">{error}</div>}
                <div className="form-grid">
                  <label>Customer<input value={user.name} disabled /></label>
                  <label>Phone number<input required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Enter your WhatsApp number" /></label>
                  <label className="span-two">Email address<input value={user.email} disabled /></label>
                  <label className="span-two">Venue address<textarea required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder={`Complete venue address in ${city}`} /></label>
                </div>
                <div className="demo-payment-note"><ShieldCheck /> {formatPrice(PREBOOK_AMOUNT)} is non-refundable after cancellation and will be deducted from your final balance when the event is completed.</div>
                <button className="button button--coral button--wide" type="submit" disabled={submitting}>{submitting ? 'Creating booking…' : `Continue · pre-book for ${formatPrice(PREBOOK_AMOUNT)}`}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
