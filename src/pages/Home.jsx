import { useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Check, Pause, Play, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ExperienceCard from '../components/ExperienceCard'
import { activities, categoryMeta } from '../data'

const categories = ['birthday', 'wedding', 'workshop']

export default function Home() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)

  const toggleVideo = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setPlaying(true)
    } else {
      videoRef.current.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="home-page">
      <Header overlay />

      <main>
        <section className="hero">
          <video
            ref={videoRef}
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster={categoryMeta.workshop.image}
          >
            <source src="/media/hero-pottery.mp4" type="video/mp4" />
          </video>
          <div className="hero__veil" />
          <div className="shell hero__content">
            <span className="hero__eyebrow">DELHI NCR · EXPERIENCES AT YOUR VENUE</span>
            <h1>Make every gathering <em>unforgettable.</em></h1>
            <p>Curated activities for birthdays, weddings and creative weekends.</p>
            <div className="hero__actions">
              <Link className="button button--coral button--large" to="/experiences">
                Explore experiences <ArrowRight />
              </Link>
              <a className="button button--ghost-light button--large" href="#custom-event">
                Plan a custom event <ArrowRight />
              </a>
            </div>
          </div>

          <div className="shell hero__footer">
            <a className="hero__scroll" href="#categories">Scroll <ArrowDown /></a>
            <div className="hero__stats">
              <span><strong>800+</strong> events</span>
              <span><strong>12,000+</strong> guests</span>
              <span><strong>4.9 ★</strong> average rating</span>
            </div>
          </div>
          <button className="hero__play" onClick={toggleVideo} aria-label={playing ? 'Pause background video' : 'Play background video'}>
            {playing ? <Pause /> : <Play />}
          </button>
        </section>

        <section className="section section--paper" id="categories">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div>
                <span className="kicker">Begin with the moment</span>
                <h2>Three ways to make<br /><em>people feel closer.</em></h2>
              </div>
              <p>Choose an occasion, then discover hosts, artists and makers who turn a gathering into a story worth retelling.</p>
            </div>

            <div className="category-grid">
              {categories.map((category, index) => {
                const meta = categoryMeta[category]
                return (
                  <Link className="category-card" to={`/experiences?category=${category}`} key={category}>
                    <img src={meta.image} alt="" />
                    <div className="category-card__shade" />
                    <span className="category-card__number">0{index + 1}</span>
                    <div className="category-card__content">
                      <span>{meta.eyebrow}</span>
                      <h3>{meta.label}</h3>
                      <p>{meta.description}</p>
                      <i><ArrowRight /></i>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section section--light">
          <div className="shell">
            <div className="section-heading section-heading--split section-heading--centered">
              <div>
                <span className="kicker">Popular now</span>
                <h2>Experiences people<br /><em>keep talking about.</em></h2>
              </div>
              <Link className="text-link" to="/experiences">View all experiences <ArrowRight /></Link>
            </div>
            <div className="experience-grid experience-grid--three">
              {activities.slice(0, 3).map((activity) => (
                <ExperienceCard activity={activity} key={activity.id} />
              ))}
            </div>
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="shell story-section__grid">
            <div className="story-section__visual">
              <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1400&q=85" alt="Hands shaping clay on a pottery wheel" />
              <div className="story-section__note">
                <Sparkles />
                <span>Designed for real connection—not perfect poses.</span>
              </div>
            </div>
            <div className="story-section__copy">
              <span className="kicker kicker--light">Why Moments & Makers</span>
              <h2>More than an activity.<br /><em>It’s the feeling after.</em></h2>
              <p>We bring together thoughtful hosts, skilled makers and beautifully run experiences. You arrive, settle in and enjoy the people you came with—we handle the rest.</p>
              <ul>
                <li><Check /> Carefully selected facilitators</li>
                <li><Check /> Clear prices and inclusions</li>
                <li><Check /> Small details handled for you</li>
              </ul>
              <Link className="button button--ivory" to="/experiences">Find your experience <ArrowRight /></Link>
            </div>
          </div>
        </section>

        <section className="section section--paper how-it-works">
          <div className="shell">
            <div className="section-heading section-heading--center">
              <span className="kicker">Simple from start to finish</span>
              <h2>Your next good day,<br /><em>booked in minutes.</em></h2>
            </div>
            <div className="steps-grid">
              {[
                ['01', 'Choose your experience', 'Compare prices, formats and guest limits with no hidden surprises.'],
                ['02', 'Pick a date and time', 'See real availability. Same-day dates stay closed so every event is properly prepared.'],
                ['03', 'Pay and relax', 'Confirm securely, receive your booking details and let us coordinate the experience.'],
              ].map(([number, title, text]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="custom-event" id="custom-event">
          <div className="custom-event__image" />
          <div className="custom-event__veil" />
          <div className="shell custom-event__content">
            <span className="kicker kicker--light">For teams, families and big plans</span>
            <h2>Have something<br /><em>more personal in mind?</em></h2>
            <p>Tell us the occasion, guest count and mood. We’ll shape an experience around your people.</p>
            <a className="button button--ivory button--large" href="mailto:hello@momentsandmakers.in">Plan a custom event <ArrowRight /></a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
