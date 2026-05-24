/**
 * AuthContext — connects site accounts to real bot player data.
 *
 * Login flow:
 *   1. User enters their WhatsApp number + a site password they create
 *   2. We verify the number exists in the bot DB via GET /api/player/:number
 *   3. Store the verified session locally — includes the WA number
 *      so Profile can fetch live bot stats at any time.
 *
 * The "password" is site-only (stored in localStorage as btoa).
 * It's just to prevent others from viewing your profile on the site —
 * the real game data is read-only from the bot.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, BotPlayer } from '@/lib/botApi'

export interface AuthUser {
  username: string     // display name (from bot or custom)
  waNumber: string     // WhatsApp number digits only e.g. "2347062301848"
  createdAt: number
  botData?: BotPlayer  // cached bot profile, refreshed on login
}

interface AuthContextType {
  user: AuthUser | null
  botPlayer: BotPlayer | null
  loading: boolean
  login: (waNumber: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signup: (waNumber: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  refreshBotData: () => Promise<void>
  modalMode: 'login' | 'signup' | null
  openModal: (mode: 'login' | 'signup') => void
  closeModal: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORE_KEY   = 'astral_users'    // { [waNumber]: btoa(password) }
const SESSION_KEY = 'astral_session'  // AuthUser JSON

function getUsers(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') } catch { return {} }
}
function saveUsers(u: Record<string, string>) {
  localStorage.setItem(STORE_KEY, JSON.stringify(u))
}

function normalizeNumber(raw: string): string {
  return raw.replace(/\D/g, '') // strip everything except digits
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null)
  const [botPlayer, setBotPlayer] = useState<BotPlayer | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [modalMode, setModalMode] = useState<'login' | 'signup' | null>(null)

  // Restore session on mount
  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY)
      if (s) {
        const parsed: AuthUser = JSON.parse(s)
        setUser(parsed)
        if (parsed.botData) setBotPlayer(parsed.botData)
        // Refresh bot data in background
        api.getPlayer(parsed.waNumber).then(p => {
          setBotPlayer(p)
          const updated = { ...parsed, botData: p }
          setUser(updated)
          localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
        }).catch(() => {/* offline — use cached */})
      }
    } catch { /* ignore */ }
  }, [])

  const refreshBotData = async () => {
    if (!user) return
    try {
      const p = await api.getPlayer(user.waNumber)
      setBotPlayer(p)
      const updated = { ...user, botData: p }
      setUser(updated)
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
    } catch { /* ignore */ }
  }

  const login = async (waNumberRaw: string, password: string) => {
    if (!waNumberRaw.trim() || !password) return { ok: false, error: 'Fill in all fields.' }
    const waNumber = normalizeNumber(waNumberRaw)
    if (waNumber.length < 7) return { ok: false, error: 'Enter a valid WhatsApp number.' }

    const users = getUsers()
    if (!users[waNumber]) return { ok: false, error: 'Account not found. Sign up first.' }
    if (users[waNumber] !== btoa(password)) return { ok: false, error: 'Wrong password.' }

    setLoading(true)
    let botData: BotPlayer | undefined
    try {
      botData = await api.getPlayer(waNumber)
    } catch (e: any) {
      setLoading(false)
      if (e.message === 'Player not found') {
        return { ok: false, error: 'That number has no character in the bot yet. Use !register in WhatsApp first.' }
      }
      // API unreachable — allow login with cached data
    }

    const u: AuthUser = {
      username:  botData?.name || waNumber,
      waNumber,
      createdAt: Date.now(),
      botData,
    }
    setUser(u)
    if (botData) setBotPlayer(botData)
    localStorage.setItem(SESSION_KEY, JSON.stringify(u))
    setLoading(false)
    return { ok: true }
  }

  const signup = async (waNumberRaw: string, password: string) => {
    if (!waNumberRaw.trim() || !password) return { ok: false, error: 'Fill in all fields.' }
    const waNumber = normalizeNumber(waNumberRaw)
    if (waNumber.length < 7) return { ok: false, error: 'Enter a valid WhatsApp number.' }
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }

    const users = getUsers()
    if (users[waNumber]) return { ok: false, error: 'Account already exists. Log in instead.' }

    setLoading(true)
    let botData: BotPlayer | undefined
    try {
      botData = await api.getPlayer(waNumber)
    } catch (e: any) {
      setLoading(false)
      if (e.message === 'Player not found') {
        return { ok: false, error: 'No character found for that number. Use !register in a WhatsApp group first.' }
      }
      // API unreachable — allow signup anyway
    }

    users[waNumber] = btoa(password)
    saveUsers(users)

    const u: AuthUser = {
      username:  botData?.name || waNumber,
      waNumber,
      createdAt: Date.now(),
      botData,
    }
    setUser(u)
    if (botData) setBotPlayer(botData)
    localStorage.setItem(SESSION_KEY, JSON.stringify(u))
    setLoading(false)
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    setBotPlayer(null)
    localStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{
      user, botPlayer, loading,
      login, signup, logout, refreshBotData,
      modalMode,
      openModal: (m) => setModalMode(m),
      closeModal: () => setModalMode(null),
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
