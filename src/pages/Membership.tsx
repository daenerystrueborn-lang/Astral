const WA = "2347062301848"
function waLink(msg: string) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
}

const GEM_PACKAGES = [
  { id: "spark",   name: "Spark",   emoji: "✨", gems: 50,   price: "₦150",   color: "#aaa" },
  { id: "flare",   name: "Flare",   emoji: "💫", gems: 100,  price: "₦300",   color: "#c9a227" },
  { id: "blaze",   name: "Blaze",   emoji: "🔥", gems: 250,  price: "₦650",   color: "#e06020" },
  { id: "nova",    name: "Nova",    emoji: "🌟", gems: 500,  price: "₦1,000", color: "#5588ff" },
  { id: "cosmic",  name: "Cosmic",  emoji: "🌌", gems: 1300, price: "₦2,500", color: "#aa55ff" },
];

const GOLD_PACKAGES = [
  { id: "copper",    name: "Copper",    solars: "100K",  price: "₦500",   color: "#b07040" },
  { id: "iron",      name: "Iron",      solars: "220K",  price: "₦1,000", color: "#888" },
  { id: "steel",     name: "Steel",     solars: "380K",  price: "₦1,500", color: "#99aacc" },
  { id: "crown",     name: "Crown",     solars: "600K",  price: "₦2,000", color: "#c9a227" },
  { id: "throne",    name: "Throne",    solars: "900K",  price: "₦3,000", color: "#dd8833" },
  { id: "legendary", name: "Legendary", solars: "2M",    price: "₦5,000", color: "#aa55ff" },
];

/* Premium first so it's the most visible on all viewports */
const PLANS = [
  {
    name: "Premium",
    price: "₦1,000",
    period: "/month",
    featured: true,
    badge: "Most Popular",
    perks: [
      "Everything in Free",
      "5× XP multiplier",
      "Priority boss queue",
      "Exclusive Premium skills",
      "Daily gem bonus",
      "Custom profile frame",
      "Premium-only dungeon floors",
      "Early access to new content",
    ],
  },
  {
    name: "Free",
    price: "$0",
    period: "",
    featured: false,
    perks: [
      "All base RPG commands",
      "Daily rewards",
      "Dungeon access",
      "Guild membership",
      "500 starting gold",
      "10 starting gems",
    ],
  },
  {
    name: "Season Pass",
    price: "₦2,500",
    period: "/season",
    featured: false,
    perks: [
      "Everything in Premium",
      "Full season reward track",
      "Exclusive S2 title: Shadow Knight",
      "Legendary Weapon Chest",
      "Season Banner Frame",
      "Season leaderboard bonus",
    ],
  },
];

function SvgStar() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  );
}
function SvgSword() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M5.5 10.5l2 2M8 8l2 2"/>
    </svg>
  );
}
function SvgTrophy() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,9 2,9 2,5 6,5"/>
      <polyline points="18,9 22,9 22,5 18,5"/>
      <path d="M2 5h20"/>
      <path d="M6 5a6 6 0 0012 0"/>
      <path d="M12 17v4M8 21h8"/>
    </svg>
  );
}
function SvgGem() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 22,9 18,21 6,21 2,9"/>
      <polyline points="2,9 12,14 22,9"/>
      <line x1="12" y1="14" x2="12" y2="21"/>
    </svg>
  );
}
function SvgCoin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v10M9 9.5c0-1.38 1.34-2.5 3-2.5s3 1.12 3 2.5c0 1.5-1.5 2-3 2.5S9 13 9 14.5c0 1.38 1.34 2.5 3 2.5s3-1.12 3-2.5"/>
    </svg>
  );
}

function PlanIcon({ name }: { name: string }) {
  if (name === "Premium")     return <SvgStar />;
  if (name === "Season Pass") return <SvgTrophy />;
  return <SvgSword />;
}

export default function Membership() {
  return (
    <div className="membership-page">

      {/* Header */}
      <div style={{ position: "relative", borderRadius: "var(--radius)", overflow: "hidden", minHeight: "260px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
        <img src="/membership-bg.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.35) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "40px 28px" }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "10px" }}>Membership</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 6vw, 3rem)", letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", marginBottom: "12px", lineHeight: 1 }}>
            Power Up Your Journey
          </h1>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", maxWidth: "460px", margin: "0 auto", lineHeight: "1.7" }}>
            Go Premium or grab the Season Pass to unlock exclusive skills, bonus rewards, and priority access — all inside WhatsApp.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div>
        <div className="section-title">Plans</div>
        <div className="plans-grid">
          {PLANS.map((p) => (
            <div key={p.name} className={`plan-card${p.featured ? " featured" : ""}`}>
              {p.badge && <div className="plan-badge">{p.badge}</div>}
              <div className="plan-icon">
                <PlanIcon name={p.name} />
              </div>
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">
                {p.price !== "$0" && <span className="plan-price-currency">$</span>}
                <span className="plan-price-val">{p.price.replace("$", "")}</span>
                {p.period && <span className="plan-price-period">{p.period}</span>}
              </div>
              <div className="plan-divider" />
              <div className="plan-perks">
                {p.perks.map((perk) => (
                  <div key={perk} className="plan-perk">
                    <span className="plan-perk-check">✓</span>
                    {perk}
                  </div>
                ))}
              </div>
              {p.name === "Free" ? (
                <div className="plan-btn">Current Plan</div>
              ) : (
                <a
                  href={waLink(`Hi! I want to get the ${p.name} plan (${p.price}${p.period}) for Astral of the Sun bot.`)}
                  target="_blank" rel="noopener noreferrer"
                  className={`plan-btn${p.featured ? " featured" : ""}`}
                  style={{ textDecoration: "none", display: "block", textAlign: "center" }}
                >
                  Get {p.name}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gem packages */}
      <div>
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <SvgGem /> Gem Packages
        </div>
        <div className="gem-grid">
          {GEM_PACKAGES.map((g) => (
            <div key={g.id} className="gem-card">
              <div className="gem-icon-wrap" style={{ color: g.color }}>
                <SvgGem />
              </div>
              <div className="gem-name">{g.name}</div>
              <div className="gem-amount">{g.gems} Gems</div>
              <div className="gem-price">{g.price}</div>
              <a
                href={waLink(`Hi! I want to buy the ${g.name} gem package — ${g.gems} Gems for ${g.price} on Astral of the Sun.`)}
                target="_blank" rel="noopener noreferrer"
                className="gem-btn"
                style={{ textDecoration: "none", display: "block", textAlign: "center" }}
              >Buy</a>
            </div>
          ))}
        </div>
      </div>

      {/* Gold packages */}
      <div>
        <div className="section-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <SvgCoin /> Solar (Gold) Packages
        </div>
        <div className="gold-grid">
          {GOLD_PACKAGES.map((g) => (
            <div key={g.id} className="gold-card">
              <div className="gold-icon-wrap" style={{ color: g.color }}>
                <SvgCoin />
              </div>
              <div className="gold-name">{g.name}</div>
              <div className="gold-amount">{g.solars} Solars</div>
              <div className="gold-price">{g.price}</div>
              <a
                href={waLink(`Hi! I want to buy the ${g.name} Solar package — ${g.solars} Solars for ${g.price} on Astral of the Sun.`)}
                target="_blank" rel="noopener noreferrer"
                className="gold-btn"
                style={{ textDecoration: "none", display: "block", textAlign: "center" }}
              >Buy</a>
            </div>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="card-sm" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        <div>
          <div style={{ fontSize: "0.78rem", color: "var(--text)", marginBottom: "4px", letterSpacing: "0.03em" }}>Payment & Activation</div>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: "1.6" }}>
            All purchases are processed manually. Transfer to <strong style={{color:"var(--text)"}}>Flora · Moniepoint · 5197434428</strong>, then tap any Buy button or contact the bot owner on WhatsApp to confirm. Gems and Solars are credited within 24 hours.
          </div>
        </div>
      </div>

    </div>
  );
}
