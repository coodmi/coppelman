import { useState, useMemo, useEffect } from 'react'
import Fuse from 'fuse.js'
import Header from './components/Header'
import PostList from './components/PostList'
import Login from './components/Login'
import Menu from './components/Menu'
import CategoryMenu from './components/CategoryMenu'
import PersonSearch from './components/PersonSearch'
import SearchResults from './components/SearchResults'
import PostDetail from './components/PostDetail'
import { fetchAll, setCache } from './store'

const AUTH_KEY = 'qs_auth_ts'
const AUTH_DAYS = 15

function isAuthValid() {
  const ts = localStorage.getItem(AUTH_KEY)
  if (!ts) return false
  return Date.now() - parseInt(ts) < AUTH_DAYS * 24 * 60 * 60 * 1000
}

function setAuthStamp() {
  localStorage.setItem(AUTH_KEY, Date.now().toString())
}

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'title',   label: 'Title A–Z' },
  { value: 'author',  label: 'Author A–Z' },
  { value: 'date',    label: 'Date' },
]

export default function App() {
  const [authed, setAuthed] = useState(() => isAuthValid())
  // Initialize instantly from localStorage so there's no loading flash
  const [db, setDb] = useState(() => {
    try {
      const raw = localStorage.getItem('qs_db')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.posts?.length) return parsed
      }
    } catch {}
    // Return defaults immediately so page renders without waiting for API
    return {
      posts:      [],
      categories: ['Golf','Polo & Equestrian','Wine','Farm & Village','Museum by Ando','The Land'],
      people:     [],
      password:   'admin123',
    }
  })
  const [menuOpen, setMenuOpen]         = useState(false)
  const [catOpen, setCatOpen]           = useState(false)
  const [personOpen, setPersonOpen]     = useState(false)
  const [query, setQuery]               = useState('')
  const [personMode, setPersonMode]     = useState({})
  const [sortBy, setSortBy]             = useState('default')
  const [selectedPost, setSelectedPost] = useState(null)

  function refreshData() {
    fetchAll().then((fresh) => { setCache(fresh); setDb(fresh) })
  }

  // Load all data on mount
  useEffect(() => {
    fetchAll().then((fresh) => { setCache(fresh); setDb(fresh) })
  }, [])

  const allPosts      = db?.posts      ?? []
  const categories    = db?.categories ?? []
  const toldByList    = useMemo(() => [...new Set((db?.posts ?? []).map(p => p.author).filter(Boolean).map(n => n.trim()))].sort(), [db])
  const toldAboutList = useMemo(() => [...new Set((db?.posts ?? []).flatMap(p => (p.related || '').split(/\s{2,}|\n|,/).map(n => n.trim())).filter(n => n.length > 0))].sort(), [db])

  const fuse = useMemo(() => new Fuse(allPosts, {
    keys: ['title', 'author', 'category', 'related'],
    threshold: 0.3,
  }), [allPosts])

  const fuseToldBy = useMemo(() => new Fuse(allPosts, {
    keys: ['author'],
    threshold: 0.3,
  }), [allPosts])

  const fuseToldAbout = useMemo(() => new Fuse(allPosts, {
    keys: ['related'],
    threshold: 0.3,
  }), [allPosts])

  const results = useMemo(() => {
    let list

    if (!query.trim() && !(personMode?.by?.length || personMode?.about?.length)) {
      // Default: newest first
      list = [...allPosts].sort((a, b) => b.id - a.id)
    } else if (personMode && typeof personMode === 'object' && (personMode.by?.length || personMode.about?.length)) {
      const byNames    = personMode.by    || []
      const aboutNames = personMode.about || []

      if (byNames.length > 0 && aboutNames.length > 0) {
        list = allPosts.filter((post) => {
          const authorLower  = (post.author  || '').toLowerCase()
          const relatedLower = (post.related || '').toLowerCase()
          const case1 = byNames.some((n) => authorLower.includes(n.toLowerCase())) &&
                        aboutNames.some((n) => relatedLower.includes(n.toLowerCase()))
          const case2 = aboutNames.some((n) => authorLower.includes(n.toLowerCase())) &&
                        byNames.some((n) => relatedLower.includes(n.toLowerCase()))
          return case1 || case2
        })
      } else {
        list = allPosts.filter((post) => {
          const byMatch = byNames.length
            ? byNames.some((n) => (post.author || '').toLowerCase().includes(n.toLowerCase()))
            : true
          const aboutMatch = aboutNames.length
            ? aboutNames.some((n) => (post.related || '').toLowerCase().includes(n.toLowerCase()))
            : true
          return byMatch && aboutMatch
        })
      }
    } else {
      list = fuse.search(query).map((r) => r.item)
    }

    if (sortBy === 'title')  list.sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === 'author') list.sort((a, b) => a.author.localeCompare(b.author))
    if (sortBy === 'date')   list.sort((a, b) => b.date.localeCompare(a.date))
    return list
  }, [query, personMode, sortBy, allPosts, fuse, fuseToldBy, fuseToldAbout])

  // Show loading until data is ready
  if (!db) {
    return null
  }

  // Login screen
  if (!authed) {
    return (
      <Login onLogin={(pw) => { if (pw === (db.password ?? 'admin123')) { setAuthStamp(); setAuthed(true) } }} />
    )
  }

  // Post detail view
  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        similarPosts={allPosts.filter((p) => p.id !== selectedPost.id && p.category === selectedPost.category)}
        onBack={() => setSelectedPost(null)}
        onSelect={(p) => setSelectedPost(p)}
        onSearch={(q) => { setQuery(q); setSelectedPost(null) }}
        sortBy={sortBy}
        onSortChange={(v) => setSortBy(v)}
        sortOptions={SORT_OPTIONS}
      />
    )
  }

  return (
    <div className="page">
      {/* Overlays */}
      {menuOpen && (
        <Menu
          onClose={() => setMenuOpen(false)}
          onSearch={(kw) => { setQuery(kw); setMenuOpen(false) }}
          onViewByCategory={() => { setMenuOpen(false); setCatOpen(true) }}
          onSearchByPerson={() => { setMenuOpen(false); setPersonOpen(true) }}
        />
      )}
      {catOpen && (
        <CategoryMenu
          categories={categories}
          posts={allPosts}
          onClose={() => setCatOpen(false)}
          onSelect={(cat) => { setQuery(cat); setCatOpen(false) }}
        />
      )}
      {personOpen && (
        <PersonSearch
          toldByPeople={toldByList}
          toldAboutPeople={toldAboutList}
          onClose={() => setPersonOpen(false)}
          onSearch={(terms, filters) => {
            setQuery(terms)
            setPersonMode(filters || { by: [], about: [] })
            setPersonOpen(false)
          }}
        />
      )}

      {/* Header always visible */}
      <Header
        onMenuClick={() => setMenuOpen(true)}
        query={query}
        onSearch={(q) => { setQuery(q); setPersonMode({}) }}
        sortBy={sortBy}
        onSortChange={(v) => setSortBy(v)}
        sortOptions={SORT_OPTIONS}
      />

      {/* Results — inline below header */}
      {query.trim() ? (
        <SearchResults
          query={query}
          posts={results}
          onBack={() => setQuery('')}
          onSelect={(p) => setSelectedPost(p)}
          inline
        />
      ) : (
        <PostList posts={results} onSelect={(p) => setSelectedPost(p)} />
      )}
    </div>
  )
}
