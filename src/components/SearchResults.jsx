import { useState } from 'react'

const FILTER_OPTIONS = ['ALL', 'KEYWORD', 'TOLD BY', 'TOLD ABOUT']

export default function SearchResults({ query, posts, onSelect }) {
  const [filter, setFilter]         = useState('ALL')
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered = posts.filter((post) => {
    if (filter === 'ALL')        return true
    if (filter === 'TOLD BY')    return !!(post.author)
    if (filter === 'TOLD ABOUT') return !!(post.related)
    if (filter === 'KEYWORD')    return query.trim()
      ? (post.title || '').toLowerCase().includes(query.toLowerCase())
      : true
    return true
  })

  const hasQuery = !!query.trim()

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

      {/* Filter bar — always visible on right */}
      <div className="results-filter-bar">
        <div className="results-filter">
          <button className="results-filter-box" onClick={() => setFilterOpen(v => !v)}>
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
