import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../lib/api'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    const provider = searchParams.get('provider') || 'google'

    if (!code) {
      setError('OAuth authorization code is missing. Please try logging in again.')
      return
    }

    const performOAuthLogin = async () => {
      try {
        let authData = {}
        
        // If it's our simulated mock code, decode user info from the code parameter
        if (code.startsWith('mock_code_')) {
          const base64Info = code.replace('mock_code_', '')
          try {
            const decodedJson = atob(base64Info)
            authData = JSON.parse(decodedJson)
          } catch (e) {
            console.error('Failed to parse mock code', e)
          }
        }

        // Call the backend endpoint to handle the OAuth signup / login
        const { data } = await api.post('/api/auth/oauth-login', {
          provider,
          code,
          email: authData.email,
          name: authData.name
        })

        // Save token and user details in localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Redirect to homepage
        navigate('/')
      } catch (err) {
        console.error('OAuth callback login exchange failed:', err)
        setError(err.response?.data?.message || 'Authentication failed. Please try again.')
      }
    }

    performOAuthLogin()
  }, [searchParams, navigate])

  return (
    <div className="google-oauth-bg">
      <div className="google-oauth-card" style={{ textAlign: 'center', padding: '48px 36px' }}>
        {error ? (
          <div className="oauth-error-container">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="#c92c2c" style={{ marginBottom: '16px' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h2 style={{ fontSize: '20px', marginBottom: '12px', color: 'inherit' }}>Authentication Error</h2>
            <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '24px' }}>{error}</p>
            <button 
              onClick={() => navigate('/login')} 
              className="google-btn-primary"
              style={{ padding: '8px 24px' }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="google-loading-container">
            <div className="google-spinner"></div>
            <h3 style={{ marginTop: '24px', fontSize: '20px', fontWeight: 400, color: 'inherit' }}>Authenticating</h3>
            <p style={{ color: '#5f6368', fontSize: '14px' }}>Completing login with Smart Canteen Pro...</p>
          </div>
        )}
      </div>
    </div>
  )
}
