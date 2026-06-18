import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { User, Lock, ArrowLeft, Eye, EyeOff, MessageCircle } from "lucide-react";
import RegistrationModal from "@/components/RegistrationModal";
import signinBg from "@assets/126100858315462481_1781751469800.jpg";

type Step = "login" | "forgot" | "code";

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("login");
  const [showReg, setShowReg] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState<number | null>(null);
  const [lockTimer, setLockTimer] = useState(0);

  const [forgotUser, setForgotUser] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [codeExpiry, setCodeExpiry] = useState<number | null>(null);
  const [codeTimer, setCodeTimer] = useState(0);

  useEffect(() => { if (isLoggedIn) navigate("/"); }, [isLoggedIn]);

  useEffect(() => {
    if (!lockout) return;
    const id = setInterval(() => {
      const r = Math.max(0, Math.ceil((lockout - Date.now()) / 1000));
      setLockTimer(r);
      if (r === 0) { setLockout(null); setAttempts(0); }
    }, 1000);
    return () => clearInterval(id);
  }, [lockout]);

  useEffect(() => {
    if (!codeExpiry) return;
    const id = setInterval(() => {
      const r = Math.max(0, Math.ceil((codeExpiry - Date.now()) / 1000));
      setCodeTimer(r);
    }, 1000);
    return () => clearInterval(id);
  }, [codeExpiry]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (lockout) return;
    setLoading(true); setError("");
    try {
      const data = await apiPost("/login", form);
      login(data.token, { username: data.username, name: data.name, pfp: data.pfp, level: data.level });
      navigate(`/profile/${data.username}`);
    } catch {
      const n = attempts + 1; setAttempts(n);
      if (n >= 5) { setLockout(Date.now() + 300000); setError("Too many attempts. Try again in 5 minutes."); }
      else setError("Wrong username or password.");
    } finally { setLoading(false); }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiPost("/forgot-password", { username: forgotUser });
      setCodeExpiry(Date.now() + 900000);
      setStep("code"); setError("");
    } catch (err: any) { setError(err.message || "Username not found."); }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) { setError("Passwords don't match."); return; }
    try {
      await apiPost("/reset-password", { username: forgotUser, code: resetCode, newPassword: newPw });
      setStep("login"); setError("");
    } catch (err: any) { setError(err.message || "Invalid code."); }
  }

  return (
    <div className="page-top" style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: `url(${signinBg})`, backgroundSize: "cover", backgroundPosition: "center 20%", opacity: 0.07, zIndex: 0 }} />

      <div className="modal-card" style={{ maxWidth: 400, position: "relative", zIndex: 1, animation: "scaleIn 0.25s var(--ease)" }}>

        {step === "login" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,184,48,0.08)", border: "1px solid rgba(255,184,48,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <User size={22} color="var(--gold)" />
              </div>
              <h1 style={{ fontSize: 22, letterSpacing: "0.08em", marginBottom: 4 }}>WELCOME BACK</h1>
              <p style={{ fontSize: 12, color: "var(--text-grey)", fontStyle: "italic" }}>Sign in to continue your legend</p>
            </div>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="input-label">Username</label>
                <input className="input" placeholder="YourUsername" value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))} disabled={!!lockout} required />
              </div>
              <div>
                <label className="input-label">Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} className="input" placeholder="••••••••"
                    value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    disabled={!!lockout} required style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-grey)", display: "flex", alignItems: "center" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <p style={{ color: "var(--error)", fontSize: 12 }}>{error}{lockout ? ` (${lockTimer}s)` : ""}</p>}
              <button type="submit" className="btn btn-primary btn-full" disabled={loading || !!lockout} style={{ marginTop: 4 }}>
                <Lock size={14} />
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <div className="divider" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setStep("forgot"); setError(""); }}>Forgot password?</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowReg(true)}>
                <MessageCircle size={13} />
                New to Astral?
              </button>
            </div>
          </>
        )}

        {step === "forgot" && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => { setStep("login"); setError(""); }} style={{ marginBottom: 16, alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={14} /> Back
            </button>
            <h2 style={{ fontSize: 20, letterSpacing: "0.08em", marginBottom: 8 }}>RESET PASSWORD</h2>
            <p style={{ fontSize: 13, color: "var(--text-grey)", marginBottom: 20, lineHeight: 1.6 }}>
              We'll send a 6-digit code to your WhatsApp via the bot. Type the reset command there to receive it.
            </p>
            <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="input-label">Username</label>
                <input className="input" placeholder="YourUsername" value={forgotUser} onChange={e => setForgotUser(e.target.value)} required />
              </div>
              {error && <p style={{ color: "var(--error)", fontSize: 12 }}>{error}</p>}
              <button type="submit" className="btn btn-primary btn-full">Send Reset Code</button>
            </form>
          </>
        )}

        {step === "code" && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => { setStep("forgot"); setError(""); }} style={{ marginBottom: 16, alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={14} /> Back
            </button>
            <h2 style={{ fontSize: 20, letterSpacing: "0.08em", marginBottom: 8 }}>ENTER CODE</h2>
            {codeExpiry && (
              <div style={{ marginBottom: 14, fontSize: 12, color: codeTimer < 60 ? "var(--error)" : "var(--text-grey)" }}>
                Expires in: {Math.floor(codeTimer / 60)}:{String(codeTimer % 60).padStart(2, "0")}
              </div>
            )}
            <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="input-label">6-Digit Code</label>
                <input className="input" placeholder="000000" value={resetCode} onChange={e => setResetCode(e.target.value)} maxLength={6} required />
              </div>
              <div>
                <label className="input-label">New Password</label>
                <input type="password" className="input" placeholder="••••••••" value={newPw} onChange={e => setNewPw(e.target.value)} required />
              </div>
              <div>
                <label className="input-label">Confirm Password</label>
                <input type="password" className="input" placeholder="••••••••" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
              </div>
              {error && <p style={{ color: "var(--error)", fontSize: 12 }}>{error}</p>}
              <button type="submit" className="btn btn-primary btn-full">Reset Password</button>
            </form>
          </>
        )}
      </div>
      {showReg && <RegistrationModal onClose={() => setShowReg(false)} />}
    </div>
  );
}
