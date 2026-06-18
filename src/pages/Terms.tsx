export default function TermsPage() {
  return (
    <div className="page-top">
      <div className="container" style={{ maxWidth: 720, padding: "60px 16px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(22px, 5vw, 36px)", letterSpacing: "0.08em", marginBottom: 8 }}>TERMS & POLICIES</h1>
          <p style={{ fontSize: 12, color: "var(--text-grey)" }}>Last updated: June 16, 2026</p>
        </div>

        {[
          {
            title: "Terms of Service",
            content: [
              "Astral of the Sun is a WhatsApp-based RPG system. By using this bot and platform, you agree to these terms.",
              "Each WhatsApp number is entitled to one account only. Duplicate accounts will be permanently removed.",
              "Account deletion carries a 30-day cooldown. You may not immediately re-register on the same number.",
              "Exploiting bugs, glitches, or unintended mechanics is strictly prohibited. All exploits will result in a permanent ban.",
              "Players must be 13 years of age or older to participate.",
              "The owner and admins reserve the right to ban, suspend, or wipe any account at their discretion for violations of these terms.",
            ],
          },
          {
            title: "Privacy Policy",
            content: [
              "Astral of the Sun collects the following data: your WhatsApp number, chosen username, and in-game statistics (level, kills, inventory, etc.).",
              "No personal data is ever sold to third parties.",
              "Your data is retained for the duration of your account. Upon account deletion, all associated data is permanently removed within 7 days.",
              "For data-related inquiries, contact the admin via WhatsApp.",
            ],
          },
          {
            title: "Refund Policy",
            content: [
              "All premium purchases (Premium, Premium Plus, Solar Packs, Gem Packs, Season Pass) are final and non-refundable.",
              "DM the admin for disputes in documented cases of bot error or service failure.",
              "Solar and Gem purchases are non-refundable except in cases of a documented bot-side error.",
              "Refund disputes must be raised within 48 hours of purchase.",
            ],
          },
          {
            title: "Rules of Conduct",
            content: [
              "Do not exploit bugs or glitches. Report them to the admin instead — bug reporters may receive in-game rewards.",
              "No abusive, harassing, or discriminatory behavior in any of the WhatsApp groups.",
              "Impersonating the owner, admin, or any bot character is strictly prohibited.",
              "Players who violate these rules face warnings, temporary suspensions, or permanent bans based on severity.",
            ],
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, letterSpacing: "0.06em", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
              {section.title}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {section.content.map((line, i) => (
                <li key={i} style={{ fontSize: 14, color: "var(--text-grey)", lineHeight: 1.7, display: "flex", gap: 10 }}>
                  <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }}>—</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
