import { useState } from 'react'
import AdminPosts from './AdminPosts'
import AdminCategories from './AdminCategories'
import AdminPeople from './AdminPeople'
import AdminSettings from './AdminSettings'
import './admin.css'

const TABS = [
  { id: 'Posts',      icon: '📄' },
  { id: 'Categories', icon: '🗂️' },
  { id: 'People',     icon: '👥' },
  { id: 'Settings',   icon: '⚙️' },
]

export default function Admin({ onExit }) {
  const [tab, setTab] = useState('Posts')

  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <div className="adm-logo">
          Dashboard <span>ADMIN</span>
        </div>
        <nav className="adm-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`adm-nav-item${tab === t.id ? ' adm-nav-item--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span> {t.id}
            </button>
          ))}
        </nav>
        <button className="adm-exit" onClick={onExit}>
          ← Back to Site
        </button>
      </aside>

      <main className="adm-main">
        {tab === 'Posts'      && <AdminPosts />}
        {tab === 'Categories' && <AdminCategories />}
        {tab === 'People'     && <AdminPeople />}
        {tab === 'Settings'   && <AdminSettings />}
      </main>
    </div>
  )
}
