import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  IndianRupee,
  LayoutDashboard,
  Menu,
  MoreVertical,
  PackageOpen,
  Plus,
  Search,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react'
import { activities, bookings, formatPrice } from '../data'

const menuItems = [
  ['Overview', LayoutDashboard],
  ['Activities & Pricing', PackageOpen],
  ['Bookings', UsersRound],
  ['Calendar', CalendarDays],
  ['Payments', WalletCards],
]

const calendarDays = [
  { day: 26, muted: true }, { day: 27, muted: true }, { day: 28, muted: true }, { day: 29, muted: true }, { day: 30, muted: true }, { day: 31, muted: true }, { day: 1 },
  { day: 2 }, { day: 3, state: 'confirmed' }, { day: 4, state: 'pending' }, { day: 5 }, { day: 6 }, { day: 7, state: 'pending' }, { day: 8 },
  { day: 9 }, { day: 10 }, { day: 11 }, { day: 12, state: 'confirmed' }, { day: 13, state: 'confirmed' }, { day: 14, selected: true }, { day: 15 },
  { day: 16 }, { day: 17, state: 'pending' }, { day: 18, state: 'confirmed' }, { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 },
  { day: 23 }, { day: 24, state: 'pending' }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 }, { day: 29 },
  { day: 30 }, { day: 1, muted: true }, { day: 2, muted: true }, { day: 3, muted: true }, { day: 4, muted: true }, { day: 5, muted: true }, { day: 6, muted: true },
]

export default function Admin() {
  const [activeMenu, setActiveMenu] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(false)
  const [prices, setPrices] = useState(() => {
    const stored = localStorage.getItem('moments-admin-prices')
    return stored ? JSON.parse(stored) : Object.fromEntries(activities.map((item) => [item.id, item.price]))
  })

  const visibleActivities = useMemo(
    () => activities.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 6),
    [query],
  )

  useEffect(() => {
    if (!saved) return undefined
    const timer = window.setTimeout(() => setSaved(false), 2400)
    return () => window.clearTimeout(timer)
  }, [saved])

  const savePrices = () => {
    localStorage.setItem('moments-admin-prices', JSON.stringify(prices))
    setSaved(true)
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X /></button>
        <div className="admin-brand">
          <strong>MOMENTS <i>&</i><br />MAKERS</strong>
          <span>ADMIN</span>
        </div>
        <small>PEOPLE · PLACES ·<br />CREATIVE EXPERIENCES</small>
        <nav>
          {menuItems.map(([label, Icon]) => (
            <button
              key={label}
              className={activeMenu === label ? 'is-active' : ''}
              onClick={() => { setActiveMenu(label); setSidebarOpen(false) }}
            >
              <Icon /> {label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__quote">MAKE<br />SOMETHING<br /><em>BEAUTIFUL</em><br />TODAY.</div>
        <div className="admin-sidebar__footer">Create · Host · Grow</div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu /></button>
          <label className="admin-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookings, customers, or activities..." /></label>
          <button className="admin-bell" aria-label="Notifications"><Bell /><span /></button>
          <button className="admin-profile">
            <span className="admin-avatar">G</span>
            <span><strong>Garima</strong><small>Owner</small></span>
            <ChevronDown />
          </button>
        </header>

        <div className="admin-content">
          <div className="admin-welcome">
            <div>
              <span className="admin-mobile-section">{activeMenu}</span>
              <h1>Good morning, Garima</h1>
              <p>Here’s what’s happening with your experiences today.</p>
            </div>
            <button className="button button--coral"><Plus /> Add new activity</button>
          </div>

          <section className="admin-metrics">
            <article>
              <i className="metric-icon metric-icon--coral"><CalendarDays /></i>
              <div><span>Today’s bookings</span><strong>6</strong><small>2 more than yesterday · <b>+33%</b></small></div>
            </article>
            <article>
              <i className="metric-icon metric-icon--green"><IndianRupee /></i>
              <div><span>This month</span><strong>₹2,84,500</strong><small>Up from last month · <b>+18%</b></small></div>
            </article>
            <article>
              <i className="metric-icon metric-icon--gold"><Clock3 /></i>
              <div><span>Pending payments</span><strong>3</strong><small>Total value · <b>₹12,497</b></small></div>
            </article>
          </section>

          <div className="admin-dashboard-grid">
            <section className="admin-panel pricing-panel">
              <div className="admin-panel__heading">
                <div><h2>Activities & Pricing</h2><p>Manage offerings and prices. Changes apply only to new bookings.</p></div>
                <button><Plus /> Add activity</button>
              </div>

              <div className="pricing-table-wrap">
                <table className="pricing-table">
                  <thead><tr><th>Activity</th><th>Category</th><th>Current price</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {visibleActivities.map((activity) => (
                      <tr key={activity.id}>
                        <td><img src={activity.image} alt="" /><strong>{activity.title}</strong></td>
                        <td className="capitalize">{activity.category}</td>
                        <td><div className="price-input"><IndianRupee /><input aria-label={`${activity.title} price`} type="number" value={prices[activity.id]} onChange={(event) => setPrices({ ...prices, [activity.id]: Number(event.target.value) })} /></div></td>
                        <td><span className="status-pill status-pill--confirmed"><i /> Active</span></td>
                        <td><button className="row-action">Edit details</button><button className="icon-only" aria-label={`More options for ${activity.title}`}><MoreVertical /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pricing-panel__footer">
                <span>Showing {visibleActivities.length} of {activities.length} activities</span>
                <div><button className="button button--outline">Cancel</button><button className="button button--coral" onClick={savePrices}>{saved ? <><Check /> Saved</> : 'Save changes'}</button></div>
              </div>
            </section>

            <aside className="admin-side-column">
              <section className="admin-panel calendar-panel">
                <div className="calendar-panel__head"><div><h2>Upcoming bookings</h2><span>June 2026</span></div><div><button><ChevronLeft /></button><button><ChevronRight /></button></div></div>
                <div className="calendar-week"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
                <div className="calendar-days">
                  {calendarDays.map((item, index) => (
                    <button key={`${item.day}-${index}`} className={`${item.muted ? 'is-muted' : ''} ${item.selected ? 'is-selected' : ''}`}>
                      {item.day}{item.state && <i className={`day-state day-state--${item.state}`} />}
                    </button>
                  ))}
                </div>
                <div className="calendar-legend"><span><i className="legend-confirmed" />Confirmed</span><span><i className="legend-pending" />Payment pending</span><span><i className="legend-blocked" />Blocked</span></div>
              </section>

              <section className="admin-panel next-bookings">
                <div className="next-bookings__head"><h2>Next bookings</h2><button>View all <ChevronRight /></button></div>
                {bookings.map((booking) => (
                  <article key={booking.id}>
                    <div className="booking-date"><strong>{booking.day}</strong><span>{booking.month}</span></div>
                    <div className="booking-copy"><strong>{booking.activity}</strong><span>{booking.time}</span><span>{booking.guests} participants</span></div>
                    <span className={`status-pill status-pill--${booking.status.toLowerCase().replace(' ', '-')}`}><i />{booking.status}</span>
                  </article>
                ))}
              </section>

              <section className="admin-panel revenue-note">
                <CircleDollarSign />
                <div><strong>Payments are healthy</strong><span>97.6% successful this month</span></div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
