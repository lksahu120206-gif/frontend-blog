import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Blog
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-indigo-600 font-medium">Home</Link>
            {user ? (
              <>
                <Link to="/create" className="btn-primary">+ New Post</Link>
                <span className="text-sm text-gray-500">Hi, {user.username}</span>
                <button onClick={logout} className="btn-secondary px-4 py-1 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-primary px-4 py-1 rounded-lg">Login</Link>
                <Link to="/signup" className="btn-secondary px-4 py-1 rounded-lg">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
