import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, apiPatch } from "@/lib/api";
import { Shield, Sword, Trophy, Skull, Globe, Star, Edit2, ChevronRight, Zap, Loader2 } from "lucide-react";

interface FollowerTier {
  label: string;
  emoji: string;
  payout: number;
}

interface PlayerProfile {
  username: string;
  name: string;
  title: string;
  class: string;
  race: string;
  level: number;
  rank: string;
  seasonTier: string;
  faction: { name: string; id: string | number; role: string; memberCount?: number } | null;
  hp: { current: number; max: number };
  mp: { current: number; max: number };
  stats: { str: number; agi: number; int: number; def: number; lck: number };
  kills: number;
  deaths: number;
  pvp: number;
  boss: number;
  dun: number;
  weapon: { name: string; type: string; rarity: string; color: string } | null;
  titles: string[];
  equippedTitle: string;
  solars: number;
  gems: number;
  prestige: number;
  premium: boolean;
  pfp: string | null;
  banner: string | null;
  followers?: number;
  followersFormatted?: string;
  followerTier?: FollowerTier;
}

const STATS_MAP = [
  { Icon: Sword,  k: "STR", v: (p: PlayerProfile) => p.stats.str },
  { Icon: Zap,    k: "AGI", v: (p: PlayerProfile) => p.stats.agi },
  { Icon: Star,   k: "INT", v: (p: PlayerProfile) => p.stats.int },
  { Icon: Shield, k: "DEF", v: (p: PlayerProfile) => p.stats.def },
  { Icon: Star,   k: "LCK", v: (p: PlayerProfile) => p.stats.lck },
];

function UserIcon({ size = 40 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none" stroke="var(--text-grey)" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  );
}

export default function PlayerProfilePage() {
  const [, params] = useRoute("/profile/:username");
  const { player: auth, isLoggedIn } = useAuth();
  const username = params?.username ?? "";
  const isOwn = isLoggedIn && auth?.username === username;
  const [, navigate] = useLocation();

  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [equipped, setEquipped] = useState("");
  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState("");

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError("");
    apiFetch(`/profile/${encodeURIComponent(username)}`)
      .then((data: PlayerProfile) => {
        setProfile(data);
        setEquipped(data.equippedTitle);
        setNameVal(data.name);
      })
      .catch(() => setError("Player not found."))
      .finally(() => setLoading(false));
  }, [username]);

  async function handleEquipTitle(title: string) {
    if (!isOwn || !profile) return;
    setEquipped(title);
    try {
      await apiPatch(`/profile/${encodeURIComponent(username)}/title`, { title });
    } catch {
      setEquipped(profile.equippedTitle);
    }
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!isOwn || !profile) return;
    try {
      await apiPatch(`/profile/${encodeURIComponent(username)}/name`, { name: nameVal });
      setProfile(p => p ? { ...p, name: nameVal } : p);
    } catch {
      setNameVal(profile.name);
    }
    setEditName(false);
  }

  if (loading) {
    return (
      <div className="page-top" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", gap: 12, color: "var(--text-grey)" }}>
        <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: 13 }}>Loading profile…</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page-top container" style={{ paddingTop: 80, textAlign: "center" }}>
        <p style={{ color: "var(--error)", fontSize: 14 }}>{error || "Player not found."}</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => navigate("/rankings")}>
          View Rankings
        </button>
      </div>
    );
  }

  const kd = profile.deaths > 0 ? (profile.kills / profile.deaths).toFixed(2) : profile.kills.toString();

  return (
    <div className="page-top">
      {/* Banner */}
      <div className="profile-banner">
        {profile.banner && <img src={profile.banner} alt="" />}
        {isOwn && (
          <button className="btn btn-outline btn-sm" style={{ position: "absolute", bottom: 12, right: 12 }}>
            <Edit2 size={12} /> Banner
          </button>
        )}
      </div>

      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <div className="profile-avatar-wrap">
            {profile.pfp ? <img src={profile.pfp} alt="" /> : <UserIcon size={96} />}
          </div>
          <div style={{ flex: 1, minWidth: 200, paddingBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              {editName ? (
                <form onSubmit={handleSaveName} style={{ display: "flex", gap: 8 }}>
                  <input className="input" value={nameVal} onChange={e => setNameVal(e.target.value)} style={{ width: 180, fontSize: 15 }} maxLength={20} />
                  <button type="submit" className="btn btn-primary btn-sm">Save</button>
                </form>
              ) : (
                <>
                  <h1 style={{ fontSize: "clamp(18px, 5vw, 26px)", letterSpacing: "0.05em" }}>{profile.name}</h1>
                  {isOwn && (
                    <button onClick={() => setEditName(true)} style={{ background: "none", border: "none", color: "var(--text-grey)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <Edit2 size={13} />
                    </button>
                  )}
                </>
              )}
            </div>
            <div style={{ fontStyle: "italic", color: "var(--gold)", fontSize: 13, marginBottom: 10 }}>{equipped}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span className="badge badge-pill">{profile.class}</span>
              <span className="badge badge-pill">{profile.race}</span>
              <span className="badge badge-gold badge-pill">LVL {profile.level}</span>
              <span className="badge badge-gold badge-pill">{profile.rank}</span>
              <span className="badge badge-pill">{profile.seasonTier}</span>
              {profile.prestige > 0 && (
                <span className="badge badge-pill">Prestige {profile.prestige}</span>
              )}
              {profile.faction && (
                <button
                  onClick={() => navigate(`/factions`)}
                  className="badge badge-gold badge-pill"
                  style={{ cursor: "pointer", background: "rgba(255,184,48,0.06)", fontFamily: "var(--font-display)", border: "1px solid rgba(255,184,48,0.3)", color: "var(--gold)" }}
                >
                  {profile.faction.role} · {profile.faction.name}
                </button>
              )}
              {profile.followerTier && (profile.followers ?? 0) > 0 && (
                <span className="badge badge-pill" style={{ background: "rgba(255,184,48,0.06)", border: "1px solid rgba(255,184,48,0.25)", color: "var(--gold)" }}>
                  {profile.followerTier.emoji} {profile.followerTier.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* HP / MP */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "HP", c: profile.hp.current, max: profile.hp.max, cls: "hp-bar" },
              { label: "MP", c: profile.mp.current, max: profile.mp.max, cls: "mp-bar" },
            ].map(b => (
              <div key={b.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5, fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
                  <span>{b.label}</span>
                  <span style={{ color: "var(--text-grey)" }}>{b.c.toLocaleString()} / {b.max.toLocaleString()}</span>
                </div>
                <div className={`progress-bar ${b.cls}`}><div className="progress-fill" style={{ width: `${Math.min(100, (b.c / Math.max(1, b.max)) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 16 }}>
            {STATS_MAP.map(({ Icon, k, v }) => (
              <div key={k} className="stat-box">
                <Icon size={14} color="var(--gold)" />
                <div className="stat-box-num">{v(profile)}</div>
                <div className="stat-box-label">{k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Combat Record */}
        <div className="card" style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 13, letterSpacing: "0.1em", marginBottom: 14 }}>COMBAT RECORD</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { Icon: Sword,  k: "Kills",    v: profile.kills.toLocaleString() },
              { Icon: Skull,  k: "Deaths",   v: profile.deaths.toLocaleString() },
              { Icon: Star,   k: "K/D",      v: kd },
              { Icon: Trophy, k: "PvP W",    v: profile.pvp.toLocaleString() },
              { Icon: Globe,  k: "Bosses",   v: profile.boss.toLocaleString() },
              { Icon: Globe,  k: "Dungeons", v: profile.dun.toLocaleString() },
            ].map(s => (
              <div key={s.k} className="stat-box">
                <s.Icon size={14} color="var(--gold)" />
                <div className="stat-box-num" style={{ fontSize: 18 }}>{s.v}</div>
                <div className="stat-box-label">{s.k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weapon — only if equipped */}
        {profile.weapon && (
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, letterSpacing: "0.1em", marginBottom: 14 }}>EQUIPPED</h3>
            <div className={`gear-slot rarity-${profile.weapon.rarity}`} style={{ border: "1px solid" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${profile.weapon.color}12`, border: `1px solid ${profile.weapon.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sword size={18} color={profile.weapon.color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>{profile.weapon.name}</div>
                <span className="badge" style={{ fontSize: 9, marginTop: 4, borderColor: profile.weapon.color, color: profile.weapon.color }}>
                  {profile.weapon.rarity.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Titles */}
        {profile.titles.length > 0 && (
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, letterSpacing: "0.1em", marginBottom: 12 }}>TITLES</h3>
            <div className="h-scroll" style={{ paddingBottom: 4 }}>
              {profile.titles.map(t => (
                <button
                  key={t}
                  className={`title-pill${t === equipped ? " equipped" : ""}`}
                  onClick={() => handleEquipTitle(t)}
                  disabled={!isOwn}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Season Pass */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 13, letterSpacing: "0.1em" }}>SEASON 3 — DEVOURED HEAVEN</h3>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {profile.premium ? (
                  <span className="badge badge-gold badge-pill" style={{ fontSize: 10 }}>Premium Unlocked</span>
                ) : (
                  <span className="badge badge-pill" style={{ fontSize: 10 }}>Free Tier</span>
                )}
                <span style={{ fontSize: 12, color: "var(--text-grey)", fontStyle: "italic" }}>{profile.seasonTier}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Followers */}
        {profile.followerTier && (profile.followers ?? 0) > 0 && (
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, letterSpacing: "0.1em", marginBottom: 14 }}>SOCIAL INFLUENCE</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
                <div style={{ fontSize: 36, lineHeight: 1 }}>{profile.followerTier.emoji}</div>
                <div style={{ fontFamily: "var(--font-num)", fontWeight: 700, fontSize: 22, color: "var(--gold)", marginTop: 4 }}>
                  {profile.followersFormatted ?? profile.followers?.toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-grey)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Followers</div>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, letterSpacing: "0.05em", color: "var(--text-white)", marginBottom: 4 }}>
                  {profile.followerTier.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-grey)", lineHeight: 1.5 }}>
                  Social tier based on follower count
                </div>
                {profile.followerTier.payout > 0 && (
                  <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,184,48,0.08)", border: "1px solid rgba(255,184,48,0.2)", borderRadius: 20, padding: "4px 12px" }}>
                    <Star size={11} color="var(--gold)" />
                    <span style={{ fontSize: 11, color: "var(--gold)", fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
                      +{profile.followerTier.payout} Solar/day bonus
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Faction */}
        {profile.faction && (
          <div className="card" style={{ marginBottom: 36 }}>
            <h3 style={{ fontSize: 13, letterSpacing: "0.1em", marginBottom: 12 }}>FACTION</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,184,48,0.08)", border: "1px solid rgba(255,184,48,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Shield size={18} color="var(--gold)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>{profile.faction.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-grey)", marginTop: 2 }}>{profile.faction.role}</div>
                </div>
              </div>
              <button onClick={() => navigate(`/factions`)} className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                View <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
