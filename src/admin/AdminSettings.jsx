import { useState } from 'react'
import { getPassword, savePassword } from '../store'

export default function AdminSettings() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState(null)

  function handleSave() {
    if (current !== getPassword()) { setMsg({ type: 'error', text: 'Current password is incorrect.' }); return }
    if (!next.trim())              { setMsg({ type: 'error', text: 'New password cannot be empty.' }); return }
    if (next !== confirm)          { setMsg({ type: 'error', text: 'Passwords do not match.' }); return }
    savePassword(next)
    setCurrent(''); setNext(''); setConfirm('')
    setMsg({ type: 'success', text: 'Password updated.' })
  }

  return (
    <div>
      <div className="adm-section-title">Settings</div>
      {msg && <div className={`adm-alert adm-alert--${msg.type}`}>{msg.text}</div>}
      <div className="adm-form">
        <div className="adm-form-title">Change Password</div>
        <div className="adm-field">
          <label className="adm-label">Current Password</label>
          <input className="adm-input" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div className="adm-field">
          <label className="adm-label">New Password</label>
          <input className="adm-input" type="password" value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
        <div className="adm-field">
          <label className="adm-label">Confirm New Password</label>
          <input className="adm-input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div className="adm-form-actions">
          <button className="adm-btn adm-btn--primary" onClick={handleSave}>Update Password</button>
        </div>
      </div>
    </div>
  )
}
