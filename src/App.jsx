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
  const [authed, setAuthed]           = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [catOpen, setCatOpen]         = useState(false)
  const [personOpen, setPersonOpen]   = useState(false)
  const [query, setQuery]             = useState('')
  const [sortBy, setSortBy]           = useState('default')
  const [selectedPost, setSelectedPost] = useState(null)
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

      {/* Header always visible */}
      <Header
        onMenuClick={() => setMenuOpen(true)}
        query={query}
        onSearch={(q) => setQuery(q)}
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
