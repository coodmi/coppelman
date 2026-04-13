export default function Header({ onMenuClick, query, onSearch, isSearching }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger" aria-label="Menu" onClick={onMenuClick}>
          <span />
          <span />
        </button>
      </div>

      <div className="header-title-wrap">
        <input
          className="header-title-input"
          type="search"
          placeholder="Quick Search"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search"
        />
      </div>
    </header>
  )
}
