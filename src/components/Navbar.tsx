import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Home, Gem, Trophy, Shield,
  ChevronDown, Menu, X, User, LogOut
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/premium", label: "Premium", Icon: Gem },
  { href: "/rankings", label: "Rankings", Icon: Trophy },
  { href: "/factions", label: "Factions", Icon: Shield },
];

export default function Navbar() {
  const { isLoggedIn, player, logout } = useAuth();
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [location]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">ASTRAL</Link>

          <ul className="navbar-links">
            {NAV_LINKS.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link href={href} className={location === href ? "active" : ""}>
                  <Icon size={13} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-right">
            {isLoggedIn && player ? (
              <div className="player-menu" ref={dropRef}>
                <button className="player-trigger" onClick={() => setDropdownOpen(v => !v)}>
                  <div className="player-avatar">
                    {player.pfp
                      ? <img src={player.pfp} alt={player.name} />
                      : <User size={14} color="var(--text-grey)" />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-white)", fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
                    {player.name}
                  </span>
                  <ChevronDown size={12} color="var(--text-grey)" style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {dropdownOpen && (
                  <div className="player-dropdown">
                    <Link href={`/profile/${player.username}`}>
                      <User size={13} />
                      Profile
                    </Link>
                    <div className="divider-drop" />
                    <button onClick={() => { logout(); setDropdownOpen(false); }}>
                      <LogOut size={13} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn btn-outline btn-sm">Sign In</Link>
            )}

            <button className="hamburger" onClick={() => setDrawerOpen(true)} aria-label="Menu">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}

      <div className={`drawer ${drawerOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="navbar-logo" style={{ fontSize: 18 }}>ASTRAL</span>
          <button className="modal-close" onClick={() => setDrawerOpen(false)} style={{ position: "static" }}>
            <X size={14} />
          </button>
        </div>

        <ul className="drawer-nav">
          {NAV_LINKS.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} className={location === href ? "active" : ""}>
                <Icon size={15} />
                {label}
              </Link>
            </li>
          ))}
          <div className="divider" style={{ margin: "8px 0" }} />
          {isLoggedIn && player ? (
            <>
              <li>
                <Link href={`/profile/${player.username}`}>
                  <User size={15} />
                  My Profile
                </Link>
              </li>
              <li>
                <a href="#" onClick={e => { e.preventDefault(); logout(); }}>
                  <LogOut size={15} />
                  Sign Out
                </a>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">
                <User size={15} />
                Sign In
              </Link>
            </li>
          )}
          <li>
            <Link href="/terms">
              <Shield size={15} />
              Terms
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
