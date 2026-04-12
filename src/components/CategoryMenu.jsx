import { useState } from 'react'

export default function CategoryMenu({ categories = [], posts = [], onClose, onSelect }) {
  const [expanded, setExpanded] = useState(null)

  // Build dynamic subcategories from real post titles per category
  const CATS = categories.map((name) => {
    const catPosts = posts.filter(
      (p) => p.category && p.category.toLowerCase() === name.toLowerCase()
    )
    return { name, posts: catPosts }
  })

  function toggle(name) {
    setExpanded((prev) => (prev === name ? null : name))
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
          <div className="cat-heading">View by Category</div>

          {CATS.map((cat) => (
            <div key={cat.name}>
              <div className="cat-divider" />
              <button
                className="cat-item"
                onClick={() => cat.posts.length ? toggle(cat.name) : onSelect(cat.name)}
              >
                <span className="cat-item-label">{cat.name}</span>
                {cat.posts.length > 0 && (
                  <span className="cat-arrow">
                    <span className="cat-arrow-v" style={{ transform: expanded === cat.name ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }} />
                    <span className="cat-arrow-h" style={{ opacity: expanded === cat.name ? 0 : 1, transition: 'opacity 0.2s ease' }} />
                  </span>
                )}
              </button>

              {/* Expanded: show post titles */}
              {expanded === cat.name && cat.posts.length > 0 && (
                <div className="cat-subs fade-in">
                  {/* View All option */}
                  <button
                    className="cat-sub-item cat-sub-item--all"
                    onClick={() => onSelect(cat.name)}
                  >
                    VIEW ALL
                  </button>
                  {cat.posts.map((post) => (
                    <button
                      key={post.id}
                      className="cat-sub-item"
                      onClick={() => onSelect(post.title)}
                    >
                      {post.title}
                    </button>
                  ))}
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
