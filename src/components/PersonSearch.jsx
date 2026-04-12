import { useState } from 'react'

export default function PersonSearch({ toldByPeople = [], toldAboutPeople = [], onClose, onSearch }) {
  const [showToldBy, setShowToldBy]       = useState(true)
  const [showToldAbout, setShowToldAbout] = useState(false)
  const [selectedBy, setSelectedBy]       = useState([])
  const [selectedAbout, setSelectedAbout] = useState([])
  const [keyword, setKeyword]             = useState('')

  function toggleBy(name) {
    setSelectedBy((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name])
  }

  function toggleAbout(name) {
    setSelectedAbout((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name])
  }

  function handleSearch() {
    const terms = [...selectedBy, ...selectedAbout, keyword.trim()].filter(Boolean).join(' ')
    onSearch(terms || '', { by: selectedBy, about: selectedAbout })
  }

  function handleReset() {
    setSelectedBy([])
    setSelectedAbout([])
    setKeyword('')
  }

  // Determine layout: both active = two columns, one active = single column
  const bothActive = showToldBy && showToldAbout

  return (
    <div className="person-page fade-in">
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

          {/* Toggle tabs */}
          <div className="person-tabs">
            <div className="person-tab" onClick={() => { setShowToldBy((v) => !v); if (showToldBy) setSelectedBy([]) }}>
              <span className={`person-check-box${showToldBy ? ' person-check-box--checked' : ''}`}>
                {showToldBy && <span className="check-mark" />}
              </span>
              <span className="person-col-label">TOLD BY</span>
            </div>
            <div className="person-tab" onClick={() => { setShowToldAbout((v) => !v); if (showToldAbout) setSelectedAbout([]) }}>
              <span className={`person-check-box${showToldAbout ? ' person-check-box--checked' : ''}`}>
                {showToldAbout && <span className="check-mark" />}
              </span>
              <span className="person-col-label">TOLD ABOUT</span>
            </div>
          </div>

          {/* People grid — two columns when both active, single when one */}
          {(showToldBy || showToldAbout) && (
            <div className={`person-rows${bothActive ? ' person-rows--two-col' : ''}`}>
              {bothActive ? (
                // Two column layout: left = told by, right = told about
                <>
                  <div className="person-col">
                    <div className="person-col-heading">TOLD BY</div>
                    {toldByPeople.map((name) => (
                      <button key={name} className="person-item" onClick={() => toggleBy(name)}>
                        <span className={`person-check-box${selectedBy.includes(name) ? ' person-check-box--checked' : ''}`}>
                          {selectedBy.includes(name) && <span className="check-mark" />}
                        </span>
                        <span className="person-name">{name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="person-col">
                    <div className="person-col-heading">TOLD ABOUT</div>
                    {toldAboutPeople.map((name) => (
                      <button key={name} className="person-item" onClick={() => toggleAbout(name)}>
                        <span className={`person-check-box${selectedAbout.includes(name) ? ' person-check-box--checked' : ''}`}>
                          {selectedAbout.includes(name) && <span className="check-mark" />}
                        </span>
                        <span className="person-name">{name}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : showToldBy ? (
                // Single column: told by
                (() => {
                  const left  = toldByPeople.filter((_, i) => i % 2 === 0)
                  const right = toldByPeople.filter((_, i) => i % 2 !== 0)
                  return left.map((name, i) => (
                    <div className="person-row" key={name}>
                      <button className="person-item" onClick={() => toggleBy(name)}>
                        <span className={`person-check-box${selectedBy.includes(name) ? ' person-check-box--checked' : ''}`}>
                          {selectedBy.includes(name) && <span className="check-mark" />}
                        </span>
                        <span className="person-name">{name}</span>
                      </button>
                      {right[i] && (
                        <button className="person-item person-item--right" onClick={() => toggleBy(right[i])}>
                          <span className={`person-check-box${selectedBy.includes(right[i]) ? ' person-check-box--checked' : ''}`}>
                            {selectedBy.includes(right[i]) && <span className="check-mark" />}
                          </span>
                          <span className="person-name">{right[i]}</span>
                        </button>
                      )}
                    </div>
                  ))
                })()
              ) : (
                // Single column: told about
                (() => {
                  const left  = toldAboutPeople.filter((_, i) => i % 2 === 0)
                  const right = toldAboutPeople.filter((_, i) => i % 2 !== 0)
                  return left.map((name, i) => (
                    <div className="person-row" key={name}>
                      <button className="person-item" onClick={() => toggleAbout(name)}>
                        <span className={`person-check-box${selectedAbout.includes(name) ? ' person-check-box--checked' : ''}`}>
                          {selectedAbout.includes(name) && <span className="check-mark" />}
                        </span>
                        <span className="person-name">{name}</span>
                      </button>
                      {right[i] && (
                        <button className="person-item person-item--right" onClick={() => toggleAbout(right[i])}>
                          <span className={`person-check-box${selectedAbout.includes(right[i]) ? ' person-check-box--checked' : ''}`}>
                            {selectedAbout.includes(right[i]) && <span className="check-mark" />}
                          </span>
                          <span className="person-name">{right[i]}</span>
                        </button>
                      )}
                    </div>
                  ))
                })()
              )}
            </div>
          )}

          <div className="person-divider" />

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
