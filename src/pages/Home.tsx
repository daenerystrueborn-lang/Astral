import { useState, useEffect } from "react";
const heroImg = "/hero-banner.jpg";
const deathNoteImg = "/death-note-banner.jpg";

const SLIDES = [
  { img: heroImg,       season: "SEASON TWO", preTitle: "Asta",  accent: "Sword",  postTitle: "Out in Spin!" },
  { img: deathNoteImg,  season: "SEASON TWO", preTitle: "Death", accent: "Note",   postTitle: "Out in Spin!" },
];

const TICKER_ITEMS = [
  "Season 2 Now Live", "100+ Dungeon Floors", "142 Bot Commands", "AI-Powered NPCs",
  "Ranked PvP Seasons", "WhatsApp RPG", "2 Active Bots", "Guilds & Empires",
  "Legendary Weapons", "Custom Titles", "Gacha Summons", "World Boss Events",
];

const COMMANDS = [
  { icon: "⚔️", name: "!register",  desc: "Create your character",         cat: "Core" },
  { icon: "🏰", name: "!dungeon",   desc: "Battle through 100 floors",     cat: "Combat" },
  { icon: "🗡️", name: "!hunt",      desc: "Hunt monsters for XP & loot",  cat: "Combat" },
  { icon: "📊", name: "!profile",   desc: "View your stats & gear",        cat: "Core" },
  { icon: "🛒", name: "!shop",      desc: "Buy weapons & potions",         cat: "Economy" },
  { icon: "⚡", name: "!pvp",       desc: "Challenge another player",      cat: "Combat" },
  { icon: "🎁", name: "!daily",     desc: "Claim daily gold & gems",       cat: "Core" },
  { icon: "✨", name: "!skills",    desc: "Equip your skill slots",        cat: "Build" },
  { icon: "🏛️", name: "!guild",     desc: "Create or join a guild",        cat: "Social" },
  { icon: "🏦", name: "!bank",      desc: "Loans, deposits & interest",    cat: "Economy" },
  { icon: "🎒", name: "!inventory", desc: "Manage your items",             cat: "Core" },
  { icon: "📜", name: "!quests",    desc: "Track active quests",           cat: "Core" },
  { icon: "🐉", name: "!boss",      desc: "Fight the world boss",          cat: "Combat" },
  { icon: "🃏", name: "!summon",    desc: "Spend gems to pull cards",      cat: "Gacha" },
  { icon: "🗺️", name: "!explore",   desc: "Discover hidden world events",  cat: "World" },
  { icon: "💰", name: "!work",      desc: "Earn steady profession income", cat: "Economy" },
];

const FEATURES = [
  { icon: "⚔️", title: "Full RPG Combat",    desc: "Turn-based battles with skills, criticals, and status effects. Solo dungeons, party raids, and PvP." },
  { icon: "🌍", title: "Open World",          desc: "Explore regions, trigger random events, and face invasions, plagues, and treasure surges." },
  { icon: "🏰", title: "Guilds & Empires",   desc: "Found a guild, build your empire, and claim territory. Empire groups link to WhatsApp communities." },
  { icon: "🤖", title: "AI-Powered NPCs",    desc: "Characters respond dynamically with Groq, Gemini, and OpenAI powering intelligent dialogue." },
  { icon: "🃏", title: "Cards & Gacha",      desc: "Summon legendary characters, collect rare cards, and build powerful deck combinations." },
  { icon: "🏆", title: "Ranked Seasons",     desc: "Compete in ranked dungeons and PvP ladders. Earn exclusive titles and season pass rewards." },
];

function HeroSlider() {
  const [current, setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (next: number) => {
    if (animating || next === current) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(next); setAnimating(false); }, 600);
  };

  useEffect(() => {
    const id = setInterval(() => goTo((current + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, [current, animating]);

  const slide = SLIDES[current];

  return (
    <div className="hero">
      {SLIDES.map((s, i) => (
        <img key={i} src={s.img} alt="" className={`hero-img hero-slide-img${i === current ? " hero-slide-active" : ""}${animating && i === current ? " hero-slide-exit" : ""}`} />
      ))}
      <div className="hero-overlay" />
      <div className={`hero-content${animating ? " hero-content-exit" : ""}`}>
        <div className="hero-season">{slide.season}</div>
        <h1 className="hero-title">
          {slide.preTitle} <span>{slide.accent}</span><br />{slide.postTitle}
        </h1>
        <div className="hero-btns">
          <a
            href="https://wa.me/2347062301848?text=Hi!%20I%20want%20to%20join%20Astral%20of%20the%20Sun%20RPG%20bot."
            target="_blank" rel="noopener noreferrer"
            className="btn-primary hero-btn"
            style={{ textDecoration: "none" }}
          >Join Now</a>
          <a
            href="#commands"
            className="btn-outline hero-btn"
            style={{ textDecoration: "none" }}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("commands")?.scrollIntoView({ behavior: "smooth" })
            }}
          >View Commands</a>
        </div>
      </div>
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`hero-dot${i === current ? " active" : ""}`}
            onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-strip">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-dot" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      <HeroSlider />
      <Ticker />

      <div className="stat-bar">
        <div className="stat-item"><div className="stat-value">100+</div><div className="stat-label">Dungeon Floors</div></div>
        <div className="stat-item"><div className="stat-value">142</div><div className="stat-label">Commands</div></div>
        <div className="stat-item"><div className="stat-value">2</div><div className="stat-label">Active Bots</div></div>
        <div className="stat-item"><div className="stat-value">S2</div><div className="stat-label">Current Season</div></div>
      </div>

      {/* Bot Commands */}
      <div className="card" id="commands">
        <div className="section-title">Bot Commands</div>
        <div className="commands-grid">
          {COMMANDS.map((cmd) => (
            <div key={cmd.name} className="cmd-card">
              <div className="cmd-cat">{cmd.cat}</div>
              <div className="cmd-name">{cmd.name}</div>
              <div className="cmd-desc">{cmd.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="section-title">About the Bot</div>
        <div className="section-heading">What is Astral of the Sun?</div>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: "1.7", marginBottom: "20px", letterSpacing: "0.02em" }}>
          Astral of the Sun is a fully-featured WhatsApp RPG bot — a living, breathing game world inside your group chats.
          Level up, craft gear, battle bosses, run dungeons with your party, build empires, and compete in ranked seasons.
          Season 2 brings new classes, legendary weapons, and the Asta ability arc.
        </p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting started */}
      <div className="card">
        <div className="section-title">Getting Started</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            ["1", "Add the bot to your WhatsApp group", "Ask the admin to add the Astral bot number to your group."],
            ["2", "Register your character",            "Send !register in the group chat to create your RPG character."],
            ["3", "Start your adventure",               "Use !help to see all commands and begin your journey."],
          ].map(([n, title, desc]) => (
            <div key={n} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{n}</div>
              <div>
                <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
