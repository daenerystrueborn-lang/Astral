import { useLocation } from "wouter";
import { Home, Gem, Trophy, Shield } from "lucide-react";

const ITEMS = [
  { href: "/", Icon: Home, label: "Home" },
  { href: "/premium", Icon: Gem, label: "Premium" },
  { href: "/rankings", Icon: Trophy, label: "Ranks" },
  { href: "/factions", Icon: Shield, label: "Factions" },
];

export default function MobileBottomNav() {
  const [location, navigate] = useLocation();

  function goTo(href: string) {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <nav className="mobile-bottom-nav">
      {ITEMS.map(({ href, Icon, label }) => (
        <button
          key={href}
          className={`mobile-nav-item${location === href ? " active" : ""}`}
          onClick={() => goTo(href)}
        >
          <Icon size={20} strokeWidth={1.75} />
          {label}
        </button>
      ))}
    </nav>
  );
}
