import { useState } from 'react'

export default function CategoryMenu({ categories = [], onClose, onSelect }) {
  const [expanded, setExpanded] = useState(null)

  // Normalize: support both old flat strings and new {name, subs} objects
  const cats = categories.map(c =>
    typeof c === 'string' ? { name: c, subs: [] } : 
  )

  function toggle(name) {
    setExpanded(prev => prev === name ? null : name)
  }

  return (
    <div className="cat-page fade-in">
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
        <div className="cat-sidebar" />

        <div className="cat-list">
          <button className="person-back" onClick={onClose}>‹</button>
          <div className="cat-heading">View By Category</div>

          {cats.map((cat) => {
            const isOpen = expanded === cat.name
            const hasSubs = cat.subs && cat.subs.length > 0

            return (
              <div key={cat.name}>
                <div className="cat-divider" />
                <button
                  className="cat-item"
                  onClick={() => toggle(cat.name)}
                >
                  <span className="cat-item-label">{cat.name}</span>
                  <span className="cat-chevron">{isOpen ? '∨' : '›'}</span>
                </button>

                {isOpen && (
                  <div className="cat-subs fade-in">
                    {/* View All always first */}
                    <button className="cat-sub-item cat-sub-item--all" onClick={() => onSelect(cat.name)}>
                      View All
                    </button>

                    {hasSubs && (
                      <div className="cat-subs-grid">
                        {cat.subs.map(sub => (
                          <button key={sub} className="cat-sub-item" onClick={() => onSelect(sub)}>
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          <div className="cat-divider" />
        </div>
      </div>
    </div>
  )
}
