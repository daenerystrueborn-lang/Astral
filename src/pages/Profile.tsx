import { useState, useRef, useCallback, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { BotPlayer } from '@/lib/botApi'

const STORAGE_KEY_PFP    = 'astral_profile_pfp'
const STORAGE_KEY_BANNER = 'astral_profile_banner'

function loadStored(key: string, fallback: string): string {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}

// ── Stat bar ──────────────────────────────────────────────────────────────────
function StatBar({ val, max, color }: { val: number; max: number; color: string }) {
  const pct = Math.min(100, max > 0 ? Math.round((val / max) * 100) : 0)
  return (
    <div style={{ height:'5px', background:'rgba(255,255,255,0.07)', borderRadius:'3px', overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:'3px', transition:'width 0.4s' }} />
    </div>
  )
}

// ── Rank label ────────────────────────────────────────────────────────────────
function rankFromXp(xp: number): string {
  if (xp >= 1800000) return 'Legendary'
  if (xp >= 1000000) return 'Grandmaster'
  if (xp >= 600000)  return 'Master'
  if (xp >= 350000)  return 'Diamond'
  if (xp >= 180000)  return 'Solars'
  if (xp >= 80000)   return 'Silver'
  if (xp >= 30000)   return 'Bronze'
  return 'Unranked'
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function SvgSword() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6"/>
    </svg>
  )
}
function SvgRefresh() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  )
}

// ── Bot-connected profile ─────────────────────────────────────────────────────
function ConnectedProfile({ p, onRefresh, refreshing }: { p: BotPlayer; onRefresh: () => void; refreshing: boolean }) {
  const classLabel = p.evolved || p.class || 'Wanderer'
  const prestigeLabel = p.isKami ? 'Ascendant' : p.prestige > 0 ? `Prestige ${p.prestige}` : null

  return (
    <>
      {/* Live stats grid */}
      <div className="profile-stats">
        {[
          { val: String(p.level),   lbl: 'Level'    },
          { val: String(p.gold?.toLocaleString() ?? 0), lbl: 'Solars' },
          { val: String(p.gems),    lbl: 'Gems'     },
          { val: String(p.kills),   lbl: 'Kills'    },
          { val: String(p.dungeons),lbl: 'Dungeon'  },
          { val: p.guild || 'None', lbl: 'Guild'    },
        ].map((s) => (
          <div key={s.lbl} className="profile-stat">
            <div className="profile-stat-val">{s.val}</div>
            <div className="profile-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* HP / MP bars */}
      <div className="card" style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        <div className="section-title">Vitals</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--muted)', marginBottom:'4px' }}>
              <span>❤️ HP</span><span>{p.hp} / {p.maxHp}</span>
            </div>
            <StatBar val={p.hp} max={p.maxHp} color="#cc3344" />
          </div>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--muted)', marginBottom:'4px' }}>
              <span>💙 MP</span><span>{p.mp} / {p.maxMp}</span>
            </div>
            <StatBar val={p.mp} max={p.maxMp} color="#3366cc" />
          </div>
        </div>
      </div>

      {/* Base stats */}
      <div className="card">
        <div className="section-title">Base Stats</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
          {[
            { lbl:'STR', val: p.str, color:'#cc5533' },
            { lbl:'INT', val: p.int, color:'#5566ff' },
            { lbl:'AGI', val: p.agi, color:'#33cc88' },
            { lbl:'DEF', val: p.def, color:'#aabb33' },
            { lbl:'LCK', val: p.lck, color:'#cc88ff' },
            { lbl:'RANK', val: rankFromXp(p.rankedXp), color:'#ffaa33' },
          ].map((s) => (
            <div key={s.lbl} style={{ background:'rgba(255,255,255,0.03)', borderRadius:'6px', padding:'8px 10px' }}>
              <div style={{ fontSize:'0.6rem', color:'var(--muted)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'3px' }}>{s.lbl}</div>
              <div style={{ fontSize:'0.92rem', fontWeight:700, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipped */}
      <div className="card">
        <div className="section-title">Equipped</div>
        <div className="equipped-grid">
          {[
            { slot:'Weapon',    value: p.weapon    || '— None —',  color:'#d91111' },
            { slot:'Armor',     value: p.armor     || '— None —',  color:'#5588cc' },
            { slot:'Accessory', value: p.accessory || '— None —',  color:'#c9a227' },
            { slot:'Title',     value: p.title     || 'Newcomer',  color:'#22aa77' },
            ...(p.skillSlots || []).slice(0,4).map((s, i) => ({
              slot: `Skill ${i+1}`, value: s || '— Empty —', color:'#8855dd',
            })),
          ].map((e) => (
            <div key={e.slot} className="equipped-row">
              <div style={{ minWidth:0 }}>
                <div className="equipped-slot">{e.slot}</div>
                <div className="equipped-value" style={{ color: e.color }}>{e.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PvP record */}
      <div className="card">
        <div className="section-title">PvP Record</div>
        <div style={{ display:'flex', gap:'16px' }}>
          <div className="profile-stat">
            <div className="profile-stat-val" style={{ color:'#33cc88' }}>{p.wins}</div>
            <div className="profile-stat-lbl">Wins</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-val" style={{ color:'#cc3344' }}>{p.losses}</div>
            <div className="profile-stat-lbl">Losses</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-val">{rankFromXp(p.rankedXp)}</div>
            <div className="profile-stat-lbl">Rank</div>
          </div>
        </div>
      </div>

      {/* Refresh button */}
      <button
        onClick={onRefresh}
        disabled={refreshing}
        style={{ display:'flex', alignItems:'center', gap:'6px', background:'rgba(255,255,255,0.05)',
                 border:'1px solid var(--border)', borderRadius:'8px', color:'var(--muted)',
                 fontFamily:'var(--font)', fontSize:'0.7rem', letterSpacing:'0.08em', textTransform:'uppercase',
                 padding:'8px 14px', cursor:'pointer', opacity: refreshing ? 0.5 : 1 }}
      >
        <SvgRefresh /> {refreshing ? 'Refreshing…' : 'Refresh from Bot'}
      </button>
    </>
  )
}

// ── Guest (not logged in) state ───────────────────────────────────────────────
function GuestProfile({ openLogin }: { openLogin: () => void }) {
  return (
    <>
      <div className="profile-stats">
        {[
          { val:'?', lbl:'Level'   },
          { val:'?', lbl:'Solars'  },
          { val:'?', lbl:'Gems'    },
          { val:'?', lbl:'Kills'   },
          { val:'?', lbl:'Dungeon' },
          { val:'?', lbl:'Guild'   },
        ].map((s) => (
          <div key={s.lbl} className="profile-stat">
            <div className="profile-stat-val" style={{ color:'var(--muted)' }}>{s.val}</div>
            <div className="profile-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ textAlign:'center', padding:'32px 20px', display:'flex', flexDirection:'column', gap:'12px', alignItems:'center' }}>
        <div style={{ fontSize:'0.82rem', color:'var(--text)', fontWeight:600 }}>Connect Your Account</div>
        <div style={{ fontSize:'0.74rem', color:'var(--muted)', lineHeight:'1.6', maxWidth:'320px' }}>
          Log in with your WhatsApp number to see your live RPG stats, level, gear, and PvP record synced from the bot.
        </div>
        <button
          onClick={openLogin}
          style={{ background:'var(--accent)', border:'none', borderRadius:'8px', color:'#fff',
                   fontFamily:'var(--font)', fontSize:'0.74rem', letterSpacing:'0.1em',
                   textTransform:'uppercase', padding:'10px 24px', cursor:'pointer', fontWeight:600, marginTop:'4px' }}
        >
          Log In / Sign Up
        </button>
      </div>
    </>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Profile() {
  const { user, botPlayer, refreshBotData, openModal } = useAuth()

  const [pfp,    setPfp]    = useState<string>(() => loadStored(STORAGE_KEY_PFP, ''))
  const [banner, setBanner] = useState<string>(() => loadStored(STORAGE_KEY_BANNER, ''))
  const [refreshing, setRefreshing] = useState(false)

  const pfpInputRef    = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

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

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshBotData()
    setRefreshing(false)
  }

  const displayName = botPlayer?.name || user?.username || 'The Architect'
  const classLabel  = botPlayer ? (botPlayer.evolved || botPlayer.class || 'Wanderer') : 'Player'
  const isPremium   = botPlayer?.isPremium || false

  return (
    <div className="profile-page">

      {/* Banner */}
      <div className="profile-banner-wrap">
        <div style={{ width:'100%', height:'100%', background: banner ? undefined : 'linear-gradient(135deg,#1a0a2e,#2a0a4e)',
                      backgroundImage: banner ? `url(${banner})` : undefined,
                      backgroundSize:'cover', backgroundPosition:'center', position:'absolute', inset:0 }} />
        <div className="profile-banner-overlay" />
        <button className="profile-banner-change" onClick={() => bannerInputRef.current?.click()}>
          Change Banner
        </button>
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden-input"
          onChange={(e) => handleImage(e, STORAGE_KEY_BANNER, setBanner)} />
      </div>

      {/* Identity */}
      <div className="profile-identity">
        <div className="profile-pfp-wrap">
          <div style={{ width:'100%', height:'100%', borderRadius:'50%',
                        background: pfp ? undefined : 'linear-gradient(135deg,#4422aa,#aa2244)',
                        backgroundImage: pfp ? `url(${pfp})` : undefined,
                        backgroundSize:'cover', backgroundPosition:'center' }} />
          <button className="profile-pfp-change" title="Change profile picture"
            onClick={() => pfpInputRef.current?.click()}>✎</button>
          <input ref={pfpInputRef} type="file" accept="image/*" className="hidden-input"
            onChange={(e) => handleImage(e, STORAGE_KEY_PFP, setPfp)} />
        </div>

        <div className="profile-name">
          {displayName}
          {isPremium && <span style={{ marginLeft:'6px', fontSize:'0.55rem', color:'#c9a227',
                                       background:'rgba(201,162,39,0.12)', border:'1px solid rgba(201,162,39,0.3)',
                                       borderRadius:'4px', padding:'1px 5px', letterSpacing:'0.08em' }}>PREMIUM</span>}
        </div>

        <div className="profile-handle" style={{ display:'flex', alignItems:'center', gap:'6px', letterSpacing:'0.15em' }}>
          <SvgSword /> {classLabel} · Season 2
        </div>

        {user && (
          <div style={{ fontSize:'0.64rem', color:'var(--muted)', letterSpacing:'0.04em' }}>
            📱 {user.waNumber}
          </div>
        )}
      </div>

      {/* Dynamic content */}
      {user && botPlayer ? (
        <ConnectedProfile p={botPlayer} onRefresh={handleRefresh} refreshing={refreshing} />
      ) : (
        <GuestProfile openLogin={() => openModal('login')} />
      )}

    </div>
  )
}
