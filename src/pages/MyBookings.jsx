import { useEffect, useState } from 'react'
import { CalendarDays, Download, LogOut, MapPin, UsersRound, XCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../data'
import { completePayment } from '../payments'

const statusLabel = (status) => ({ quote_requested: 'Quote requested', payment_pending: 'Payment pending', confirmed: 'Confirmed', cancelled: 'Cancelled' }[status] || status)

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payingId, setPayingId] = useState('')
  const [cancellingId, setCancellingId] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.myBookings().then((result) => setBookings(result.bookings)).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  }, [])

  const signOut = async () => {
    await logout()
    navigate('/')
  }

  const payOutstanding = async (booking) => {
    setPayingId(booking.id)
    setError('')
    try {
      const paymentKind = booking.amountPaid < booking.depositAmount ? 'deposit' : 'balance'
      const order = await api.createPaymentOrder(booking.id, paymentKind)
      const result = await completePayment(order, booking.id, user, booking.contactPhone)
      setBookings((current) => current.map((item) => item.id === booking.id ? result.booking : item))
    } catch (paymentError) {
      setError(paymentError.message)
    } finally {
      setPayingId('')
    }
  }

  const cancelBooking = async (booking) => {
    const confirmed = window.confirm(`Cancel ${booking.id}? The ₹299 pre-booking amount is non-refundable. Any payment above ₹299 will be marked as a refund due for the owner to process.`)
    if (!confirmed) return
    setCancellingId(booking.id)
    setError('')
    try {
      const result = await api.cancelBooking(booking.id, 'Cancelled by customer')
      setBookings((current) => current.map((item) => item.id === booking.id ? result.booking : item))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setCancellingId('')
    }
  }

  return (
    <div>
      <Header />
      <main className="account-page">
        <section className="shell account-heading">
          <div><span className="kicker">Your celebrations</span><h1>Hello, {user.name.split(' ')[0]}.</h1><p>Every booking and quote request, in one calm place.</p></div>
          <button className="button button--outline" onClick={signOut}><LogOut /> Sign out</button>
        </section>
        <section className="shell bookings-list">
          {loading && <div className="account-empty">Loading your bookings…</div>}
          {error && <div className="form-error">{error}</div>}
          {!loading && !error && !bookings.length && <div className="account-empty"><CalendarDays /><h2>No bookings yet</h2><p>Find an experience and choose a city, date and time.</p><Link className="button button--coral" to="/experiences">Explore experiences</Link></div>}
          {bookings.map((booking) => (
            <article className="booking-record" key={booking.id}>
              <div className="booking-record__date"><strong>{new Date(`${booking.eventDate}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit' })}</strong><span>{new Date(`${booking.eventDate}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</span></div>
              <div className="booking-record__main"><small>{booking.id}</small><h2>{booking.activityTitle}</h2><div><span><CalendarDays /> {booking.eventDate} · {booking.eventTime}</span><span><MapPin /> {booking.city}</span><span><UsersRound /> {booking.guests} guests</span></div></div>
              <div className="booking-record__total">
                <span className={`status-pill status-pill--${booking.status.replaceAll('_', '-')}`}><i />{statusLabel(booking.status)}</span>
                <div className="booking-payment-breakdown">
                  <span>Total <b>{booking.amount == null ? 'Final quote pending' : formatPrice(booking.amount)}</b></span>
                  <span>Paid <b>{formatPrice(booking.amountPaid)}</b></span>
                  <span>Balance <b>{booking.balanceAmount == null ? 'To be confirmed' : formatPrice(booking.balanceAmount)}</b></span>
                </div>
                {booking.status !== 'cancelled' && booking.paymentStatus !== 'paid' && (booking.amountPaid < booking.depositAmount || booking.balanceAmount > 0) && (
                  <button className="button button--coral booking-balance-button" disabled={payingId === booking.id} onClick={() => payOutstanding(booking)}>
                    {payingId === booking.id ? 'Processing…' : booking.amountPaid < booking.depositAmount ? `Pay ${formatPrice(booking.depositAmount)} to pre-book` : `Pay balance ${formatPrice(booking.balanceAmount)}`}
                  </button>
                )}
                {booking.amountPaid >= booking.depositAmount && booking.balanceAmount == null && <small className="quote-balance-note">The owner will set the final price before online balance payment.</small>}
                {booking.amountPaid > 0 && <button className="booking-link-button" onClick={() => api.downloadReceipt(booking.id)}><Download /> Download receipt</button>}
                {booking.status !== 'cancelled' && <button className="booking-link-button booking-link-button--danger" disabled={cancellingId === booking.id} onClick={() => cancelBooking(booking)}><XCircle /> {cancellingId === booking.id ? 'Cancelling…' : 'Cancel booking'}</button>}
                {booking.status === 'cancelled' && <div className="cancellation-note"><b>Cancelled</b><span>{formatPrice(booking.cancellation?.depositRetained || 0)} deposit retained · {['pending', 'manual_required'].includes(booking.cancellation?.refundStatus) ? `${formatPrice(booking.cancellation.refundableAmount)} refund due` : booking.cancellation?.refundStatus === 'processed' ? 'refund processed' : 'no additional refund due'}</span></div>}
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}
