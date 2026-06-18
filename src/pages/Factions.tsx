import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, Users, Sword, Loader2 } from "lucide-react";
import goldBg from "@assets/5348093303816873_1781751469801.jpg";
import { apiFetch } from "@/lib/api";

interface Faction {
  id: number;
  guildId: string;
  name: string;
  level: number;
  members: number;
  max: number;
  wins: number;
  losses: number;
  vault: number;
  topMember: string | null;
}

const TIERS = [
  { level: 1, label: "Founded",    desc: "20 members max",              cost: null },
  { level: 2, label: "Shop",       desc: "30 members · Faction store",  cost: "10,000 ☀" },
  { level: 3, label: "Rift",       desc: "40 members · Faction rift",   cost: "25,000 ☀" },
  { level: 4, label: "Buffs",      desc: "45 members · Buff system",    cost: "60,000 ☀" },
  { level: 5, label: "Boss Spawn", desc: "50 members · Boss + Title",   cost: "150,000 ☀" },
];

function score(f: Faction) {
  return f.wins * 1000 + f.level * 200 + f.members * 10 + Math.floor(f.vault / 1000);
}

export default function FactionsPage() {
  const [, navigate] = useLocation();
  const [factions, setFactions] = useState<Faction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    apiFetch("/factions")
      .then((data: { factions: Faction[] }) => setFactions(data.factions ?? []))
      .catch(() => setError("Failed to load factions. Make sure the API server is running."))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...factions].sort((a, b) => score(b) - score(a));
  const podiumOrder = sorted.length >= 3 ? [sorted[1], sorted[0], sorted[2]] : sorted.slice(0, 3);

  return (
    <div className="page-top">

      {/* Hero */}
      <div style={{ position: "relative", padding: "48px 0 32px", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${goldBg})`, backgroundSize: "cover", backgroundPosition: "center 20%", opacity: 0.09 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="section-title" style={{ fontSize: "clamp(28px, 7vw, 52px)" }}>Factions</h1>
          <p className="section-sub">Season 3 · Alliance rankings</p>
        </div>
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0", gap: 12, color: "var(--text-grey)" }}>
          <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 13 }}>Loading factions…</span>
        </div>
      )}

      {!loading && error && (
        <div className="container" style={{ paddingTop: 48, textAlign: "center" }}>
          <p style={{ color: "var(--error)", fontSize: 13 }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Podium */}
          {podiumOrder.length >= 3 && (
            <section className="section">
              <div className="container">
                <h2 className="section-title" style={{ marginBottom: 24, fontSize: 18 }}>Top Factions</h2>
                <div className="podium-container">
                  {podiumOrder.map(f => {
                    const rank = sorted.indexOf(f) + 1;
                    return (
                      <div key={f.id} className={`podium-card podium-${rank}`}>
                        <div className="podium-rank">{rank}</div>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,184,48,0.08)", border: "1px solid rgba(255,184,48,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "8px auto 12px" }}>
                          <Shield size={24} color="var(--gold)" />
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--gold)", marginBottom: 8, letterSpacing: "0.05em" }}>{f.name}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginBottom: 8 }}>
                          <span className="badge badge-pill" style={{ fontSize: 10 }}>LVL {f.level}/5</span>
                          <span className="badge badge-pill" style={{ fontSize: 10 }}>{f.members}/{f.max}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-grey)" }}>{f.wins}W / {f.losses}L</div>
                        <div style={{ fontSize: 11, color: "rgba(255,184,48,0.4)", marginTop: 6 }}>{score(f).toLocaleString()} pts</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* List */}
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <h2 className="section-title" style={{ marginBottom: 18, fontSize: 18 }}>All Factions</h2>
              {sorted.length === 0 && (
                <p style={{ color: "var(--text-grey)", textAlign: "center", padding: "32px 0", fontSize: 13 }}>No factions found.</p>
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {sorted.map((f, i) => (
                  <div key={f.id} className="lb-row">
                    <span className="lb-rank">{i + 1}</span>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,184,48,0.06)", border: "1px solid rgba(255,184,48,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Shield size={16} color="var(--gold)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-grey)", marginTop: 2, display: "flex", gap: 10 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Sword size={10} />{f.wins}W/{f.losses}L</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={10} />{f.members}/{f.max}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span className="badge badge-pill" style={{ fontSize: 9 }}>LVL {f.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Progression */}
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container" style={{ marginBottom: 24 }}>
              <h2 className="section-title">What Your Faction Builds Toward</h2>
              <p className="section-sub">5 upgrade tiers · Hover to pause</p>
            </div>
            <div className="marquee-wrap">
              <div className="marquee-inner" style={{ animationDuration: "20s" }}>
                {[...TIERS, ...TIERS, ...TIERS].map((t, i) => (
                  <div key={i} className="card" style={{ minWidth: 180, textAlign: "center", padding: "24px 16px" }}>
                    <div style={{ fontFamily: "var(--font-num)", fontWeight: 700, fontSize: 40, color: "var(--gold)", lineHeight: 1, marginBottom: 8 }}>{t.level}</div>
                    <h3 style={{ fontSize: 16, letterSpacing: "0.07em", marginBottom: 6 }}>{t.label}</h3>
                    <p style={{ fontSize: 12, color: "var(--text-grey)", marginBottom: t.cost ? 12 : 0, lineHeight: 1.4 }}>{t.desc}</p>
                    {t.cost && (
                      <div style={{ fontSize: 11, color: "rgba(255,184,48,0.6)", borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 4 }}>
                        {t.cost}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="container" style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: "var(--text-grey)" }}>
                Only Premium players can found a faction · Founding cost: <span className="text-gold">100,000,000 ☀</span>
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
