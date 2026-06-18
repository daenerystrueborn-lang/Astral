import { useState } from "react";
import { Gem, Zap, Sun, Star, Shield, Sword, Trophy, Skull, Globe, Layers, Lock, Eye, Users } from "lucide-react";
import eldenBg from "@assets/Elden_Ring_1781751469805.jpg";

const BOT_NUMBER = "923375465038";
function wa(msg: string) {
  window.open(`https://wa.me/${BOT_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

const TIER_NAMES = ["Wanderer","Street Walker","City Dweller","Marked One","Ember","City Guard","Blade Carrier","Vanguard","Heaven Seeker","Ascendant","Angel Touched","Radiant","Fallen Star","City of Angels","Seraph"];
const FREE_R = ["500 ☀","1K ☀","2.5K ☀","5K ☀","10K ☀","15K ☀","25K ☀","40K ☀","60K ☀","80K ☀","100K ☀","150K ☀","200K ☀","250K ☀","500K ☀"];
const PREM_R = ["5 💎","10 💎","15 💎","20 💎","25+Frag","30 💎","40 💎","50 💎","60+Blade","75 💎","100 💎","125+Bow","150 💎","175 💎","250+Title"];

const PREM_PERKS = [
  { Icon: Zap,     t: "Zero cooldowns on all commands" },
  { Icon: Sun,     t: "1.5× XP & Solars per kill" },
  { Icon: Star,    t: "3× daily reward every day" },
  { Icon: Layers,  t: "100 inventory slots (free = 30)" },
  { Icon: Sword,   t: "10 skill slots in battle" },
  { Icon: Trophy,  t: "+5 stat points on level up" },
  { Icon: Skull,   t: "Auto-revive once per day" },
  { Icon: Shield,  t: "Found a Faction (premium only)" },
  { Icon: Globe,   t: "Domain Expansion at Level 65+" },
  { Icon: Eye,     t: "Spy — view any player's full stats" },
  { Icon: Star,    t: "Priority loot at world bosses" },
  { Icon: Lock,    t: "Exclusive premium dungeon access" },
];

const PLUS_PERKS = [
  { Icon: Star,    t: "Everything in Premium" },
  { Icon: Zap,     t: "2× XP & Solars per kill" },
  { Icon: Sun,     t: "5× daily reward" },
  { Icon: Layers,  t: "150 inventory slots" },
  { Icon: Sword,   t: "15 skill slots in battle" },
  { Icon: Trophy,  t: "+10 stat points per level" },
  { Icon: Skull,   t: "2 auto-revives per day" },
];

const PREM_NAIRA = [
  { label: "Weekly",    price: "₦500" },
  { label: "Monthly",   price: "₦1,500" },
  { label: "2-Month",   price: "₦2,500" },
  { label: "Quarterly", price: "₦3,500" },
  { label: "Yearly",    price: "₦10,000" },
];
const PREM_GEMS = [
  { label: "1 hour",  price: "100 💎" },
  { label: "6 hours", price: "500 💎" },
  { label: "12h",     price: "1,000 💎" },
  { label: "1 day",   price: "2,000 💎" },
  { label: "3 days",  price: "6,000 💎" },
  { label: "7 days",  price: "14,000 💎" },
  { label: "14 days", price: "28,000 💎" },
  { label: "30 days", price: "60,000 💎" },
];
const PLUS_P = [
  { label: "Monthly", price: "₦2,000" },
  { label: "Yearly",  price: "₦15,000" },
];

const SOLAR_PACKS = [
  { Icon: Star,  name: "Bronze",  amount: "150,000", price: "₦200" },
  { Icon: Star,  name: "Silver",  amount: "400,000", price: "₦500" },
  { Icon: Sun,   name: "Solar",   amount: "1,000,000", price: "₦1,000" },
  { Icon: Gem,   name: "Diamond", amount: "2,500,000", price: "₦2,000" },
  { Icon: Trophy, name: "Throne", amount: "6,000,000", price: "₦5,000" },
];
const GEM_PACKS = [
  { Icon: Gem, name: "Spark",  amount: "50",    price: "₦150" },
  { Icon: Gem, name: "Flare",  amount: "100",   price: "₦300" },
  { Icon: Gem, name: "Blaze",  amount: "250",   price: "₦650" },
  { Icon: Gem, name: "Nova",   amount: "500",   price: "₦1,000" },
  { Icon: Gem, name: "Cosmic", amount: "1,300", price: "₦2,500" },
];

export default function PremiumPage() {
  const [tab, setTab] = useState<"naira"|"gems">("naira");

  return (
    <div className="page-top">

      {/* Hero */}
      <div style={{ position: "relative", padding: "56px 0 40px", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${eldenBg})`, backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.09 }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(26px, 6vw, 52px)", letterSpacing: "0.08em", marginBottom: 10 }}>ASCEND BEYOND</h1>
          <p style={{ color: "var(--text-grey)", fontStyle: "italic", fontSize: 14, marginBottom: 16 }}>
            Two tiers. Real advantages. No pay-to-win.
          </p>
          <span className="badge badge-gold badge-pill">Season 3 Pass available below</span>
        </div>
      </div>

      {/* Season Pass */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
            <div>
              <h2 className="section-title">Season 3 Pass</h2>
              <p className="section-sub">150 💎 to unlock the premium track</p>
            </div>
            <button className="btn btn-primary" onClick={() => wa("!buy season pass")}>Unlock · 150 💎</button>
          </div>

          <div className="card" style={{ padding: "20px 0" }}>
            <div style={{ padding: "0 20px 12px", display: "flex", gap: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-grey)", letterSpacing: "0.08em" }}>FREE</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.08em" }}>PREMIUM</span>
            </div>
            <div className="pass-track">
              <div className="pass-nodes">
                {TIER_NAMES.map((name, i) => (
                  <div key={name} className="pass-node">
                    <div className={`pass-dot${i < 3 ? " active" : ""}`}>{i + 1}</div>
                    <div className="pass-node-label">{name}</div>
                    <div style={{ fontSize: 9, color: "var(--text-grey)", textAlign: "center", maxWidth: 78, marginTop: 3 }}>{FREE_R[i]}</div>
                    <div className="pass-rewards">{PREM_R[i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-grey)", textAlign: "center", padding: "0 20px", marginTop: 12 }}>
              Purchase unlocks all past tiers retroactively.
            </p>
          </div>
        </div>
      </section>

      {/* Tier Cards */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 24 }}>Choose Your Tier</h2>
          <div className="cards-grid-2" style={{ alignItems: "start" }}>

            {/* PREMIUM */}
            <div className="card card-gold" style={{ height: "100%" }}>
              <h3 style={{ fontSize: 24, letterSpacing: "0.1em", marginBottom: 4, textAlign: "center" }}>PREMIUM</h3>
              <p style={{ color: "var(--text-grey)", fontStyle: "italic", fontSize: 12, marginBottom: 20, textAlign: "center" }}>Zero limits. More grind.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 9 }}>
                {PREM_PERKS.map(({ Icon, t }) => (
                  <li key={t} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text-grey)", alignItems: "flex-start" }}>
                    <Icon size={13} color="var(--gold)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="toggle-group" style={{ marginBottom: 14 }}>
                <button className={`toggle-btn${tab === "naira" ? " active" : ""}`} onClick={() => setTab("naira")}>Naira</button>
                <button className={`toggle-btn${tab === "gems"  ? " active" : ""}`} onClick={() => setTab("gems")}>Gems</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(tab === "naira" ? PREM_NAIRA : PREM_GEMS).map(p => (
                  <button key={p.label} onClick={() => wa(`!buy premium ${p.label} ${p.price}`)}
                    style={{ display: "flex", justifyContent: "space-between", background: "var(--bg-elevated)", borderRadius: 8, padding: "9px 12px", border: "1px solid transparent", cursor: "pointer", width: "100%", transition: "border-color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}>
                    <span style={{ fontSize: 13, color: "var(--text-grey)" }}>{p.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-display)" }}>{p.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PREMIUM PLUS */}
            <div className="card card-gold" style={{ height: "100%", position: "relative" }}>
              <div style={{ position: "absolute", top: 14, right: 14 }}>
                <span className="badge badge-gold badge-pill" style={{ fontSize: 9 }}>MOST VALUE</span>
              </div>
              <h3 style={{ fontSize: 24, letterSpacing: "0.1em", marginBottom: 4, textAlign: "center" }}>PREMIUM+</h3>
              <p style={{ color: "var(--text-grey)", fontStyle: "italic", fontSize: 12, marginBottom: 20, textAlign: "center" }}>Everything doubled.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 9 }}>
                {PLUS_PERKS.map(({ Icon, t }) => (
                  <li key={t} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text-grey)", alignItems: "flex-start" }}>
                    <Icon size={13} color="var(--gold)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PLUS_P.map(p => (
                  <button key={p.label} onClick={() => wa(`!buy premium+ ${p.label} ${p.price}`)}
                    style={{ display: "flex", justifyContent: "space-between", background: "var(--bg-elevated)", borderRadius: 8, padding: "9px 12px", border: "1px solid transparent", cursor: "pointer", width: "100%", transition: "border-color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}>
                    <span style={{ fontSize: 13, color: "var(--text-grey)" }}>{p.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-display)" }}>{p.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-grey)", marginTop: 20 }}>
            DM the admin or bot to purchase. Activates immediately after confirmation.
          </p>
        </div>
      </section>

      {/* Solar Packs — auto-scroll */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ marginBottom: 24 }}>
          <h2 className="section-title">Top Up Solars</h2>
          <p className="section-sub">Hover to pause · Swipe to browse</p>
        </div>
        <div className="marquee-wrap">
          <div className="marquee-inner" style={{ animationDuration: "22s" }}>
            {[...SOLAR_PACKS, ...SOLAR_PACKS].map((p, i) => (
              <div key={i} className="card" style={{ minWidth: 156, textAlign: "center", padding: "20px 14px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,184,48,0.08)", border: "1px solid rgba(255,184,48,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <p.Icon size={20} color="var(--gold)" />
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: "var(--font-num)", fontWeight: 700, fontSize: 20, color: "var(--gold)", marginBottom: 4 }}>{p.amount}</div>
                <div style={{ fontSize: 11, color: "var(--text-grey)", marginBottom: 12 }}>Solars</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-white)", fontFamily: "var(--font-display)", marginBottom: 14 }}>{p.price}</div>
                <button className="btn btn-outline btn-sm btn-full" onClick={() => wa(`!buy solar ${p.name} ${p.price}`)}>Get</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gem Packs */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ marginBottom: 24 }}>
          <h2 className="section-title">Top Up Gems</h2>
        </div>
        <div className="marquee-wrap">
          <div className="marquee-inner" style={{ animationDuration: "18s", animationDirection: "reverse" }}>
            {[...GEM_PACKS, ...GEM_PACKS, ...GEM_PACKS].map((p, i) => (
              <div key={i} className="card" style={{ minWidth: 150, textAlign: "center", padding: "20px 14px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Gem size={20} color="#60a5fa" />
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: "var(--font-num)", fontWeight: 700, fontSize: 20, color: "#60a5fa", marginBottom: 4 }}>{p.amount}</div>
                <div style={{ fontSize: 11, color: "var(--text-grey)", marginBottom: 12 }}>Gems</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-white)", fontFamily: "var(--font-display)", marginBottom: 14 }}>{p.price}</div>
                <button className="btn btn-outline btn-sm btn-full" onClick={() => wa(`!buy gems ${p.name} ${p.price}`)}>Get</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
