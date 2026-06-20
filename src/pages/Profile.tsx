import { useState, useRef, useCallback, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/lib/api'

const STORAGE_KEY_PFP    = 'astral_profile_pfp'
const STORAGE_KEY_BANNER = 'astral_profile_banner'

function loadStored(key: string, fallback: string): string {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}

interface PortalProfile {
  username: string
  name: string
  title: string
  class: string
  race: string
  level: number
  rank: string
  seasonTier: string
  faction: { name: string; role: string; memberCount: number } | null
  hp: { current: number; max: number }
  mp: { current: number; max: number }
  stats: { str: number; agi: number; int: number; def: number; lck: number }
  kills: number
  deaths: number
  pvp: number
  boss: number
  dun: number
  weapon: { name: string } | null
  solars: number
  gems: number
  prestige: number
  premium: boolean
  pfp: string | null
  banner: string | null
}

function StatBar({ val, max, color }: { val: number; max: number; color: string }) {
  const pct = Math.min(100, max > 0 ? Math.round((val / max) * 100) : 0)
  return (
    <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.4s' }} />
    </div>
  )
}

function SvgSword() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6" />
    </svg>
  )
}
function SvgRefresh() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  )
}

function ConnectedProfile({ p, onRefresh, refreshing }: { p: PortalProfile; onRefresh: () => void; refreshing: boolean }) {
  return (
    <>
      <div className="profile-stats">
        {[
          { val: String(p.level),        lbl: 'Level'   },
          { val: p.solars.toLocaleString(), lbl: 'Solars' },
          { val: String(p.gems),         lbl: 'Gems'    },
          { val: String(p.kills),        lbl: 'Kills'   },
          { val: String(p.dun),          lbl: 'Dungeon' },
          { val: p.faction?.name || 'None', lbl: 'Guild' },
        ].map((s) => (
          <div key={s.lbl} className="profile-stat">
            <div className="profile-stat-val">{s.val}</div>
            <div className="profile-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="section-title">Vitals</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '4px' }}>
              <span>❤️ HP</span><span>{p.hp.current} / {p.hp.max}</span>
            </div>
            <StatBar val={p.hp.current} max={p.hp.max} color="#cc3344" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '4px' }}>
              <span>💙 MP</span><span>{p.mp.current} / {p.mp.max}</span>
            </div>
            <StatBar val={p.mp.current} max={p.mp.max} color="#3366cc" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Base Stats</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {[
            { lbl: 'STR', val: p.stats.str, color: '#cc5533' },
            { lbl: 'INT', val: p.stats.int, color: '#5566ff' },
            { lbl: 'AGI', val: p.stats.agi, color: '#33cc88' },
            { lbl: 'DEF', val: p.stats.def, color: '#aabb33' },
            { lbl: 'LCK', val: p.stats.lck, color: '#cc88ff' },
            { lbl: 'RANK', val: p.seasonTier || p.rank, color: '#ffaa33' },
          ].map((s) => (
            <div key={s.lbl} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '8px 10px' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>{s.lbl}</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Equipped</div>
        <div className="equipped-grid">
          {[
            { slot: 'Weapon', value: p.weapon?.name || '— None —', color: '#d91111' },
            { slot: 'Title',  value: p.title         || 'Newcomer', color: '#22aa77' },
          ].map((e) => (
            <div key={e.slot} className="equipped-row">
              <div style={{ minWidth: 0 }}>
                <div className="equipped-slot">{e.slot}</div>
                <div className="equipped-value" style={{ color: e.color }}>{e.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">PvP Record</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="profile-stat">
            <div className="profile-stat-val" style={{ color: '#33cc88' }}>{p.pvp}</div>
            <div className="profile-stat-lbl">Wins</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-val" style={{ color: '#cc3344' }}>{p.deaths}</div>
            <div className="profile-stat-lbl">Deaths</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-val">{p.boss}</div>
            <div className="profile-stat-lbl">Boss Kills</div>
          </div>
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={refreshing}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)',
                 border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted)',
                 fontFamily: 'var(--font)', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                 padding: '8px 14px', cursor: 'pointer', opacity: refreshing ? 0.5 : 1 }}
      >
        <SvgRefresh /> {refreshing ? 'Refreshing…' : 'Refresh'}
      </button>
    </>
  )
}

export default function Profile() {
  const { user, isLoggedIn } = useAuth()
  const [, navigate]         = useLocation()

  const [profile,    setProfile]    = useState<PortalProfile | null>(null)
  const [fetchError, setFetchError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const [pfp,    setPfp]    = useState<string>(() => loadStored(STORAGE_KEY_PFP, ''))
  const [banner, setBanner] = useState<string>(() => loadStored(STORAGE_KEY_BANNER, ''))

  const pfpInputRef    = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); }
  }, [isLoggedIn, navigate])

  const fetchProfile = useCallback(async () => {
    if (!user) return
    setFetchError('')
    try {
      const data = await apiFetch(`/profile/${user.username}`)
      setProfile(data as PortalProfile)
    } catch (e: any) {
      setFetchError(e.message || 'Failed to load profile.')
    }
  }, [user])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchProfile()
    setRefreshing(false)
  }

  const handleImage = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    storageKey: string,
    setter: (v: string) => void,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setter(result)
      try { localStorage.setItem(storageKey, result) } catch {}
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [])

  if (!isLoggedIn) return null

  const displayName = profile?.name || user?.name || 'Player'
  const classLabel  = profile?.class || 'Wanderer'
  const isPremium   = profile?.premium || false

  return (
    <div className="profile-page">

      <div className="profile-banner-wrap">
        <div style={{ width: '100%', height: '100%',
                      background: banner ? undefined : 'linear-gradient(135deg,#1a0a2e,#2a0a4e)',
                      backgroundImage: banner ? `url(${banner})` : undefined,
                      backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', inset: 0 }} />
        <div className="profile-banner-overlay" />
        <button className="profile-banner-change" onClick={() => bannerInputRef.current?.click()}>
          Change Banner
        </button>
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden-input"
          onChange={(e) => handleImage(e, STORAGE_KEY_BANNER, setBanner)} />
      </div>

      <div className="profile-identity">
        <div className="profile-pfp-wrap">
          <div style={{ width: '100%', height: '100%', borderRadius: '50%',
                        background: pfp ? undefined : 'linear-gradient(135deg,#4422aa,#aa2244)',
                        backgroundImage: pfp ? `url(${pfp})` : undefined,
                        backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <button className="profile-pfp-change" title="Change profile picture"
            onClick={() => pfpInputRef.current?.click()}>✎</button>
          <input ref={pfpInputRef} type="file" accept="image/*" className="hidden-input"
            onChange={(e) => handleImage(e, STORAGE_KEY_PFP, setPfp)} />
        </div>

        <div className="profile-name">
          {displayName}
          {isPremium && (
            <span style={{ marginLeft: '6px', fontSize: '0.55rem', color: '#c9a227',
                           background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.3)',
                           borderRadius: '4px', padding: '1px 5px', letterSpacing: '0.08em' }}>PREMIUM</span>
          )}
        </div>

        <div className="profile-handle" style={{ display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.15em' }}>
          <SvgSword /> {classLabel} · Season 3
        </div>

        <div style={{ fontSize: '0.64rem', color: 'var(--muted)', letterSpacing: '0.04em' }}>
          @{user?.username}
        </div>
      </div>

      {fetchError && (
        <div style={{ fontSize: '0.74rem', color: '#ff5555', background: 'rgba(255,85,85,0.08)',
                      border: '1px solid rgba(255,85,85,0.2)', borderRadius: '6px', padding: '8px 12px', margin: '0 16px' }}>
          {fetchError}
        </div>
      )}

      {profile && (
        <ConnectedProfile p={profile} onRefresh={handleRefresh} refreshing={refreshing} />
      )}

    </div>
  )
}
