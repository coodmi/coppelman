import { useState } from 'react'
import './admin.css'

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASS  = 'password@gmail.com'

export default function AdminLogin({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      onLogin()
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="adm-login-page">
      <div className="adm-login-box">
        <div className="adm-login-title">Admin Dashboard</div>
        <form onSubmit={handleSubmit} className="adm-login-form">
          <label className="adm-login-label" htmlFor="adm-email">Email</label>
          <input
            id="adm-email"
            className="adm-login-input"
            type="email"
            autoComplete="username"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            required
          />
          <label className="adm-login-label" htmlFor="adm-pass">Password</label>
          <input
            id="adm-pass"
            className="adm-login-input"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            required
          />
          {error && <p className="adm-login-error">{error}</p>}
          <button className="adm-login-btn" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  )
}
