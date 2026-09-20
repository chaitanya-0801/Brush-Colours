import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CalendarDays, LogOut, Menu, UserRound, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { label: 'Birthdays', to: '/experiences?category=birthday' },
  { label: 'Weddings', to: '/experiences?category=wedding' },
  { label: 'Workshops', to: '/experiences?category=workshop' },
]

export default function Header({ overlay = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname, location.search])

  useEffect(() => {
    if (!menuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const darkText = !overlay || scrolled

  return (
    <>
      <header className={`site-header ${overlay ? 'site-header--overlay' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="shell site-header__inner">
          <Link className={`brand ${darkText ? '' : 'brand--light'}`} to="/" aria-label="Brush and Colours home">
            <span>BRUSH</span>
            <i>&</i>
            <span>COLOURS</span>
          </Link>

          <nav className={`desktop-nav ${darkText ? '' : 'desktop-nav--light'}`} aria-label="Main navigation">
            {links.map((link) => (
              <NavLink key={link.label} to={link.to}>
                {link.label}
              </NavLink>
            ))}
            <a href="/#story">Our story</a>
          </nav>

          <div className="header-actions">
            <Link className={`icon-link ${darkText ? '' : 'icon-link--light'}`} to={user ? '/bookings' : '/login'} aria-label={user ? 'My bookings' : 'Sign in'}>
              <CalendarDays size={19} />
            </Link>
            <Link className={`icon-link ${darkText ? '' : 'icon-link--light'}`} to={user?.role === 'admin' ? '/admin' : '/login'} aria-label={user?.role === 'admin' ? 'Admin dashboard' : 'Account'}>
              <UserRound size={19} />
            </Link>
            <Link className="button button--coral button--small header-cta" to="/experiences">
              Find an experience
            </Link>
            <button
              className={`menu-button ${darkText ? '' : 'menu-button--light'}`}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <nav
        id="mobile-navigation"
        className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <button className="mobile-menu__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <X />
        </button>
        <div className="mobile-menu__content">
          <span className="mobile-menu__eyebrow">Explore with us</span>
          <div className="mobile-menu__links">
            {links.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
            <a href="/#story" onClick={() => setMenuOpen(false)}>Our story</a>
            {user ? <Link to={user.role === 'admin' ? '/admin' : '/bookings'}>{user.role === 'admin' ? 'Admin dashboard' : 'My bookings'}</Link> : <Link to="/login">Sign in</Link>}
          </div>
          <div className="mobile-menu__footer">
            {user && <button className="mobile-menu__logout" onClick={logout}><LogOut /> Sign out</button>}
            <Link className="button button--coral" to="/experiences">Explore experiences</Link>
          </div>
        </div>
      </nav>
    </>
  )
}
