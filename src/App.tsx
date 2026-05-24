import { useState, useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Season from "@/pages/Season";
import Membership from "@/pages/Membership";
import Terms from "@/pages/Terms";
import AuthModal from "@/components/AuthModal";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const queryClient = new QueryClient();

const DISCORD_URL = "https://discord.gg/1499621014055686314";
const WHATSAPP_URL = "https://wa.me/2347062301848";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
  { to: "/season", label: "Season", badge: true },
  { to: "/membership", label: "Membership" },
];

function SiteIcon({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/astral-icon.png"
      alt="Astral of the Sun"
      width={size}
      height={size}
      style={{ borderRadius: "50%", objectFit: "cover", display: "block", flexShrink: 0 }}
    />
  );
}

function Nav() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout, openModal } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="nav-bar" ref={menuRef}>
      <div className="nav-inner">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
          <SiteIcon size={28} />
          <div className="nav-brand">
            <span className="nav-brand-main">Astral</span>
            <span className="nav-brand-sub">of the sun</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="nav-links nav-links-desktop">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} href={l.to} className={`nav-link${location === l.to ? " active" : ""}`}>
              {l.badge && <span className="nav-season-badge">2</span>}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="nav-auth-desktop">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>@{user.username}</span>
              <button className="nav-auth-btn nav-auth-btn-outline" onClick={logout}>Log out</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "6px" }}>
              <button className="nav-auth-btn nav-auth-btn-outline" onClick={() => openModal("login")}>Log In</button>
              <button className="nav-auth-btn nav-auth-btn-primary" onClick={() => openModal("signup")}>Sign Up</button>
            </div>
          )}
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        <div className="nav-mobile-inner">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} href={l.to} className={`nav-mobile-link${location === l.to ? " active" : ""}`}>
              {l.badge && <span className="nav-mobile-badge">S2</span>}
              {l.label}
            </Link>
          ))}
          <div className="nav-mobile-divider" />
          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--muted)", padding: "0 4px" }}>Signed in as @{user.username}</span>
              <button className="nav-mobile-link" style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", color: "var(--accent-light)" }} onClick={() => { logout(); setMenuOpen(false); }}>
                Log out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="nav-auth-btn nav-auth-btn-outline" style={{ flex: 1 }} onClick={() => { openModal("login"); setMenuOpen(false); }}>Log In</button>
              <button className="nav-auth-btn nav-auth-btn-primary" style={{ flex: 1 }} onClick={() => { openModal("signup"); setMenuOpen(false); }}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.079.114 18.1.129 18.115a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-identity">
            <SiteIcon size={40} />
            <div>
              <div className="footer-brand-wrap">
                <span className="footer-brand-main">Astral</span>
                <span className="footer-brand-sub">of the sun</span>
              </div>
              <div className="footer-tagline">Season 2 — Now Live on WhatsApp</div>
            </div>
          </div>
          <div className="footer-socials">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
              <WaIcon /> WhatsApp
            </a>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
              <DiscordIcon /> Discord
            </a>
          </div>
        </div>
        <div className="footer-divider" />
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 YatoRPG · Astral of the Sun. All rights reserved.</span>
          <Link href="/terms" className="footer-legal-link">Terms &amp; Conditions</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-legal-link">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "4rem", color: "var(--muted)", marginBottom: "8px" }}>404</div>
        <p style={{ fontSize: "0.82rem", marginBottom: "16px", color: "var(--muted)" }}>Page not found.</p>
        <Link href="/" style={{ color: "var(--accent-light)", fontSize: "0.8rem", fontWeight: 600 }}>← Go home</Link>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/season" component={Season} />
      <Route path="/membership" component={Membership} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInner() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <div className="site-wrapper">
        <Nav />
        <main className="site-main">
          <Router />
        </main>
        <Footer />
      </div>
      <AuthModal />
      <Toaster />
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
