import { ArrowUpRight, Camera, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { serviceCities } from '../data'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div>
          <div className="brand brand--light footer__brand">
            <span>BRUSH</span><i>&</i><span>COLOURS</span>
          </div>
          <p className="footer__statement">Create together.<br />Celebrate beautifully.</p>
        </div>

        <div className="footer__links">
          <span>Explore</span>
          <Link to="/experiences?category=birthday">Birthdays</Link>
          <Link to="/experiences?category=wedding">Weddings</Link>
          <Link to="/experiences?category=workshop">Workshops</Link>
        </div>

        <div className="footer__links">
          <span>Contact</span>
          <span className="footer__cities"><MapPin size={15} /> {serviceCities.join(' · ')}</span>
          <a href="tel:+916378788998"><Phone size={15} /> +91 63787 88998</a>
          <a href="https://wa.me/916378788998" target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp us</a>
          <a href="https://www.instagram.com/brush__colours/" target="_blank" rel="noreferrer"><Camera size={15} /> @brush__colours</a>
        </div>

        <div className="footer__newsletter">
          <span>New experiences, occasionally.</span>
          <form onSubmit={(event) => event.preventDefault()}>
            <input type="email" aria-label="Email address" placeholder="Your email address" />
            <button aria-label="Subscribe"><ArrowUpRight /></button>
          </form>
        </div>
      </div>
      <div className="shell footer__bottom">
        <span>© 2026 Brush&amp;Colours</span>
        <div><a href="#terms">Terms</a><a href="#privacy">Privacy</a><a href="#refunds">Refunds</a></div>
      </div>
    </footer>
  )
}
