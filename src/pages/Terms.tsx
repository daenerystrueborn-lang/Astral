export default function Terms() {
  return (
    <div className="terms-page">

      <div className="card" style={{ padding: "32px 28px" }}>
        <div style={{ marginBottom: "4px" }}>
          <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
            Last updated: May 2025
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", letterSpacing: "0.06em", color: "var(--text)", marginBottom: "10px" }}>
          Terms &amp; Conditions
        </h1>
        <p className="terms-text" style={{ maxWidth: "640px" }}>
          By using Astral of the Sun ("the Bot") or this website, you agree to the following terms.
          Please read them carefully before participating in the game.
        </p>
      </div>

      <div className="card">
        <div className="terms-section">
          <div className="terms-section-title">1. Acceptance of Terms</div>
          <p className="terms-text">
            By registering a character, using any bot command, or accessing this website, you confirm
            that you have read, understood, and agree to be bound by these Terms and Conditions.
            If you do not agree, do not use the Bot or this website.
          </p>
        </div>

        <div className="terms-section">
          <div className="terms-section-title">2. Eligibility</div>
          <p className="terms-text">
            You must be at least 13 years old to use the Bot. By registering, you confirm that you
            meet this age requirement. The Bot is intended for entertainment and community use within
            WhatsApp groups only.
          </p>
        </div>

        <div className="terms-section">
          <div className="terms-section-title">3. Game Rules &amp; Fair Play</div>
          <ul className="terms-list">
            <li>You may only create one account per WhatsApp number. Multi-accounting is prohibited and will result in a ban.</li>
            <li>Using both available bots simultaneously (Nami and Robin) to gain unfair advantages is a bannable offence.</li>
            <li>Exploiting bugs, glitches, or unintended mechanics is prohibited. Report bugs to the owner immediately.</li>
            <li>Attempting to manipulate the economy (gold/gems) through unauthorized methods will result in account suspension.</li>
            <li>Harassing, threatening, or abusing other players via the Bot or related platforms is strictly forbidden.</li>
            <li>The use of automation tools, macros, or bots to send commands is not permitted.</li>
          </ul>
        </div>

        <div className="terms-section">
          <div className="terms-section-title">4. Purchases &amp; Payments</div>
          <p className="terms-text">
            All in-game purchases (Gems, Solars, Premium, Season Pass) are processed manually and are
            non-refundable once credited to your account. Prices are listed in USD on this website.
            Payments must be made to the account details provided by the bot owner.
          </p>
          <ul className="terms-list">
            <li>In-game currency and items have no real-world monetary value and cannot be withdrawn or transferred.</li>
            <li>The owner reserves the right to modify pricing at any time with reasonable notice.</li>
            <li>Chargebacks or fraudulent payment disputes will result in a permanent account ban.</li>
            <li>Season Pass rewards are tied to the active season and expire when the season ends.</li>
          </ul>
        </div>

        <div className="terms-section">
          <div className="terms-section-title">5. Account Suspension &amp; Bans</div>
          <p className="terms-text">
            The owner reserves the right to suspend or permanently ban any account that violates these
            terms, without prior notice and without obligation to refund any purchased items or currency.
            Ban durations vary based on severity. Bans are final unless appealed directly to the owner.
          </p>
        </div>

        <div className="terms-section">
          <div className="terms-section-title">6. Privacy &amp; Data</div>
          <p className="terms-text">
            The Bot stores your WhatsApp number, character name, and gameplay data (stats, inventory,
            progress) in a secure database for the sole purpose of running the game. This data is not
            sold, shared, or used for any purpose outside the Bot. You may request deletion of your
            account data by contacting the owner.
          </p>
        </div>

        <div className="terms-section">
          <div className="terms-section-title">7. AI-Generated Content</div>
          <p className="terms-text">
            The Bot uses AI services (Groq, Gemini, OpenRouter, OpenAI) to generate NPC dialogue and
            dynamic responses. AI responses are entertainment only and do not constitute advice of any kind.
            The owner is not responsible for the content of AI-generated messages.
          </p>
        </div>

        <div className="terms-section">
          <div className="terms-section-title">8. Availability &amp; Changes</div>
          <p className="terms-text">
            The Bot is provided "as is" with no guarantee of uptime or availability. The owner reserves
            the right to modify, suspend, or discontinue the Bot or any feature at any time. These Terms
            may be updated at any time — continued use constitutes acceptance of the updated terms.
          </p>
        </div>

        <div className="terms-section" style={{ marginBottom: 0 }}>
          <div className="terms-section-title">9. Contact</div>
          <p className="terms-text" style={{ marginBottom: 0 }}>
            For questions, disputes, account issues, or payment confirmation, contact the bot owner
            directly on WhatsApp. Discord community support is also available in the official server.
          </p>
        </div>
      </div>

      <div className="card-sm" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "1rem" }}>⚔️</span>
        <span style={{ fontSize: "0.74rem", color: "var(--muted)", lineHeight: "1.6" }}>
          These terms apply to all players of Astral of the Sun. The owner ("The Architect") retains
          full authority over enforcement decisions. By playing, you accept these terms in full.
        </span>
      </div>

    </div>
  );
}
