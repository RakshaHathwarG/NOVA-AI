import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'nova_ai_user'

// ── Mock auth helpers (no backend needed) ──────────────────────────────────
function mockDelay(ms = 400) {
  return new Promise((res) => setTimeout(res, ms))
}

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY)
}

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const stored = loadStoredUser()
    if (stored) setUser(stored)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    await mockDelay()
    // Accept any valid-looking credentials; derive a display name from email
    const name = email.split('@')[0].replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    const profile = {
      id: btoa(email),
      name,
      email,
      role: 'admin',
      avatar: null,
      createdAt: new Date().toISOString(),
    }
    setUser(profile)
    saveUser(profile)
    return profile
  }, [])

  const register = useCallback(async (name, email, password) => {
    await mockDelay()
    const profile = {
      id: btoa(email),
      name: name.trim() || email.split('@')[0],
      email,
      role: 'admin',
      avatar: null,
      createdAt: new Date().toISOString(),
    }
    setUser(profile)
    saveUser(profile)
    return profile
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
