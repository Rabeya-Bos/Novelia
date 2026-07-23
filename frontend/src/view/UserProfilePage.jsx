import { useEffect, useState } from 'react'
import { BookIcon } from '../assets/icons'
import { getNovels, createNovel, updateNovel, deleteNovel } from '../api'

function UserProfilePage({ user, onContinue, onBackHome, onAccountUpdate, onOpenAdmin, isSubmitting, errorMessage }) {
  const [authorStage, setAuthorStage] = useState('profile')
  const [seriesList, setSeriesList] = useState([])
  const [selectedSeriesId, setSelectedSeriesId] = useState(null)
  const [formData, setFormData] = useState({ title: '', type: 'Web novel', description: '', status: 'In progress' })
  const [editorLanguage, setEditorLanguage] = useState('English')
  const [chapters, setChapters] = useState([])
  const [chapterTitle, setChapterTitle] = useState('')
  const [featuredNovels, setFeaturedNovels] = useState([])

  useEffect(() => {
    const loadNovels = async () => {
      try {
        const response = await getNovels()
        setFeaturedNovels(response.novels || [])
        const mappedSeriesList = (response.novels || []).map((novel) => ({
          id: novel.id,
          title: novel.title,
          type: novel.genre,
          description: novel.summary,
          status: 'In progress',
          content: '',
        }))
        setSeriesList(mappedSeriesList)
      } catch {
        setFeaturedNovels([])
        setSeriesList([])
      }
    }

    loadNovels()
  }, [])

  const displayName = user?.fullName || 'Reader'
  const email = user?.email || 'your@email.com'
  const roleLabel = user?.role === 'reader+author' ? 'Reader + Author' : 'Reader'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U'

  const selectedSeries = seriesList.find((series) => series.id === selectedSeriesId) || null

  const handleStartAuthorFlow = () => {
    setAuthorStage('form')
    setFormData({ title: '', type: 'Web novel', description: '', status: 'In progress' })
  }

  const handleSubmitAuthorForm = async (event) => {
    event.preventDefault()
    const title = formData.title.trim()

    if (!title) return

    const novelPayload = {
      title,
      author: user?.fullName || 'Anonymous Author',
      genre: formData.type,
      summary: formData.description.trim() || 'A new novel series is ready for chapters, notes, and scene drafts.',
      likes: 0,
      comments: 0
    }

    try {
      const createdNovel = await createNovel(novelPayload)
      const series = {
        id: createdNovel.id,
        title: createdNovel.title,
        type: createdNovel.genre,
        description: createdNovel.summary,
        status: 'In progress',
        content: '',
      }

      onAccountUpdate?.({ ...(user || {}), role: 'reader+author' })
      setSeriesList((current) => [series, ...current])
      setSelectedSeriesId(series.id)
      setAuthorStage('collections')
    } catch (err) {
      console.error(err)
    }
  }

  const handleSeriesOpen = (series) => {
    setSelectedSeriesId(series.id)
    setAuthorStage('series')
  }

  const handleSeriesContentChange = (event) => {
    const nextValue = event.target.value

    setSeriesList((current) =>
      current.map((series) => (series.id === selectedSeriesId ? { ...series, content: nextValue } : series))
    )
  }

  const applyEditorFormat = (format) => {
    if (!selectedSeries) return

    const sampleText = selectedSeries.content || ''
    const nextValue = {
      heading: `${sampleText}\n\n## Chapter Heading`,
      paragraph: `${sampleText}\n\nThis paragraph is styled for a polished novel chapter.`,
      image: `${sampleText}\n\n[Image: Add a cover or scene image here]`,
      bold: `${sampleText}\n\n**Important passage**`,
      italic: `${sampleText}\n\n*Soft emphasis*`,
      underline: `${sampleText}\n\n<u>Highlighted line</u>`,
    }[format]

    setSeriesList((current) =>
      current.map((series) => (series.id === selectedSeriesId ? { ...series, content: nextValue } : series))
    )
  }

  const handleAddChapter = () => {
    if (!selectedSeries || !chapterTitle.trim()) return

    const chapter = {
      id: Date.now(),
      title: chapterTitle.trim(),
    }

    setChapters((current) => [chapter, ...current])
    setChapterTitle('')
  }

  const handlePublishSeries = async () => {
    if (!selectedSeries) return
    try {
      await updateNovel(selectedSeriesId, { summary: selectedSeries.description })
      setSeriesList((current) =>
        current.map((series) => (series.id === selectedSeriesId ? { ...series, status: 'Ready to publish' } : series))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteSeries = async () => {
    if (!selectedSeriesId) return
    if (!window.confirm("Are you sure you want to delete this novel?")) return
    
    try {
      await deleteNovel(selectedSeriesId)
      setSeriesList((current) => current.filter((series) => series.id !== selectedSeriesId))
      setSelectedSeriesId(null)
      setAuthorStage('collections')
    } catch (err) {
      console.error(err)
    }
  }

  const renderAuthorFlow = () => {
    if (authorStage === 'form') {
      return (
        <section className="author-flow-card">
          <div className="author-header">
            <p className="eyebrow">Author workspace</p>
            <h2>Create a novel series</h2>
            <p>Save your series here and open it later to write chapters, scenes, and notes directly inside the collection.</p>
          </div>

          <form className="author-form" onSubmit={handleSubmitAuthorForm}>
            <label className="field">
              <span>Series title</span>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                placeholder="My new web novel"
                required
              />
            </label>

            <label className="field">
              <span>Series type</span>
              <select
                value={formData.type}
                onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
              >
                <option value="Web novel">Web novel</option>
                <option value="Romance">Romance</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
              </select>
            </label>

            <label className="field">
              <span>Current status</span>
              <select
                value={formData.status}
                onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value }))}
              >
                <option value="In progress">In progress</option>
                <option value="Planning">Planning</option>
                <option value="Drafting">Drafting</option>
                <option value="Ready to publish">Ready to publish</option>
              </select>
            </label>

            <label className="field">
              <span>What is this novel about?</span>
              <textarea
                value={formData.description}
                onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                placeholder="Describe the premise, characters, or setting for your novel."
              />
            </label>

            <div className="author-actions">
              <button className="secondary-btn" type="button" onClick={() => setAuthorStage('profile')}>
                Back to profile
              </button>
              <button className="primary-btn" type="submit">
                Save to series
              </button>
            </div>
          </form>
        </section>
      )
    }

    if (authorStage === 'collections') {
      return (
        <section className="author-flow-card">
          <div className="author-header">
            <p className="eyebrow">Series</p>
            <h2>Your novel collections</h2>
            <p>Open any series to continue writing your story in words or notes.</p>
          </div>

          {seriesList.length === 0 ? (
            <div className="author-empty">No series yet. Create your first one to begin writing.</div>
          ) : (
            <>
              <div className="status-summary">
                <div className="status-chip">
                  <strong>{seriesList.length}</strong>
                  <span>Saved novels</span>
                </div>
                <div className="status-chip">
                  <strong>{seriesList.filter((series) => series.status === 'In progress').length}</strong>
                  <span>Working now</span>
                </div>
              </div>
              <div className="collection-list">
                {seriesList.map((series) => (
                  <button className="collection-card" key={series.id} type="button" onClick={() => handleSeriesOpen(series)}>
                    <div>
                      <h3>{series.title}</h3>
                      <p>{series.type}</p>
                      <p>{series.description}</p>
                    </div>
                    <div className="collection-meta">
                      <span className="collection-pill">{series.status}</span>
                      <span className="collection-pill secondary-pill">Open to write</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="author-actions">
            <button className="secondary-btn" type="button" onClick={() => setAuthorStage('profile')}>
              Back to profile
            </button>
            <button className="primary-btn" type="button" onClick={handleStartAuthorFlow}>
              New series
            </button>
          </div>
        </section>
      )
    }

    if (authorStage === 'series' && selectedSeries) {
      return (
        <section className="author-flow-card">
          <div className="author-header">
            <p className="eyebrow">Author dashboard</p>
            <h2>{selectedSeries.title}</h2>
            <p>{selectedSeries.description}</p>
          </div>

          <div className="top-action-row">
            <button className="small-action-btn" type="button">Upload chapter</button>
            <button className="small-action-btn" type="button">Analytics</button>
            <button className="small-action-btn" type="button">Comments</button>
          </div>

          <div className="editor-layout">
            <aside className="chapter-sidebar">
              <h3>Chapters</h3>
              <div className="chapter-input-row">
                <input
                  type="text"
                  value={chapterTitle}
                  onChange={(event) => setChapterTitle(event.target.value)}
                  placeholder="New chapter title"
                />
                <button className="toolbar-btn" type="button" onClick={handleAddChapter}>
                  Add
                </button>
              </div>
              <ul>
                {chapters.length === 0 ? (
                  <li className="empty-chip">No chapters yet</li>
                ) : (
                  chapters.map((chapter) => <li key={chapter.id}>{chapter.title}</li>)
                )}
              </ul>
            </aside>

            <div className="writer-panel big-editor">
              <div className="editor-toolbar">
                <button className="toolbar-btn" type="button" onClick={() => applyEditorFormat('heading')}>
                  H1 Header
                </button>
                <button className="toolbar-btn" type="button" onClick={() => applyEditorFormat('bold')}>
                  Bold
                </button>
                <button className="toolbar-btn" type="button" onClick={() => applyEditorFormat('italic')}>
                  Italic
                </button>
                <button className="toolbar-btn" type="button" onClick={() => applyEditorFormat('underline')}>
                  Underline
                </button>
                <button className="toolbar-btn" type="button" onClick={() => applyEditorFormat('paragraph')}>
                  Paragraph
                </button>
                <button className="toolbar-btn" type="button" onClick={() => applyEditorFormat('image')}>
                  Insert image
                </button>
                <label className="toolbar-select">
                  <span>Language</span>
                  <select value={editorLanguage} onChange={(event) => setEditorLanguage(event.target.value)}>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </label>
              </div>
              <textarea
                value={selectedSeries.content}
                onChange={handleSeriesContentChange}
                placeholder="Start writing your novel here, chapter by chapter, or keep notes for the next scene..."
              />
              <div className="editor-footer">
                <span>Language: {editorLanguage}</span>
                <span>Draft auto-saved in this series</span>
              </div>
            </div>
          </div>

          <div className="author-actions">
            <button className="secondary-btn" type="button" onClick={() => setAuthorStage('collections')}>
              Back to series
            </button>
            <button className="primary-btn" type="button" onClick={handlePublishSeries}>
              Publish
            </button>
            <button className="danger-btn" type="button" onClick={handleDeleteSeries} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', marginLeft: '8px' }}>
              Delete Novel
            </button>
          </div>
        </section>
      )
    }

    return null
  }

  return (
    <div className="page">
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

      <main className="profile-shell">
        {authorStage === 'profile' ? (
          <section className="profile-card">
            <div className="profile-avatar" aria-label="User avatar">
              {initials}
            </div>
            <div className="profile-details">
              <p className="eyebrow">Your profile</p>
              <h1>{displayName}</h1>
              <p className="profile-email">{email}</p>
              <p className="profile-email">Role: {roleLabel}</p>
              <p className="profile-copy">
                {user?.role === 'reader+author'
                  ? 'Your account now has both reader and author access. Explore novels and keep working on your series in one place.'
                  : 'Your Novelia account is ready. Explore dramas, save stories to your library, and manage your reading preferences.'}
              </p>
              {errorMessage ? <p className="profile-message">{errorMessage}</p> : null}
              <div className="profile-actions">
                <button className="primary-btn" type="button" onClick={onContinue}>
                  Explore novels
                </button>
                <button className="secondary-btn" type="button" onClick={onBackHome}>
                  Sign out
                </button>
              </div>

              <div className="profile-grid">
                <div className="profile-panel">
                  <h2>Saved stories</h2>
                  <ul>
                    <li>Moonlit Orchard</li>
                    <li>Velvet Eclipse</li>
                  </ul>
                </div>

                <div className="profile-panel">
                  <h2>Notifications</h2>
                  <ul>
                    <li>New episode alerts</li>
                    <li>New season reminders</li>
                    <li>Drama discounts</li>
                  </ul>
                </div>

                <div className="profile-panel">
                  <h2>Privacy settings</h2>
                  <ul>
                    <li>Private account</li>
                    <li>Show reading activity</li>
                  </ul>
                </div>

                <div className="profile-panel author-panel">
                  <h2>{user?.role === 'reader+author' ? 'Author workspace ready' : 'Become an author'}</h2>
                  <p>
                    {user?.role === 'reader+author'
                      ? 'Your account already has author access. Open the workspace to continue writing and publishing.'
                      : 'Ready to publish your own novel or drama? Fill in the application form.'}
                  </p>
                  <button className="secondary-btn" type="button" onClick={handleStartAuthorFlow}>
                    {user?.role === 'reader+author' ? 'Open author workspace' : 'Apply as author'}
                  </button>
                  <button className="primary-btn" type="button" onClick={onOpenAdmin}>
                    Open admin panel
                  </button>
                  <button className="secondary-btn" type="button" disabled={isSubmitting} onClick={() => onAccountUpdate?.({ ...user, role: 'reader+author' })}>
                    {isSubmitting ? 'Saving...' : 'Enable author mode'}
                  </button>
                </div>
              </div>

              <div className="author-profile-section">
                <div className="author-profile-header">
                  <h2>Working novels</h2>
                  <button className="primary-btn" type="button" onClick={handleStartAuthorFlow}>
                    New series
                  </button>
                </div>

                {seriesList.length === 0 ? (
                  <div className="author-empty">No novels saved yet. Create your first series and start writing.</div>
                ) : (
                  <div className="collection-list compact-list">
                    {seriesList.map((series) => (
                      <button className="collection-card" key={series.id} type="button" onClick={() => handleSeriesOpen(series)}>
                        <div>
                          <h3>{series.title}</h3>
                          <p>{series.type}</p>
                          <p>{series.description}</p>
                        </div>
                        <div className="collection-meta">
                          <span className="collection-pill">{series.status}</span>
                          <span className="collection-pill secondary-pill">Write</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <section className="novel-section" id="discover">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Featured novels</p>
                    <h2>Read from the homepage catalog</h2>
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
                        <button className="primary-btn" type="button" onClick={onContinue}>
                          Read now
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>
        ) : (
          renderAuthorFlow()
        )}
      </main>
    </div>
  )
}

export default UserProfilePage
