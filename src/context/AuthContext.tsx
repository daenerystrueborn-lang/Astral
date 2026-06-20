import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiPost } from '@/lib/api'

export interface AuthUser {
  username: string
  name: string
  pfp?: string | null
  level: number
  createdAt: number
}

interface AuthContextType {
  user: AuthUser | null
  player: AuthUser | null
  isLoggedIn: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signup: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  modalMode: 'login' | 'signup' | null
  openModal: (mode: 'login' | 'signup') => void
  closeModal: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const SESSION_KEY = 'astral_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'signup' | null>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY)
      if (s) setUser(JSON.parse(s))
    } catch { /* ignore */ }
  }, [])

  const login = async (username: string, password: string) => {
    if (!username.trim() || !password) return { ok: false, error: 'Fill in all fields.' }
    setLoading(true)
    try {
      const data = await apiPost('/login', { username: username.trim(), password })
      const u: AuthUser = {
        username:  data.username,
        name:      data.name,
        pfp:       data.pfp ?? null,
        level:     data.level,
        createdAt: Date.now(),
      }
      localStorage.setItem('astral_token', data.token)
      localStorage.setItem('astral_player', JSON.stringify({ username: u.username, name: u.name, pfp: u.pfp, level: u.level }))
      localStorage.setItem(SESSION_KEY, JSON.stringify(u))
      setUser(u)
      setLoading(false)
      return { ok: true }
    } catch (e: any) {
      setLoading(false)
      return { ok: false, error: e.message || 'Wrong username or password.' }
    }
  }

  const signup = async (_username: string, _password: string) => {
    return {
      ok: false,
      error: 'Accounts are created through the WhatsApp bot. Type !register in a DM with the bot, then come back here to log in.',
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem('astral_token')
    localStorage.removeItem('astral_player')
  }

  return (
    <AuthContext.Provider value={{
      user,
      player:     user,
      isLoggedIn: !!user,
      loading,
      login, signup, logout,
      modalMode,
      openModal:  (m) => setModalMode(m),
      closeModal: ()  => setModalMode(null),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
