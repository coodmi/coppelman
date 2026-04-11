export default function Header({ onMenuClick, onSearch, sortBy, onSortChange, sortOptions }) {
  function handleChange(e) {
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

      <div className="header-title-wrap">
        <input
          className="header-title-input"
          type="search"
          placeholder="Quick Search"
          onChange={handleChange}
          aria-label="Search"
        />
      </div>

      <div className="header-right">
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
      </div>
    </header>
  )
}
