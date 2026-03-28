import axios from 'axios'

// FIX 1: We use the strict root URL. 
// This forces your components to be explicit (e.g., api.post('/api/signup/'))
const API_BASE = import.meta.env.VITE_API_URL || 'https://django-blog-api-q037.onrender.com'


const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor for token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config.url.includes('/token/') || error.config.url.includes('/login') || error.config.url.includes('/signup/');
    
    // Only force a reload if they get a 401 on a normal page, NOT on the login page
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
