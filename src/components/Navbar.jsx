import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { user, logout, loading } = useAuth()

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Blog
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-indigo-600 font-medium">Home</Link>
            {loading ? (
              // ✅ Show spinner while checking auth — prevents Guest flash
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            ) : user ? (
              <>
                <Link to="/create" className="bg-indigo-600 text-white px-4 py-1 rounded-lg font-medium hover:bg-indigo-700">+ New Post</Link>
                <span className="text-sm text-gray-500">Hi, {user.username}</span>
                <button onClick={logout} className="border border-gray-300 px-4 py-1 rounded-lg hover:bg-gray-50 text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-indigo-600 text-white px-4 py-1 rounded-lg font-medium hover:bg-indigo-700">Login</Link>
                <Link to="/signup" className="border border-gray-300 px-4 py-1 rounded-lg hover:bg-gray-50 text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}