import { useState, useRef } from 'react'
import Header from './Header'

export default function PostDetail({ post, similarPosts, onBack, onSelect, onSearch, sortBy, onSortChange, sortOptions }) {
  const images = post.images || []
  const [offset, setOffset] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timeoutRef = useRef(null)

  const canNext = offset + 3 < images.length
  const canPrev = offset > 0

  function go(newOffset) {
    if (animating) return
    setAnimating(true)
    setOffset(newOffset)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setAnimating(false), 500)
  }

  // Always loops: at end, jump back to start
  function next() {
    if (images.length <= 3) return
    go(canNext ? offset + 1 : 0)
  }
  function prev() { if (canPrev) go(offset - 1) }

  const visible = images.slice(offset, offset + 3)

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
                transition: animating ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                display: 'flex',
                width: `${Math.max(images.length, 3) * (100 / 3)}%`,
              }}
            >
              {images.length === 0 ? (
                <>
                  <div className="detail-img detail-img--slot0" style={{ flex: '0 0 33.333%' }} />
                  <div className="detail-img detail-img--slot1" style={{ flex: '0 0 33.333%' }} />
                  <div className="detail-img detail-img--slot2" style={{ flex: '0 0 33.333%' }} />
                </>
              ) : (
                images.map((src, i) => (
                  <div
                    key={i}
                    className={`detail-img detail-img--slot${Math.min(i - offset, 2)}`}
                    style={{
                      flex: `0 0 ${100 / Math.max(images.length, 3)}%`,
                      backgroundImage: `url(${src})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'opacity 0.4s ease',
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Prev button */}
          {canPrev && (
            <button className="detail-nav-btn detail-nav-btn--prev" onClick={prev} aria-label="Previous">
              <span className="detail-nav-arrow detail-nav-arrow--tl" />
              <span className="detail-nav-arrow detail-nav-arrow--bl" />
            </button>
          )}

          {/* Next button — always visible at right, loops back to start */}
          {images.length > 3 && (
            <button
              className="detail-nav-btn detail-nav-btn--next"
              onClick={next}
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
                className={`detail-dot${offset === i ? ' detail-dot--active' : ''}`}
                onClick={() => go(i)}
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
