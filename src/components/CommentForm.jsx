import { useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function CommentForm({ postId, onComment }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      await onComment(content.trim())
      setContent('')
    } catch (error) {
      toast.error('Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all placeholder-gray-400"
        disabled={loading}
        maxLength={500}
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? 'Posting...' : 'Comment'}
      </button>
    </form>
  )
}
