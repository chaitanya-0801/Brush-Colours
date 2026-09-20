import { useEffect, useMemo, useState } from 'react'
import {
  Bell, CalendarDays, Check, ChevronDown, CircleDollarSign, Clock3, IndianRupee,
  LayoutDashboard, LogOut, Menu, PackageOpen, Search, ShieldCheck, UsersRound,
  WalletCards, X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useActivities } from '../context/ActivityContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../data'

const menuItems = [
  ['Overview', LayoutDashboard],
  ['Activities & Pricing', PackageOpen],
  ['Bookings', UsersRound],
  ['Monthly Revenue', WalletCards],
]

const statusLabel = (status) => ({ quote_requested: 'Quote requested', payment_pending: 'Payment pending', confirmed: 'Confirmed', cancelled: 'Cancelled' }[status] || status)

export default function Admin() {
  const [activeMenu, setActiveMenu] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [allBookings, setAllBookings] = useState([])
  const [bookingAmounts, setBookingAmounts] = useState({})
  const [settlingId, setSettlingId] = useState('')
  const [prices, setPrices] = useState({})
  const [dirty, setDirty] = useState(new Set())
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [securityOpen, setSecurityOpen] = useState(false)
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const { activities, refreshActivities } = useActivities()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const loadDashboard = async () => {
    try {
      const [dashboardResult, bookingResult] = await Promise.all([api.adminDashboard(), api.adminBookings()])
      setDashboard(dashboardResult)
      setAllBookings(bookingResult.bookings)
      setBookingAmounts(Object.fromEntries(bookingResult.bookings.map((booking) => [booking.id, booking.amount ?? ''])))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => { loadDashboard() }, [])
  useEffect(() => { setPrices(Object.fromEntries(activities.map((item) => [item.id, item.price]))) }, [activities])
  useEffect(() => {
    if (!saved) return undefined
    const timer = window.setTimeout(() => setSaved(false), 2400)
    return () => window.clearTimeout(timer)
  }, [saved])

  const visibleActivities = useMemo(() => activities.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())), [activities, query])
  const visibleBookings = useMemo(() => allBookings.filter((booking) => `${booking.id} ${booking.activityTitle} ${booking.customerName} ${booking.customerEmail} ${booking.city}`.toLowerCase().includes(query.toLowerCase())), [allBookings, query])

  const savePrices = async () => {
    setError('')
    try {
      await Promise.all([...dirty].map((id) => api.updateActivity(id, prices[id])))
      await refreshActivities()
      setDirty(new Set())
      setSaved(true)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const changeStatus = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status)
      await loadDashboard()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const saveBookingAmount = async (booking) => {
    setSettlingId(booking.id)
    setError('')
    try {
      await api.updateBookingAmount(booking.id, bookingAmounts[booking.id])
      await loadDashboard()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSettlingId('')
    }
  }

  const settleBalance = async (booking) => {
    setSettlingId(booking.id)
    setError('')
    try {
      await api.settleBookingBalance(booking.id)
      await loadDashboard()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSettlingId('')
    }
  }

  const signOut = async () => {
    await logout()
    navigate('/login')
  }

  const changePassword = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await api.changePassword(passwords)
      await logout().catch(() => {})
      navigate('/login', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const metrics = dashboard?.metrics || { todayBookings: 0, thisMonthRevenue: 0, pendingPayments: 0, pendingValue: 0, totalRevenue: 0, totalBookings: 0 }
  const maxRevenue = Math.max(1, ...(dashboard?.monthlyRevenue || []).map((item) => item.revenue))

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X /></button>
        <div className="admin-brand"><strong>BRUSH <i>&</i><br />COLOURS</strong><span>ADMIN</span></div>
        <small>PEOPLE · PLACES ·<br />CREATIVE EXPERIENCES</small>
        <nav>{menuItems.map(([label, Icon]) => <button key={label} className={activeMenu === label ? 'is-active' : ''} onClick={() => { setActiveMenu(label); setSidebarOpen(false); document.getElementById(label.toLowerCase().replaceAll(' ', '-'))?.scrollIntoView() }}><Icon /> {label}</button>)}</nav>
        <div className="admin-sidebar__quote">MAKE<br />SOMETHING<br /><em>BEAUTIFUL</em><br />TODAY.</div>
        <button className="admin-signout" onClick={signOut}><LogOut /> Sign out</button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu /></button>
          <label className="admin-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookings, customers, cities or activities..." /></label>
          <button className="admin-bell" aria-label="Notifications"><Bell /><span /></button>
          <button className="admin-profile" onClick={() => setSecurityOpen(true)} title="Account security">
            <span className="admin-avatar">G</span><span><strong>{user.name}</strong><small>Owner</small></span><ChevronDown />
          </button>
        </header>

        <div className="admin-content" id="overview">
          <div className="admin-welcome"><div><span className="admin-mobile-section">{activeMenu}</span><h1>Good morning, {user.name.split(' ')[0]}</h1><p>Live bookings, payments and revenue from your database.</p></div><button className="button button--outline" onClick={() => setSecurityOpen(true)}><ShieldCheck /> Security</button></div>
          {error && <div className="form-error admin-error">{error}</div>}

          <section className="admin-metrics">
            <article><i className="metric-icon metric-icon--coral"><CalendarDays /></i><div><span>Today’s bookings</span><strong>{metrics.todayBookings}</strong><small>{metrics.totalBookings} bookings in total</small></div></article>
            <article><i className="metric-icon metric-icon--green"><IndianRupee /></i><div><span>This month</span><strong>{formatPrice(metrics.thisMonthRevenue)}</strong><small>Total paid revenue · <b>{formatPrice(metrics.totalRevenue)}</b></small></div></article>
            <article><i className="metric-icon metric-icon--gold"><Clock3 /></i><div><span>Pending payments</span><strong>{metrics.pendingPayments}</strong><small>Total value · <b>{formatPrice(metrics.pendingValue)}</b></small></div></article>
          </section>

          <section className="admin-panel revenue-panel" id="monthly-revenue">
            <div className="admin-panel__heading"><div><h2>Monthly revenue</h2><p>Includes every collected ₹299 deposit, online balance and cash settlement.</p></div><CircleDollarSign /></div>
            <div className="revenue-chart">
              {(dashboard?.monthlyRevenue || []).map((item) => <div className="revenue-bar" key={item.month} title={`${item.label}: ${formatPrice(item.revenue)} from ${item.bookings} bookings`}><strong>{item.revenue ? formatPrice(item.revenue) : '—'}</strong><i style={{ height: `${Math.max(item.revenue ? 12 : 2, (item.revenue / maxRevenue) * 100)}%` }} /><span>{item.label}</span><small>{item.bookings} {item.bookings === 1 ? 'booking' : 'bookings'}</small></div>)}
            </div>
          </section>

          <section className="admin-panel pricing-panel" id="activities-&-pricing">
            <div className="admin-panel__heading"><div><h2>Activities & Pricing</h2><p>Changes are stored in the database and apply only to new bookings.</p></div></div>
            <div className="pricing-table-wrap"><table className="pricing-table"><thead><tr><th>Activity</th><th>Category</th><th>Current price</th><th>Status</th></tr></thead><tbody>{visibleActivities.map((activity) => <tr key={activity.id}><td><img src={activity.image} alt="" /><strong>{activity.title}</strong></td><td className="capitalize">{activity.category}</td><td><div className="price-input"><IndianRupee /><input aria-label={`${activity.title} price`} type="number" min="0" placeholder="Request quote" value={prices[activity.id] ?? ''} onChange={(event) => { setPrices({ ...prices, [activity.id]: event.target.value === '' ? null : Number(event.target.value) }); setDirty(new Set(dirty).add(activity.id)) }} /></div></td><td><span className="status-pill status-pill--confirmed"><i /> Active</span></td></tr>)}</tbody></table></div>
            <div className="pricing-panel__footer"><span>Showing {visibleActivities.length} of {activities.length} activities</span><button className="button button--coral" disabled={!dirty.size} onClick={savePrices}>{saved ? <><Check /> Saved</> : `Save ${dirty.size || ''} changes`}</button></div>
          </section>

          <section className="admin-panel admin-bookings" id="bookings">
            <div className="admin-panel__heading"><div><h2>All bookings</h2><p>Deposits, online balances and cash collections update revenue automatically.</p></div></div>
            <div className="pricing-table-wrap">
              <table className="pricing-table bookings-table">
                <thead><tr><th>Booking</th><th>Customer</th><th>Event</th><th>City</th><th>Payment</th><th>Status</th></tr></thead>
                <tbody>{visibleBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td><strong>{booking.id}</strong><small>{booking.activityTitle}</small></td>
                    <td><strong>{booking.customerName}</strong><small>{booking.customerEmail}</small></td>
                    <td><strong>{booking.eventDate}</strong><small>{booking.eventTime} · {booking.guests} guests</small></td>
                    <td>{booking.city}</td>
                    <td>
                      <div className="admin-payment-cell">
                        {booking.amount == null ? (
                          <div className="admin-quote-total">
                            <input aria-label={`Final total for ${booking.id}`} type="number" min={booking.amountPaid} placeholder="Final total" value={bookingAmounts[booking.id] ?? ''} onChange={(event) => setBookingAmounts({ ...bookingAmounts, [booking.id]: event.target.value })} />
                            <button disabled={settlingId === booking.id || !bookingAmounts[booking.id]} onClick={() => saveBookingAmount(booking)}>Set total</button>
                          </div>
                        ) : <strong>{formatPrice(booking.amount)} total</strong>}
                        <small>{formatPrice(booking.amountPaid)} paid · {booking.balanceAmount == null ? 'balance pending quote' : `${formatPrice(booking.balanceAmount)} due`}</small>
                        {booking.balanceAmount > 0 && booking.status !== 'cancelled' && <button className="cash-settle-button" disabled={settlingId === booking.id} onClick={() => settleBalance(booking)}>{settlingId === booking.id ? 'Updating…' : 'Mark balance paid in cash'}</button>}
                      </div>
                    </td>
                    <td><select className={`booking-status-select status-${booking.status}`} value={booking.status} onChange={(event) => changeStatus(booking.id, event.target.value)}><option value="quote_requested">Quote requested</option><option value="payment_pending">Payment pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></td>
                  </tr>
                ))}</tbody>
              </table>
              {!visibleBookings.length && <div className="admin-empty">No bookings match this search yet.</div>}
            </div>
          </section>
        </div>
      </main>

      {securityOpen && <div className="modal-backdrop" onMouseDown={() => setSecurityOpen(false)}><form className="checkout-modal security-modal" onSubmit={changePassword} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSecurityOpen(false)}><X /></button><span className="kicker">Admin security</span><h2>Change your password</h2><p>You will be signed out after the password is changed.</p>{error && <div className="form-error">{error}</div>}<div className="form-grid"><label className="span-two">Current password<input required type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} /></label><label className="span-two">New password<input required minLength="8" type="password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} /></label></div><button className="button button--coral button--wide">Change password</button></form></div>}
    </div>
  )
}
