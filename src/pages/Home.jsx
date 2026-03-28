import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Fetch posts the moment the page loads
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
  try {
    const response = await api.get('/api/posts/') 
    setPosts(response.data.results)  // ← change this line
  } catch (error) {
    console.error("Error fetching posts:", error)
    toast.error("Failed to load blog posts")
  } finally {
    setLoading(false)
  }
}

  // Handle the Logout cycle
  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.info("Logged out successfully")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">BlogPlatform</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">
              Hello, {user?.username || 'Guest'}
            </span>
            <button 
              onClick={handleLogout}
              className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 shadow-md transition-all">
            + New Post
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></span>
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to write something!</p>
          </div>
        ) : (
          /* Blog Post Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                <div className="text-sm text-gray-400 mt-auto pt-4 border-t border-gray-50">
                  Posted by {post.author || 'Anonymous'}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}