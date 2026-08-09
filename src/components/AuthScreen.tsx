import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, Waypoints } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import {
  createDemoSession,
  createLocalAccount,
  saveSession,
  signInLocalAccount,
  type AuthSession,
} from '../lib/auth'

type AuthScreenProps = {
  onAuthenticated: (session: AuthSession) => void
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function finish(session: AuthSession) {
    saveSession(session)
    onAuthenticated(session)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (mode === 'register' && name.trim().length < 2) {
      setError('Enter the caregiver name.')
      return
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Use at least 6 characters for the password.')
      return
    }

    setSubmitting(true)
    try {
      const session = mode === 'register'
        ? await createLocalAccount(name, email, password)
        : await signInLocalAccount(email, password)
      finish(session)
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Account access failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-label="About KithRelay">
        <div className="auth-brand"><span><Waypoints size={25} /></span><strong>KithRelay</strong></div>
        <div className="auth-story-copy">
          <p className="section-kicker">Private family care coordination</p>
          <h1>Every care detail,<br />carried forward.</h1>
          <p>Turn scattered appointments, medicine lists, and bills into one source-linked care handoff.</p>
        </div>
        <ul className="auth-trust-list">
          <li><ShieldCheck size={18} /><span><strong>Evidence stays attached</strong><small>Important findings link back to their source file.</small></span></li>
          <li><LockKeyhole size={18} /><span><strong>Caregiver-controlled</strong><small>Nothing is approved until a person reviews it.</small></span></li>
        </ul>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="auth-eyebrow">Caregiver workspace</p>
          <h2>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-intro">{mode === 'signin' ? 'Sign in to continue to your care workspace.' : 'Set up a private prototype account on this browser.'}</p>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button className={mode === 'signin' ? 'active' : ''} type="button" role="tab" aria-selected={mode === 'signin'} onClick={() => { setMode('signin'); setError('') }}>Sign in</button>
            <button className={mode === 'register' ? 'active' : ''} type="button" role="tab" aria-selected={mode === 'register'} onClick={() => { setMode('register'); setError('') }}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && <label>Caregiver name<input type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Sarah Lim" /></label>}
            <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
            <label>Password<span className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="primary-button auth-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}<ArrowRight size={17} /></button>
          </form>

          <div className="auth-divider"><span>or</span></div>
          <button className="secondary-button auth-demo" type="button" onClick={() => finish(createDemoSession())}>Explore the demo instantly</button>
          <p className="auth-local-note"><ShieldCheck size={14} /> Prototype accounts and passwords stay on this browser. Care documents are not uploaded by this website.</p>
        </div>
        <p className="auth-footer">Tencent Cloud Hackathon 2026 &middot; Age Well AI Agent Track</p>
      </section>
    </main>
  )
}
