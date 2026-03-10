import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/balance')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    console.log('Attempting login with:', { email, password: '***' })
    const response = await api.post('/auth/users/login', { email, password })
    console.log('Login response:', response.data)
    const jwt = response.data.message // Backend returns JWT in 'message' field
    setToken(jwt)
    localStorage.setItem('token', jwt)
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    await fetchUserData()
  }

  const register = async (userData) => {
    console.log('Attempting registration with:', { ...userData, password: '***' })
    const response = await api.post('/auth/users/register', userData)
    console.log('Registration response:', response.data)
    return response
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading,
    refreshUser: fetchUserData
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
