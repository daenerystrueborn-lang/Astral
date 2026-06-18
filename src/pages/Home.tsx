import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import RegistrationModal from "@/components/RegistrationModal";
import { apiFetch, WHATSAPP_GROUPS } from "@/lib/api";
import {
  MessageCircle, Sword, Castle, Users, Star,
  Globe, Layers, Zap, ChevronRight
} from "lucide-react";
import heroImg from "@assets/126100858315462481_1781751469800.jpg";

const SEASON_END = new Date("2026-08-10T23:59:59Z");

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const t = Math.max(0, diff);
  return {
    d: Math.floor(t / 86400000),
    h: Math.floor((t % 86400000) / 3600000),
    m: Math.floor((t % 3600000) / 60000),
    s: Math.floor((t % 60000) / 1000),
  };
}

const EVENTS = [
  {
    Icon: Star,
    name: "The Consuming",
    desc: "Heaven hungers. Double XP for all kills.",
    bonuses: ["+50% XP", "Difficulty ×1.3"],
  },
  {
    Icon: Zap,
    name: "Godfall Surge",
    desc: "The gods fall faster than ever.",
    bonuses: ["Boss ×3", "Drop ×2.5"],
  },
  {
    Icon: Globe,
    name: "The Last Feast",
    desc: "Final push before the season closes.",
    bonuses: ["Difficulty ×2", "Rewards ×3"],
  },
];

const SPIN_POOL = [
  { Icon: Sword, name: "Raphael's Blade", type: "Legendary Weapon", rarity: "legendary", rarityColor: "#FFB830" },
  { Icon: Star, name: "Celestia's Bow", type: "Legendary Weapon", rarity: "legendary", rarityColor: "#FFB830" },
  { Icon: Globe, name: "First Appetite", type: "Mythic Weapon", rarity: "mythic", rarityColor: "#ff6b00" },
  { Icon: Layers, name: "Devoured Fragment", type: "Epic Consumable", rarity: "epic", rarityColor: "#9b59b6" },
  { Icon: Zap, name: "Heaven's Edge", type: "Legendary Weapon", rarity: "legendary", rarityColor: "#FFB830" },
  { Icon: Star, name: "Solar Crown", type: "Mythic Accessory", rarity: "mythic", rarityColor: "#ff6b00" },
];

const FEATURES = [
  { Icon: Sword,   title: "Combat",     desc: "14+ classes. Hunt, fight, ascend." },
  { Icon: Castle,  title: "Dungeons",   desc: "100-floor dungeons. Solo or party." },
  { Icon: Users,   title: "PvP Arena",  desc: "Ranked battles via Glicko-2 rating." },
  { Icon: Globe,   title: "Factions",   desc: "Found or join. 5 upgrade tiers." },
  { Icon: Layers,  title: "Gacha",      desc: "Cards, spins, pity system for legendaries." },
  { Icon: Star,    title: "World Bosses", desc: "Server-wide events. Priority loot for premium." },
];

function FadeCard({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [visible, setVisible] = useState(false);
  const ref = (el: HTMLDivElement | null) => {
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
  };
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const [, navigate] = useLocation();
  const [showReg, setShowReg] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState<number | null>(null);
  const [lockTimer, setLockTimer] = useState(0);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (lockout) {
      const id = setInterval(() => {
        const r = Math.max(0, Math.ceil((lockout - Date.now()) / 1000));
        setLockTimer(r);
        if (r === 0) { setLockout(null); setAttempts(0); }
      }, 1000);
      return () => clearInterval(id);
    }
  }, [lockout]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (lockout) return;
    setLoading(true); setError("");
    try {
      const data = await apiFetch("/login", { method: "POST", body: JSON.stringify(form) });
      navigate(`/profile/${data.username}`);
    } catch {
      const n = attempts + 1; setAttempts(n);
      if (n >= 5) { setLockout(Date.now() + 300000); setError("Too many attempts. Wait 5 min."); }
      else setError("Wrong username or password.");
    } finally { setLoading(false); }
  }

  return (
    <div>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="hero">
        <img src={heroImg} alt="Devoured Heaven" className="hero-main-img" />
        <div className="hero-gradient" />

        <div className="hero-content">
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(38px, 11vw, 88px)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            lineHeight: 0.95,
            marginBottom: 28,
            animation: "fadeInUp 0.6s ease 0.2s both",
          }} className="text-gold-gradient">
            DEVOURED<br />HEAVEN
          </h1>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", animation: "fadeInUp 0.6s ease 0.35s both" }}>
            <button className="btn btn-primary btn-lg" onClick={() => setShowReg(true)}>
              <MessageCircle size={16} />
              Join the Realm
            </button>
            <Link href="/premium" className="btn btn-outline btn-lg">
              Season Pass
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── EVENTS ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 32 }}>
            <h2 className="section-title">Season Events</h2>
            <p className="section-sub">Active throughout Season 3</p>
          </div>
          <div className="cards-grid-3">
            {EVENTS.map(({ Icon, name, desc, bonuses }, i) => (
              <FadeCard key={name} delay={i * 0.08}>
                <div className="card" style={{ height: "100%" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,184,48,0.08)", border: "1px solid rgba(255,184,48,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={18} color="var(--gold)" />
                  </div>
                  <h3 style={{ fontSize: 17, letterSpacing: "0.06em", marginBottom: 6 }}>{name}</h3>
                  <p style={{ color: "var(--text-grey)", fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>{desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {bonuses.map(b => <span key={b} className="badge badge-gold badge-pill">{b}</span>)}
                  </div>
                </div>
              </FadeCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPIN POOL (auto-scroll) ───────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ marginBottom: 24 }}>
          <h2 className="section-title">What Falls From Heaven</h2>
          <p className="section-sub">Season 3 exclusive weapons · Hover to pause</p>
        </div>
        <div className="marquee-wrap">
          <div className="marquee-inner">
            {[...SPIN_POOL, ...SPIN_POOL].map((item, i) => (
              <div key={i} className={`card rarity-${item.rarity}`} style={{ minWidth: 168, textAlign: "center", padding: "20px 16px" }}>
                <span className="badge badge-pill" style={{ fontSize: 9, marginBottom: 12, borderColor: item.rarityColor, color: item.rarityColor }}>
                  {item.rarity.toUpperCase()}
                </span>
                <div style={{ width: 48, height: 48, margin: "8px auto 12px", borderRadius: 12, background: `${item.rarityColor}12`, border: `1px solid ${item.rarityColor}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <item.Icon size={22} color={item.rarityColor} />
                </div>
                <h3 style={{ fontSize: 14, letterSpacing: "0.05em", marginBottom: 4 }}>{item.name}</h3>
                <p style={{ fontSize: 11, color: "var(--text-grey)" }}>{item.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOIN ──────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ marginBottom: 24 }}>
            <h2 className="section-title">Join the Realm</h2>
          </div>
          <div className="cards-grid-2" style={{ marginBottom: 16 }}>
            {WHATSAPP_GROUPS.map(g => (
              <FadeCard key={g.name}>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <MessageCircle size={20} color="#22c55e" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)", letterSpacing: "0.04em", marginBottom: 4 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-grey)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      <Users size={11} />
                      {g.members} members
                    </div>
                    <a href={g.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      Join Group
                    </a>
                  </div>
                </div>
              </FadeCard>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="btn btn-ghost" onClick={() => setShowReg(true)}>
              New here? Create an account
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ marginBottom: 32 }}>
            <h2 className="section-title">What Awaits You</h2>
          </div>
          <div className="cards-grid-6">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <FadeCard key={title} delay={i * 0.07}>
                <div className="card" style={{ height: "100%" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,184,48,0.08)", border: "1px solid rgba(255,184,48,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Icon size={16} color="var(--gold)" />
                  </div>
                  <h3 style={{ fontSize: 15, letterSpacing: "0.06em", marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-grey)", lineHeight: 1.5 }}>{desc}</p>
                </div>
              </FadeCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGN IN (logged-out only) ──────────────────────────────── */}
      {!isLoggedIn && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="signin-section" style={{ maxWidth: 560, margin: "0 auto" }}>
              <div className="signin-section-bg" style={{ backgroundImage: `url(${heroImg})` }} />
              <div className="signin-section-content">
                <h2 style={{ fontSize: 22, letterSpacing: "0.08em", marginBottom: 6, textAlign: "center" }}>YOUR LEGEND AWAITS</h2>
                <p style={{ color: "var(--text-grey)", fontSize: 13, marginBottom: 24, textAlign: "center" }}>
                  Sign in to track progress and manage your character.
                </p>
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label className="input-label">Username</label>
                    <input className="input" placeholder="YourUsername" value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))} disabled={!!lockout} required />
                  </div>
                  <div>
                    <label className="input-label">Password</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPw ? "text" : "password"} className="input" placeholder="••••••••" value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))} disabled={!!lockout} required style={{ paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-grey)", display: "flex", alignItems: "center" }}>
                        {showPw
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                      </button>
                    </div>
                  </div>
                  {error && <p style={{ color: "var(--error)", fontSize: 12 }}>{error}{lockout ? ` (${lockTimer}s)` : ""}</p>}
                  <button type="submit" className="btn btn-primary btn-full" disabled={loading || !!lockout} style={{ marginTop: 4 }}>
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
                  <Link href="/login" className="btn btn-ghost btn-sm">Forgot password?</Link>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowReg(true)}>New here?</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {showReg && <RegistrationModal onClose={() => setShowReg(false)} />}
    </div>
  );
}
