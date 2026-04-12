import { useState, useRef, useEffect } from 'react'
import { getPosts, getCategories, getPeople, addPost, updatePost, deletePost, savePosts } from '../store'

function MultiSelect({ people, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggle(name) {
    const upper = name.toUpperCase()
    onChange(selected.includes(upper) ? selected.filter((r) => r !== upper) : [...selected, upper])
  }

  const label = selected.length === 0
    ? '— select —'
    : selected.map((s) => s.split(' ').map((w) => w[0] + w.slice(1).toLowerCase()).join(' ')).join(', ')

  return (
    <div className="adm-multiselect" ref={ref}>
      <button type="button" className="adm-multiselect-trigger" onClick={() => setOpen((v) => !v)}>
        <span>{label}</span>
        <span className="adm-multiselect-arrow">▾</span>
      </button>
      {open && (
        <div className="adm-multiselect-dropdown">
          {people.map((p) => {
            const upper = p.toUpperCase()
            const checked = selected.includes(upper)
            return (
              <label key={p} className="adm-multiselect-option">
                <input type="checkbox" checked={checked} onChange={() => toggle(p)} />
                {p}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

const EMPTY = { title: '', author: '', category: '', toldAbout: 'Told About', related: [], body: '', date: '', images: [] }

export default function AdminPosts() {
  const [posts, setPosts] = useState(getPosts)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saveError, setSaveError] = useState(false)
  const categories = getCategories()
  const people = getPeople()

  function refresh() { setPosts(getPosts()) }

  function openNew() {
    setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 7) })
    setEditing('new')
  }

  function openEdit(post) {
    const related = Array.isArray(post.related)
      ? post.related
      : post.related ? post.related.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean) : []
    setForm({ ...post, related, images: post.images || [] })
    setEditing(post)
  }

  function cancel() { setEditing(null) }

  function handleSave() {
    if (!form.title.trim()) return
    const saved = { ...form, related: form.related.join('  ') }
    let ok
    if (editing === 'new') {
      const newPost = { ...saved, id: Date.now() }
      const all = [...getPosts(), newPost]
      ok = savePosts(all)
    } else {
      const all = getPosts().map((p) => (p.id === editing.id ? { ...editing, ...saved } : p))
      ok = savePosts(all)
    }
    refresh()
    if (ok === false) {
      setSaveError(true)
    } else {
      setSaveError(false)
      setEditing(null)
    }
  }

  function handleDelete(id) {
    if (!confirm('Delete this post?')) return
    deletePost(id)
    refresh()
  }

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })) }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        // Compress image via canvas before storing
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX = 800
          let w = img.width, h = img.height
          if (w > MAX) { h = Math.round(h * MAX / w); w = MAX }
          if (h > MAX) { w = Math.round(w * MAX / h); h = MAX }
          canvas.width = w
          canvas.height = h
          canvas.getContext('2d').drawImage(img, 0, 0, w, h)
          const compressed = canvas.toDataURL('image/jpeg', 0.7)
          setForm((f) => ({ ...f, images: [...(f.images || []), compressed] }))
        }
        img.src = ev.target.result
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function removeImage(idx) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  if (editing) {
    return (
      <div>
        <div className="adm-section-title">{editing === 'new' ? 'New Post' : 'Edit Post'}</div>
        <div className="adm-form">

          <div className="adm-field">
            <label className="adm-label">Title</label>
            <input className="adm-input" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>

          <div className="adm-field">
            <label className="adm-label">Told By (Author)</label>
            <select className="adm-select" value={form.author} onChange={(e) => set('author', e.target.value)}>
              <option value="">— select —</option>
              {people.map((p) => <option key={p} value={p.toUpperCase()}>{p}</option>)}
            </select>
          </div>

          <div className="adm-field">
            <label className="adm-label">Category</label>
            <select className="adm-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">— select —</option>
              {categories.map((c) => <option key={c} value={c.toUpperCase()}>{c}</option>)}
            </select>
          </div>

          <div className="adm-field">
            <label className="adm-label">Told About (select people)</label>
            <MultiSelect
              people={people}
              selected={form.related}
              onChange={(val) => set('related', val)}
            />
            {form.related.length > 0 && (
              <div className="adm-related-preview">{form.related.join('  ')}</div>
            )}
          </div>

          <div className="adm-field">
            <label className="adm-label">Body Text</label>
            <textarea className="adm-textarea" value={form.body || ''} onChange={(e) => set('body', e.target.value)} />
          </div>

          <div className="adm-field">
            <label className="adm-label">Images</label>
            <input type="file" accept="image/*" multiple className="adm-input"
              style={{ padding: '8px' }} onChange={handleImageUpload} />
            {form.images && form.images.length > 0 && (
              <div className="adm-img-preview-list">
                {form.images.map((src, i) => (
                  <div key={i} className="adm-img-preview">
                    <img src={src} alt={`img-${i}`} />
                    <button type="button" className="adm-img-remove" onClick={() => removeImage(i)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="adm-field">
            <label className="adm-label">Date (YYYY-MM)</label>
            <input className="adm-input" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>

          <div className="adm-form-actions">
            <button className="adm-btn adm-btn--primary" onClick={handleSave}>Save</button>
            <button className="adm-btn adm-btn--ghost" onClick={cancel}>Cancel</button>
          </div>
          {saveError && (
            <div className="adm-alert adm-alert--error" style={{ marginTop: 12 }}>
              Storage limit hit — images were reduced. Post saved with fewer images. Try uploading smaller images.
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="adm-section-title" style={{ margin: 0 }}>Posts</div>
        <button className="adm-btn adm-btn--primary" onClick={openNew}>+ New Post</button>
      </div>
      <table className="adm-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Date</th>
            <th>Images</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>{post.category}</td>
              <td>{post.date}</td>
              <td>{(post.images || []).length}</td>
              <td style={{ whiteSpace: 'nowrap', display: 'flex', gap: 8 }}>
                <button className="adm-btn adm-btn--ghost" onClick={() => openEdit(post)}>Edit</button>
                <button className="adm-btn adm-btn--danger" onClick={() => handleDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
