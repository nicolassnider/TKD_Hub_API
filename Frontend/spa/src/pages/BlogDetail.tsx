import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchJson, ApiError } from '../lib/api'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

type BlogPost = {
  id: number
  title: string
  content?: string
  createdAt?: string
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetchJson<BlogPost>(`/api/BlogPosts/${id}`)
        if (!mounted) return
        setPost(res as unknown as BlogPost)
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
  if (!post) return <Alert severity="info">Post not found.</Alert>

  return (
    <article>
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      {post.createdAt && <div className="text-sm text-gray-500 mb-4">{new Date(post.createdAt).toLocaleString()}</div>}
      <div dangerouslySetInnerHTML={{ __html: post.content ?? '' }} />
    </article>
  )
}
