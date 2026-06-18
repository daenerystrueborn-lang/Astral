import { Link } from "wouter";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <span className="footer-logo">ASTRAL</span>
          <nav className="footer-nav">
            <Link href="/">Home</Link>
            <Link href="/premium">Premium</Link>
            <Link href="/rankings">Rankings</Link>
            <Link href="/factions">Factions</Link>
            <Link href="/terms">Terms</Link>
          </nav>
          <span className="footer-copy">© 2026 Astral of the Sun</span>
        </div>
      </div>
    </footer>
  );
}
