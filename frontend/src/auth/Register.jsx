import { useState } from 'react'
import { BookIcon } from '../assets/icons'

function Register({ onSwitchToSignIn, onGoToBrowse, onBackHome, onCreateAccount, isSubmitting, errorMessage }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!fullName || !email || !password || !confirmPassword) {
      return
    }

    if (password !== confirmPassword) {
      return
    }

    await onCreateAccount?.({ fullName, email: email.trim().toLowerCase(), password, role: 'reader' })
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
            <button className="tab-btn active" type="button">
              Register
            </button>
            <button className="tab-btn" type="button" onClick={onSwitchToSignIn}>
              Sign in
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-heading">
              <p className="eyebrow">Welcome</p>
              <h2>Create your account</h2>
            </div>
            <p className="auth-subtitle">
              Join Novelia to save favorite novels and join the conversation.
            </p>

            <input type="text" placeholder="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
            <input type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />

            {errorMessage ? <p className="profile-message">{errorMessage}</p> : null}

            <button type="submit" className="primary-btn auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>

            <p className="auth-subtitle">
              Already have an account?{' '}
              <button className="text-link" type="button" onClick={onSwitchToSignIn}>
                Login
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Register
