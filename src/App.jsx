import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import Header from './components/Header'
import PostList from './components/PostList'
import Login from './components/Login'
import Menu from './components/Menu'
import CategoryMenu from './components/CategoryMenu'
import PersonSearch from './components/PersonSearch'
import SearchResults from './components/SearchResults'
import PostDetail from './components/PostDetail'
import { getPosts, getCategories, getPeople, getPassword } from './store'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'title',   label: 'Title A–Z' },
  { value: 'author',  label: 'Author A–Z' },
  { value: 'date',    label: 'Date' },
]

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [catOpen, setCatOpen]     = useState(false)
  const [personOpen, setPersonOpen] = useState(false)
  const [query, setQuery]         = useState('')
  const [sortBy, setSortBy]       = useState('default')
  const [selectedPost, setSelectedPost] = useState(null)
  // re-render trigger when admin saves data
  const [dataVersion, setDataVersion] = useState(0)
  function refreshData() { setDataVersion((v) => v + 1) }

  const allPosts   = useMemo(() => getPosts(),      [dataVersion])
  const categories = useMemo(() => getCategories(), [dataVersion])
  const people     = useMemo(() => getPeople(),     [dataVersion])

  const fuse = useMemo(() => new Fuse(allPosts, {
    keys: ['title', 'author', 'category', 'related'],
    threshold: 0.35,
  }), [allPosts])

  const results = useMemo(() => {
    let list = query.trim()
      ? fuse.search(query).map((r) => r.item)
      : [...allPosts]
    if (sortBy === 'title')  list.sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === 'author') list.sort((a, b) => a.author.localeCompare(b.author))
    if (sortBy === 'date')   list.sort((a, b) => b.date.localeCompare(a.date))
    return list
  }, [query, sortBy, allPosts, fuse])

  // Login screen
  if (!authed) {
    return (
      <Login
        onLogin={(pw) => {
          if (pw === getPassword()) setAuthed(true)
        }}
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
          onClose={() => setCatOpen(false)}
          onSelect={(cat) => { setQuery(cat); setCatOpen(false) }}
        />
      )}
      {personOpen && (
        <PersonSearch
          people={people}
          onClose={() => setPersonOpen(false)}
          onSearch={(terms) => { setQuery(terms); setPersonOpen(false) }}
        />
      )}

      {/* Pages */}
      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          similarPosts={allPosts.filter((p) => p.id !== selectedPost.id && p.category === selectedPost.category)}
          onBack={() => setSelectedPost(null)}
          onSelect={(p) => setSelectedPost(p)}
        />
      ) : query.trim() ? (
        <SearchResults
          query={query}
          posts={results}
          onBack={() => setQuery('')}
          onSelect={(p) => setSelectedPost(p)}
        />
      ) : (
        <>
          <Header onMenuClick={() => setMenuOpen(true)} />
          <div className="arrange-bar">
            <span className="arrange-label">ARRANGE BY</span>
            <select
              className="arrange-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Arrange posts by"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="search-bar">
            <input
              className="search-input"
              type="search"
              placeholder="Search posts, authors, topics…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
            />
          </div>
          <PostList posts={results} onSelect={(p) => setSelectedPost(p)} />
        </>
      )}
    </div>
  )
}
