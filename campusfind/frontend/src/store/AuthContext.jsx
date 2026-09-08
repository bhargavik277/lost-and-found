import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('campusfind_token')
    const stored = localStorage.getItem('campusfind_user')
    if (token && stored) {
      try {
        setUser(JSON.parse(stored))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch {
        localStorage.removeItem('campusfind_token')
        localStorage.removeItem('campusfind_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((token, userData) => {
    localStorage.setItem('campusfind_token', token)
    localStorage.setItem('campusfind_user', JSON.stringify(userData))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('campusfind_token')
    localStorage.removeItem('campusfind_user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isStudent = user?.role === 'STUDENT'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isStudent }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
