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
import { fetchAll, setCache, getPosts, getCategories, getToldBy, getToldAbout, getPassword } from './store'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'title',   label: 'Title A–Z' },
  { value: 'author',  label: 'Author A–Z' },
  { value: 'date',    label: 'Date' },
]

export default function App() {
  const [authed, setAuthed]           = useState(false)
  const [loaded, setLoaded]           = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [catOpen, setCatOpen]         = useState(false)
  const [personOpen, setPersonOpen]   = useState(false)
  const [query, setQuery]             = useState('')
  const [personMode, setPersonMode]   = useState('toldBy')
  const [sortBy, setSortBy]           = useState('default')
  const [selectedPost, setSelectedPost] = useState(null)
  const [dataVersion, setDataVersion] = useState(0)
  function refreshData() { setDataVersion((v) => v + 1) }

  // Load all data from server on mount
  useEffect(() => {
    fetchAll().then((db) => {
      setCache(db)
      setLoaded(true)
    })
  }, [])

  // Reload when dataVersion changes (after admin saves)
  useEffect(() => {
    if (dataVersion === 0) return
    fetchAll().then((db) => setCache(db))
  }, [dataVersion])

  const allPosts      = useMemo(() => getPosts(),      [dataVersion, loaded])
  const categories    = useMemo(() => getCategories(), [dataVersion, loaded])
  const toldByList    = useMemo(() => getToldBy(),     [dataVersion, loaded])
  const toldAboutList = useMemo(() => getToldAbout(),  [dataVersion, loaded])

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

    if (!query.trim()) {
      list = [...allPosts]
    } else if (personMode && typeof personMode === 'object' && (personMode.by?.length || personMode.about?.length)) {
      const byNames    = personMode.by    || []
      const aboutNames = personMode.about || []
      const allSelected = [...new Set([...byNames, ...aboutNames])]

      if (byNames.length > 0 && aboutNames.length > 0) {
        // Cross-search: show posts where any selected person told about any other selected person
        // i.e. (author in byNames AND related contains aboutNames)
        //   OR (author in aboutNames AND related contains byNames)
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
        // Only one side selected — simple filter
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

  // Login screen
  if (!authed) {
    return (
      <Login onLogin={(pw) => { if (pw === getPassword()) setAuthed(true) }} />
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
