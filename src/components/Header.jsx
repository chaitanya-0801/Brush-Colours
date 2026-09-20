import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CalendarDays, Menu, UserRound, X } from 'lucide-react'

const links = [
  { label: 'Birthdays', to: '/experiences?category=birthday' },
  { label: 'Weddings', to: '/experiences?category=wedding' },
  { label: 'Workshops', to: '/experiences?category=workshop' },
]

export default function Header({ overlay = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname, location.search])

  const darkText = !overlay || scrolled

  return (
    <header className={`site-header ${overlay ? 'site-header--overlay' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="shell site-header__inner">
        <Link className={`brand ${darkText ? '' : 'brand--light'}`} to="/" aria-label="Moments and Makers home">
          <span>MOMENTS</span>
          <i>&</i>
          <span>MAKERS</span>
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
          <Link className={`icon-link ${darkText ? '' : 'icon-link--light'}`} to="/experiences" aria-label="My bookings">
            <CalendarDays size={19} />
          </Link>
          <Link className={`icon-link ${darkText ? '' : 'icon-link--light'}`} to="/admin" aria-label="Admin dashboard">
            <UserRound size={19} />
          </Link>
          <Link className="button button--coral button--small header-cta" to="/experiences">
            Find an experience
          </Link>
          <button
            className={`menu-button ${darkText ? '' : 'menu-button--light'}`}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <button className="mobile-menu__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <X />
        </button>
        <span className="mobile-menu__eyebrow">Explore with us</span>
        {links.map((link) => (
          <Link key={link.label} to={link.to}>
            {link.label}
          </Link>
        ))}
        <a href="/#story" onClick={() => setMenuOpen(false)}>Our story</a>
        <Link className="button button--coral" to="/experiences">Explore experiences</Link>
      </div>
    </header>
  )
}
