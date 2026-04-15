import { useState, useEffect } from 'react'

const INCLUDE_OPTIONS = ['ALL', 'KEYWORD', 'TOLD BY', 'TOLD ABOUT']

const ARRANGE_OPTIONS = [
  { value: 'default',   label: 'Default' },
  { value: 'title',     label: 'Title A–Z' },
  { value: 'date',      label: 'Date' },
  { value: 'author',    label: 'Told By A–Z' },
  { value: 'toldAbout', label: 'Told About A–Z' },
]

export default function SearchResults({ query, posts, onSelect, onCategoryClick, sortBy, onSortChange, searchSource, personMode }) {
  const [filter, setFilter]         = useState('ALL')
  const [filterOpen, setFilterOpen] = useState(false)

  // Reset filter on new search query
  useEffect(() => { setFilter('ALL') }, [query])

  const hasQuery   = !!query.trim()
  const useArrange = !hasQuery || searchSource === 'category'

  // Derive include label from personMode
  function getIncludeLabel() {
    const hasByMode    = personMode?.by?.length > 0
    const hasAboutMode = personMode?.about?.length > 0
    const hasKeyword   = query.trim() && searchSource !== 'category' && searchSource !== 'person'

    if (searchSource === 'person') {
      if (hasByMode && hasAboutMode) return 'INCLUDE: ALL'
      if (hasByMode)                 return 'INCLUDE: TOLD BY'
      if (hasAboutMode)              return 'INCLUDE: TOLD ABOUT'
      if (query.trim())              return 'INCLUDE: KEYWORD'
      return 'INCLUDE: ALL'
    }
    if (hasKeyword) return `INCLUDE: ${filter}`
    return `INCLUDE: ${filter}`
  }

  // Apply include filter
  const filtered = (() => {
    if (!hasQuery || useArrange) return posts

    // Person search — filter already-correct results by mode
    if (searchSource === 'person') {
      if (filter === 'ALL') return posts
      const byNames    = (personMode?.by    || []).map(n => n.toLowerCase())
      const aboutNames = (personMode?.about || []).map(n => n.toLowerCase())
      const allNames   = [...new Set([...byNames, ...aboutNames])]

      if (filter === 'TOLD BY')
        return posts.filter(p =>
          allNames.some(n => (p.author || '').toLowerCase().includes(n))
        )
      if (filter === 'TOLD ABOUT')
        return posts.filter(p => {
          const rel = (p.related || '').toLowerCase()
          return allNames.some(n => rel.includes(n))
        })
      if (filter === 'KEYWORD') {
        const kw = query.toLowerCase()
        return posts.filter(p =>
          (p.title || '').toLowerCase().includes(kw) || (p.body || '').toLowerCase().includes(kw)
        )
      }
      return posts
    }

    // Keyword search
    const q = query.toLowerCase()
    return posts.filter((post) => {
      if (filter === 'ALL') return true
      if (filter === 'TOLD BY')    return (post.author  || '').toLowerCase().includes(q)
      if (filter === 'TOLD ABOUT') return (post.related || '').toLowerCase().includes(q)
      if (filter === 'KEYWORD')    return (post.title   || '').toLowerCase().includes(q) ||
                                          (post.body    || '').toLowerCase().includes(q)
      return true
    })
  })()

  return (
    <div className="results-page">

      {/* Show heading + query only when searching */}
      {hasQuery && (
        <div className="results-heading-wrap">
          <div>
            <div className="results-heading">Search Result</div>
            <div className="results-query-label">
              {searchSource === 'category' ? 'Category: ' : 'Search Query: '}{query}
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="results-filter-bar">
        <div className="results-filter">
          <button className="results-filter-box" onClick={() => setFilterOpen(v => !v)}>
            <span className="results-filter-label">
              {useArrange
                ? (sortBy && sortBy !== 'default'
                    ? ARRANGE_OPTIONS.find(o => o.value === sortBy)?.label || 'ARRANGE BY'
                    : 'ARRANGE BY')
                : `INCLUDE: ${filter}`}
            </span>
            <span className="results-filter-arrow" />
          </button>
          {filterOpen && (
            <div className="results-filter-dropdown">
              {useArrange
                ? ARRANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`results-filter-option${sortBy === opt.value ? ' results-filter-option--active' : ''}`}
                      onClick={() => { onSortChange?.(opt.value); setFilterOpen(false) }}
                    >
                      {opt.label}
                    </button>
                  ))
                : INCLUDE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      className={`results-filter-option${filter === opt ? ' results-filter-option--active' : ''}`}
                      onClick={() => { setFilter(opt); setFilterOpen(false) }}
                    >
                      {opt}
                    </button>
                  ))
              }
            </div>
          )}
        </div>
      </div>

      <div className="results-divider" />

      {/* Post list */}
      <div className="post-list">
        {filtered.length === 0 && (
          <div className="no-results">No results for "{query}"</div>
        )}
        {filtered.map((post) => (
          <article
            className="post-item"
            key={post.id}
          >
            <div className="post-meta">
              <span className="meta-author">{post.author}</span>
              <span
                className="meta-category meta-category--link"
                onClick={(e) => { e.stopPropagation(); onCategoryClick?.(post.category) }}
              >{post.category}</span>
            </div>
            <h2 className="post-title" onClick={() => onSelect?.(post)}>{post.title}</h2>
            <div className="post-told-row">
              <span className="post-told">{post.toldAbout}</span>
              {post.related && <span className="post-related-inline">{post.related}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
