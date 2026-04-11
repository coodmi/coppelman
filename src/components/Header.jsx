import { useState } from 'react'

export default function Header({ onMenuClick, onSearch, sortBy, onSortChange, sortOptions }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  function handleChange(e) {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger" aria-label="Menu" onClick={onMenuClick}>
          <span />
          <span />
        </button>
      </div>

      {searchOpen ? (
        <form className="header-search-form" onSubmit={handleSubmit}>
          <input
            className="header-search-input"
            type="search"
            placeholder="Search posts, authors, topics…"
            value={query}
            onChange={handleChange}
            autoFocus
            aria-label="Search"
          />
          <button
            type="button"
            className="header-search-close"
            onClick={() => { setSearchOpen(false); setQuery(''); onSearch('') }}
            aria-label="Close search"
          >✕</button>
        </form>
      ) : (
        <>
          <div className="header-title">Quick Search</div>
          <div className="header-right">
            {/* Arrange by */}
            <div className="header-arrange">
              <span className="arrange-label">ARRANGE BY</span>
              <select
                className="arrange-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                aria-label="Arrange posts by"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {/* Search icon */}
            <button
              className="header-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.5" cy="7.5" r="6" stroke="#888" strokeWidth="1.5"/>
                <line x1="12" y1="12" x2="17" y2="17" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </header>
  )
}
