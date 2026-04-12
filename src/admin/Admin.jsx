import { useState, useEffect } from 'react'
import AdminPosts from './AdminPosts'
import AdminCategories from './AdminCategories'
import AdminPeople from './AdminPeople'
import AdminSettings from './AdminSettings'
import { fetchAll, setCache } from '../store'
import './admin.css'

const TABS = ['Posts', 'Categories', 'People', 'Settings']

export default function Admin({ onExit }) {
  const [tab, setTab]     = useState('Posts')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check if we already have cached data
    try {
      const raw = localStorage.getItem('qs_db')
      if (raw && JSON.parse(raw)?.posts) {
        const db = JSON.parse(raw)
        setCache(db)
        setReady(true)
        // Still fetch fresh data in background
        fetchAll().then((fresh) => setCache(fresh))
        return
      }
    } catch {}
    // No cache — fetch from API
    fetchAll().then((db) => { setCache(db); setReady(true) })
  }, [])

  if (!ready) return null

  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <div className="adm-logo">Admin</div>
        <nav className="adm-nav">
          {TABS.map((t) => (
            <button
              key={t}
              className={`adm-nav-item${tab === t ? ' adm-nav-item--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
        <button className="adm-exit" onClick={onExit}>← Back to Site</button>
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
