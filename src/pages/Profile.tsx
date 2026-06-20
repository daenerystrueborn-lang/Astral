import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { useAuth } from '@/context/AuthContext'
import { apiFetch, apiPatch, uploadToImgBB } from '@/lib/api'
import { Shield, Sword, Star, Loader2 } from 'lucide-react'

interface FollowerTier {
  label: string
  emoji: string
  payout: number
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
  faction: { name: string; id: string | number; role: string; memberCount?: number } | null
  hp: { current: number; max: number }
  mp: { current: number; max: number }
  stats: { str: number; agi: number; int: number; def: number; lck: number }
  kills: number
  deaths: number
  pvp: number
  boss: number
  dun: number
  weapon: { name: string; rarity: string; color: string } | null
  titles: string[]
  equippedTitle: string
  solars: number
  gems: number
  prestige: number
  premium: boolean
  pfp: string | null
  banner: string | null
  followers?: number
  followersFormatted?: string
  followerTier?: FollowerTier
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Bar({ val, max, color }: { val: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((val / max) * 100)) : 0
  return (
    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }} />
    </div>
  )
}

function StatBox({ label, value, color = 'var(--gold)' }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-num)', fontWeight: 700, fontSize: 18, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <h3 style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-grey)', marginBottom: 14 }}>{title}</h3>
      {children}
    </div>
  )
}

// ── Guest state ───────────────────────────────────────────────────────────────

function GuestCard() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ maxWidth: 400, width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,184,48,0.08)', border: '1px solid rgba(255,184,48,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Star size={28} color="var(--gold)" />
        </div>
        <h2 style={{ fontSize: 20, letterSpacing: '0.08em', marginBottom: 10, fontFamily: 'var(--font-display)' }}>YOUR LEGEND AWAITS</h2>
        <p style={{ fontSize: 13, color: 'var(--text-grey)', lineHeight: 1.6, marginBottom: 28 }}>
          Sign in with your portal account to view your live RPG stats, gear, and rank synced from the bot.
        </p>
        <Link href="/login" className="btn btn-primary" style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
          Log In
        </Link>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, isLoggedIn } = useAuth()
  const [, navigate]         = useLocation()

  const [profile,    setProfile]    = useState<PortalProfile | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const [equipped,    setEquipped]    = useState('')
  const [uploadingPfp,    setUploadingPfp]    = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  const pfpInputRef    = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const isOwn = isLoggedIn && !!user

  const fetchProfile = useCallback(async () => {
    if (!user) return
    setFetchError('')
    try {
      const data = await apiFetch(`/profile/${encodeURIComponent(user.username)}`)
      setProfile(data as PortalProfile)
      setEquipped((data as PortalProfile).equippedTitle ?? '')
    } catch (e: any) {
      setFetchError(e.message || 'Failed to load profile.')
    }
  }, [user])

  useEffect(() => {
    if (!isLoggedIn) return
    setLoading(true)
    fetchProfile().finally(() => setLoading(false))
  }, [fetchProfile, isLoggedIn])

  // ── Image upload helpers ───────────────────────────────────────────────────

  async function handlePfpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user || !profile) return
    e.target.value = ''
    setUploadingPfp(true)
    try {
      const url = await uploadToImgBB(file)
      await apiPatch(`/profile/${encodeURIComponent(user.username)}/pfp`, { pfp: url })
      setProfile(p => p ? { ...p, pfp: url } : p)
    } catch { /* silently ignore */ }
    setUploadingPfp(false)
  }

  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user || !profile) return
    e.target.value = ''
    setUploadingBanner(true)
    try {
      const url = await uploadToImgBB(file)
      await apiPatch(`/profile/${encodeURIComponent(user.username)}/banner`, { banner: url })
      setProfile(p => p ? { ...p, banner: url } : p)
    } catch { /* silently ignore */ }
    setUploadingBanner(false)
  }

  async function handleEquipTitle(title: string) {
    if (!isOwn || !user || !profile) return
    setEquipped(title)
    try {
      await apiPatch(`/profile/${encodeURIComponent(user.username)}/title`, { title })
      setProfile(p => p ? { ...p, equippedTitle: title } : p)
    } catch {
      setEquipped(profile.equippedTitle)
    }
  }

  // ── Not logged in ──────────────────────────────────────────────────────────

  if (!isLoggedIn) return <GuestCard />

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 12, color: 'var(--text-grey)' }}>
        <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: 13 }}>Loading profile…</span>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, padding: 24 }}>
        <p style={{ color: 'var(--error)', fontSize: 13 }}>{fetchError}</p>
        <button className="btn btn-ghost btn-sm" onClick={() => { setLoading(true); fetchProfile().finally(() => setLoading(false)) }}>
          Try again
        </button>
      </div>
    )
  }

  if (!profile) return null

  const kd = profile.deaths > 0 ? (profile.kills / profile.deaths).toFixed(2) : String(profile.kills)
  const initial = (profile.name?.[0] ?? '?').toUpperCase()

  return (
    <div className="page-top">

      {/* ── 1. BANNER ──────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden', flexShrink: 0 }}>
        {profile.banner
          ? <img src={profile.banner} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1006, #2a1a00)' }} />
        }
        {/* Gradient fade for readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55))' }} />

        {/* Change banner button */}
        {isOwn && (
          <button
            onClick={() => bannerInputRef.current?.click()}
            disabled={uploadingBanner}
            style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 6, color: '#fff', fontSize: 11, letterSpacing: '0.07em', padding: '5px 12px', cursor: 'pointer', backdropFilter: 'blur(6px)', opacity: uploadingBanner ? 0.6 : 1 }}
          >
            {uploadingBanner ? 'Uploading…' : 'Change Banner'}
          </button>
        )}
        <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerChange} />
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px 48px' }}>

        {/* ── 2. AVATAR — overlaps banner by 48px ─────────────────────────── */}
        <div style={{ marginTop: -48, marginLeft: 24, marginBottom: 0, position: 'relative', zIndex: 2, display: 'inline-block' }}>
          <div
            style={{ width: 96, height: 96, borderRadius: '50%', border: '3px solid var(--bg-card, #111)', overflow: 'hidden', background: '#1a1006', position: 'relative', cursor: isOwn ? 'pointer' : 'default' }}
            onClick={() => isOwn && pfpInputRef.current?.click()}
          >
            {profile.pfp
              ? <img src={profile.pfp} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#2a1a00,#1a0a00)', fontSize: 36, fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>{initial}</div>
            }
            {/* Pencil overlay on hover */}
            {isOwn && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
              >
                {uploadingPfp
                  ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: '#fff' }} />
                  : <span style={{ fontSize: 18, color: '#fff', opacity: 0, transition: 'opacity 0.15s' }} className="pfp-pencil">✎</span>
                }
              </div>
            )}
          </div>
          <input ref={pfpInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePfpChange} />
        </div>

        {/* ── 3. IDENTITY ─────────────────────────────────────────────────── */}
        <div style={{ marginTop: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 2 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', lineHeight: 1 }}>{profile.name}</h1>
            {profile.premium && (
              <span style={{ fontSize: 9, color: '#c9a227', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.35)', borderRadius: 4, padding: '2px 6px', letterSpacing: '0.1em', fontFamily: 'var(--font-display)' }}>PREMIUM</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-grey)', marginBottom: 6 }}>@{profile.username}</div>
          {equipped && (
            <div style={{ fontStyle: 'italic', color: 'var(--gold)', fontSize: 13, marginBottom: 10 }}>{equipped}</div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <span className="badge badge-pill">{profile.class}</span>
            <span className="badge badge-pill">{profile.race}</span>
            <span className="badge badge-gold badge-pill">LVL {profile.level}</span>
            <span className="badge badge-gold badge-pill">{profile.rank}</span>
            {profile.seasonTier && <span className="badge badge-pill">{profile.seasonTier}</span>}
            {profile.prestige > 0 && <span className="badge badge-pill">Prestige {profile.prestige}</span>}
          </div>
        </div>

        {/* ── 4. STATS CARD ───────────────────────────────────────────────── */}
        <SectionCard title="Vitals &amp; Stats">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-grey)', marginBottom: 5 }}>
                <span>❤️ HP</span>
                <span style={{ fontFamily: 'var(--font-num)' }}>{profile.hp.current.toLocaleString()} / {profile.hp.max.toLocaleString()}</span>
              </div>
              <Bar val={profile.hp.current} max={profile.hp.max} color="#cc3344" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-grey)', marginBottom: 5 }}>
                <span>💙 MP</span>
                <span style={{ fontFamily: 'var(--font-num)' }}>{profile.mp.current.toLocaleString()} / {profile.mp.max.toLocaleString()}</span>
              </div>
              <Bar val={profile.mp.current} max={profile.mp.max} color="#3366cc" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {[
              { label: 'STR', value: profile.stats.str, color: '#cc5533' },
              { label: 'AGI', value: profile.stats.agi, color: '#33cc88' },
              { label: 'INT', value: profile.stats.int, color: '#5566ff' },
              { label: 'DEF', value: profile.stats.def, color: '#aabb33' },
              { label: 'LCK', value: profile.stats.lck, color: '#cc88ff' },
            ].map(s => <StatBox key={s.label} {...s} />)}
          </div>
        </SectionCard>

        {/* ── 5. COMBAT RECORD ────────────────────────────────────────────── */}
        <SectionCard title="Combat Record">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <StatBox label="Kills"     value={profile.kills.toLocaleString()} />
            <StatBox label="Deaths"    value={profile.deaths.toLocaleString()} color="#cc3344" />
            <StatBox label="K / D"     value={kd} />
            <StatBox label="PvP Wins"  value={profile.pvp.toLocaleString()} color="#ffaa33" />
            <StatBox label="Boss Kills" value={profile.boss.toLocaleString()} />
            <StatBox label="Dungeons"  value={profile.dun.toLocaleString()} />
          </div>
        </SectionCard>

        {/* ── 6. FOLLOWERS CARD (only if > 0) ─────────────────────────────── */}
        {profile.followerTier && (profile.followers ?? 0) > 0 && (
          <SectionCard title="Social Influence">
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', minWidth: 72 }}>
                <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 6 }}>{profile.followerTier.emoji}</div>
                <div style={{ fontFamily: 'var(--font-num)', fontWeight: 700, fontSize: 24, color: 'var(--gold)', lineHeight: 1 }}>
                  {profile.followersFormatted ?? profile.followers?.toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-grey)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>Followers</div>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '0.05em', marginBottom: 4 }}>
                  {profile.followerTier.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-grey)', lineHeight: 1.5, marginBottom: profile.followerTier.payout > 0 ? 10 : 0 }}>
                  Social tier based on follower count
                </div>
                {profile.followerTier.payout > 0 && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,184,48,0.08)', border: '1px solid rgba(255,184,48,0.22)', borderRadius: 20, padding: '4px 12px' }}>
                    <Star size={11} color="var(--gold)" />
                    <span style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                      +{profile.followerTier.payout} Solar/day bonus
                    </span>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── 7. EQUIPPED ─────────────────────────────────────────────────── */}
        <SectionCard title="Equipped">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 14px' }}>
              <Sword size={16} color={profile.weapon?.color ?? 'var(--text-grey)'} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
                  {profile.weapon?.name ?? '— No Weapon —'}
                </div>
                {profile.weapon && (
                  <div style={{ fontSize: 10, color: profile.weapon.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
                    {profile.weapon.rarity}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 14px' }}>
              <Star size={16} color="#22aa77" />
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '0.03em', color: '#22aa77' }}>
                {equipped || '— No Title —'}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── 8. TITLES ───────────────────────────────────────────────────── */}
        {profile.titles.length > 0 && (
          <SectionCard title="Titles">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {profile.titles.map(t => (
                <button
                  key={t}
                  onClick={() => handleEquipTitle(t)}
                  disabled={!isOwn}
                  className={`title-pill${t === equipped ? ' equipped' : ''}`}
                  style={{ cursor: isOwn ? 'pointer' : 'default' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── 9. FACTION ──────────────────────────────────────────────────── */}
        {profile.faction && (
          <SectionCard title="Faction">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,184,48,0.08)', border: '1px solid rgba(255,184,48,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={18} color="var(--gold)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>{profile.faction.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-grey)', marginTop: 2, display: 'flex', gap: 10 }}>
                    <span>{profile.faction.role}</span>
                    {(profile.faction.memberCount ?? 0) > 0 && (
                      <span>{profile.faction.memberCount} members</span>
                    )}
                  </div>
                </div>
              </div>
              <Link href="/factions" className="btn btn-ghost btn-sm">View →</Link>
            </div>
          </SectionCard>
        )}

        {/* ── 10. SEASON ──────────────────────────────────────────────────── */}
        <SectionCard title="Season 3 — Devoured Heaven">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {profile.premium
              ? <span className="badge badge-gold badge-pill" style={{ fontSize: 11 }}>⭐ Premium Unlocked</span>
              : <span className="badge badge-pill" style={{ fontSize: 11 }}>Free Tier</span>
            }
            {profile.seasonTier && (
              <span style={{ fontSize: 12, color: 'var(--text-grey)', fontStyle: 'italic' }}>{profile.seasonTier}</span>
            )}
            {!profile.premium && (
              <Link href="/premium" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>Upgrade</Link>
            )}
          </div>
        </SectionCard>

        {/* ── 11. REFRESH ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <button
            onClick={async () => { setRefreshing(true); await fetchProfile(); setRefreshing(false) }}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-grey)', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 18px', cursor: 'pointer', opacity: refreshing ? 0.5 : 1, transition: 'opacity 0.2s' }}
          >
            {refreshing
              ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Refreshing…</>
              : <>↻ Refresh Stats</>
            }
          </button>
        </div>

      </div>
    </div>
  )
}
