import { useState } from 'react'

const FILTER_OPTIONS = ['ALL', 'KEYWORD', 'TOLD BY', 'TOLD ABOUT']

export default function SearchResults({ query, posts, onBack, onSelect }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState('ALL')

  return (
    <div className="results-page">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <button className="hamburger" aria-label="Back" onClick={onBack}>
            <span />
            <span />
          </button>
        </div>
        <div className="header-title">Quick Search</div>

        {/* Filter dropdown */}
        <div className="results-filter">
          <div className="results-filter-box" onClick={() => setFilterOpen((v) => !v)}>
            <span className="results-filter-label">INCLUDE: {filter}</span>
            <span className="results-filter-arrow" />
          </div>
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

      {/* Results heading + query */}
      <div className="results-heading-row">
        <div className="results-heading">Search Results</div>
        <div className="results-query">Search Query: {query}</div>
      </div>

      {/* Post list */}
      <div className="post-list">
        {posts.length === 0 && (
          <div className="no-results">No results for "{query}"</div>
        )}
        {posts.map((post) => (
          <article className="post-item" key={post.id}>
            <div className="post-meta">
              <span className="meta-author">{post.author}</span>
              <span className="meta-category">{post.category}</span>
            </div>
            <h2 className="post-title" onClick={() => onSelect?.(post)}>{post.title}</h2>
            <div className="post-told">{post.toldAbout}</div>
            <div className="post-related">{post.related}</div>
          </article>
        ))}
      </div>
    </div>
  )
}
