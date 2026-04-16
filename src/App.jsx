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

const AUTH_KEY  = 'qs_auth_ts'
const AUTH_DAYS = 15

function isAuthValid() {
  // Check cookie first, fallback to localStorage
  const cookie = document.cookie.split(';').find(c => c.trim().startsWith(AUTH_KEY + '='))
  if (cookie) {
    const ts = cookie.split('=')[1]
    if (ts && Date.now() - parseInt(ts) < AUTH_DAYS * 24 * 60 * 60 * 1000) return true
  }
  // localStorage fallback
  const ts = localStorage.getItem(AUTH_KEY)
  if (!ts) return false
  return Date.now() - parseInt(ts) < AUTH_DAYS * 24 * 60 * 60 * 1000
}

function setAuthStamp() {
  const ts   = Date.now().toString()
  const days = AUTH_DAYS
  const exp  = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${AUTH_KEY}=${ts}; expires=${exp}; path=/; SameSite=Lax`
  try { localStorage.setItem(AUTH_KEY, ts) } catch {}
}

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default' },
  { value: 'title',      label: 'Title A–Z' },
  { value: 'date',       label: 'Date' },
  { value: 'author',     label: 'Told By A–Z' },
  { value: 'toldAbout',  label: 'Told About A–Z' },
]

// Slug helper
function slugify(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

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
  const [searchSource, setSearchSource] = useState('') // 'category' | 'person' | ''
  const [sortBy, setSortBy]             = useState('default')
  const [selectedPost, setSelectedPost] = useState(null)

  // Sync URL when post selected
  function selectPost(post) {
    setSelectedPost(post)
    window.scrollTo(0, 0)
    if (post) {
      const slug = slugify(post.title)
      window.history.pushState({ postId: post.id }, '', `/post/${post.id}-${slug}`)
    } else {
      window.history.pushState({}, '', '/')
    }
  }

  // Sync URL when category selected
  function selectCategory(cat) {
    setQuery(cat)
    setCatOpen(false)
    setSearchSource('category')
    window.history.pushState({}, '', `/category/${slugify(cat)}`)
  }

  // Sync URL when person search runs
  function selectPerson(terms, filters) {
    setQuery(terms)
    setPersonMode(filters || {})
    setPersonOpen(false)
    setSearchSource('person')
    window.history.pushState({}, '', `/person/${slugify(terms)}`)
  }

  // Handle browser back/forward
  useEffect(() => {
    function onPop() {
      const path = window.location.pathname
      const postMatch   = path.match(/^\/post\/(\d+)/)
      const catMatch    = path.match(/^\/category\/(.+)/)
      const personMatch = path.match(/^\/person\/(.+)/)

      if (postMatch) {
        const id   = parseInt(postMatch[1])
        const post = (db?.posts ?? []).find(p => p.id === id)
        if (post) { setSelectedPost(post); return }
      }
      if (path === '/categories') { setCatOpen(true); return }
      if (path === '/person')     { setPersonOpen(true); return }
      if (catMatch) {
        const slug = catMatch[1]
        const cat  = (db?.categories ?? []).find(c => slugify(c) === slug) || slug
        setQuery(cat); setSelectedPost(null); return
      }
      if (personMatch) {
        setQuery(decodeURIComponent(personMatch[1].replace(/-/g, ' ')))
        setSelectedPost(null); return
      }
      setSelectedPost(null)
      setQuery('')
      setCatOpen(false)
      setPersonOpen(false)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [db])

  function refreshData() {
    fetchAll().then((fresh) => { setCache(fresh); setDb(fresh) })
  }

  // Load all data on mount
  useEffect(() => {
    fetchAll().then((fresh) => {
      setCache(fresh)
      setDb(fresh)
      // Restore post from URL on initial load
      const match = window.location.pathname.match(/^\/post\/(\d+)/)
      if (match) {
        const id   = parseInt(match[1])
        const post = fresh.posts?.find(p => p.id === id)
        if (post) setSelectedPost(post)
      }
    })
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
        // Show posts where any selected name appears as author OR in related
        const allNames = [...byNames, ...aboutNames]
        list = allPosts.filter((post) => {
          const authorLower  = (post.author  || '').toLowerCase()
          const relatedLower = (post.related || '').toLowerCase()
          return allNames.some((n) =>
            authorLower.includes(n.toLowerCase()) || relatedLower.includes(n.toLowerCase())
          )
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
      if (searchSource === 'category') {
        // Exact category match — support multi-category posts (comma separated)
        // Also include posts from subcategories when parent is selected
        const qLower = query.toLowerCase()
        const allCats = _cache?.categories ?? []
        // Find if query matches a parent category — if so, include subcategories too
        const parentCat = allCats.find(c => {
          const name = typeof c === 'string' ? c : c.name
          return name.toLowerCase() === qLower
        })
        const subNames = parentCat && typeof parentCat !== 'string' && parentCat.subs?.length
          ? parentCat.subs.map(s => s.toLowerCase())
          : []

        list = allPosts.filter(post => {
          const cats = (post.category || '').split(/,\s*/).map(c => c.trim().toLowerCase())
          return cats.some(c => c === qLower || c.includes(qLower) || subNames.includes(c))
        })
      } else {
        list = fuse.search(query).map((r) => r.item)
      }
    }

    if (sortBy === 'title')     list.sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === 'author')    list.sort((a, b) => (a.author || '').localeCompare(b.author || ''))
    if (sortBy === 'date')      list.sort((a, b) => b.date.localeCompare(a.date))
    if (sortBy === 'toldAbout') list.sort((a, b) => (a.related || '').localeCompare(b.related || ''))
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
        onBack={() => selectPost(null)}
        onSelect={(p) => selectPost(p)}
        onSearch={(q) => { setQuery(q); selectPost(null) }}
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
          onSearch={(kw) => { setQuery(kw); setMenuOpen(false); window.history.pushState({}, '', `/search/${slugify(kw)}`) }}
          onViewByCategory={() => { setMenuOpen(false); setCatOpen(true); window.history.pushState({}, '', '/categories') }}
          onSearchByPerson={() => { setMenuOpen(false); setPersonOpen(true); window.history.pushState({}, '', '/person') }}
        />
      )}
      {catOpen && (
        <CategoryMenu
          categories={categories}
          posts={allPosts}
          onClose={() => setCatOpen(false)}
          onSelect={(cat) => selectCategory(cat)}
        />
      )}
      {personOpen && (
        <PersonSearch
          toldByPeople={toldByList}
          toldAboutPeople={toldAboutList}
          onClose={() => setPersonOpen(false)}
          onSearch={(terms, filters) => selectPerson(terms, filters)}
        />
      )}

      {/* Header always visible */}
      <Header
        onMenuClick={() => setMenuOpen(true)}
        onSearch={(q) => { setQuery(q); setPersonMode({}); setSearchSource('') }}
        isSearching={!!query.trim()}
      />

      {/* Always use SearchResults layout — shows all posts on home, filtered on search */}
      <SearchResults
        query={query}
        posts={results}
        onBack={() => setQuery('')}
        onSelect={(p) => selectPost(p)}
        onCategoryClick={(cat) => selectCategory(cat)}
        sortBy={sortBy}
        onSortChange={(v) => setSortBy(v)}
        searchSource={searchSource}
        personMode={personMode}
      />
    </div>
  )
}
