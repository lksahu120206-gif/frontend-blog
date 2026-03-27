import { Link } from 'react-router-dom'
import { useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function PostCard({ post, onVote }) {
  const [votes, setVotes] = useState({
    likes: post.likes_count || 0,
    dislikes: post.dislikes_count || 0,
    userVoted: post.user_vote || null
  })

  const handleVote = async (voteType) => {
    try {
      await api.post(`/posts/${post.id}/vote/`, { vote_type: voteType })
      setVotes({
        likes: voteType === 'like' ? votes.likes + 1 : votes.likes,
        dislikes: voteType === 'dislike' ? votes.dislikes + 1 : votes.dislikes,
        userVoted: voteType
      })
      toast.success(voteType === 'like' ? 'Liked!' : 'Disliked!')
    } catch (error) {
      toast.error('Vote failed')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <Link to={`/post/${post.id}`} className="hover:no-underline">
          <h2 className="text-2xl font-bold text-gray-900 hover:text-indigo-600 line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <div className="text-sm text-gray-500">
          {new Date(post.created_at).toLocaleDateString()}
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
        {post.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">by {post.author?.username || 'Anonymous'}</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleVote('like')}
              disabled={votes.userVoted === 'like'}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-1 ${
                votes.userVoted === 'like'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              👍 {votes.likes}
            </button>
            <button
              onClick={() => handleVote('dislike')}
              disabled={votes.userVoted === 'dislike'}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-1 ${
                votes.userVoted === 'dislike'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              👎 {votes.dislikes}
            </button>
          </div>
        </div>
        
        <Link 
          to={`/post/${post.id}`}
          className="btn-primary px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
        >
          Read More →
        </Link>
      </div>
    </div>
  )
}
