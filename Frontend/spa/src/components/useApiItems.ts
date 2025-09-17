import { useEffect, useState } from 'react'
import { fetchJson, ApiError } from '../lib/api'
import { useRole } from '../context/RoleContext'

export function useApiItems(apiPath: string) {
  const { token, roleLoading } = useRole()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let mounted = true
    if (roleLoading) return
    ;(async () => {
      setLoading(true)
      setError(null)
      setItems([])
      try {
        const headers: Record<string,string> = {}
        if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetchJson<any>(apiPath, { headers })
  // support several envelope shapes: array, { data: [...] }, { data: { data: [...] } }, { data: { items: [...] } }
  let data: any[] = []
  if (Array.isArray(res)) data = res
  else if (Array.isArray(res?.data)) data = res.data
  else if (Array.isArray(res?.data?.data)) data = res.data.data
  else if (Array.isArray(res?.data?.items)) data = res.data.items
  else data = []
        if (!mounted) return
        setItems(data)
      } catch (e) {
        if (!mounted) return
        setError(e instanceof ApiError ? e.message : String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [apiPath, token, roleLoading, reloadKey])

  return { items, loading, error, reload: () => setReloadKey(k => k + 1) }
}
