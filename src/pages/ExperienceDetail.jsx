import { ArrowLeft, Check, Clock3, MapPin, ShieldCheck, Star, UsersRound } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BookingPanel from '../components/BookingPanel'
import ExperienceCard from '../components/ExperienceCard'
import { activities } from '../data'

export default function ExperienceDetail() {
  const { id } = useParams()
  const activity = activities.find((item) => item.id === id)

  if (!activity) return null

  const related = activities.filter((item) => item.category === activity.category && item.id !== activity.id).slice(0, 3)

  return (
    <div className="detail-page">
      <Header />
      <main>
        <div className="shell detail-back"><Link to={`/experiences?category=${activity.category}`}><ArrowLeft /> Back to experiences</Link></div>
        <section className="shell detail-layout">
          <div className="detail-main">
            <div className="detail-image">
              <img src={activity.image} alt={`${activity.title} experience`} />
              <span>{activity.badge}</span>
            </div>
            <div className="detail-heading">
              <span className="kicker">{activity.category} experience</span>
              <h1>{activity.title}</h1>
              <div className="detail-rating"><Star fill="currentColor" /> {activity.rating} <span>({activity.reviews} reviews)</span></div>
            </div>
            <div className="detail-facts">
              <span><Clock3 /> <b>{activity.duration}</b><small>Experience length</small></span>
              <span><UsersRound /> <b>{activity.guests}</b><small>Group size</small></span>
              <span><MapPin /> <b>{activity.location}</b><small>Service area</small></span>
              <span><ShieldCheck /> <b>Verified host</b><small>Curated by our team</small></span>
            </div>
            <article className="detail-copy">
              <h2>About this experience</h2>
              <p>{activity.description}</p>
              <h2>What’s included</h2>
              <ul>{activity.includes.map((item) => <li key={item}><Check /> {item}</li>)}</ul>
              <div className="detail-note">
                <strong>Good to know</strong>
                <p>The exact setup and material choices are confirmed after booking. Please allow clear access to the activity area 45 minutes before the session.</p>
              </div>
            </article>
          </div>
          <BookingPanel activity={activity} />
        </section>

        {!!related.length && (
          <section className="section section--paper related-section">
            <div className="shell">
              <div className="section-heading"><span className="kicker">You might also like</span><h2>More ways to<br /><em>make a moment.</em></h2></div>
              <div className="experience-grid experience-grid--three">
                {related.map((item) => <ExperienceCard activity={item} key={item.id} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
