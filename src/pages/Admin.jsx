import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays, CircleDollarSign, Clock3, Edit3, IndianRupee, LayoutDashboard,
  LogOut, Menu, MessageSquareText, Moon, PackageOpen, Plus, Search, ShieldCheck, Sun, Trash2,
  UsersRound, WalletCards, X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import AdminActivityEditor from '../components/AdminActivityEditor'
import { useActivities } from '../context/ActivityContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../data'
import { useTheme } from '../context/ThemeContext'

const menuItems = [
  ['Overview', LayoutDashboard],
  ['Activities & Pricing', PackageOpen],
  ['Group Enquiries', MessageSquareText],
  ['Bookings', UsersRound],
  ['Monthly Revenue', WalletCards],
]

const statusLabel = (status) => ({ quote_requested: 'Quote requested', payment_pending: 'Payment pending', confirmed: 'Confirmed', cancelled: 'Cancelled' }[status] || status)

const greetingForTime = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Admin() {
  const [activeMenu, setActiveMenu] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [allBookings, setAllBookings] = useState([])
  const [adminActivities, setAdminActivities] = useState([])
  const [groupInquiries, setGroupInquiries] = useState([])
  const [bookingAmounts, setBookingAmounts] = useState({})
  const [guestChanges, setGuestChanges] = useState({})
  const [settlingId, setSettlingId] = useState('')
  const [activityEditor, setActivityEditor] = useState(false)
  const [error, setError] = useState('')
  const [securityOpen, setSecurityOpen] = useState(false)
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [greeting, setGreeting] = useState(greetingForTime)
  const { refreshActivities } = useActivities()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const loadDashboard = async () => {
    try {
      const [dashboardResult, bookingResult, activityResult, inquiryResult] = await Promise.all([api.adminDashboard(), api.adminBookings(), api.getAdminActivities(), api.adminGroupInquiries()])
      setDashboard(dashboardResult)
      setAllBookings(bookingResult.bookings)
      setAdminActivities(activityResult.activities)
      setGroupInquiries(inquiryResult.inquiries)
      setBookingAmounts(Object.fromEntries(bookingResult.bookings.map((booking) => [booking.id, booking.amount ?? ''])))
      setGuestChanges(Object.fromEntries(bookingResult.bookings.map((booking) => [booking.id, { guests: booking.guests, percentage: booking.guestAdjustment?.percentagePerGuest || 0 }])))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => { loadDashboard() }, [])
  useEffect(() => {
    const timer = window.setInterval(() => setGreeting(greetingForTime()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const visibleActivities = useMemo(() => adminActivities.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())), [adminActivities, query])
  const visibleBookings = useMemo(() => allBookings.filter((booking) => `${booking.id} ${booking.activityTitle} ${booking.customerName} ${booking.customerEmail} ${booking.city}`.toLowerCase().includes(query.toLowerCase())), [allBookings, query])
  const visibleGroupInquiries = useMemo(() => groupInquiries.filter((inquiry) => `${inquiry.reference} ${inquiry.fullName} ${inquiry.email} ${inquiry.city} ${inquiry.activityPreference}`.toLowerCase().includes(query.toLowerCase())), [groupInquiries, query])

  const activitySaved = async () => {
    await Promise.all([loadDashboard(), refreshActivities()])
    setActivityEditor(false)
  }

  const deleteActivity = async (activity) => {
    if (!window.confirm(`Archive “${activity.title}”? It will disappear from the customer website, but existing bookings will be preserved.`)) return
    setError('')
    try {
      await api.deleteActivity(activity.id)
      await activitySaved()
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

  const recalculateGuests = async (booking) => {
    setSettlingId(booking.id)
    setError('')
    try {
      await api.updateBookingGuests(booking.id, { ...guestChanges[booking.id], reason: 'Guest count updated by admin' })
      await loadDashboard()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSettlingId('')
    }
  }

  const completeRefund = async (booking) => {
    if (!window.confirm(`Confirm that ${formatPrice(booking.cancellation.refundableAmount)} has been refunded outside the website?`)) return
    setSettlingId(booking.id)
    try {
      await api.completeRefund(booking.id)
      await loadDashboard()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSettlingId('')
    }
  }

  const changeGroupInquiryStatus = async (id, status) => {
    setError('')
    try {
      const result = await api.updateGroupInquiryStatus(id, status)
      setGroupInquiries((current) => current.map((item) => item.id === id ? result.inquiry : item))
    } catch (requestError) {
      setError(requestError.message)
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
          <label className="admin-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookings, group enquiries, customers or activities..." /></label>
          <button className="admin-theme" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun /> : <Moon />}</button>
          <div className="admin-profile" title="Signed-in administrator">
            <span className="admin-avatar">{user.name.trim().charAt(0).toUpperCase()}</span><span><strong>{user.name}</strong><small>Owner</small></span>
          </div>
        </header>

        <div className="admin-content" id="overview">
          <div className="admin-welcome"><div><span className="admin-mobile-section">{activeMenu}</span><h1>{greeting}, {user.name.split(' ')[0]}</h1><p>Live bookings, payments and revenue from your database.</p></div><button className="button button--outline" onClick={() => setSecurityOpen(true)}><ShieldCheck /> Security</button></div>
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
            <div className="admin-panel__heading"><div><h2>Activities & Pricing</h2><p>Add events, upload photos, edit descriptions, choose cities and create customer-facing time slots.</p></div><button className="button button--coral" onClick={() => setActivityEditor({ mode: 'create' })}><Plus /> Add event</button></div>
            <div className="pricing-table-wrap"><table className="pricing-table"><thead><tr><th>Activity</th><th>Category</th><th>Price</th><th>Time slots</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleActivities.map((activity) => <tr key={activity.id}><td><img src={activity.image} alt="" /><span><strong>{activity.title}</strong><small>{activity.short}</small></span></td><td className="capitalize">{activity.category}</td><td><strong>{formatPrice(activity.price)}</strong><small>{activity.priceUnit}</small></td><td><strong>{activity.timeSlots.length}</strong><small>{activity.locations.length} cities</small></td><td><span className={`status-pill ${activity.active ? 'status-pill--confirmed' : 'status-pill--cancelled'}`}><i /> {activity.active ? 'Active' : 'Hidden'}</span></td><td><div className="admin-row-actions"><button onClick={() => setActivityEditor({ mode: 'edit', activity })} title="Edit event"><Edit3 /></button><button className="danger" onClick={() => deleteActivity(activity)} title="Archive event"><Trash2 /></button></div></td></tr>)}</tbody></table></div>
            <div className="pricing-panel__footer"><span>Showing {visibleActivities.length} of {adminActivities.length} database events</span><span>Archived events keep their existing bookings.</span></div>
          </section>

          <section className="admin-panel admin-group-enquiries" id="group-enquiries">
            <div className="admin-panel__heading"><div><h2>Group enquiries</h2><p>Requests submitted through the Group Events form. Contact customers directly and update each enquiry as you handle it.</p></div><MessageSquareText /></div>
            <div className="pricing-table-wrap">
              <table className="pricing-table group-enquiries-table">
                <thead><tr><th>Reference</th><th>Customer</th><th>Event</th><th>Group</th><th>Request</th><th>Status</th></tr></thead>
                <tbody>{visibleGroupInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td><strong>{inquiry.reference}</strong><small>{new Date(inquiry.createdAt).toLocaleDateString('en-IN')}</small></td>
                    <td><strong>{inquiry.fullName}</strong><small>{inquiry.email}</small><a className="admin-contact-link" href={`https://wa.me/${inquiry.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{inquiry.whatsappNumber}</a></td>
                    <td><strong>{inquiry.eventDate}</strong><small>{inquiry.eventType} · {inquiry.city}</small></td>
                    <td><strong>{inquiry.participants} participants</strong><small>{inquiry.organizationName || 'Personal group'}</small></td>
                    <td><strong>{inquiry.activityPreference}</strong><small title={inquiry.details}>{inquiry.details}</small></td>
                    <td><select className={`booking-status-select status-${inquiry.status}`} value={inquiry.status} onChange={(event) => changeGroupInquiryStatus(inquiry.id, event.target.value)}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></td>
                  </tr>
                ))}</tbody>
              </table>
              {!visibleGroupInquiries.length && <div className="admin-empty">No group enquiries match this search yet.</div>}
            </div>
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
                    <td><strong>{booking.eventDate}</strong><small>{booking.eventTime} · {booking.guests} guests</small><details className="guest-adjuster"><summary>Adjust guests & price</summary><label>Guests<input type="number" min="1" value={guestChanges[booking.id]?.guests ?? booking.guests} onChange={(event) => setGuestChanges({ ...guestChanges, [booking.id]: { ...guestChanges[booking.id], guests: event.target.value } })} /></label><label>% per extra guest<input type="number" min="0" max="100" step="0.5" value={guestChanges[booking.id]?.percentage ?? 0} onChange={(event) => setGuestChanges({ ...guestChanges, [booking.id]: { ...guestChanges[booking.id], percentage: event.target.value } })} /></label><button disabled={settlingId === booking.id} onClick={() => recalculateGuests(booking)}>Recalculate total</button></details></td>
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
                        {['pending', 'manual_required'].includes(booking.cancellation?.refundStatus) && <button className="cash-settle-button refund-button" disabled={settlingId === booking.id} onClick={() => completeRefund(booking)}>Confirm {formatPrice(booking.cancellation.refundableAmount)} refund processed</button>}
                      </div>
                    </td>
                    <td><select className={`booking-status-select status-${booking.status}`} value={booking.status} onChange={(event) => changeStatus(booking.id, event.target.value)}><option value="quote_requested">Quote requested</option><option value="payment_pending">Payment pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td>
                  </tr>
                ))}</tbody>
              </table>
              {!visibleBookings.length && <div className="admin-empty">No bookings match this search yet.</div>}
            </div>
          </section>
        </div>
      </main>

      {securityOpen && <div className="modal-backdrop" onMouseDown={() => setSecurityOpen(false)}><form className="checkout-modal security-modal" onSubmit={changePassword} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSecurityOpen(false)}><X /></button><span className="kicker">Admin security</span><h2>Change your password</h2><p>You will be signed out after the password is changed.</p>{error && <div className="form-error">{error}</div>}<div className="form-grid"><label className="span-two">Current password<input required type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} /></label><label className="span-two">New password<input required minLength="8" type="password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} /></label></div><button className="button button--coral button--wide">Change password</button></form></div>}
      {activityEditor && <AdminActivityEditor activity={activityEditor.mode === 'edit' ? activityEditor.activity : null} onClose={() => setActivityEditor(false)} onSaved={activitySaved} />}
    </div>
  )
}
