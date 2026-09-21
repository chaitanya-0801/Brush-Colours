import { Clock3, Heart, MapPin, Star, UsersRound } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { formatPrice } from '../data'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function ExperienceCard({ activity, compact = false }) {
  const { user, toggleFavorite } = useAuth()
  const [saving, setSaving] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const saved = user?.favoriteActivityIds?.includes(activity.id)

  const toggleSaved = async () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`)
      return
    }
    if (user.role === 'admin' || saving) return
    setSaving(true)
    try {
      await toggleFavorite(activity.id)
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className={`experience-card ${compact ? 'experience-card--compact' : ''}`}>
      <div className="experience-card__media">
        <Link className="experience-card__image-link" to={`/experience/${activity.id}`} aria-label={`View ${activity.title}`}>
          <img src={activity.image} alt={activity.title} loading="lazy" />
        </Link>
        <span className="experience-card__badge">{activity.badge}</span>
        {user?.role !== 'admin' && <button
          type="button"
          className={`heart-button ${saved ? 'is-saved' : ''}`}
          aria-label={saved ? `Remove ${activity.title} from favourites` : `Save ${activity.title}`}
          aria-pressed={Boolean(saved)}
          disabled={saving}
          onClick={toggleSaved}
        ><Heart size={19} fill={saved ? 'currentColor' : 'none'} /></button>}
      </div>
      <div className="experience-card__body">
        <div className="experience-card__title-row">
          <div>
            <span className="experience-card__category">{activity.category}</span>
            <h3><Link to={`/experience/${activity.id}`}>{activity.title}</Link></h3>
          </div>
          <p className="experience-card__price">
            <strong>{formatPrice(activity.price)}</strong>
            <span>{activity.priceUnit}</span>
            <span className="experience-card__prebook">Pre-book ₹299</span>
          </p>
        </div>
        {!compact && <p className="experience-card__description">{activity.short}</p>}
        <p className="experience-card__price-note">
          {activity.price == null ? 'Custom pricing is available.' : 'The displayed amount is the base price.'}{' '}
          To negotiate, <a href="https://wa.me/916378788998?text=Hello%20Brush%26Colours%2C%20I%20would%20like%20to%20discuss%20the%20price%20of%20an%20experience." target="_blank" rel="noreferrer">contact the owner at +91 63787 88998</a>.
        </p>
        <div className="experience-card__meta">
          <span><UsersRound size={15} />{activity.guests}</span>
          <span><Clock3 size={15} />{activity.duration}</span>
          <span><MapPin size={15} />{activity.location}</span>
        </div>
        <div className="experience-card__footer">
          {activity.rating ? (
            <span><Star size={15} fill="currentColor" /> {activity.rating} <small>({activity.reviews})</small></span>
          ) : (
            <span className="new-service">New service</span>
          )}
          <Link to={`/experience/${activity.id}`}>View details</Link>
        </div>
      </div>
    </article>
  )
}
