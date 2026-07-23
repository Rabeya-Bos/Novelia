import { useMemo, useState } from 'react'
import { BookIcon } from '../assets/icons'
import { novels as featuredNovels } from './HomePage'

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

function ReaderPage({ onBackHome }) {
  const [selectedNovel, setSelectedNovel] = useState(null)
  const [page, setPage] = useState(1)
  const [paymentUnlocked, setPaymentUnlocked] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [comment, setComment] = useState('')
  const [readingHistory, setReadingHistory] = useState(['Moonlit Orchard', 'Velvet Eclipse'])

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
          const haystack = `${novel.title}`.toLowerCase()
          return haystack.includes(term)
        }),
      }))
      .filter((section) => section.novels.length > 0)
  }, [searchTerm])

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
      setPaymentStatus('Unlock full access for 1 month to continue reading this novel.')
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
        <section className="browse-hero">
          <div>
            <p className="eyebrow">Reader view</p>
            <h1>Read novels, bookmark favorites, rate stories, write reviews, and track your history.</h1>
          </div>
          <button className="primary-btn" type="button">
            Continue reading
          </button>
        </section>

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
      </main>

      <section className="novel-section" id="discover">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured novels</p>
            <h2>Browse the homepage collection</h2>
          </div>
        </div>
        <div className="novel-grid">
          {featuredNovels.map((novel) => (
            <article className="novel-card" key={novel.title}>
              <img src={novel.cover} alt={`${novel.title} cover`} />
              <div className="novel-body">
                <div className="novel-top">
                  <div>
                    <h3>{novel.title}</h3>
                    <p>{novel.author}</p>
                  </div>
                  <span className="badge">{novel.genre}</span>
                </div>
                <p className="novel-summary">{novel.summary}</p>
                <div className="novel-meta">
                  <span>♥ {novel.likes}</span>
                  <span>💬 {novel.comments}</span>
                </div>
                <button className="primary-btn" type="button" onClick={() => handleOpenReader(novel)}>
                  Read now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

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

export default ReaderPage
