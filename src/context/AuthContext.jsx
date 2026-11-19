import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'nova_ai_user'
const TOKEN_KEY = 'nova_token'

function persistSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function mapUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: 'admin', avatar: null, createdAt: user.createdAt }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      localStorage.removeItem(STORAGE_KEY)
      setIsLoading(false)
      return
    }
    authApi.getProfile()
      .then(({ user: profile }) => {
        const restored = mapUser(profile)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(restored))
        setUser(restored)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(STORAGE_KEY)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const result = await authApi.login({ email, password })
    const profile = mapUser(result.user)
    persistSession(result.token, profile)
    setUser(profile)
    return profile
  }, [])

  const loginWithGoogle = useCallback(async (credential) => {
    const result = await authApi.googleLogin(credential)
    const profile = mapUser(result.user)
    persistSession(result.token, profile)
    setUser(profile)
    return profile
  }, [])

  const register = useCallback(async (name, email, password) => {
    const result = await authApi.register({ name, email, password })
    const profile = mapUser(result.user)
    persistSession(result.token, profile)
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, register, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
