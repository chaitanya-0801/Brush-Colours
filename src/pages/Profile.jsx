import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Heart, LogOut, Mail, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import ExperienceCard from '../components/ExperienceCard'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useActivities } from '../context/ActivityContext'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { activities } = useActivities()
  const { user, logout } = useAuth()
  const [bookingCount, setBookingCount] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user.role === 'admin') return
    api.myBookings()
      .then(({ bookings }) => setBookingCount(bookings.length))
      .catch(() => setBookingCount(0))
  }, [user.role])

  const savedActivities = useMemo(
    () => activities.filter((activity) => user.favoriteActivityIds?.includes(activity.id)),
    [activities, user.favoriteActivityIds],
  )

  const signOut = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Recently'

  return (
    <div className="profile-page">
      <Header />
      <main className="account-page">
        <section className="shell profile-heading">
          <div><span className="kicker">Your account</span><h1>Hello, {user.name.split(' ')[0]}.</h1><p>Your details, bookings and favourite experiences in one place.</p></div>
          {user.role === 'admin' && <Link className="button button--coral" to="/admin">Open admin dashboard</Link>}
        </section>

        <section className="shell profile-layout">
          <aside className="profile-card">
            <div className="profile-avatar">{user.name.trim().charAt(0).toUpperCase()}</div>
            <h2>{user.name}</h2>
            <span className="profile-role">{user.role === 'admin' ? 'Administrator' : 'Customer'}</span>
            <dl>
              <div><dt><Mail /> Email</dt><dd>{user.email}</dd></div>
              <div><dt><CalendarDays /> Member since</dt><dd>{joined}</dd></div>
            </dl>
            <button className="button button--outline button--wide" onClick={signOut}><LogOut /> Sign out</button>
          </aside>

          <div className="profile-content">
            <div className="profile-stats">
              <Link to="/bookings"><CalendarDays /><span><strong>{bookingCount ?? '—'}</strong>Bookings</span></Link>
              <a href="#saved"><Heart /><span><strong>{savedActivities.length}</strong>Saved experiences</span></a>
              <div><UserRound /><span><strong>{user.name.split(' ')[0]}</strong>Account holder</span></div>
            </div>

            <section className="profile-saved" id="saved">
              <div className="profile-section-heading"><div><span className="kicker">Saved for later</span><h2>Your favourites</h2></div><Link to="/experiences">Explore all</Link></div>
              {savedActivities.length ? (
                <div className="experience-grid experience-grid--three">
                  {savedActivities.map((activity) => <ExperienceCard key={activity.id} activity={activity} compact />)}
                </div>
              ) : (
                <div className="account-empty account-empty--compact"><Heart /><h2>No favourites yet</h2><p>Tap the heart on an experience and it will be saved here in your account.</p><Link className="button button--coral" to="/experiences">Find experiences</Link></div>
              )}
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
