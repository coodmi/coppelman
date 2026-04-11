export default function PostList({ posts, onSelect }) {
  if (!posts.length) {
    return <div className="no-results">No results found.</div>
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-item" key={post.id}>
          <div className="post-meta">
            <span className="meta-author">{post.author}</span>
            <span className="meta-category">{post.category}</span>
          </div>
          <div className="post-told">{post.toldAbout}</div>
          <div className="post-related">{post.related}</div>
          <h2 className="post-title" onClick={() => onSelect?.(post)}>{post.title}</h2>
        </article>
      ))}
    </div>
  )
}
