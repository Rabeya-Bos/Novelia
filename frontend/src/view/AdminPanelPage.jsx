import { useMemo, useState } from 'react'
import { BookIcon } from '../assets/icons'

const roleDefinitions = {
  'super-admin': {
    name: 'Super Admin',
    accessLevel: 'Full control',
    description: 'Owns the entire platform, from users to payouts and permissions.',
    summary: 'Full access to every module with the power to approve changes and manage site-wide security.',
    permissions: {
      users: 'full',
      authors: 'full',
      novels: 'full',
      chapters: 'full',
      categories: 'full',
      comments: 'full',
      subscriptions: 'full',
      payments: 'full',
      promotions: 'full',
      analytics: 'full',
      settings: 'full',
      security: 'full',
      backups: 'full',
      permissions: 'full',
    },
  },
  'content-admin': {
    name: 'Content Admin',
    accessLevel: 'Editorial control',
    description: 'Manages novels, chapters, categories, comments, and publishing workflows.',
    summary: 'Can curate content and keep the catalog healthy without touching payments or security.',
    permissions: {
      users: 'restricted',
      authors: 'limited',
      novels: 'full',
      chapters: 'full',
      categories: 'full',
      comments: 'full',
      subscriptions: 'restricted',
      payments: 'restricted',
      promotions: 'limited',
      analytics: 'limited',
      settings: 'restricted',
      security: 'restricted',
      backups: 'restricted',
      permissions: 'restricted',
    },
  },
  'moderator': {
    name: 'Moderator',
    accessLevel: 'Community moderation',
    description: 'Keeps discussions, comments, and reported content safe and respectful.',
    summary: 'Can review user-generated content and remove risky material while staying out of financial settings.',
    permissions: {
      users: 'limited',
      authors: 'restricted',
      novels: 'limited',
      chapters: 'limited',
      categories: 'restricted',
      comments: 'full',
      subscriptions: 'restricted',
      payments: 'restricted',
      promotions: 'restricted',
      analytics: 'restricted',
      settings: 'restricted',
      security: 'restricted',
      backups: 'restricted',
      permissions: 'restricted',
    },
  },
  'support-admin': {
    name: 'Support Admin',
    accessLevel: 'Customer care',
    description: 'Handles account issues, subscriptions, and user support escalations.',
    summary: 'Can review users, subscriptions, and requests while avoiding sensitive platform configuration.',
    permissions: {
      users: 'limited',
      authors: 'limited',
      novels: 'restricted',
      chapters: 'restricted',
      categories: 'restricted',
      comments: 'limited',
      subscriptions: 'full',
      payments: 'limited',
      promotions: 'restricted',
      analytics: 'restricted',
      settings: 'restricted',
      security: 'restricted',
      backups: 'restricted',
      permissions: 'restricted',
    },
  },
  'finance-admin': {
    name: 'Finance Admin',
    accessLevel: 'Monetization oversight',
    description: 'Monitors subscriptions, payments, promotions, and revenue health.',
    summary: 'Can manage financial operations and review payment activity without editing content or security settings.',
    permissions: {
      users: 'restricted',
      authors: 'restricted',
      novels: 'restricted',
      chapters: 'restricted',
      categories: 'restricted',
      comments: 'restricted',
      subscriptions: 'full',
      payments: 'full',
      promotions: 'full',
      analytics: 'full',
      settings: 'restricted',
      security: 'restricted',
      backups: 'restricted',
      permissions: 'restricted',
    },
  },
}

const moduleCatalog = [
  { key: 'users', label: 'Users', description: 'Manage accounts, ban status, and account recovery.' },
  { key: 'authors', label: 'Authors', description: 'Approve or review author profiles and publishing requests.' },
  { key: 'novels', label: 'Novels', description: 'Publish, archive, and organize novel catalogs.' },
  { key: 'chapters', label: 'Chapters', description: 'Moderate chapter release schedules and drafts.' },
  { key: 'categories', label: 'Categories', description: 'Create and refine content taxonomies.' },
  { key: 'comments', label: 'Comments', description: 'Review reader and author discussions.' },
  { key: 'subscriptions', label: 'Subscriptions', description: 'Manage reader plans and account entitlements.' },
  { key: 'payments', label: 'Payments', description: 'Review transactions, refunds, and payout status.' },
  { key: 'promotions', label: 'Promotions', description: 'Launch campaigns and discount codes.' },
  { key: 'analytics', label: 'Analytics', description: 'Track growth, engagement, and retention metrics.' },
  { key: 'settings', label: 'Website settings', description: 'Update branding, homepage content, and general settings.' },
  { key: 'security', label: 'Security', description: 'Handle authentication policies and threat mitigation.' },
  { key: 'backups', label: 'Backups', description: 'Review restore points and disaster recovery status.' },
  { key: 'permissions', label: 'Role permissions', description: 'Configure role access for every protected area.' },
]

function AdminPanelPage({ user, onBackHome, onBackToProfile }) {
  const [activeRoleKey, setActiveRoleKey] = useState(user?.role || 'super-admin')

  const activeRole = useMemo(() => roleDefinitions[activeRoleKey] || roleDefinitions['super-admin'], [activeRoleKey])

  const accessSummary = useMemo(() => {
    return Object.entries(activeRole.permissions).filter(([, access]) => access !== 'restricted')
  }, [activeRole])

  const renderAccessBadge = (level) => {
    if (level === 'full') {
      return <span className="access-pill access-full">Full access</span>
    }

    if (level === 'limited') {
      return <span className="access-pill access-limited">Limited access</span>
    }

    return <span className="access-pill access-restricted">Restricted</span>
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
        <div className="topbar-actions">
          <button className="secondary-btn" type="button" onClick={onBackToProfile}>
            Back to profile
          </button>
          <button className="secondary-btn" type="button" onClick={onBackHome}>
            Sign out
          </button>
        </div>
      </header>

      <main className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <p className="eyebrow">Secure workspace</p>
            <h2>Admin center</h2>
            <p className="admin-sidebar-copy">Switch between admin roles to review what each operator can manage.</p>
          </div>

          <div className="role-list">
            {Object.entries(roleDefinitions).map(([roleKey, role]) => (
              <button
                className={`role-item ${activeRoleKey === roleKey ? 'active' : ''}`}
                type="button"
                key={roleKey}
                onClick={() => setActiveRoleKey(roleKey)}
              >
                <div>
                  <strong>{role.name}</strong>
                  <p>{role.accessLevel}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="admin-content">
          <div className="admin-hero">
            <div>
              <p className="eyebrow">Protected console</p>
              <h1>{activeRole.name}</h1>
              <p>{activeRole.description}</p>
            </div>
            <div className="admin-badge">{activeRole.accessLevel}</div>
          </div>

          <div className="admin-summary-grid">
            <article className="summary-card">
              <p className="eyebrow">Current account</p>
              <h3>{user?.fullName || 'Administrator'}</h3>
              <p>{user?.email || 'admin@novelia.com'}</p>
            </article>
            <article className="summary-card">
              <p className="eyebrow">Permission scope</p>
              <h3>{accessSummary.length} primary modules</h3>
              <p>{activeRole.summary}</p>
            </article>
            <article className="summary-card">
              <p className="eyebrow">Access guardrails</p>
              <h3>Role-based control</h3>
              <p>Only approved actions appear for the selected operator profile.</p>
            </article>
          </div>

          <section className="module-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Module overview</p>
                <h2>Permission matrix</h2>
              </div>
            </div>
            <div className="module-grid">
              {moduleCatalog.map((module) => {
                const level = activeRole.permissions[module.key]
                return (
                  <article className="module-card" key={module.key}>
                    <div className="module-card-top">
                      <h3>{module.label}</h3>
                      {renderAccessBadge(level)}
                    </div>
                    <p>{module.description}</p>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="audit-card">
            <div>
              <p className="eyebrow">Operational checklist</p>
              <h2>Keep the platform secure and ready</h2>
            </div>
            <ul>
              <li>Review new author submissions and publish approvals.</li>
              <li>Audit weekly backups, security alerts, and suspicious accounts.</li>
              <li>Monitor subscriptions, payments, and campaign performance.</li>
              <li>Archive outdated categories and comments that violate policy.</li>
            </ul>
          </section>
        </section>
      </main>
    </div>
  )
}

export default AdminPanelPage
