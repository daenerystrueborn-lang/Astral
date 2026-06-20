import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Trophy, Sword, Skull, Globe, Star, Search, Loader2 } from "lucide-react";
import heroBg from "@assets/hero_1781751469798.jpg";
import { apiFetch } from "@/lib/api";

interface RankPlayer {
  rank: number;
  username: string | null;
  name: string;
  title: string;
  level: number;
  faction: string | null;
  tier: string;
  kills: number;
  deaths: number;
  pvp: number;
  boss: number;
  dun: number;
}

function Avatar({ size = 40 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none" stroke="var(--text-grey)" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  );
}

export default function RankingsPage() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<RankPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    apiFetch("/rankings")
      .then((data: any) => {
        setPlayers(data.players ?? []);
      })
      .catch(() => setError("Failed to load rankings. Make sure the API server is running."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const podiumOrder = players.length >= 3 ? [players[1], players[0], players[2]] : players.slice(0, 3);

  function goToProfile(p: RankPlayer) {
    if (p.username) navigate(`/profile/${p.username}`);
  }

  return (
    <div className="page-top">
      {/* Hero */}
      <div style={{ position: "relative", padding: "48px 0 32px", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center 10%", opacity: 0.08, filter: "sepia(0.7) hue-rotate(10deg) saturate(1.5)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="section-title" style={{ fontSize: "clamp(28px, 7vw, 52px)" }}>Rankings</h1>
          <p className="section-sub">Season 3 — Devoured Heaven</p>
        </div>
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0", gap: 12, color: "var(--text-grey)" }}>
          <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 13 }}>Loading rankings…</span>
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
                <h2 className="section-title" style={{ marginBottom: 24, fontSize: 18 }}>Top Challengers</h2>
                <div className="podium-container">
                  {podiumOrder.map(p => (
                    <div
                      key={p.rank}
                      className={`podium-card podium-${p.rank}`}
                      onClick={() => goToProfile(p)}
                      style={{ cursor: p.username ? "pointer" : "default" }}
                    >
                      <div className="podium-rank">{p.rank}</div>
                      <Avatar size={72} />
                      <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "var(--font-display)", letterSpacing: "0.04em", marginTop: 8, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div style={{ fontStyle: "italic", color: "var(--gold)", fontSize: 11, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
                        <span className="badge badge-pill" style={{ fontSize: 10 }}>LVL {p.level}</span>
                        {p.faction && <span className="badge badge-gold badge-pill" style={{ fontSize: 10 }}>{p.faction}</span>}
                      </div>
                      <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,184,48,0.5)" }}>{p.tier}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Full Leaderboard */}
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="container">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <h2 className="section-title" style={{ fontSize: 18 }}>Full Leaderboard</h2>
                <div className="search-bar">
                  <Search size={14} className="search-icon" />
                  <input className="input" placeholder="Search players…" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 13 }} />
                </div>
              </div>
              {filtered.length === 0 && (
                <p style={{ color: "var(--text-grey)", textAlign: "center", padding: "32px 0", fontSize: 13 }}>No players found.</p>
              )}
              {filtered.map(p => (
                <div
                  key={p.rank}
                  className={`lb-row lb-row-${p.rank <= 3 ? p.rank : ""}`}
                  onClick={() => goToProfile(p)}
                  style={{ cursor: p.username ? "pointer" : "default" }}
                >
                  <span className="lb-rank">{p.rank}</span>
                  <Avatar size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)", letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-grey)", fontStyle: "italic" }}>{p.title}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-num)" }}>LVL {p.level}</div>
                    {p.faction && <span className="badge badge-pill" style={{ fontSize: 9, marginTop: 3, display: "inline-block" }}>{p.faction}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
