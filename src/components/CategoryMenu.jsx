import { useState } from 'react'

export default function CategoryMenu({ categories = [], onClose, onSelect }) {
  const [expanded, setExpanded] = useState(null)

  // Build category list with Golf subcategories hardcoded for now
  const CATS = categories.map((name) => ({
    name,
    subcategories: name === 'Golf'
      ? ['VIEW ALL','ORIGIN STORIES','QUOTES','CONSTRUCTION','COLLABORATION','HISTORICAL WORK','ENVIRONMENTALISM & CONSERVATION','INSPIRATION']
      : [],
  }))

  function toggle(name) {
    setExpanded((prev) => (prev === name ? null : name))
  }

  return (
    <div className="cat-page">
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

      <div className="cat-body">
        {/* Left gradient bar */}
        <div className="cat-sidebar" />

        <div className="cat-list">
          {/* "View by Category" heading */}
          <div className="cat-heading">View by Category</div>

          {CATS.map((cat) => (
            <div key={cat.name}>
              <div className="cat-divider" />
              <button
                className="cat-item"
                onClick={() => cat.subcategories.length ? toggle(cat.name) : onSelect(cat.name)}
              >
                <span className="cat-item-label">{cat.name}</span>
                {cat.subcategories.length > 0 && (
                  <span className="cat-arrow">
                    <span className={`cat-arrow-v`} />
                    <span className={`cat-arrow-h`} />
                  </span>
                )}
              </button>

              {/* Subcategories */}
              {expanded === cat.name && cat.subcategories.length > 0 && (
                <div className="cat-subs">
                  <div className="cat-subs-col">
                    {cat.subcategories.filter((_, i) => i % 2 === 0).map((sub) => (
                      <button key={sub} className="cat-sub-item" onClick={() => onSelect(sub)}>
                        {sub}
                      </button>
                    ))}
                  </div>
                  <div className="cat-subs-col">
                    {cat.subcategories.filter((_, i) => i % 2 !== 0).map((sub) => (
                      <button key={sub} className="cat-sub-item" onClick={() => onSelect(sub)}>
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="cat-divider" />
        </div>
      </div>
    </div>
  )
}
