'use client'
import { useState } from 'react'
import './login.css'

export default function LoginPage() {
  const [mode,setMode] = useState<'login'|'register'>('login')
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [phone,setPhone] = useState('')
  const [msg,setMsg] = useState('')

  async function submit() {
    const url = mode === 'register' ? '/api/auth/register' : '/api/auth/login'
    const body: any = { email, password }
    if (mode === 'register') { body.name = name; body.phone = phone }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: "include",   // 👈 critical to save cookie
    })

    const data = await res.json()
    if (data.ok) {
      // redirect to your actual app page
      window.location.href = "/dashboard"
    } else {
      setMsg(data.message || 'Failed')
    }
  }

  return (
    <main className="login-container">
      <div className="card text-center">
        <div className="brand">Kuber AI</div>
        <h1 className="title">
          {mode==='register' ? 'Create your account' : 'Login'}
        </h1>
        <p className="subtitle">Access your gold advisor and wallet.</p>

        {mode==='register' && (
          <input 
            className="input text-center" 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            placeholder="Name" 
          />
        )}

        <input 
          className="input text-center" 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          placeholder="Email" 
        />

        <input 
          className="input text-center" 
          type="password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          placeholder="Password" 
        />

        {mode==='register' && (
          <input 
            className="input text-center" 
            value={phone} 
            onChange={e=>setPhone(e.target.value)} 
            placeholder="Phone" 
          />
        )}

        <button className="btn btn-cta" onClick={submit}>
          {mode==='register' ? 'Create account' : 'Login'}
        </button>

        {msg && <div className="error">{msg}</div>}

        <div className="switch-mode">
          {mode==='register' ? 'Already have an account?' : 'New here?'}{' '}
          <button 
            className="link" 
            onClick={()=>setMode(mode==='register' ? 'login' : 'register')}
          >
            {mode==='register' ? 'Log in' : 'Create one'}
          </button>
        </div>
      </div>
    </main>
  )
}
