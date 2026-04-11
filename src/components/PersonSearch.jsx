import { useState } from 'react'

export default function PersonSearch({ people = [], onClose, onSearch }) {
  const [toldBy, setToldBy] = useState([])
  const [toldAbout, setToldAbout] = useState([])
  const [keyword, setKeyword] = useState('')

  function toggleToldBy(name) {
    setToldBy((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  function toggleToldAbout(name) {
    setToldAbout((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  function handleSearch() {
    const terms = [...toldBy, ...toldAbout, keyword].filter(Boolean).join(' ')
    onSearch(terms || '')
  }

  const leftPeople  = people.filter((_, i) => i % 2 === 0)
  const rightPeople = people.filter((_, i) => i % 2 !== 0)

  return (
    <div className="person-page">
      {/* Header */}
      <div className="menu-header">
        <div className="menu-header-left">
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <span className="close-line close-line--1" />
            <span className="close-line close-line--2" />
          </button>
        </div>
        <div className="header-title">Quick Search</div>
      </div>

      <div className="person-body">
        <div className="cat-sidebar" />

        <div className="person-content">
          <div className="person-heading">Search by Person</div>

          <div className="person-divider" />

          {/* Column headers */}
          <div className="person-col-headers">
            <div className="person-col-header-left">
              <span className="person-check-box person-check-box--filled" aria-hidden="true">
                <span className="check-mark" />
              </span>
              <span className="person-col-label">TOLD BY</span>
            </div>
            <div className="person-col-header-right">
              <span className="person-check-box person-check-box--filled" aria-hidden="true">
                <span className="check-mark" />
              </span>
              <span className="person-col-label">TOLD ABOUT</span>
            </div>
          </div>

          {/* People rows */}
          <div className="person-rows">
            {leftPeople.map((name, i) => (
              <div className="person-row" key={name}>
                {/* Left person */}
                <button
                  className="person-item"
                  onClick={() => toggleToldBy(name)}
                  aria-pressed={toldBy.includes(name)}
                >
                  <span className={`person-check-box${toldBy.includes(name) ? ' person-check-box--checked' : ''}`} />
                  <span className="person-name">{name}</span>
                </button>

                {/* Right person */}
                {rightPeople[i] && (
                  <button
                    className="person-item person-item--right"
                    onClick={() => toggleToldAbout(rightPeople[i])}
                    aria-pressed={toldAbout.includes(rightPeople[i])}
                  >
                    <span className={`person-check-box${toldAbout.includes(rightPeople[i]) ? ' person-check-box--checked' : ''}`} />
                    <span className="person-name">{rightPeople[i]}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="person-divider" />

          {/* Keyword input */}
          <div className="person-keyword-wrap">
            <input
              className="person-keyword"
              type="text"
              placeholder="Include Keywords"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label="Include keywords"
            />
          </div>

          <div className="person-divider" />

          {/* Search button */}
          <button className="person-search-btn" onClick={handleSearch}>
            SEARCH
          </button>
        </div>
      </div>
    </div>
  )
}
