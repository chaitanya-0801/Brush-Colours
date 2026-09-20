import { Clock3, Heart, MapPin, Star, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data'

export default function ExperienceCard({ activity, compact = false }) {
  return (
    <article className={`experience-card ${compact ? 'experience-card--compact' : ''}`}>
      <Link className="experience-card__media" to={`/experience/${activity.id}`}>
        <img src={activity.image} alt="" loading="lazy" />
        <span className="experience-card__badge">{activity.badge}</span>
        <button
          className="heart-button"
          aria-label={`Save ${activity.title}`}
          onClick={(event) => event.preventDefault()}
        >
          <Heart size={19} />
        </button>
      </Link>
      <div className="experience-card__body">
        <div className="experience-card__title-row">
          <div>
            <span className="experience-card__category">{activity.category}</span>
            <h3><Link to={`/experience/${activity.id}`}>{activity.title}</Link></h3>
          </div>
          <p className="experience-card__price">
            <strong>{formatPrice(activity.price)}</strong>
            <span>{activity.priceUnit}</span>
          </p>
        </div>
        {!compact && <p className="experience-card__description">{activity.short}</p>}
        <div className="experience-card__meta">
          <span><UsersRound size={15} />{activity.guests}</span>
          <span><Clock3 size={15} />{activity.duration}</span>
          <span><MapPin size={15} />{activity.location}</span>
        </div>
        <div className="experience-card__footer">
          <span><Star size={15} fill="currentColor" /> {activity.rating} <small>({activity.reviews})</small></span>
          <Link to={`/experience/${activity.id}`}>View details</Link>
        </div>
      </div>
    </article>
  )
}
