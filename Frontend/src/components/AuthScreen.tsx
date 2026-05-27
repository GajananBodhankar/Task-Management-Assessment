import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'signup'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const AuthScreen = () => {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (mode === 'signup' && name.trim().length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }

    if (!emailPattern.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    try {
      setSubmitting(true)
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(name, email, password)
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="brand-mark">TF</div>
        <h1>TaskFlow</h1>
        <p>Plan work, track progress, and keep every task accountable.</p>
        <div className="feature-list">
          {['JWT authentication', 'Search and filters', 'Responsive workspace'].map((item) => (
            <span key={item}>
              <CheckCircle2 size={18} />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="auth-card" aria-label="Authentication form">
        <div className="auth-card-header">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p>{mode === 'login' ? 'Sign in to continue managing your tasks.' : 'Start tracking your work in a cleaner workspace.'}</p>
        </div>

        <div className="mode-switch" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Signup
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <label>
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Asha Sharma"
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              type="email"
            />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              type="password"
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" disabled={submitting} type="submit">
            {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}
