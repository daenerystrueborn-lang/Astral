import { X, MessageCircle } from "lucide-react";
import { BOT_WA } from "@/lib/api";
import bgImg from "@assets/hero_1781751469798.jpg";

interface Props { onClose: () => void; }

export default function RegistrationModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ backgroundImage: `url(${bgImg})`, backgroundSize: "cover", backgroundPosition: "center top" }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,3,3,0.9)", borderRadius: 20 }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,184,48,0.1)", border: "1px solid rgba(255,184,48,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <MessageCircle size={24} color="var(--gold)" />
          </div>
          <h2 style={{ fontSize: 22, letterSpacing: "0.1em", marginBottom: 10 }}>JOIN THE REALM</h2>
          <p style={{ color: "var(--text-grey)", fontSize: 13, lineHeight: 1.6, marginBottom: 28 }}>
            Message our bot on WhatsApp to create your character. Takes under 2 minutes.
          </p>
          <a href={BOT_WA} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-full btn-lg">
            <MessageCircle size={16} />
            Open WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
