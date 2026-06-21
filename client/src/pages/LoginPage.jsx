import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Button, Input } from '../components/ui'

export default function LoginPage() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(true) // Defaults to sign-up to match the first screenshot
  const [fullName, setFullName] = useState('user1')
  const [email, setEmail] = useState('abc@gmail.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('Registration failed') // Set initial error as shown in screenshot, clear on edit
  const [loading, setLoading] = useState(false)

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value)
    if (error) setError('')
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
        // Mock register flow
        await new Promise((resolve) => setTimeout(resolve, 800))
        // Auto log in as Tanisha (or the custom name, defaulting to Tanisha for the greeting)
        const nameToSave = fullName.toLowerCase() === 'user1' ? 'Tanisha' : fullName
        localStorage.setItem('token', 'week1-mock-register-token')
        localStorage.setItem(
          'user',
          JSON.stringify({ id: 'u-mocked', name: nameToSave, email })
        )
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
