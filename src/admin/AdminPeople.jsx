import { useState } from 'react'
import { getPeople, savePeople } from '../store'

export default function AdminPeople() {
  const [people, setPeople] = useState(getPeople)
  const [input, setInput] = useState('')
  const [saved, setSaved] = useState(false)

  function add() {
    const val = input.trim()
    if (!val || people.includes(val)) return
    const updated = [...people, val]
    setPeople(updated)
    savePeople(updated)
    setInput('')
    flash()
  }

  function remove(person) {
    const updated = people.filter((p) => p !== person)
    setPeople(updated)
    savePeople(updated)
    flash()
  }

  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div>
      <div className="adm-section-title">People</div>
      {saved && <div className="adm-alert adm-alert--success">Saved.</div>}
      <div className="adm-tag-list">
        {people.map((person) => (
          <div className="adm-tag" key={person}>
            {person}
            <button className="adm-tag-del" onClick={() => remove(person)}>×</button>
          </div>
        ))}
      </div>
      <div className="adm-inline-add">
        <input
          className="adm-input"
          placeholder="New person name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button className="adm-btn adm-btn--primary" onClick={add}>Add</button>
      </div>
    </div>
  )
}
