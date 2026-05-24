const bannerImg = "/season2-banner.jpg";
const astaBannerImg = "/asta-banner.jpg";

const CHANGES = [
  { tag: "New Content", name: "Asta Ability Arc", desc: "Unlock Asta's devil union abilities, Anti-Magic sword skills, and the Black Asta awakening at max level.", live: true },
  { tag: "New Content", name: "Legendary Weapons S2", desc: "5 new legendary weapons added — Demon-Slayer Sword, Demon-Dweller Sword, and 3 more hidden unlocks.", live: true },
  { tag: "System", name: "Ranked Dungeon Season Reset", desc: "All ranked dungeon ratings have reset. New season, new glory. Climb the leaderboards from scratch.", live: true },
  { tag: "System", name: "Season Pass — Track II", desc: "Complete season challenges to unlock exclusive cosmetics, titles, and the Season 2 banner frame.", live: true },
  { tag: "Upcoming", name: "World Ruin Events", desc: "Large-scale world events that affect all players. Defend your kingdom from the Midnight Sun invasion.", live: false },
  { tag: "Upcoming", name: "Yuno Banner Arc", desc: "Yuno's Star Magic and Wind Spirit integration banner — coming mid-season.", live: false },
];

const REWARDS = [
  { tier: "FREE", label: "Tier 1–10",  reward: "Daily XP Boost + 200 Gold",      icon: "gift" },
  { tier: "FREE", label: "Tier 11–20", reward: "Rare Item Box + 5 Gems",         icon: "box" },
  { tier: "FREE", label: "Tier 21–30", reward: "Epic Skill Shard + 500 Gold",    icon: "sparkle" },
  { tier: "PASS", label: "Tier 1–10",  reward: "Season II Banner Frame",          icon: "frame" },
  { tier: "PASS", label: "Tier 11–20", reward: "Exclusive Title: Shadow Knight", icon: "tag" },
  { tier: "PASS", label: "Tier 21–30", reward: "Legendary Weapon Chest",         icon: "chest" },
];

const SCHEDULE = [
  { label: "Season Start",     date: "May 2025",  icon: "start" },
  { label: "Mid-Season Patch", date: "June 2025", icon: "patch" },
  { label: "World Boss Event", date: "Late June", icon: "boss" },
  { label: "Season End",       date: "July 2025", icon: "end" },
];

function IconStart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function IconPatch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a6 6 0 01-7.7 7.7l-6.3 6.3a2.12 2.12 0 01-3-3l6.3-6.3a6 6 0 017.7-7.7l-3 3z"/>
    </svg>
  );
}
function IconBoss() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c-5.52 0-10 4.48-10 10 0 2.4.85 4.6 2.25 6.32L6 20h12l1.75-1.68A9.95 9.95 0 0022 12C22 6.48 17.52 2 12 2z"/>
      <path d="M9 11h.01M15 11h.01M8 15s1.5 2 4 2 4-2 4-2"/>
    </svg>
  );
}
function IconEnd() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H2V5h4M18 9h4V5h-4M2 5h20"/>
      <path d="M6 9c0 3.31 2.69 6 6 6s6-2.69 6-6"/>
      <path d="M12 15v4M8 19h8"/>
    </svg>
  );
}

function ScheduleIcon({ icon }: { icon: string }) {
  if (icon === "start") return <IconStart />;
  if (icon === "patch") return <IconPatch />;
  if (icon === "boss")  return <IconBoss />;
  return <IconEnd />;
}

function IconGift() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,12 20,22 4,22 4,12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
    </svg>
  );
}
function IconBox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}
function IconSparkle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  );
}
function IconFrame() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <rect x="7" y="7" width="10" height="10" rx="1"/>
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <circle cx="7" cy="7" r="1" fill="currentColor"/>
    </svg>
  );
}
function IconChest() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M2 11h20"/>
      <path d="M10 11v4M14 11v4"/>
      <path d="M6 7V5a6 6 0 0112 0v2"/>
    </svg>
  );
}

function RewardIcon({ icon }: { icon: string }) {
  if (icon === "gift")    return <IconGift />;
  if (icon === "box")     return <IconBox />;
  if (icon === "sparkle") return <IconSparkle />;
  if (icon === "frame")   return <IconFrame />;
  if (icon === "tag")     return <IconTag />;
  return <IconChest />;
}

export default function Season() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      <div className="season-hero">
        <img src={bannerImg} alt="Season 2" className="season-hero-img" />
        <div className="season-hero-overlay" />
        <div className="season-announce">
          <div className="season-announce-pill">Now Live</div>
          <div className="season-announce-num">2</div>
          <h1 className="season-announce-title">Season Two</h1>
          <p className="season-announce-desc">
            The Black Asta arc has begun. New abilities, new weapons, new rankings —
            the strongest will rise.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Season 2 Changes</div>
        <div className="timeline">
          {CHANGES.map((c, i) => (
            <div key={i} className="timeline-item">
              <div className={`timeline-dot${c.live ? "" : " upcoming"}`} />
              <div className="timeline-tag">{c.tag} {c.live ? "· Live" : "· Coming Soon"}</div>
              <div className="timeline-name">{c.name}</div>
              <div className="timeline-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: "var(--radius)", overflow: "hidden", maxHeight: "240px" }}>
        <img src={astaBannerImg} alt="Asta Season 2" style={{ width: "100%", height: "240px", objectFit: "cover", objectPosition: "center top", display: "block" }} />
      </div>

      {/* Season Pass Rewards */}
      <div className="card">
        <div className="section-title">Season Pass Rewards</div>
        <div className="rewards-grid">
          {REWARDS.map((r, i) => (
            <div key={i} className="reward-row">
              <div className={`reward-icon-wrap${r.tier === "PASS" ? " pass" : ""}`}>
                <RewardIcon icon={r.icon} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "3px" }}>
                  <span className={`reward-tier${r.tier === "PASS" ? " pass" : ""}`}>{r.tier}</span>
                  <span style={{ fontSize: "0.66rem", color: "var(--muted)" }}>{r.label}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text)" }}>{r.reward}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Season Schedule — 2 rows × 2 cols */}
      <div className="card">
        <div className="section-title">Season Schedule</div>
        <div className="schedule-grid">
          {SCHEDULE.map((s) => (
            <div key={s.label} className="schedule-card">
              <div className="schedule-icon">
                <ScheduleIcon icon={s.icon} />
              </div>
              <div className="schedule-date">{s.date}</div>
              <div className="schedule-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
