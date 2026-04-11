import { useState } from 'react'
import Admin from './Admin'
import AdminLogin from './AdminLogin'
import './admin.css'

export default function AdminApp() {
  const [authed, setAuthed] = useState(false)

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  return <Admin onExit={() => setAuthed(false)} />
}
