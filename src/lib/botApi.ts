/**
 * Astral Site — Bot API Client
 * All calls go to /api/* which Vercel rewrites to the OptiLink bot server.
 * Set VITE_BOT_API_URL and VITE_BOT_API_SECRET in Vercel environment variables.
 */

const BASE = import.meta.env.VITE_BOT_API_URL || '/api'
const KEY  = import.meta.env.VITE_BOT_API_SECRET || ''

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(KEY ? { 'x-api-key': KEY } : {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error((err as any).error || `HTTP ${res.status}`)
  }
  return res.json()
}

export interface BotPlayer {
  name: string
  level: number
  class: string
  evolved: string | null
  prestige: number
  isKami: boolean
  gold: number
  gems: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  str: number
  int: number
  agi: number
  def: number
  lck: number
  kills: number
  deaths: number
  dungeons: number
  guild: string | null
  title: string | null
  isPremium: boolean
  weapon: string | null
  armor: string | null
  accessory: string | null
  skillSlots: (string | null)[]
  rankedXp: number
  region: string
  location: string
  wins: number
  losses: number
  ruin: Record<string, any>
  lastSeen: number | null
  createdAt: number | null
}

export interface LeaderboardEntry {
  rank: number
  name: string
  level: number
  class: string
  guild: string | null
  kills: number
  prestige: number
}

export interface BotStats {
  totalPlayers: number
  totalGuilds: number
  activeSeason: number
}

export const api = {
  /** Look up a player by WhatsApp number (digits only) */
  getPlayer: (number: string) => apiFetch<BotPlayer>(`/player/${number}`),

  /** Top 10 leaderboard */
  getLeaderboard: () => apiFetch<LeaderboardEntry[]>('/leaderboard'),

  /** Global bot stats */
  getStats: () => apiFetch<BotStats>('/stats'),

  /** Check if the API is reachable */
  health: () => apiFetch<{ ok: boolean }>('/health'),
}
