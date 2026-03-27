import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState(false)
  const [showEmptyState, setShowEmptyState] = useState(false)
  const navigate = useNavigate()

  const fetchPosts = useCallback(async (pageNum = 1) => {
    try {
      const res = await api.get(`/posts/?page=${pageNum}`)
      if (pageNum === 1) {
        setPosts(res.data.results || [])
        setShowEmptyState(res.data.results?.length === 0)
      } else {
        setPosts(prev => [...prev, ...(res.data.results || [])])
      }
      setError(false)
    } catch (error) {
      setError(true)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage)
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Unable to load posts</h1>
          <p className="text-lg text-gray-600 mb-8">Backend might be offline. Please check back later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4">
      {/* Hero Section */}
      <section className="text-center mb-20 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Welcome to Blog Platform
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Share your thoughts with the world. Connect with readers and writers.
        </p>
        <button 
          onClick={() => navigate('/signup')}
          className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          Get Started
        </button>
      </section>

      {/* Posts Section */}
      <section className="max-w-6xl mx-auto">
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length === 0 && !loading ? (
            <div className="md:col-span-full text-center py-24">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">No posts yet</h2>
              <p className="text-lg text-gray-600 mb-8">Be the first to create one and share your thoughts!</p>
              <button 
                onClick={() => navigate('/create')}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
              >
                Create First Post
              </button>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
        
        {posts.length > 0 && (
          <div className="text-center mt-16">
            <button 
              onClick={loadMore}
              className="btn-primary px-12 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Posts'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

