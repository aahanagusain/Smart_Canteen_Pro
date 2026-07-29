import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Button, Input } from '../components/ui'
import ThemeToggle from '../components/ThemeToggle'

export default function LoginPage() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(true)
  const [fullName, setFullName] = useState('ria')
  const [email, setEmail] = useState('ria@gmail.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value)
    if (error) setError('')
  }

  const handleGoogleLogin = () => {
    const state = Math.random().toString(36).substring(2, 15)
    const redirectUri = `${window.location.origin}/oauth-callback`
    navigate(`/mock-google-login?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!email || !password || (isRegister && !fullName)) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      if (isRegister) {
        // Backend register flow
        const { data } = await api.post('/api/auth/register', { name: fullName, email, password })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      } else {
        // Backend login flow
        const { data } = await api.post('/api/auth/login', { email, password })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || (isRegister ? 'Registration failed' : 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-bg">
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>
      <main className="login-card">
        <div style={{ textAlign: 'left' }}>
          <div className="login-badge">Smart Canteen Pro</div>
          <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p className="subtitle">
            {isRegister
              ? 'Join Smart Canteen Pro and discover great Indian canteens.'
              : 'Sign in to order delicious meals from your canteen.'}
          </p>
        </div>

        <form onSubmit={onSubmit}>
          {isRegister && (
            <div className="form-group">
              <Input
                id="fullName"
                label="Full Name"
                type="text"
                variant="login"
                value={fullName}
                onChange={handleInputChange(setFullName)}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <Input
              id="email"
              label="Email"
              type="email"
              variant="login"
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="name@domain.com"
              required
            />
          </div>

          <div className="form-group">
            <Input
              id="password"
              label="Password"
              type="password"
              variant="login"
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Sign up' : 'Login'}
          </Button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="btn-oauth-google"
          onClick={handleGoogleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '6px' }}>
            <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.57 2.69-3.88 2.69-6.57z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.33-1.58-5.04-3.71H.92v2.3C2.4 15.98 5.48 18 9 18z"/>
            <path fill="#FBBC05" d="M3.96 10.74A5.4 5.4 0 0 1 3.6 9c0-.6.1-1.18.27-1.74V4.96H.92A8.99 8.99 0 0 0 0 9c0 1.48.36 2.87.99 4.1l3.04-2.36z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1C13.43.63 11.4 0 9 0 5.48 0 2.4 2.02.92 4.96l3.04 2.36C4.67 5.16 6.65 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-toggle">
          {isRegister ? (
            <>
              Already have an account?
              <span onClick={() => { setIsRegister(false); setError(''); }}> Login</span>
            </>
          ) : (
            <>
              Don't have an account?
              <span onClick={() => { setIsRegister(true); setError(''); }}> Sign up</span>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
