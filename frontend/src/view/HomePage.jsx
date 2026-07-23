import { BookIcon } from '../assets/icons'

export const novels = [
  {
    title: 'Moonlit Orchard',
    author: 'Nadia Vale',
    genre: 'Romance',
    summary: 'A tender story of second chances beneath a silver orchard.',
    likes: 1820,
    comments: 116,
    cover:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'The Silent Harbor',
    author: 'Mika Rowan',
    genre: 'Mystery',
    summary: 'A stormy seaside mystery wrapped in secrets and old promises.',
    likes: 1540,
    comments: 98,
    cover:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Velvet Eclipse',
    author: 'Lina Cross',
    genre: 'Fantasy',
    summary: 'A magical adventure where the night sky opens into a kingdom of wonders.',
    likes: 2260,
    comments: 143,
    cover:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Paper Lanterns',
    author: 'Ari Sol',
    genre: 'Drama',
    summary: 'An emotional tale of family, memory, and the stories we pass on.',
    likes: 1320,
    comments: 89,
    cover:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
  },
]

function HomePage({ onRegister }) {
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-label="Novelia logo">
            <BookIcon />
          </div>
          <span>Novelia</span>
        </div>
        <div className="topbar-actions">
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#discover">Discover</a>
            <a href="#about">About</a>
            <a href="#community">Community</a>
          </nav>
          <button className="register-btn" type="button" onClick={onRegister}>
            Register
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">A haven for readers</p>
            <h1>Find your next favorite novel and join a thriving book community.</h1>
            <p className="hero-text">
              Novelia brings fresh stories, rich book discussions, and a welcoming space
              where readers can explore immersive worlds together.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#discover">
                Explore novels
              </a>
              <a className="secondary-btn" href="#about">
                Learn more
              </a>
            </div>
          </div>

          <div className="hero-card" id="community">
            <h2>Why readers love Novelia</h2>
            <ul>
              <li>Curated novels across romance, fantasy, and thrillers</li>
              <li>Likes and comments that spark real conversations</li>
              <li>A simple, elegant home for every kind of reader</li>
            </ul>
          </div>
        </section>

        <section className="info-panel" id="about">
          <div>
            <p className="eyebrow">About our website</p>
            <h2>Designed to help readers discover stories that feel personal.</h2>
          </div>
          <p>
            Novelia is a modern reading space where readers and storytellers connect through
            the joy of great fiction. Browse featured novels, discover new voices, and join a
            community that celebrates every chapter.
          </p>
        </section>

        <section className="novel-section" id="discover">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Featured novels</p>
              <h2>Popular stories people are talking about</h2>
            </div>
            <a href="#discover">See all</a>
          </div>

          <div className="novel-grid">
            {novels.map((novel) => (
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
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-card">
          <div className="footer-info">
            <p className="eyebrow">Contact us</p>
            <h2>Need help or want to share a story?</h2>
            <ul>
              <li>📞 +1 (800) 555-0199</li>
              <li>✉️ support@novelia.com</li>
              <li>💬 Help line: Mon–Fri, 8am–8pm</li>
            </ul>
          </div>

          <div className="chat-card" aria-label="Support chat box">
            <div className="chat-bubble incoming">Hello! We’re here to help.</div>
            <div className="chat-bubble outgoing">I need help with my account.</div>
            <div className="chat-input">Type your message...</div>
          </div>
        </div>

        <p className="footer-dedication">Dedicated to every reader who believes every page can change a life.</p>
      </footer>
    </div>
  )
}

export default HomePage
