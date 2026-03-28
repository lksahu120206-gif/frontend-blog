import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import CommentForm from '../components/CommentForm'

export default function PostDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [votes, setVotes] = useState({ likes: 0, dislikes: 0, userVoted: null })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/api/posts/${id}/`),
          api.get(`/api/posts/${id}/comments/`)
        ])
        setPost(postRes.data)
        setVotes({
          likes: postRes.data.likes_count || 0,
          dislikes: postRes.data.dislikes_count || 0,
          userVoted: postRes.data.user_vote || null
        })
        setComments(commentsRes.data.results || commentsRes.data)
      } catch (error) {
        toast.error('Post not found')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const handleVote = async (voteValue) => {
    if (!user) {
      toast.error('Please login to vote!')
      return
    }
    try {
      await api.post(`/api/posts/${id}/vote/`, { vote: voteValue })
      setVotes(prev => ({
        likes: voteValue === 1 ? prev.likes + 1 : prev.likes,
        dislikes: voteValue === -1 ? prev.dislikes + 1 : prev.dislikes,
        userVoted: voteValue
      }))
      toast.success(voteValue === 1 ? 'Liked!' : 'Disliked!')
    } catch (error) {
      toast.error('Vote failed')
    }
  }

  const addComment = async (content) => {
    if (!user) {
      toast.error('Please login to comment!')
      return
    }
    try {
      const res = await api.post(`/api/posts/${id}/comments/`, { content })
      setComments([res.data, ...comments])
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Post not found.</p>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-8">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* Post */}
      <article className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-12">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            <span>By {post.author?.username || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </header>

        <p className="text-xl text-gray-700 leading-relaxed mb-12 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Vote buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handleVote(1)}
            disabled={votes.userVoted === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all ${
              votes.userVoted === 1
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
            }`}
          >
            👍 {votes.likes}
          </button>
          <button
            onClick={() => handleVote(-1)}
            disabled={votes.userVoted === -1}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all ${
              votes.userVoted === -1
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
            }`}
          >
            👎 {votes.dislikes}
          </button>
        </div>
      </article>

      {/* Comments section */}
      <div className="space-y-8">
        {user && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Comment</h3>
            <CommentForm onComment={addComment} />
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Comments ({comments.length})</h3>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-2xl p-6 border-l-4 border-indigo-500">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                    {comment.author?.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{comment.author?.username || 'Anonymous'}</h4>
                    <p className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-gray-700 ml-14">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}