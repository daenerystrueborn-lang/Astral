import { Link } from "wouter";
import heroBg from "@assets/hero_1781751469798.jpg";

export default function NotFoundPage() {
  return (
    <div className="page-top" style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08, zIndex: 0 }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 24px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(80px, 20vw, 160px)", color: "var(--border)", lineHeight: 1, marginBottom: 8, userSelect: "none" }}>
          404
        </div>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 36px)", letterSpacing: "0.1em", marginBottom: 12 }}>YOU WANDERED TOO FAR</h1>
        <p style={{ color: "var(--text-grey)", fontSize: 15, marginBottom: 32, fontStyle: "italic", maxWidth: 440, margin: "0 auto 32px" }}>
          This page doesn't exist in any known realm. Not even the Void Expanse goes this deep.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">Return Home</Link>
      </div>
    </div>
  );
}
