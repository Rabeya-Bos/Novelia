import { BookIcon } from '../assets/icons'

function GuestUserPage({ onGoToRegister, onGoToSignIn, onBackHome }) {
  return (
    <div className="page">
      <header className="topbar">
        <button className="brand" type="button" onClick={onBackHome}>
          <div className="brand-mark" aria-label="Novelia logo">
            <BookIcon />
          </div>
          <span>Novelia</span>
        </button>
        <div className="topbar-actions">
          <button className="secondary-btn" type="button" onClick={onGoToSignIn}>
            Sign in
          </button>
          <button className="register-btn" type="button" onClick={onGoToRegister}>
            Register
          </button>
        </div>
      </header>

      <main className="profile-shell">
        <section className="profile-card" style={{ gridTemplateColumns: '1fr' }}>
          <div className="profile-details">
            <p className="eyebrow">Guest user</p>
            <h1>Guest (Visitor)</h1>
            <p className="profile-copy">
              Browse novels, search, view previews, register, and login to unlock the full experience.
            </p>

            <div className="profile-actions">
              <button className="primary-btn" type="button" onClick={onGoToRegister}>
                Create account
              </button>
              <button className="secondary-btn" type="button" onClick={onGoToSignIn}>
                Login
              </button>
            </div>

            <div className="profile-grid">
              <div className="profile-panel">
                <h2>Main permissions</h2>
                <ul>
                  <li>Browse novels</li>
                  <li>Search stories</li>
                  <li>View previews</li>
                  <li>Register / login</li>
                </ul>
              </div>
              <div className="profile-panel">
                <h2>Guest access</h2>
                <ul>
                  <li>Explore featured stories</li>
                  <li>Try the reader experience</li>
                  <li>Join the community later</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default GuestUserPage
