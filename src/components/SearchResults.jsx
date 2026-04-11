export default function SearchResults({ query, posts, onSelect, inline }) {
  return (
    <div className={inline ? 'results-inline' : 'results-page'}>
      {/* Results count */}
      <div className="results-heading-row">
        <div className="results-query">
          {posts.length} result{posts.length !== 1 ? 's' : ''} for "{query}"
        </div>
      </div>

      <div className="post-list">
        {posts.length === 0 && (
          <div className="no-results">No results found for "{query}"</div>
        )}
        {posts.map((post) => (
          <article className="post-item" key={post.id} onClick={() => onSelect?.(post)} style={{ cursor: 'pointer' }}>
            <div className="post-meta">
              <span className="meta-author">{post.author}</span>
              <span className="meta-category">{post.category}</span>
            </div>
            <h2 className="post-title">{post.title}</h2>
            <div className="post-told">{post.toldAbout}</div>
            <div className="post-related">{post.related}</div>
          </article>
        ))}
      </div>
    </div>
  )
}
