import { useState } from 'react'

export default function Menu({ onClose, onSearch, onViewByCategory, onSearchByPerson }) {
  const [keyword, setKeyword] = useState('')

  function handleGo(e) {
    e.preventDefault()
    if (keyword.trim()) onSearch(keyword)
  }

  return (
    <div className="menu-page fade-in">
      {/* Header */}
      <div className="menu-header">
        <div className="menu-header-left">
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            <span className="close-line close-line--1" />
            <span className="close-line close-line--2" />
          </button>
        </div>
      </div>

      {/* Nav links */}
      <nav className="menu-nav">
        <button className="menu-nav-item" onClick={onSearchByPerson}>
          <span className="menu-nav-label">Search by Person</span>
          <span className="menu-nav-arrow">
            <span className="arrow-line arrow-line--top" />
            <span className="arrow-line arrow-line--bottom" />
          </span>
        </button>

        <button className="menu-nav-item" onClick={onViewByCategory}>
          <span className="menu-nav-label">View by Category</span>
          <span className="menu-nav-arrow">
            <span className="arrow-line arrow-line--top" />
            <span className="arrow-line arrow-line--bottom" />
          </span>
        </button>
      </nav>

      {/* Keyword search */}
      <form className="menu-search-form" onSubmit={handleGo}>
        <div className="login-row">
          <input
            className="login-input"
            type="search"
            placeholder="Keyword Search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Keyword search"
          />
          <button className="login-go" type="submit">GO</button>
        </div>
      </form>
    </div>
  )
}
