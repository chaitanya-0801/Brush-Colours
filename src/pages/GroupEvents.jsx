import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Building2, CalendarDays, CheckCircle2, MapPin, MessageCircle, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useActivities } from '../context/ActivityContext'
import { useAuth } from '../context/AuthContext'
import { serviceCities } from '../data'

const tomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10)
}

const initialForm = {
  fullName: '', eventType: 'Corporate event', organizationName: '', whatsappNumber: '', email: '',
  eventDate: tomorrow(), city: 'Delhi', participants: 10, activityPreference: '', details: '',
}

export default function GroupEvents() {
  const { activities } = useActivities()
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const workshopNames = useMemo(() => activities.filter((item) => item.category === 'workshop').map((item) => item.title), [activities])

  useEffect(() => {
    if (!user) return
    setForm((current) => ({ ...current, fullName: current.fullName || user.name, email: current.email || user.email }))
  }, [user])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const result = await api.createGroupInquiry({ ...form, participants: Number(form.participants) })
      setSubmitted(result.inquiry)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="group-events-page">
      <Header />
      <main>
        <section className="group-events-hero">
          <div className="shell group-events-hero__content">
            <span className="kicker kicker--light">Made for teams, families and celebrations</span>
            <h1>Bring people together.<br /><em>We’ll shape the experience.</em></h1>
            <p>Tell us about your group and we’ll recommend the right activity, format and package for your date.</p>
            <div className="workshop-modes workshop-modes--hero">
              <Link to="/experiences?category=workshop">Book a Workshop</Link>
              <Link className="is-active" to="/group-events">Group Events</Link>
            </div>
          </div>
        </section>

        <section className="section group-enquiry-section">
          <div className="shell">
            {submitted ? (
              <div className="group-enquiry-success"><CheckCircle2 /><span className="kicker">Enquiry received</span><h2>Thank you, {submitted.fullName.split(' ')[0]}.</h2><p>Your reference is <strong>{submitted.reference}</strong>. The Brush&amp;Colours team will contact you on WhatsApp to discuss the plan.</p><div><Link className="button button--dark" to="/experiences?category=workshop">Browse workshops</Link><a className="button button--coral" href="https://wa.me/916378788998" target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp us</a></div></div>
            ) : (
              <div className="group-enquiry-layout">
                <div className="group-enquiry-intro"><span className="kicker">Group enquiry</span><h2>Tell us what you’re planning.</h2><p>Share the essentials and the owner will contact you with ideas, availability and a personalised quote.</p><ul><li><Building2 /> Corporate and team events</li><li><UsersRound /> Family and personal celebrations</li><li><CalendarDays /> Date-specific planning</li><li><MapPin /> Available across all six service cities</li></ul></div>
                <form className="group-enquiry-form" onSubmit={submit}>
                  {error && <div className="form-error span-two">{error}</div>}
                  <label>Full name<input required minLength="2" value={form.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="Your full name" /></label>
                  <label>Kind of event<select value={form.eventType} onChange={(event) => update('eventType', event.target.value)}><option>Corporate event</option><option>Personal event</option><option>Engagement</option><option>Wedding celebration</option><option>Birthday celebration</option><option>Team building</option><option>Other</option></select></label>
                  <label className="span-two">Organisation name <small>Optional for personal events</small><input value={form.organizationName} onChange={(event) => update('organizationName', event.target.value)} placeholder="Company, school or organisation" /></label>
                  <label>WhatsApp number<input required type="tel" autoComplete="tel" value={form.whatsappNumber} onChange={(event) => update('whatsappNumber', event.target.value)} placeholder="+91 98765 43210" /></label>
                  <label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" /></label>
                  <label>Date of event<input required type="date" min={tomorrow()} value={form.eventDate} onChange={(event) => update('eventDate', event.target.value)} /></label>
                  <label>Event city<select value={form.city} onChange={(event) => update('city', event.target.value)}>{serviceCities.map((city) => <option key={city}>{city}</option>)}</select></label>
                  <label>Number of participants<input required type="number" min="2" max="5000" value={form.participants} onChange={(event) => update('participants', event.target.value)} /></label>
                  <label>Activity preference<input required list="workshop-options" value={form.activityPreference} onChange={(event) => update('activityPreference', event.target.value)} placeholder="e.g. Pottery, resin or mixed activities" /><datalist id="workshop-options">{workshopNames.map((name) => <option key={name} value={name} />)}</datalist></label>
                  <label className="span-two">Tell us about the event<textarea required minLength="10" rows="5" value={form.details} onChange={(event) => update('details', event.target.value)} placeholder="Share the occasion, preferred setup, venue details and anything else we should know." /></label>
                  <button className="button button--coral span-two" disabled={submitting}>{submitting ? 'Sending enquiry…' : <>Send group enquiry <ArrowRight /></>}</button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
