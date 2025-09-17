import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchJson, ApiError } from '../lib/api'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { useRole } from '../context/RoleContext'

type Student = {
  id: number
  fullName: string
  email?: string
}

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useRole()

  useEffect(() => {
    if (!id) return
    let mounted = true
    ;(async () => {
      try {
        const headers: Record<string, string> = {}
        if (token) headers['Authorization'] = `Bearer ${token}`
        const res = await fetchJson<Student>(`/api/Students/${id}`, { headers })
        if (!mounted) return
        setStudent(res as unknown as Student)
      } catch (e) {
        setError(e instanceof ApiError ? e.message : String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [id, token])

  if (loading) return <div className="flex items-center gap-2"><CircularProgress size={20} /> Loading…</div>
  if (error) return <Alert severity="error">Error: {error}</Alert>
  if (!student) return <Alert severity="info">Student not found.</Alert>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{student.fullName}</h2>
      <div className="text-sm text-gray-700">Email: {student.email ?? '—'}</div>
      {/* placeholder for class enrollment actions */}
    </div>
  )
}
