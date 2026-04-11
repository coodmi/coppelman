import { useState } from 'react'

const SLIDE_WIDTH = 687 // visible window width in px

export default function PostDetail({ post, similarPosts, onBack, onSelect }) {
  const images = post.images || []
  const [offset, setOffset] = useState(0)

  // Each slide shows 3 images; step by 1
  const canNext = offset + 3 < images.length
  const canPrev = offset > 0

  function next() { if (canNext) setOffset((o) => o + 1) }
  function prev() { if (canPrev) setOffset((o) => o - 1) }

  const visible = images.slice(offset, offset + 3)

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <button className="hamburger" aria-label="Back" onClick={onBack}>
            <span />
            <span />
          </button>
        </div>
        <div className="header-title">Quick Search</div>
      </div>

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
        <div className="detail-slider">
          <div className="detail-slider-track">
            {images.length === 0 ? (
              // placeholder panels when no images
              <>
                <div className="detail-img detail-img--large" />
                <div className="detail-img detail-img--medium" />
                <div className="detail-img detail-img--small" />
              </>
            ) : (
              visible.map((src, i) => (
                <div
                  key={offset + i}
                  className={`detail-img detail-img--slot${i}`}
                  style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
              ))
            )}
          </div>

          {/* Prev button */}
          {canPrev && (
            <button className="detail-nav-btn detail-nav-btn--prev" onClick={prev} aria-label="Previous">
              <span className="detail-nav-arrow detail-nav-arrow--tl" />
              <span className="detail-nav-arrow detail-nav-arrow--bl" />
            </button>
          )}

          {/* Next button */}
          {(canNext || images.length === 0) && (
            <button className="detail-nav-btn detail-nav-btn--next" onClick={next} aria-label="Next"
              disabled={!canNext}>
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
                onClick={() => setOffset(i)}
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
                  <div className="post-told">{p.toldAbout}</div>
                  <div className="post-related">{p.related}</div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
