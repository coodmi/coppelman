import { useState } from 'react'
import { getCategories, saveCategories } from '../store'

export default function AdminCategories() {
  const [cats, setCats] = useState(getCategories)
  const [input, setInput] = useState('')
  const [saved, setSaved] = useState(false)

  async function add() {
    const val = input.trim()
    if (!val || cats.includes(val)) return
    const updated = [...cats, val]
    setCats(updated)
    await saveCategories(updated)
    setInput('')
    flash()
  }

  async function remove(cat) {
    const updated = cats.filter((c) => c !== cat)
    setCats(updated)
    await saveCategories(updated)
    flash()
  }

  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div>
      <div className="adm-section-title">Categories</div>
      {saved && <div className="adm-alert adm-alert--success">Saved.</div>}
      <div className="adm-tag-list">
        {cats.map((cat) => (
          <div className="adm-tag" key={cat}>
            {cat}
            <button className="adm-tag-del" onClick={() => remove(cat)}>×</button>
          </div>
        ))}
      </div>
      <div className="adm-inline-add">
        <input
          className="adm-input"
          placeholder="New category name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button className="adm-btn adm-btn--primary" onClick={add}>Add</button>
      </div>
    </div>
  )
}
