import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchJson, ApiError } from '../lib/api'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

type Event = {
  id: number
  name: string
  description?: string
  startDate?: string
  endDate?: string
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetchJson<Event>(`/api/Events/${id}`)
        if (!mounted) return
        setEvent(res as unknown as Event)
      } catch (e) {
        setError(e instanceof ApiError ? e.message : String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="flex items-center gap-2"><CircularProgress size={20} /> Loading…</div>
  if (error) return <Alert severity="error">Error: {error}</Alert>
  if (!event) return <div>Event not found.</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
      {event.startDate && <div>Starts: {new Date(event.startDate).toLocaleString()}</div>}
      {event.endDate && <div>Ends: {new Date(event.endDate).toLocaleString()}</div>}
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: event.description ?? '' }} />
    </div>
  )
}
