import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verify token
      api.get('/token/verify/').then(res => {
        setUser({ username: res.data.user || 'User' })
      }).catch(() => {
        localStorage.removeItem('token')
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    try {
      const res = await api.post('/token/', { username, password })
      localStorage.setItem('token', res.data.access)
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`
      setUser({ username })
      return true
    } catch (error) {
      console.error("LOGIN API ERROR:", error);
      return false
    }
  }

  const signup = async (userData) => {
    try {
      await api.post('/signup/', userData) 
      return { success: true }
    } catch (error) {
      let errorMessage = "Signup failed. Please try again."
      if (error.response && error.response.data) {
        const data = error.response.data
        const firstKey = Object.keys(data)[0]
        if (firstKey) {
          errorMessage = `${firstKey.toUpperCase()}: ${data[firstKey]}`
        }
      }
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}