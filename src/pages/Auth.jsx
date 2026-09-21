import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, register, loading, user } = useAuth()
  const isSignup = location.pathname === '/signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = isSignup ? await register(form) : await login({ email: form.email, password: form.password })
      const requested = searchParams.get('next')
      navigate(requested || (user.role === 'admin' ? '/admin' : '/bookings'), { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="page-loader"><span /></div>
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/profile'} replace />

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link className="brand brand--light" to="/"><span>BRUSH</span><i>&</i><span>COLOURS</span></Link>
        <div><span className="kicker kicker--light">Create · celebrate · remember</span><h1>Your next beautiful<br /><em>experience starts here.</em></h1></div>
        <p>Book creative experiences across Delhi, Kota, Bombay, Pune, Jaipur and Gujarat.</p>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <span className="kicker">{isSignup ? 'Join Brush&Colours' : 'Welcome back'}</span>
          <h2>{isSignup ? 'Create your account' : 'Sign in to continue'}</h2>
          <p>{isSignup ? 'Save your details and manage every booking in one place.' : 'View bookings, complete payments or open the admin workspace.'}</p>
          {error && <div className="form-error" role="alert">{error}</div>}
          {isSignup && <label>Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" placeholder="Your full name" /></label>}
          <label>Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" placeholder="you@example.com" /></label>
          <label>Password<div className="password-field"><input required minLength={8} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
          <button className="button button--coral button--wide" disabled={submitting}>{submitting ? 'Please wait…' : <>{isSignup ? 'Create account' : 'Sign in'} <ArrowRight /></>}</button>
          <div className="auth-switch">{isSignup ? 'Already have an account?' : 'New to Brush&Colours?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create one'}</Link></div>
          <small><ShieldCheck /> Your password is securely hashed and never shown to the owner.</small>
        </form>
      </section>
    </main>
  )
}
