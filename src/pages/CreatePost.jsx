import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function CreatePost() {
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/api/posts/', formData)
      toast.success('Post created successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p className="text-gray-600 mb-8">Share your thoughts with the world</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-3">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-xl placeholder-gray-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 shadow-inner"
              placeholder="What's happening..."
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-3">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="12"
              required
              value={formData.content}
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl placeholder-gray-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 resize-vertical shadow-inner"
              placeholder="Write your post here..."
              disabled={loading}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></span>
                  Publishing...
                </>
              ) : (
                <>
                  <span className="mr-3">✨</span>
                  Publish Post
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-4 border border-gray-300 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
