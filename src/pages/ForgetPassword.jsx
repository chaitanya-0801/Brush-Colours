
import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, CheckCircle } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {api} from '../api'

export default function ForgotPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const isResetPassword = Boolean(token)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Send reset email
  const handleForgotPassword = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess(false)

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    try {
      setLoading(true)

     await api.forgotPassword(email)

      setSuccess(true)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const handleResetPassword = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess(false)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

//       await api.post(`/auth/reset-password/${token}`, {
//   password,
//   confirmPassword
      // })
      await api.resetPassword(token, {
  password,
  confirmPassword,
})
      setSuccess(true)

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to reset password. The link may have expired.'
      )
    } finally {
      setLoading(false)
    }
  }

  /*
   * RESET PASSWORD PAGE
   * /forgotpassword/:token
   */
  if (isResetPassword) {
    return (
      <main className="forgot-page">
        <section className="forgot-card">

          <Link to="/" className="forgot-brand">
            <span>BRUSH</span>
            <i>&</i>
            <span>COLOURS</span>
          </Link>

          {!success ? (
            <>
              <div className="forgot-icon">
                <LockKeyhole />
              </div>

              <span className="kicker">
                Create a new password
              </span>

              <h1>Reset your password</h1>

              <p className="forgot-description">
                Enter a new password for your Brush&Colours
                account.
              </p>

              {error && (
                <div className="forgot-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword}>

                <label>
                  New password

                  <div className="forgot-password-input">
                    <LockKeyhole />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter new password"
                      minLength={8}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword
                        ? <EyeOff />
                        : <Eye />}
                    </button>
                  </div>
                </label>

                <label>
                  Confirm password

                  <div className="forgot-password-input">
                    <LockKeyhole />

                    <input
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm new password"
                      minLength={8}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showConfirmPassword
                        ? <EyeOff />
                        : <Eye />}
                    </button>
                  </div>
                </label>

                <button
                  className="button button--coral button--wide"
                  disabled={loading}
                >
                  {loading
                    ? 'Updating password…'
                    : (
                      <>
                        Reset password
                        <ArrowRight />
                      </>
                    )}
                </button>

              </form>

              <div className="forgot-footer">
                <Link to="/login">
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            <div className="forgot-success">

              <div className="success-icon">
                <CheckCircle />
              </div>

              <h1>Password updated!</h1>

              <p>
                Your password has been successfully changed.
                Redirecting you to the login page...
              </p>

            </div>
          )}

        </section>
      </main>
    )
  }

  /*
   * FORGOT PASSWORD PAGE
   * /forgotpassword
   */
  return (
    <main className="forgot-page">
      <section className="forgot-card">

        <Link to="/" className="forgot-brand">
          <span>BRUSH</span>
          <i>&</i>
          <span>COLOURS</span>
        </Link>

        {!success ? (
          <>
            <div className="forgot-icon">
              <Mail />
            </div>

            <span className="kicker">
              Account recovery
            </span>

            <h1>Forgot your password?</h1>

            <p className="forgot-description">
              Enter the email address associated with your
              Brush&Colours account and we'll send you a
              password reset link.
            </p>

            {error && (
              <div className="forgot-error">
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>

              <label>
                Email address

                <div className="forgot-password-input">
                  <Mail />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <button
                className="button button--coral button--wide"
                disabled={loading}
              >
                {loading
                  ? 'Sending link…'
                  : (
                    <>
                      Send reset link
                      <ArrowRight />
                    </>
                  )}
              </button>

            </form>

            <div className="forgot-footer">
              <Link to="/login">
                ← Back to sign in
              </Link>
            </div>
          </>
        ) : (
          <div className="forgot-success">

            <div className="success-icon">
              <CheckCircle />
            </div>

            <h1>Check your email</h1>

            <p>
              We've sent a password reset link to
              <strong> {email}</strong>.
            </p>

            <p className="success-small">
              Please check your inbox and spam folder.
              The link may expire after a limited time.
            </p>

            <Link
              to="/login"
              className="button button--coral button--wide"
            >
              Back to sign in
            </Link>

          </div>
        )}

      </section>
    </main>
  )
}
