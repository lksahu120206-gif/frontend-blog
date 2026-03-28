import { Link } from 'react-router-dom'
import { useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function PostCard({ post }) {
  const [votes, setVotes] = useState({
    likes: post.likes_count || 0,
    dislikes: post.dislikes_count || 0,
    userVoted: post.user_vote || null
  })

  const handleVote = async (voteValue) => {
    try {
      // ✅ Backend expects { vote: 1 } or { vote: -1 }
      await api.post(`/api/posts/${post.id}/vote/`, { vote: voteValue })
      setVotes(prev => ({
        likes: voteValue === 1 ? prev.likes + 1 : prev.likes,
        dislikes: voteValue === -1 ? prev.dislikes + 1 : prev.dislikes,
        userVoted: voteValue
      }))
      toast.success(voteValue === 1 ? 'Liked!' : 'Disliked!')
    } catch (error) {
      toast.error('Login to vote!')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <Link to={`/post/${post.id}`}>
          <h2 className="text-2xl font-bold text-gray-900 hover:text-indigo-600 line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <div className="text-sm text-gray-500 ml-2 shrink-0">
          {new Date(post.created_at).toLocaleDateString()}
        </div>
      </div>

      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
        {post.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">by {post.author?.username || 'Anonymous'}</span>
          <button
            onClick={() => handleVote(1)}
            disabled={votes.userVoted === 1}
            className={`px-3 py-1 rounded-full font-semibold text-xs transition-all ${
              votes.userVoted === 1
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            👍 {votes.likes}
          </button>
          <button
            onClick={() => handleVote(-1)}
            disabled={votes.userVoted === -1}
            className={`px-3 py-1 rounded-full font-semibold text-xs transition-all ${
              votes.userVoted === -1
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            👎 {votes.dislikes}
          </button>
        </div>

        <Link
          to={`/post/${post.id}`}
          className="bg-indigo-600 text-white px-4 py-1 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all"
        >
          Read More →
        </Link>
      </div>
    </div>
  )
}