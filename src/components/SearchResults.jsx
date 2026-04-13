import { useState } from 'react'

const FILTER_OPTIONS = ['ALL', 'KEYWORD', 'TOLD BY', 'TOLD ABOUT']

export default function SearchResults({ query, posts, onSelect, inline }) {
  const [filter, setFilter]   = useState('ALL')
  const [filterOpen, setFilterOpen] = useState(false)

  // Apply filter
  const filtered = posts.filter((post) => {
    if (filter === 'ALL')        return true
    if (filter === 'TOLD BY')    return (post.author  || '').toLowerCase().includes(query.toLowerCase())
    if (filter === 'TOLD ABOUT') return (post.related || '').toLowerCase().includes(query.toLowerCase())
    return true // KEYWORD — already filtered by fuse
  })

  return (
    <div className="results-page">
      {/* Heading row */}
      <div className="results-top">
        <div className="results-top-left">
          <div className="results-heading">Search Result</div>
          <div className="results-query-label">Search Query: {query}</div>
        </div>
        <div className="results-filter">
          <button
            className="results-filter-box"
            onClick={() => setFilterOpen(v => !v)}
          >
            <span className="results-filter-label">INCLUDE: {filter}</span>
            <span className="results-filter-arrow" />
          </button>
          {filterOpen && (
            <div className="results-filter-dropdown">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`results-filter-option${filter === opt ? ' results-filter-option--active' : ''}`}
                  onClick={() => { setFilter(opt); setFilterOpen(false) }}
                >
                  {opt}
                </button>
              ))}
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
            <div className="post-told">{post.toldAbout}</div>
            <div className="post-related">{post.related}</div>
          </article>
        ))}
      </div>
    </div>
  )
}
