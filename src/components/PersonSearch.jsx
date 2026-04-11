import { useState } from 'react'

export default function PersonSearch({ people = [], onClose, onSearch }) {
  const [toldBy, setToldBy]       = useState(true)
  const [toldAbout, setToldAbout] = useState(true)
  const [selected, setSelected]   = useState([])
  const [keyword, setKeyword]     = useState('')

  function toggle(name) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  function handleSearch() {
    const terms = [...selected, keyword.trim()].filter(Boolean).join(' ')
    onSearch(terms || '')
  }

  function handleReset() {
    setSelected([])
    setKeyword('')
  }

  const left  = people.filter((_, i) => i % 2 === 0)
  const right = people.filter((_, i) => i % 2 !== 0)

  return (
    <div className="person-page fade-in">
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
          <button className="person-back" onClick={onClose} aria-label="Back">‹</button>

          <div className="person-heading">Search by Person</div>
          <div className="person-divider" />

          {/* TOLD BY / TOLD ABOUT checkboxes */}
          <div className="person-tabs">
            <label className="person-tab" onClick={() => setToldBy((v) => !v)}>
              <span className={`person-check-box${toldBy ? ' person-check-box--checked' : ''}`}>
                {toldBy && <span className="check-mark" />}
              </span>
              <span className="person-col-label">TOLD BY</span>
            </label>
            <label className="person-tab" onClick={() => setToldAbout((v) => !v)}>
              <span className={`person-check-box${toldAbout ? ' person-check-box--checked' : ''}`}>
                {toldAbout && <span className="check-mark" />}
              </span>
              <span className="person-col-label">TOLD ABOUT</span>
            </label>
          </div>

          {/* People grid */}
          <div className="person-rows">
            {left.map((name, i) => (
              <div className="person-row" key={name}>
                <button
                  className="person-item"
                  onClick={() => toggle(name)}
                  aria-pressed={selected.includes(name)}
                >
                  <span className={`person-check-box${selected.includes(name) ? ' person-check-box--checked' : ''}`}>
                    {selected.includes(name) && <span className="check-mark" />}
                  </span>
                  <span className="person-name">{name}</span>
                </button>

                {right[i] && (
                  <button
                    className="person-item person-item--right"
                    onClick={() => toggle(right[i])}
                    aria-pressed={selected.includes(right[i])}
                  >
                    <span className={`person-check-box${selected.includes(right[i]) ? ' person-check-box--checked' : ''}`}>
                      {selected.includes(right[i]) && <span className="check-mark" />}
                    </span>
                    <span className="person-name">{right[i]}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="person-divider" />

          {/* Keyword */}
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

          <button className="person-search-btn" onClick={handleSearch}>SEARCH</button>

          <div className="person-reset-wrap">
            <button className="person-reset-btn" onClick={handleReset}>RESET</button>
          </div>
        </div>
      </div>
    </div>
  )
}
