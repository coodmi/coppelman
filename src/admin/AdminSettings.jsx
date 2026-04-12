import { useState } from 'react'
import { getPassword, savePassword } from '../store'

function PasswordField({ label, value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div className="adm-field">
      <label className="adm-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="adm-input"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          style={{ paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: '#888', fontSize: 16, lineHeight: 1,
          }}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
            // Eye-off icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            // Eye icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default function AdminSettings() {
  const [current, setCurrent] = useState('')
  const [next, setNext]       = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg]         = useState(null)

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
        <PasswordField label="Current Password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <PasswordField label="New Password"     value={next}    onChange={(e) => setNext(e.target.value)} />
        <PasswordField label="Confirm New Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <div className="adm-form-actions">
          <button className="adm-btn adm-btn--primary" onClick={handleSave}>Update Password</button>
        </div>
      </div>
    </div>
  )
}
