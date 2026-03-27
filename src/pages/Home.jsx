import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchPosts = useCallback(async (pageNum = 1) => {
    try {
      const res = await api.get(`/posts/?page=${pageNum}`)
      if (pageNum === 1) {
        setPosts(res.data.results || [])
      } else {
        setPosts(prev => [...prev, ...(res.data.results || [])])
      }
    } catch (error) {
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

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {posts.length > 0 && (
        <div className="text-center mt-8">
          <button 
            onClick={loadMore}
            className="btn-primary px-8 py-3 rounded-xl font-medium"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
