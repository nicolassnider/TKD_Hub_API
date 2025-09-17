import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext'
import Alert from '@mui/material/Alert'

const baseUrl = 'https://localhost:7046/api'

export default function Register() {
  const navigate = useNavigate()
  const { setToken, setRole, setDisplayName, setAvatarUrl } = useRole()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!firstName || !lastName) return 'Please provide your full name.'
    if (!email || !/\S+@\S+\.\S+/.test(email)) return 'Please provide a valid email.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    if (password !== confirmPassword) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) return setError(v)
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error((body && (body as any).message) || `Register failed: ${res.status}`)

      // If API returns a token we can auto-login; otherwise redirect to login
      const token = body?.token ?? body?.data?.token
      const user = body?.user ?? body?.data?.user
      if (token) {
        // populate RoleContext so the app reflects logged-in state immediately
        setToken(token)
        const roleVal = user?.role ?? (user?.roles && user.roles[0]) ?? null
        const roleArray = roleVal ? (Array.isArray(roleVal) ? roleVal : [roleVal]) : ['Student']
        setRole(roleArray)
        const displayName = user?.displayName ?? user?.name ?? `${firstName} ${lastName}`
        const avatarUrl = user?.avatarUrl ?? user?.picture ?? null
        setDisplayName(displayName)
        setAvatarUrl(avatarUrl)
        navigate('/')
      } else {
        navigate('/login')
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {error && <Alert severity="error" className="mb-2">{error}</Alert>}

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">First name</label>
  <input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Last name</label>
  <input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Email</label>
  <input placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Password</label>
  <input placeholder="At least 6 characters" type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Confirm password</label>
  <input placeholder="Confirm password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </div>
    </form>
  )
}
