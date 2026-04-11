import { useState } from 'react'

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const result = onLogin(password)
    if (result === false || password.trim() === '') {
      setError(true)
    }
  }

  // onLogin sets authed in parent; if still here after submit, password was wrong
  function handleLogin(e) {
    e.preventDefault()
    if (!password.trim()) { setError(true); return }
    onLogin(password)
    // if parent didn't unmount us, password was wrong
    setError(true)
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-row">
          <input
            className={`login-input${error ? ' login-input--error' : ''}`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            aria-label="Password"
            autoFocus
          />
          <button className="login-go" type="submit">GO</button>
        </div>
        {error && (
          <p style={{ marginTop: 12, fontSize: 13, letterSpacing: '0.08em', color: '#000' }}>
            Incorrect password.
          </p>
        )}
      </form>
    </div>
  )
}
