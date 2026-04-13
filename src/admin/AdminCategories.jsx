import { useState } from 'react'
import { getCategories, saveCategories } from '../store'

export default function AdminCategories() {
  const [cats, setCats]     = useState(() => {
    const raw = getCategories()
    return Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string'
      ? raw.map(name => ({ name, subs: [] }))
      : raw
  })
  const [newCat, setNewCat]   = useState('')
  const [newSubs, setNewSubs] = useState({}) // { catName: inputValue }
  const [saved, setSaved]     = useState(false)

  async function persist(updated) {
    setCats(updated)
    await saveCategories(updated)
    flash()
  }

  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  async function addCat() {
    const val = newCat.trim()
    if (!val || cats.find(c => c.name === val)) return
    await persist([...cats, { name: val, subs: [] }])
    setNewCat('')
  }

  async function removeCat(name) {
    await persist(cats.filter(c => c.name !== name))
  }

  async function addSub(catName) {
    const val = (newSubs[catName] || '').trim()
    if (!val) return
    await persist(cats.map(c =>
      c.name === catName ? { ...c, subs: [...(c.subs || []), val] } : c
    ))
    setNewSubs(s => ({ ...s, [catName]: '' }))
  }

  async function removeSub(catName, sub) {
    await persist(cats.map(c =>
      c.name === catName ? { ...c, subs: (c.subs || []).filter(s => s !== sub) } : c
    ))
  }

  return (
    <div>
      <div className="adm-section-title">Categories</div>
      {saved && <div className="adm-alert adm-alert--success">Saved.</div>}

      {cats.map((cat) => (
        <div key={cat.name} className="adm-form" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <strong style={{ fontSize: 18 }}>{cat.name}</strong>
            <button className="adm-btn adm-btn--danger" onClick={() => removeCat(cat.name)}>Remove</button>
          </div>

          {/* Subcategories */}
          <div className="adm-label" style={{ marginBottom: 8 }}>Subcategories</div>
          <div className="adm-tag-list">
            {(cat.subs || []).map(sub => (
              <div className="adm-tag" key={sub}>
                {sub}
                <button className="adm-tag-del" onClick={() => removeSub(cat.name, sub)}>×</button>
              </div>
            ))}
            {(cat.subs || []).length === 0 && (
              <span style={{ fontSize: 13, color: '#aaa' }}>No subcategories — will show "View All"</span>
            )}
          </div>

          <div className="adm-inline-add" style={{ marginTop: 8 }}>
            <input
              className="adm-input"
              placeholder="Add subcategory"
              value={newSubs[cat.name] || ''}
              onChange={(e) => setNewSubs(s => ({ ...s, [cat.name]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addSub(cat.name)}
            />
            <button className="adm-btn adm-btn--primary" onClick={() => addSub(cat.name)}>Add</button>
          </div>
        </div>
      ))}

      {/* Add new parent category */}
      <div className="adm-form">
        <div className="adm-form-title">Add Category</div>
        <div className="adm-inline-add">
          <input
            className="adm-input"
            placeholder="New category name"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCat()}
          />
          <button className="adm-btn adm-btn--primary" onClick={addCat}>Add</button>
        </div>
      </div>
    </div>
  )
}
