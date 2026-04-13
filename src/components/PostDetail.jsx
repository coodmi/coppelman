import { useState, useRef, useEffect } from 'react'
import Header from './Header'

export default function PostDetail({ post, similarPosts, onBack, onSelect, onSearch, sortBy, onSortChange, sortOptions }) {
  const images = post.images || []
  // Triple the images so we can scroll infinitely without visible jump
  const looped = images.length > 0 ? [...images, ...images, ...images] : []
  const startOffset = images.length // start in the middle copy
  const [offset, setOffset] = useState(startOffset)
  const [transition, setTransition] = useState(true)
  const autoRef = useRef(null)

  function next() {
    if (looped.length <= 3) return
    setTransition(true)
    setOffset(prev => prev + 1)
  }

  // When we reach the end of the middle copy, silently reset to middle
  useEffect(() => {
    if (offset >= images.length * 2) {
      // wait for transition to finish then snap back silently
      const t = setTimeout(() => {
        setTransition(false)
        setOffset(images.length)
      }, 520)
      return () => clearTimeout(t)
    }
  }, [offset, images.length])

  // Auto-loop every 3 seconds
  useEffect(() => {
    if (images.length <= 3) return
    autoRef.current = setInterval(next, 3000)
    return () => clearInterval(autoRef.current)
  }, [images.length])

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
                transform: `translateX(-${offset * (100 / 3)}%)`,
                transition: transition ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                display: 'flex',
                width: `${Math.max(looped.length, 3) * (100 / 3)}%`,
              }}
            >
              {looped.length === 0 ? (
                <>
                  <div className="detail-img detail-img--slot0" style={{ flex: '0 0 33.333%' }} />
                  <div className="detail-img detail-img--slot1" style={{ flex: '0 0 33.333%' }} />
                  <div className="detail-img detail-img--slot2" style={{ flex: '0 0 33.333%' }} />
                </>
              ) : (
                looped.map((src, i) => (
                  <div
                    key={i}
                    className="detail-img"
                    style={{
                      flex: `0 0 33.333%`,
                      backgroundImage: `url(${src})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Prev button — removed, loop is automatic */}

          {/* Next button — always fixed at right, manual click resets auto-timer */}
          {images.length > 3 && (
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
        {images.length > 3 && (
          <div className="detail-dots">
            {Array.from({ length: images.length - 2 }).map((_, i) => (
              <button
                key={i}
                className={`detail-dot${(offset - startOffset) % images.length === i ? ' detail-dot--active' : ''}`}
                onClick={() => { setTransition(true); setOffset(startOffset + i) }}
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
