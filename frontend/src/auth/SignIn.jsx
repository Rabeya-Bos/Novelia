import { useState } from 'react'
import { BookIcon } from '../assets/icons'

function SignIn({ onSwitchToRegister, onGoToBrowse, onBackHome, onLogin, isSubmitting, errorMessage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password) return

    await onLogin?.({ email: email.trim().toLowerCase(), password })
  }

  return (
    <div className="page auth-page">
      <header className="topbar">
        <button className="brand" type="button" onClick={onBackHome}>
          <div className="brand-mark" aria-label="Novelia logo">
            <BookIcon />
          </div>
          <span>Novelia</span>
        </button>
        <button className="secondary-btn" type="button" onClick={onBackHome}>
          Back home
        </button>
      </header>

      <main className="auth-page-body">
        <section className="auth-card auth-card-full">
          <div className="auth-tabs">
            <button className="tab-btn" type="button" onClick={onSwitchToRegister}>
              Register
            </button>
            <button className="tab-btn active" type="button">
              Sign in
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-heading">
              <p className="eyebrow">Welcome</p>
              <h2>Login to Novelia</h2>
            </div>
            <p className="auth-subtitle">
              Access your saved books, likes, and reading community.
            </p>

            <input type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />

            {errorMessage ? <p className="profile-message">{errorMessage}</p> : null}

            <button type="submit" className="primary-btn auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>

            <p className="auth-subtitle">
              Not registered yet?{' '}
              <button className="text-link" type="button" onClick={onSwitchToRegister}>
                Create an account
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

export default SignIn
