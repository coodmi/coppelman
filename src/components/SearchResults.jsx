import { useState } from 'react'

const INCLUDE_OPTIONS = ['ALL', 'KEYWORD', 'TOLD BY', 'TOLD ABOUT']

const ARRANGE_OPTIONS = [
  { value: 'default',   label: 'Default' },
  { value: 'title',     label: 'Title A–Z' },
  { value: 'date',      label: 'Date' },
  { value: 'author',    label: 'Told By A–Z' },
  { value: 'toldAbout', label: 'Told About A–Z' },
]

export default function SearchResults({ query, posts, onSelect, sortBy, onSortChange, searchSource }) {
  const [filter, setFilter]         = useState('ALL')
  const [filterOpen, setFilterOpen] = useState(false)

  const hasQuery   = !!query.trim()
  // Category results → ARRANGE BY; keyword/person/home → ARRANGE BY on home, INCLUDE on search
  const useArrange = !hasQuery || searchSource === 'category'

  // Apply include filter only for keyword/person searches
  const filtered = (!hasQuery || useArrange) ? posts : posts.filter((post) => {
    if (filter === 'ALL') return true
    const q = query.toLowerCase()
    if (filter === 'TOLD BY')    return (post.author  || '').toLowerCase().includes(q)
    if (filter === 'TOLD ABOUT') return (post.related || '').toLowerCase().includes(q)
    if (filter === 'KEYWORD')    return (post.title   || '').toLowerCase().includes(q) ||
                                        (post.body    || '').toLowerCase().includes(q)
    return true
  })

  return (
    <div className="results-page">

      {/* Show heading + query only when searching */}
      {hasQuery && (
        <div className="results-heading-wrap">
          <div>
            <div className="results-heading">Search Result</div>
            <div className="results-query-label">Search Query: {query}</div>
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
            onClick={() => onSelect?.(post)}
            style={{ cursor: 'pointer' }}
          >
            <div className="post-meta">
              <span className="meta-author">{post.author}</span>
              <span className="meta-category">{post.category}</span>
            </div>
            <h2 className="post-title">{post.title}</h2>
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
