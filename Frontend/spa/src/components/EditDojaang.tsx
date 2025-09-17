import React, { useEffect, useState } from 'react'
import { useRole } from '../context/RoleContext'
import Alert from '@mui/material/Alert'

const baseUrl = 'https://localhost:7046/api'

type DojaangPayload = {
  id: number
  name: string
  address?: string
  location?: string
  phoneNumber?: string
  email?: string
  koreanName?: string
  koreanNamePhonetic?: string
  coachId?: number | null
}

export default function EditDojaang({ dojaangId, onClose }: { dojaangId: number; onClose: () => void }) {
  const { token } = useRole()
  const [dojaang, setDojaang] = useState<DojaangPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${baseUrl}/Dojaang/${dojaangId}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const body = await res.json().catch(() => null)
        const data = body?.data ?? body
        setDojaang(data)
      } catch (err: any) {
        setError(err.message || 'Error')
      } finally {
        setLoading(false)
      }
    }
    fetchOne()
  }, [dojaangId, token])

  const handleChange = (k: keyof DojaangPayload, v: any) => setDojaang(d => d ? { ...d, [k]: v } : d)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dojaang) return
    setSaving(true)
    setError(null)
    try {
      const payload: DojaangPayload = {
        id: dojaang.id,
        name: dojaang.name,
        address: dojaang.address,
        location: dojaang.location,
        phoneNumber: dojaang.phoneNumber,
        email: dojaang.email,
        koreanName: dojaang.koreanName,
        koreanNamePhonetic: dojaang.koreanNamePhonetic,
        coachId: dojaang.coachId ?? null,
      }
      const res = await fetch(`${baseUrl}/Dojaang/${dojaang.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Save error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (!dojaang) return <div className="p-4">No data</div>

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-2">Edit Dojaang</h3>
  {error && <Alert severity="error" className="mb-2">{error}</Alert>}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" value={dojaang.name} onChange={e => handleChange('name', e.target.value)} className="block w-full border p-1 rounded" />
          </div>
          <div>
            <label htmlFor="koreanName">Korean Name</label>
            <input id="koreanName" value={dojaang.koreanName ?? ''} onChange={e => handleChange('koreanName', e.target.value)} className="block w-full border p-1 rounded" />
          </div>
          <div>
            <label htmlFor="koreanNamePhonetic">Korean Name (Phonetic)</label>
            <input id="koreanNamePhonetic" value={dojaang.koreanNamePhonetic ?? ''} onChange={e => handleChange('koreanNamePhonetic', e.target.value)} className="block w-full border p-1 rounded" />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input id="address" value={dojaang.address ?? ''} onChange={e => handleChange('address', e.target.value)} className="block w-full border p-1 rounded" />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone</label>
            <input id="phoneNumber" value={dojaang.phoneNumber ?? ''} onChange={e => handleChange('phoneNumber', e.target.value)} className="block w-full border p-1 rounded" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" value={dojaang.email ?? ''} onChange={e => handleChange('email', e.target.value)} className="block w-full border p-1 rounded" />
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <button type="button" className="mr-2 px-3 py-1 border rounded" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  )
}
