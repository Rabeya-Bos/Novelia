import { useEffect, useMemo, useState } from 'react'
import { BookIcon } from '../assets/icons'
import { getNovels, updateProfile } from '../api'

const categories = [
  {
    title: 'Trending Now',
    novels: [
      {
        title: 'Moonlit Orchard',
        cover:
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'The Silent Harbor',
        cover:
          'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Velvet Eclipse',
        cover:
          'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    title: 'Romance Picks',
    novels: [
      {
        title: 'Paper Lanterns',
        cover:
          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Golden Hour',
        cover:
          'https://images.unsplash.com/photo-1491841651911-c44c30f6b54b?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Fading Stars',
        cover:
          'https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    title: 'Mystery & Thriller',
    novels: [
      {
        title: 'Black Glass',
        cover:
          'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'The Last Signal',
        cover:
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
      },
      {
        title: 'Night Garden',
        cover:
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
]

function AfterLoginPage({ onBackHome, user, onOpenProfile, onOpenAdmin, errorMessage }) {
  const [selectedNovel, setSelectedNovel] = useState(null)
  const [page, setPage] = useState(1)
  const [paymentUnlocked, setPaymentUnlocked] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [comment, setComment] = useState('')
  const [readingHistory] = useState(['Moonlit Orchard', 'Velvet Eclipse', 'The Silent Harbor'])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [notificationsOn, setNotificationsOn] = useState(true)
  const [showActivity, setShowActivity] = useState(true)
  const [profileMessage, setProfileMessage] = useState('Your profile is ready and your reading history is updated.')
  const [activeView, setActiveView] = useState('overview')
  const [profileDraft, setProfileDraft] = useState({
    fullName: user?.fullName || 'Ava Carter',
    email: user?.email || 'ava@novelia.com',
    role: user?.role || 'reader',
    bio: 'Curious reader exploring romance, thrillers, and fantasy.',
    location: 'Seattle, USA',
    readingGoal: 'Finish 2 novels this month',
  })
  const [backendNovels, setBackendNovels] = useState([])

  useEffect(() => {
    const loadNovels = async () => {
      try {
        const response = await getNovels()
        setBackendNovels(response.novels || [])
      } catch {
        setBackendNovels([])
      }
    }

    loadNovels()
  }, [])

  const heroNovel = useMemo(() => {
    if (!selectedNovel) return null
    return selectedNovel
  }, [selectedNovel])

  const filteredSections = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return categories
    }

    return categories
      .map((section) => ({
        ...section,
        novels: section.novels.filter((novel) => {
          const haystack = `${novel.title} ${novel.genre}`.toLowerCase()
          return haystack.includes(term)
        }),
      }))
      .filter((section) => section.novels.length > 0)
  }, [searchTerm])

  const displayName = profileDraft.fullName || 'Ava Carter'
  const email = profileDraft.email || 'ava@novelia.com'
  const roleLabel = profileDraft.role === 'reader+author' ? 'Reader + Author' : profileDraft.role === 'admin' ? 'Admin' : 'Reader'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U'

  const handleOpenReader = (novel) => {
    setSelectedNovel(novel)
    setPage(1)
    setPaymentStatus('')
    setBookmarked(false)
    setRating(0)
    setReview('')
    setComment('')
  }

  const handleNextPage = () => {
    if (page >= 3 && !paymentUnlocked) {
      setPaymentStatus('Unlock full access for 1 month for this novel to continue reading.')
      return
    }

    if (page < 6) {
      setPage((current) => current + 1)
    }
  }

  const handleUnlock = () => {
    setPaymentUnlocked(true)
    setPaymentStatus('Payment successful — full access unlocked for 1 month.')
    setPage(4)
  }

  const handleCloseReader = () => {
    setSelectedNovel(null)
    setPage(1)
    setPaymentUnlocked(false)
    setPaymentStatus('')
  }

  const handleSaveProfile = async () => {
    if (!user?.email) return

    try {
      const response = await updateProfile(user.email, {
        fullName: profileDraft.fullName,
        email: profileDraft.email,
        role: profileDraft.role,
        bio: profileDraft.bio,
        location: profileDraft.location,
        readingGoal: profileDraft.readingGoal,
      })
      const savedUser = response.user || {}
      setProfileMessage(`Profile updated for ${savedUser.fullName || profileDraft.fullName}.`)
      setIsEditingProfile(false)
    } catch {
      setProfileMessage('Unable to save profile changes. Please try again.')
    }
  }

  const handleQuickAction = (target) => {
    if (target === 'profile') {
      onOpenProfile?.()
      return
    }

    if (target === 'admin') {
      onOpenAdmin?.()
      return
    }

    setActiveView(target)
    if (target === 'library') {
      setProfileMessage('Your library is open and ready for your next chapter.')
    }
  }

  return (
    <div className="page after-login-page">
      <header className="topbar after-login-topbar">
        <div className="brand">
          <div className="brand-mark" aria-label="Novelia logo">
            <BookIcon />
          </div>
          <span>Novelia</span>
        </div>
        <div className="topbar-tools">
          <label className="searchbar" htmlFor="novel-search">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              id="novel-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search novels"
            />
          </label>
          <button className="secondary-btn close-btn" type="button" onClick={onBackHome} title="Return home">
            <span aria-hidden="true">✕</span>
            <span>Close</span>
          </button>
        </div>
      </header>

      <main className="browse-shell">
        <section className="profile-hero-card">
          <div className="profile-hero-main">
            <div className="profile-avatar-large" aria-label="User avatar">
              {initials}
            </div>
            <div className="profile-main-copy">
              <p className="eyebrow">Authenticated profile</p>
              <h1>{displayName}</h1>
              <p className="profile-email">{email}</p>
              <p className="profile-email">Role: {roleLabel}</p>
              <p className="profile-copy">
                {profileDraft.bio} {profileDraft.location} • {profileDraft.readingGoal}
              </p>
              <div className="profile-actions">
                <button className="primary-btn" type="button" onClick={() => handleQuickAction('library')}>
                  Continue reading
                </button>
                <button className="secondary-btn" type="button" onClick={() => setIsEditingProfile((current) => !current)}>
                  {isEditingProfile ? 'Cancel edits' : 'Edit profile'}
                </button>
                <button className="secondary-btn" type="button" onClick={() => handleQuickAction('profile')}>
                  View full profile
                </button>
                <button className="secondary-btn" type="button" onClick={() => handleQuickAction('admin')}>
                  Admin panel
                </button>
                <button className="secondary-btn" type="button" onClick={onBackHome}>
                  Sign out
                </button>
              </div>
              {errorMessage ? <p className="profile-message">{errorMessage}</p> : null}
              <p className="profile-message">{profileMessage}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <strong>2</strong>
              <span>Saved stories</span>
            </div>
            <div className="profile-stat">
              <strong>14</strong>
              <span>Comments</span>
            </div>
            <div className="profile-stat">
              <strong>5</strong>
              <span>Bookmarked</span>
            </div>
          </div>
        </section>

        {isEditingProfile && (
          <section className="profile-edit-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Profile settings</p>
                <h2>Update your details</h2>
              </div>
            </div>
            <div className="profile-edit-grid">
              <label className="field">
                <span>Full name</span>
                <input
                  value={profileDraft.fullName}
                  onChange={(event) => setProfileDraft((current) => ({ ...current, fullName: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  value={profileDraft.email}
                  onChange={(event) => setProfileDraft((current) => ({ ...current, email: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input
                  value={profileDraft.location}
                  onChange={(event) => setProfileDraft((current) => ({ ...current, location: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>Reading goal</span>
                <input
                  value={profileDraft.readingGoal}
                  onChange={(event) => setProfileDraft((current) => ({ ...current, readingGoal: event.target.value }))}
                />
              </label>
            </div>
            <label className="field">
              <span>Bio</span>
              <textarea
                value={profileDraft.bio}
                onChange={(event) => setProfileDraft((current) => ({ ...current, bio: event.target.value }))}
              />
            </label>
            <div className="author-actions">
              <button className="primary-btn" type="button" onClick={handleSaveProfile}>
                Save changes
              </button>
              <button className="secondary-btn" type="button" onClick={() => setIsEditingProfile(false)}>
                Close editor
              </button>
            </div>
          </section>
        )}

        <section className="profile-grid">
          <article className="profile-panel">
            <h2>Saved stories</h2>
            <ul>
              <li>Moonlit Orchard</li>
              <li>Velvet Eclipse</li>
            </ul>
            <button className="secondary-btn" type="button" onClick={() => handleQuickAction('library')}>
              Open library
            </button>
          </article>

          <article className="profile-panel">
            <h2>Notifications</h2>
            <ul>
              <li>New chapter alerts</li>
              <li>Season reminders</li>
            </ul>
            <button className="secondary-btn" type="button" onClick={() => setNotificationsOn((current) => !current)}>
              {notificationsOn ? 'Pause alerts' : 'Resume alerts'}
            </button>
          </article>

          <article className="profile-panel">
            <h2>Privacy settings</h2>
            <ul>
              <li>Private account</li>
              <li>Show reading activity</li>
            </ul>
            <button className="secondary-btn" type="button" onClick={() => setShowActivity((current) => !current)}>
              {showActivity ? 'Hide activity' : 'Show activity'}
            </button>
          </article>

          <article className="profile-panel">
            <h2>Quick access</h2>
            <ul>
              <li>Continue reading latest chapter</li>
              <li>Review your comments and bookmarks</li>
            </ul>
            <button className="secondary-btn" type="button" onClick={() => handleQuickAction('admin')}>
              Open admin panel
            </button>
          </article>
        </section>

        <section className="browse-section" id="library">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your library</p>
              <h2>{activeView === 'overview' ? 'Continue where you left off' : 'Reading recommendations'}</h2>
            </div>
            <button className="secondary-btn" type="button" onClick={() => setActiveView('overview')}>
              View overview
            </button>
          </div>

          {filteredSections.length === 0 ? (
            <div className="empty-state">No novels found for that search.</div>
          ) : (
            filteredSections.map((section) => (
              <section key={section.title} className="browse-section">
                <div className="section-heading">
                  <h2>{section.title}</h2>
                  <a href="#">See all</a>
                </div>
                <div className="browse-row">
                  {section.novels.map((novel) => (
                    <article className="browse-card" key={novel.title}>
                      <img src={novel.cover} alt={`${novel.title} cover`} />
                      <div className="browse-card-overlay">
                        <div>
                          <h3>{novel.title}</h3>
                          <p className="card-detail">Hover to preview • Click to read</p>
                          <button className="card-hover-details" type="button" onClick={() => handleOpenReader(novel)}>
                            <span>Read now</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </section>
      </main>

      {selectedNovel && (
        <div className="reader-overlay">
          <div className="reader-card">
            <div className="reader-top">
              <div>
                <p className="eyebrow">Reading now</p>
                <h2>{heroNovel.title}</h2>
              </div>
              <button className="reader-close-btn" type="button" onClick={handleCloseReader} title="Return to catalog">
                <span aria-hidden="true">✕</span>
                <span>Close</span>
              </button>
            </div>

            <div className="reader-page">
              <p className="reader-page-number">Page {page}</p>
              <p>
                {page <= 3 || paymentUnlocked
                  ? `This is page ${page} of ${heroNovel.title}. The story unfolds with each page, and the experience becomes richer as the chapters deepen.`
                  : 'This page is temporarily hidden. Unlock full access for 1 month to continue reading this novel.'}
              </p>
            </div>

            <div className="reader-actions-row">
              <button className="secondary-btn" type="button" onClick={() => setBookmarked((current) => !current)}>
                {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
              </button>
              <div className="rating-group">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    className={`rating-star ${rating >= value ? 'active' : ''}`}
                    type="button"
                    onClick={() => setRating(value)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="reader-activity">
              <div className="reader-panel">
                <h3>Write a review</h3>
                <textarea
                  value={review}
                  onChange={(event) => setReview(event.target.value)}
                  placeholder="Share what you liked or what stood out in this novel..."
                />
              </div>
              <div className="reader-panel">
                <h3>Comment</h3>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Leave a comment for the author or other readers..."
                />
              </div>
            </div>

            <div className="reader-activity">
              <div className="reader-panel">
                <h3>Manage profile</h3>
                <p>Reading preferences, alerts, and privacy settings are ready for your account.</p>
              </div>
              <div className="reader-panel">
                <h3>Reading history</h3>
                <ul>
                  {readingHistory.map((entry) => <li key={entry}>{entry}</li>)}
                </ul>
              </div>
            </div>

            {!paymentUnlocked && page >= 3 && (
              <div className="payment-card">
                <p>{paymentStatus || 'After page 3, the next pages are locked until payment is completed.'}</p>
                <button className="primary-btn" type="button" onClick={handleUnlock}>
                  Pay $9.99 for 1 month
                </button>
              </div>
            )}

            {paymentUnlocked && <p className="payment-success">{paymentStatus}</p>}

            <div className="reader-actions">
              <button className="secondary-btn" type="button" onClick={() => setPage((current) => Math.max(1, current - 1))}>
                ← Previous
              </button>
              <button className="primary-btn" type="button" onClick={handleNextPage}>
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AfterLoginPage
