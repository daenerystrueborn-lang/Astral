import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { apiPost } from '@/lib/api'

type View = 'login' | 'signup' | 'forgot-username' | 'forgot-code'

export default function AuthModal() {
  const { modalMode, closeModal, login, signup, loading } = useAuth()

  const [view,       setView]       = useState<View>('login')
  const [username,   setUsername]   = useState('')
  const [password,   setPassword]   = useState('')
  const [error,      setError]      = useState('')
  const [checking,   setChecking]   = useState(false)

  const [forgotUser,    setForgotUser]    = useState('')
  const [forgotCode,    setForgotCode]    = useState('')
  const [forgotNewPw,   setForgotNewPw]   = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')

  if (!modalMode) return null

  const effectiveView: View = modalMode === 'signup' && view === 'login' ? 'signup' : view

  const reset = () => {
    setError('')
    setForgotSuccess('')
    setUsername('')
    setPassword('')
    setForgotUser('')
    setForgotCode('')
    setForgotNewPw('')
  }

  const handleClose = () => { reset(); setView('login'); closeModal() }

  const goLogin = () => { reset(); setView('login') }

  const handleSubmit = async () => {
    setError('')
    setChecking(true)
    const isLogin = effectiveView === 'login'
    const fn      = isLogin ? login : signup
    const res     = await fn(username, password)
    setChecking(false)
    if (res.ok) {
      handleClose()
    } else {
      setError(res.error || 'Something went wrong.')
    }
  }

  const handleForgotRequest = async () => {
    if (!forgotUser.trim()) { setError('Enter your username.'); return }
    setError('')
    setChecking(true)
    try {
      await apiPost('/forgot-password', { username: forgotUser.trim() })
      setView('forgot-code')
    } catch (e: any) {
      setError(e.message || 'Username not found.')
    } finally { setChecking(false) }
  }

  const handleForgotReset = async () => {
    if (!forgotCode.trim() || !forgotNewPw) { setError('Fill in all fields.'); return }
    if (forgotNewPw.length < 6) { setError('Password must be at least 6 characters.'); return }
    setError('')
    setChecking(true)
    try {
      await apiPost('/reset-password', { username: forgotUser.trim(), code: forgotCode.trim(), newPassword: forgotNewPw })
      setForgotSuccess('Password reset! You can now log in with your new password.')
      setView('login')
      reset()
    } catch (e: any) {
      setError(e.message || 'Invalid or expired code.')
    } finally { setChecking(false) }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text)', fontFamily: 'var(--font)',
    fontSize: '0.88rem', padding: '10px 12px', outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.08em',
    textTransform: 'uppercase', display: 'block', marginBottom: '5px',
  }
  const linkBtn: React.CSSProperties = {
    background: 'none', border: 'none', color: 'var(--accent-light)', cursor: 'pointer',
    fontFamily: 'var(--font)', fontSize: '0.7rem', textDecoration: 'underline', padding: 0,
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999,
               display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div style={{ background: 'var(--nav)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    padding: '32px 28px', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── LOGIN ── */}
        {effectiveView === 'login' && (
          <>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text)' }}>
              Log In
            </div>

            {forgotSuccess && (
              <div style={{ fontSize: '0.74rem', color: '#55ff99', background: 'rgba(85,255,153,0.08)', border: '1px solid rgba(85,255,153,0.2)', borderRadius: '6px', padding: '8px 10px' }}>
                {forgotSuccess}
              </div>
            )}

            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: '1.5' }}>
              Enter the username and password you set when you registered via the bot.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  placeholder="e.g. WarriorKing99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <div style={{ fontSize: '0.74rem', color: '#ff5555', background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.2)', borderRadius: '6px', padding: '8px 10px' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={checking || loading}
              style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#fff',
                       fontFamily: 'var(--font)', fontSize: '0.78rem', letterSpacing: '0.1em',
                       textTransform: 'uppercase', padding: '11px', cursor: 'pointer', fontWeight: 600,
                       opacity: (checking || loading) ? 0.6 : 1 }}
            >
              {checking ? 'Checking…' : 'Log In'}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <button style={linkBtn} onClick={() => { reset(); setView('forgot-username') }}>
                Forgot password?
              </button>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                No account?{' '}
                <button style={linkBtn} onClick={() => window.open('https://wa.me/923375465038?text=!register', '_blank')}>
                  Register via WhatsApp
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── SIGNUP (redirects to WA) ── */}
        {effectiveView === 'signup' && (
          <>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text)' }}>
              Create Account
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: '1.7' }}>
              Accounts are created through the WhatsApp bot.<br /><br />
              1. Open WhatsApp and send <strong style={{ color: 'var(--text)' }}>!register</strong> to the bot in DM.<br />
              2. Follow the setup steps — you'll choose a username and password.<br />
              3. Come back here and log in with those credentials.
            </div>
            <button
              onClick={() => window.open('https://wa.me/923375465038?text=!register', '_blank')}
              style={{ background: '#25d366', border: 'none', borderRadius: '8px', color: '#fff',
                       fontFamily: 'var(--font)', fontSize: '0.78rem', letterSpacing: '0.08em',
                       textTransform: 'uppercase', padding: '11px', cursor: 'pointer', fontWeight: 600 }}
            >
              Open WhatsApp to Register
            </button>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center' }}>
              Already registered?{' '}
              <button style={linkBtn} onClick={goLogin}>Log in</button>
            </div>
          </>
        )}

        {/* ── FORGOT — STEP 1: enter username ── */}
        {effectiveView === 'forgot-username' && (
          <>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text)' }}>
              Reset Password
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              Enter your username. Then type <strong style={{ color: 'var(--text)' }}>!resetportal</strong> in a DM with the bot — it will send you a 6-digit code on WhatsApp.
            </div>
            <div>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                placeholder="e.g. WarriorKing99"
                value={forgotUser}
                onChange={(e) => setForgotUser(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleForgotRequest()}
                style={inputStyle}
              />
            </div>
            {error && (
              <div style={{ fontSize: '0.74rem', color: '#ff5555', background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.2)', borderRadius: '6px', padding: '8px 10px' }}>
                {error}
              </div>
            )}
            <button
              onClick={handleForgotRequest}
              disabled={checking}
              style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#fff',
                       fontFamily: 'var(--font)', fontSize: '0.78rem', letterSpacing: '0.1em',
                       textTransform: 'uppercase', padding: '11px', cursor: 'pointer', fontWeight: 600,
                       opacity: checking ? 0.6 : 1 }}
            >
              {checking ? 'Checking…' : 'Send Reset Code'}
            </button>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center' }}>
              <button style={linkBtn} onClick={goLogin}>← Back to Login</button>
            </div>
          </>
        )}

        {/* ── FORGOT — STEP 2: enter code + new password ── */}
        {effectiveView === 'forgot-code' && (
          <>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text)' }}>
              Enter Code
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              Type <strong style={{ color: 'var(--text)' }}>!resetportal</strong> in a DM with the bot on WhatsApp. You'll receive a 6-digit code. Enter it below along with your new password.{' '}
              <em>Codes expire in 15 minutes.</em>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={labelStyle}>6-Digit Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={forgotCode}
                  maxLength={6}
                  onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={forgotNewPw}
                  onChange={(e) => setForgotNewPw(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleForgotReset()}
                  style={inputStyle}
                />
              </div>
            </div>
            {error && (
              <div style={{ fontSize: '0.74rem', color: '#ff5555', background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.2)', borderRadius: '6px', padding: '8px 10px' }}>
                {error}
              </div>
            )}
            <button
              onClick={handleForgotReset}
              disabled={checking}
              style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#fff',
                       fontFamily: 'var(--font)', fontSize: '0.78rem', letterSpacing: '0.1em',
                       textTransform: 'uppercase', padding: '11px', cursor: 'pointer', fontWeight: 600,
                       opacity: checking ? 0.6 : 1 }}
            >
              {checking ? 'Resetting…' : 'Reset Password'}
            </button>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center' }}>
              <button style={linkBtn} onClick={() => { reset(); setView('forgot-username') }}>← Back</button>
              {' · '}
              <button style={linkBtn} onClick={goLogin}>Back to Login</button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
