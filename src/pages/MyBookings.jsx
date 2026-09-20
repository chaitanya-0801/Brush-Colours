import { useEffect, useState } from 'react'
import { CalendarDays, LogOut, MapPin, ReceiptIndianRupee, UsersRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../data'

const statusLabel = (status) => ({ quote_requested: 'Quote requested', payment_pending: 'Payment pending', confirmed: 'Confirmed', cancelled: 'Cancelled' }[status] || status)

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.myBookings().then((result) => setBookings(result.bookings)).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
  }, [])

  const signOut = async () => {
    await logout()
    navigate('/')
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
          {!loading && !bookings.length && <div className="account-empty"><CalendarDays /><h2>No bookings yet</h2><p>Find an experience and choose a city, date and time.</p><Link className="button button--coral" to="/experiences">Explore experiences</Link></div>}
          {bookings.map((booking) => (
            <article className="booking-record" key={booking.id}>
              <div className="booking-record__date"><strong>{new Date(`${booking.eventDate}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit' })}</strong><span>{new Date(`${booking.eventDate}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</span></div>
              <div className="booking-record__main"><small>{booking.id}</small><h2>{booking.activityTitle}</h2><div><span><CalendarDays /> {booking.eventDate} · {booking.eventTime}</span><span><MapPin /> {booking.city}</span><span><UsersRound /> {booking.guests} guests</span></div></div>
              <div className="booking-record__total"><span className={`status-pill status-pill--${booking.status.replaceAll('_', '-')}`}><i />{statusLabel(booking.status)}</span><strong><ReceiptIndianRupee /> {booking.amount == null ? 'Custom quote' : formatPrice(booking.amount)}</strong></div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}
