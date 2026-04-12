import { useState } from 'react'
import Admin from './Admin'
import AdminLogin from './AdminLogin'
import './admin.css'

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('adm_auth') === '1')

  function handleLogin() {
    sessionStorage.setItem('adm_auth', '1')
    setAuthed(true)
  }

  function handleExit() {
    sessionStorage.removeItem('adm_auth')
    setAuthed(false)
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <Admin onExit={handleExit} />
}
