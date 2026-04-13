import { useState, useRef, useEffect } from 'react'
import Header from './Header'

export default function PostDetail({ post, similarPosts, onBack, onSelect, onSearch, sortBy, onSortChange, sortOptions }) {
  const images = post.images || []
  // Group images into pages of 3
  const pages = []
  for (let i = 0; i < images.length; i += 3) pages.push(images.slice(i, i + 3))
  // Triple pages for seamless loop
  const loopedPages = pages.length > 0 ? [...pages, ...pages, ...pages] : []
  const startPage = pages.length // start in middle copy
  const [page, setPage] = useState(startPage)
  const [transition, setTransition] = useState(true)
  const autoRef = useRef(null)

  function next() {
    if (pages.length <= 1) return
    setTransition(true)
    setPage(prev => prev + 1)
  }

  // Silently reset to middle copy after reaching end
  useEffect(() => {
    if (page >= pages.length * 2) {
      const t = setTimeout(() => {
        setTransition(false)
        setPage(pages.length)
      }, 520)
      return () => clearTimeout(t)
    }
  }, [page, pages.length])

  // Auto-loop every 3 seconds
  useEffect(() => {
    if (pages.length <= 1) return
    autoRef.current = setInterval(next, 3000)
    return () => clearInterval(autoRef.current)
  }, [pages.length])

  return (
    <div className="detail-page">
      <Header
        onMenuClick={onBack}
        onSearch={(q) => { if (q.trim()) onSearch(q) }}
      />

      <div className="detail-body">
        <h1 className="detail-title">{post.title}</h1>

        <div className="detail-divider" />
        <div className="detail-meta-row">
          <span className="detail-meta-label">Told by:</span>
          <span className="detail-meta-value">{post.author}</span>
        </div>
        <div className="detail-meta-row">
          <span className="detail-meta-label">Subjects:</span>
          <span className="detail-meta-value">{post.category}</span>
        </div>
        <div className="detail-meta-row">
          <span className="detail-meta-label">Told About:</span>
          <span className="detail-meta-value">{post.related}</span>
        </div>
        <div className="detail-divider" />

        {/* Image slider */}
        <div className="detail-slider-wrap">
          <div className="detail-slider">
            <div
              className="detail-slider-track"
              style={{
                transform: `translateX(-${page * 100}%)`,
                transition: transition ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                display: 'flex',
                width: `${Math.max(loopedPages.length, 1) * 100}%`,
              }}
            >
              {loopedPages.length === 0 ? (
                <div style={{ flex: '0 0 100%', display: 'flex' }}>
                  <div className="detail-img detail-img--slot0" style={{ flex: '0 0 33.333%' }} />
                  <div className="detail-img detail-img--slot1" style={{ flex: '0 0 33.333%' }} />
                  <div className="detail-img detail-img--slot2" style={{ flex: '0 0 33.333%' }} />
                </div>
              ) : (
                loopedPages.map((pg, pi) => (
                  <div key={pi} style={{ flex: `0 0 ${100 / loopedPages.length}%`, display: 'flex' }}>
                    {pg.map((src, si) => (
                      <div
                        key={si}
                        className="detail-img"
                        style={{
                          flex: '0 0 33.333%',
                          backgroundImage: `url(${src})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    ))}
                    {/* Fill empty slots if last page has < 3 images */}
                    {pg.length < 3 && Array.from({ length: 3 - pg.length }).map((_, ei) => (
                      <div key={`e${ei}`} className="detail-img" style={{ flex: '0 0 33.333%', background: '#e8e8e4' }} />
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Prev button — removed, loop is automatic */}

          {/* Next button — always fixed at right, manual click resets auto-timer */}
          {pages.length > 1 && (
            <button
              className="detail-nav-btn detail-nav-btn--next"
              onClick={() => { clearInterval(autoRef.current); next(); autoRef.current = setInterval(next, 3000) }}
              aria-label="Next"
            >
              <span className="detail-nav-arrow detail-nav-arrow--tr" />
              <span className="detail-nav-arrow detail-nav-arrow--br" />
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {pages.length > 1 && (
          <div className="detail-dots">
            {pages.map((_, i) => (
              <button
                key={i}
                className={`detail-dot${(page - startPage + pages.length) % pages.length === i ? ' detail-dot--active' : ''}`}
                onClick={() => { setTransition(true); setPage(startPage + i) }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Body text */}
        <div className="detail-text">
          {post.body
            ? post.body.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
            : (
              <>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
              </>
            )
          }
        </div>

        {/* Similar Stories */}
        {similarPosts.length > 0 && (
          <>
            <div className="detail-similar-heading">Similar Stories</div>
            <div className="post-list">
              {similarPosts.map((p) => (
                <article className="post-item" key={p.id} onClick={() => onSelect(p)} style={{ cursor: 'pointer' }}>
                  <div className="post-meta">
                    <span className="meta-author">{p.author}</span>
                    <span className="meta-category">{p.category}</span>
                  </div>
                  <h2 className="post-title">{p.title}</h2>
                  <div className="post-told-row">
                    <span className="post-told">{p.toldAbout}</span>
                    {p.related && <span className="post-related-inline">{p.related}</span>}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
