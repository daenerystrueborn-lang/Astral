import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function AuthModal() {
  const { modalMode, closeModal, login, signup, loading } = useAuth()
  const [waNumber, setWaNumber]     = useState('')
  const [password, setPassword]     = useState('')
  const [error,    setError]        = useState('')
  const [checking, setChecking]     = useState(false)

  if (!modalMode) return null

  const isLogin  = modalMode === 'login'
  const title    = isLogin ? 'Log In' : 'Sign Up'
  const btnLabel = isLogin ? 'Log In' : 'Create Account'

  const handleSubmit = async () => {
    setError('')
    setChecking(true)
    const fn   = isLogin ? login : signup
    const res  = await fn(waNumber, password)
    setChecking(false)
    if (res.ok) {
      closeModal()
      setWaNumber('')
      setPassword('')
    } else {
      setError(res.error || 'Something went wrong.')
    }
  }

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:9999,
               display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
    >
      <div style={{ background:'var(--nav)', border:'1px solid var(--border)', borderRadius:'var(--radius)',
                    padding:'32px 28px', width:'100%', maxWidth:'380px', display:'flex', flexDirection:'column', gap:'16px' }}>

        <div style={{ fontFamily:'var(--font-heading)', fontSize:'1.1rem', letterSpacing:'0.12em',
                      textTransform:'uppercase', color:'var(--text)' }}>
          {title}
        </div>

        <div style={{ fontSize:'0.72rem', color:'var(--muted)', lineHeight:'1.5' }}>
          {isLogin
            ? 'Enter your WhatsApp number and site password.'
            : 'Sign up with your WhatsApp number. You must already have a character registered in the bot (!register).'}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          <div>
            <label style={{ fontSize:'0.68rem', color:'var(--muted)', letterSpacing:'0.08em',
                             textTransform:'uppercase', display:'block', marginBottom:'5px' }}>
              WhatsApp Number
            </label>
            <input
              type="tel"
              placeholder="e.g. 2347062301848"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border)',
                       borderRadius:'8px', color:'var(--text)', fontFamily:'var(--font)',
                       fontSize:'0.88rem', padding:'10px 12px', outline:'none', boxSizing:'border-box' }}
            />
            <div style={{ fontSize:'0.62rem', color:'var(--muted)', marginTop:'3px' }}>
              Digits only, no spaces or dashes. Include country code.
            </div>
          </div>

          <div>
            <label style={{ fontSize:'0.68rem', color:'var(--muted)', letterSpacing:'0.08em',
                             textTransform:'uppercase', display:'block', marginBottom:'5px' }}>
              Site Password
            </label>
            <input
              type="password"
              placeholder={isLogin ? 'Your site password' : 'Create a password (min 6 chars)'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ width:'100%', background:'var(--bg)', border:'1px solid var(--border)',
                       borderRadius:'8px', color:'var(--text)', fontFamily:'var(--font)',
                       fontSize:'0.88rem', padding:'10px 12px', outline:'none', boxSizing:'border-box' }}
            />
          </div>
        </div>

        {error && (
          <div style={{ fontSize:'0.74rem', color:'#ff5555', background:'rgba(255,85,85,0.08)',
                        border:'1px solid rgba(255,85,85,0.2)', borderRadius:'6px', padding:'8px 10px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={checking || loading}
          style={{ background:'var(--accent)', border:'none', borderRadius:'8px', color:'#fff',
                   fontFamily:'var(--font)', fontSize:'0.78rem', letterSpacing:'0.1em',
                   textTransform:'uppercase', padding:'11px', cursor:'pointer', fontWeight:600,
                   opacity: (checking || loading) ? 0.6 : 1 }}
        >
          {checking ? 'Checking…' : btnLabel}
        </button>

        <div style={{ fontSize:'0.7rem', color:'var(--muted)', textAlign:'center' }}>
          {isLogin ? "Don't have an account? " : 'Already signed up? '}
          <button
            onClick={() => {
              setError('')
              // toggle handled by parent — just close and reopen
              closeModal()
              setTimeout(() => {
                // use auth openModal
              }, 50)
            }}
            style={{ background:'none', border:'none', color:'var(--accent-light)', cursor:'pointer',
                     fontFamily:'var(--font)', fontSize:'0.7rem', textDecoration:'underline' }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

      </div>
    </div>
  )
}
