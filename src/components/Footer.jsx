import { ArrowUpRight, Camera, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div>
          <div className="brand brand--light footer__brand">
            <span>MOMENTS</span><i>&</i><span>MAKERS</span>
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
          <span>Visit</span>
          <a href="#contact"><MapPin size={15} /> Delhi NCR</a>
          <a href="#contact"><MessageCircle size={15} /> WhatsApp us</a>
          <a href="#contact"><Camera size={15} /> Instagram</a>
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
        <span>© 2026 Moments & Makers</span>
        <div><a href="#terms">Terms</a><a href="#privacy">Privacy</a><a href="#refunds">Refunds</a></div>
      </div>
    </footer>
  )
}
